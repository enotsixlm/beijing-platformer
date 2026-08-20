import * as THREE from 'three'
import { PLAYER } from './config.js'

function box(parent, x, y, z, w, h, d, mat) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
  m.position.set(x, y, z)
  m.castShadow = true
  parent.add(m)
  return m
}

function mat(color, emissive = 0x000000, ei = 0) {
  return new THREE.MeshLambertMaterial({ color, emissive, emissiveIntensity: ei })
}

export function createCowboy() {
  const root = new THREE.Group()
  const L = new THREE.Group()
  root.add(L)

  const leather = mat(0xa45a2a)
  const leatherD = mat(0x7a3e18)
  const denim = mat(0x3f74b0)
  const skin = mat(0xefc39a)
  const boot = mat(0x5a3218)
  const pack = mat(0x8a9098)
  const hat = mat(0x8a4a1c)

  box(L, -0.16, 0.12, 0.04, 0.22, 0.24, 0.34, boot)
  box(L, 0.16, 0.12, 0.04, 0.22, 0.24, 0.34, boot)
  box(L, -0.16, 0.46, 0.0, 0.24, 0.48, 0.28, denim)
  box(L, 0.16, 0.46, 0.0, 0.24, 0.48, 0.28, denim)
  box(L, 0, 1.02, 0, 0.62, 0.62, 0.36, leather)
  box(L, 0, 0.74, 0.02, 0.56, 0.16, 0.38, leatherD)
  const armL = box(L, -0.46, 1.00, 0.04, 0.2, 0.56, 0.2, leather)
  const armR = box(L, 0.46, 1.00, 0.04, 0.2, 0.56, 0.2, leather)
  box(L, 0, 1.42, 0.02, 0.36, 0.22, 0.28, pack)
  box(L, 0, 1.58, -0.16, 0.42, 0.42, 0.36, skin)
  box(L, 0, 1.86, -0.16, 0.46, 0.18, 0.46, hat)
  box(L, 0, 1.78, -0.16, 0.86, 0.08, 0.86, hat)
  box(L, 0, 1.22, 0.22, 0.5, 0.42, 0.18, pack)

  const weaponRoot = new THREE.Group()
  weaponRoot.position.set(0.42, 1.12, -0.28)
  L.add(weaponRoot)

  const guns = {
    cannon: makeGun('cannon'),
    autogun: makeGun('autogun'),
    scattergun: makeGun('scattergun'),
    blockbuster: makeGun('blockbuster'),
  }
  for (const g of Object.values(guns)) {
    g.visible = false
    weaponRoot.add(g)
  }
  guns.cannon.visible = true

  return { root, body: L, armL, armR, weaponRoot, guns }
}

function makeGun(kind) {
  const g = new THREE.Group()
  const dark = mat(0x2a2e33)
  const mid = mat(0x4a5158)
  const acc = mat(0xff7a18, 0xff6a10, 0.35)
  const glow = mat(0xffc14a, 0xff9a1a, 1.2)
  if (kind === 'cannon') {
    box(g, 0, 0, -0.22, 0.22, 0.28, 0.5, dark)
    box(g, 0, 0.02, -0.62, 0.16, 0.16, 0.38, mid)
    box(g, 0.12, -0.12, -0.1, 0.1, 0.22, 0.16, acc)
    box(g, 0, 0.02, -0.84, 0.14, 0.14, 0.12, glow)
  } else if (kind === 'autogun') {
    box(g, 0, 0.02, -0.35, 0.16, 0.2, 0.9, dark)
    box(g, 0, 0.12, -0.05, 0.12, 0.14, 0.28, mid)
    box(g, 0.1, -0.08, -0.05, 0.08, 0.2, 0.18, acc)
    box(g, 0, 0.02, -0.86, 0.1, 0.1, 0.16, glow)
  } else if (kind === 'scattergun') {
    box(g, 0, 0, -0.28, 0.28, 0.24, 0.62, dark)
    box(g, 0.1, 0.08, -0.55, 0.1, 0.1, 0.36, mid)
    box(g, -0.1, 0.08, -0.55, 0.1, 0.1, 0.36, mid)
    box(g, 0, 0.02, -0.72, 0.3, 0.2, 0.16, glow)
  } else {
    box(g, 0.1, 0.12, -0.2, 0.28, 0.28, 0.7, dark)
    box(g, 0.1, 0.12, -0.62, 0.22, 0.22, 0.28, acc)
    box(g, 0.1, 0.12, -0.82, 0.18, 0.18, 0.18, glow)
  }
  g.userData.muzzle = new THREE.Vector3(0, 0.02, kind === 'blockbuster' ? -0.92 : -0.88)
  return g
}

export function createPlayerState() {
  return {
    pos: new THREE.Vector3(0, 1.02, 12),
    vel: new THREE.Vector3(),
    yaw: 0,
    pitch: -0.08,
    grounded: true,
    sinceGround: 0,
    dashT: 0,
    dashCd: 0,
    airDash: true,
    hp: 100,
    shake: 0,
  }
}

export function lookDir(yaw, pitch, out = new THREE.Vector3()) {
  const cp = Math.cos(pitch)
  return out.set(Math.sin(yaw) * cp, Math.sin(pitch), -Math.cos(yaw) * cp)
}

