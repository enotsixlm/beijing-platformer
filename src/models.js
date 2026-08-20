import * as THREE from 'three'
import { toon, addOutline } from './toon.js'

export const SHIBA_KINDS = {
  aka: {
    id: 'aka', name: '赤柴', nameEn: 'AKA',
    body: 0xe3923f, shade: 0xc56e28, cream: 0xf6e4c2, eye: 0x2a1c12,
    topSpeed: 26.5, accel: 16, turn: 2.55, dash: 14,
    desc: 'バランス型', descZh: '平衡型，最好上手',
  },
  kuro: {
    id: 'kuro', name: '黒柴', nameEn: 'KURO',
    body: 0x2a231e, shade: 0x16110e, cream: 0xe0b07a, eye: 0x1a120c,
    topSpeed: 30.2, accel: 13.5, turn: 1.92, dash: 11,
    desc: '最高速', descZh: '极速型，弯道较钝',
  },
  shiro: {
    id: 'shiro', name: '白柴', nameEn: 'SHIRO',
    body: 0xf4ead6, shade: 0xe2d0b0, cream: 0xfffaf3, eye: 0x5a3a22,
    topSpeed: 25.2, accel: 17, turn: 2.95, dash: 17,
    desc: 'コーナリング', descZh: '过弯灵巧，Dash 强',
  },
  goma: {
    id: 'goma', name: '胡麻柴', nameEn: 'GOMA',
    body: 0x9a6840, shade: 0x5c3a22, cream: 0xead4b0, eye: 0x24180f,
    topSpeed: 24.4, accel: 15, turn: 2.35, dash: 22,
    desc: 'ダッシュ特化', descZh: '金币加速最猛',
  },
}

