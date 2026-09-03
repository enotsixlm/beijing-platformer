import * as THREE from 'three'
import { SURFACE } from '../core/constants.js'
import { wrap01, clamp } from '../core/rng.js'

const LOCAL_WINDOW = 28 // samples searched each side of hintT (~35 m at 1.25 m spacing)
const COARSE_STRIDE = 6

/**
 * Turn a closed polyline of waypoints `[x, y, z, cornerRadius?]` into a denser control-point loop
 * where every corner is replaced by a circular fillet of the requested radius. Feeding this to the
 * Catmull-Rom curve guarantees a minimum corner radius (no folded inner road edge) and keeps the
 * straights straight. Waypoints that are (nearly) collinear are passed through untouched.
 * @param {Array<[number, number, number, number?]>} waypoints
 * @param {number} defaultRadius
 * @returns {Array<[number, number, number]>}
 */
export function roundedLoop(waypoints, defaultRadius = 22, step = 6) {
  const n = waypoints.length
  // 1. Per-corner fillet geometry: arc start/end points and centre.
  const corners = []
  for (let i = 0; i < n; i++) {
    const A = waypoints[(i - 1 + n) % n], P = waypoints[i], B = waypoints[(i + 1) % n]
    const r = P[3] ?? defaultRadius
    let u1x = A[0] - P[0], u1z = A[2] - P[2]
    let u2x = B[0] - P[0], u2z = B[2] - P[2]
    const l1 = Math.hypot(u1x, u1z), l2 = Math.hypot(u2x, u2z)
    u1x /= l1; u1z /= l1; u2x /= l2; u2z /= l2
    const theta = Math.acos(clamp(u1x * u2x + u1z * u2z, -1, 1)) // interior angle at P
    if (theta > Math.PI - 0.02 || r <= 0.01) {
      corners.push({ sx: P[0], sz: P[2], ex: P[0], ez: P[2], y: P[1], arc: null })
      continue
    }
    // Tangent length from P to the arc endpoints; clamp so fillets never overlap along an edge.
    let d = r / Math.tan(theta / 2)
    const maxD = 0.49 * Math.min(l1, l2)
    let rr = r
    if (d > maxD) { d = maxD; rr = d * Math.tan(theta / 2) }
    const bx = u1x + u2x, bz = u1z + u2z
    const bl = Math.hypot(bx, bz)
    const cx = P[0] + (bx / bl) * (rr / Math.sin(theta / 2))
    const cz = P[2] + (bz / bl) * (rr / Math.sin(theta / 2))
    const sx = P[0] + u1x * d, sz = P[2] + u1z * d
    const ex = P[0] + u2x * d, ez = P[2] + u2z * d
    const a1 = Math.atan2(sz - cz, sx - cx)
    let sweep = Math.atan2(ez - cz, ex - cx) - a1
    while (sweep > Math.PI) sweep -= Math.PI * 2
    while (sweep < -Math.PI) sweep += Math.PI * 2
    corners.push({ sx, sz, ex, ez, y: P[1], arc: { cx, cz, r: rr, a1, sweep } })
  }
  // 2. Walk the loop emitting dense points: arc of corner i, then the straight to corner i+1.
  const out = []
  const push = (x, y, z) => {
    const last = out[out.length - 1]
    if (last && Math.hypot(last[0] - x, last[2] - z) < step * 0.35) return
    out.push([x, y, z])
  }
  const anchors = [] // [index into out, y] at each corner's arc midpoint
  for (let i = 0; i < n; i++) {
    const c = corners[i], nx = corners[(i + 1) % n]
    if (c.arc) {
      const len = Math.abs(c.arc.sweep) * c.arc.r
      const k = Math.max(2, Math.ceil(len / step))
      for (let j = 0; j <= k; j++) {
        const a = c.arc.a1 + (c.arc.sweep * j) / k
        push(c.arc.cx + Math.cos(a) * c.arc.r, c.y, c.arc.cz + Math.sin(a) * c.arc.r)
        if (j === Math.floor(k / 2)) anchors.push([out.length - 1, c.y])
      }
    } else {
      push(c.sx, c.y, c.sz)
      anchors.push([out.length - 1, c.y])
    }
    const dx = nx.sx - c.ex, dz = nx.sz - c.ez
    const len = Math.hypot(dx, dz)
    const k = Math.max(1, Math.round(len / step))
    for (let j = 1; j < k; j++) {
      const u = j / k
      push(c.ex + dx * u, c.y, c.ez + dz * u)
    }
  }
  // Avoid a near-duplicate closing point (the curve is closed implicitly).
  const first = out[0], last = out[out.length - 1]
  if (Math.hypot(first[0] - last[0], first[2] - last[2]) < step * 0.35) out.pop()

  // 3. Elevation: smoothstep between corner anchors by path distance so grades stay gentle even
  //    when two fillets meet with (almost) no straight between them.
  const m = out.length
  const dist = new Float64Array(m + 1)
  for (let i = 0; i < m; i++) {
    const a = out[i], b = out[(i + 1) % m]
    dist[i + 1] = dist[i] + Math.hypot(b[0] - a[0], b[2] - a[2])
  }
  const total = dist[m]
  const smooth = (u) => u * u * (3 - 2 * u)
  const na = anchors.length
  for (let i = 0; i < m; i++) {
    const d = dist[i]
    // find anchor interval containing d (cyclic)
    let k = 0
    while (k < na && dist[anchors[k][0]] <= d) k++
    const A = anchors[(k - 1 + na) % na], B = anchors[k % na]
    let d0 = dist[A[0]], d1 = dist[B[0]]
    let dd = d
    if (d1 <= d0) { d1 += total; if (dd < d0) dd += total }
    const u = d1 > d0 ? clamp((dd - d0) / (d1 - d0), 0, 1) : 0
    out[i][1] = A[1] + (B[1] - A[1]) * smooth(u)
  }
  return out
}

