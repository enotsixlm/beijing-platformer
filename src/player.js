import * as THREE from 'three'
import { toon } from './toon.js'

export const P = {
  runSpeed: 7.6,
  gravity: 28,
  jumpV: 9.8,
  doubleJumpV: 9.2,
  coyote: 0.12,
  jumpBuffer: 0.14,
  halfW: 0.16,
  height: 1.42,
  stepHeight: 0.34,
}

const PALETTE = [
  { vest: 0x3ec7ff, suit: 0x2a3340 },
  { vest: 0xffd23f, suit: 0x3a3328 },
  { vest: 0xff5ad5, suit: 0x352436 },
  { vest: 0x5dff8a, suit: 0x24332a },
  { vest: 0xff7a3a, suit: 0x3a2820 },
  { vest: 0xf4f1ea, suit: 0x2e3138 },
  { vest: 0x6d7cff, suit: 0x24263a },
  { vest: 0xff4d4d, suit: 0x3a2222 },
]

export function createRunnerMesh(slot = 0) {
  const pal = PALETTE[slot % PALETTE.length]
  const g = new THREE.Group()
  const suit = toon(pal.suit)
  const vest = toon(pal.vest, { emissive: pal.vest, emissiveIntensity: 0.18 })
  const skin = toon(0xe8c7a8)
  const dark = toon(0x1a1d22)

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.42, 4, 10), suit)
  body.position.y = 0.72
  g.add(body)

  const v = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.38, 0.28), vest)
  v.position.y = 0.78
  g.add(v)

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 10), skin)
  head.position.y = 1.22
  g.add(head)

  const helm = new THREE.Mesh(new THREE.SphereGeometry(0.21, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.52), dark)
  helm.position.y = 1.28
  g.add(helm)

  const visor = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.08, 0.08),
    toon(0x89e8ff, { emissive: 0x3ec7ff, emissiveIntensity: 0.6 })
  )
  visor.position.set(0, 1.24, -0.16)
  g.add(visor)

  const limbGeo = new THREE.CapsuleGeometry(0.07, 0.22, 3, 8)
  const arms = []
  const legs = []
  for (const s of [-1, 1]) {
    const arm = new THREE.Mesh(limbGeo, suit)
    arm.position.set(0.3 * s, 0.78, 0)
    g.add(arm)
    arms.push(arm)
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.28, 3, 8), dark)
    leg.position.set(0.12 * s, 0.28, 0)
    g.add(leg)
    legs.push(leg)
  }

  g.traverse((o) => { if (o.isMesh) o.castShadow = true })
  return { group: g, arms, legs }
}

export function createPlayerState(x, y, z, slot = 0) {
  return {
    slot,
    pos: new THREE.Vector3(x, y, z),
    vx: 0, vy: 0, vz: 0,
    heading: Math.PI,
    grounded: true,
    groundC: null,
    sinceGround: 0,
    jumpBufferT: 0,
    canDouble: true,
    justJumped: false,
    justLanded: false,
    alive: true,
    deadReason: null,
    maxY: y,
    finishTime: null,
    cpu: false,
    wp: 0,
  }
}

function overlaps(p, c) {
  const pxMin = p.pos.x - P.halfW, pxMax = p.pos.x + P.halfW
  const pyMin = p.pos.y, pyMax = p.pos.y + P.height
  const pzMin = p.pos.z - P.halfW, pzMax = p.pos.z + P.halfW
  if (pxMax <= c.min.x || pxMin >= c.max.x) return null
  if (pyMax <= c.min.y || pyMin >= c.max.y) return null
  if (pzMax <= c.min.z || pzMin >= c.max.z) return null
  return { pxMin, pxMax, pyMin, pyMax, pzMin, pzMax }
}

