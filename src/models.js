import * as THREE from 'three'
import { toon, addEdges } from './toon.js'

export const SHIBA_KINDS = {
  aka: {
    id: 'aka', name: '赤柴', nameEn: 'AKA',
    body: 0xe07a3a, shade: 0xc45f28, cream: 0xf6e2c4, eye: 0x2a1c12,
    topSpeed: 26.5, accel: 16, turn: 2.55, dash: 14,
    desc: 'バランス型', descZh: '平衡型，最好上手',
  },
  kuro: {
    id: 'kuro', name: '黒柴', nameEn: 'KURO',
    body: 0x2b241f, shade: 0x1a1512, cream: 0xd9a066, eye: 0x1a120c,
    topSpeed: 30.2, accel: 13.5, turn: 1.92, dash: 11,
    desc: '最高速', descZh: '极速型，弯道较钝',
  },
  shiro: {
    id: 'shiro', name: '白柴', nameEn: 'SHIRO',
    body: 0xf2e6d0, shade: 0xe0cba8, cream: 0xfff8ee, eye: 0x4a3322,
    topSpeed: 25.2, accel: 17, turn: 2.95, dash: 17,
    desc: 'コーナリング', descZh: '过弯灵巧，Dash 强',
  },
  goma: {
    id: 'goma', name: '胡麻柴', nameEn: 'GOMA',
    body: 0x8a5a32, shade: 0x5c3a20, cream: 0xead2ae, eye: 0x24180f,
    topSpeed: 24.4, accel: 15, turn: 2.35, dash: 22,
    desc: 'ダッシュ特化', descZh: '金币加速最猛',
  },
}

const GEO = {
  sphere: new THREE.SphereGeometry(1, 12, 10),
  sphereLo: new THREE.SphereGeometry(1, 8, 7),
  cyl: new THREE.CylinderGeometry(1, 1, 1, 8),
  cone: new THREE.ConeGeometry(1, 1, 8),
  box: new THREE.BoxGeometry(1, 1, 1),
  torus: new THREE.TorusGeometry(1, 0.38, 8, 14),
}

function mesh(geo, mat, x, y, z, sx = 1, sy = 1, sz = 1) {
  const m = new THREE.Mesh(geo, mat)
  m.position.set(x, y, z)
  m.scale.set(sx, sy, sz)
  m.castShadow = true
  return m
}

export function createShiba(kindId, { raincoat = false, board = false } = {}) {
  const k = SHIBA_KINDS[kindId] || SHIBA_KINDS.aka
  const g = new THREE.Group()
  const bodyM = toon(k.body)
  const shadeM = toon(k.shade)
  const creamM = toon(k.cream)
  const blackM = toon(0x1a1410)
  const noseM = toon(0x1c1210)
  const eyeWhite = toon(0xfff8ee)

  const body = mesh(GEO.sphere, bodyM, 0, 0.42, 0, 0.38, 0.32, 0.48)
  g.add(body)
  const chest = mesh(GEO.sphere, creamM, 0, 0.36, 0.22, 0.24, 0.22, 0.22)
  g.add(chest)

  const head = mesh(GEO.sphere, bodyM, 0, 0.68, 0.38, 0.28, 0.26, 0.26)
  g.add(head)
  const muzzle = mesh(GEO.sphere, creamM, 0, 0.58, 0.58, 0.16, 0.13, 0.16)
  g.add(muzzle)
  const nose = mesh(GEO.sphere, noseM, 0, 0.6, 0.72, 0.05, 0.04, 0.04)
  g.add(nose)

  const brows = []
  const eyes = []
  const ears = []
  for (const s of [-1, 1]) {
    const brow = mesh(GEO.sphere, creamM, 0.11 * s, 0.78, 0.5, 0.055, 0.045, 0.04)
    g.add(brow)
    brows.push(brow)
    const white = mesh(GEO.sphere, eyeWhite, 0.1 * s, 0.7, 0.58, 0.055, 0.06, 0.03)
    g.add(white)
    const eye = mesh(GEO.sphere, blackM, 0.1 * s, 0.7, 0.605, 0.032, 0.038, 0.02)
    g.add(eye)
    eyes.push(eye)
    const ear = mesh(GEO.cone, shadeM, 0.18 * s, 0.92, 0.32, 0.1, 0.2, 0.08)
    ear.rotation.z = s * -0.45
    ear.rotation.x = -0.35
    g.add(ear)
    ears.push(ear)
    const inner = mesh(GEO.cone, creamM, 0.17 * s, 0.9, 0.34, 0.055, 0.12, 0.04)
    inner.rotation.copy(ear.rotation)
    g.add(inner)
  }

  const legs = []
  const sockM = creamM
  for (const [lx, lz] of [[-0.16, 0.18], [0.16, 0.18], [-0.16, -0.2], [0.16, -0.2]]) {
    const leg = mesh(GEO.cyl, bodyM, lx, 0.16, lz, 0.07, 0.28, 0.07)
    g.add(leg)
    legs.push(leg)
    const sock = mesh(GEO.sphere, sockM, lx, 0.05, lz, 0.075, 0.06, 0.08)
    g.add(sock)
  }

  const tail = new THREE.Group()
  tail.position.set(0, 0.52, -0.42)
  const curl = mesh(GEO.torus, bodyM, 0.02, 0.1, 0, 0.13, 0.13, 0.13)
  curl.rotation.x = 1.15
  curl.rotation.z = 0.4
  tail.add(curl)
  const tip = mesh(GEO.sphere, creamM, 0.12, 0.16, -0.04, 0.06, 0.06, 0.06)
  tail.add(tip)
  g.add(tail)

  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.04, 8, 18), toon(0xe03131))
  collar.rotation.x = Math.PI / 2
  collar.position.set(0, 0.52, 0.22)
  collar.castShadow = true
  g.add(collar)

  const stick = mesh(GEO.cyl, toon(0x8b5a2b), 0, 0.62, 0.78, 0.045, 2.6, 0.045)
  stick.rotation.z = Math.PI / 2
  stick.visible = false
  g.add(stick)

  let coat = null
  if (raincoat) {
    coat = mesh(GEO.sphere, toon(0x3ecf6a, { transparent: true, opacity: 0.72 }), 0, 0.5, 0.08, 0.42, 0.28, 0.52)
    g.add(coat)
    const hood = mesh(GEO.sphere, toon(0x34b85c), 0, 0.78, 0.32, 0.3, 0.16, 0.28)
    g.add(hood)
  }

  let paddle = null
  if (board) {
    paddle = mesh(GEO.box, toon(0xf2d08a), 0, 0.02, 0.05, 0.42, 0.06, 1.15)
    g.add(paddle)
    const stripe = mesh(GEO.box, toon(0xe07a3a), 0, 0.055, 0.05, 0.12, 0.02, 1.0)
    g.add(stripe)
  }

  addEdges(g, { threshold: 28 })
  g.traverse((o) => { if (o.isMesh) o.castShadow = true })

  return {
    group: g, body, head, muzzle, legs, tail, ears, eyes, stick, coat, paddle, kind: k,
  }
}

