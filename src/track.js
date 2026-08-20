import * as THREE from 'three'
import { toon, canvasTex, makeSky } from './toon.js'
import { createCoin, createSneaker, createStickItem, createBoostPanel } from './models.js'

function mulberry(seed) {
  let s = seed >>> 0
  return () => {
    s += 0x6D2B79F5
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function v3(x, z, y = 0) {
  return new THREE.Vector3(x, y, z)
}

function loop(pts) {
  return pts.map((p) => (p.length === 3 ? v3(p[0], p[1], p[2]) : v3(p[0], p[1], 0)))
}

export const COURSES = [
  {
    id: 'day',
    name: 'ひるのまち',
    nameZh: '白日街区',
    nameEn: 'DAYTIME',
    theme: 'day',
    width: 16,
    grip: 1,
    seed: 11,
    pts: loop([
      [0, 0], [0, 70], [10, 110], [50, 140], [110, 145], [150, 120],
      [165, 70], [150, 20], [110, -10], [80, -20], [70, -50],
      [100, -80], [70, -115], [20, -130], [-40, -120], [-80, -80],
      [-100, -30], [-120, 20], [-100, 70], [-50, 90], [-10, 40],
    ]),
  },
  {
    id: 'sunset',
    name: 'ゆうやけロード',
    nameZh: '黄昏大道',
    nameEn: 'SUNSET',
    theme: 'sunset',
    width: 18,
    grip: 1,
    seed: 22,
    pts: loop([
      [0, 0], [0, 90], [20, 150], [80, 190], [160, 200], [230, 170],
      [260, 100], [250, 20], [210, -40], [140, -70], [60, -80],
      [20, -110], [-10, -90], [-20, -40],
    ]),
  },
  {
    id: 'rain',
    name: 'あめの散歩',
    nameZh: '雨天漫步',
    nameEn: 'HEAVY RAIN',
    theme: 'rain',
    width: 13.5,
    grip: 0.62,
    raincoat: true,
    seed: 33,
    pts: loop([
      [0, 0], [30, 50], [80, 70], [110, 30], [90, -20],
      [40, -50], [10, -90], [-40, -110], [-90, -80],
      [-110, -20], [-80, 30], [-30, 50], [20, 90],
      [70, 120], [40, 150], [-20, 140], [-70, 100],
      [-90, 50], [-50, 10],
    ]),
  },
  {
    id: 'cool',
    name: 'SHIBA COOL',
    nameZh: '屋顶疾走',
    nameEn: 'SHIBA COOL',
    theme: 'cool',
    width: 12,
    grip: 0.95,
    elevated: true,
    seed: 44,
    pts: loop([
      [0, 0, 42], [0, 60, 42], [40, 100, 42], [90, 110, 42],
      [130, 80, 42], [140, 30, 44], [120, -20, 46], [70, -50, 46],
      [20, -70, 42], [-40, -80, 42], [-90, -50, 42], [-110, 0, 42],
      [-90, 50, 42], [-40, 70, 42],
    ]),
    gaps: [[0.22, 0.28], [0.62, 0.68]],
    jumps: [{ s: 0.20, vy: 13 }, { s: 0.60, vy: 13 }],
  },
  {
    id: 'down',
    name: 'くだり川',
    nameZh: '溪流桨板',
    nameEn: 'DOWNHILL',
    theme: 'down',
    width: 11,
    grip: 0.78,
    board: true,
    water: true,
    seed: 55,
    pts: loop([
      [0, 0, 2], [20, 50, 1.5], [10, 110, 1], [-30, 150, 0.6],
      [-80, 170, 0.4], [-130, 140, 0.5], [-150, 80, 0.8],
      [-120, 20, 1.2], [-70, -20, 1.6], [-20, -60, 2],
      [40, -90, 2.2], [90, -60, 2], [110, -10, 1.8], [80, 30, 1.6],
      [40, 20, 1.8],
    ]),
  },
  {
    id: 'shiva',
    name: 'SHIVA 2049',
    nameZh: '紫霓高速',
    nameEn: 'SHIVA 2049',
    theme: 'shiva',
    width: 15,
    grip: 1.05,
    neon: true,
    lasers: true,
    seed: 66,
    pts: loop([
      [0, 0, 4], [0, 80, 4], [40, 140, 6], [110, 160, 8],
      [170, 130, 10], [190, 60, 8], [170, -10, 6], [110, -50, 5],
      [40, -70, 4], [-40, -80, 6], [-110, -50, 10], [-140, 10, 12],
      [-120, 70, 10], [-60, 90, 6],
    ]),
  },
]

export const THEMES = {
  day: {
    sky: 0x8fd4ee, fog: 0xc5e6f2, fogNear: 220, fogFar: 560,
    hemiSky: 0xfff6e0, hemiGround: 0x7bb36a, sun: 0xfff2c4, sunInt: 1.7,
    road: 0x5a6270, curbA: 0xf2eee6, curbB: 0xe8a33a, ground: 0x7ec45a,
    building: [0xf7efe3, 0xf3d5c2, 0xe8d7b0, 0xd5ebe4, 0xc9d6f2],
    skyTop: '#6ec4ea', skyHorizon: '#d7f0fa',
  },
  sunset: {
    sky: 0xff9a62, fog: 0xffc090, fogNear: 180, fogFar: 520,
    hemiSky: 0xffd8b0, hemiGround: 0xc45a3a, sun: 0xff9955, sunInt: 1.9,
    road: 0x4a4558, curbA: 0xffe0a8, curbB: 0xff6b3d, ground: 0xd48452,
    building: [0x6a3a4c, 0x8a5240, 0x3e2a48, 0xe0b090],
    skyTop: '#ff7a4a', skyHorizon: '#ffd0a0',
  },
  rain: {
    sky: 0x5a6a7a, fog: 0x7a8a98, fogNear: 90, fogFar: 360,
    hemiSky: 0xa8b8c6, hemiGround: 0x445566, sun: 0xc5d0d8, sunInt: 0.75,
    road: 0x3a424c, curbA: 0x9aafbe, curbB: 0x3d7ea6, ground: 0x4e6350,
    building: [0x5c6874, 0x424c58, 0x6e7884, 0x323a44],
    skyTop: '#4a5a6a', skyHorizon: '#8aa0b0',
  },
  cool: {
    sky: 0xffc9a3, fog: 0xffdcc0, fogNear: 160, fogFar: 540,
    hemiSky: 0xffe6c8, hemiGround: 0x8899aa, sun: 0xffe0a8, sunInt: 1.55,
    road: 0x6a7280, curbA: 0xffffff, curbB: 0xff8fab, ground: 0x8aa0b8,
    building: [0x6a7a8a, 0x445566, 0x9ab0c0, 0x2a3340],
    skyTop: '#ffb080', skyHorizon: '#ffe4c8',
  },
  down: {
    sky: 0x7ed0d4, fog: 0xb0e4e6, fogNear: 140, fogFar: 460,
    hemiSky: 0xe8fff8, hemiGround: 0x3d8a6a, sun: 0xfff6d0, sunInt: 1.5,
    road: 0x3aa0c8, curbA: 0xe8d9a8, curbB: 0x5a8a4a, ground: 0x62b868,
    building: [0xdce8c8, 0xb8cda0, 0x8aaa70],
    skyTop: '#5eb8d0', skyHorizon: '#c8f0ee',
  },
  shiva: {
    sky: 0x3a1a70, fog: 0x5a2a90, fogNear: 220, fogFar: 640,
    hemiSky: 0xe0b0ff, hemiGround: 0x4a1860, sun: 0xff99ee, sunInt: 1.8,
    road: 0x5a40b0, curbA: 0xff77ff, curbB: 0x66ffff, ground: 0x281048,
    building: [0x3a2060, 0x552070, 0x1a1028, 0x883355],
    skyTop: '#1a0838', skyHorizon: '#6a30a0',
  },
}

function asphaltTex(themeId) {
  const dark = themeId === 'shiva'
  return canvasTex(256, 256, (g) => {
    g.fillStyle = dark ? '#3a2468' : '#5c6574'
    g.fillRect(0, 0, 256, 256)
    for (let i = 0; i < 900; i++) {
      g.fillStyle = `rgba(255,255,255,${0.02 + Math.random() * 0.04})`
      g.fillRect(Math.random() * 256, Math.random() * 256, 2, 2)
    }
    g.fillStyle = dark ? '#ff4dff' : '#d8d2c0'
    g.fillRect(124, 0, 8, 36)
    g.fillRect(124, 72, 8, 36)
    g.fillRect(124, 144, 8, 36)
    g.fillRect(124, 216, 8, 36)
  })
}

function windowTex() {
  return canvasTex(64, 128, (g) => {
    g.fillStyle = '#d8cbb8'
    g.fillRect(0, 0, 64, 128)
    for (let y = 8; y < 120; y += 16) {
      for (let x = 8; x < 56; x += 14) {
        g.fillStyle = Math.random() > 0.35 ? '#ffe9a8' : '#6a8090'
        g.fillRect(x, y, 8, 10)
      }
    }
  })
}

export function sampleSpline(pts, spacing = 2.2) {
  const curve = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.28)
  const length = curve.getLength()
  const n = Math.max(90, Math.floor(length / spacing))
  const samples = []
  let prevRight = new THREE.Vector3(1, 0, 0)
  let dist = 0
  let prev = curve.getPointAt(0)
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const pos = curve.getPointAt(t)
    const tangent = curve.getTangentAt(t).normalize()
    const up = new THREE.Vector3(0, 1, 0)
    const right = new THREE.Vector3().crossVectors(up, tangent)
    if (right.lengthSq() < 1e-6) right.copy(prevRight)
    else right.normalize()
    if (right.dot(prevRight) < 0) right.multiplyScalar(-1)
    prevRight = right.clone()
    if (i > 0) dist += pos.distanceTo(prev)
    const heading = Math.atan2(tangent.x, tangent.z)
    samples.push({ pos, tangent, right, dist, heading, t })
    prev = pos
  }
  samples[samples.length - 1].dist = dist
  return { samples, length: dist, curve }
}

