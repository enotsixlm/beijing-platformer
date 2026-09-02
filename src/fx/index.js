/**
 * Module 5b — FX: pooled particles, per-kart emitters, skid marks, event bursts,
 * lightning flash, and the post-processing composer (`createPostFX`).
 */
import * as THREE from 'three'
import { EVT } from '../core/constants.js'
import { ParticlePool, RingPool, Textures, P, rand, randSpread } from './particles.js'
import { SkidMarks } from './skidMarks.js'
import { KartFx } from './kartFx.js'
import { AURA_VERT, AURA_FRAG } from './shaders.js'
export { createPostFX } from './postfx.js'

const RAINBOW = [0xff3b3b, 0xff8c1a, 0xffe14d, 0x5dff5d, 0x3ec1ff, 0x7a6bff, 0xd64bff, 0xff5ab8]
const CONFETTI = [0xff3b3b, 0xff8c1a, 0xffe14d, 0x3ddc84, 0x3ec1ff, 0xc84bff, 0xffffff, 0xff5ab8]

const _v = new THREE.Vector3()
const _v2 = new THREE.Vector3()
const _fwd = new THREE.Vector3()
const _right = new THREE.Vector3()

export class FXSystem {
  /** @param {{scene: THREE.Scene, events: import('../core/events.js').EventBus}} p */
  constructor({ scene, events } = {}) {
    this.scene = scene
    this.events = events
    this.time = 0
    this.karts = new Map()
    this._offs = []
    this._delayed = []
    this._lastHitFx = new Map()

    this.root = new THREE.Group()
    this.root.name = 'FXSystem'

    this.sparks = new ParticlePool({ capacity: 3000, texture: 'soft', additive: true, renderOrder: 10 })
    this.smoke = new ParticlePool({ capacity: 1500, texture: 'smoke', additive: false, renderOrder: 9 })
    this.chunks = new ParticlePool({ capacity: 800, texture: 'chunk', additive: false, renderOrder: 9 })
    this.streaks = new ParticlePool({ capacity: 400, texture: 'streak', additive: true, renderOrder: 10 })
    this.rings = new RingPool(10)
    this.skids = new SkidMarks(4000)
    this.root.add(this.sparks.mesh, this.smoke.mesh, this.chunks.mesh, this.streaks.mesh, this.rings.group, this.skids.mesh)

    this.shared = this._buildShared()

    // Full-screen lightning flash: a plane re-positioned in front of the camera each frame.
    this.flash = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false, fog: false })
    )
    this.flash.renderOrder = 1000
    this.flash.frustumCulled = false
    this.flash.visible = false
    this.flash.scale.setScalar(60)
    this._flashLife = 0
    this.root.add(this.flash)

    // Sky bolts.
    this.bolts = []
    const boltTex = Textures.get('bolt')
    for (let i = 0; i < 3; i++) {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({ map: boltTex, color: new THREE.Color(0xdcefff).multiplyScalar(2.2), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false, fog: false, side: THREE.DoubleSide })
      )
      m.visible = false
      m.frustumCulled = false
      m.renderOrder = 999
      this.root.add(m)
      this.bolts.push({ mesh: m, life: 0, maxLife: 0.3, seed: Math.random() * 10 })
    }

    if (scene) scene.add(this.root)
    this._wire()
  }

  _buildShared() {
    const flameGeo = new THREE.ConeGeometry(0.22, 1, 10, 1, true)
    flameGeo.rotateX(-Math.PI / 2)
    flameGeo.translate(0, 0, -0.5)
    const flameOuterMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xff6a1a).multiplyScalar(1.6), transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })
    const flameInnerMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xfff2a8).multiplyScalar(1.8), transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })
    const auraGeo = new THREE.SphereGeometry(1, 28, 18)
    const auraMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uIntensity: { value: 1 } },
      vertexShader: AURA_VERT,
      fragmentShader: AURA_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
    })
    const dizzyMat = new THREE.SpriteMaterial({ map: Textures.get('star'), color: 0xffd93d, transparent: true, depthWrite: false, fog: false })
    return { flameGeo, flameOuterMat, flameInnerMat, auraGeo, auraMat, dizzyMat }
  }

  // ───────────────────────────── karts ─────────────────────────────

  attachKart(kart) {
    if (!kart || this.karts.has(kart)) return
    this.karts.set(kart, new KartFx(kart, this))
  }

  detachKart(kart) {
    const k = this.karts.get(kart)
    if (!k) return
    k.dispose()
    this.karts.delete(kart)
  }

  // ───────────────────────────── generic bursts ─────────────────────────────

  /**
   * Generic radial particle burst.
   * @param {THREE.Vector3|{x:number,y:number,z:number}} position
   * @param {{color?:number, colorEnd?:number, count?:number, speed?:number, size?:number, life?:number, brightness?:number, up?:number, gravity?:number, drag?:number, pool?:'sparks'|'smoke'|'chunks', alpha?:number, stretch?:number, spread?:number}} o
   */
  burst(position, o = {}) {
    if (!position) return
    const pool = o.pool === 'smoke' ? this.smoke : o.pool === 'chunks' ? this.chunks : this.sparks
    const count = o.count ?? 20
    const speed = o.speed ?? 5
    const size = o.size ?? 0.2
    const life = o.life ?? 0.5
    const spread = o.spread ?? 0.1
    const color = o.color ?? 0xffffff
    for (let i = 0; i < count; i++) {
      P.reset()
      P.x = position.x + randSpread(spread)
      P.y = position.y + randSpread(spread)
      P.z = position.z + randSpread(spread)
      // uniform-ish direction on a sphere
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      const sp = speed * (0.4 + Math.random() * 0.8)
      P.vx = Math.sin(ph) * Math.cos(th) * sp
      P.vy = Math.cos(ph) * sp + (o.up ?? 0)
      P.vz = Math.sin(ph) * Math.sin(th) * sp
      P.life = life * (0.6 + Math.random() * 0.8)
      P.size = size * (0.6 + Math.random() * 0.8)
      P.sizeEnd = pool === this.sparks ? size * 0.15 : size * 2
      P.color = Array.isArray(color) ? color[(Math.random() * color.length) | 0] : color
      P.colorEnd = o.colorEnd ?? -1
      P.brightness = o.brightness ?? (pool === this.sparks ? 1.5 : 1)
      P.alpha = o.alpha ?? (pool === this.sparks ? 0.95 : 0.5)
      P.gravity = o.gravity ?? (pool === this.sparks ? 6 : 0)
      P.drag = o.drag ?? (pool === this.sparks ? 0.8 : 1.5)
      P.stretch = o.stretch ?? (pool === this.sparks ? 0.03 : 0)
      P.rot = Math.random() * 6.28
      P.rotV = randSpread(pool === this.chunks ? 12 : 2)
      P.tumble = pool === this.chunks ? 1 : 0
      P.fadeIn = pool === this.smoke ? 0.1 : 0
      pool.emit(P)
    }
  }

  /** Bob-omb: fireball, smoke, flash, chunks and an expanding ground ring. */
  explosion(position) {
    if (!position) return
    // fireball sparks
    this.burst(position, { color: [0xffe27a, 0xff9a2e, 0xff5a1c], colorEnd: 0x7a1a05, count: 90, speed: 11, size: 0.45, life: 0.55, brightness: 1.9, up: 3, gravity: 5, drag: 1.2, stretch: 0.02 })
    // flash core
    P.reset()
    P.x = position.x
    P.y = position.y + 0.6
    P.z = position.z
    P.life = 0.18
    P.size = 5
    P.sizeEnd = 1.5
    P.color = 0xfff4d0
    P.brightness = 2.5
    P.alpha = 1
    this.sparks.emit(P)
    // lingering smoke
    this.burst(position, { pool: 'smoke', color: [0x46464c, 0x5e5e64, 0x2e2e33], count: 30, speed: 4.5, size: 0.9, life: 1.8, up: 2.5, drag: 1.6, alpha: 0.55 })
    // debris chunks
    this.burst(position, { pool: 'chunks', color: [0x222228, 0x444450, 0xff8c1a], count: 24, speed: 9, size: 0.16, life: 1.2, up: 6, gravity: 16, drag: 0.4, alpha: 1 })
    this.rings.spawn(position, { color: 0xffb060, size0: 0.8, size1: 12, life: 0.5, alpha: 0.9, flat: true })
    this.rings.spawn(position, { color: 0xffe0b0, size0: 0.5, size1: 6, life: 0.3, alpha: 0.8, flat: false })
  }

  /** Shell impact: white/yellow sparks + small shockwave ring. */
  hitSpark(position) {
    if (!position) return
    this.burst(position, { color: [0xffffff, 0xfff1a0, 0xffd23c], count: 32, speed: 8, size: 0.16, life: 0.4, brightness: 1.9, up: 2, gravity: 9, stretch: 0.035 })
    P.reset()
    P.x = position.x
    P.y = position.y + 0.4
    P.z = position.z
    P.life = 0.12
    P.size = 2.2
    P.sizeEnd = 0.6
    P.color = 0xffffff
    P.brightness = 2
    P.alpha = 0.9
    this.sparks.emit(P)
    _v.set(position.x, position.y + 0.5, position.z)
    this.rings.spawn(_v, { color: 0xffffff, size0: 0.4, size1: 3.5, life: 0.3, alpha: 0.8, flat: false })
  }

  /** Banana: yellow chunks + a pale puff. */
  bananaSplat(position) {
    if (!position) return
    this.burst(position, { pool: 'chunks', color: [0xffd93d, 0xffe680, 0xf2c200], count: 22, speed: 6, size: 0.18, life: 0.9, up: 5, gravity: 14, drag: 0.5, alpha: 1 })
    this.burst(position, { pool: 'smoke', color: 0xfff3b0, count: 8, speed: 2, size: 0.5, life: 0.6, up: 1, alpha: 0.45 })
  }

  /** Full-screen white flash (0.35 s) + jagged bolt sprites in the sky. */
  lightningFlash() {
    this._flashLife = 0.35
    this.flash.visible = true
    this.flash.material.opacity = 1
    for (const b of this.bolts) {
      b.life = b.maxLife = 0.28 + Math.random() * 0.12
      b.mesh.visible = true
      b.seed = Math.random() * 10
      b.pending = true
    }
  }

  /** Multi-coloured tumbling confetti around `position`. */
  confetti(position) {
    if (!position) return
    this.burst(position, { pool: 'chunks', color: CONFETTI, count: 110, speed: 7, size: 0.16, life: 2.6, up: 9, gravity: 5, drag: 1.1, alpha: 1, spread: 0.6 })
    this.burst(position, { color: [0xffffff, 0xfff1a0], count: 30, speed: 5, size: 0.14, life: 0.7, brightness: 1.8, up: 4, gravity: 3 })
    this._later(0.45, () => this.burst(position, { pool: 'chunks', color: CONFETTI, count: 70, speed: 6, size: 0.16, life: 2.4, up: 8, gravity: 5, drag: 1.1, alpha: 1, spread: 0.8 }))
  }

  /** Lay a short skid-mark decal at `position` along `heading`. */
  skidMark(position, heading, intensity = 0.7) {
    if (!position) return
    _v.set(position.x, position.y + 0.02, position.z)
    this.skids.mark(_v, heading || 0, intensity)
  }

  /** Grey spark burst (walls / hazards). */
  wallSpark(position) {
    if (!position) return
    this.burst(position, { color: [0xdddddd, 0xbbbbbb, 0xfff1a0], count: 18, speed: 6, size: 0.12, life: 0.35, brightness: 1.4, up: 2, gravity: 10, stretch: 0.03 })
    this.burst(position, { pool: 'smoke', color: 0x9a9a9a, count: 4, speed: 1.5, size: 0.35, life: 0.5, alpha: 0.4 })
  }

  /** Respawn poof / landing puff. */
  poof(position, scale = 1) {
    if (!position) return
    this.burst(position, { pool: 'smoke', color: [0xffffff, 0xe8e8ee], count: Math.round(14 * scale), speed: 2.5 * scale, size: 0.45 * scale, life: 0.7, up: 1.2, drag: 1.8, alpha: 0.55 })
  }

  landPuff(kart) {
    if (!kart || !kart.position) return
    const y = kart.surface && typeof kart.surface.height === 'number' ? kart.surface.height : kart.position.y
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2
      P.reset()
      P.x = kart.position.x + Math.cos(a) * 0.6
      P.y = y + 0.1
      P.z = kart.position.z + Math.sin(a) * 0.6
      P.vx = Math.cos(a) * 3
      P.vy = 0.6
      P.vz = Math.sin(a) * 3
      P.life = rand(0.35, 0.55)
      P.size = 0.35
      P.sizeEnd = 0.9
      P.color = 0xd8d2c4
      P.alpha = 0.45
      P.drag = 3
      this.smoke.emit(P)
    }
  }

  sparkleBurst(position, count = 40) {
    this.burst(position, { color: RAINBOW, count, speed: 5, size: 0.22, life: 0.7, brightness: 1.9, up: 3, gravity: 2, drag: 1.2, stretch: 0 })
  }

  // ───────────────────────────── frame ─────────────────────────────

  update(dt, camera) {
    if (!(dt > 0)) dt = 1 / 60
    this.time += dt
    this.shared.auraMat.uniforms.uTime.value = this.time

    for (const k of this.karts.values()) k.update(dt)

    this.sparks.update(dt)
    this.smoke.update(dt)
    this.chunks.update(dt)
    this.streaks.update(dt)
    this.skids.update()
    this.rings.update(dt, camera)
    this._updateFlash(dt, camera)

    if (this._delayed.length) {
      for (let i = this._delayed.length - 1; i >= 0; i--) {
        const d = this._delayed[i]
        d.t -= dt
        if (d.t <= 0) {
          this._delayed.splice(i, 1)
          try {
            d.fn()
          } catch (err) {
            console.warn('[fx] delayed action failed', err)
          }
        }
      }
    }
  }

  _updateFlash(dt, camera) {
    if (this._flashLife > 0) {
      this._flashLife -= dt
      const k = Math.max(0, this._flashLife / 0.35)
      if (camera) {
        camera.getWorldDirection(_fwd)
        this.flash.position.copy(camera.position).addScaledVector(_fwd, 1.0)
        this.flash.quaternion.copy(camera.quaternion)
      }
      this.flash.material.opacity = k * k * 0.95
      this.flash.visible = k > 0
    } else if (this.flash.visible) {
      this.flash.visible = false
    }
    for (const b of this.bolts) {
      if (b.life <= 0) {
        if (b.mesh.visible) b.mesh.visible = false
        continue
      }
      b.life -= dt
      if (b.pending && camera) {
        b.pending = false
        camera.getWorldDirection(_fwd)
        _right.set(_fwd.z, 0, -_fwd.x).normalize()
        const dist = 130 + Math.random() * 90
        const side = randSpread(110)
        b.mesh.position.copy(camera.position).addScaledVector(_fwd, dist).addScaledVector(_right, side)
        b.mesh.position.y = camera.position.y + 40 + Math.random() * 45
        const h = 70 + Math.random() * 50
        b.mesh.scale.set(h * 0.45, h, 1)
      }
      if (camera) b.mesh.quaternion.copy(camera.quaternion)
      const u = Math.max(0, b.life / b.maxLife)
      const flicker = 0.6 + 0.4 * Math.abs(Math.sin(this.time * 60 + b.seed))
      b.mesh.material.opacity = u * flicker
      b.mesh.visible = u > 0
    }
  }

  _later(seconds, fn) {
    this._delayed.push({ t: seconds, fn })
  }

  /** Reset transient state (new race). Keeps kart attachments. */
  clear() {
    this.sparks.clear()
    this.smoke.clear()
    this.chunks.clear()
    this.streaks.clear()
    this.skids.clear()
    this._delayed.length = 0
  }

  // ───────────────────────────── events ─────────────────────────────

  _wire() {
    const ev = this.events
    if (!ev || typeof ev.on !== 'function') return
    const on = (type, fn) => this._offs.push(ev.on(type, fn))
    const posOf = (p) => (p && (p.position || (p.kart && p.kart.position))) || null
    const dedupe = (kart, kind, window = 0.12) => {
      if (!kart) return true
      const key = kart
      const last = this._lastHitFx.get(key)
      if (last && last.kind === kind && this.time - last.t < window) return false
      if (last) {
        last.kind = kind
        last.t = this.time
      } else this._lastHitFx.set(key, { kind, t: this.time })
      return true
    }

    on(EVT.ITEM_HIT, (p) => {
      const pos = posOf(p)
      const item = typeof p?.item === 'string' ? p.item : p?.item?.id
      if (item && /banana/.test(item)) {
        if (dedupe(p.kart, 'banana')) this.bananaSplat(pos)
      } else if (dedupe(p.kart, 'shell')) this.hitSpark(pos)
    })
    on(EVT.EXPLOSION, (p) => this.explosion(posOf(p)))
    on(EVT.HIT, (p) => {
      const pos = posOf(p)
      switch (p?.kind) {
        case 'banana': if (dedupe(p.kart, 'banana')) this.bananaSplat(pos); break
        case 'shell': if (dedupe(p.kart, 'shell')) this.hitSpark(pos); break
        case 'hazard': this.wallSpark(pos); break
        default: break // explosion → EXPLOSION event, lightning → stun sparks via kart state
      }
    })
    on(EVT.LIGHTNING, () => this.lightningFlash())
    on(EVT.FINISH, (p) => {
      if (p?.kart?.isPlayer) {
        _v2.copy(p.kart.position)
        _v2.y += 1
        this.confetti(_v2.clone())
      }
    })
    on(EVT.STAR_START, (p) => {
      const pos = posOf(p)
      if (pos) {
        _v.set(pos.x, pos.y + 0.8, pos.z)
        this.sparkleBurst(_v, 50)
      }
    })
    on(EVT.ITEM_PICKUP, (p) => {
      const pos = posOf(p)
      if (pos) {
        _v.set(pos.x, pos.y + 1, pos.z)
        this.burst(_v, { color: [0xffffff, 0xfff1a0, 0x9ad0ff, 0xd64bff], count: 26, speed: 3.5, size: 0.16, life: 0.6, brightness: 1.8, up: 2.5, gravity: 2, drag: 1.5, stretch: 0 })
      }
    })
    on(EVT.RESPAWN, (p) => {
      const pos = posOf(p)
      if (pos) {
        _v.set(pos.x, pos.y + 0.6, pos.z)
        this.poof(_v, 1.3)
      }
    })
    on(EVT.WALL_HIT, (p) => {
      const k = p?.kart
      if (!k || !k.position) return
      _v.copy(k.position)
      _v.y += 0.4
      const s = k.surface
      if (s && s.right && typeof s.lateral === 'number') _v.addScaledVector(s.right, Math.sign(s.lateral) * 0.9)
      this.wallSpark(_v)
    })
    on(EVT.KART_BUMP, (p) => {
      const a = p?.a
      const b = p?.b
      if (a && b && a.position && b.position) {
        _v.addVectors(a.position, b.position).multiplyScalar(0.5)
        _v.y += 0.5
      } else if (p?.kart?.position) {
        _v.copy(p.kart.position)
        _v.y += 0.5
      } else return
      this.burst(_v, { pool: 'smoke', color: 0xffffff, count: 6, speed: 1.8, size: 0.3, life: 0.4, alpha: 0.5 })
      this.burst(_v, { color: 0xffffff, count: 6, speed: 4, size: 0.1, life: 0.25, brightness: 1.5, gravity: 6 })
    })
    on(EVT.LAND, (p) => this.landPuff(p?.kart))
    on(EVT.SHELL_BOUNCE, (p) => {
      const pos = posOf(p)
      if (pos) this.burst(pos, { color: [0xffffff, 0xfff1a0], count: 8, speed: 4, size: 0.1, life: 0.3, brightness: 1.6, gravity: 8 })
    })
    on(EVT.SCREEN, (p) => {
      if (p && (p.name === 'race' || p.name === 'title' || p.name === 'select')) this.clear()
    })
  }

  dispose() {
    for (const off of this._offs) off()
    this._offs = []
    for (const k of this.karts.values()) k.dispose()
    this.karts.clear()
    if (this.root.parent) this.root.parent.remove(this.root)
    this.sparks.dispose()
    this.smoke.dispose()
    this.chunks.dispose()
    this.streaks.dispose()
    this.rings.dispose()
    this.skids.dispose()
    this.flash.geometry.dispose()
    this.flash.material.dispose()
    for (const b of this.bolts) {
      b.mesh.geometry.dispose()
      b.mesh.material.dispose()
    }
    const s = this.shared
    s.flameGeo.dispose()
    s.flameOuterMat.dispose()
    s.flameInnerMat.dispose()
    s.auraGeo.dispose()
    s.auraMat.dispose()
    s.dizzyMat.dispose()
    Textures.dispose()
  }
}
