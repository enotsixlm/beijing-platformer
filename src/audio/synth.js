/**
 * Low-level WebAudio synthesis helpers shared by sfx/music/engine.
 * Every helper schedules nodes at an absolute context time `t` and cleans up
 * after itself (oscillators/sources are stopped, so the graph never leaks).
 */

export const noteToFreq = (midi) => 440 * Math.pow(2, (midi - 69) / 12)

const NOTE_INDEX = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 }

/** 'c4' → 60, 'f#3' → 54, 'bb2' → 46. */
export function noteToMidi(name) {
  const m = /^([a-g])([#b]?)(-?\d)$/.exec(name.toLowerCase())
  if (!m) throw new Error(`bad note ${name}`)
  let n = NOTE_INDEX[m[1]]
  if (m[2] === '#') n += 1
  else if (m[2] === 'b') n -= 1
  return 12 * (parseInt(m[3], 10) + 1) + n
}

/**
 * Parse a whitespace-separated step string into an array of midi numbers / null.
 * '.' = rest, note names as above, numbers are taken as midi directly.
 * e.g. steps('c5 . e5 . g5 . . .')
 */
export function steps(str) {
  return str
    .trim()
    .split(/\s+/)
    .map((tok) => (tok === '.' ? null : /^\d+$/.test(tok) ? parseInt(tok, 10) : noteToMidi(tok)))
}

const noiseBuffers = new WeakMap()

/** 2 s cached white-noise buffer per context. */
export function noiseBuffer(ctx) {
  let buf = noiseBuffers.get(ctx)
  if (buf) return buf
  const len = Math.floor(ctx.sampleRate * 2)
  buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  noiseBuffers.set(ctx, buf)
  return buf
}

const EPS = 0.0002

/** Percussive envelope: quick attack then exponential decay to silence. */
export function envPluck(param, t, peak, attack, decay) {
  param.cancelScheduledValues(t)
  param.setValueAtTime(EPS, t)
  param.linearRampToValueAtTime(Math.max(peak, EPS), t + attack)
  param.exponentialRampToValueAtTime(EPS, t + attack + decay)
  return t + attack + decay
}

/** Sustained envelope: attack → hold at `peak` for `hold` → linear release. */
export function envHold(param, t, peak, attack, hold, release) {
  param.cancelScheduledValues(t)
  param.setValueAtTime(EPS, t)
  param.linearRampToValueAtTime(Math.max(peak, EPS), t + attack)
  param.setValueAtTime(Math.max(peak, EPS), t + attack + hold)
  param.linearRampToValueAtTime(0, t + attack + hold + release)
  return t + attack + hold + release
}

function makeFilter(ctx, spec, t, end) {
  const f = ctx.createBiquadFilter()
  f.type = spec.type || 'lowpass'
  f.Q.value = spec.Q ?? 1
  f.frequency.setValueAtTime(spec.freq, t)
  if (spec.freqEnd != null) f.frequency.exponentialRampToValueAtTime(Math.max(20, spec.freqEnd), end)
  return f
}

/**
 * One-shot oscillator voice.
 * @param {AudioContext} ctx
 * @param {AudioNode} dest
 * @param {object} o
 *   type, freq, freqEnd (exp sweep across sweepDur ?? dur), t, dur, gain, a (attack), r (release),
 *   pluck (bool: exponential decay instead of hold/release), detune (cents), filter {type,freq,freqEnd,Q}
 */
export function tone(ctx, dest, o) {
  const t = o.t ?? ctx.currentTime
  const dur = o.dur ?? 0.2
  const a = o.a ?? 0.005
  const r = o.r ?? 0.05
  const osc = ctx.createOscillator()
  osc.type = o.type || 'sine'
  osc.frequency.setValueAtTime(Math.max(1, o.freq), t)
  if (o.freqEnd != null) osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.freqEnd), t + (o.sweepDur ?? dur))
  if (o.detune) osc.detune.value = o.detune
  const g = ctx.createGain()
  let end
  if (o.pluck) end = envPluck(g.gain, t, o.gain ?? 0.3, a, dur)
  else end = envHold(g.gain, t, o.gain ?? 0.3, a, Math.max(0, dur - a), r)
  let head = osc
  if (o.filter) {
    const f = makeFilter(ctx, o.filter, t, end)
    head.connect(f)
    head = f
  }
  head.connect(g)
  g.connect(dest)
  osc.start(t)
  osc.stop(end + 0.02)
  osc.onended = () => {
    osc.disconnect()
    g.disconnect()
  }
  return { osc, gain: g, end }
}

/**
 * One-shot filtered noise burst.
 * o: t, dur, gain, a, r, pluck, filter {type,freq,freqEnd,Q}, rate (playbackRate)
 */
export function noise(ctx, dest, o) {
  const t = o.t ?? ctx.currentTime
  const dur = o.dur ?? 0.2
  const a = o.a ?? 0.003
  const r = o.r ?? 0.05
  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer(ctx)
  src.loop = true
  if (o.rate) src.playbackRate.value = o.rate
  const g = ctx.createGain()
  let end
  if (o.pluck !== false) end = envPluck(g.gain, t, o.gain ?? 0.3, a, dur)
  else end = envHold(g.gain, t, o.gain ?? 0.3, a, Math.max(0, dur - a), r)
  let head = src
  if (o.filter) {
    const f = makeFilter(ctx, o.filter, t, end)
    head.connect(f)
    head = f
  }
  head.connect(g)
  g.connect(dest)
  src.start(t, Math.random() * 1.5)
  src.stop(end + 0.02)
  src.onended = () => {
    src.disconnect()
    g.disconnect()
  }
  return { src, gain: g, end }
}

/** Gain + StereoPanner pair in front of `dest`. Returns the input node. */
export function panGain(ctx, dest, gain = 1, pan = 0) {
  const g = ctx.createGain()
  g.gain.value = gain
  if (typeof ctx.createStereoPanner === 'function' && pan !== 0) {
    const p = ctx.createStereoPanner()
    p.pan.value = Math.max(-1, Math.min(1, pan))
    g.connect(p)
    p.connect(dest)
  } else {
    g.connect(dest)
  }
  return g
}

/** Detach a transient chain after `when` seconds (context time). */
export function scheduleDisconnect(ctx, node, when) {
  const ms = Math.max(0, (when - ctx.currentTime) * 1000 + 50)
  setTimeout(() => {
    try {
      node.disconnect()
    } catch (_) {
      /* already gone */
    }
  }, ms)
}
