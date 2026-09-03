import * as THREE from 'three'
import { toon } from '../toon.js'
import {
  treeTextures, paperTreeGroup, buildPaperClouds, buildPaperSun, buildPaperMountains,
} from '../paper.js'

let seed = 99173
const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647

// ---------- 赛道控制点(环形,不自交)----------
const CONTROL_POINTS = [
  [-70, -55], [10, -70], [85, -50], [122, -6], [108, 46], [55, 70],
  [16, 50], [-14, 64], [-56, 80], [-106, 55], [-138, 4], [-118, -37],
]
export const ROAD_WIDTH = 13
const CURB_WIDTH = 1.7
const SAMPLE_N = 260

function heightAt(frac) {
  return Math.sin(frac * Math.PI * 4) * 1.8 + Math.sin(frac * Math.PI * 10 + 1.7) * 0.6
}

// ---------- 沥青路面贴图(带虚线车道线)----------
function roadTexture() {
  const c = document.createElement('canvas')
  c.width = 64
  c.height = 256
  const g = c.getContext('2d')
  g.fillStyle = '#4c4f57'
  g.fillRect(0, 0, 64, 256)
  for (let i = 0; i < 260; i++) {
    g.fillStyle = `rgba(18,18,22,${0.04 + rand() * 0.08})`
    g.fillRect(rand() * 64, rand() * 256, 1 + rand() * 2, 1 + rand() * 2)
  }
  g.fillStyle = '#f4ecd8'
  g.fillRect(0, 14, 64, 6)
  g.fillRect(0, 236, 64, 6)
  g.fillRect(10, 116, 30, 24)
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function checkerTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      g.fillStyle = (x + y) % 2 === 0 ? '#fffdf5' : '#20232b'
      g.fillRect(x * 8, y * 8, 8, 8)
    }
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// ---------- 赛道几何:根据样条采样点生成带状路面 ----------
function buildSamples(curve) {
  const raw = curve.getSpacedPoints(SAMPLE_N)
  raw.pop() // getSpacedPoints 闭合曲线首尾重复,去掉重复点
  const n = raw.length
  const samples = raw.map((p) => ({ p: p.clone(), tangent: new THREE.Vector3(), right: new THREE.Vector3(), s: 0, frac: 0 }))

  // 切线(中心差分,环形)
  for (let i = 0; i < n; i++) {
    const prev = raw[(i - 1 + n) % n]
    const next = raw[(i + 1) % n]
    const t = new THREE.Vector3().subVectors(next, prev)
    t.y = 0
    t.normalize()
    samples[i].tangent.copy(t)
    samples[i].right.set(t.z, 0, -t.x)
  }

  // 累计弧长 + 高程
  let s = 0
  for (let i = 0; i < n; i++) {
    samples[i].s = s
    const next = raw[(i + 1) % n]
    s += raw[i].distanceTo(next)
  }
  const length = s
  for (let i = 0; i < n; i++) {
    samples[i].frac = samples[i].s / length
    samples[i].p.y = heightAt(samples[i].frac)
  }
  return { samples, length }
}

function buildRoadMesh(samples, length) {
  const n = samples.length
  const positions = []
  const uvs = []
  const indices = []
  const half = ROAD_WIDTH / 2
  const texRepeatUnit = 9 // 每 9 世界单位重复一次贴图

  for (let i = 0; i < n; i++) {
    const s = samples[i]
    const lx = s.p.x - s.right.x * half, lz = s.p.z - s.right.z * half
    const rx = s.p.x + s.right.x * half, rz = s.p.z + s.right.z * half
    positions.push(lx, s.p.y + 0.02, lz, rx, s.p.y + 0.02, rz)
    const u = s.s / texRepeatUnit
    uvs.push(u, 0, u, 1)
  }
  for (let i = 0; i < n; i++) {
    const a = i * 2, b = i * 2 + 1
    const ni = (i + 1) % n
    const c = ni * 2, d = ni * 2 + 1
    indices.push(a, c, b, b, c, d)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  const mat = toon(0xffffff, { map: roadTexture() })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.receiveShadow = true
  mesh.userData.noEdges = false
  return mesh
}

// 草地/内场地形(比赛道大一圈的平面,凹凸随机上色)
function buildTerrain(scene, samples) {
  const cx = samples.reduce((a, s) => a + s.p.x, 0) / samples.length
  const cz = samples.reduce((a, s) => a + s.p.z, 0) / samples.length
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')
  g.fillStyle = '#7bbf6a'
  g.fillRect(0, 0, 256, 256)
  for (let i = 0; i < 900; i++) {
    g.fillStyle = `rgba(${60 + rand() * 40 | 0}, ${140 + rand() * 50 | 0}, ${60 + rand() * 40 | 0}, 0.5)`
    g.fillRect(rand() * 256, rand() * 256, 2 + rand() * 3, 2 + rand() * 3)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(40, 40)
  tex.colorSpace = THREE.SRGBColorSpace
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400), toon(0xffffff, { map: tex }))
  mesh.rotation.x = -Math.PI / 2
  mesh.position.set(cx, -0.05, cz)
  mesh.receiveShadow = true
  mesh.userData.noEdges = true
  scene.add(mesh)
  return { cx, cz }
}

