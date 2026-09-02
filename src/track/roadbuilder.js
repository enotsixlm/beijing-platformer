import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { makeToonMaterial, makeFlatMaterial } from '../core/toon.js'
import { wrap01 } from '../core/rng.js'
import { asphaltTexture, curbTexture, checkerTexture, chevronTexture, textTexture } from './textures.js'

/**
 * Sample descriptor for ribbon callbacks.
 * @typedef {{i:number,t:number,dist:number,x:number,y:number,z:number,tx:number,tz:number,rx:number,rz:number,hw:number,whw:number}} S
 */

/** Build a sample descriptor for index i of the spline table. */
export function sampleAt(spline, i) {
  const N = spline.N
  i = ((i % N) + N) % N
  const tx = spline.tx[i], tz = spline.tz[i]
  const l = Math.hypot(tx, tz) || 1
  return {
    i, t: i / N, dist: (i / N) * spline.length,
    x: spline.px[i], y: spline.py[i], z: spline.pz[i],
    tx: tx / l, tz: tz / l, rx: tz / l, rz: -tx / l,
    hw: spline.hw[i], whw: spline.whw[i],
  }
}

/**
 * Generic closed ribbon along the spline. `edgeA(s)`/`edgeB(s)` return [x,y,z] for the two rails;
 * u = 0 at A, 1 at B; v = dist / tile. `skip(s)` (optional) removes quads (e.g. wall gaps at pits).
 * Winding: with A on the left (−right) and B on the right (+right) the normal points up; for a
 * vertical wall with A at the bottom and B at the top the normal faces the road (use DoubleSide).
 * @returns {THREE.BufferGeometry}
 */