const GEO = {
  sphere: new THREE.SphereGeometry(1, 18, 14),
  sphereLo: new THREE.SphereGeometry(1, 12, 10),
  cyl: new THREE.CylinderGeometry(1, 1, 1, 10),
  cone: new THREE.ConeGeometry(1, 1, 8),
  box: new THREE.BoxGeometry(1, 1, 1),
  torus: new THREE.TorusGeometry(1, 0.42, 10, 18, Math.PI * 1.35),
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
  const blackM = toon(0x1c1410)
  const noseM = toon(0x1a100c)
  const eyeWhite = toon(0xfff8ee)
  const tongueM = toon(0xe85a6a)

  // 身体：略长、前倾，像在跑
  const bodyG = new THREE.Group()
  bodyG.position.y = 0.02
  const body = mesh(GEO.sphere, bodyM, 0, 0.42, 0.02, 0.40, 0.34, 0.55)
  bodyG.add(body)
  const belly = mesh(GEO.sphere, creamM, 0, 0.32, 0.08, 0.30, 0.22, 0.42)
  bodyG.add(belly)
  g.add(bodyG)

  // 头 + 狐狸脸 + 裏白
  const headG = new THREE.Group()
  headG.position.set(0, 0.70, 0.42)
  const head = mesh(GEO.sphere, bodyM, 0, 0, 0, 0.30, 0.28, 0.28)
  headG.add(head)
  const cheekL = mesh(GEO.sphere, creamM, -0.16, -0.04, 0.12, 0.12, 0.11, 0.12)
  const cheekR = mesh(GEO.sphere, creamM, 0.16, -0.04, 0.12, 0.12, 0.11, 0.12)
  headG.add(cheekL, cheekR)
  const muzzle = mesh(GEO.sphere, creamM, 0, -0.08, 0.24, 0.16, 0.13, 0.20)
  headG.add(muzzle)
  const nose = mesh(GEO.sphere, noseM, 0, -0.06, 0.42, 0.045, 0.038, 0.04)
  headG.add(nose)
  const tongue = mesh(GEO.box, tongueM, 0, -0.16, 0.36, 0.07, 0.04, 0.10)
  tongue.visible = false
  headG.add(tongue)

  const ears = []
  const eyes = []
  for (const s of [-1, 1]) {
    const brow = mesh(GEO.sphere, creamM, 0.12 * s, 0.12, 0.16, 0.07, 0.055, 0.05)
    headG.add(brow)
    const white = mesh(GEO.sphere, eyeWhite, 0.11 * s, 0.02, 0.22, 0.07, 0.08, 0.04)
    headG.add(white)
    const iris = mesh(GEO.sphere, blackM, 0.11 * s, 0.015, 0.255, 0.04, 0.048, 0.025)
    headG.add(iris)
    const shine = mesh(GEO.sphere, eyeWhite, 0.09 * s, 0.035, 0.27, 0.016, 0.018, 0.01)
    shine.userData.noOutline = true
    headG.add(shine)
    eyes.push(iris)

    const ear = mesh(GEO.cone, shadeM, 0.18 * s, 0.28, -0.04, 0.11, 0.24, 0.08)
    ear.rotation.z = s * -0.38
    ear.rotation.x = -0.28
    headG.add(ear)
    ears.push(ear)
    const inner = mesh(GEO.cone, creamM, 0.17 * s, 0.26, -0.01, 0.06, 0.14, 0.04)
    inner.rotation.copy(ear.rotation)
    inner.userData.noOutline = true
    headG.add(inner)
  }
  g.add(headG)

  const legs = []
  const socks = []
  for (const [lx, lz] of [[-0.16, 0.20], [0.16, 0.20], [-0.17, -0.22], [0.17, -0.22]]) {
    const leg = mesh(GEO.cyl, bodyM, lx, 0.18, lz, 0.08, 0.30, 0.08)
    g.add(leg)
    legs.push(leg)
    const sock = mesh(GEO.sphere, creamM, lx, 0.05, lz, 0.085, 0.065, 0.09)
    g.add(sock)
    socks.push(sock)
  }

  // 卷尾贴在背上 —— 柴犬辨识度的关键
  const tail = new THREE.Group()
  tail.position.set(0.02, 0.58, -0.38)
  const curl = new THREE.Mesh(GEO.torus, bodyM)
  curl.scale.set(0.13, 0.13, 0.13)
  curl.rotation.set(1.05, 0.15, 0.85)
  curl.position.set(0.04, 0.12, 0.02)
  curl.castShadow = true
  tail.add(curl)
  const tip = mesh(GEO.sphere, creamM, 0.14, 0.20, 0.02, 0.055, 0.055, 0.055)
  tail.add(tip)
  g.add(tail)

  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.035, 8, 20), toon(0xe03131))
  collar.rotation.x = Math.PI / 2
  collar.position.set(0, 0.54, 0.26)
  collar.castShadow = true
  g.add(collar)
  const tag = mesh(GEO.box, toon(0xffd24a), 0, 0.46, 0.44, 0.08, 0.09, 0.02)
  g.add(tag)

  const stick = mesh(GEO.cyl, toon(0x8b5a2b), 0, 0.58, 0.72, 0.04, 2.8, 0.04)
  stick.rotation.z = Math.PI / 2
  stick.visible = false
  g.add(stick)

  let coat = null
  if (raincoat) {
    coat = mesh(GEO.sphere, toon(0x3ecf6a, { transparent: true, opacity: 0.78 }), 0, 0.48, 0.06, 0.44, 0.28, 0.54)
    g.add(coat)
    const hood = mesh(GEO.sphere, toon(0x2fb056), 0, 0.82, 0.32, 0.28, 0.16, 0.26)
    g.add(hood)
  }

  let paddle = null
  if (board) {
    paddle = mesh(GEO.box, toon(0xf3d08c), 0, 0.03, 0.06, 0.46, 0.07, 1.28)
    g.add(paddle)
    const stripe = mesh(GEO.box, toon(0xe07a3a), 0, 0.07, 0.06, 0.12, 0.02, 1.1)
    stripe.userData.noOutline = true
    g.add(stripe)
  }

  if (kindId === 'goma') {
    for (const [x, y, z, s] of [[0.12, 0.5, -0.1, 0.08], [-0.1, 0.52, 0.05, 0.07], [0.05, 0.46, -0.22, 0.06]]) {
      const speckle = mesh(GEO.sphereLo, shadeM, x, y, z, s, s * 0.7, s)
      speckle.userData.noOutline = true
      g.add(speckle)
    }
  }

  addOutline(g, 0.06)
  g.traverse((o) => { if (o.isMesh && !o.userData.noOutline) o.castShadow = true })

  return {
    group: g, body, bodyG, headG, head, muzzle, legs, tail, ears, eyes, stick, coat, paddle, tongue, kind: k,
  }
}

