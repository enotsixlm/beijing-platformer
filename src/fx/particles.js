/**
 * Pooled particle system: one draw call per pool, instanced camera-facing quads with
 * per-instance position/size/colour/alpha/rotation/stretch. Simulation runs on the CPU
 * in typed arrays (swap-remove on death), zero allocations per frame.
 */
import * as THREE from 'three'
import { PARTICLE_VERT, PARTICLE_FRAG } from './shaders.js'

// ───────────────────────────── procedural sprite textures ─────────────────────────────

const HAS_DOM = typeof document !== 'undefined'

function canvasTex(size, draw) {
  if (!HAS_DOM) return null
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  draw(ctx, size)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.NoColorSpace
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.generateMipmaps = true
  tex.needsUpdate = true
  return tex
}

export const Textures = {
  _cache: new Map(),
  get(name) {
    if (this._cache.has(name)) return this._cache.get(name)
    const t = this._make(name)
    this._cache.set(name, t)
    return t
  },
  _make(name) {
    switch (name) {
      case 'soft':
        return canvasTex(64, (ctx, s) => {
          const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
          g.addColorStop(0, 'rgba(255,255,255,1)')
          g.addColorStop(0.35, 'rgba(255,255,255,0.85)')
          g.addColorStop(0.7, 'rgba(255,255,255,0.25)')
          g.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.fillStyle = g
          ctx.fillRect(0, 0, s, s)
        })
      case 'smoke':
        return canvasTex(128, (ctx, s) => {
          const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
          g.addColorStop(0, 'rgba(255,255,255,0.9)')
          g.addColorStop(0.5, 'rgba(255,255,255,0.45)')
          g.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.fillStyle = g
          ctx.fillRect(0, 0, s, s)
          // a few soft blobs for a puffy silhouette
          for (let i = 0; i < 7; i++) {
            const a = (i / 7) * Math.PI * 2
            const r = s * 0.22
            const x = s / 2 + Math.cos(a) * r
            const y = s / 2 + Math.sin(a) * r
            const g2 = ctx.createRadialGradient(x, y, 0, x, y, s * 0.24)
            g2.addColorStop(0, 'rgba(255,255,255,0.35)')
            g2.addColorStop(1, 'rgba(255,255,255,0)')
            ctx.fillStyle = g2
            ctx.fillRect(0, 0, s, s)
          }
        })
      case 'chunk':
        return canvasTex(32, (ctx, s) => {
          ctx.fillStyle = '#fff'
          if (ctx.roundRect) {
            ctx.beginPath()
            ctx.roundRect(3, 3, s - 6, s - 6, 5)
            ctx.fill()
          } else {
            ctx.fillRect(3, 3, s - 6, s - 6)
          }
        })
      case 'ring':
        return canvasTex(128, (ctx, s) => {
          const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
          g.addColorStop(0.55, 'rgba(255,255,255,0)')
          g.addColorStop(0.72, 'rgba(255,255,255,0.9)')
          g.addColorStop(0.86, 'rgba(255,255,255,0.9)')
          g.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.fillStyle = g
          ctx.fillRect(0, 0, s, s)
        })
      case 'star':
        return canvasTex(64, (ctx, s) => {
          ctx.fillStyle = '#fff'
          ctx.beginPath()
          const cx = s / 2
          const cy = s / 2
          for (let i = 0; i < 10; i++) {
            const r = i % 2 === 0 ? s * 0.46 : s * 0.2
            const a = -Math.PI / 2 + (i * Math.PI) / 5
            const x = cx + Math.cos(a) * r
            const y = cy + Math.sin(a) * r
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.closePath()
          ctx.fill()
        })
      case 'bolt':
        return canvasTex(128, (ctx, s) => {
          ctx.clearRect(0, 0, s, s)
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'
          const pts = []
          let x = s * 0.5
          for (let i = 0; i <= 10; i++) {
            const y = (i / 10) * s
            x += (Math.random() - 0.5) * s * 0.28
            x = Math.max(s * 0.15, Math.min(s * 0.85, x))
            pts.push([x, y])
          }
          const stroke = (w, col) => {
            ctx.strokeStyle = col
            ctx.lineWidth = w
            ctx.beginPath()
            ctx.moveTo(pts[0][0], pts[0][1])
            for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
            ctx.stroke()
          }
          stroke(10, 'rgba(255,255,255,0.25)')
          stroke(5, 'rgba(255,255,255,0.6)')
          stroke(2, 'rgba(255,255,255,1)')
        })
      case 'streak':
        return canvasTex(64, (ctx, s) => {
          const g = ctx.createLinearGradient(0, 0, s, 0)
          g.addColorStop(0, 'rgba(255,255,255,0)')
          g.addColorStop(0.5, 'rgba(255,255,255,1)')
          g.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.fillStyle = g
          ctx.fillRect(0, 0, s, s)
          const g2 = ctx.createLinearGradient(0, 0, 0, s)
          g2.addColorStop(0, 'rgba(0,0,0,1)')
          g2.addColorStop(0.5, 'rgba(0,0,0,0)')
          g2.addColorStop(1, 'rgba(0,0,0,1)')
          ctx.globalCompositeOperation = 'destination-out'
          ctx.fillStyle = g2
          ctx.fillRect(0, 0, s, s)
        })
      default:
        return null
    }
  },
  dispose() {
    for (const t of this._cache.values()) t?.dispose()
    this._cache.clear()
  },
}

// ───────────────────────────── colour helpers ─────────────────────────────

const colorCache = new Map()
const _c = new THREE.Color()

/** Linear rgb triple for an sRGB hex number (cached, no per-frame allocation after warm-up). */
export function linearRGB(hex) {
  let v = colorCache.get(hex)
  if (v) return v
  _c.setHex(hex)
  _c.convertSRGBToLinear()
  v = new Float32Array([_c.r, _c.g, _c.b])
  colorCache.set(hex, v)
  return v
}

export function hexOf(color) {
  if (typeof color === 'number') return color
  if (color && color.isColor) return color.getHex()
  if (typeof color === 'string') return _c.set(color).getHex()
  return 0xffffff
}

// ───────────────────────────── emission spec (shared scratch object) ─────────────────────────────

export const P = {
  x: 0, y: 0, z: 0,
  vx: 0, vy: 0, vz: 0,
  life: 1,
  size: 0.3,
  sizeEnd: -1, // -1 = same as size
  aspect: 1, // height / width
  color: 0xffffff,
  colorEnd: -1, // -1 = same as color
  brightness: 1, // multiplies colour (for bloom)
  alpha: 1,
  rot: 0,
  rotV: 0,
  drag: 0,
  gravity: 0,
  stretch: 0, // >0: quad width = speed * stretch (aligned with velocity)
  fadeIn: 0,
  tumble: 0,
  reset() {
    this.x = this.y = this.z = 0
    this.vx = this.vy = this.vz = 0
    this.life = 1
    this.size = 0.3
    this.sizeEnd = -1
    this.aspect = 1
    this.color = 0xffffff
    this.colorEnd = -1
    this.brightness = 1
    this.alpha = 1
    this.rot = 0
    this.rotV = 0
    this.drag = 0
    this.gravity = 0
    this.stretch = 0
    this.fadeIn = 0
    this.tumble = 0
    return this
  },
}

export const rand = (a, b) => a + Math.random() * (b - a)
export const randSpread = (s) => (Math.random() - 0.5) * 2 * s

// ───────────────────────────── pool ─────────────────────────────

export class ParticlePool {
  /**
   * @param {object} o
   * @param {number} o.capacity
   * @param {string} o.texture texture name (see Textures)
   * @param {boolean} o.additive
   * @param {number} [o.renderOrder]
   */
  constructor({ capacity = 2000, texture = 'soft', additive = true, renderOrder = 10 }) {
    this.capacity = capacity
    this.count = 0
    this.additive = additive

    const n = capacity
    this.px = new Float32Array(n)
    this.py = new Float32Array(n)
    this.pz = new Float32Array(n)
    this.vx = new Float32Array(n)
    this.vy = new Float32Array(n)
    this.vz = new Float32Array(n)
    this.life = new Float32Array(n)
    this.maxLife = new Float32Array(n)
    this.size0 = new Float32Array(n)
    this.size1 = new Float32Array(n)
    this.aspect = new Float32Array(n)
    this.c0 = new Float32Array(n * 3)
    this.c1 = new Float32Array(n * 3)
    this.alpha0 = new Float32Array(n)
    this.rot = new Float32Array(n)
    this.rotV = new Float32Array(n)
    this.drag = new Float32Array(n)
    this.grav = new Float32Array(n)
    this.stretch = new Float32Array(n)
    this.fadeIn = new Float32Array(n)
    this.tumble = new Uint8Array(n)

    const base = new THREE.PlaneGeometry(1, 1)
    const geo = new THREE.InstancedBufferGeometry()
    geo.index = base.index
    geo.setAttribute('position', base.getAttribute('position'))
    geo.setAttribute('uv', base.getAttribute('uv'))
    const mk = (size) => {
      const a = new THREE.InstancedBufferAttribute(new Float32Array(n * size), size)
      a.setUsage(THREE.DynamicDrawUsage)
      return a
    }
    this.aPos = mk(3)
    this.aSize = mk(2)
    this.aColor = mk(3)
    this.aAlpha = mk(1)
    this.aRot = mk(1)
    this.aStretch = mk(3)
    geo.setAttribute('iPos', this.aPos)
    geo.setAttribute('iSize', this.aSize)
    geo.setAttribute('iColor', this.aColor)
    geo.setAttribute('iAlpha', this.aAlpha)
    geo.setAttribute('iRot', this.aRot)
    geo.setAttribute('iStretch', this.aStretch)
    geo.instanceCount = 0
    this.geometry = geo
    this._baseGeometry = base

    const tex = Textures.get(texture)
    this.material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        { map: { value: null }, uHasMap: { value: 0 }, uAdditive: { value: additive ? 1 : 0 } },
      ]),
      vertexShader: PARTICLE_VERT,
      fragmentShader: PARTICLE_FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      fog: true,
      side: THREE.DoubleSide,
    })
    this.material.uniforms.map.value = tex
    this.material.uniforms.uHasMap.value = tex ? 1 : 0

    this.mesh = new THREE.Mesh(geo, this.material)
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = renderOrder
    this.mesh.visible = false
    this.mesh.matrixAutoUpdate = false
    this.mesh.name = `ParticlePool(${texture})`
  }

  /** Spawn one particle from the shared spec `P`. Oldest particle is recycled when full. */
  emit(p = P) {
    let i
    if (this.count < this.capacity) {
      i = this.count++
    } else {
      // recycle the particle closest to death
      i = 0
      let best = Infinity
      for (let k = 0; k < this.capacity; k += 7) {
        if (this.life[k] < best) {
          best = this.life[k]
          i = k
        }
      }
    }
    this.px[i] = p.x
    this.py[i] = p.y
    this.pz[i] = p.z
    this.vx[i] = p.vx
    this.vy[i] = p.vy
    this.vz[i] = p.vz
    this.life[i] = this.maxLife[i] = Math.max(0.016, p.life)
    this.size0[i] = p.size
    this.size1[i] = p.sizeEnd < 0 ? p.size : p.sizeEnd
    this.aspect[i] = p.aspect
    const c0 = linearRGB(hexOf(p.color))
    const c1 = p.colorEnd < 0 ? c0 : linearRGB(hexOf(p.colorEnd))
    const b = p.brightness
    this.c0[i * 3] = c0[0] * b
    this.c0[i * 3 + 1] = c0[1] * b
    this.c0[i * 3 + 2] = c0[2] * b
    this.c1[i * 3] = c1[0] * b
    this.c1[i * 3 + 1] = c1[1] * b
    this.c1[i * 3 + 2] = c1[2] * b
    this.alpha0[i] = p.alpha
    this.rot[i] = p.rot
    this.rotV[i] = p.rotV
    this.drag[i] = p.drag
    this.grav[i] = p.gravity
    this.stretch[i] = p.stretch
    this.fadeIn[i] = p.fadeIn
    this.tumble[i] = p.tumble ? 1 : 0
    return i
  }

  _kill(i) {
    const last = --this.count
    if (i === last) return
    this.px[i] = this.px[last]
    this.py[i] = this.py[last]
    this.pz[i] = this.pz[last]
    this.vx[i] = this.vx[last]
    this.vy[i] = this.vy[last]
    this.vz[i] = this.vz[last]
    this.life[i] = this.life[last]
    this.maxLife[i] = this.maxLife[last]
    this.size0[i] = this.size0[last]
    this.size1[i] = this.size1[last]
    this.aspect[i] = this.aspect[last]
    this.c0[i * 3] = this.c0[last * 3]
    this.c0[i * 3 + 1] = this.c0[last * 3 + 1]
    this.c0[i * 3 + 2] = this.c0[last * 3 + 2]
    this.c1[i * 3] = this.c1[last * 3]
    this.c1[i * 3 + 1] = this.c1[last * 3 + 1]
    this.c1[i * 3 + 2] = this.c1[last * 3 + 2]
    this.alpha0[i] = this.alpha0[last]
    this.rot[i] = this.rot[last]
    this.rotV[i] = this.rotV[last]
    this.drag[i] = this.drag[last]
    this.grav[i] = this.grav[last]
    this.stretch[i] = this.stretch[last]
    this.fadeIn[i] = this.fadeIn[last]
    this.tumble[i] = this.tumble[last]
  }

  update(dt) {
    let i = 0
    while (i < this.count) {
      const l = (this.life[i] -= dt)
      if (l <= 0) {
        this._kill(i)
        continue
      }
      const d = this.drag[i]
      if (d > 0) {
        const f = Math.max(0, 1 - d * dt)
        this.vx[i] *= f
        this.vy[i] *= f
        this.vz[i] *= f
      }
      this.vy[i] -= this.grav[i] * dt
      this.px[i] += this.vx[i] * dt
      this.py[i] += this.vy[i] * dt
      this.pz[i] += this.vz[i] * dt
      this.rot[i] += this.rotV[i] * dt
      i++
    }
    this._pack()
  }

  _pack() {
    const n = this.count
    this.mesh.visible = n > 0
    this.geometry.instanceCount = n
    if (n === 0) return
    const pos = this.aPos.array
    const size = this.aSize.array
    const col = this.aColor.array
    const alp = this.aAlpha.array
    const rot = this.aRot.array
    const str = this.aStretch.array
    for (let i = 0; i < n; i++) {
      const u = this.life[i] / this.maxLife[i] // 1 → 0
      const k = 1 - u
      pos[i * 3] = this.px[i]
      pos[i * 3 + 1] = this.py[i]
      pos[i * 3 + 2] = this.pz[i]
      let s = this.size0[i] + (this.size1[i] - this.size0[i]) * k
      let w = s
      const h = s * this.aspect[i]
      if (this.tumble[i]) w *= 0.25 + 0.75 * Math.abs(Math.cos(this.rot[i] * 1.7))
      const st = this.stretch[i]
      if (st > 0) {
        const vx = this.vx[i]
        const vy = this.vy[i]
        const vz = this.vz[i]
        const sp = Math.sqrt(vx * vx + vy * vy + vz * vz)
        w = Math.max(s, sp * st)
        str[i * 3] = vx
        str[i * 3 + 1] = vy
        str[i * 3 + 2] = vz
      } else {
        str[i * 3] = str[i * 3 + 1] = str[i * 3 + 2] = 0
      }
      size[i * 2] = w
      size[i * 2 + 1] = h
      col[i * 3] = this.c0[i * 3] + (this.c1[i * 3] - this.c0[i * 3]) * k
      col[i * 3 + 1] = this.c0[i * 3 + 1] + (this.c1[i * 3 + 1] - this.c0[i * 3 + 1]) * k
      col[i * 3 + 2] = this.c0[i * 3 + 2] + (this.c1[i * 3 + 2] - this.c0[i * 3 + 2]) * k
      let a = this.alpha0[i] * Math.min(1, u / 0.6)
      const fi = this.fadeIn[i]
      if (fi > 0) a *= Math.min(1, k / fi)
      alp[i] = a
      rot[i] = this.rot[i]
    }
    this._upload(this.aPos, n * 3)
    this._upload(this.aSize, n * 2)
    this._upload(this.aColor, n * 3)
    this._upload(this.aAlpha, n)
    this._upload(this.aRot, n)
    this._upload(this.aStretch, n * 3)
  }

  _upload(attr, count) {
    if (attr.clearUpdateRanges) {
      attr.clearUpdateRanges()
      attr.addUpdateRange(0, count)
    }
    attr.needsUpdate = true
  }

  clear() {
    this.count = 0
    this.geometry.instanceCount = 0
    this.mesh.visible = false
  }

  dispose() {
    this.geometry.dispose()
    this._baseGeometry.dispose()
    this.material.dispose()
  }
}

