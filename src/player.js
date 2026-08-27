import * as THREE from 'three'
import { toon } from './toon.js'

export const P = {
  walkSpeed: 3.35,
  runSpeed: 6.4,
  crouchSpeed: 1.75,
  boxSpeed: 1.15,
  gravity: 26,
  jumpV: 8.15,
  coyote: 0.1,
  jumpBuffer: 0.12,
  halfW: 0.32,
  standH: 1.68,
  crouchH: 0.92,
  staminaMax: 4.2,
}

export function createHumanoid(kind) {
  const g = new THREE.Group()
  const isGuard = kind === 'guard'
  const suit = toon(isGuard ? 0x3d4c38 : 0x2a3624)
  const dark = toon(0x161a14)
  const vest = toon(isGuard ? 0x2e382c : 0x3a3328)
  const skin = toon(isGuard ? 0xb39a76 : 0xc9ae8a)
  const accent = toon(isGuard ? 0x4a3a28 : 0x1c2418)

  const hips = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.18, 0.24), suit)
  hips.position.y = 0.78
  g.add(hips)

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.52, 0.28), vest)
  torso.position.y = 1.12
  g.add(torso)

  const belt = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.3), dark)
  belt.position.y = 0.88
  g.add(belt)

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.155, 10, 8), skin)
  head.position.y = 1.52
  g.add(head)

  let visor = null
  if (isGuard) {
    const helm = new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 8), dark)
    helm.scale.set(1.05, 0.72, 1.05)
    helm.position.set(0, 1.58, 0.02)
    g.add(helm)
    visor = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.07, 0.08), toon(0x1a2218, { emissive: 0x081008 }))
    visor.position.set(0, 1.52, 0.14)
    g.add(visor)
  } else {
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.08, 12), accent)
    band.position.y = 1.6
    g.add(band)
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.28), accent)
    tail.position.set(0, 1.58, 0.22)
    g.add(tail)
  }

  const limbGeo = new THREE.BoxGeometry(0.12, 0.42, 0.12)
  const arms = []
  const legs = []
  for (const s of [-1, 1]) {
    const arm = new THREE.Mesh(limbGeo, suit)
    arm.position.set(0.32 * s, 1.08, 0)
    g.add(arm)
    arms.push(arm)
    const hand = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), skin)
    hand.position.set(0.32 * s, 0.84, 0.02)
    g.add(hand)
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.5, 0.14), dark)
    leg.position.set(0.11 * s, 0.34, 0)
    g.add(leg)
    legs.push(leg)
    const boot = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.12, 0.22), dark)
    boot.position.set(0.11 * s, 0.06, 0.03)
    g.add(boot)
  }

  let rifle = null
  if (isGuard) {
    rifle = new THREE.Group()
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.09, 0.72), dark)
    rifle.add(body)
    const stock = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.18), accent)
    stock.position.set(0, -0.02, 0.4)
    rifle.add(stock)
    const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.28), toon(0x2a2e32))
    barrel.position.set(0, 0.01, -0.46)
    rifle.add(barrel)
    rifle.position.set(0.22, 1.02, 0.22)
    rifle.rotation.x = -0.12
    g.add(rifle)
  } else {
    const pack = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.32, 0.1), dark)
    pack.position.set(0, 1.14, 0.2)
    g.add(pack)
    const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.45, 6), toon(0x888888))
    ant.position.set(0.08, 1.48, 0.2)
    g.add(ant)
  }

  const boxMesh = new THREE.Group()
  const cardboard = toon(0xb8894c)
  const tape = toon(0xd9c48a)
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.82, 0.95), cardboard)
  box.position.y = 0.41
  boxMesh.add(box)
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.84, 0.96), tape)
  stripe.position.y = 0.41
  boxMesh.add(stripe)
  const hole = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, 0.02), dark)
  hole.position.set(0, 0.62, -0.48)
  boxMesh.add(hole)
  boxMesh.visible = false
  g.add(boxMesh)

  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true } })
  return { group: g, arms, legs, rifle, visor, boxMesh, bodyParts: [hips, torso, head, belt] }
}

export function createPlayerState(x, y, z) {
  return {
    pos: new THREE.Vector3(x, y, z),
    vx: 0, vy: 0, vz: 0,
    heading: 0,
    grounded: true,
    groundC: null,
    sinceGround: 0,
    jumpBufferT: 0,
    justJumped: false,
    justLanded: false,
    crouch: false,
    boxOn: false,
    running: false,
    stamina: P.staminaMax,
    height: P.standH,
    noise: 0,
    moving: false,
    cqcCooldown: 0,
    throwCooldown: 0,
    hp: 100,
    invuln: 0,
  }
}

export function playerHeight(p) {
  return p.boxOn || p.crouch ? P.crouchH : P.standH
}

export function playerEye(p) {
  return p.boxOn || p.crouch ? 0.55 : 1.42
}

