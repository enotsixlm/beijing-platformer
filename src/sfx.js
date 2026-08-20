let audio = null

export function initAudio() {
  if (audio) return audio
  try { audio = new (window.AudioContext || window.webkitAudioContext)() } catch { /* silent */ }
  return audio
}

function beep(freq, dur = 0.12, vol = 0.14, type = 'square') {
  if (!audio) return
  const o = audio.createOscillator()
  o.type = type
  o.frequency.value = freq
  const g = audio.createGain()
  g.gain.setValueAtTime(vol, audio.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + dur)
  o.connect(g).connect(audio.destination)
  o.start()
  o.stop(audio.currentTime + dur)
}

function sweep(f0, f1, dur = 0.28, vol = 0.12, type = 'sawtooth') {
  if (!audio) return
  const o = audio.createOscillator()
  o.type = type
  o.frequency.setValueAtTime(f0, audio.currentTime)
  o.frequency.exponentialRampToValueAtTime(Math.max(40, f1), audio.currentTime + dur)
  const g = audio.createGain()
  g.gain.setValueAtTime(vol, audio.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + dur)
  o.connect(g).connect(audio.destination)
  o.start()
  o.stop(audio.currentTime + dur)
}

export const sfx = {
  coin: () => { beep(988, 0.07, 0.12); setTimeout(() => beep(1319, 0.11, 0.12), 50) },
  dash: () => sweep(180, 720, 0.32, 0.16, 'sawtooth'),
  boost: () => { beep(392, 0.08, 0.1, 'triangle'); setTimeout(() => beep(784, 0.18, 0.12, 'triangle'), 70) },
  stick: () => beep(220, 0.16, 0.14, 'square'),
  sneaker: () => sweep(320, 90, 0.4, 0.18, 'square'),
  drift: () => beep(196, 0.2, 0.08, 'sawtooth'),
  countdown: (n) => beep(n === 0 ? 880 : 440, n === 0 ? 0.28 : 0.12, 0.16, 'square'),
  lap: () => { beep(523, 0.1, 0.14); setTimeout(() => beep(784, 0.16, 0.14), 90) },
  win: () => [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.22, 0.16), i * 120)),
  menu: () => beep(660, 0.08, 0.1, 'triangle'),
  laser: () => sweep(1400, 240, 0.35, 0.12, 'square'),
  splash: () => beep(140, 0.18, 0.1, 'triangle'),
}