export function animateShiba(shiba, { speed, steer = 0, boost = false, now, airborne = false }) {
  const g = shiba.group
  const run = Math.min(1, speed / 12)
  const t = now * 0.02 * (0.7 + run * 1.6)
  const swing = Math.sin(t) * 0.7 * run * (airborne ? 0.15 : 1)
  shiba.legs[0].rotation.x = swing
  shiba.legs[1].rotation.x = -swing
  shiba.legs[2].rotation.x = -swing
  shiba.legs[3].rotation.x = swing
  shiba.body.rotation.x = Math.sin(t) * 0.08 * run
  shiba.head.rotation.y = steer * -0.25
  shiba.tail.rotation.y = Math.sin(now * 0.012) * 0.5
  g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -steer * 0.28, 0.15)
  const stretch = boost ? 1.18 : 1
  g.scale.set(1 / Math.sqrt(stretch), 1, stretch)
  if (airborne) shiba.legs.forEach((leg) => { leg.rotation.x = -0.5 })
}

export function createOwner() {
  const g = new THREE.Group()
  const skin = toon(0xf3c7a3)
  const shirt = toon(0x3d7ea6)
  const pants = toon(0x3a3f55)
  const hair = toon(0x2b221c)

  const torso = mesh(GEO.sphere, shirt, 0, 0, 0, 0.22, 0.16, 0.32)
  g.add(torso)
  const head = mesh(GEO.sphere, skin, 0, 0.08, 0.38, 0.16, 0.16, 0.16)
  g.add(head)
  const hairM = mesh(GEO.sphere, hair, 0, 0.14, 0.34, 0.17, 0.12, 0.16)
  g.add(hairM)
  const bang = mesh(GEO.sphere, hair, 0, 0.16, 0.46, 0.12, 0.06, 0.06)
  g.add(bang)

  const arms = []
  for (const s of [-1, 1]) {
    const arm = mesh(GEO.cyl, shirt, 0.2 * s, 0.04, 0.18, 0.05, 0.42, 0.05)
    arm.rotation.x = 0.9
    g.add(arm)
    arms.push(arm)
    const hand = mesh(GEO.sphere, skin, 0.2 * s, 0.02, 0.42, 0.055, 0.055, 0.055)
    g.add(hand)
  }
  const legs = []
  for (const s of [-1, 1]) {
    const leg = mesh(GEO.cyl, pants, 0.1 * s, -0.02, -0.28, 0.06, 0.38, 0.06)
    leg.rotation.x = 0.4
    g.add(leg)
    legs.push(leg)
    const shoe = mesh(GEO.sphere, toon(0x2a2a32), 0.1 * s, -0.04, -0.48, 0.07, 0.045, 0.1)
    g.add(shoe)
  }
  const mouth = mesh(GEO.box, toon(0x6a2030), 0, 0.02, 0.5, 0.08, 0.03, 0.02)
  g.add(mouth)
  addEdges(g, { threshold: 30 })
  return { group: g, arms, legs, head }
}