export function stepPlayer(p, input, dt, colliders) {
  p.height = playerHeight(p)
  p.justJumped = false
  p.cqcCooldown = Math.max(0, p.cqcCooldown - dt)
  p.throwCooldown = Math.max(0, p.throwCooldown - dt)
  p.invuln = Math.max(0, p.invuln - dt)

  if (input.crouchToggle) {
    p.crouch = !p.crouch
    if (p.crouch) p.boxOn = false
  }
  if (input.boxToggle) {
    p.boxOn = !p.boxOn
    if (p.boxOn) p.crouch = false
  }

  const wantRun = input.run && !p.crouch && !p.boxOn && p.stamina > 0.15
  p.running = wantRun && (input.x || input.z)
  if (p.running) p.stamina = Math.max(0, p.stamina - dt)
  else p.stamina = Math.min(P.staminaMax, p.stamina + dt * 0.85)

  let speed = P.walkSpeed
  if (p.boxOn) speed = P.boxSpeed
  else if (p.crouch) speed = P.crouchSpeed
  else if (p.running) speed = P.runSpeed

  const tx = input.x * speed
  const tz = input.z * speed
  if (p.grounded) {
    p.vx = tx
    p.vz = tz
  } else {
    const k = 1 - Math.exp(-7 * dt)
    p.vx += (tx - p.vx) * k
    p.vz += (tz - p.vz) * k
  }
  if (input.x || input.z) p.heading = Math.atan2(input.x, input.z)
  p.moving = Math.hypot(p.vx, p.vz) > 0.35

  if (p.boxOn) p.noise = p.moving ? 1.6 : 0
  else if (p.crouch) p.noise = p.moving ? 2.1 : 0
  else if (p.running) p.noise = 13
  else p.noise = p.moving ? 5.4 : 0.4

  if (input.jumpPressed) p.jumpBufferT = P.jumpBuffer
  else p.jumpBufferT -= dt
  p.sinceGround = p.grounded ? 0 : p.sinceGround + dt

  if (p.jumpBufferT > 0 && !p.boxOn && (p.grounded || p.sinceGround < P.coyote)) {
    p.vy = P.jumpV
    p.grounded = false
    p.sinceGround = P.coyote
    p.jumpBufferT = 0
    p.justJumped = true
    p.noise = Math.max(p.noise, 7)
  }

  p.vy -= P.gravity * dt
  if (p.vy < -28) p.vy = -28
  p.pos.x += p.vx * dt
  p.pos.y += p.vy * dt
  p.pos.z += p.vz * dt

  const wasGrounded = p.grounded
  p.grounded = false
  p.groundC = null
  const h = p.height

  if (p.pos.y < 0) {
    p.pos.y = 0
    if (p.vy < 0) p.vy = 0
    p.grounded = true
  }

  for (let pass = 0; pass < 2; pass++) {
    for (const c of colliders) {
      const pxMin = p.pos.x - P.halfW, pxMax = p.pos.x + P.halfW
      const pyMin = p.pos.y, pyMax = p.pos.y + h
      const pzMin = p.pos.z - P.halfW, pzMax = p.pos.z + P.halfW
      if (pxMax <= c.min.x || pxMin >= c.max.x) continue
      if (pyMax <= c.min.y || pyMin >= c.max.y) continue
      if (pzMax <= c.min.z || pzMin >= c.max.z) continue
      const pushX = pxMax - c.min.x < c.max.x - pxMin ? c.min.x - pxMax : c.max.x - pxMin
      const pushY = pyMax - c.min.y < c.max.y - pyMin ? c.min.y - pyMax : c.max.y - pyMin
      const pushZ = pzMax - c.min.z < c.max.z - pzMin ? c.min.z - pzMax : c.max.z - pzMin
      const ax = Math.abs(pushX), ay = Math.abs(pushY), az = Math.abs(pushZ)
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

  p.justLanded = p.grounded && !wasGrounded
}

export function syncPlayerMesh(p, mesh, now) {
  const g = mesh.group
  g.position.copy(p.pos)
  g.rotation.y = p.heading

  const hidden = p.boxOn
  for (const o of g.children) {
    if (o === mesh.boxMesh) continue
    o.visible = !hidden
  }
  mesh.boxMesh.visible = hidden

  if (p.crouch && !p.boxOn) {
    g.scale.set(1.05, 0.72, 1.08)
  } else {
    g.scale.set(1, 1, 1)
  }

  const speed = Math.hypot(p.vx, p.vz)
  if (p.grounded && speed > 0.4 && !p.boxOn) {
    const sw = Math.sin(now * 0.012 * (p.running ? 1.6 : 1)) * (p.crouch ? 0.12 : 0.22)
    mesh.arms[0].position.z = sw
    mesh.arms[1].position.z = -sw
    mesh.legs[0].position.z = -sw * 0.8
    mesh.legs[1].position.z = sw * 0.8
  } else {
    mesh.arms[0].position.z = 0
    mesh.arms[1].position.z = 0
    mesh.legs[0].position.z = 0
    mesh.legs[1].position.z = 0
  }
}

export function hurtPlayer(p, dmg) {
  if (p.invuln > 0) return false
  p.hp = Math.max(0, p.hp - dmg)
  p.invuln = 0.55
  return true
}