// 路缘石:交替红白色块,沿内外两侧铺设(实例化)
function buildCurbs(scene, samples) {
  const n = samples.length
  const step = 2 // 每隔几个采样点放一块,控制密度
  const count = Math.floor(n / step) * 2
  const geo = new THREE.BoxGeometry(0.9, 0.22, ROAD_WIDTH / (n / step) * 1.9 + 0.4)
  const mesh = new THREE.InstancedMesh(geo, toon(0xffffff, { vertexColors: true }), count)
  mesh.receiveShadow = true
  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const up = new THREE.Vector3(0, 1, 0)
  const colA = new THREE.Color(0xd8342a)
  const colB = new THREE.Color(0xf5f0e4)
  let idx = 0
  for (let i = 0; i < n; i += step) {
    const s = samples[i]
    const ang = Math.atan2(s.tangent.x, s.tangent.z)
    q.setFromAxisAngle(up, ang)
    const col = (Math.floor(i / step) % 2 === 0) ? colA : colB
    for (const side of [-1, 1]) {
      const dist = ROAD_WIDTH / 2 + CURB_WIDTH / 2
      const x = s.p.x + s.right.x * dist * side
      const z = s.p.z + s.right.z * dist * side
      m.compose(new THREE.Vector3(x, s.p.y + 0.09, z), q, new THREE.Vector3(1, 1, 1))
      mesh.setMatrixAt(idx, m)
      mesh.setColorAt(idx, col)
      idx++
    }
  }
  scene.add(mesh)
}

function buildStartFinish(scene, samples) {
  const s = samples[0]
  const geo = new THREE.PlaneGeometry(ROAD_WIDTH, 4)
  const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: checkerTexture() }))
  mesh.rotation.x = -Math.PI / 2
  const ang = Math.atan2(s.tangent.x, s.tangent.z)
  mesh.rotation.z = -ang
  mesh.position.set(s.p.x, s.p.y + 0.03, s.p.z)
  mesh.userData.noEdges = true
  scene.add(mesh)

  // 龙门架
  const gold = toon(0xd4ac0d)
  const white = toon(0xf5f1e8)
  const half = ROAD_WIDTH / 2 + 1
  for (const side of [-1, 1]) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 8, 10), white)
    pole.position.set(s.p.x + s.right.x * half * side, s.p.y + 4, s.p.z + s.right.z * half * side)
    pole.castShadow = true
    scene.add(pole)
  }
  const beam = new THREE.Mesh(new THREE.BoxGeometry(ROAD_WIDTH + 2.4, 1.1, 1.1), gold)
  beam.position.set(s.p.x, s.p.y + 8, s.p.z)
  beam.rotation.y = Math.atan2(s.right.x, s.right.z)
  beam.castShadow = true
  scene.add(beam)
  // 旗帜
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(2, 1.3), new THREE.MeshBasicMaterial({ map: checkerTexture(), side: THREE.DoubleSide }))
  flag.position.set(s.p.x, s.p.y + 6.9, s.p.z)
  flag.rotation.y = Math.atan2(s.right.x, s.right.z)
  scene.add(flag)
}

// 简易看台(起点附近的观众席)
function buildGrandstand(scene, samples) {
  const s = samples[Math.floor(samples.length * 0.03)]
  const dist = ROAD_WIDTH / 2 + 8
  const x = s.p.x - s.right.x * dist
  const z = s.p.z - s.right.z * dist
  const g = new THREE.Group()
  const dark = toon(0x5d6d7e)
  const seatColors = [0xe03131, 0xffc933, 0x2f8a4e, 0x3d7dd8]
  for (let row = 0; row < 4; row++) {
    const seg = new THREE.Mesh(new THREE.BoxGeometry(22, 1.1, 3), toon(seatColors[row % seatColors.length]))
    seg.position.set(0, row * 1.6 + 0.6, -row * 2.4)
    seg.castShadow = seg.receiveShadow = true
    g.add(seg)
  }
  const roofPost = new THREE.Mesh(new THREE.BoxGeometry(23, 0.5, 10), dark)
  roofPost.position.set(0, 8, -4)
  g.add(roofPost)
  g.position.set(x, 0, z)
  g.lookAt(s.p.x, 0, s.p.z)
  scene.add(g)
}