export function animateOwner(owner, { speed, now, stunned = false }) {
  const flop = Math.sin(now * 0.025 * (1 + speed / 20)) * 0.5
  owner.arms[0].rotation.z = 0.4 + flop
  owner.arms[1].rotation.z = -0.4 - flop
  owner.legs[0].rotation.x = 0.5 + flop * 0.6
  owner.legs[1].rotation.x = 0.5 - flop * 0.6
  owner.head.rotation.x = stunned ? 0.35 : Math.sin(now * 0.01) * 0.1
}

export function createLeash() {
  const mat = new THREE.LineBasicMaterial({ color: 0xc45a2a, linewidth: 2 })
  const geo = new THREE.BufferGeometry()
  const pos = new Float32Array(8 * 3)
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const line = new THREE.Line(geo, mat)
  line.frustumCulled = false
  const tube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 1, 5),
    toon(0xc45a2a)
  )
  tube.userData.noEdges = true
  return { line, tube, pos }
}

export function updateLeash(leash, from, to) {
  const mid = from.clone().lerp(to, 0.5)
  mid.y -= 0.35
  const pts = [from, from.clone().lerp(mid, 0.5), mid, mid.clone().lerp(to, 0.5), to]
  const attr = leash.line.geometry.attributes.position
  // resample to 8
  for (let i = 0; i < 8; i++) {
    const t = i / 7
    const a = Math.min(3, Math.floor(t * 4))
    const lt = t * 4 - a
    const p = pts[a].clone().lerp(pts[Math.min(4, a + 1)], lt)
    attr.setXYZ(i, p.x, p.y, p.z)
  }
  attr.needsUpdate = true
  const delta = to.clone().sub(from)
  const len = Math.max(0.2, delta.length())
  leash.tube.position.copy(from).add(to).multiplyScalar(0.5)
  leash.tube.scale.set(1, len, 1)
  leash.tube.lookAt(to)
  leash.tube.rotateX(Math.PI / 2)
}

export function createCoin() {
  const m = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.42, 0.08, 16),
    toon(0xffc933, { emissive: 0x5c4400 })
  )
  m.rotation.x = Math.PI / 2
  m.castShadow = true
  addEdges(m, { threshold: 40, light: true })
  return m
}

export function createSneaker() {
  const g = new THREE.Group()
  const body = mesh(GEO.box, toon(0xf2f2f7), 0, 0, 0, 0.42, 0.22, 0.7)
  g.add(body)
  const toe = mesh(GEO.sphere, toon(0xffffff), 0, -0.02, 0.28, 0.2, 0.12, 0.18)
  g.add(toe)
  const stripe = mesh(GEO.box, toon(0xff4d6d), 0.12, 0.04, 0, 0.04, 0.16, 0.5)
  g.add(stripe)
  const swoosh = mesh(GEO.box, toon(0x3ee0e8), -0.12, 0.02, 0, 0.04, 0.12, 0.45)
  g.add(swoosh)
  g.traverse((o) => { if (o.isMesh) o.castShadow = true })
  addEdges(g)
  return g
}

export function createStickItem() {
  const m = mesh(GEO.cyl, toon(0x8b5a2b), 0, 0, 0, 0.07, 1.4, 0.07)
  m.rotation.z = Math.PI / 2
  addEdges(m)
  return m
}

export function createBoostPanel(w = 3.2, d = 4.2) {
  const m = new THREE.Mesh(
    new THREE.BoxGeometry(w, 0.08, d),
    toon(0x3ee0e8, { emissive: 0x146e74 })
  )
  const arrow = new THREE.Mesh(
    new THREE.ConeGeometry(0.45, 1.1, 3),
    toon(0xffffff, { emissive: 0x88ffff })
  )
  arrow.rotation.x = -Math.PI / 2
  arrow.position.y = 0.12
  m.add(arrow)
  m.userData.arrow = arrow
  return m
}

export function createNameTag(text, color = '#fff') {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 64
  const ctx = c.getContext('2d')
  ctx.fillStyle = 'rgba(30, 20, 12, 0.7)'
  ctx.beginPath()
  if (ctx.roundRect) ctx.roundRect(8, 8, 240, 48, 12)
  else ctx.rect(8, 8, 240, 48)
  ctx.fill()
  ctx.fillStyle = color
  ctx.font = 'bold 28px Trebuchet MS, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 128, 32)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }))
  spr.scale.set(1.8, 0.45, 1)
  spr.center.set(0.5, 0)
  return spr
}