export function sampleAt(track, s) {
  const L = track.length
  s = ((s % L) + L) % L
  const arr = track.samples
  let lo = 0
  let hi = arr.length - 2
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1
    if (arr[mid].dist <= s) lo = mid
    else hi = mid - 1
  }
  const a = arr[lo]
  const b = arr[lo + 1]
  const span = (b.dist - a.dist) || 1e-6
  const t = THREE.MathUtils.clamp((s - a.dist) / span, 0, 1)
  return {
    pos: a.pos.clone().lerp(b.pos, t),
    tangent: a.tangent.clone().lerp(b.tangent, t).normalize(),
    right: a.right.clone().lerp(b.right, t).normalize(),
    heading: a.heading + Math.atan2(Math.sin(b.heading - a.heading), Math.cos(b.heading - a.heading)) * t,
    index: lo,
    t,
  }
}

export function pointAt(track, s, x) {
  const sm = sampleAt(track, s)
  return sm.pos.clone().addScaledVector(sm.right, x)
}

export function project(track, pos, hint = 0, lastS = 0) {
  const n = track.samples.length - 1
  const L = track.length
  let bestI = ((hint % n) + n) % n
  let bestScore = Infinity
  const window = 48
  for (let k = -window; k <= window; k++) {
    const i = ((hint + k) % n + n) % n
    const d = pos.distanceToSquared(track.samples[i].pos)
    const sd = Math.abs(track.samples[i].dist - lastS)
    const wrap = Math.min(sd, L - sd)
    const score = d + wrap * wrap * 0.2
    if (score < bestScore) {
      bestScore = score
      bestI = i
    }
  }
  const a = track.samples[bestI]
  const b = track.samples[(bestI + 1) % n]
  const ab = b.pos.clone().sub(a.pos)
  const ap = pos.clone().sub(a.pos)
  const ab2 = ab.lengthSq() || 1e-6
  const t = THREE.MathUtils.clamp(ap.dot(ab) / ab2, 0, 1)
  let s = a.dist + t * ((b.dist - a.dist + track.length) % track.length || (b.dist - a.dist))
  if (bestI === n - 1) s = a.dist + t * (track.length - a.dist)
  const closest = a.pos.clone().lerp(b.pos, t)
  const right = a.right.clone().lerp(b.right, t).normalize()
  const lateral = pos.clone().sub(closest).dot(right)
  return { s, lateral, index: bestI, onTrack: Math.abs(lateral) < track.width * 0.5, closest, y: closest.y }
}

