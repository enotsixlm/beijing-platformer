import * as THREE from 'three'
import { SURFACE } from '../core/constants.js'
import { wrap01, clamp } from '../core/rng.js'

const LOCAL_WINDOW = 28 // samples searched each side of hintT (~35 m at 1.25 m spacing)
const COARSE_STRIDE = 6

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
      type = abs <= wallHalfWidth ? SURFACE.OFFROAD : SURFACE.OFFROAD
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
