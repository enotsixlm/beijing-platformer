import * as THREE from 'three'
import { PLAYER } from './config.js'

function box(parent, x, y, z, w, h, d, mat) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
  m.position.set(x, y, z)
  parent.add(m)
  return m
}

function mat(color, emissive = 0x000000, ei = 0) {
  return new THREE.MeshLambertMaterial({ color, emissive, emissiveIntensity: ei })
}

function glowMat(color) {
  return new THREE.MeshBasicMaterial({ color })
}

function blobShadow(parent, y = 0.02, r = 0.42) {
  const s = new THREE.Mesh(
    new THREE.CircleGeometry(r, 20),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.38, depthWrite: false }),
  )
  s.rotation.x = -Math.PI / 2
  s.position.y = y
  parent.add(s)
  return s
}

export function createCowboy() {
  const root = new THREE.Group()
  const L = new THREE.Group()
  root.add(L)

  const leather = mat(0x8a4a24)
  const leatherD = mat(0x5c3014)
  const khaki = mat(0xc4a06a)
  const khakiD = mat(0x9a7848)
  const skin = mat(0xe8b892)
  const boot = mat(0x3a2414)
  const pack = mat(0x6e747c)
  const hat = mat(0x7a4218)
  const band = mat(0xc45a48)
  const scarf = mat(0x3a6ea8)
  const orange = glowMat(0xff7a18)
  const buckle = glowMat(0xffc14a)

  const V = 0.072
  const vox = (px, py, pz, w, h, d, m) => box(L, px * V, py * V, pz * V, w * V, h * V, d * V, m)

  vox(-2.1, 1.3, 1.4, 3.0, 2.6, 4.0, boot)
  vox(2.1, 1.3, 1.4, 3.0, 2.6, 4.0, boot)
  vox(-2.1, 5.1, 0.4, 2.8, 5.0, 3.0, khaki)
  vox(2.1, 5.1, 0.4, 2.8, 5.0, 3.0, khaki)
  vox(0, 8.2, 0.2, 6.8, 2.0, 3.6, khakiD)
  vox(0, 9.5, 0.25, 7.0, 1.0, 3.8, leatherD)
  vox(0, 9.5, 2.2, 1.5, 0.7, 0.6, buckle)
  vox(0, 13.2, 0.0, 6.8, 6.6, 3.8, leather)
  vox(0, 16.4, 0.7, 5.0, 1.1, 3.0, leatherD)
  vox(0, 15.4, -2.0, 3.6, 1.6, 1.4, scarf)
  const armL = vox(-5.2, 12.8, 0.1, 2.2, 6.4, 2.2, leather)
  const armR = vox(5.2, 12.8, 0.1, 2.2, 6.4, 2.2, leather)
  vox(-5.2, 9.2, 0.1, 2.0, 1.5, 2.0, skin)
  vox(5.2, 9.2, 0.1, 2.0, 1.5, 2.0, skin)
  vox(0, 13.4, 2.7, 5.4, 5.8, 2.4, pack)
  vox(-1.5, 13.0, 3.8, 0.7, 2.6, 0.5, orange)
  vox(1.5, 13.0, 3.8, 0.7, 2.6, 0.5, orange)
  vox(0, 16.0, 3.8, 3.2, 0.7, 0.5, orange)
  vox(0, 19.0, -1.5, 4.4, 4.4, 4.4, skin)
  vox(0, 21.6, -1.5, 4.8, 2.0, 4.8, hat)
  vox(0, 20.6, -1.5, 9.0, 0.85, 9.0, hat)
  vox(0, 20.7, -1.5, 5.2, 0.7, 5.2, band)

  const weaponRoot = new THREE.Group()
  weaponRoot.position.set(0.5, 1.02, -0.18)
  L.add(weaponRoot)

  const backRoot = new THREE.Group()
  backRoot.position.set(0.02, 1.18, 0.36)
  backRoot.rotation.set(1.05, 0.15, 0.08)
  L.add(backRoot)

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

  const holster = {
    scattergun: makeGun('scattergun'),
    blockbuster: makeGun('blockbuster'),
  }
  holster.scattergun.scale.setScalar(0.46)
  holster.scattergun.position.set(-0.16, 0, 0)
  holster.blockbuster.scale.setScalar(0.78)
  holster.blockbuster.position.set(0.08, 0.06, 0)
  backRoot.add(holster.scattergun)
  backRoot.add(holster.blockbuster)

  blobShadow(root, 0.03, 0.46)

  return { root, body: L, armL, armR, weaponRoot, guns, holster }
}

function makeGun(kind) {
  const g = new THREE.Group()
  const dark = mat(0x2a2e33)
  const mid = mat(0x4a5158)
  const acc = glowMat(0xff7a18)
  const glow = glowMat(0xffc14a)
  if (kind === 'cannon') {
    box(g, 0, 0, -0.28, 0.28, 0.34, 0.62, dark)
    box(g, 0, 0.04, -0.72, 0.2, 0.2, 0.42, mid)
    box(g, 0.14, -0.14, -0.12, 0.12, 0.26, 0.2, acc)
    box(g, 0, 0.04, -0.96, 0.18, 0.18, 0.14, glow)
  } else if (kind === 'autogun') {
    box(g, 0, 0.04, -0.42, 0.2, 0.24, 1.12, dark)
    box(g, 0, 0.16, -0.08, 0.16, 0.16, 0.34, mid)
    box(g, 0.12, -0.1, -0.06, 0.1, 0.22, 0.2, acc)
    box(g, 0, 0.04, -1.02, 0.14, 0.14, 0.2, glow)
  } else if (kind === 'scattergun') {
    box(g, 0, 0, -0.34, 0.34, 0.28, 0.72, dark)
    box(g, 0.12, 0.1, -0.68, 0.12, 0.12, 0.42, mid)
    box(g, -0.12, 0.1, -0.68, 0.12, 0.12, 0.42, mid)
    box(g, 0, 0.02, -0.88, 0.36, 0.22, 0.18, glow)
  } else {
    box(g, 0.08, 0.16, -0.22, 0.36, 0.34, 0.86, dark)
    box(g, 0.08, 0.16, -0.72, 0.28, 0.28, 0.32, acc)
    box(g, 0.08, 0.16, -0.98, 0.24, 0.24, 0.22, glow)
  }
  g.userData.muzzle = new THREE.Vector3(0, 0.04, kind === 'blockbuster' ? -1.12 : -1.05)
  return g
}

export function createPlayerState() {
  return {
    pos: new THREE.Vector3(0, 1.02, 12),
    vel: new THREE.Vector3(),
    yaw: 0,
    pitch: -0.1,
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
  lookDir(p.yaw, 0)
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

export function syncCowboy(p, mesh, now, moving, activeId) {
  mesh.root.position.copy(p.pos)
  mesh.root.rotation.y = p.yaw
  const bob = moving && p.grounded ? Math.sin(now * 0.012) * 0.03 : 0
  mesh.body.position.y = bob
  mesh.body.rotation.x = 0.14 + (p.dashT > 0 ? 0.22 : 0)
  mesh.weaponRoot.rotation.x = -p.pitch * 0.5
  if (mesh.holster && activeId) {
    for (const [id, g] of Object.entries(mesh.holster)) g.visible = id !== activeId
  }
}
