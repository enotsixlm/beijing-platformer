/**
 * Module 2 — Kart physics.
 *
 * Model: the kart has a body yaw `heading` and a travel yaw `velYaw`. Velocity is
 * `dir(velYaw) * speed + impulse` where `impulse` is a decaying residual from bumps/bounces.
 * Grounded driving pulls `velYaw` toward `heading` (grip); drifting drives `velYaw` directly
 * and holds `heading` offset from it by a visible slip angle (~15–25°) in the drift direction.
 * See ARCHITECTURE.md for the public contract.
 */
import * as THREE from 'three'
import { EVT, SURFACE, KART_RADIUS, KMH_FACTOR } from '../core/constants.js'
import { clamp, damp, angleDelta } from '../core/rng.js'
import { derivePhysics } from './characters.js'
import { buildKartModel } from './kartModel.js'

/** Tuning constants (exported for tests / AI module reference). */
export const TUNE = Object.freeze({
  reverseMax: 8,
  brakeDecel: 22,
  reverseAccel: 7,
  coastFriction: 3,
  coastDrag: 0.05,
  offroadDrag: 2.5,
  offroadMul: 0.5,
  steerBase: 2.9,       // rad/s at speed 0 for handling 3
  steerFalloff: 60,     // rate = steerBase / (1 + |v| / steerFalloff)
  minSteerSpeed: 3,     // full steering authority reached at this speed (0 when stationary)
  airSteer: 0.4,
  hopDuration: 0.35,
  hopHeight: 0.55,
  driftMinSpeed: 8,
  driftGrace: 0.2,
  driftSlipBase: 0.30,  // rad (~17°)
  driftSlipSteer: 0.10, // ± with steer into/against drift (~11°–23°)
  driftYawMul: 1.15,
  driftSteerGain: 0.55,
  driftChargeBase: 0.5,
  driftChargeSteer: 0.35,
  driftThresholds: [0.35, 0.7, 1.0],
  driftBoost: [[0, 0], [6, 0.6], [9, 0.9], [13, 1.3]],
  realignTime: 0.35,
  boostPadStrength: 10,
  boostPadDuration: 1.0,
  boostPadMul: 1.35,
  starSpeedBonus: 6,
  shrinkScale: 0.6,
  shrinkSpeedMul: 0.6,
  spinDuration: 1.2,
  stunDuration: 0.9,
  wallSpeedMul: 0.7,
  wallBounce: 2.0,
  wallCooldown: 0.3,
  wrongWayDelay: 0.7,
  wrongWaySpeed: -3,
  impulseDecay: 4,
})

const TWO_PI = Math.PI * 2
const wrapAngle = (a) => (a > Math.PI || a < -Math.PI ? a - TWO_PI * Math.round(a / TWO_PI) : a)

export class Kart {
  /**
   * @param {{character: object, track: object|null, isPlayer?: boolean, index?: number, events?: object}} opts
   */
  constructor({ character, track = null, isPlayer = false, index = 0, events = null }) {
    this.character = character
    this.track = track
    this.isPlayer = isPlayer
    this.index = index
    this.events = events

    this.physics = derivePhysics(character.stats)
    this.baseMaxSpeed = this.physics.maxSpeed
    this.mass = this.physics.mass
    this.spinDuration = TUNE.spinDuration

    this.object = new THREE.Group()
    this.object.name = `kart-${character.id}`
    this.object.rotation.order = 'YXZ'
    this.position = this.object.position
    this.heading = 0
    this.velYaw = 0
    this.velocity = new THREE.Vector3()
    this.forward = new THREE.Vector3(0, 0, 1)
    this.right = new THREE.Vector3(1, 0, 0)
    this.speed = 0
    this.maxSpeed = this.baseMaxSpeed
    this.accel = 0        // smoothed longitudinal acceleration (m/s²), for visuals
    this.hopHeight = 0
    this.time = 0
    this.steerVisualTarget = 0

    this.controls = { throttle: 0, brake: 0, steer: 0, hop: false, useItem: false, lookBack: false }
    this._autoControls = { throttle: 0, brake: 0, steer: 0, hop: false, useItem: false, lookBack: false }
    this._zeroControls = { throttle: 0, brake: 0, steer: 0, hop: false, useItem: false, lookBack: false }

    this.surface = null
    this.progress = 0
    this.item = null
    this.itemRoulette = null

    this.state = {
      drifting: false, driftDir: 0, driftCharge: 0, driftLevel: 0,
      boostTimer: 0, boostStrength: 0,
      airborne: false, hopTimer: 0,
      spinTimer: 0, stunTimer: 0, starTimer: 0,
      shrunk: false, finished: false, wrongWay: false,
    }

    this._impulse = new THREE.Vector3()
    this._prevHop = false
    this._driftGrace = 0
    this._realign = 0
    this._slip = 0
    this._wallCooldown = 0
    this._wrongWayTimer = 0
    this._shrinkTimer = 0
    this._hasProgress = false
    this._onBoostPad = false
    this._offroad = false
    this._pitch = 0

    this.model = buildKartModel(character)
    this.object.add(this.model.group)
  }