/**
 * Closed centripetal Catmull-Rom centreline with a dense, arc-length-uniform sample table used for
 * fast surface queries. Throughout this module `t` is the arc-length-uniform parameter, i.e.
 * `spline.getPointAt(t)` (NOT `spline.getPoint(t)`), so checkpoints at `i / checkpointCount` are
 * equally spaced in metres.
 */
export class TrackSpline {
  /**
   * @param {Array<[number, number, number]>} controlPoints [x, y, z] closed loop (do not repeat the first point)
   * @param {object} [opts]
   * @param {(t:number)=>number} [opts.halfWidth] road half width at t (default 7)
   * @param {(t:number)=>number} [opts.wallGap] distance from road edge to wall at t (default 4.5)
   */
  constructor(controlPoints, opts = {}) {
    const pts = controlPoints.map(([x, y, z]) => new THREE.Vector3(x, y, z))
    this.curve = new THREE.CatmullRomCurve3(pts, true, 'centripetal')
    this.curve.arcLengthDivisions = 2000
    this.length = this.curve.getLength()

    const N = clamp(Math.round(this.length / 1.25), 600, 1200)
    this.N = N
    const px = new Float32Array(N), py = new Float32Array(N), pz = new Float32Array(N)
    const tx = new Float32Array(N), ty = new Float32Array(N), tz = new Float32Array(N)
    const hw = new Float32Array(N), whw = new Float32Array(N)
    const halfWidthFn = opts.halfWidth ?? (() => 7)
    const wallGapFn = opts.wallGap ?? (() => 4.5)
    const p = new THREE.Vector3(), tg = new THREE.Vector3()
    for (let i = 0; i < N; i++) {
      const t = i / N
      this.curve.getPointAt(t, p)
      this.curve.getTangentAt(t, tg).normalize()
      px[i] = p.x; py[i] = p.y; pz[i] = p.z
      tx[i] = tg.x; ty[i] = tg.y; tz[i] = tg.z
      hw[i] = halfWidthFn(t)
      whw[i] = hw[i] + wallGapFn(t)
    }
    this.px = px; this.py = py; this.pz = pz
    this.tx = tx; this.ty = ty; this.tz = tz
    this.hw = hw; this.whw = whw

    /** VOID pit regions: { t0, t1, side: +1 (right) | -1 (left) | 0 (both), from: lateral distance where the pit starts (default halfWidth + 0.6) } */
    this.voids = []
    /** boost pads (local rectangle tests) */
    this.pads = []

    this._tmpA = new THREE.Vector3()
  }

