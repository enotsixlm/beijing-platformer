/**
 * Ring-buffered skid-mark ribbon: N quads laid flat on the road, oldest overwritten.
 * One draw call. Segments ahead of the write head are faded so the tail dissolves
 * instead of popping.
 */
import * as THREE from 'three'
import { SKID_VERT, SKID_FRAG } from './shaders.js'

const FADE_TAIL = 48
const MIN_STEP = 0.06
const MAX_STEP = 4.0

export class SkidMarks {
  constructor(segments = 4000) {
    this.N = segments
    this.head = 0
    this.positions = new Float32Array(segments * 4 * 3)
    this.alphas = new Float32Array(segments * 4)
    this.segAlpha = new Float32Array(segments)
    const index = new Uint32Array(segments * 6)
    for (let i = 0; i < segments; i++) {
      const v = i * 4
      index[i * 6] = v
      index[i * 6 + 1] = v + 1
      index[i * 6 + 2] = v + 2
      index[i * 6 + 3] = v
      index[i * 6 + 4] = v + 2
      index[i * 6 + 5] = v + 3
    }
    const geo = new THREE.BufferGeometry()
    this.aPos = new THREE.BufferAttribute(this.positions, 3).setUsage(THREE.DynamicDrawUsage)
    this.aAlpha = new THREE.BufferAttribute(this.alphas, 1).setUsage(THREE.DynamicDrawUsage)
    geo.setAttribute('position', this.aPos)
    geo.setAttribute('alpha', this.aAlpha)
    geo.setIndex(new THREE.BufferAttribute(index, 1))
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e6)
    this.geometry = geo

    const col = new THREE.Color(0x15161c).convertSRGBToLinear()
    this.material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { uColor: { value: col } }]),
      vertexShader: SKID_VERT,
      fragmentShader: SKID_FRAG,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -4,
      fog: true,
      side: THREE.DoubleSide,
    })
    this.mesh = new THREE.Mesh(geo, this.material)
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = 1
    this.mesh.matrixAutoUpdate = false
    this.mesh.name = 'SkidMarks'
    this.mesh.visible = false

    this.trails = new Map()
    this._dirty = false
    this._dirtyMin = Infinity
    this._dirtyMax = -1
    this._wrapped = false
  }

  _trail(key) {
    let t = this.trails.get(key)
    if (!t) {
      t = { active: false, lx: 0, ly: 0, lz: 0, rx: 0, ry: 0, rz: 0, cx: 0, cz: 0 }
      this.trails.set(key, t)
    }
    return t
  }

  /**
   * Extend the trail `key` (e.g. "3L") to a new wheel contact point.
   * @param {string|number} key
   * @param {number} x @param {number} y @param {number} z contact point (y already at road height + offset)
   * @param {number} heading kart yaw (direction the strip runs along)
   * @param {number} intensity 0..1
   * @param {number} [width]
   */
  extend(key, x, y, z, heading, intensity, width = 0.3) {
    const t = this._trail(key)
    const rx = Math.cos(heading) * width * 0.5
    const rz = -Math.sin(heading) * width * 0.5
    if (t.active) {
      const dx = x - t.cx
      const dz = z - t.cz
      const d2 = dx * dx + dz * dz
      if (d2 < MIN_STEP * MIN_STEP) return
      if (d2 > MAX_STEP * MAX_STEP) {
        t.active = false
      }
    }
    if (!t.active) {
      t.active = true
      t.lx = x - rx
      t.ly = y
      t.lz = z - rz
      t.rx = x + rx
      t.ry = y
      t.rz = z + rz
      t.cx = x
      t.cz = z
      return
    }
    const nlx = x - rx
    const nlz = z - rz
    const nrx = x + rx
    const nrz = z + rz
    this._writeSegment(t.lx, t.ly, t.lz, t.rx, t.ry, t.rz, nrx, y, nrz, nlx, y, nlz, Math.min(1, intensity))
    t.lx = nlx
    t.ly = y
    t.lz = nlz
    t.rx = nrx
    t.ry = y
    t.rz = nrz
    t.cx = x
    t.cz = z
  }

  /** Stop the trail (lifts the wheel). */
  release(key) {
    const t = this.trails.get(key)
    if (t) t.active = false
  }

  /** Standalone short mark centred at `position` running along `heading`. */
  mark(position, heading, intensity = 0.6, length = 0.6, width = 0.3) {
    const fx = Math.sin(heading) * length * 0.5
    const fz = Math.cos(heading) * length * 0.5
    const rx = Math.cos(heading) * width * 0.5
    const rz = -Math.sin(heading) * width * 0.5
    const x = position.x
    const y = position.y
    const z = position.z
    this._writeSegment(
      x - fx - rx, y, z - fz - rz,
      x - fx + rx, y, z - fz + rz,
      x + fx + rx, y, z + fz + rz,
      x + fx - rx, y, z + fz - rz,
      Math.min(1, intensity)
    )
  }

  _writeSegment(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, intensity) {
    const i = this.head
    const p = this.positions
    const o = i * 12
    p[o] = ax; p[o + 1] = ay; p[o + 2] = az
    p[o + 3] = bx; p[o + 4] = by; p[o + 5] = bz
    p[o + 6] = cx; p[o + 7] = cy; p[o + 8] = cz
    p[o + 9] = dx; p[o + 10] = dy; p[o + 11] = dz
    const a = 0.15 + 0.55 * intensity
    this.segAlpha[i] = a
    this._setAlpha(i, a)
    // fade the oldest segments (just ahead of the head) progressively
    for (let j = 1; j <= FADE_TAIL; j++) {
      const s = (i + j) % this.N
      const k = (j - 1) / FADE_TAIL
      this._setAlpha(s, Math.min(this.alphas[s * 4], this.segAlpha[s] * k))
    }
    this._markDirty(i)
    this._markDirty((i + FADE_TAIL) % this.N)
    if (i + FADE_TAIL >= this.N) this._wrapped = true
    this.head = (i + 1) % this.N
    this.mesh.visible = true
  }

  _setAlpha(seg, a) {
    const v = seg * 4
    this.alphas[v] = this.alphas[v + 1] = this.alphas[v + 2] = this.alphas[v + 3] = a
  }

  _markDirty(seg) {
    this._dirty = true
    if (seg < this._dirtyMin) this._dirtyMin = seg
    if (seg > this._dirtyMax) this._dirtyMax = seg
  }

  /** Upload changed ranges. Call once per frame. */
  update() {
    if (!this._dirty) return
    const full = this._wrapped || this._dirtyMax - this._dirtyMin > this.N / 2
    const segStart = full ? 0 : this._dirtyMin
    const segCount = full ? this.N : this._dirtyMax - this._dirtyMin + 1
    this._upload(this.aPos, segStart * 12, segCount * 12)
    this._upload(this.aAlpha, segStart * 4, segCount * 4)
    this._dirty = false
    this._wrapped = false
    this._dirtyMin = Infinity
    this._dirtyMax = -1
  }

  _upload(attr, start, count) {
    if (attr.clearUpdateRanges) {
      attr.clearUpdateRanges()
      attr.addUpdateRange(start, count)
    }
    attr.needsUpdate = true
  }

  clear() {
    this.alphas.fill(0)
    this.segAlpha.fill(0)
    this.trails.clear()
    this._wrapped = true
    this._dirty = true
    this._dirtyMin = 0
    this._dirtyMax = this.N - 1
    this.mesh.visible = false
  }

  dispose() {
    this.geometry.dispose()
    this.material.dispose()
  }
}
