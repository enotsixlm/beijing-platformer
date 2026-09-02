/**
 * Per-kart effects driven from kart.state every frame: drift sparks, exhaust, boost flames
 * and streaks, off-road dust, star aura, stun sparks, dizzy stars, boost-pad bursts and skid marks.
 * Rate-based emission with accumulators; no allocations per frame.
 */
import * as THREE from 'three'
import { P, rand, randSpread } from './particles.js'

const DRIFT_COLORS = [0xe8e8e8, 0x3ec1ff, 0xff9f1c, 0xd64bff]
const DRIFT_RATES = [70, 130, 190, 270]
const RAINBOW = [0xff3b3b, 0xff8c1a, 0xffe14d, 0x5dff5d, 0x3ec1ff, 0x7a6bff, 0xd64bff, 0xff5ab8]

const WHEEL_L = { x: -0.7, y: 0.28, z: -0.75 }
const WHEEL_R = { x: 0.7, y: 0.28, z: -0.75 }
const EXHAUST_L = { x: -0.25, y: 0.7, z: -1.1 }
const EXHAUST_R = { x: 0.25, y: 0.7, z: -1.1 }

const _w = new THREE.Vector3()

export class KartFx {
  /**
   * @param {object} kart Kart (see ARCHITECTURE.md Module 2)
   * @param {import('./index.js').FXSystem} fx
   */
  constructor(kart, fx) {
    this.kart = kart
    this.fx = fx
    this.acc = { drift: 0, glow: 0, exhaust: 0, boost: 0, boostSmoke: 0, streak: 0, dust: 0, star: 0, stun: 0, stunSmoke: 0 }
    this.prevSurface = null
    this.prevBoost = 0
    this.prevAirborne = false
    this.time = Math.random() * 10

    const obj = kart.object
    this.root = new THREE.Group()
    this.root.name = 'KartFx'

    // Boost flames: outer orange + inner yellow cone at each exhaust.
    this.flames = []
    for (const e of [EXHAUST_L, EXHAUST_R]) {
      const g = new THREE.Group()
      g.position.set(e.x, e.y, e.z)
      const outer = new THREE.Mesh(fx.shared.flameGeo, fx.shared.flameOuterMat)
      const inner = new THREE.Mesh(fx.shared.flameGeo, fx.shared.flameInnerMat)
      inner.scale.set(0.55, 0.55, 0.7)
      g.add(outer, inner)
      g.visible = false
      this.root.add(g)
      this.flames.push({ group: g, outer, inner })
    }

    // Star aura shell.
    this.aura = new THREE.Mesh(fx.shared.auraGeo, fx.shared.auraMat)
    this.aura.position.set(0, 0.75, 0)
    this.aura.scale.set(1.25, 0.95, 1.55)
    this.aura.visible = false
    this.aura.renderOrder = 11
    this.root.add(this.aura)

    // Dizzy stars orbiting the driver's head while spun out.
    this.dizzy = new THREE.Group()
    this.dizzy.position.set(0, 1.75, 0)
    for (let i = 0; i < 3; i++) {
      const s = new THREE.Sprite(fx.shared.dizzyMat)
      const a = (i / 3) * Math.PI * 2
      s.position.set(Math.cos(a) * 0.55, 0, Math.sin(a) * 0.55)
      s.scale.setScalar(0.32)
      this.dizzy.add(s)
    }
    this.dizzy.visible = false
    this.root.add(this.dizzy)

    if (obj && obj.add) obj.add(this.root)
  }

  _local(l, out) {
    const k = this.kart
    const h = k.heading || 0
    const sc = (k.object && k.object.scale && k.object.scale.x) || 1
    const fx = Math.sin(h)
    const fz = Math.cos(h)
    const rx = fz
    const rz = -fx
    const p = k.position
    out.x = p.x + (rx * l.x + fx * l.z) * sc
    out.y = p.y + l.y * sc
    out.z = p.z + (rz * l.x + fz * l.z) * sc
    return out
  }