function buildRoad(track, theme, themeId) {
  const { samples, width } = track
  const half = width / 2
  const pos = []
  const nrm = []
  const uv = []
  const idx = []
  const gaps = track.def.gaps || []
  const inGap = (t) => gaps.some(([a, b]) => t >= a && t < b)
  let u = 0
  for (let i = 0; i < samples.length; i++) {
    const s = samples[i]
    const l = s.pos.clone().addScaledVector(s.right, -half)
    const r = s.pos.clone().addScaledVector(s.right, half)
    l.y += 0.04
    r.y += 0.04
    pos.push(l.x, l.y, l.z, r.x, r.y, r.z)
    nrm.push(0, 1, 0, 0, 1, 0)
    uv.push(0, u, 1, u)
    if (i > 0) u += s.pos.distanceTo(samples[i - 1].pos) / 12
  }
  for (let i = 0; i < samples.length - 1; i++) {
    if (inGap(samples[i].t) || inGap(samples[i + 1].t)) continue
      const a = i * 2
      idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  geo.setIndex(idx)
  const tex = asphaltTex(themeId)
  tex.wrapS = THREE.ClampToEdgeWrapping
  tex.wrapT = THREE.RepeatWrapping
  let mat
  if (themeId === 'down') {
    mat = toon(0x3eb8dc, { emissive: 0x145a78 })
  } else if (themeId === 'shiva') {
    mat = new THREE.MeshLambertMaterial({
      color: 0x6a48c0, map: tex, emissive: 0x4a2088, emissiveIntensity: 0.7,
    })
  } else {
    mat = toon(theme.road, { map: tex })
  }
  const mesh = new THREE.Mesh(geo, mat)
  mesh.receiveShadow = true
  mesh.userData.noEdges = true

  const walk = []
  const walkIdx = []
  const walkN = []
  const walkUv = []
  const walkW = half + 2.2
  for (let i = 0; i < samples.length; i++) {
    const s = samples[i]
    const l = s.pos.clone().addScaledVector(s.right, -walkW)
    const r = s.pos.clone().addScaledVector(s.right, walkW)
    l.y += 0.015
    r.y += 0.015
    walk.push(l.x, l.y, l.z, r.x, r.y, r.z)
    walkN.push(0, 1, 0, 0, 1, 0)
    walkUv.push(0, i * 0.2, 1, i * 0.2)
  }
  for (let i = 0; i < samples.length - 1; i++) {
    if (inGap(samples[i].t) || inGap(samples[i + 1].t)) continue
    const a = i * 2
    walkIdx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
  }
  const walkGeo = new THREE.BufferGeometry()
  walkGeo.setAttribute('position', new THREE.Float32BufferAttribute(walk, 3))
  walkGeo.setAttribute('normal', new THREE.Float32BufferAttribute(walkN, 3))
  walkGeo.setAttribute('uv', new THREE.Float32BufferAttribute(walkUv, 2))
  walkGeo.setIndex(walkIdx)
  const walkMesh = new THREE.Mesh(walkGeo, toon(themeId === 'down' ? 0xc8e8a8 : themeId === 'shiva' ? 0x2a1848 : 0xe8e2d4))
  walkMesh.receiveShadow = true
  walkMesh.userData.noEdges = true

  const curbG = new THREE.Group()
  curbG.add(walkMesh)
  const curbGeo = new THREE.BoxGeometry(0.22, 0.16, 2.1)
  const matA = toon(theme.curbA)
  const matB = toon(theme.curbB)
  for (let i = 0; i < samples.length - 1; i += 2) {
    if (inGap(samples[i].t)) continue
    const s = samples[i]
    for (const side of [-1, 1]) {
      const m = new THREE.Mesh(curbGeo, (i + (side > 0 ? 1 : 0)) % 2 ? matA : matB)
      const p = s.pos.clone().addScaledVector(s.right, side * (half + 0.12))
      m.position.copy(p)
      m.position.y += 0.1
      m.lookAt(p.clone().add(s.tangent))
      m.castShadow = true
      curbG.add(m)
    }
  }
  return { mesh, curbs: curbG }
}

function placeItems(track) {
  const items = { coins: [], boosts: [], sneakers: [], sticks: [], jumps: [] }
  const n = track.samples.length - 1
  const w = track.width
  // curvature-based coins on the outside of turns
  for (let i = 4; i < n - 4; i += 3) {
    const h0 = track.samples[i - 2].heading
    const h1 = track.samples[i + 2].heading
    let dh = h1 - h0
    while (dh > Math.PI) dh -= Math.PI * 2
    while (dh < -Math.PI) dh += Math.PI * 2
    const curv = Math.abs(dh)
    if (curv > 0.18) {
      const outside = Math.sign(dh || 1) * w * 0.32
      items.coins.push({ s: track.samples[i].dist, x: outside })
      if (curv > 0.4) items.coins.push({ s: track.samples[i].dist + 3, x: outside })
    } else if (i % 9 === 0) {
      items.coins.push({ s: track.samples[i].dist, x: (i % 2 ? 1 : -1) * w * 0.28 })
    }
    if (curv < 0.1 && i % 18 === 0) {
      items.boosts.push({ s: track.samples[i].dist, x: 0 })
    }
    if (curv > 0.28 && i % 12 === 0) {
      items.sneakers.push({ s: track.samples[(i + 5) % n].dist, x: -Math.sign(dh || 1) * w * 0.22 })
    }
    if (i % 27 === 0) items.sticks.push({ s: track.samples[i].dist, x: 0 })
  }
  if (track.def.jumps) {
    for (const j of track.def.jumps) items.jumps.push({ s: j.s * track.length, vy: j.vy })
  }
  // extra boosts for shiva chaining
  if (track.def.neon) {
    for (let k = 0; k < 8; k++) {
      items.boosts.push({ s: (0.08 + k * 0.11) * track.length, x: (k % 2 ? -3 : 3) })
    }
  }
  if (!items.boosts.length) items.boosts.push({ s: track.length * 0.18, x: 0 })
  if (!items.sneakers.length) items.sneakers.push({ s: track.length * 0.33, x: w * 0.28 })
  if (!items.sticks.length) items.sticks.push({ s: track.length * 0.47, x: 0 })
  if (items.coins.length < 10) {
    for (let k = 0; k < 12; k++) {
      items.coins.push({ s: (k + 1) / 13 * track.length, x: (k % 2 ? -1 : 1) * w * 0.3 })
    }
  }
  return items
}

function signTex(text, bg, fg) {
  return canvasTex(160, 48, (g) => {
    g.fillStyle = bg
    g.fillRect(0, 0, 160, 48)
    g.fillStyle = fg
    g.font = 'bold 26px sans-serif'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillText(text, 80, 26)
  })
}

const SHOP_SIGNS = [
  ['ラーメン', '#c0392b', '#fff8ee'],
  ['コンビニ', '#1e8449', '#fff8ee'],
  ['花屋', '#e74c8c', '#fff8ee'],
  ['弁当', '#d4a017', '#3a2a1c'],
  ['カフェ', '#6f4e37', '#fff8ee'],
  ['書店', '#2e4053', '#fff8ee'],
  ['薬局', '#27ae60', '#fff8ee'],
  ['パン', '#e67e22', '#fff8ee'],
]

function makeVending(x, y, z, facing) {
  const g = new THREE.Group()
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.7, 0.55), toon(0xc0392b))
  body.position.y = 0.85
  const panel = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.9, 0.08), toon(0x2c3e50, { emissive: 0x112233 }))
  panel.position.set(0, 1.1, 0.28)
  const slot = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.08), toon(0x1a1a1a))
  slot.position.set(0, 0.35, 0.28)
  g.add(body, panel, slot)
  g.position.set(x, y, z)
  g.lookAt(g.position.x + facing.x, y, g.position.z + facing.z)
  return g
}

