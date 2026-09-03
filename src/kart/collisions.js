/**
 * Module 2 — kart ↔ kart collisions.
 * Pairwise circle test (radius KART_RADIUS), positional separation and an elastic-ish momentum
 * exchange weighted by the karts' `mass` (from the weight stat). A star kart spins out the other.
 */
import * as THREE from 'three'
import { EVT, KART_RADIUS } from '../core/constants.js'

const BUMP_THRESHOLD = 2.0   // relative closing speed (m/s) needed to emit KART_BUMP
const RESTITUTION = 0.55
const SEPARATION_SLOP = 0.01

const _imp = new THREE.Vector3()

/**
 * Resolve collisions between all karts (O(n²), n ≤ 8).
 * @param {import('./kart.js').Kart[]} karts
 */
export function resolveKartCollisions(karts) {
  const n = karts.length
  const minDist = KART_RADIUS * 2
  for (let i = 0; i < n; i++) {
    const a = karts[i]
    for (let j = i + 1; j < n; j++) {
      const b = karts[j]
      let dx = b.position.x - a.position.x
      let dz = b.position.z - a.position.z
      const d2 = dx * dx + dz * dz
      if (d2 >= minDist * minDist) continue
      let d = Math.sqrt(d2)
      if (d < 1e-4) {
        // perfectly overlapping: pick a deterministic push direction
        dx = Math.cos(i * 1.7 + j)
        dz = Math.sin(i * 1.7 + j)
        d = 1
      }
      const nx = dx / d
      const nz = dz / d
      const ma = a.mass || 1
      const mb = b.mass || 1
      const invSum = 1 / (ma + mb)

      // positional separation (heavier moves less)
      const overlap = minDist - d + SEPARATION_SLOP
      const pushA = overlap * (mb * invSum)
      const pushB = overlap * (ma * invSum)
      a.position.x -= nx * pushA
      a.position.z -= nz * pushA
      b.position.x += nx * pushB
      b.position.z += nz * pushB

      // momentum exchange along the normal when closing
      const rvx = b.velocity.x - a.velocity.x
      const rvz = b.velocity.z - a.velocity.z
      const closing = -(rvx * nx + rvz * nz) // > 0 when approaching
      let force = 0
      if (closing > 0) {
        const jImp = ((1 + RESTITUTION) * closing) / (1 / ma + 1 / mb)
        _imp.set(-nx * (jImp / ma), 0, -nz * (jImp / ma))
        a.bump(_imp)
        _imp.set(nx * (jImp / mb), 0, nz * (jImp / mb))
        b.bump(_imp)
        force = closing
      } else {
        // resting contact: gentle nudge apart so karts don't stick
        _imp.set(-nx * 0.4, 0, -nz * 0.4)
        a.bump(_imp)
        _imp.set(nx * 0.4, 0, nz * 0.4)
        b.bump(_imp)
      }

      const aStar = a.state.starTimer > 0
      const bStar = b.state.starTimer > 0
      if (aStar && !bStar) b.hit('star')
      else if (bStar && !aStar) a.hit('star')

      if (force > BUMP_THRESHOLD) {
        const events = a.events || b.events
        if (events) events.emit(EVT.KART_BUMP, { a, b, force })
      }
    }
  }
}
