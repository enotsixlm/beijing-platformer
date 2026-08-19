import { P } from './player.js'

export function stepCpu(p, dt, waypoints) {
  if (!p.alive || !waypoints.length) return { x: 0, z: 0, jumpPressed: false }
  if (p.wp >= waypoints.length) p.wp = waypoints.length - 1
  const t = waypoints[p.wp]
  const dx = t.x - p.pos.x
  const dz = t.z - p.pos.z
  const dy = t.y - p.pos.y
  const dist = Math.hypot(dx, dz)
  if (dist < 0.55 && Math.abs(dy) < 0.85) p.wp = Math.min(p.wp + 1, waypoints.length - 1)

  let x = 0, z = 0
  if (dist > 0.08) {
    x = dx / dist
    z = dz / dist
  }
  const speedMul = 0.68 + (p.slot % 7) * 0.04
  x *= speedMul
  z *= speedMul

  let jumpPressed = false
  p._jumpCd = (p._jumpCd || 0) - dt
  const gap = dist > 0.85 && dy > 0.12
  const up = dy > 0.42 && dist < 1.6
  if ((gap || up) && p._jumpCd <= 0 && (p.grounded || p.canDouble)) {
    jumpPressed = true
    p._jumpCd = 0.42
  }
  return { x, z, jumpPressed }
}

export function cpuName(slot) {
  return slot === 0 ? '你' : `逃者 ${slot + 1}`
}

void P