export function ribbonGeometry(spline, { edgeA, edgeB, tile = 10, skip = null, from = 0, to = 1, step = 1 }) {
  const N = spline.N
  const full = to - from >= 1 - 1e-9
  const i0 = full ? 0 : Math.floor(wrap01(from) * N)
  const span = full ? N : Math.max(1, Math.ceil((to - from) * N))
  const rings = Math.ceil(span / step) + 1
  const ds = spline.length / N
  const pos = [], uv = [], idx = []
  for (let k = 0; k < rings; k++) {
    // for a full loop the last ring duplicates the first (so UVs stay continuous)
    const off = Math.min(k * step, span)
    const s = sampleAt(spline, i0 + off)
    const d = off * ds
    const a = edgeA(s), b = edgeB(s)
    pos.push(a[0], a[1], a[2], b[0], b[1], b[2])
    uv.push(0, d / tile, 1, d / tile)
    if (k < rings - 1 && !(skip && skip(s))) {
      // CCW seen from above: (A_i, A_i+1, B_i) → normal = tangent × right = up
      const v = k * 2
      idx.push(v, v + 2, v + 1, v + 1, v + 2, v + 3)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  g.setIndex(idx)
  g.computeVertexNormals()
  return g
}

/** Convenience: lateral/vertical offsets relative to the centreline. */
export const lat = (lateralFn, dy = 0) => (s) => {
  const L = typeof lateralFn === 'function' ? lateralFn(s) : lateralFn
  const y = typeof dy === 'function' ? dy(s) : s.y + dy
  return [s.x + s.rx * L, y, s.z + s.rz * L]
}

/** Is sample s inside any void zone on the given side (or either side when side === 0)? */
export function inVoid(spline, s, side) {
  for (const v of spline.voids) {
    if (s.t < v.t0 || s.t > v.t1) continue
    if (v.side === 0 || side === 0 || v.side === side) return true
  }
  return false
}

/**
 * Build the standard road package: asphalt ribbon, curbs, off-road strips, optional skirt.
 * @returns {{group: THREE.Group, materials: THREE.Material[], geometries: THREE.BufferGeometry[]}}
 */
export function buildRoad(spline, {
  asphalt = {},
  curbColors = ['#e53935', '#f7f7f7'],
  offroadTexture,
  offroadColor = 0xffffff,
  skirt = null, // { width, groundY, texture, color }
  wetRoad = false,
} = {}) {
  const group = new THREE.Group()
  group.name = 'road'
  const materials = [], geometries = []

  const roadTex = asphaltTexture({ ...asphalt, wet: wetRoad })
  const roadMat = wetRoad
    ? new THREE.MeshStandardMaterial({ map: roadTex, roughness: 0.35, metalness: 0.2, color: 0xe6ebff, emissive: 0xffffff, emissiveMap: roadTex, emissiveIntensity: 0.28 })
    : makeToonMaterial(0xffffff, { map: roadTex })
  const roadGeo = ribbonGeometry(spline, { edgeA: lat((s) => -s.hw), edgeB: lat((s) => s.hw), tile: 16 })
  const road = new THREE.Mesh(roadGeo, roadMat)
  road.receiveShadow = true
  road.name = 'asphalt'
  group.add(road)
  materials.push(roadMat); geometries.push(roadGeo)

  const curbTex = curbTexture(curbColors[0], curbColors[1])
  const curbMat = makeToonMaterial(0xffffff, { map: curbTex })
  const curbL = ribbonGeometry(spline, { edgeA: lat((s) => -s.hw - 0.9, 0.05), edgeB: lat((s) => -s.hw, 0.05), tile: 2.4 })
  const curbR = ribbonGeometry(spline, { edgeA: lat((s) => s.hw, 0.05), edgeB: lat((s) => s.hw + 0.9, 0.05), tile: 2.4 })
  const curbGeo = mergeGeometries([curbL, curbR])
  curbL.dispose(); curbR.dispose()
  const curbs = new THREE.Mesh(curbGeo, curbMat)
  curbs.receiveShadow = true
  group.add(curbs)
  materials.push(curbMat); geometries.push(curbGeo)

  if (offroadTexture) {
    offroadTexture.repeat.set(2, 1)
    const offMat = makeToonMaterial(offroadColor, { map: offroadTexture })
    const offL = ribbonGeometry(spline, { edgeA: lat((s) => -s.whw - 0.6, -0.03), edgeB: lat((s) => -s.hw - 0.85, -0.03), tile: 8, skip: (s) => inVoid(spline, s, -1) })
    const offR = ribbonGeometry(spline, { edgeA: lat((s) => s.hw + 0.85, -0.03), edgeB: lat((s) => s.whw + 0.6, -0.03), tile: 8, skip: (s) => inVoid(spline, s, 1) })
    const offGeo = mergeGeometries([offL, offR])
    offL.dispose(); offR.dispose()
    const off = new THREE.Mesh(offGeo, offMat)
    off.receiveShadow = true
    group.add(off)
    materials.push(offMat); geometries.push(offGeo)
  }

  if (skirt) {
    const { width = 28, groundY = -1, texture, color = 0xffffff } = skirt
    if (texture) texture.repeat.set(3, 1)
    const skMat = makeToonMaterial(color, { map: texture ?? null })
    const outerY = (s) => Math.min(groundY, s.y - 0.5)
    const skL = ribbonGeometry(spline, { edgeA: lat((s) => -s.whw - width, outerY), edgeB: lat((s) => -s.whw - 0.5, -0.06), tile: 12, skip: (s) => inVoid(spline, s, -1) })
    const skR = ribbonGeometry(spline, { edgeA: lat((s) => s.whw + 0.5, -0.06), edgeB: lat((s) => s.whw + width, outerY), tile: 12, skip: (s) => inVoid(spline, s, 1) })
    const skGeo = mergeGeometries([skL, skR])
    skL.dispose(); skR.dispose()
    const sk = new THREE.Mesh(skGeo, skMat)
    sk.receiveShadow = true
    group.add(sk)
    materials.push(skMat); geometries.push(skGeo)
  }

  return { group, materials, geometries }
}

/**
 * Vertical wall ribbons on both sides at wallHalfWidth (skipping void zones).
 * @param {object} o { height, texture, color, emissive, tile, base (y offset below road), sides }
 */
export function buildWalls(spline, { height = 1.4, texture = null, color = 0xffffff, emissive = null, emissiveIntensity = 1, tile = 6, sink = 0.4, material = null } = {}) {
  const mat = material ?? makeToonMaterial(color, { map: texture, side: THREE.DoubleSide, emissive: emissive ?? 0x000000, emissiveIntensity, emissiveMap: emissive ? texture : null })
  const wl = ribbonGeometry(spline, { edgeA: lat((s) => -s.whw, -sink), edgeB: lat((s) => -s.whw, height), tile, skip: (s) => inVoid(spline, s, -1) })
  const wr = ribbonGeometry(spline, { edgeA: lat((s) => s.whw, -sink), edgeB: lat((s) => s.whw, height), tile, skip: (s) => inVoid(spline, s, 1) })
  const geo = mergeGeometries([wl, wr])
  wl.dispose(); wr.dispose()
  const mesh = new THREE.Mesh(geo, mat)
  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.name = 'walls'
  return { mesh, material: mat, geometry: geo }
}

/**
 * Start/finish gate: two pillars, a beam, a text banner facing oncoming karts and a checkered line.
 */
export function buildStartGate(spline, { accent = '#ff5a36', bannerText = 'TURBO KART LEGENDS', pillarColor = 0xf4f4f4 } = {}) {
  const group = new THREE.Group()
  group.name = 'startGate'
  const s = spline.sample(0)
  const heading = Math.atan2(s.tangent.x, s.tangent.z)
  const geos = [], mats = []

  const pillarGeo = new THREE.BoxGeometry(1.2, 8, 1.2)
  const pillarMat = makeToonMaterial(pillarColor)
  const beamGeo = new THREE.BoxGeometry(s.halfWidth * 2 + 5, 1.2, 1.4)
  const beamMat = makeToonMaterial(accent)
  geos.push(pillarGeo, beamGeo); mats.push(pillarMat, beamMat)
  for (const side of [-1, 1]) {
    const p = new THREE.Mesh(pillarGeo, pillarMat)
    p.position.copy(s.position).addScaledVector(s.right, side * (s.halfWidth + 1.8)).add(new THREE.Vector3(0, 4, 0))
    p.rotation.y = heading
    p.castShadow = true
    group.add(p)
  }
  const beam = new THREE.Mesh(beamGeo, beamMat)
  beam.position.copy(s.position).add(new THREE.Vector3(0, 8.1, 0))
  beam.rotation.y = heading
  beam.castShadow = true
  group.add(beam)

  const bannerTex = textTexture(bannerText, { w: 1024, h: 160, bg: '#141a2c', fg: '#ffffff', stroke: '#000000', accent })
  const bannerMat = new THREE.MeshBasicMaterial({ map: bannerTex, side: THREE.DoubleSide })
  const bannerGeo = new THREE.PlaneGeometry(s.halfWidth * 2 + 2, 2.6)
  geos.push(bannerGeo); mats.push(bannerMat)
  const banner = new THREE.Mesh(bannerGeo, bannerMat)
  banner.position.copy(s.position).add(new THREE.Vector3(0, 6.2, 0))
  banner.rotation.y = heading + Math.PI // faces −tangent (approaching karts)
  group.add(banner)
  // checker trim under the beam
  const trimTex = checkerTexture(24, 2)
  const trimMat = new THREE.MeshBasicMaterial({ map: trimTex, side: THREE.DoubleSide })
  const trimGeo = new THREE.PlaneGeometry(s.halfWidth * 2 + 2, 0.5)
  geos.push(trimGeo); mats.push(trimMat)
  const trim = new THREE.Mesh(trimGeo, trimMat)
  trim.position.copy(s.position).add(new THREE.Vector3(0, 7.35, 0))
  trim.rotation.y = heading
  group.add(trim)

  // checkered finish line on the tarmac
  const lineTex = checkerTexture(14, 2)
  const lineMat = new THREE.MeshBasicMaterial({ map: lineTex })
  const lineGeo = new THREE.PlaneGeometry(s.halfWidth * 2, 2.2)
  lineGeo.rotateX(-Math.PI / 2)
  lineGeo.rotateY(heading)
  lineGeo.translate(s.position.x, s.position.y + 0.035, s.position.z)
  geos.push(lineGeo); mats.push(lineMat)
  const line = new THREE.Mesh(lineGeo, lineMat)
  line.receiveShadow = true
  group.add(line)

  return { group, geometries: geos, materials: mats }
}

/**
 * Boost pads: glowing chevron rectangles flush with the road. Registers each with the spline.
 * @param {Array<{t:number, lateral?:number, halfLength?:number, halfWidth?:number}>} defs
 */
export function buildBoostPads(spline, defs, { color = '#ffd23f', bg = '#2a1a70' } = {}) {
  const padTex = chevronTexture(color, bg)
  padTex.repeat.set(1, 2)
  const mat = new THREE.MeshStandardMaterial({ map: padTex, emissive: new THREE.Color(color), emissiveMap: padTex, emissiveIntensity: 0.9, roughness: 0.5 })
  const geos = []
  const pads = []
  for (const d of defs) {
    const hl = d.halfLength ?? 3.2, hw = d.halfWidth ?? 2.1
    const s = spline.sample(d.t)
    const heading = Math.atan2(s.tangent.x, s.tangent.z)
    const position = s.position.clone().addScaledVector(s.right, d.lateral ?? 0)
    position.y += 0.04
    const g = new THREE.PlaneGeometry(hw * 2, hl * 2)
    g.rotateX(-Math.PI / 2)
    g.rotateY(heading)
    g.translate(position.x, position.y, position.z)
    geos.push(g)
    spline.addPad(position, heading, hl, hw)
    pads.push({ position, heading, halfLength: hl, halfWidth: hw })
  }
  const geo = mergeGeometries(geos)
  for (const g of geos) g.dispose()
  const mesh = new THREE.Mesh(geo, mat)
  mesh.name = 'boostPads'
  return { mesh, pads, material: mat, geometry: geo, texture: padTex }
}

/**
 * Item box positions: `rows` t values, each with `count` boxes spread across the road.
 * @returns {Array<{position: THREE.Vector3}>}
 */
export function itemBoxRows(spline, rows) {
  const out = []
  for (const row of rows) {
    const t = typeof row === 'number' ? row : row.t
    const count = typeof row === 'number' ? 4 : row.count ?? 4
    const s = spline.sample(t)
    const span = s.halfWidth * 0.72
    for (let i = 0; i < count; i++) {
      const f = count === 1 ? 0 : -1 + (2 * i) / (count - 1)
      const p = s.position.clone().addScaledVector(s.right, f * span)
      p.y += 1.0
      out.push({ position: p })
    }
  }
  return out
}

/**
 * 8 staggered start slots in 2 columns × 4 rows behind the line (t ≈ 0.985..0.999). Slot 0 = pole.
 * @returns {Array<{position: THREE.Vector3, heading: number}>}
 */
export function buildStartGrid(spline, count = 8) {
  const out = []
  const rowGap = 4.2 / spline.length // metres → t
  const stagger = rowGap * 0.5
  const tLine = 1 - 3.5 / spline.length // first row 3.5 m behind the line; last row ≈ 18 m (t ≈ 0.985)
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / 2), col = i % 2
    const t = wrap01(tLine - row * rowGap - col * stagger)
    const s = spline.sample(t)
    const lateral = (col === 0 ? 1 : -1) * Math.min(2.4, s.halfWidth * 0.36)
    const position = s.position.clone().addScaledVector(s.right, lateral)
    position.y += 0.3
    out.push({ position, heading: Math.atan2(s.tangent.x, s.tangent.z) })
  }
  return out
}