// 沿赛道外围散布剪纸树 + 障碍锥
function buildScenery(scene, samples, length) {
  const texs = treeTextures()
  const n = samples.length
  for (let i = 0; i < 70; i++) {
    const idx = Math.floor(rand() * n)
    const s = samples[idx]
    const side = rand() < 0.5 ? -1 : 1
    const dist = ROAD_WIDTH / 2 + CURB_WIDTH + 6 + rand() * 34
    const jitter = (rand() - 0.5) * 6
    const x = s.p.x + s.right.x * dist * side + s.tangent.x * jitter
    const z = s.p.z + s.right.z * dist * side + s.tangent.z * jitter
    const tree = paperTreeGroup(texs[Math.floor(rand() * texs.length)], 0.9 + rand() * 0.8)
    tree.position.set(x, s.p.y, z)
    scene.add(tree)
  }
  // 弯道锥桶提示
  const coneGeo = new THREE.ConeGeometry(0.32, 0.7, 8)
  const coneMat = toon(0xff7a1a)
  const coneMesh = new THREE.InstancedMesh(coneGeo, coneMat, Math.ceil(n / 6) * 2)
  let idx = 0
  const m = new THREE.Matrix4()
  for (let i = 0; i < n; i += 6) {
    const s = samples[i]
    for (const side of [-1, 1]) {
      const dist = ROAD_WIDTH / 2 + CURB_WIDTH + 0.9
      const x = s.p.x + s.right.x * dist * side
      const z = s.p.z + s.right.z * dist * side
      m.compose(new THREE.Vector3(x, s.p.y + 0.35, z), new THREE.Quaternion(), new THREE.Vector3(1, 1, 1))
      coneMesh.setMatrixAt(idx++, m)
    }
  }
  scene.add(coneMesh)
}

// ---------- 入口 ----------
export function buildTrack(scene) {
  const pts3 = CONTROL_POINTS.map(([x, z]) => new THREE.Vector3(x, 0, z))
  const curve = new THREE.CatmullRomCurve3(pts3, true, 'catmullrom', 0.55)
  const { samples, length } = buildSamples(curve)

  const { cx, cz } = buildTerrain(scene, samples)
  scene.add(buildRoadMesh(samples, length))
  buildCurbs(scene, samples)
  buildStartFinish(scene, samples)
  buildGrandstand(scene, samples)
  buildScenery(scene, samples, length)

  buildPaperMountains(scene, { cx, cz, rNear: 260, rFar: 340 })
  buildPaperSun(scene)
  const clouds = buildPaperClouds(scene, { zMin: cz - 150, zMax: cz + 150 })

  const avgSpacing = length / samples.length

  return {
    samples,
    length,
    avgSpacing,
    roadWidth: ROAD_WIDTH,
    startPos: samples[0].p.clone(),
    startTangent: samples[0].tangent.clone(),
    clouds,
  }
}

// 找到离 (x,z) 最近的采样点,返回沿路进度与横向偏移
export function sampleTrack(track, x, z) {
  const { samples } = track
  let best = 0
  let bestD = Infinity
  for (let i = 0; i < samples.length; i++) {
    const s = samples[i]
    const dx = x - s.p.x, dz = z - s.p.z
    const d = dx * dx + dz * dz
    if (d < bestD) { bestD = d; best = i }
  }
  const s = samples[best]
  const dx = x - s.p.x, dz = z - s.p.z
  const lateral = dx * s.right.x + dz * s.right.z
  const onTrack = Math.abs(lateral) < track.roadWidth / 2 + 1.2
  return { index: best, frac: s.frac, s: s.s, lateral, onTrack, tangent: s.tangent, right: s.right, point: s.p }
}

export function angleDelta(a, b) {
  let d = (b - a) % (Math.PI * 2)
  if (d > Math.PI) d -= Math.PI * 2
  if (d < -Math.PI) d += Math.PI * 2
  return d
}