  /** Register a VOID region beside the road. */
  addVoid(t0, t1, side, from = null) {
    this.voids.push({ t0, t1, side, from })
  }

  /** Register a boost pad rectangle for the surface query. */
  addPad(position, heading, halfLength, halfWidth) {
    this.pads.push({
      cx: position.x, cz: position.z,
      fx: Math.sin(heading), fz: Math.cos(heading),
      rx: Math.cos(heading), rz: -Math.sin(heading),
      hl: halfLength, hw: halfWidth,
    })
  }

  /** Position/tangent/right/widths at arc-length parameter t (allocates). */
  sample(t) {
    const N = this.N
    const u = wrap01(t) * N
    let i = Math.floor(u)
    const s = u - i
    i = i % N
    const j = (i + 1) % N
    const position = new THREE.Vector3(
      this.px[i] + (this.px[j] - this.px[i]) * s,
      this.py[i] + (this.py[j] - this.py[i]) * s,
      this.pz[i] + (this.pz[j] - this.pz[i]) * s,
    )
    const tangent = new THREE.Vector3(
      this.tx[i] + (this.tx[j] - this.tx[i]) * s,
      this.ty[i] + (this.ty[j] - this.ty[i]) * s,
      this.tz[i] + (this.tz[j] - this.tz[i]) * s,
    ).normalize()
    const right = new THREE.Vector3(tangent.z, 0, -tangent.x).normalize()
    return {
      position, tangent, right,
      halfWidth: this.hw[i] + (this.hw[j] - this.hw[i]) * s,
      wallHalfWidth: this.whw[i] + (this.whw[j] - this.whw[i]) * s,
    }
  }

  /** Heading (yaw) of the direction of travel at t. */
  headingAt(t) {
    const s = this.sample(t)
    return Math.atan2(s.tangent.x, s.tangent.z)
  }

  /** World-space point at t offset laterally (+right) and vertically. */
  pointAt(t, lateral = 0, up = 0) {
    const s = this.sample(t)
    return s.position.addScaledVector(s.right, lateral).add(new THREE.Vector3(0, up, 0))
  }

  /** Axis-aligned XZ bounds of the centreline. */
  bounds(margin = 0) {
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity
    for (let i = 0; i < this.N; i++) {
      const x = this.px[i], z = this.pz[i]
      if (x < minX) minX = x; if (x > maxX) maxX = x
      if (z < minZ) minZ = z; if (z > maxZ) maxZ = z
    }
    return { minX: minX - margin, maxX: maxX + margin, minZ: minZ - margin, maxZ: maxZ + margin }
  }

  // ───────────────────────── surface query ─────────────────────────

  _localSearch(x, z, centre, W) {
    const N = this.N
    let best = -1, bestD = Infinity
    for (let k = -W; k <= W; k++) {
      const i = (((centre + k) % N) + N) % N
      const dx = this.px[i] - x, dz = this.pz[i] - z
      const d = dx * dx + dz * dz
      if (d < bestD) { bestD = d; best = i }
    }
    // Minimum on the window edge => hint was stale; caller falls back to a full scan.
    const rel = (((best - centre) % N) + N) % N
    if (rel === W || rel === N - W) return -1
    return best
  }

