/** Deterministic 32-bit PRNG. Returns a function producing floats in [0, 1). */
export function mulberry32(seed = 1) {
  let a = seed >>> 0
  const rand = () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  rand.range = (min, max) => min + (max - min) * rand()
  rand.int = (min, max) => Math.floor(rand.range(min, max + 1))
  rand.pick = (arr) => arr[Math.floor(rand() * arr.length)]
  rand.chance = (p) => rand() < p
  return rand
}

export const lerp = (a, b, t) => a + (b - a) * t
export const clamp = (v, min, max) => (v < min ? min : v > max ? max : v)
export const damp = (a, b, lambda, dt) => lerp(a, b, 1 - Math.exp(-lambda * dt))
export const wrap01 = (t) => t - Math.floor(t)
/** Shortest signed difference between two angles. */
export const angleDelta = (a, b) => {
  let d = (b - a) % (Math.PI * 2)
  if (d > Math.PI) d -= Math.PI * 2
  if (d < -Math.PI) d += Math.PI * 2
  return d
}