export function stepPlayer(p, input, dt, colliders) {
  if (!p.alive) return

  const tx = input.x * P.runSpeed
  const tz = input.z * P.runSpeed
  if (p.grounded) {
    p.vx = tx
    p.vz = tz
  } else {
    const k = 1 - Math.exp(-9 * dt)
    p.vx += (tx - p.vx) * k
    p.vz += (tz - p.vz) * k
  }
  if (input.x || input.z) p.heading = Math.atan2(input.x, input.z)

  p.justJumped = false
  if (input.jumpPressed) p.jumpBufferT = P.jumpBuffer
  else p.jumpBufferT -= dt
  p.sinceGround = p.grounded ? 0 : p.sinceGround + dt

  if (p.jumpBufferT > 0) {
    if (p.grounded || p.sinceGround < P.coyote) {
      p.vy = P.jumpV
      p.grounded = false
      p.sinceGround = P.coyote
      p.jumpBufferT = 0
      p.canDouble = true
      p.justJumped = true
    } else if (p.canDouble) {
      p.vy = P.doubleJumpV
      p.canDouble = false
      p.jumpBufferT = 0
      p.justJumped = true
    }
  }

  p.vy -= P.gravity * dt
  if (p.vy < -32) p.vy = -32
  p.pos.x += p.vx * dt
  p.pos.y += p.vy * dt
  p.pos.z += p.vz * dt

  const wasGrounded = p.grounded
  p.grounded = false
  p.groundC = null

  for (let pass = 0; pass < 2; pass++) {
    for (const c of colliders) {
      if (c.active === false) continue
      const hit = overlaps(p, c)
      if (!hit) continue
      const { pxMin, pxMax, pyMin, pyMax, pzMin, pzMax } = hit
      const pushX = pxMax - c.min.x < c.max.x - pxMin ? c.min.x - pxMax : c.max.x - pxMin
      const pushY = pyMax - c.min.y < c.max.y - pyMin ? c.min.y - pyMax : c.max.y - pyMin
      const pushZ = pzMax - c.min.z < c.max.z - pzMin ? c.min.z - pzMax : c.max.z - pzMin
      const ax = Math.abs(pushX), ay = Math.abs(pushY), az = Math.abs(pushZ)

      const step = c.max.y - p.pos.y
      const canStep = step > 0.02 && step <= P.stepHeight && p.vy <= 2.2 && pyMax > c.max.y + 0.02
      if (canStep && ay > 0.001 && (ax < 0.22 || az < 0.22)) {
        p.pos.y = c.max.y + 0.002
        p.vy = 0
        p.grounded = true
        p.groundC = c
        continue
      }

      if (c.pushable && ay > ax && ay > az) {
        // standing on box — treat as ground
      }

      if (c.pushable && (ax <= ay || az <= ay) && ay > 0.04) {
        const move = ax <= az ? -pushX * 0.9 : 0
        const moveZ = az < ax ? -pushZ * 0.9 : 0
        if (move) {
          c.min.x += move
          c.max.x += move
          if (c.mesh) c.mesh.position.x += move
          c.vx = (c.vx || 0) + move / Math.max(dt, 1 / 120) * 0.25
        }
        if (moveZ) {
          c.min.z += moveZ
          c.max.z += moveZ
          if (c.mesh) c.mesh.position.z += moveZ
          c.vz = (c.vz || 0) + moveZ / Math.max(dt, 1 / 120) * 0.25
        }
      }

      if (ay <= ax && ay <= az) {
        p.pos.y += pushY
        if (pushY > 0 && p.vy <= 0) { p.grounded = true; p.groundC = c; p.vy = 0 }
        else if (pushY < 0 && p.vy > 0) p.vy = 0
      } else if (ax <= az) {
        p.pos.x += pushX
        p.vx = 0
      } else {
        p.pos.z += pushZ
        p.vz = 0
      }
    }
  }

  if (p.grounded) p.canDouble = true
  p.justLanded = p.grounded && !wasGrounded
  if (p.pos.y > p.maxY) p.maxY = p.pos.y
}

export function syncRunnerMesh(p, mesh, now) {
  const g = mesh.group
  g.position.copy(p.pos)
  g.rotation.y = p.heading + Math.PI
  g.visible = p.alive

  if (p.justJumped) g.userData.squash = { t: 0, mode: 1 }
  if (p.justLanded) g.userData.squash = { t: 0, mode: -1 }
  const s = g.userData.squash
  if (s) {
    s.t += 1 / 60
    const k = Math.max(0, 1 - s.t / 0.22)
    const amt = 0.16 * k * s.mode
    g.scale.set(1 - amt * 0.55, 1 + amt, 1 - amt * 0.55)
    if (k <= 0) { g.userData.squash = null; g.scale.set(1, 1, 1) }
  }
  const speed = Math.hypot(p.vx, p.vz)
  if (p.grounded && speed > 1) {
    const sw = Math.sin(now * 0.02) * 0.22
    mesh.arms[0].position.z = sw
    mesh.arms[1].position.z = -sw
    mesh.legs[0].position.z = -sw * 0.7
    mesh.legs[1].position.z = sw * 0.7
  } else {
    mesh.arms[0].position.z = 0
    mesh.arms[1].position.z = 0
    mesh.legs[0].position.z = 0
    mesh.legs[1].position.z = 0
  }
}