function makePole(x, y, z) {
  const g = new THREE.Group()
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 6.2, 6), toon(0xc8c2b4))
  pole.position.y = 3.1
  const arm = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 0.08), toon(0xb8b2a4))
  arm.position.set(0.6, 5.7, 0)
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.45, 0.25), toon(0x6a7a4a))
  box.position.set(0.2, 4.6, 0)
  g.add(pole, arm, box)
  g.position.set(x, y, z)
  return g
}

function makeTree(scale = 1) {
  const g = new THREE.Group()
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 1.8, 6), toon(0x7a4e2c))
  trunk.position.y = 0.9
  const crown = new THREE.Mesh(new THREE.SphereGeometry(1.15, 10, 8), toon(0x4cba5c))
  crown.position.y = 2.3
  const crown2 = new THREE.Mesh(new THREE.SphereGeometry(0.85, 8, 7), toon(0x3da34e))
  crown2.position.set(0.45, 2.1, 0.2)
  g.add(trunk, crown, crown2)
  g.scale.setScalar(scale)
  return g
}

function makeCloud() {
  const g = new THREE.Group()
  const m = toon(0xfffdf8)
  g.add(new THREE.Mesh(new THREE.SphereGeometry(1.4, 8, 6), m))
  const a = new THREE.Mesh(new THREE.SphereGeometry(1.1, 8, 6), m)
  a.position.set(1.3, -0.1, 0.1)
  const b = new THREE.Mesh(new THREE.SphereGeometry(1.0, 8, 6), m)
  b.position.set(-1.2, -0.15, -0.1)
  g.add(a, b)
  g.userData.noOutline = true
  return g
}