  // ───────────────────────────── public API ─────────────────────────────

  /** Advance physics + visuals by dt seconds. */
  update(dt) {
    if (!(dt > 0)) return
    if (dt > 1 / 30) dt = 1 / 30
    this.time += dt
    const s = this.state

    this._tickTimers(dt)
    const c = this._resolveControls()
    const incapacitated = s.spinTimer > 0 || s.stunTimer > 0

    this._updateHop(dt, c, incapacitated)
    this._updateSteering(dt, c, incapacitated)
    this._updateMaxSpeed()
    this._updateLongitudinal(dt, c, incapacitated)

    // integrate
    const vx = Math.sin(this.velYaw) * this.speed + this._impulse.x
    const vz = Math.cos(this.velYaw) * this.speed + this._impulse.z
    this.velocity.set(vx, 0, vz)
    this.position.x += vx * dt
    this.position.z += vz * dt
    const decay = Math.exp(-TUNE.impulseDecay * dt)
    this._impulse.x *= decay
    this._impulse.z *= decay

    this.forward.set(Math.sin(this.heading), 0, Math.cos(this.heading))
    this.right.set(this.forward.z, 0, -this.forward.x)

    this._updateSurface(dt)

    this.object.rotation.y = this.heading
    this.object.rotation.x = this._pitch
    this.steerVisualTarget = c.steer
    this.model.update(dt, this)
  }

  /** Raise the speed cap by `strength` m/s for `duration` s and give an instant speed bump. */
  applyBoost(strength = 8, duration = 0.8) {
    const s = this.state
    s.boostStrength = Math.max(s.boostTimer > 0 ? s.boostStrength : 0, strength)
    s.boostTimer = Math.max(s.boostTimer, duration)
    const target = this._baseCap() + strength
    if (this.speed < target) this.speed = Math.min(target, Math.max(this.speed, 0) + strength * 0.75)
    this._emit(EVT.BOOST, { kart: this, strength, duration })
  }

  /**
   * Take a hit. Ignored while invincible. 'lightning' shrinks + stuns, anything else spins out.
   * @returns {boolean} true if the hit was applied
   */
  hit(kind = 'shell') {
    const s = this.state
    if (s.starTimer > 0) return false
    if (s.drifting) this._endDrift(false)
    if (s.airborne) {
      s.airborne = false
      s.hopTimer = 0
      this.hopHeight = 0
    }
    this._driftGrace = 0
    s.boostTimer = 0
    s.boostStrength = 0
    if (kind === 'lightning') {
      this.shrink(3)
      s.stunTimer = TUNE.stunDuration
      this.speed *= 0.5
    } else {
      s.spinTimer = TUNE.spinDuration
    }
    this._emit(EVT.HIT, { kart: this, kind })
    return true
  }

  /** Invincibility: no hits, +6 m/s cap, rainbow body tint (visual handled by the model). */
  setStar(duration = 10) {
    this.state.starTimer = Math.max(this.state.starTimer, duration)
  }

