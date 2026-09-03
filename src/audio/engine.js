/**
 * Per-kart engine voice: detuned sawtooth + square pair through a throttle-driven
 * lowpass, plus a noisy exhaust layer. Pitch follows rpm (0..1) with a 3-gear
 * "shift" illusion. All parameter changes are smoothed with setTargetAtTime.
 */
import { noiseBuffer } from './synth.js'

const GEARS = 3
const F_MIN = 55
const F_MAX = 330

/** rpm 0..1 → 0..1 pitch position with sawtooth gear wrap (rpm drops on each shift). */
export function gearCurve(rpm) {
  const r = Math.max(0, Math.min(1, rpm))
  if (r >= 0.999) return 1
  const x = r * GEARS
  const gear = Math.min(GEARS - 1, Math.floor(x))
  const frac = x - gear
  const base = 0.2 * gear
  const span = 0.45
  return (base + frac * span) / (0.2 * (GEARS - 1) + span)
}

export class EngineVoice {
  constructor(ctx, dest) {
    this.ctx = ctx
    const t = ctx.currentTime

    this.saw = ctx.createOscillator()
    this.saw.type = 'sawtooth'
    this.square = ctx.createOscillator()
    this.square.type = 'square'
    this.square.detune.value = 9
    this.sub = ctx.createOscillator()
    this.sub.type = 'sine'

    this.sawGain = ctx.createGain()
    this.sawGain.gain.value = 0.5
    this.squareGain = ctx.createGain()
    this.squareGain.gain.value = 0.3
    this.subGain = ctx.createGain()
    this.subGain.gain.value = 0.35

    this.filter = ctx.createBiquadFilter()
    this.filter.type = 'lowpass'
    this.filter.Q.value = 2.5
    this.filter.frequency.value = 400

    this.noise = ctx.createBufferSource()
    this.noise.buffer = noiseBuffer(ctx)
    this.noise.loop = true
    this.noiseFilter = ctx.createBiquadFilter()
    this.noiseFilter.type = 'bandpass'
    this.noiseFilter.Q.value = 0.8
    this.noiseFilter.frequency.value = 200
    this.noiseGain = ctx.createGain()
    this.noiseGain.gain.value = 0.12

    this.gain = ctx.createGain()
    this.gain.gain.value = 0
    this.panner = typeof ctx.createStereoPanner === 'function' ? ctx.createStereoPanner() : null

    this.saw.connect(this.sawGain).connect(this.filter)
    this.square.connect(this.squareGain).connect(this.filter)
    this.sub.connect(this.subGain).connect(this.filter)
    this.noise.connect(this.noiseFilter).connect(this.noiseGain).connect(this.filter)
    this.filter.connect(this.gain)
    if (this.panner) this.gain.connect(this.panner).connect(dest)
    else this.gain.connect(dest)

    this.saw.start(t)
    this.square.start(t)
    this.sub.start(t)
    this.noise.start(t, Math.random())

    this.sleeping = true
    this.set({ rpm: 0, throttle: 0, gain: 0, pan: 0 })
  }

  /** @param {{rpm:number, throttle:number, gain:number, pan:number}} p */
  set(p) {
    const ctx = this.ctx
    const t = ctx.currentTime
    const rpm = Math.max(0, Math.min(1, p.rpm ?? 0))
    const throttle = Math.max(0, Math.min(1, p.throttle ?? 0))
    const gain = Math.max(0, Math.min(1, p.gain ?? 0))

    if (gain <= 0.001) {
      if (!this.sleeping) {
        this.gain.gain.setTargetAtTime(0, t, 0.05)
        this.sleeping = true
      }
      return
    }
    this.sleeping = false

    const pos = gearCurve(rpm)
    const f = F_MIN + (F_MAX - F_MIN) * pos
    const tc = 0.045
    this.saw.frequency.setTargetAtTime(f, t, tc)
    this.square.frequency.setTargetAtTime(f * 0.5, t, tc)
    this.sub.frequency.setTargetAtTime(f * 0.5, t, tc)
    this.filter.frequency.setTargetAtTime(280 + throttle * 1900 + pos * 900, t, 0.06)
    this.noiseFilter.frequency.setTargetAtTime(140 + rpm * 700, t, 0.08)
    this.noiseGain.gain.setTargetAtTime(0.08 + throttle * 0.12, t, 0.08)
    // Louder under load, a little quieter at idle.
    const loudness = gain * (0.55 + 0.45 * Math.max(throttle, rpm * 0.6))
    this.gain.gain.setTargetAtTime(loudness, t, 0.06)
    if (this.panner) this.panner.pan.setTargetAtTime(Math.max(-1, Math.min(1, p.pan ?? 0)), t, 0.08)
  }

  dispose() {
    for (const n of [this.saw, this.square, this.sub, this.noise]) {
      try {
        n.stop()
      } catch (_) {
        /* not started */
      }
    }
    this.gain.disconnect()
    this.panner?.disconnect()
  }
}
