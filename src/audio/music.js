/**
 * Procedural step sequencer (16th notes) with lookahead scheduling, plus the
 * song data for 'menu' | 'race' | 'final' | 'results' and the star-power loop.
 *
 * Song = { bpm, steps, parts: [{ inst, pattern, vel?, len?, drum?, gain? }] }
 *  - pattern: array indexed by step (loops with modulo). Entries are midi numbers,
 *    arrays of midi numbers (chords) or null. For drum parts entries are velocities.
 *  - len: note length in steps (default 1).
 */
import { tone, noise, noteToFreq, steps } from './synth.js'

const LOOKAHEAD = 0.25 // seconds of audio scheduled ahead
const TICK_MS = 50

// ───────────────────────────── instruments ─────────────────────────────

const INSTRUMENTS = {
  kick(ctx, dest, t, _note, vel) {
    tone(ctx, dest, { type: 'sine', freq: 165, freqEnd: 42, sweepDur: 0.09, t, dur: 0.27, gain: 0.95 * vel, pluck: true })
    noise(ctx, dest, { t, dur: 0.02, gain: 0.3 * vel, filter: { type: 'lowpass', freq: 3500 } })
  },
  snare(ctx, dest, t, _note, vel) {
    noise(ctx, dest, { t, dur: 0.16, gain: 0.38 * vel, filter: { type: 'bandpass', freq: 1900, Q: 0.7 } })
    tone(ctx, dest, { type: 'triangle', freq: 200, freqEnd: 120, sweepDur: 0.05, t, dur: 0.1, gain: 0.3 * vel, pluck: true })
  },
  hat(ctx, dest, t, _note, vel) {
    noise(ctx, dest, { t, dur: 0.045, gain: 0.16 * vel, filter: { type: 'highpass', freq: 7500 } })
  },
  ohat(ctx, dest, t, _note, vel) {
    noise(ctx, dest, { t, dur: 0.17, gain: 0.13 * vel, filter: { type: 'highpass', freq: 6500 } })
  },
  rim(ctx, dest, t, _note, vel) {
    tone(ctx, dest, { type: 'square', freq: 1700, t, dur: 0.02, gain: 0.08 * vel, pluck: true })
    noise(ctx, dest, { t, dur: 0.03, gain: 0.12 * vel, filter: { type: 'highpass', freq: 4000 } })
  },
  bass(ctx, dest, t, note, vel, len) {
    const f = noteToFreq(note)
    tone(ctx, dest, { type: 'sawtooth', freq: f, t, dur: len * 0.9, gain: 0.3 * vel, a: 0.004, pluck: true, filter: { type: 'lowpass', freq: 900, freqEnd: 260, Q: 3 } })
    tone(ctx, dest, { type: 'square', freq: f, t, dur: len * 0.9, gain: 0.12 * vel, a: 0.004, pluck: true, filter: { type: 'lowpass', freq: 500 } })
    tone(ctx, dest, { type: 'sine', freq: f * 0.5, t, dur: len * 0.9, gain: 0.18 * vel, a: 0.004, pluck: true })
  },
  softbass(ctx, dest, t, note, vel, len) {
    const f = noteToFreq(note)
    tone(ctx, dest, { type: 'triangle', freq: f, t, dur: len * 0.9, gain: 0.4 * vel, a: 0.01, r: 0.1, filter: { type: 'lowpass', freq: 700 } })
    tone(ctx, dest, { type: 'sine', freq: f * 0.5, t, dur: len * 0.9, gain: 0.15 * vel, a: 0.01, r: 0.1 })
  },
  lead(ctx, dest, t, note, vel, len) {
    const f = noteToFreq(note)
    tone(ctx, dest, { type: 'square', freq: f, t, dur: len * 0.85, gain: 0.11 * vel, a: 0.006, r: 0.05, filter: { type: 'lowpass', freq: 3800, Q: 0.8 } })
    tone(ctx, dest, { type: 'square', freq: f, detune: 7, t, dur: len * 0.85, gain: 0.07 * vel, a: 0.006, r: 0.05, filter: { type: 'lowpass', freq: 3000 } })
    tone(ctx, dest, { type: 'sine', freq: f, t, dur: len * 0.85, gain: 0.1 * vel, a: 0.006, r: 0.06 })
  },
  softlead(ctx, dest, t, note, vel, len) {
    const f = noteToFreq(note)
    tone(ctx, dest, { type: 'triangle', freq: f, t, dur: len * 0.9, gain: 0.26 * vel, a: 0.02, r: 0.12 })
    tone(ctx, dest, { type: 'sine', freq: f * 2, t, dur: len * 0.9, gain: 0.05 * vel, a: 0.02, r: 0.12 })
  },
  arp(ctx, dest, t, note, vel, len) {
    const f = noteToFreq(note)
    tone(ctx, dest, { type: 'square', freq: f, t, dur: len * 1.4, gain: 0.075 * vel, a: 0.003, pluck: true, filter: { type: 'lowpass', freq: 4200, freqEnd: 1400, Q: 1.2 } })
  },
  pad(ctx, dest, t, notes, vel, len) {
    const arr = Array.isArray(notes) ? notes : [notes]
    for (const n of arr) {
      const f = noteToFreq(n)
      tone(ctx, dest, { type: 'triangle', freq: f, t, dur: len, gain: 0.075 * vel, a: 0.04, r: 0.18, filter: { type: 'lowpass', freq: 1800 } })
      tone(ctx, dest, { type: 'sawtooth', freq: f, detune: -5, t, dur: len, gain: 0.02 * vel, a: 0.05, r: 0.18, filter: { type: 'lowpass', freq: 900 } })
    }
  },
  stab(ctx, dest, t, notes, vel, len) {
    const arr = Array.isArray(notes) ? notes : [notes]
    for (const n of arr) {
      tone(ctx, dest, { type: 'square', freq: noteToFreq(n), t, dur: len * 0.8, gain: 0.05 * vel, a: 0.004, pluck: true, filter: { type: 'lowpass', freq: 2600, freqEnd: 700 } })
    }
  },
}

