/**
 * Module 2 — character roster (8 original mascots) and stat → physics mapping.
 *
 * `stats` are 1–5. `color` is the kart body colour (also used for minimap dots / results),
 * `secondary` the accent colour (spoiler, hub caps, side pods, suit stripe).
 * `figure` describes the procedural driver model (see kartModel.js).
 */

export const CHARACTERS = [
  {
    id: 'bao', name: 'Bao', title: 'Panda',
    color: '#2fb8ff', secondary: '#ffffff',
    blurb: 'Calm, round and impossible to rattle. The all-rounder.',
    stats: { speed: 3, accel: 3, handling: 3, weight: 3 },
    figure: {
      head: 'round', skin: '#f6f6f6',
      ears: { type: 'round', color: '#22222a' },
      eyes: { type: 'dot', pupil: '#22222a', patches: '#22222a' },
      snout: { type: 'muzzle', color: '#f6f6f6', nose: '#22222a' },
      suit: '#2fb8ff',
    },
  },
  {
    id: 'kit', name: 'Kit', title: 'Fox',
    color: '#ff7a1a', secondary: '#fff1dc',
    blurb: 'Quick off the line and glued to the apex.',
    stats: { speed: 3, accel: 4, handling: 5, weight: 2 },
    figure: {
      head: 'round', skin: '#ff8a2a',
      ears: { type: 'pointy', color: '#ff8a2a', inner: '#2b1a10' },
      eyes: { type: 'dot', pupil: '#2b1a10' },
      snout: { type: 'muzzle', color: '#fff3e0', nose: '#2b1a10' },
      suit: '#2b1a10',
    },
  },
  {
    id: 'bolt', name: 'Bolt', title: 'Robot',
    color: '#ffd400', secondary: '#2f3a56',
    blurb: 'Maximum thrust. Cornering not included in firmware.',
    stats: { speed: 5, accel: 2, handling: 2, weight: 5 },
    figure: {
      head: 'box', skin: '#b8c4d6',
      ears: { type: 'antenna', color: '#ffd400' },
      eyes: { type: 'visor', color: '#22e5ff' },
      snout: { type: 'none' },
      suit: '#2f3a56', metal: true,
    },
  },
  {
    id: 'hop', name: 'Hop', title: 'Frog',
    color: '#3ed65a', secondary: '#fff36b',
    blurb: 'Feather-light and twitchy. Gets bumped, bounces back.',
    stats: { speed: 2, accel: 5, handling: 4, weight: 1 },
    figure: {
      head: 'wide', skin: '#5ad14b',
      ears: { type: 'none' },
      eyes: { type: 'bulge', pupil: '#111111' },
      snout: { type: 'none' },
      cheeks: '#ffe86b', suit: '#fff36b',
    },
  },
  {
    id: 'miso', name: 'Miso', title: 'Cat',
    color: '#ff7ac8', secondary: '#ffffff',
    blurb: 'Nine lives, zero patience. Slides like butter.',
    stats: { speed: 3, accel: 4, handling: 4, weight: 2 },
    figure: {
      head: 'round', skin: '#fff1dc',
      ears: { type: 'pointy', color: '#fff1dc', inner: '#ff9ac2' },
      eyes: { type: 'big', color: '#7dff6b', pupil: '#111111' },
      snout: { type: 'muzzle', color: '#ffffff', nose: '#ff7aa8' },
      suit: '#ff7ac8',
    },
  },
  {
    id: 'ember', name: 'Ember', title: 'Dragon',
    color: '#e8332f', secondary: '#ffb03b',
    blurb: 'Heavy hitter with a fiery top end.',
    stats: { speed: 4, accel: 2, handling: 3, weight: 4 },
    figure: {
      head: 'egg', skin: '#e3402f',
      ears: { type: 'horns', color: '#ffe0a3' },
      eyes: { type: 'big', color: '#ffd23b', pupil: '#111111' },
      snout: { type: 'snout', color: '#e3402f', nose: '#5a1410' },
      belly: '#ffcf8a', suit: '#ffb03b',
    },
  },
  {
    id: 'pip', name: 'Pip', title: 'Penguin',
    color: '#4a4ee8', secondary: '#ffffff',
    blurb: 'Tiny, brave and launches like a rocket.',
    stats: { speed: 2, accel: 5, handling: 3, weight: 2 },
    figure: {
      head: 'egg', skin: '#25324f', face: '#ffffff',
      ears: { type: 'none' },
      eyes: { type: 'dot', pupil: '#111111' },
      snout: { type: 'beak', color: '#ff9a2a' },
      suit: '#25324f',
    },
  },
  {
    id: 'bruno', name: 'Bruno', title: 'Yeti',
    color: '#25c9b8', secondary: '#e8f4ff',
    blurb: 'Slow to wake up, unstoppable once rolling.',
    stats: { speed: 4, accel: 1, handling: 2, weight: 5 },
    figure: {
      head: 'box', skin: '#eef4ff', face: '#7fb2ff',
      ears: { type: 'tuft', color: '#eef4ff' },
      eyes: { type: 'dot', pupil: '#1a2a44', brow: '#dfe8ff' },
      snout: { type: 'muzzle', color: '#7fb2ff', nose: '#1a2a44' },
      suit: '#25c9b8',
    },
  },
]

const clampStat = (v) => Math.min(5, Math.max(1, Number(v) || 3))

/**
 * Map 1–5 stats to concrete physics numbers.
 *  - speed    → top speed 28..36 m/s
 *  - accel    → 0→top time 4.0..2.5 s
 *  - handling → steering rate ×0.85..1.15, drift charge rate ×0.9..1.1, grip
 *  - weight   → collision mass 0.7..1.3
 */
export function derivePhysics(stats = {}) {
  const speed = clampStat(stats.speed)
  const accel = clampStat(stats.accel)
  const handling = clampStat(stats.handling)
  const weight = clampStat(stats.weight)
  return {
    maxSpeed: 28 + (speed - 1) * 2,
    accelTime: 4 - (accel - 1) * 0.375,
    steerMul: 0.85 + (handling - 1) * 0.075,
    driftChargeMul: 0.9 + (handling - 1) * 0.05,
    grip: 14 + handling * 1.5,
    mass: 0.7 + (weight - 1) * 0.15,
  }
}