export function animateShiba(shiba, { speed, steer = 0, boost = false, now, airborne = false }) {
  const g = shiba.group
  const run = Math.min(1, speed / 12)
  const t = now * 0.021 * (0.7 + run * 1.7)
  const swing = Math.sin(t) * 0.85 * run * (airborne ? 0.12 : 1)
  shiba.legs[0].rotation.x = swing
  shiba.legs[1].rotation.x = -swing
  shiba.legs[2].rotation.x = -swing * 0.95
  shiba.legs[3].rotation.x = swing * 0.95
  if (shiba.bodyG) shiba.bodyG.rotation.x = Math.sin(t) * 0.07 * run - 0.08 * run
  if (shiba.headG) {
    shiba.headG.rotation.y = steer * -0.28
    shiba.headG.rotation.x = airborne ? -0.15 : Math.sin(t) * 0.06 * run
  } else {
    shiba.head.rotation.y = steer * -0.25
  }
  shiba.tail.rotation.z = Math.sin(now * 0.014) * 0.25
  shiba.tail.rotation.y = Math.sin(now * 0.011) * 0.35
  g.rotation.z = THREE.MathUtils.lerp(g.rotation.z || 0, -steer * 0.32, 0.18)
  const stretch = boost ? 1.16 : 1
  g.scale.set(1 / Math.sqrt(stretch), 1, stretch)
  if (shiba.tongue) shiba.tongue.visible = run > 0.45 && !airborne
  if (airborne) shiba.legs.forEach((leg) => { leg.rotation.x = -0.55 })
}

export function createOwner() {
  const g = new THREE.Group()
  const skin = toon(0xf4c7a6)
  const hoodie = toon(0x3e8ec4)
  const hoodieDark = toon(0x3278a8)
  const pants = toon(0x3b4258)
  const hair = toon(0x2c221c)
  const shoe = toon(0xf3f1ec)
  const shoeAcc = toon(0xe03131)

  const torso = mesh(GEO.sphere, hoodie, 0, 0.02, 0.02, 0.24, 0.18, 0.36)
  g.add(torso)
  const hood = mesh(GEO.sphere, hoodieDark, 0, 0.08, -0.18, 0.18, 0.12, 0.14)
  g.add(hood)

  const head = mesh(GEO.sphere, skin, 0, 0.10, 0.40, 0.17, 0.17, 0.17)
  g.add(head)
  const hairM = mesh(GEO.sphere, hair, 0, 0.16, 0.34, 0.18, 0.12, 0.17)
  g.add(hairM)
  const bang = mesh(GEO.sphere, hair, 0, 0.18, 0.48, 0.13, 0.06, 0.07)
  g.add(bang)

  for (const s of [-1, 1]) {
    const eyeW = mesh(GEO.sphere, toon(0xfff8ee), 0.055 * s, 0.12, 0.54, 0.045, 0.05, 0.02)
    g.add(eyeW)
    const iris = mesh(GEO.sphere, toon(0x1a1410), 0.055 * s, 0.12, 0.555, 0.028, 0.032, 0.012)
    g.add(iris)
  }
  const mouth = mesh(GEO.sphere, toon(0x6a2030), 0, 0.04, 0.55, 0.05, 0.035, 0.03)
  g.add(mouth)

  const arms = []
  for (const s of [-1, 1]) {
    const arm = mesh(GEO.cyl, hoodie, 0.22 * s, 0.04, 0.22, 0.055, 0.48, 0.055)
    arm.rotation.x = 1.05
    g.add(arm)
    arms.push(arm)
    const hand = mesh(GEO.sphere, skin, 0.22 * s, 0.02, 0.48, 0.06, 0.055, 0.06)
    g.add(hand)
  }
  const legs = []
  for (const s of [-1, 1]) {
    const leg = mesh(GEO.cyl, pants, 0.1 * s, 0.0, -0.30, 0.065, 0.42, 0.065)
    leg.rotation.x = 0.45
    g.add(leg)
    legs.push(leg)
    const sn = mesh(GEO.sphere, shoe, 0.1 * s, -0.02, -0.52, 0.08, 0.05, 0.12)
    g.add(sn)
    const stripe = mesh(GEO.box, shoeAcc, 0.1 * s, 0.01, -0.50, 0.09, 0.02, 0.04)
    stripe.userData.noOutline = true
    g.add(stripe)
  }

  addOutline(g, 0.055)
  return { group: g, arms, legs, head }
}

export function animateOwner(owner, { speed, now, stunned = false }) {
  const flop = Math.sin(now * 0.028 * (1 + speed / 18)) * 0.55
  owner.arms[0].rotation.z = 0.45 + flop
  owner.arms[1].rotation.z = -0.45 - flop
  owner.legs[0].rotation.x = 0.55 + flop * 0.7
  owner.legs[1].rotation.x = 0.55 - flop * 0.7
  owner.head.rotation.x = stunned ? 0.4 : 0.12 + Math.sin(now * 0.01) * 0.08
}

