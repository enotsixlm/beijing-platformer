import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { makeToonMaterial, makeFlatMaterial } from '../core/toon.js'
import { wrap01, clamp, lerp } from '../core/rng.js'
import { SURFACE } from '../core/constants.js'
import { skyTexture, textTexture, flagTexture, windowsTexture, waterTexture, lavaTexture } from './textures.js'
import { ribbonGeometry, lat, inVoid } from './roadbuilder.js'

// ───────────────────────────── geometry helpers ─────────────────────────────

/** Add a constant vertex colour attribute to a geometry (for merged multi-colour props). */
export function colored(geo, hex) {
  const c = new THREE.Color(hex)
  const n = geo.attributes.position.count
  const arr = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) { arr[i * 3] = c.r; arr[i * 3 + 1] = c.g; arr[i * 3 + 2] = c.b }
  geo.setAttribute('color', new THREE.BufferAttribute(arr, 3))
  return geo
}

/** Position/rotate/scale a geometry in place (chainable helper). */
export function xf(geo, { p = [0, 0, 0], r = [0, 0, 0], s = 1 } = {}) {
  const sc = typeof s === 'number' ? [s, s, s] : s
  geo.scale(sc[0], sc[1], sc[2])
  if (r[0]) geo.rotateX(r[0])
  if (r[2]) geo.rotateZ(r[2])
  if (r[1]) geo.rotateY(r[1])
  geo.translate(p[0], p[1], p[2])
  return geo
}

/** De-index a geometry (no-op when already non-indexed; avoids three's console warning). */
export function nonIndexed(g) {
  if (!g.index) return g
  const out = g.toNonIndexed()
  g.dispose()
  return out
}

/** Merge a list of coloured parts into one non-indexed geometry. */
export function mergeParts(parts) {
  const clean = parts.map(nonIndexed)
  const merged = mergeGeometries(clean, false)
  for (const g of clean) g.dispose()
  return merged
}

/** Jitter vertices for rocky/organic shapes. */
export function jitter(geo, amount, rand) {
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    pos.setXYZ(i, pos.getX(i) + (rand() - 0.5) * amount, pos.getY(i) + (rand() - 0.5) * amount, pos.getZ(i) + (rand() - 0.5) * amount)
  }
  geo.computeVertexNormals()
  return geo
}

// ───────────────────────────── animated materials ─────────────────────────────

/**
 * Inject a time-driven vertex displacement into any material. Returns the material; the caller
 * must push `mat.userData.uTime.value = time` every frame (the Track base class does this for every
 * material in `track._timeMaterials`).
 * modes: 'flag' (pennant wave, x ∈ [0,width]), 'water' (height swell), 'flame' (flicker), 'crowd' (hop)
 */
