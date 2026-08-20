export function createAudio() {
  let ctx = null
  function init() {
    if (ctx) return
    try { ctx = new (window.AudioContext || window.webkitAudioContext)() } catch { /* silent */ }
  }
  function beep(freq, dur, vol, type = 'square', slide = 0) {
    if (!ctx) return
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = type
    o.frequency.setValueAtTime(freq, ctx.currentTime)
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), ctx.currentTime + dur)
    g.gain.setValueAtTime(vol, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
    o.connect(g).connect(ctx.destination)
    o.start()
    o.stop(ctx.currentTime + dur)
  }
  function noise(dur, vol) {
    if (!ctx) return
    const n = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate)
    const d = n.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource()
    src.buffer = n
    const f = ctx.createBiquadFilter()
    f.type = 'lowpass'
    f.frequency.value = 900
    const g = ctx.createGain()
    g.gain.setValueAtTime(vol, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
    src.connect(f).connect(g).connect(ctx.destination)
    src.start()
  }
  return {
    init,
    cannon: () => { beep(180, 0.12, 0.16, 'square', -80); noise(0.08, 0.08) },
    autogun: () => beep(520, 0.045, 0.07, 'square'),
    scatter: () => { noise(0.14, 0.16); beep(140, 0.1, 0.12, 'sawtooth', -60) },
    rocket: () => beep(220, 0.18, 0.12, 'sawtooth', -120),
    boom: () => { noise(0.28, 0.22); beep(90, 0.3, 0.18, 'sine', -40) },
    dash: () => beep(420, 0.1, 0.08, 'triangle', -200),
    jump: () => beep(360, 0.09, 0.07, 'triangle'),
    reload: () => { beep(500, 0.06, 0.06, 'square'); setTimeout(() => beep(280, 0.08, 0.06, 'square'), 80) },
    dummy: () => beep(880, 0.05, 0.05, 'square'),
  }
}
