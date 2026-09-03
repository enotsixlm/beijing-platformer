/**
 * Format seconds as "m:ss.mmm" (e.g. 72.3456 → "1:12.345").
 * null / undefined / NaN → "--:--.---".
 */
export function formatTime(seconds) {
  if (seconds == null || typeof seconds !== 'number' || Number.isNaN(seconds) || !Number.isFinite(seconds)) return '--:--.---'
  const total = Math.max(0, seconds)
  const m = Math.floor(total / 60)
  const s = Math.floor(total - m * 60)
  const ms = Math.floor((total - Math.floor(total)) * 1000 + 1e-6)
  return `${m}:${String(s).padStart(2, '0')}.${String(ms).padStart(3, '0')}`
}