function addScenery(group, track, theme, themeId, rand) {
  const n = track.samples.length - 1
  const wtex = windowTex()
  const box = new THREE.BoxGeometry(1, 1, 1)
  const mats = theme.building.map((c) => toon(c, themeId === 'shiva' ? { emissive: c, emissiveIntensity: 0.28 } : {}))
  const winMat = new THREE.MeshBasicMaterial({ map: wtex, transparent: false })
  const signs = SHOP_SIGNS.map(([t, bg, fg]) => new THREE.MeshBasicMaterial({ map: signTex(t, bg, fg) }))

  const stride = themeId === 'cool' ? 3 : 2
  for (let i = 0; i < n; i += stride) {
    const s = track.samples[i]
    for (const side of [-1, 1]) {
      if (rand() > 0.78) continue
      const dist = track.width * 0.5 + 5.5 + rand() * 12
      const p = s.pos.clone().addScaledVector(s.right, side * dist)
      if (themeId === 'cool') {
        const h = 28 + rand() * 50
        const b = new THREE.Mesh(box, mats[Math.floor(rand() * mats.length)])
        const bw = 5 + rand() * 8
        b.scale.set(bw, h, bw)
        b.position.set(p.x, s.pos.y - h * 0.45, p.z)
        b.receiveShadow = true
        group.add(b)
        continue
      }
      if (themeId === 'down') {
        const tree = makeTree(0.9 + rand() * 0.5)
        tree.position.copy(p)
        tree.position.y = s.pos.y
        group.add(tree)
        continue
      }

      const h = 5.5 + rand() * (themeId === 'shiva' ? 26 : 14)
      const bw = 4.2 + rand() * 5
      const bd = 4.2 + rand() * 5
      const b = new THREE.Mesh(box, mats[Math.floor(rand() * mats.length)])
      b.scale.set(bw, h, bd)
      b.position.set(p.x, s.pos.y + h / 2, p.z)
      b.castShadow = b.receiveShadow = true
      group.add(b)

      const face = new THREE.Mesh(new THREE.PlaneGeometry(bw * 0.82, h * 0.72), winMat)
      face.position.set(p.x, s.pos.y + h / 2, p.z)
      face.lookAt(s.pos.x, s.pos.y + h / 2, s.pos.z)
      face.position.addScaledVector(s.right, -side * 0.08)
      group.add(face)

      if (themeId !== 'shiva' && rand() > 0.45 && h < 16) {
        const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.7), signs[Math.floor(rand() * signs.length)])
        sign.position.copy(p)
        sign.position.y = s.pos.y + 2.6
        sign.position.addScaledVector(s.right, -side * (bw * 0.52 + 0.2))
        sign.lookAt(s.pos.x, sign.position.y, s.pos.z)
        group.add(sign)
        const awning = new THREE.Mesh(new THREE.BoxGeometry(bw * 0.9, 0.08, 1.1), toon(0xe74c3c))
        awning.position.copy(p)
        awning.position.y = s.pos.y + 2.25
        awning.position.addScaledVector(s.right, -side * (bw * 0.35))
        group.add(awning)
      }
    }
  }

  if (themeId === 'day' || themeId === 'sunset' || themeId === 'rain') {
    for (let i = 6; i < n; i += 10) {
      const s = track.samples[i]
      const side = i % 20 < 10 ? 1 : -1
      const p = s.pos.clone().addScaledVector(s.right, side * (track.width * 0.5 + 2.6))
      group.add(makePole(p.x, s.pos.y, p.z))
      if (i % 20 === 6) {
        const v = makeVending(
          p.x + s.right.x * side * 0.8, s.pos.y, p.z + s.right.z * side * 0.8,
          s.right.clone().multiplyScalar(-side)
        )
        group.add(v)
      }
    }
    for (let i = 8; i < n; i += 14) {
      const s = track.samples[i]
      const side = i % 28 < 14 ? -1 : 1
      const tree = makeTree(0.85 + rand() * 0.35)
      const p = s.pos.clone().addScaledVector(s.right, side * (track.width * 0.5 + 3.4))
      tree.position.copy(p)
      tree.position.y = s.pos.y
      group.add(tree)
    }
  }

  for (let i = 0; i < 10; i++) {
    const c = makeCloud()
    const s = track.samples[Math.floor(rand() * n)]
    c.position.set(s.pos.x + (rand() - 0.5) * 80, 28 + rand() * 18, s.pos.z + (rand() - 0.5) * 80)
    c.scale.setScalar(2.2 + rand() * 2.5)
    group.add(c)
  }

  if (themeId === 'shiva') {
    const ringGeo = new THREE.TorusGeometry(16, 0.55, 8, 40)
    const ringMat = toon(0x3ee0e8, { emissive: 0x3ee0e8, emissiveIntensity: 0.9 })
    for (let i = 0; i < 5; i++) {
      const s = track.samples[Math.floor((i + 0.5) / 5 * n)]
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.position.copy(s.pos)
      ring.position.y += 7
      ring.lookAt(s.pos.clone().add(s.tangent))
      group.add(ring)
    }
  }
}