  update(dt) {
    const k = this.kart
    const s = k.state
    if (!s) return
    const fx = this.fx
    this.time += dt
    const h = k.heading || 0
    const fwdX = Math.sin(h)
    const fwdZ = Math.cos(h)
    const rightX = fwdZ
    const rightZ = -fwdX
    const speed = Math.abs(k.speed || 0)
    const vel = k.velocity
    const vx = vel ? vel.x : fwdX * k.speed
    const vz = vel ? vel.z : fwdZ * k.speed
    const airborne = !!s.airborne
    const surf = k.surface
    const surfType = surf ? surf.type : 'road'
    const roadY = surf && typeof surf.height === 'number' ? surf.height : k.position.y
    const sparks = fx.sparks
    const smoke = fx.smoke

    // ── (a) drift sparks + skid marks ──────────────────────────────
    const braking = k.controls && k.controls.brake > 0.6 && speed > 8
    const skidding = !airborne && (s.drifting || braking)
    if (s.drifting && !airborne) {
      const level = Math.max(0, Math.min(3, s.driftLevel | 0))
      const color = DRIFT_COLORS[level]
      this.acc.drift += DRIFT_RATES[level] * dt
      while (this.acc.drift >= 1) {
        this.acc.drift -= 1
        const side = Math.random() < 0.5 ? -1 : 1
        this._local(side < 0 ? WHEEL_L : WHEEL_R, _w)
        P.reset()
        P.x = _w.x + randSpread(0.1)
        P.y = _w.y - 0.1
        P.z = _w.z + randSpread(0.1)
        const back = 4 + Math.random() * 5 + level * 1.5
        const out = (1 + Math.random() * 2.5) * side
        P.vx = -fwdX * back + rightX * out + vx * 0.3 + randSpread(0.8)
        P.vy = 0.6 + Math.random() * 3.2
        P.vz = -fwdZ * back + rightZ * out + vz * 0.3 + randSpread(0.8)
        P.life = rand(0.22, 0.5)
        P.size = 0.1 + level * 0.035 + Math.random() * 0.12
        P.sizeEnd = 0.03
        P.color = color
        P.colorEnd = level === 0 ? 0x888888 : color
        P.brightness = 1.9 + level * 0.3
        P.alpha = 1
        P.gravity = 12
        P.stretch = 0.05
        sparks.emit(P)
      }
      // Glow at the wheels.
      this.acc.glow += 24 * dt
      while (this.acc.glow >= 1) {
        this.acc.glow -= 1
        for (const wl of [WHEEL_L, WHEEL_R]) {
          this._local(wl, _w)
          P.reset()
          P.x = _w.x
          P.y = _w.y - 0.05
          P.z = _w.z
          P.vx = vx * 0.8
          P.vz = vz * 0.8
          P.life = 0.1
          P.size = 0.7 + level * 0.15
          P.sizeEnd = 0.3
          P.color = color
          P.brightness = 1.6
          P.alpha = 0.7
          sparks.emit(P)
        }
      }
    }
    if (skidding) {
      const intensity = s.drifting ? 0.55 + 0.15 * (s.driftLevel | 0) : 0.7
      this._local(WHEEL_L, _w)
      fx.skids.extend(k.index * 2, _w.x, roadY + 0.02, _w.z, h, intensity)
      this._local(WHEEL_R, _w)
      fx.skids.extend(k.index * 2 + 1, _w.x, roadY + 0.02, _w.z, h, intensity)
    } else {
      fx.skids.release(k.index * 2)
      fx.skids.release(k.index * 2 + 1)
    }

    // ── (b) exhaust puffs at low speed ─────────────────────────────
    if (speed < 8 && !airborne && s.boostTimer <= 0) {
      this.acc.exhaust += (4 + (1 - speed / 8) * 7) * dt
      while (this.acc.exhaust >= 1) {
        this.acc.exhaust -= 1
        const e = Math.random() < 0.5 ? EXHAUST_L : EXHAUST_R
        this._local(e, _w)
        P.reset()
        P.x = _w.x
        P.y = _w.y
        P.z = _w.z
        P.vx = -fwdX * 1.4 + vx * 0.3 + randSpread(0.4)
        P.vy = 0.7 + Math.random() * 0.6
        P.vz = -fwdZ * 1.4 + vz * 0.3 + randSpread(0.4)
        P.life = rand(0.7, 1.1)
        P.size = 0.18
        P.sizeEnd = 0.6
        P.color = 0xa8a8ad
        P.colorEnd = 0x8a8a90
        P.alpha = 0.4
        P.drag = 1.6
        P.fadeIn = 0.12
        P.rot = Math.random() * 6.28
        P.rotV = randSpread(1.5)
        smoke.emit(P)
      }
    }

    // ── (c) boost flames, trail, streaks ───────────────────────────
    const boosting = s.boostTimer > 0
    if (boosting && this.prevBoost <= 0) {
      this._local(EXHAUST_L, _w)
      fx.burst(_w, { color: 0xffb347, count: 14, speed: 5, size: 0.2, life: 0.35, brightness: 1.8 })
      this._local(EXHAUST_R, _w)
      fx.burst(_w, { color: 0xffb347, count: 14, speed: 5, size: 0.2, life: 0.35, brightness: 1.8 })
    }
    this.prevBoost = s.boostTimer
    for (const f of this.flames) {
      f.group.visible = boosting
      if (!boosting) continue
      const flick = 0.85 + Math.random() * 0.35
      const len = 0.8 + Math.min(1, speed / 32) * 0.7
      f.group.scale.set(flick, flick, len * (0.9 + Math.random() * 0.3))
      f.inner.scale.set(0.55, 0.55, 0.7 + Math.random() * 0.2)
    }
    if (boosting) {
      this.acc.boost += 150 * dt
      while (this.acc.boost >= 1) {
        this.acc.boost -= 1
        const e = Math.random() < 0.5 ? EXHAUST_L : EXHAUST_R
        this._local(e, _w)
        P.reset()
        P.x = _w.x + randSpread(0.08)
        P.y = _w.y + randSpread(0.08)
        P.z = _w.z + randSpread(0.08)
        const back = 5 + Math.random() * 5
        P.vx = -fwdX * back + vx * 0.5 + randSpread(1.2)
        P.vy = randSpread(1) + 0.3
        P.vz = -fwdZ * back + vz * 0.5 + randSpread(1.2)
        P.life = rand(0.18, 0.4)
        P.size = 0.34
        P.sizeEnd = 0.05
        P.color = 0xfff0a0
        P.colorEnd = 0xff4a10
        P.brightness = 1.9
        P.alpha = 0.9
        P.stretch = 0.03
        sparks.emit(P)
      }
      this.acc.boostSmoke += 16 * dt
      while (this.acc.boostSmoke >= 1) {
        this.acc.boostSmoke -= 1
        const e = Math.random() < 0.5 ? EXHAUST_L : EXHAUST_R
        this._local(e, _w)
        P.reset()
        P.x = _w.x - fwdX * 0.8
        P.y = _w.y
        P.z = _w.z - fwdZ * 0.8
        P.vx = -fwdX * 2 + vx * 0.4 + randSpread(0.6)
        P.vy = 0.8 + Math.random()
        P.vz = -fwdZ * 2 + vz * 0.4 + randSpread(0.6)
        P.life = rand(0.5, 0.8)
        P.size = 0.3
        P.sizeEnd = 1.0
        P.color = 0x5a5a60
        P.colorEnd = 0x3a3a40
        P.alpha = 0.32
        P.drag = 1.5
        P.fadeIn = 0.15
        P.rotV = randSpread(2)
        smoke.emit(P)
      }
      // Speed streaks flying past the kart.
      this.acc.streak += (30 + speed) * dt
      while (this.acc.streak >= 1) {
        this.acc.streak -= 1
        const a = Math.random() * Math.PI * 2
        const r = 1.3 + Math.random() * 1.6
        const ox = rightX * Math.cos(a) * r
        const oz = rightZ * Math.cos(a) * r
        const oy = 0.7 + Math.sin(a) * r * 0.7
        const ahead = rand(-1, 3)
        P.reset()
        P.x = k.position.x + ox + fwdX * ahead
        P.y = k.position.y + oy
        P.z = k.position.z + oz + fwdZ * ahead
        const sp = 28 + speed
        P.vx = -fwdX * sp
        P.vz = -fwdZ * sp
        P.life = rand(0.18, 0.3)
        P.size = 0.05
        P.color = 0xfff3cc
        P.brightness = 1.4
        P.alpha = 0.75
        P.stretch = 0.07
        fx.streaks.emit(P)
      }
    }

    // ── (d) off-road dust ──────────────────────────────────────────
    if (surfType === 'offroad' && speed > 5 && !airborne) {
      this.acc.dust += (26 + speed * 0.9) * dt
      while (this.acc.dust >= 1) {
        this.acc.dust -= 1
        const side = Math.random() < 0.5 ? -1 : 1
        this._local(side < 0 ? WHEEL_L : WHEEL_R, _w)
        P.reset()
        P.x = _w.x + randSpread(0.25)
        P.y = roadY + 0.2
        P.z = _w.z + randSpread(0.25)
        const back = 1.5 + speed * 0.14
        P.vx = -fwdX * back + rightX * side * (1 + Math.random() * 1.2) + vx * 0.25 + randSpread(0.6)
        P.vy = 1.2 + Math.random() * 2
        P.vz = -fwdZ * back + rightZ * side * (1 + Math.random() * 1.2) + vz * 0.25 + randSpread(0.6)
        P.life = rand(0.8, 1.4)
        P.size = 0.6
        P.sizeEnd = 2.2
        P.color = 0xcfae80
        P.colorEnd = 0xb0946c
        P.alpha = 0.62
        P.drag = 1.4
        P.fadeIn = 0.15
        P.rot = Math.random() * 6.28
        P.rotV = randSpread(1.2)
        smoke.emit(P)
      }
    }

    // ── (e) star aura + sparkles ───────────────────────────────────
    const star = s.starTimer > 0
    this.aura.visible = star
    if (star) {
      this.acc.star += 45 * dt
      while (this.acc.star >= 1) {
        this.acc.star -= 1
        P.reset()
        P.x = k.position.x + rightX * randSpread(1.1) + fwdX * randSpread(1.4)
        P.y = k.position.y + rand(0.1, 1.7)
        P.z = k.position.z + rightZ * randSpread(1.1) + fwdZ * randSpread(1.4)
        P.vx = vx * 0.85 + randSpread(0.6)
        P.vy = 0.8 + Math.random() * 1.6
        P.vz = vz * 0.85 + randSpread(0.6)
        P.life = rand(0.35, 0.7)
        P.size = rand(0.14, 0.3)
        P.sizeEnd = 0.02
        P.color = RAINBOW[(Math.random() * RAINBOW.length) | 0]
        P.brightness = 1.9
        P.alpha = 0.95
        P.rotV = randSpread(6)
        sparks.emit(P)
      }
    }

    // ── (f) stun sparks / dizzy stars ──────────────────────────────
    if (s.stunTimer > 0) {
      this.acc.stun += 55 * dt
      while (this.acc.stun >= 1) {
        this.acc.stun -= 1
        P.reset()
        P.x = k.position.x + randSpread(0.8)
        P.y = k.position.y + rand(0.3, 1.4)
        P.z = k.position.z + randSpread(0.8)
        P.vx = randSpread(4) + vx * 0.5
        P.vy = rand(0.5, 4)
        P.vz = randSpread(4) + vz * 0.5
        P.life = rand(0.2, 0.45)
        P.size = 0.16
        P.sizeEnd = 0.03
        P.color = Math.random() < 0.5 ? 0xbfe6ff : 0xffffff
        P.brightness = 2.2
        P.gravity = 7
        P.stretch = 0.06
        sparks.emit(P)
      }
      this.acc.stunSmoke += 7 * dt
      while (this.acc.stunSmoke >= 1) {
        this.acc.stunSmoke -= 1
        P.reset()
        P.x = k.position.x + randSpread(0.5)
        P.y = k.position.y + 0.9
        P.z = k.position.z + randSpread(0.5)
        P.vx = randSpread(0.4) + vx * 0.5
        P.vy = 1.2
        P.vz = randSpread(0.4) + vz * 0.5
        P.life = rand(0.5, 0.8)
        P.size = 0.25
        P.sizeEnd = 0.7
        P.color = 0x444448
        P.alpha = 0.4
        P.drag = 1.5
        P.fadeIn = 0.1
        smoke.emit(P)
      }
    }
    const spinning = s.spinTimer > 0 && !(s.stunTimer > 0)
    this.dizzy.visible = spinning
    if (spinning) {
      this.dizzy.rotation.y += dt * 7
      this.dizzy.position.y = 1.75 + Math.sin(this.time * 9) * 0.05
    }

    // ── (h) boost pad edge trigger ─────────────────────────────────
    if (surfType === 'boost' && this.prevSurface !== 'boost' && this.prevSurface !== null) {
      fx.burst(k.position, { color: 0xffe14d, count: 30, speed: 7, size: 0.18, life: 0.45, brightness: 1.8, up: 3 })
      fx.rings.spawn(k.position, { color: 0xffd23c, size0: 0.6, size1: 4.5, life: 0.4, alpha: 0.8, flat: true })
    }
    this.prevSurface = surfType
    this.prevAirborne = airborne
  }

  dispose() {
    this.aura.visible = false
    this.dizzy.visible = false
    for (const f of this.flames) f.group.visible = false
    if (this.root.parent) this.root.parent.remove(this.root)
    this.fx.skids.release(this.kart.index * 2)
    this.fx.skids.release(this.kart.index * 2 + 1)
  }
}