// ───────────────────────────── pattern helpers ─────────────────────────────

/** 'X.x.' → [1, null, 0.6, null] (drum velocities). */
export function hits(str) {
  return str
    .replace(/\s+/g, '')
    .split('')
    .map((c) => (c === 'X' ? 1 : c === 'x' ? 0.6 : c === 'o' ? 0.35 : null))
}

const rest = (n) => new Array(n).fill(null)

/** Repeat `bar` (array) for each root offset in `roots`, adding the offset to every note. */
function perBar(roots, barFn) {
  const out = []
  for (const r of roots) out.push(...barFn(r))
  return out
}

/** Place `value` at `positions` within a 16-step bar. */
function bar16(values) {
  const b = rest(16)
  for (const [pos, v] of values) b[pos] = v
  return b
}

function transpose(pattern, semis) {
  if (!semis) return pattern
  return pattern.map((v) => (v == null ? null : Array.isArray(v) ? v.map((n) => n + semis) : v + semis))
}

// ───────────────────────────── songs ─────────────────────────────

/** Upbeat 120 BPM, C major, I–V–vi–IV. */
function menuSong() {
  const roots = [36, 43, 45, 41] // C2 G2 A2 F2
  const bass = perBar(roots, (r) => bar16([[0, r], [2, r + 12], [4, r], [6, r + 7], [8, r], [10, r + 12], [12, r + 7], [14, r + 12]]))
  const chords = [[60, 64, 67], [59, 62, 67], [60, 64, 69], [60, 65, 69]]
  const pad = perBar(chords, (c) => bar16([[0, c]]))
  const stab = perBar(chords, (c) => bar16([[6, c], [14, c]]))
  const melody = steps(
    'e5 . g5 . a5 . g5 . e5 . . . d5 . c5 . ' +
      'd5 . . . g5 . d5 . b4 . . . d5 . e5 . ' +
      'c5 . e5 . a5 . e5 . c5 . . . a4 . c5 . ' +
      'd5 . . . c5 . a4 . f5 . . . e5 . d5 .'
  )
  return {
    bpm: 120,
    steps: 64,
    parts: [
      { inst: 'kick', drum: true, pattern: hits('X.......X..x....') },
      { inst: 'snare', drum: true, pattern: hits('....X.......X...') },
      { inst: 'hat', drum: true, pattern: hits('X.x.X.x.X.x.X.x.'), vel: 0.8 },
      { inst: 'ohat', drum: true, pattern: hits('..............x.'), vel: 0.7 },
      { inst: 'bass', pattern: bass, vel: 0.9, len: 2 },
      { inst: 'pad', pattern: pad, vel: 0.7, len: 14 },
      { inst: 'stab', pattern: stab, vel: 0.8, len: 1 },
      { inst: 'lead', pattern: melody, vel: 0.85, len: 2 },
    ],
  }
}