export function inGap(track, s) {
  const t = ((s / track.length) % 1 + 1) % 1
  return (track.def.gaps || []).some(([a, b]) => t >= a && t < b)
}

export function buildCourse(scene, courseDef) {
  const rand = mulberry(courseDef.seed)
  const theme = THEMES[courseDef.theme]
  const spline = sampleSpline(courseDef.pts)
  const track = {
    ...spline,
    width: courseDef.width,
    grip: courseDef.grip,
    def: courseDef,
  }

  const group = new THREE.Group()
  scene.add(group)

  const sky = makeSky(theme.skyTop || '#7ec8e3', theme.skyHorizon || '#d0eaf4')
  group.add(sky)
  if (courseDef.theme !== 'rain' && courseDef.theme !== 'shiva') {
    const sunDisc = new THREE.Mesh(
      new THREE.SphereGeometry(10, 16, 12),
      new THREE.MeshBasicMaterial({
        color: courseDef.theme === 'sunset' ? 0xff7a3a : 0xffe48a,
        fog: false,
      })
    )
    sunDisc.position.set(90, 72, -50)
    group.add(sunDisc)
  }

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(420, 48),
    toon(theme.ground)
  )
  ground.rotation.x = -Math.PI / 2
  ground.position.y = courseDef.elevated ? 0 : -0.02
  ground.receiveShadow = true
  ground.userData.noEdges = true
  group.add(ground)

  const { mesh: road, curbs } = buildRoad(track, theme, courseDef.theme)
  group.add(road, curbs)

  const start = sampleAt(track, 2)
  const finish = new THREE.Mesh(
    new THREE.PlaneGeometry(track.width, 2.4),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
      map: canvasTex(64, 16, (g) => {
        for (let y = 0; y < 16; y += 8) {
          for (let x = 0; x < 64; x += 8) {
            g.fillStyle = ((x + y) / 8) % 2 ? '#111' : '#f4f0e6'
            g.fillRect(x, y, 8, 8)
          }
        }
      }),
    })
  )
  finish.rotation.x = -Math.PI / 2
  finish.position.copy(start.pos)
  finish.position.y += 0.08
  finish.lookAt(start.pos.clone().add(start.right))
  finish.rotation.z = Math.atan2(start.tangent.x, start.tangent.z)
  finish.rotation.x = -Math.PI / 2
  group.add(finish)

  addScenery(group, track, theme, courseDef.theme, rand)

  const recipe = placeItems(track)
  const items = { coins: [], boosts: [], sneakers: [], sticks: [], jumps: recipe.jumps }

  for (const c of recipe.coins) {
    const p = pointAt(track, c.s, c.x)
    p.y += 0.9
    const mesh = createCoin()
    mesh.position.copy(p)
    group.add(mesh)
    items.coins.push({ mesh, s: c.s, x: c.x, taken: false, baseY: p.y, phase: rand() * 6 })
  }
  for (const b of recipe.boosts) {
    const sm = sampleAt(track, b.s)
    const p = pointAt(track, b.s, b.x)
    p.y += 0.05
    const mesh = createBoostPanel()
    mesh.position.copy(p)
    mesh.position.y = p.y + 0.06
    mesh.rotation.y = Math.atan2(sm.tangent.x, sm.tangent.z)
    group.add(mesh)
    items.boosts.push({ mesh, s: b.s, x: b.x, ready: 0 })
  }
  for (const sn of recipe.sneakers) {
    const p = pointAt(track, sn.s, sn.x)
    p.y += 1.15
    const mesh = createSneaker()
    mesh.position.copy(p)
    group.add(mesh)
    items.sneakers.push({ mesh, s: sn.s, x: sn.x, phase: rand() * 6 })
  }
  for (const st of recipe.sticks) {
    const p = pointAt(track, st.s, st.x)
    p.y += 0.7
    const mesh = createStickItem()
    mesh.position.copy(p)
    group.add(mesh)
    items.sticks.push({ mesh, s: st.s, x: st.x, taken: false })
  }

  const fx = { rain: null }
  if (courseDef.theme === 'rain') {
    const n = 700
    const pos = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (rand() - 0.5) * 240
      pos[i * 3 + 1] = rand() * 36
      pos[i * 3 + 2] = (rand() - 0.5) * 240
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0xb8c8d4, size: 0.18, transparent: true, opacity: 0.65,
    }))
    group.add(pts)
    fx.rain = pts
  }

  const hemi = new THREE.HemisphereLight(theme.hemiSky, theme.hemiGround, 1.05)
  const sun = new THREE.DirectionalLight(theme.sun, theme.sunInt)
  sun.castShadow = true
  sun.shadow.mapSize.set(1024, 1024)
  sun.shadow.camera.left = -70
  sun.shadow.camera.right = 70
  sun.shadow.camera.top = 70
  sun.shadow.camera.bottom = -70
  sun.shadow.camera.far = 260
  scene.add(hemi, sun, sun.target)

  track._jumps = items.jumps
  return { track, group, items, theme, hemi, sun, fx, def: courseDef }
}

export function updateCourseFx(world, now, dt, focus) {
  for (const c of world.items.coins) {
    if (c.taken) continue
    c.mesh.rotation.y = now * 0.004 + c.phase
    c.mesh.position.y = c.baseY + Math.sin(now * 0.005 + c.phase) * 0.18
  }
  for (const sn of world.items.sneakers) {
    sn.mesh.position.y = 1.15 + sampleAt(world.track, sn.s).pos.y + Math.sin(now * 0.003 + sn.phase) * 0.25
    sn.mesh.rotation.y = now * 0.0015
  }
  for (const b of world.items.boosts) {
    if (b.mesh.userData.arrow) b.mesh.userData.arrow.position.z = Math.sin(now * 0.008) * 0.15
  }
  if (world.fx.rain) {
    const arr = world.fx.rain.geometry.attributes.position.array
    for (let i = 0; i < arr.length; i += 3) {
      arr[i + 1] -= 32 * dt
      if (arr[i + 1] < 0) arr[i + 1] = 34
    }
    world.fx.rain.geometry.attributes.position.needsUpdate = true
    if (focus) world.fx.rain.position.set(focus.x, 0, focus.z)
  }
}