  /** Lightning effect: scale 0.6, top speed ×0.6 for `duration` s. */
  shrink(duration = 3) {
    this.state.shrunk = true
    this._shrinkTimer = Math.max(this._shrinkTimer, duration)
  }

  /** Teleport and zero all motion (used for grid placement and respawns). */
  reset(position, heading = 0) {
    const s = this.state
    if (position) this.position.copy(position)
    this.heading = this.velYaw = wrapAngle(heading)
    this.speed = 0
    this.accel = 0
    this.velocity.set(0, 0, 0)
    this._impulse.set(0, 0, 0)
    this.hopHeight = 0
    this._pitch = 0
    s.drifting = false
    s.driftDir = 0
    s.driftCharge = 0
    s.driftLevel = 0
    s.boostTimer = 0
    s.boostStrength = 0
    s.airborne = false
    s.hopTimer = 0
    s.spinTimer = 0
    s.stunTimer = 0
    s.wrongWay = false
    this._wrongWayTimer = 0
    this._realign = 0
    this._driftGrace = 0
    this._prevHop = true // require a fresh hop press after reset
    this._hasProgress = false
    this._onBoostPad = false
    this.forward.set(Math.sin(this.heading), 0, Math.cos(this.heading))
    this.right.set(this.forward.z, 0, -this.forward.x)
    this.object.rotation.set(0, this.heading, 0)
    if (this.track) {
      const surf = this.track.getSurfaceAt(this.position, undefined)
      if (surf) {
        this.surface = surf
        this.progress = surf.t
        this._hasProgress = true
        this._offroad = surf.type === SURFACE.OFFROAD
        this._onBoostPad = surf.type === SURFACE.BOOST
        if (position && typeof surf.height === 'number' && Math.abs(position.y - surf.height) < 3) this.position.y = surf.height
      }
    }
  }

  /** Apply an instantaneous velocity change (m/s) — forward part goes into speed, rest slides. */
  bump(impulse) {
    const f = impulse.x * this.forward.x + impulse.z * this.forward.z
    this.speed += f * 0.5
    this._impulse.x += impulse.x - this.forward.x * f * 0.5
    this._impulse.z += impulse.z - this.forward.z * f * 0.5
  }

  getSpeedKmh() {
    return Math.abs(this.speed) * KMH_FACTOR
  }

  /** Engine RPM 0..1 for audio. */
  getRpm() {
    const s = this.state
    const ratio = clamp(Math.abs(this.speed) / this.baseMaxSpeed, 0, 1.3)
    const thr = s.finished ? 0.4 : (s.spinTimer > 0 || s.stunTimer > 0 ? 0 : this.controls.throttle)
    let rpm = 0.12 + 0.72 * ratio + 0.16 * thr * (1 - ratio * 0.6)
    if (s.boostTimer > 0) rpm += 0.04 * Math.sin(this.time * 40) + 0.03
    if (s.drifting) rpm += 0.05
    return clamp(rpm, 0, 1)
  }

  dispose() {
    this.model.dispose()
    this.object.parent?.remove(this.object)
  }

  // ───────────────────────────── internals ─────────────────────────────

  _emit(type, payload) {
    if (this.events) this.events.emit(type, payload)
  }

  _tickTimers(dt) {
    const s = this.state
    if (s.boostTimer > 0) {
      s.boostTimer -= dt
      if (s.boostTimer <= 0) {
        s.boostTimer = 0
        s.boostStrength = 0
      }
    }
    if (s.spinTimer > 0) s.spinTimer = Math.max(0, s.spinTimer - dt)
    if (s.stunTimer > 0) s.stunTimer = Math.max(0, s.stunTimer - dt)
    if (s.starTimer > 0) s.starTimer = Math.max(0, s.starTimer - dt)
    if (this._shrinkTimer > 0) {
      this._shrinkTimer -= dt
      if (this._shrinkTimer <= 0) {
        this._shrinkTimer = 0
        s.shrunk = false
      }
    }
    if (this._wallCooldown > 0) this._wallCooldown -= dt
    if (this._realign > 0) this._realign -= dt
    if (this._driftGrace > 0) this._driftGrace -= dt
  }