/** Energetic 150 BPM, E minor, 8-bar loop (A: Em C G D, B: Em C Am B). */
function raceSong({ bpm = 150, semis = 0, extraHats = false } = {}) {
  const rootsA = [40, 36, 43, 38] // E2 C2 G2 D2
  const rootsB = [40, 36, 45, 35] // E2 C2 A2 B1
  const gallop = (r) => bar16([[0, r], [2, r], [3, r + 12], [4, r], [6, r], [7, r + 12], [8, r], [10, r], [11, r + 12], [12, r], [14, r + 7], [15, r + 12]])
  const bass = [...perBar(rootsA, gallop), ...perBar(rootsB, gallop)]

  const chordsA = [[64, 67, 71], [60, 64, 67], [67, 71, 74], [62, 66, 69]]
  const chordsB = [[64, 67, 71], [60, 64, 67], [64, 69, 72], [63, 66, 71]]
  const arpIdx = [0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 3]
  const arpBar = (c) => {
    const tones = [c[0], c[1], c[2], c[0] + 12]
    return arpIdx.map((i) => tones[i])
  }
  const arp = [...perBar(chordsA, arpBar), ...perBar(chordsB, arpBar)]

  const melody = steps(
    // A — hook
    'b4 . . . e5 . . . g5 . f#5 . e5 . . . ' +
      'g5 . . . e5 . . . c5 . d5 . e5 . . . ' +
      'd5 . . . g5 . . . b5 . a5 . g5 . . . ' +
      'a5 . . . f#5 . . . d5 . . . e5 . f#5 . ' +
      // B — answer
      'e5 . . . g5 . f#5 . e5 . . . d5 . e5 . ' +
      'g5 . . . e5 . d5 . c5 . . . b4 . c5 . ' +
      'a4 . c5 . e5 . . . d5 . c5 . b4 . a4 . ' +
      'b4 . . . d#5 . . . f#5 . . . g5 . f#5 .'
  )

  const hatA = hits('X.x.X.x.X.x.X.x.')
  const hatB = hits('XxxxXxxxXxxxXxxx')
  const hat = extraHats ? hatB : [...hatA, ...hatA, ...hatA, ...hatA, ...hatB, ...hatB, ...hatB, ...hatB]
  const ohatA = hits('................')
  const ohatB = hits('..X...X...X...X.')
  const ohat = extraHats ? ohatB : [...ohatA, ...ohatA, ...ohatA, ...ohatA, ...ohatB, ...ohatB, ...ohatB, ...ohatB]

  const kick = hits('X...X...X...X.x.')
  const snare = hits('....X.......X..o')
  const parts = [
    { inst: 'kick', drum: true, pattern: kick },
    { inst: 'snare', drum: true, pattern: snare },
    { inst: 'hat', drum: true, pattern: hat, vel: 0.75 },
    { inst: 'ohat', drum: true, pattern: ohat, vel: 0.6 },
    { inst: 'bass', pattern: transpose(bass, semis), vel: 1, len: 1 },
    { inst: 'arp', pattern: transpose(arp, semis), vel: 0.8, len: 1 },
    { inst: 'lead', pattern: transpose(melody, semis), vel: 0.9, len: 2 },
  ]
  if (extraHats) parts.push({ inst: 'rim', drum: true, pattern: hits('..x...x...x...x.'), vel: 0.8 })
  return { bpm, steps: 128, parts }
}

/** Relaxed 100 BPM fanfare-ish loop, F major, I–V–vi–IV. */
function resultsSong() {
  const roots = [41, 36, 38, 34] // F2 C2 D2 Bb1
  const bass = perBar(roots, (r) => bar16([[0, r], [8, r + 7], [14, r + 12]]))
  const chords = [[65, 69, 72], [64, 67, 72], [65, 69, 74], [65, 70, 74]]
  const pad = perBar(chords, (c) => bar16([[0, c]]))
  const melody = steps(
    'a5 . . . c6 . . . a5 . g5 . f5 . . . ' +
      'g5 . . . . . e5 . c5 . . . . . . . ' +
      'f5 . . . a5 . . . d5 . . . . . e5 . ' +
      'f5 . . . . . d5 . c5 . . . . . . .'
  )
  return {
    bpm: 100,
    steps: 64,
    parts: [
      { inst: 'kick', drum: true, pattern: hits('X.......X.......'), vel: 0.55 },
      { inst: 'rim', drum: true, pattern: hits('....X.......X...'), vel: 0.8 },
      { inst: 'hat', drum: true, pattern: hits('x.x.x.x.x.x.x.x.'), vel: 0.5 },
      { inst: 'softbass', pattern: bass, vel: 0.8, len: 6 },
      { inst: 'pad', pattern: pad, vel: 0.9, len: 15 },
      { inst: 'softlead', pattern: melody, vel: 0.9, len: 3 },
    ],
  }
}