export function animateMaterial(mat, mode, { width = 1.6 } = {}) {
  const uTime = { value: 0 }
  mat.userData.uTime = uTime
  const snippets = {
    flag: `
      float f_ = clamp(transformed.x / ${width.toFixed(2)}, 0.0, 1.0);
      transformed.z += sin(f_ * 6.0 - uTime * 7.0 + ph_) * 0.22 * f_;
      transformed.y += cos(f_ * 4.0 - uTime * 5.0 + ph_) * 0.06 * f_;`,
    water: `
      transformed.y += sin(transformed.x * 0.12 + uTime * 1.3) * 0.35 + sin(transformed.z * 0.09 - uTime * 0.9) * 0.3 + sin((transformed.x + transformed.z) * 0.05 + uTime * 0.6) * 0.25;`,
    flame: `
      float k_ = 1.0 + 0.28 * sin(uTime * 13.0 + ph_) ;
      transformed.x *= k_; transformed.z *= k_;
      transformed.y *= 1.0 + 0.25 * sin(uTime * 9.0 + ph_ * 1.7);
      transformed.x += sin(uTime * 11.0 + ph_) * 0.08 * transformed.y;`,
    crowd: `
      transformed.y += max(0.0, sin(uTime * 5.0 + ph_ * 2.3)) * 0.35;`,
    hover: `
      transformed.y += sin(uTime * 2.2 + ph_) * 0.25;`,
  }
  const code = snippets[mode]
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uTime
    shader.vertexShader = 'uniform float uTime;\n' + shader.vertexShader.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>
      #ifdef USE_INSTANCING
        float ph_ = instanceMatrix[3][0] * 0.37 + instanceMatrix[3][2] * 0.21;
      #else
        float ph_ = 0.0;
      #endif
      ${code}`,
    )
  }
  mat.customProgramCacheKey = () => 'tkl_' + mode + '_' + width
  return mat
}

// ───────────────────────────── instancing ─────────────────────────────

const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _p = new THREE.Vector3(), _s = new THREE.Vector3(), _e = new THREE.Euler()

/**
 * Create an InstancedMesh from placements [{position, rotationY, scale, color?}].
 */
export function instanced(geo, mat, placements, { shadows = true, colors = false } = {}) {
  const mesh = new THREE.InstancedMesh(geo, mat, Math.max(1, placements.length))
  mesh.count = placements.length
  placements.forEach((pl, k) => {
    _p.copy(pl.position)
    _e.set(pl.tilt ?? 0, pl.rotationY ?? 0, pl.roll ?? 0)
    _q.setFromEuler(_e)
    const sc = pl.scale ?? 1
    if (typeof sc === 'number') _s.set(sc, sc, sc); else _s.copy(sc)
    _m.compose(_p, _q, _s)
    mesh.setMatrixAt(k, _m)
    if (colors) mesh.setColorAt(k, pl.color ?? new THREE.Color(0xffffff))
  })
  mesh.instanceMatrix.needsUpdate = true
  if (colors && mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  mesh.castShadow = shadows
  mesh.receiveShadow = shadows
  mesh.frustumCulled = false
  return mesh
}

/**
 * Scatter placements along the track outside the walls. Rejects positions that fall inside any
 * other part of the track footprint (using the surface query), inside void zones, or where
 * `allow(x, z)` is false. `heightAt(x, z, info)` gives the ground height at that spot.
 */
export function scatter(spline, rand, {
  count, minGap = 2, maxGap = 14, side = 0, clearance = 2, tRanges = null, allow = null, heightAt, yOffset = 0,
  scaleRange = [0.8, 1.3], tries = 6,
}) {
  const out = []
  const p = new THREE.Vector3()
  for (let n = 0; n < count; n++) {
    for (let k = 0; k < tries; k++) {
      let t = rand()
      if (tRanges) { const r = tRanges[Math.floor(rand() * tRanges.length)]; t = wrap01(lerp(r[0], r[1], rand())) }
      const sd = side === 0 ? (rand() < 0.5 ? -1 : 1) : side
      const s = spline.sample(t)
      const L = s.wallHalfWidth + minGap + rand() * (maxGap - minGap)
      p.copy(s.position).addScaledVector(s.right, sd * L)
      if (allow && !allow(p.x, p.z)) continue
      const info = spline.getSurfaceAt(p)
      if (Math.abs(info.lateral) < info.wallHalfWidth + clearance) continue
      if (info.type === SURFACE.VOID) continue
      const y = heightAt ? heightAt(p.x, p.z, info) : s.position.y
      out.push({ position: new THREE.Vector3(p.x, y + yOffset, p.z), rotationY: rand() * Math.PI * 2, scale: lerp(scaleRange[0], scaleRange[1], rand()), t, side: sd, heading: Math.atan2(s.tangent.x, s.tangent.z), faceRoad: faceRoadRotation(s.tangent, sd) })
      break
    }
  }
  return out
}

/** Placements at regular spacing along the wall (lamp posts, torches, fence posts). */
export function alongWall(spline, { every = 12, side = 0, offset = 0.8, yOffset = 0, tRanges = null, faceRoad = true, skipVoid = true, phase = 0 }) {
  const out = []
  const total = spline.length
  const ranges = tRanges ?? [[0, 1]]
  for (const [t0, t1] of ranges) {
    const len = (t1 - t0) * total
    const n = Math.max(1, Math.floor(len / every))
    for (let k = 0; k < n; k++) {
      const t = wrap01(t0 + ((k + 0.5 + phase) * every) / total)
      if (t > t1 && t1 <= 1) continue
      for (const sd of side === 0 ? [-1, 1] : [side]) {
        const s = spline.sample(t)
        if (skipVoid && inVoid(spline, { t }, sd)) continue
        const position = s.position.clone().addScaledVector(s.right, sd * (s.wallHalfWidth + offset))
        position.y += yOffset
        const heading = Math.atan2(s.tangent.x, s.tangent.z)
        out.push({ position, rotationY: faceRoad ? faceRoadRotation(s.tangent, sd) : heading, heading, t, side: sd })
      }
    }
  }
  return out
}

// ───────────────────────────── prop geometries ─────────────────────────────

export function palmTreeGeometry(rand) {
  const parts = []
  // curved trunk from 3 tilted segments
  let y = 0, x = 0
  for (let i = 0; i < 3; i++) {
    const seg = xf(colored(new THREE.CylinderGeometry(0.28 - i * 0.04, 0.36 - i * 0.04, 2.6, 6), '#a9764a'), { p: [x, y + 1.3, 0], r: [0, 0, -0.12 * (i + 1)] })
    parts.push(seg)
    y += 2.45; x += 0.3 * (i + 1)
  }
  const top = [x + 0.3, y + 0.3, 0]
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 + 0.3
    const frond = colored(new THREE.BoxGeometry(0.55, 0.1, 3.8), i % 2 ? '#3fae4a' : '#55c85c')
    frond.translate(0, 0, 1.9)
    frond.rotateX(0.55)
    frond.rotateY(a)
    frond.translate(top[0], top[1], top[2])
    parts.push(frond)
  }
  for (let i = 0; i < 3; i++) parts.push(xf(colored(new THREE.SphereGeometry(0.28, 6, 5), '#6b4a2b'), { p: [top[0] + Math.cos(i * 2.1) * 0.35, top[1] - 0.3, top[2] + Math.sin(i * 2.1) * 0.35] }))
  return mergeParts(parts)
}

export function roundTreeGeometry(rand, leaf = ['#3f9a3a', '#5cb84a', '#2f7d2c']) {
  const parts = [xf(colored(new THREE.CylinderGeometry(0.3, 0.45, 2.6, 6), '#7a5230'), { p: [0, 1.3, 0] })]
  const blobs = [[0, 3.6, 0, 1.7], [0.9, 3.0, 0.5, 1.2], [-0.8, 3.2, -0.4, 1.25], [0.2, 4.6, -0.6, 1.1]]
  blobs.forEach(([x, y, z, r], i) => parts.push(xf(jitter(colored(new THREE.IcosahedronGeometry(r, 1), leaf[i % leaf.length]), 0.18, rand), { p: [x, y, z] })))
  return mergeParts(parts)
}

export function deadTreeGeometry(rand) {
  const parts = [xf(colored(new THREE.CylinderGeometry(0.18, 0.4, 4.2, 5), '#2a2022'), { p: [0, 2.1, 0] })]
  for (let i = 0; i < 4; i++) {
    const a = i * 1.7
    parts.push(xf(colored(new THREE.CylinderGeometry(0.06, 0.16, 2.2, 4), '#2a2022'), { p: [Math.cos(a) * 0.7, 3.4 + i * 0.3, Math.sin(a) * 0.7], r: [Math.sin(a) * 0.8, 0, Math.cos(a) * 0.8] }))
  }
  return mergeParts(parts)
}

export function rockGeometry(rand, color = '#7c7f88', detail = 0) {
  const g = colored(new THREE.DodecahedronGeometry(1, detail), color)
  jitter(g, 0.35, rand)
  g.scale(1, 0.75, 1)
  return nonIndexed(g)
}

export function lampPostGeometry(color = '#2b2f3a') {
  return mergeParts([
    xf(colored(new THREE.CylinderGeometry(0.12, 0.18, 6, 6), color), { p: [0, 3, 0] }),
    xf(colored(new THREE.BoxGeometry(0.14, 0.14, 1.6), color), { p: [0, 6, -0.7] }),
    xf(colored(new THREE.BoxGeometry(0.4, 0.25, 0.7), color), { p: [0, 5.9, -1.4] }),
  ])
}

export function lampHeadGeometry() {
  const g = new THREE.BoxGeometry(0.34, 0.12, 0.6)
  g.translate(0, 5.76, -1.4)
  return g
}

export function torchGeometry() {
  return mergeParts([
    xf(colored(new THREE.CylinderGeometry(0.12, 0.2, 2.6, 6), '#3a2c26'), { p: [0, 1.3, 0] }),
    xf(colored(new THREE.CylinderGeometry(0.45, 0.25, 0.5, 8), '#5a4436'), { p: [0, 2.7, 0] }),
  ])
}

export function flameGeometry() {
  const g = new THREE.ConeGeometry(0.42, 1.3, 7)
  g.translate(0, 3.5, 0)
  return g
}

export function personGeometry() {
  return mergeParts([
    xf(colored(new THREE.CylinderGeometry(0.28, 0.32, 0.8, 6), '#ffffff'), { p: [0, 0.4, 0] }),
    xf(colored(new THREE.SphereGeometry(0.24, 7, 6), '#f4c9a0'), { p: [0, 1.02, 0] }),
  ])
}

export function tyreStackGeometry() {
  return mergeParts([
    xf(colored(new THREE.TorusGeometry(0.5, 0.2, 5, 8), '#222'), { p: [0, 0.2, 0], r: [Math.PI / 2, 0, 0] }),
    xf(colored(new THREE.TorusGeometry(0.5, 0.2, 5, 8), '#e63946'), { p: [0, 0.6, 0], r: [Math.PI / 2, 0, 0] }),
    xf(colored(new THREE.TorusGeometry(0.5, 0.2, 5, 8), '#f1f1f1'), { p: [0, 1.0, 0], r: [Math.PI / 2, 0, 0] }),
  ])
}

export function beachHutGeometry(rand) {
  const c = ['#ff7f6e', '#ffd166', '#5fd3ff', '#9be15d', '#ff9ff3'][Math.floor(rand() * 5)]
  return mergeParts([
    xf(colored(new THREE.BoxGeometry(3.2, 2.4, 3.2), c), { p: [0, 1.2, 0] }),
    xf(colored(new THREE.BoxGeometry(3.0, 0.2, 3.0), '#fff'), { p: [0, 1.2, -0.2], s: [1.02, 1, 1] }),
    xf(colored(new THREE.ConeGeometry(2.7, 1.6, 4), '#c97b3a'), { p: [0, 3.2, 0], r: [0, Math.PI / 4, 0] }),
    xf(colored(new THREE.BoxGeometry(0.9, 1.5, 0.1), '#3a2a1a'), { p: [0, 0.75, -1.62] }),
  ])
}

export function crystalGeometry(color = '#ff5a1f') {
  const g = colored(new THREE.ConeGeometry(0.6, 2.6, 5), color)
  g.translate(0, 1.3, 0)
  return nonIndexed(g)
}

export function battlementGeometry() {
  return mergeParts([
    xf(colored(new THREE.BoxGeometry(6, 4, 6), '#4a3f47'), { p: [0, 2, 0] }),
    xf(colored(new THREE.BoxGeometry(6.6, 0.8, 6.6), '#3a3138'), { p: [0, 4.4, 0] }),
    ...[0, 1, 2, 3].map((i) => xf(colored(new THREE.BoxGeometry(1, 1, 1), '#3a3138'), { p: [Math.cos(i * Math.PI / 2 + Math.PI / 4) * 2.7, 5.2, Math.sin(i * Math.PI / 2 + Math.PI / 4) * 2.7] })),
    xf(colored(new THREE.ConeGeometry(2.2, 3.5, 6), '#b8322a'), { p: [0, 6.4, 0] }),
  ])
}

export function droneGeometry() {
  return mergeParts([
    xf(colored(new THREE.BoxGeometry(1.6, 0.5, 1.2), '#2d3350'), { p: [0, 0, 0] }),
    xf(colored(new THREE.BoxGeometry(1.0, 0.35, 0.8), '#7ff7ff'), { p: [0, 0.35, 0] }),
    ...[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z]) => xf(colored(new THREE.CylinderGeometry(0.55, 0.55, 0.08, 10), '#ff3ec9'), { p: [x * 0.95, 0.2, z * 0.75] })),
    ...[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z]) => xf(colored(new THREE.BoxGeometry(0.5, 0.12, 0.12), '#2d3350'), { p: [x * 0.6, 0.1, z * 0.45], r: [0, Math.atan2(z, x), 0] })),
  ])
}

// ───────────────────────────── set pieces ─────────────────────────────

/** Sky dome (inverted sphere with a gradient texture). Radius must stay below the camera far plane. */
export function buildSky(stops, opts = {}) {
  const geo = new THREE.SphereGeometry(780, 32, 16)
  const mat = new THREE.MeshBasicMaterial({ map: skyTexture(stops, opts), side: THREE.BackSide, fog: false, depthWrite: false })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.name = 'sky'
  mesh.renderOrder = -10
  mesh.frustumCulled = false
  return { mesh, geometry: geo, material: mat }
}

/** Ring of low-poly mountains far away (merged, vertex-coloured, fogged). */
export function buildMountains(rand, { radius = 520, spread = 120, count = 28, height = [60, 140], base = [90, 160], color = '#6f8bb1', snow = null, centre = [0, 0], y = -1, allow = null }) {
  const parts = []
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + rand() * 0.2
    const r = radius + (rand() - 0.5) * spread
    if (allow && !allow(centre[0] + Math.cos(a) * r, centre[1] + Math.sin(a) * r)) continue
    const h = lerp(height[0], height[1], rand()), b = lerp(base[0], base[1], rand())
    const g = colored(new THREE.ConeGeometry(b, h, 6 + Math.floor(rand() * 4), 2), color)
    jitter(g, b * 0.18, rand)
    if (snow) {
      const pos = g.attributes.position, col = g.attributes.color
      const sc = new THREE.Color(snow)
      for (let k = 0; k < pos.count; k++) if (pos.getY(k) > h * 0.3) col.setXYZ(k, sc.r, sc.g, sc.b)
    }
    g.translate(centre[0] + Math.cos(a) * r, y + h / 2 - 2, centre[1] + Math.sin(a) * r)
    parts.push(g)
  }
  const geo = mergeParts(parts)
  const mat = makeFlatMaterial(0xffffff, { vertexColors: true })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.name = 'mountains'
  return { mesh, geometry: geo, material: mat }
}

/** Puffy cloud clusters (unlit, unfogged toon-white), one InstancedMesh. */
export function buildClouds(rand, { count = 26, radius = [150, 600], height = [70, 140], centre = [0, 0] }) {
  const geo = mergeParts([
    xf(colored(new THREE.SphereGeometry(6, 8, 6), '#ffffff'), { p: [0, 0, 0] }),
    xf(colored(new THREE.SphereGeometry(4.5, 8, 6), '#ffffff'), { p: [6, -1, 1] }),
    xf(colored(new THREE.SphereGeometry(4, 8, 6), '#ffffff'), { p: [-5.5, -1.5, -1] }),
    xf(colored(new THREE.SphereGeometry(3.5, 8, 6), '#ffffff'), { p: [2, -2, 4] }),
  ])
  const mat = makeToonMaterial(0xffffff, { vertexColors: true, fog: false })
  const placements = []
  for (let i = 0; i < count; i++) {
    const a = rand() * Math.PI * 2, r = lerp(radius[0], radius[1], rand())
    placements.push({ position: new THREE.Vector3(centre[0] + Math.cos(a) * r, lerp(height[0], height[1], rand()), centre[1] + Math.sin(a) * r), rotationY: rand() * 6, scale: lerp(0.8, 2.2, rand()) })
  }
  const mesh = instanced(geo, mat, placements, { shadows: false })
  mesh.name = 'clouds'
  return { mesh, geometry: geo, material: mat }
}

/**
 * Grandstand: stepped tiers + roof + crowd placements (returned so the track can merge all crowd
 * into a single InstancedMesh) + flag pole placements.
 */
export function grandstandGeometry({ length = 22, tiers = 4, color = '#e8eef5', roof = '#ff5a36' }) {
  const parts = []
  const depth = 1.6, rise = 1.1
  for (let i = 0; i < tiers; i++) {
    parts.push(xf(colored(new THREE.BoxGeometry(length, rise * (i + 1), depth), i % 2 ? color : '#cfd8e3'), { p: [0, (rise * (i + 1)) / 2, i * depth + depth / 2] }))
  }
  // back wall + roof on posts
  parts.push(xf(colored(new THREE.BoxGeometry(length, tiers * rise + 3.2, 0.4), '#b9c4d1'), { p: [0, (tiers * rise + 3.2) / 2, tiers * depth + 0.2] }))
  parts.push(xf(colored(new THREE.BoxGeometry(length + 1, 0.35, tiers * depth + 2.5), roof), { p: [0, tiers * rise + 3.4, (tiers * depth) / 2 - 0.4], r: [0.12, 0, 0] }))
  for (const sx of [-1, 1]) parts.push(xf(colored(new THREE.BoxGeometry(0.35, tiers * rise + 3.2, 0.35), '#8d99a6'), { p: [sx * (length / 2 - 0.4), (tiers * rise + 3.2) / 2, -0.3] }))
  return mergeParts(parts)
}

/** Crowd placements (local space) for a grandstand of given dimensions. */
export function grandstandCrowd(rand, { length = 22, tiers = 4, density = 0.8 }) {
  const out = []
  const depth = 1.6, rise = 1.1
  const perRow = Math.floor(length / 0.9)
  const palette = ['#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#eccc68', '#ff6b81', '#7bed9f', '#70a1ff', '#ffffff', '#5352ed']
  for (let i = 0; i < tiers; i++) {
    for (let k = 0; k < perRow; k++) {
      if (rand() > density) continue
      out.push({
        local: new THREE.Vector3(-length / 2 + 0.6 + k * 0.9 + (rand() - 0.5) * 0.3, rise * (i + 1), i * depth + depth / 2 - 0.2),
        color: new THREE.Color(palette[Math.floor(rand() * palette.length)]),
        scale: lerp(0.85, 1.1, rand()),
      })
    }
  }
  return out
}

/** Billboard: frame + text plane, facing −z locally (rotate to face the road). */
export function buildBillboard(text, { w = 9, h = 3, bg = '#1e2a44', fg = '#ffffff', accent = '#ff5a36', legs = 3.5, glow = 0 } = {}) {
  const group = new THREE.Group()
  const frameGeo = mergeParts([
    xf(colored(new THREE.BoxGeometry(w + 0.5, h + 0.5, 0.3), '#2b2f3a'), { p: [0, legs + h / 2, 0.2] }),
    xf(colored(new THREE.BoxGeometry(0.3, legs + 0.5, 0.3), '#2b2f3a'), { p: [-w / 2 + 0.6, legs / 2, 0.2] }),
    xf(colored(new THREE.BoxGeometry(0.3, legs + 0.5, 0.3), '#2b2f3a'), { p: [w / 2 - 0.6, legs / 2, 0.2] }),
  ])
  const frameMat = makeToonMaterial(0xffffff, { vertexColors: true })
  const frame = new THREE.Mesh(frameGeo, frameMat)
  frame.castShadow = true
  group.add(frame)
  const t = textTexture(text, { w: 512, h: Math.round(512 * (h / w)), bg, fg, accent, glow })
  const faceMat = glow > 0
    ? new THREE.MeshBasicMaterial({ map: t })
    : new THREE.MeshStandardMaterial({ map: t, roughness: 0.6, emissive: new THREE.Color(fg), emissiveMap: t, emissiveIntensity: glow > 0 ? 1 : 0.15 })
  const faceGeo = new THREE.PlaneGeometry(w, h)
  const face = new THREE.Mesh(faceGeo, faceMat)
  face.position.set(0, legs + h / 2, 0)
  face.rotation.y = Math.PI
  group.add(face)
  return { group, geometries: [frameGeo, faceGeo], materials: [frameMat, faceMat] }
}

/**
 * Yaw that makes an object's local −z axis point from `side` of the road toward the centreline.
 * (θ = heading + side·π/2.) Use for anything whose "front" is its local −z: stands, billboards, huts.
 */
export function faceRoadRotation(tangent, side) {
  return Math.atan2(tangent.x, tangent.z) + (side > 0 ? Math.PI / 2 : -Math.PI / 2)
}

/** Place a billboard beside the track at t (outside the wall), facing the road. */
export function placeBeside(obj, spline, t, side, extra, heightAt) {
  const s = spline.sample(t)
  const L = s.wallHalfWidth + extra
  const p = s.position.clone().addScaledVector(s.right, side * L)
  p.y = heightAt ? heightAt(p.x, p.z) : s.position.y
  obj.position.copy(p)
  obj.rotation.y = faceRoadRotation(s.tangent, side)
  return obj
}

/** Neon city skyline: InstancedMesh of boxes with lit-window emissive texture. */
export function buildCity(rand, spline, { count = 220, inner = 26, outer = 420, groundY, tint = '#ffd27a', centre = [0, 0], heights = [10, 70], allow = null }) {
  const geo = new THREE.BoxGeometry(1, 1, 1)
  geo.translate(0, 0.5, 0)
  // wrap the window texture across all faces: scale uvs on sides so windows tile
  const t = windowsTexture(3, tint)
  const mat = new THREE.MeshStandardMaterial({ map: t, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: 1.1, roughness: 0.7, color: 0x9aa4c8 })
  const placements = []
  const p = new THREE.Vector3()
  const b = spline.bounds(0)
  const cx = (b.minX + b.maxX) / 2, cz = (b.minZ + b.maxZ) / 2
  const spanX = (b.maxX - b.minX) / 2 + outer * 0.5, spanZ = (b.maxZ - b.minZ) / 2 + outer * 0.5
  let tries = 0
  while (placements.length < count && tries++ < count * 12) {
    p.set(cx + (rand() * 2 - 1) * spanX, groundY, cz + (rand() * 2 - 1) * spanZ)
    if (allow && !allow(p.x, p.z)) continue
    const info = spline.getSurfaceAt(p)
    const d = Math.abs(info.lateral) - info.wallHalfWidth
    if (d < inner) continue
    const w = lerp(8, 22, rand()), dpt = lerp(8, 22, rand())
    // taller further away from the track, so the road stays readable
    const far = clamp(d / 160, 0, 1)
    const h = lerp(heights[0], heights[1], rand()) * (0.5 + far)
    placements.push({ position: p.clone(), rotationY: Math.round(rand() * 4) * (Math.PI / 2) + (rand() - 0.5) * 0.2, scale: new THREE.Vector3(w, h, dpt) })
  }
  const mesh = instanced(geo, mat, placements, { shadows: false })
  mesh.castShadow = false
  mesh.receiveShadow = false
  mesh.name = 'city'
  return { mesh, geometry: geo, material: mat, texture: t }
}

/** Animated sea plane (vertex-wave shader + scrolling foam texture). */
export function buildSea({ centre = [0, 0], size = 1500, y = -0.6, color = 0x2f9fe0 }) {
  const geo = new THREE.PlaneGeometry(size, size, 60, 60)
  geo.rotateX(-Math.PI / 2)
  const t = waterTexture()
  t.repeat.set(size / 40, size / 40)
  const mat = animateMaterial(makeToonMaterial(color, { map: t, transparent: true, opacity: 0.94 }), 'water')
  const mesh = new THREE.Mesh(geo, mat)
  mesh.position.set(centre[0], y, centre[1])
  mesh.receiveShadow = true
  mesh.name = 'sea'
  return { mesh, geometry: geo, material: mat, texture: t }
}

/** Lava pools filling the void zones (ribbons below road level), merged into one emissive mesh. */
export function buildLavaPools(spline, { drop = 2.6, reach = 22 }) {
  const t = lavaTexture()
  t.repeat.set(2, 1)
  const mat = new THREE.MeshBasicMaterial({ map: t, color: 0xffffff, fog: true })
  const geos = []
  for (const v of spline.voids) {
    for (const sd of v.side === 0 ? [-1, 1] : [v.side]) {
      // edge A → B must run along +right for an upward-facing ribbon
      const inner = (s) => sd * (s.hw + 0.9), outer = (s) => sd * (s.whw + reach)
      geos.push(ribbonGeometry(spline, {
        from: Math.max(0, v.t0 - 0.004), to: Math.min(1, v.t1 + 0.004),
        edgeA: lat(sd > 0 ? inner : outer, -drop),
        edgeB: lat(sd > 0 ? outer : inner, -drop),
        tile: 14,
      }))
    }
  }
  if (!geos.length) return null
  const geo = mergeGeometries(geos)
  for (const g of geos) g.dispose()
  const mesh = new THREE.Mesh(geo, mat)
  mesh.name = 'lava'
  return { mesh, geometry: geo, material: mat, texture: t }
}

// ───────────────────────────── hazards ─────────────────────────────

/**
 * Rolling boulder: rolls along the road between t0..t1 with a slow lateral weave, then respawns.
 */
export class RollingBoulder {
  constructor(spline, { t0, t1, speed = 14, radius = 1.6, lateralAmp = 0.5, phase = 0, direction = 1, material, geometry }) {
    this.spline = spline
    this.t0 = t0; this.t1 = t1; this.speed = speed; this.radius = radius; this.lateralAmp = lateralAmp
    this.direction = direction
    this.dist = ((t1 - t0) * spline.length) * phase
    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.castShadow = true
    this.spin = 0
    this.hazard = { position: new THREE.Vector3(), radius: radius * 0.95, kind: 'boulder', active: true }
    this.update(0, 0)
  }
  update(dt, time) {
    const span = (this.t1 - this.t0) * this.spline.length
    this.dist += this.speed * dt
    if (this.dist > span) this.dist -= span
    // direction −1 rolls from t1 back toward t0 (against the flow of traffic)
    const along = this.direction > 0 ? this.dist : span - this.dist
    const t = this.t0 + (along / this.spline.length)
    const s = this.spline.sample(t)
    const lateral = Math.sin(along * 0.05 + this.t0 * 40) * s.halfWidth * this.lateralAmp
    const p = s.position.addScaledVector(s.right, lateral)
    p.y += this.radius
    this.spin -= (this.direction * this.speed * dt) / this.radius
    this.mesh.position.copy(p)
    this.mesh.quaternion.setFromAxisAngle(s.right, this.spin)
    this.hazard.position.copy(p)
    // pop-in/out scale near the ends of the run
    const edge = Math.min(this.dist, span - this.dist)
    const sc = clamp(edge / 6, 0.05, 1)
    this.mesh.scale.setScalar(sc)
    this.hazard.active = sc > 0.6
  }
}

/** Thwomp-style crusher: hovers, slams, rests, rises. Dangerous while low. */
export class Crusher {
  constructor(spline, { t, lateral = 0, period = 4.2, phase = 0, size = 3.4, material, faceMaterial }) {
    const s = spline.sample(t)
    this.base = s.position.clone().addScaledVector(s.right, lateral)
    this.heading = Math.atan2(s.tangent.x, s.tangent.z)
    this.period = period; this.phase = phase; this.size = size
    this.hover = 7.5
    const g = new THREE.BoxGeometry(size, size * 0.9, size)
    this.geometry = g
    this.mesh = new THREE.Mesh(g, material)
    this.mesh.castShadow = true
    this.mesh.rotation.y = this.heading
    if (faceMaterial) {
      const fg = new THREE.PlaneGeometry(size * 0.9, size * 0.8)
      const face = new THREE.Mesh(fg, faceMaterial)
      face.position.set(0, 0, -size / 2 - 0.02)
      face.rotation.y = Math.PI
      this.mesh.add(face)
      this.faceGeometry = fg
    }
    this.hazard = { position: this.base.clone(), radius: size * 0.62, kind: 'crusher', active: false }
    this.update(0, 0)
  }
  update(dt, time) {
    const u = ((time + this.phase) % this.period) / this.period
    let h
    if (u < 0.42) h = this.hover + Math.sin(time * 3 + this.phase) * 0.3 // hover, shaking a bit before the slam
    else if (u < 0.5) h = lerp(this.hover, 0, ((u - 0.42) / 0.08) ** 2) // slam
    else if (u < 0.72) h = 0 // rest
    else h = lerp(0, this.hover, (u - 0.72) / 0.28) // rise
    this.mesh.position.set(this.base.x, this.base.y + this.size * 0.45 + h, this.base.z)
    this.hazard.position.set(this.base.x, this.base.y + 0.5, this.base.z)
    this.hazard.active = h < 1.6
  }
}

/** Hovering traffic drone cruising along the road with a lateral drift. */
export class TrafficDrone {
  constructor(spline, { t, speed = 11, lateralAmp = 0.65, radius = 1.2, hover = 0.9, geometry, material, direction = 1 }) {
    this.spline = spline
    this.dist = wrap01(t) * spline.length
    this.speed = speed * direction
    this.lateralAmp = lateralAmp
    this.hoverH = hover
    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.castShadow = true
    this.hazard = { position: new THREE.Vector3(), radius, kind: 'drone', active: true }
    this.update(0, 0)
  }
  update(dt, time) {
    const L = this.spline.length
    this.dist = ((this.dist + this.speed * dt) % L + L) % L
    const t = this.dist / L
    const s = this.spline.sample(t)
    const lateral = Math.sin(this.dist * 0.035 + t * 9) * s.halfWidth * this.lateralAmp
    const p = s.position.addScaledVector(s.right, lateral)
    p.y += this.hoverH + Math.sin(time * 3 + this.dist) * 0.15
    this.mesh.position.copy(p)
    this.mesh.rotation.y = Math.atan2(s.tangent.x, s.tangent.z) + (this.speed < 0 ? Math.PI : 0)
    this.mesh.rotation.z = -Math.cos(this.dist * 0.035 + t * 9) * 0.25
    this.hazard.position.copy(p)
  }
}

/** Spinning rotor gate: a bar rotating about a hub in the road centre; 4 hazard circles along it. */
export class RotorGate {
  constructor(spline, { t, speed = 1.1, length = 11, phase = 0, material, hubMaterial }) {
    const s = spline.sample(t)
    this.centre = s.position.clone()
    this.speed = speed; this.phase = phase
    this.group = new THREE.Group()
    this.geometry = new THREE.BoxGeometry(length, 0.5, 0.5)
    this.hubGeometry = new THREE.CylinderGeometry(0.35, 0.5, 1.6, 8)
    const bar = new THREE.Mesh(this.geometry, material)
    bar.position.y = 1.0
    bar.castShadow = true
    this.bar = bar
    const hub = new THREE.Mesh(this.hubGeometry, hubMaterial ?? material)
    hub.position.y = 0.8
    this.group.add(bar, hub)
    this.group.position.copy(this.centre)
    this.offsets = [-length * 0.47, -length * 0.27, length * 0.27, length * 0.47]
    this.hazards = this.offsets.map(() => ({ position: new THREE.Vector3(), radius: 1.15, kind: 'rotor', active: true }))
    this.update(0, 0)
  }
  update(dt, time) {
    const a = time * this.speed + this.phase
    this.bar.rotation.y = a
    const cx = Math.cos(a), sz = -Math.sin(a)
    this.hazards.forEach((h, i) => {
      const o = this.offsets[i]
      h.position.set(this.centre.x + cx * o, this.centre.y + 0.8, this.centre.z + sz * o)
    })
  }
}

/** Giant beach ball bouncing back and forth across the road. */
export class BeachBall {
  constructor(spline, { t, speed = 0.9, radius = 1.25, phase = 0, geometry, material }) {
    const s = spline.sample(t)
    this.s = s
    this.speed = speed; this.radius = radius; this.phase = phase
    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.castShadow = true
    this.hazard = { position: new THREE.Vector3(), radius: radius * 0.9, kind: 'beachball', active: true }
    this.update(0, 0)
  }
  update(dt, time) {
    const a = time * this.speed + this.phase
    const lateral = Math.sin(a) * (this.s.halfWidth - this.radius - 0.3)
    const bounce = Math.abs(Math.sin(time * 2.6 + this.phase)) * 1.6
    const p = this.s.position.clone().addScaledVector(this.s.right, lateral)
    p.y += this.radius + bounce
    this.mesh.position.copy(p)
    this.mesh.rotation.z = -a * 1.3
    this.mesh.rotation.x = Math.sin(time) * 0.4
    this.hazard.position.copy(p)
    this.hazard.active = bounce < 1.1
  }
}

/** Decorative drifting hot-air balloon. */
export class Balloon {
  constructor({ centre, radius, height, speed = 0.05, phase = 0, colorA = '#ff5a5a', colorB = '#ffe066' }) {
    this.centre = centre; this.radius = radius; this.height = height; this.speed = speed; this.phase = phase
    const parts = [colored(new THREE.SphereGeometry(4, 12, 10), colorA)]
    // stripes via a second sphere slightly scaled with gaps would cost geometry; use coloured gores instead
    const gore = parts[0].attributes.position, col = parts[0].attributes.color
    const cb = new THREE.Color(colorB)
    for (let i = 0; i < gore.count; i++) {
      const ang = Math.atan2(gore.getZ(i), gore.getX(i))
      if (Math.floor(((ang + Math.PI) / (Math.PI * 2)) * 8) % 2 === 0) col.setXYZ(i, cb.r, cb.g, cb.b)
    }
    parts[0].translate(0, 0, 0)
    parts.push(xf(colored(new THREE.CylinderGeometry(1.4, 0.9, 1.2, 8), '#7a5230'), { p: [0, -6.2, 0] }))
    for (let k = 0; k < 4; k++) parts.push(xf(colored(new THREE.CylinderGeometry(0.05, 0.05, 3.2, 3), '#3a2a1a'), { p: [Math.cos(k * Math.PI / 2 + 0.78) * 1.1, -4.2, Math.sin(k * Math.PI / 2 + 0.78) * 1.1] }))
    this.geometry = mergeParts(parts)
    this.material = makeToonMaterial(0xffffff, { vertexColors: true })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.castShadow = false
    this.update(0, 0)
  }
  update(dt, time) {
    const a = time * this.speed + this.phase
    this.mesh.position.set(this.centre[0] + Math.cos(a) * this.radius, this.height + Math.sin(time * 0.4 + this.phase) * 2.5, this.centre[1] + Math.sin(a) * this.radius)
    this.mesh.rotation.y = a
  }
}