  /** Pick the control set for this frame: player/AI controls, auto-drive when finished, none when hit. */
  _resolveControls() {
    const s = this.state
    if (s.spinTimer > 0 || s.stunTimer > 0) return this._zeroControls
    if (!s.finished) return this.controls
    const ac = this._autoControls
    ac.throttle = 0.4
    ac.brake = 0
    ac.hop = false
    ac.useItem = false
    ac.lookBack = false
    const surf = this.surface
    if (surf && surf.tangent) {
      const ty = Math.atan2(surf.tangent.x, surf.tangent.z)
      const desired = ty - Math.atan2(surf.lateral || 0, 10)
      ac.steer = clamp(angleDelta(this.heading, desired) * 1.5, -1, 1)
    } else {
      ac.steer = 0
    }
    return ac
  }

  _updateHop(dt, c, incapacitated) {
    const s = this.state
    const pressed = c.hop && !this._prevHop
    this._prevHop = c.hop
    if (s.airborne) {
      s.hopTimer -= dt
      const k = 1 - clamp(s.hopTimer / TUNE.hopDuration, 0, 1)
      this.hopHeight = Math.sin(k * Math.PI) * TUNE.hopHeight
      if (s.hopTimer <= 0) {
        s.airborne = false
        s.hopTimer = 0
        this.hopHeight = 0
        this.model.onLand()
        this._emit(EVT.LAND, { kart: this })
        if (c.hop) {
          if (Math.abs(c.steer || 0) > 0.25 && this.speed > TUNE.driftMinSpeed) this._startDrift(c.steer > 0 ? 1 : -1)
          else this._driftGrace = TUNE.driftGrace
        }
      }
    } else if (pressed && !s.drifting && !incapacitated && this.speed > 1) {
      s.airborne = true
      s.hopTimer = TUNE.hopDuration
      this.model.onHop()
      this._emit(EVT.HOP, { kart: this })
    } else if (this._driftGrace > 0 && !s.drifting) {
      // landed while holding hop; steering shortly after still starts the drift
      if (!c.hop) this._driftGrace = 0
      else if (Math.abs(c.steer) > 0.25 && this.speed > TUNE.driftMinSpeed) {
        this._driftGrace = 0
        this._startDrift(c.steer > 0 ? 1 : -1)
      }
    }
  }

  _updateSteering(dt, c, incapacitated) {
    const s = this.state
    const absV = Math.abs(this.speed)
    const baseRate = (TUNE.steerBase * this.physics.steerMul) / (1 + absV / TUNE.steerFalloff)
    const steer = clamp(c.steer || 0, -1, 1)

    if (incapacitated) {
      // momentum only: keep travelling along velYaw, no steering
    } else if (s.drifting) {
      const into = steer * s.driftDir
      const yawRate = s.driftDir * baseRate * TUNE.driftYawMul * (1 + TUNE.driftSteerGain * into)
      this.velYaw += yawRate * dt
      // heading sits at a visible slip angle inside the travel direction (ramps in over ~0.2 s)
      const slipTarget = TUNE.driftSlipBase + TUNE.driftSlipSteer * into
      this._slip = damp(this._slip, slipTarget, 10, dt)
      this.heading = this.velYaw + s.driftDir * this._slip

      const rate = (TUNE.driftChargeBase + TUNE.driftChargeSteer * into) * this.physics.driftChargeMul
      s.driftCharge = Math.min(1, s.driftCharge + rate * dt)
      let level = 0
      const th = TUNE.driftThresholds
      if (s.driftCharge >= th[2]) level = 3
      else if (s.driftCharge >= th[1]) level = 2
      else if (s.driftCharge >= th[0]) level = 1
      if (level !== s.driftLevel) {
        s.driftLevel = level
        this._emit(EVT.DRIFT_LEVEL, { kart: this, level })
      }

      if (!c.hop) this._endDrift(true)
      else if (this.speed < TUNE.driftMinSpeed) this._endDrift(false)
    } else {
      const authority = clamp(absV / TUNE.minSteerSpeed, 0, 1) * (s.airborne ? TUNE.airSteer : 1)
      const dir = this.speed < 0 ? -1 : 1
      this.heading += steer * baseRate * authority * dir * dt
      if (!s.airborne) {
        if (this._realign > 0) this.heading += angleDelta(this.heading, this.velYaw) * (1 - Math.exp(-12 * dt))
        this.velYaw += angleDelta(this.velYaw, this.heading) * (1 - Math.exp(-this.physics.grip * dt))
      }
    }
    this.heading = wrapAngle(this.heading)
    this.velYaw = wrapAngle(this.velYaw)
  }

