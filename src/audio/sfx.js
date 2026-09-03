/**
 * Sound effects. Each entry is `(ctx, dest, o) => endTime` where
 * o = { t: start time, p: pitch multiplier, v: gain multiplier, level?: number }.
 * Everything is synthesised: no samples.
 */
import { tone, noise, noteToFreq } from './synth.js'

const chime = (ctx, dest, o, midis, spacing, decay, type = 'sine', gain = 0.25) => {
  let end = o.t
  midis.forEach((m, i) => {
    const t = o.t + i * spacing
    const f = noteToFreq(m) * o.p
    end = tone(ctx, dest, { type, freq: f, t, dur: decay, gain: gain * o.v, pluck: true }).end
    tone(ctx, dest, { type: 'triangle', freq: f * 2, t, dur: decay * 0.6, gain: gain * 0.35 * o.v, pluck: true })
  })
  return end
}

export const SFX = {
  hop(ctx, dest, o) {
    tone(ctx, dest, { type: 'sine', freq: 320 * o.p, freqEnd: 720 * o.p, t: o.t, dur: 0.11, gain: 0.35 * o.v, pluck: true })
    return tone(ctx, dest, { type: 'triangle', freq: 640 * o.p, freqEnd: 1400 * o.p, t: o.t, dur: 0.08, gain: 0.12 * o.v, pluck: true }).end
  },

  land(ctx, dest, o) {
    noise(ctx, dest, { t: o.t, dur: 0.14, gain: 0.45 * o.v, filter: { type: 'lowpass', freq: 500 * o.p, freqEnd: 120 } })
    return tone(ctx, dest, { type: 'sine', freq: 95 * o.p, freqEnd: 45, t: o.t, dur: 0.13, gain: 0.5 * o.v, pluck: true }).end
  },

  // One-shot skid burst (the real drift skid is a loop managed by the manager).
  drift(ctx, dest, o) {
    return noise(ctx, dest, { t: o.t, dur: 0.4, gain: 0.3 * o.v, a: 0.03, filter: { type: 'bandpass', freq: 1300 * o.p, Q: 1.4 } }).end
  },

  drift_level(ctx, dest, o) {
    const lvl = Math.max(1, Math.min(3, o.level ?? 1))
    const base = 520 * Math.pow(1.35, lvl - 1) * o.p
    tone(ctx, dest, { type: 'square', freq: base, t: o.t, dur: 0.05, gain: 0.16 * o.v, pluck: true })
    tone(ctx, dest, { type: 'square', freq: base * 1.5, t: o.t + 0.05, dur: 0.07, gain: 0.16 * o.v, pluck: true })
    if (lvl >= 2) tone(ctx, dest, { type: 'square', freq: base * 2, t: o.t + 0.1, dur: 0.09, gain: 0.14 * o.v, pluck: true })
    return tone(ctx, dest, { type: 'sine', freq: base * 2 * (lvl >= 3 ? 1.5 : 1), t: o.t + 0.1, dur: 0.16, gain: 0.12 * o.v, pluck: true }).end
  },

  boost(ctx, dest, o) {
    noise(ctx, dest, { t: o.t, dur: 0.55, gain: 0.55 * o.v, a: 0.04, filter: { type: 'bandpass', freq: 250 * o.p, freqEnd: 3500 * o.p, Q: 0.9 } })
    return tone(ctx, dest, {
      type: 'sawtooth', freq: 90 * o.p, freqEnd: 700 * o.p, t: o.t, dur: 0.5, gain: 0.22 * o.v, a: 0.03, pluck: true,
      filter: { type: 'lowpass', freq: 600, freqEnd: 4000, Q: 2 },
    }).end
  },

  item_pickup(ctx, dest, o) {
    return chime(ctx, dest, o, [72, 76, 79, 84], 0.06, 0.35, 'sine', 0.22)
  },

  roulette_tick(ctx, dest, o) {
    noise(ctx, dest, { t: o.t, dur: 0.012, gain: 0.25 * o.v, filter: { type: 'highpass', freq: 3000 } })
    return tone(ctx, dest, { type: 'square', freq: 1900 * o.p, t: o.t, dur: 0.02, gain: 0.12 * o.v, pluck: true }).end
  },

  item_use(ctx, dest, o) {
    return tone(ctx, dest, { type: 'sine', freq: 520 * o.p, freqEnd: 140 * o.p, t: o.t, dur: 0.1, gain: 0.45 * o.v, pluck: true }).end
  },

  shell_throw(ctx, dest, o) {
    noise(ctx, dest, { t: o.t, dur: 0.28, gain: 0.4 * o.v, a: 0.02, filter: { type: 'bandpass', freq: 700 * o.p, freqEnd: 2600 * o.p, Q: 1.2 } })
    return tone(ctx, dest, { type: 'sawtooth', freq: 180 * o.p, freqEnd: 520 * o.p, t: o.t, dur: 0.22, gain: 0.1 * o.v, pluck: true, filter: { type: 'lowpass', freq: 1200 } }).end
  },

  shell_bounce(ctx, dest, o) {
    tone(ctx, dest, { type: 'sine', freq: 820 * o.p, freqEnd: 560 * o.p, t: o.t, dur: 0.07, gain: 0.4 * o.v, pluck: true })
    return tone(ctx, dest, { type: 'triangle', freq: 1250 * o.p, t: o.t, dur: 0.035, gain: 0.2 * o.v, pluck: true }).end
  },

  shell_hit(ctx, dest, o) {
    noise(ctx, dest, { t: o.t, dur: 0.22, gain: 0.6 * o.v, filter: { type: 'lowpass', freq: 1800 * o.p, freqEnd: 250 } })
    noise(ctx, dest, { t: o.t, dur: 0.05, gain: 0.5 * o.v, filter: { type: 'highpass', freq: 2500 } })
    return tone(ctx, dest, { type: 'square', freq: 130 * o.p, freqEnd: 55, t: o.t, dur: 0.18, gain: 0.35 * o.v, pluck: true, filter: { type: 'lowpass', freq: 900 } }).end
  },

  banana_slip(ctx, dest, o) {
    // comedic "wheeee-oooop" slide
    tone(ctx, dest, { type: 'triangle', freq: 950 * o.p, freqEnd: 180 * o.p, t: o.t, dur: 0.5, gain: 0.3 * o.v, a: 0.02, r: 0.08 })
    tone(ctx, dest, { type: 'square', freq: 960 * o.p, freqEnd: 182 * o.p, t: o.t, dur: 0.5, gain: 0.07 * o.v, a: 0.02, r: 0.08, filter: { type: 'lowpass', freq: 1800, freqEnd: 400 } })
    return noise(ctx, dest, { t: o.t, dur: 0.25, gain: 0.18 * o.v, filter: { type: 'bandpass', freq: 900, freqEnd: 300, Q: 1.5 } }).end
  },

  explosion(ctx, dest, o) {
    noise(ctx, dest, { t: o.t, dur: 1.1, gain: 0.9 * o.v, a: 0.005, filter: { type: 'lowpass', freq: 2400 * o.p, freqEnd: 70 } })
    noise(ctx, dest, { t: o.t, dur: 0.08, gain: 0.6 * o.v, filter: { type: 'highpass', freq: 1500 } })
    return tone(ctx, dest, { type: 'sine', freq: 70 * o.p, freqEnd: 28, t: o.t, dur: 0.7, gain: 0.85 * o.v, pluck: true }).end
  },

  star(ctx, dest, o) {
    return chime(ctx, dest, o, [84, 88, 91, 96, 100, 103], 0.045, 0.4, 'sine', 0.2)
  },

  lightning(ctx, dest, o) {
    noise(ctx, dest, { t: o.t, dur: 0.09, gain: 0.85 * o.v, filter: { type: 'highpass', freq: 2500 } })
    tone(ctx, dest, { type: 'sawtooth', freq: 3200 * o.p, freqEnd: 400, t: o.t, dur: 0.12, gain: 0.2 * o.v, pluck: true })
    return noise(ctx, dest, { t: o.t + 0.12, dur: 1.5, gain: 0.55 * o.v, a: 0.06, filter: { type: 'lowpass', freq: 320, freqEnd: 60 } }).end
  },

  hit_wall(ctx, dest, o) {
    noise(ctx, dest, { t: o.t, dur: 0.16, gain: 0.45 * o.v, filter: { type: 'lowpass', freq: 600 * o.p, freqEnd: 150 } })
    return tone(ctx, dest, { type: 'sine', freq: 110 * o.p, freqEnd: 50, t: o.t, dur: 0.14, gain: 0.45 * o.v, pluck: true }).end
  },

  bump(ctx, dest, o) {
    noise(ctx, dest, { t: o.t, dur: 0.04, gain: 0.25 * o.v, filter: { type: 'lowpass', freq: 1200 } })
    return tone(ctx, dest, { type: 'sine', freq: 220 * o.p, freqEnd: 110, t: o.t, dur: 0.09, gain: 0.35 * o.v, pluck: true }).end
  },

  countdown(ctx, dest, o) {
    tone(ctx, dest, { type: 'square', freq: 880 * o.p, t: o.t, dur: 0.16, gain: 0.16 * o.v, a: 0.004, r: 0.04 })
    return tone(ctx, dest, { type: 'sine', freq: 880 * o.p, t: o.t, dur: 0.16, gain: 0.28 * o.v, a: 0.004, r: 0.06 }).end
  },

  go(ctx, dest, o) {
    tone(ctx, dest, { type: 'square', freq: 1320 * o.p, t: o.t, dur: 0.55, gain: 0.16 * o.v, a: 0.004, r: 0.12 })
    tone(ctx, dest, { type: 'sine', freq: 1320 * o.p, t: o.t, dur: 0.55, gain: 0.3 * o.v, a: 0.004, r: 0.15 })
    return tone(ctx, dest, { type: 'triangle', freq: 660 * o.p, t: o.t, dur: 0.55, gain: 0.18 * o.v, a: 0.004, r: 0.15 }).end
  },

  lap(ctx, dest, o) {
    return chime(ctx, dest, o, [76, 81], 0.13, 0.45, 'sine', 0.28)
  },

  final_lap(ctx, dest, o) {
    let end = o.t
    const notes = [[76, 0, 0.13], [76, 0.16, 0.13], [81, 0.32, 0.6]]
    for (const [m, dt, dur] of notes) {
      const f = noteToFreq(m) * o.p
      tone(ctx, dest, { type: 'square', freq: f, t: o.t + dt, dur, gain: 0.14 * o.v, a: 0.005, r: 0.08, filter: { type: 'lowpass', freq: 3000 } })
      tone(ctx, dest, { type: 'sawtooth', freq: f / 2, t: o.t + dt, dur, gain: 0.1 * o.v, a: 0.005, r: 0.08, filter: { type: 'lowpass', freq: 1400 } })
      end = tone(ctx, dest, { type: 'sine', freq: f, t: o.t + dt, dur, gain: 0.22 * o.v, a: 0.005, r: 0.1 }).end
    }
    return end
  },

  finish_win(ctx, dest, o) {
    const seq = [[72, 0, 0.14], [76, 0.14, 0.14], [79, 0.28, 0.14], [84, 0.42, 0.75]]
    let end = o.t
    for (const [m, dt, dur] of seq) {
      const f = noteToFreq(m) * o.p
      tone(ctx, dest, { type: 'square', freq: f, t: o.t + dt, dur, gain: 0.13 * o.v, a: 0.005, r: 0.12, filter: { type: 'lowpass', freq: 3500 } })
      end = tone(ctx, dest, { type: 'sine', freq: f, t: o.t + dt, dur, gain: 0.25 * o.v, a: 0.005, r: 0.15 }).end
    }
    for (const m of [60, 64, 67]) {
      tone(ctx, dest, { type: 'triangle', freq: noteToFreq(m) * o.p, t: o.t + 0.42, dur: 0.8, gain: 0.1 * o.v, a: 0.03, r: 0.3 })
    }
    return end
  },

  finish_lose(ctx, dest, o) {
    let end = o.t
    ;[76, 74, 72, 71].forEach((m, i) => {
      end = tone(ctx, dest, { type: 'triangle', freq: noteToFreq(m) * o.p, t: o.t + i * 0.24, dur: 0.5, gain: 0.22 * o.v, a: 0.02, pluck: true }).end
    })
    return end
  },

  menu_move(ctx, dest, o) {
    return tone(ctx, dest, { type: 'square', freq: 1150 * o.p, t: o.t, dur: 0.035, gain: 0.14 * o.v, pluck: true }).end
  },

  menu_select(ctx, dest, o) {
    return chime(ctx, dest, o, [84, 91], 0.08, 0.32, 'sine', 0.24)
  },

  menu_back(ctx, dest, o) {
    return tone(ctx, dest, { type: 'triangle', freq: 520 * o.p, freqEnd: 330 * o.p, t: o.t, dur: 0.13, gain: 0.25 * o.v, pluck: true }).end
  },

  respawn(ctx, dest, o) {
    noise(ctx, dest, { t: o.t, dur: 0.32, gain: 0.35 * o.v, a: 0.01, filter: { type: 'bandpass', freq: 600 * o.p, freqEnd: 140, Q: 0.8 } })
    return tone(ctx, dest, { type: 'sine', freq: 340 * o.p, freqEnd: 90, t: o.t, dur: 0.3, gain: 0.25 * o.v, pluck: true }).end
  },

  offroad(ctx, dest, o) {
    return noise(ctx, dest, { t: o.t, dur: 0.32, gain: 0.4 * o.v, a: 0.02, filter: { type: 'lowpass', freq: 200 * o.p, Q: 0.7 } }).end
  },
}

export const SFX_NAMES = Object.freeze(Object.keys(SFX))