/** Fast sparkly loop played while the player has star power (goes on the SFX bus). */
function starSong() {
  const melody = steps(
    'c5 . e5 . g5 . e5 . f5 . a5 . c6 . a5 . ' +
      'g5 . b5 . d6 . b5 . c6 . e6 . g6 . e6 .'
  )
  const bass = [...bar16([[0, 48], [8, 53]]), ...bar16([[0, 55], [8, 60]])]
  return {
    bpm: 160,
    steps: 32,
    parts: [
      { inst: 'lead', pattern: melody, vel: 0.9, len: 2 },
      { inst: 'softbass', pattern: bass, vel: 0.7, len: 6 },
      { inst: 'hat', drum: true, pattern: hits('X.x.X.x.X.x.X.x.'), vel: 0.6 },
    ],
  }
}

export const SONGS = {
  menu: () => menuSong(),
  race: () => raceSong(),
  final: () => raceSong({ bpm: 172, semis: 2, extraHats: true }),
  results: () => resultsSong(),
  star: () => starSong(),
}

// ───────────────────────────── sequencer ─────────────────────────────

export class Sequencer {
  /**
   * @param {AudioContext} ctx
   * @param {AudioNode} dest
   * @param {object} song
   */
  constructor(ctx, dest, song) {
    this.ctx = ctx
    this.song = song
    this.stepDur = 60 / song.bpm / 4
    this.out = ctx.createGain()
    this.out.gain.value = 0
    this.out.connect(dest)
    this.step = 0
    this.nextTime = 0
    this.running = false
    this._timer = 0
    this._tick = () => this.tick()
  }

  start(fadeIn = 0.6) {
    const now = this.ctx.currentTime
    this.nextTime = now + 0.05
    this.step = 0
    this.running = true
    this.out.gain.cancelScheduledValues(now)
    this.out.gain.setValueAtTime(0, now)
    this.out.gain.linearRampToValueAtTime(1, now + fadeIn)
    this._timer = setInterval(this._tick, TICK_MS)
    this.tick()
  }

  stop(fadeOut = 0.6) {
    const now = this.ctx.currentTime
    this.running = false
    clearInterval(this._timer)
    this._timer = 0
    this.out.gain.cancelScheduledValues(now)
    this.out.gain.setValueAtTime(this.out.gain.value, now)
    this.out.gain.linearRampToValueAtTime(0, now + fadeOut)
    const out = this.out
    setTimeout(() => {
      try {
        out.disconnect()
      } catch (_) {
        /* ignore */
      }
    }, fadeOut * 1000 + 120)
  }

  /** Schedule every step that falls inside the lookahead window. Idempotent. */
  tick() {
    if (!this.running) return
    const ctx = this.ctx
    const horizon = ctx.currentTime + LOOKAHEAD
    // If we fell far behind (tab throttled), jump ahead instead of spraying catch-up notes.
    if (this.nextTime < ctx.currentTime - 0.5) {
      const missed = Math.ceil((ctx.currentTime - this.nextTime) / this.stepDur)
      this.step = (this.step + missed) % this.song.steps
      this.nextTime += missed * this.stepDur
    }
    let guard = 0
    while (this.nextTime < horizon && guard++ < 64) {
      this.scheduleStep(this.step, this.nextTime)
      this.nextTime += this.stepDur
      this.step = (this.step + 1) % this.song.steps
    }
  }

  scheduleStep(step, t) {
    const { parts } = this.song
    for (const part of parts) {
      const pat = part.pattern
      const v = pat[step % pat.length]
      if (v == null) continue
      const inst = INSTRUMENTS[part.inst]
      if (!inst) continue
      const gain = (part.vel ?? 1) * (part.gain ?? 1)
      if (part.drum) inst(this.ctx, this.out, t, null, v * gain, this.stepDur)
      else inst(this.ctx, this.out, t, v, gain, (part.len ?? 1) * this.stepDur)
    }
  }
}

/** Manages the currently playing song with crossfades. */
export class MusicPlayer {
  constructor(ctx, dest) {
    this.ctx = ctx
    this.dest = dest
    this.current = null
    this.name = null
  }

  /** @param {string|null} name */
  set(name, fade = 0.6) {
    if (name === this.name) return
    if (this.current) {
      this.current.stop(fade)
      this.current = null
    }
    this.name = name
    if (!name) return
    const make = SONGS[name]
    if (!make) return
    this.current = new Sequencer(this.ctx, this.dest, make())
    this.current.start(fade)
  }

  tick() {
    this.current?.tick()
  }

  dispose() {
    this.set(null, 0.05)
  }
}