  /** Speed cap before surface effects (character, shrink, star). */
  _baseCap() {
    const s = this.state
    return this.baseMaxSpeed * (s.shrunk ? TUNE.shrinkSpeedMul : 1) + (s.starTimer > 0 ? TUNE.starSpeedBonus : 0)
  }

  _updateMaxSpeed() {
    const s = this.state
    const base = this._baseCap()
    let cap = base
    const type = this.surface ? this.surface.type : SURFACE.ROAD
    const boosting = s.boostTimer > 0 || s.starTimer > 0
    if (s.boostTimer > 0) cap = base + s.boostStrength
    if (type === SURFACE.BOOST) cap = Math.max(cap, base * TUNE.boostPadMul)
    if (type === SURFACE.OFFROAD && !boosting) cap = base * TUNE.offroadMul
    this.maxSpeed = cap
  }

  _updateLongitudinal(dt, c, incapacitated) {
    const s = this.state
    const sp = this.speed
    const cap = this.maxSpeed
    let a = 0
    if (incapacitated) {
      // decay to ~30 % over the spin (λ≈1), harder while stunned
      a = -sp * (s.stunTimer > 0 ? 3 : 1)
    } else {
      const thr = clamp(c.throttle || 0, 0, 1)
      const br = clamp(c.brake || 0, 0, 1)
      if (thr > 0 && sp >= -0.05) {
        if (sp < cap) {
          const a0 = this.baseMaxSpeed / this.physics.accelTime
          const x = sp / cap
          a = a0 * 1.25 * (1 - 0.5 * x * x) * thr
        } else {
          a = -(sp - cap) * 2.5 - 1.5
        }
        if (br > 0) a -= TUNE.brakeDecel * br
      } else if (thr > 0) {
        // reversing with throttle → brake back toward zero
        a = TUNE.brakeDecel * thr
        if (sp + a * dt > 0) a = -sp / dt
      } else if (br > 0) {
        if (sp > 0.3) {
          a = -TUNE.brakeDecel * br
        } else if (sp > -TUNE.reverseMax) {
          a = -TUNE.reverseAccel * br
        } else {
          a = -(sp + TUNE.reverseMax) * 3
        }
      } else if (sp !== 0) {
        const sign = sp > 0 ? 1 : -1
        const excess = sp > cap ? (sp - cap) * 2.5 : 0
        a = -sign * (TUNE.coastFriction + TUNE.coastDrag * Math.abs(sp) + excess)
        if (Math.abs(a * dt) > Math.abs(sp)) a = -sp / dt
      }
      if (this.surface && this.surface.type === SURFACE.OFFROAD && s.boostTimer <= 0 && s.starTimer <= 0 && Math.abs(sp) > 0.5) {
        a -= (sp > 0 ? 1 : -1) * TUNE.offroadDrag
      }
    }
    this.speed = sp + a * dt
    if (a > 0 && sp <= cap && this.speed > cap) this.speed = cap
    if (this.speed < -TUNE.reverseMax - 0.01 && a < 0) this.speed = -TUNE.reverseMax
    this.accel = damp(this.accel, a, 6, dt)
  }