// ───────────────────────────── expanding ring sprites (shockwaves) ─────────────────────────────

export class RingPool {
  constructor(size = 10) {
    this.geometry = new THREE.PlaneGeometry(1, 1)
    this.items = []
    this.group = new THREE.Group()
    this.group.name = 'RingPool'
    const tex = Textures.get('ring')
    for (let i = 0; i < size; i++) {
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        color: 0xffffff,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        toneMapped: true,
      })
      const mesh = new THREE.Mesh(this.geometry, mat)
      mesh.visible = false
      mesh.renderOrder = 12
      mesh.frustumCulled = false
      this.group.add(mesh)
      this.items.push({ mesh, life: 0, maxLife: 1, s0: 0, s1: 1, a0: 1, flat: true })
    }
    this._next = 0
  }

  /**
   * @param {THREE.Vector3} pos
   * @param {{color?:number, size0?:number, size1?:number, life?:number, alpha?:number, flat?:boolean}} o
   */
  spawn(pos, o = {}) {
    const it = this.items[this._next]
    this._next = (this._next + 1) % this.items.length
    it.life = it.maxLife = o.life ?? 0.4
    it.s0 = o.size0 ?? 0.5
    it.s1 = o.size1 ?? 4
    it.a0 = o.alpha ?? 0.9
    it.flat = o.flat !== false
    it.mesh.material.color.setHex(o.color ?? 0xffffff)
    it.mesh.position.copy(pos)
    if (it.flat) {
      it.mesh.position.y += 0.05
      it.mesh.rotation.set(-Math.PI / 2, 0, 0)
    }
    it.mesh.visible = true
    it.mesh.scale.setScalar(it.s0)
    it.mesh.material.opacity = it.a0
  }

  update(dt, camera) {
    for (const it of this.items) {
      if (it.life <= 0) continue
      it.life -= dt
      if (it.life <= 0) {
        it.mesh.visible = false
        continue
      }
      const k = 1 - it.life / it.maxLife
      const e = 1 - (1 - k) * (1 - k)
      it.mesh.scale.setScalar(it.s0 + (it.s1 - it.s0) * e)
      it.mesh.material.opacity = it.a0 * (1 - k)
      if (!it.flat && camera) it.mesh.quaternion.copy(camera.quaternion)
    }
  }

  dispose() {
    for (const it of this.items) it.mesh.material.dispose()
    this.geometry.dispose()
  }
}