export function createLeash() {
  const mat = new THREE.LineBasicMaterial({ color: 0xe07040 })
  const geo = new THREE.BufferGeometry()
  const pos = new Float32Array(8 * 3)
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const line = new THREE.Line(geo, mat)
  line.frustumCulled = false
  const tube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, 1, 6),
    toon(0xe07040)
  )
  tube.userData.noOutline = true
  tube.userData.noEdges = true
  return { line, tube, pos }
}

export function updateLeash(leash, from, to) {
  const mid = from.clone().lerp(to, 0.5)
  mid.y -= 0.28
  const pts = [from, from.clone().lerp(mid, 0.5), mid, mid.clone().lerp(to, 0.5), to]
  const attr = leash.line.geometry.attributes.position
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
  const g = new THREE.Group()
  const m = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.38, 0.08, 20),
    toon(0xffd24a, { emissive: 0x7a5a00 })
  )
  m.rotation.x = Math.PI / 2
  m.castShadow = true
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.04, 8, 20), toon(0xffee88, { emissive: 0x886600 }))
  rim.castShadow = true
  const star = mesh(GEO.sphere, toon(0xfff3c0, { emissive: 0xaa8800 }), 0, 0, 0.05, 0.12, 0.12, 0.03)
  star.userData.noOutline = true
  g.add(m, rim, star)
  addOutline(g, 0.05)
  g.userData.spin = m
  return g
}

export function createSneaker() {
  const g = new THREE.Group()
  g.add(mesh(GEO.box, toon(0xf7f6f2), 0, 0, 0, 0.40, 0.20, 0.72))
  g.add(mesh(GEO.sphere, toon(0xffffff), 0, -0.02, 0.30, 0.20, 0.12, 0.20))
  g.add(mesh(GEO.box, toon(0xff4d6d), 0.14, 0.04, 0.02, 0.04, 0.14, 0.5))
  const swoosh = mesh(GEO.box, toon(0x3ee0e8), -0.14, 0.02, 0.02, 0.04, 0.1, 0.42)
  swoosh.userData.noOutline = true
  g.add(swoosh)
  addOutline(g, 0.05)
  g.traverse((o) => { if (o.isMesh) o.castShadow = true })
  return g
}

export function createStickItem() {
  const m = mesh(GEO.cyl, toon(0x8b5a2b), 0, 0, 0, 0.07, 1.5, 0.07)
  m.rotation.z = Math.PI / 2
  addOutline(m, 0.05)
  return m
}

export function createBoostPanel(w = 3.4, d = 4.4) {
  const m = new THREE.Mesh(
    new THREE.BoxGeometry(w, 0.1, d),
    toon(0x3ee8f0, { emissive: 0x1aa8b0 })
  )
  m.userData.noOutline = true
  const chevron = (z) => {
    const a = new THREE.Mesh(
      new THREE.ConeGeometry(0.55, 1.15, 3),
      toon(0xffffff, { emissive: 0x88ffff })
    )
    a.rotation.x = -Math.PI / 2
    a.position.set(0, 0.14, z)
    a.userData.noOutline = true
    return a
  }
  const a1 = chevron(0.55)
  const a2 = chevron(-0.55)
  m.add(a1, a2)
  m.userData.arrow = a1
  return m
}

export function createNameTag(text, color = '#fff') {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 64
  const ctx = c.getContext('2d')
  ctx.fillStyle = 'rgba(40, 24, 14, 0.72)'
  ctx.beginPath()
  if (ctx.roundRect) ctx.roundRect(8, 8, 240, 48, 16)
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
  spr.scale.set(1.9, 0.48, 1)
  spr.center.set(0.5, 0)
  return spr
}

export function createMenuStage() {
  const g = new THREE.Group()
  const dais = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.0, 0.18, 32), toon(0xf0d9a8))
  dais.position.y = -0.06
  dais.receiveShadow = true
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.85, 0.05, 8, 40), toon(0xe07a3a))
  ring.rotation.x = Math.PI / 2
  ring.position.y = 0.04
  const grass = new THREE.Mesh(new THREE.CircleGeometry(2.4, 28), toon(0x7ec45a))
  grass.rotation.x = -Math.PI / 2
  grass.position.y = -0.15
  g.add(dais, ring, grass)
  return g
}