  _updateSurface(dt) {
    const s = this.state
    if (!this.track) {
      this.position.y = this.hopHeight
      return
    }
    const surf = this.track.getSurfaceAt(this.position, this._hasProgress ? this.progress : undefined)
    if (!surf) return
    this.surface = surf
    this.progress = surf.t
    this._hasProgress = true
    if (typeof surf.height === 'number') this.position.y = surf.height + this.hopHeight

    // off-road enter / exit
    const off = surf.type === SURFACE.OFFROAD
    if (off !== this._offroad) {
      this._offroad = off
      this._emit(off ? EVT.OFFROAD_ENTER : EVT.OFFROAD_EXIT, { kart: this })
    }

    // boost pads (edge-triggered)
    const onPad = surf.type === SURFACE.BOOST
    if (onPad && !this._onBoostPad) this.applyBoost(TUNE.boostPadStrength, TUNE.boostPadDuration)
    this._onBoostPad = onPad

    const tan = surf.tangent
    const r = surf.right
    if (tan && r) {
      // walls
      const lat = surf.lateral
      const whw = surf.wallHalfWidth
      if (whw > 0 && Math.abs(lat) + KART_RADIUS > whw) {
        const side = lat > 0 ? 1 : -1
        const pen = Math.abs(lat) + KART_RADIUS - whw
        this.position.x -= r.x * side * pen
        this.position.z -= r.z * side * pen
        const intoWall = (this.velocity.x * r.x + this.velocity.z * r.z) * side
        const ty = Math.atan2(tan.x, tan.z)
        const along = Math.cos(this.velYaw - ty) >= 0 ? ty : ty + Math.PI
        this.velYaw = wrapAngle(along)
        this.heading = wrapAngle(this.heading + angleDelta(this.heading, along) * 0.6)
        const impInto = (this._impulse.x * r.x + this._impulse.z * r.z) * side
        if (impInto > 0) {
          this._impulse.x -= r.x * side * impInto
          this._impulse.z -= r.z * side * impInto
        }
        if (intoWall > 1.5 && this._wallCooldown <= 0) {
          this._wallCooldown = TUNE.wallCooldown
          this.speed *= TUNE.wallSpeedMul
          this._impulse.x -= r.x * side * TUNE.wallBounce
          this._impulse.z -= r.z * side * TUNE.wallBounce
          if (s.drifting) this._endDrift(false)
          this._emit(EVT.WALL_HIT, { kart: this, force: intoWall })
        }
      }

      // wrong way (flag only; race module emits the event)
      const vt = this.velocity.x * tan.x + this.velocity.z * tan.z
      if (vt < TUNE.wrongWaySpeed) {
        this._wrongWayTimer += dt
        if (this._wrongWayTimer > TUNE.wrongWayDelay) s.wrongWay = true
      } else {
        this._wrongWayTimer = 0
        s.wrongWay = false
      }

      // pitch with road slope along our heading
      const tl = Math.hypot(tan.x, tan.z) || 1
      const along = (this.forward.x * tan.x + this.forward.z * tan.z) / tl
      const slope = ((tan.y || 0) / tl) * along
      this._pitch = damp(this._pitch, -Math.atan(slope), 10, dt)
    }
  }

  _startDrift(dir) {
    const s = this.state
    s.drifting = true
    s.driftDir = dir
    s.driftCharge = 0
    s.driftLevel = 0
    this._realign = 0
    this._slip = Math.max(0, angleDelta(this.velYaw, this.heading) * dir)
    this._emit(EVT.DRIFT_START, { kart: this, dir })
  }

  _endDrift(withBoost) {
    const s = this.state
    const reached = s.driftLevel
    const level = withBoost ? reached : 0
    s.drifting = false
    s.driftDir = 0
    s.driftCharge = 0
    s.driftLevel = 0
    this._realign = TUNE.realignTime
    if (level > 0) {
      const [strength, duration] = TUNE.driftBoost[level]
      this.applyBoost(strength, duration)
    }
    this._emit(EVT.DRIFT_END, { kart: this, level, reached })
  }
}