export function rightDir(yaw, out = new THREE.Vector3()) {
  return out.set(Math.cos(yaw), 0, Math.sin(yaw))
}

export function stepPlayer(p, input, dt, solidAt) {
  lookDir(p.yaw, 0) // yaw-only for move
  const fwd = new THREE.Vector3(Math.sin(p.yaw), 0, -Math.cos(p.yaw))
  const right = rightDir(p.yaw)
  let mx = input.x
  let mz = input.z
  const len = Math.hypot(mx, mz)
  if (len > 1) { mx /= len; mz /= len }

  const wish = new THREE.Vector3()
  wish.addScaledVector(fwd, mz).addScaledVector(right, mx)
  const speed = PLAYER.runSpeed
  const acc = p.grounded ? PLAYER.accel : PLAYER.airAccel

  if (p.dashT > 0) {
    p.dashT -= dt
    const d = p.dashDir || fwd
    p.vel.x = d.x * PLAYER.dashSpeed
    p.vel.z = d.z * PLAYER.dashSpeed
  } else {
    const tx = wish.x * speed
    const tz = wish.z * speed
    p.vel.x += (tx - p.vel.x) * Math.min(1, acc * dt)
    p.vel.z += (tz - p.vel.z) * Math.min(1, acc * dt)
  }

  if (input.dash && p.dashCd <= 0 && (p.grounded || p.airDash)) {
    const d = wish.lengthSq() > 0.01 ? wish.clone().normalize() : fwd.clone()
    p.dashDir = d
    p.dashT = PLAYER.dashTime
    p.dashCd = PLAYER.dashCooldown
    if (!p.grounded) p.airDash = false
    p.justDashed = true
  } else {
    p.justDashed = false
  }
  p.dashCd = Math.max(0, p.dashCd - dt)

  if (p.grounded) p.sinceGround = 0
  else p.sinceGround += dt

  p.justJumped = false
  if (input.jump && (p.grounded || p.sinceGround < PLAYER.coyote)) {
    p.vel.y = PLAYER.jumpV
    p.grounded = false
    p.sinceGround = PLAYER.coyote
    p.justJumped = true
  }

  p.vel.y -= PLAYER.gravity * dt
  if (p.vel.y < -28) p.vel.y = -28

  p.pos.x += p.vel.x * dt
  p.pos.y += p.vel.y * dt
  p.pos.z += p.vel.z * dt

  const wasGrounded = p.grounded
  p.grounded = false
  for (let pass = 0; pass < 3; pass++) resolveVoxels(p, solidAt)
  if (!wasGrounded && p.grounded) p.justLanded = true
  else p.justLanded = false

  if (p.grounded) p.airDash = true
}

function resolveVoxels(p, solidAt) {
  const hw = PLAYER.halfW
  const h = PLAYER.height
  const minX = p.pos.x - hw, maxX = p.pos.x + hw
  const minY = p.pos.y, maxY = p.pos.y + h
  const minZ = p.pos.z - hw, maxZ = p.pos.z + hw
  const x0 = Math.floor(minX), x1 = Math.floor(maxX - 1e-6)
  const y0 = Math.floor(minY), y1 = Math.floor(maxY - 1e-6)
  const z0 = Math.floor(minZ), z1 = Math.floor(maxZ - 1e-6)
  for (let iy = y0; iy <= y1; iy++) {
    for (let iz = z0; iz <= z1; iz++) {
      for (let ix = x0; ix <= x1; ix++) {
        if (!solidAt(ix, iy, iz)) continue
        const cx0 = ix, cx1 = ix + 1
        const cy0 = iy, cy1 = iy + 1
        const cz0 = iz, cz1 = iz + 1
        if (maxX <= cx0 || minX >= cx1 || maxY <= cy0 || minY >= cy1 || maxZ <= cz0 || minZ >= cz1) continue
        const pushX = maxX - cx0 < cx1 - minX ? cx0 - maxX : cx1 - minX
        const pushY = maxY - cy0 < cy1 - minY ? cy0 - maxY : cy1 - minY
        const pushZ = maxZ - cz0 < cz1 - minZ ? cz0 - maxZ : cz1 - minZ
        const ax = Math.abs(pushX), ay = Math.abs(pushY), az = Math.abs(pushZ)
        if (ay <= ax && ay <= az) {
          p.pos.y += pushY
          if (pushY > 0 && p.vel.y <= 0) { p.grounded = true; p.vel.y = 0 }
          else if (pushY < 0 && p.vel.y > 0) p.vel.y = 0
        } else if (ax <= az) {
          p.pos.x += pushX
          p.vel.x = 0
        } else {
          p.pos.z += pushZ
          p.vel.z = 0
        }
      }
    }
  }
}

export function syncCowboy(p, mesh, now, moving) {
  mesh.root.position.copy(p.pos)
  mesh.root.rotation.y = p.yaw
  const bob = moving && p.grounded ? Math.sin(now * 0.012) * 0.035 : 0
  mesh.body.position.y = bob
  mesh.body.rotation.x = p.dashT > 0 ? 0.12 : 0
}