/**
 * Support pillars under elevated road sections (one InstancedMesh).
 */
export function buildPillars(spline, { groundY, every = 14, color = 0x3a3f55, minHeight = 1.5, width = 1.6 }) {
  const N = spline.N
  const stepN = Math.max(1, Math.round((every / spline.length) * N))
  const items = []
  for (let i = 0; i < N; i += stepN) {
    const s = sampleAt(spline, i)
    const h = s.y - groundY
    if (h < minHeight) continue
    for (const side of [-1, 1]) items.push({ s, side, h })
  }
  const geo = new THREE.BoxGeometry(width, 1, width)
  geo.translate(0, 0.5, 0)
  const mat = makeFlatMaterial(color)
  const mesh = new THREE.InstancedMesh(geo, mat, items.length)
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), sc = new THREE.Vector3()
  items.forEach(({ s, side, h }, k) => {
    p.set(s.x + s.rx * side * (s.hw - 1.2), groundY, s.z + s.rz * side * (s.hw - 1.2))
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.atan2(s.tx, s.tz))
    sc.set(1, h, 1)
    m.compose(p, q, sc)
    mesh.setMatrixAt(k, m)
  })
  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.name = 'pillars'
  return { mesh, geometry: geo, material: mat }
}

/**
 * Large vertex-coloured ground grid. `colorAt(x, z)` returns a THREE.Color; `heightAt(x, z)` optional.
 */
export function buildGround({ size = 1600, cells = 48, y = -1, colorAt, heightAt = null, texture = null }) {
  const geo = new THREE.PlaneGeometry(size, size, cells, cells)
  geo.rotateX(-Math.PI / 2)
  const pos = geo.attributes.position
  const colors = new Float32Array(pos.count * 3)
  const c = new THREE.Color()
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i)
    if (heightAt) pos.setY(i, y + heightAt(x, z))
    else pos.setY(i, y)
    c.copy(colorAt(x, z))
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geo.computeVertexNormals()
  if (texture) texture.repeat.set(size / 12, size / 12)
  const mat = makeToonMaterial(0xffffff, { vertexColors: true, map: texture })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.receiveShadow = true
  mesh.name = 'ground'
  return { mesh, geometry: geo, material: mat }
}