  _fullSearch(x, z) {
    const N = this.N
    let best = 0, bestD = Infinity
    for (let i = 0; i < N; i += COARSE_STRIDE) {
      const dx = this.px[i] - x, dz = this.pz[i] - z
      const d = dx * dx + dz * dz
      if (d < bestD) { bestD = d; best = i }
    }
    const c = best
    for (let k = -COARSE_STRIDE; k <= COARSE_STRIDE; k++) {
      const i = (((c + k) % N) + N) % N
      const dx = this.px[i] - x, dz = this.pz[i] - z
      const d = dx * dx + dz * dz
      if (d < bestD) { bestD = d; best = i }
    }
    return best
  }

  /**
   * Nearest-road query. See ARCHITECTURE.md `SurfaceInfo`.
   * @param {THREE.Vector3} position
   * @param {number} [hintT] previous t for a fast local search
   */
  getSurfaceAt(position, hintT) {
    const N = this.N
    const x = position.x, z = position.z
    let i
    if (typeof hintT === 'number' && Number.isFinite(hintT)) {
      i = this._localSearch(x, z, Math.round(wrap01(hintT) * N) % N, LOCAL_WINDOW)
      if (i < 0) i = this._fullSearch(x, z)
    } else {
      i = this._fullSearch(x, z)
    }

    // Project onto the two segments adjacent to sample i, keep the closer one.
    let bestSeg = i, bestS = 0, bestD = Infinity
    for (let k = -1; k <= 0; k++) {
      const a = (((i + k) % N) + N) % N
      const b = (a + 1) % N
      const ax = this.px[a], az = this.pz[a]
      const dx = this.px[b] - ax, dz = this.pz[b] - az
      const len2 = dx * dx + dz * dz
      let s = len2 > 1e-9 ? ((x - ax) * dx + (z - az) * dz) / len2 : 0
      s = s < 0 ? 0 : s > 1 ? 1 : s
      const qx = ax + dx * s, qz = az + dz * s
      const ex = x - qx, ez = z - qz
      const d = ex * ex + ez * ez
      if (d < bestD) { bestD = d; bestSeg = a; bestS = s }
    }
    const a = bestSeg, b = (a + 1) % N, s = bestS
    const t = wrap01((a + s) / N)
    const height = this.py[a] + (this.py[b] - this.py[a]) * s
    const tangent = new THREE.Vector3(
      this.tx[a] + (this.tx[b] - this.tx[a]) * s,
      this.ty[a] + (this.ty[b] - this.ty[a]) * s,
      this.tz[a] + (this.tz[b] - this.tz[a]) * s,
    ).normalize()
    const right = new THREE.Vector3(tangent.z, 0, -tangent.x).normalize()
    const qx = this.px[a] + (this.px[b] - this.px[a]) * s
    const qz = this.pz[a] + (this.pz[b] - this.pz[a]) * s
    const lateral = (x - qx) * right.x + (z - qz) * right.z
    const halfWidth = this.hw[a] + (this.hw[b] - this.hw[a]) * s
    const wallHalfWidth = this.whw[a] + (this.whw[b] - this.whw[a]) * s

    const abs = Math.abs(lateral)
    let type
    if (abs <= halfWidth) {
      type = SURFACE.ROAD
      for (let k = 0; k < this.pads.length; k++) {
        const pd = this.pads[k]
        const dx = x - pd.cx, dz = z - pd.cz
        const lf = dx * pd.fx + dz * pd.fz
        if (lf < -pd.hl || lf > pd.hl) continue
        const lr = dx * pd.rx + dz * pd.rz
        if (lr >= -pd.hw && lr <= pd.hw) { type = SURFACE.BOOST; break }
      }
    } else {
      // Beyond wallHalfWidth the type stays OFFROAD; callers detect the wall via |lateral| >= wallHalfWidth.
      type = SURFACE.OFFROAD
      const side = lateral > 0 ? 1 : -1
      for (let k = 0; k < this.voids.length; k++) {
        const v = this.voids[k]
        if (v.side !== 0 && v.side !== side) continue
        if (t < v.t0 || t > v.t1) continue
        const from = v.from ?? halfWidth + 0.6
        if (abs >= from) { type = SURFACE.VOID; break }
      }
    }

    return { t, height, lateral, halfWidth, wallHalfWidth, type, tangent, right }
  }
}
