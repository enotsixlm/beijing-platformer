/**
 * Module 2 — chase camera and title-screen cinematic camera.
 */
import * as THREE from 'three'
import { clamp, damp, angleDelta } from '../core/rng.js'

const _desired = new THREE.Vector3()
const _lookDesired = new THREE.Vector3()
const _a = new THREE.Vector3()
const _b = new THREE.Vector3()

export class ChaseCamera {
  /** @param {THREE.PerspectiveCamera} camera */
  constructor(camera) {
    this.camera = camera
    this.distance = 7.5
    this.height = 3.2
    this.lookHeight = 1.5
    this.lookAhead = 2.0
    this.baseFov = 60
    this.maxFov = 75
    this.positionLambda = 10
    this.yawLambda = 6

    this._yaw = 0
    this._pos = new THREE.Vector3(0, 5, -10)
    this._look = new THREE.Vector3()
    this._fov = this.baseFov
    this._shake = 0
    this._shakeSeed = 0
    this._prevSpin = 0
    this._prevStun = 0
    this._driftOffset = 0
    this._lookBack = 0
    this._speedRatio = 0
    this._cineTime = null
  }

  /** Smooth follow. Call once per frame after the kart has been updated. */
  update(kart, dt) {
    if (!(dt > 0)) dt = 1 / 60
    const s = kart.state
    const cam = this.camera

    // shake on the frame a spin / stun begins
    if ((s.spinTimer > 0 && this._prevSpin <= 0) || (s.stunTimer > 0 && this._prevStun <= 0)) this._shake = 1
    this._prevSpin = s.spinTimer
    this._prevStun = s.stunTimer
    this._shake = damp(this._shake, 0, 4, dt)
    this._shakeSeed += dt * 37

    // yaw follows the heading, offset slightly into a drift; look-back flips to the front
    this._lookBack = damp(this._lookBack, kart.controls.lookBack ? 1 : 0, 12, dt)
    this._driftOffset = damp(this._driftOffset, s.drifting ? s.driftDir * 0.28 : 0, 4, dt)
    this._yaw += angleDelta(this._yaw, kart.heading + this._driftOffset) * (1 - Math.exp(-this.yawLambda * dt))
    const yaw = this._yaw + Math.PI * this._lookBack

    const speedRatio = clamp(Math.abs(kart.speed) / 36, 0, 1)
    this._speedRatio = damp(this._speedRatio, speedRatio, 4, dt)
    const boost = s.boostTimer > 0 ? 1 : 0
    const dist = this.distance + this._speedRatio * 1.0 + boost * 0.5
    const sinY = Math.sin(yaw)
    const cosY = Math.cos(yaw)
    const groundY = kart.position.y - (kart.hopHeight || 0)

    // follow a slightly predicted kart position so the camera doesn't lag at speed
    const px = kart.position.x + kart.velocity.x * 0.05
    const pz = kart.position.z + kart.velocity.z * 0.05
    _desired.set(px - sinY * dist, groundY + this.height, pz - cosY * dist)
    this._pos.lerp(_desired, 1 - Math.exp(-this.positionLambda * dt))

    _lookDesired.set(
      kart.position.x + sinY * this.lookAhead,
      groundY + this.lookHeight,
      kart.position.z + cosY * this.lookAhead,
    )
    this._look.lerp(_lookDesired, 1 - Math.exp(-14 * dt))

    cam.position.copy(this._pos)
    if (this._shake > 0.002) {
      const k = this._shake * 0.35
      cam.position.x += Math.sin(this._shakeSeed * 1.3) * k
      cam.position.y += Math.sin(this._shakeSeed * 1.7 + 1) * k * 0.6
      cam.position.z += Math.cos(this._shakeSeed * 1.1 + 2) * k
    }
    cam.lookAt(this._look)

    const fovTarget = this.baseFov + (this.maxFov - this.baseFov) * clamp(this._speedRatio * 0.7 + boost * 0.6, 0, 1)
    this._fov = damp(this._fov, fovTarget, 5, dt)
    if (Math.abs(cam.fov - this._fov) > 0.01) {
      cam.fov = this._fov
      cam.updateProjectionMatrix()
    }
  }

  /** Immediate placement behind the kart (race start / respawn). */
  snap(kart) {
    this._yaw = kart.heading
    this._driftOffset = 0
    this._lookBack = 0
    this._shake = 0
    this._speedRatio = 0
    this._cineTime = null
    this._prevSpin = kart.state.spinTimer
    this._prevStun = kart.state.stunTimer
    const sinY = Math.sin(this._yaw)
    const cosY = Math.cos(this._yaw)
    const groundY = kart.position.y - (kart.hopHeight || 0)
    this._pos.set(kart.position.x - sinY * this.distance, groundY + this.height, kart.position.z - cosY * this.distance)
    this._look.set(kart.position.x + sinY * this.lookAhead, groundY + this.lookHeight, kart.position.z + cosY * this.lookAhead)
    this.camera.position.copy(this._pos)
    this.camera.lookAt(this._look)
    this._fov = this.baseFov
    if (Math.abs(this.camera.fov - this._fov) > 0.01) {
      this.camera.fov = this._fov
      this.camera.updateProjectionMatrix()
    }
  }

  /** Slow fly-over along the track for the title/menu screens. */
  cinematic(track, time) {
    if (!track || typeof track.sample !== 'function') return
    const t = ((time * 0.01) % 1 + 1) % 1
    const here = track.sample(t)
    const ahead = track.sample((t + 0.035) % 1)
    if (!here || !ahead) return
    const side = 13 + 4 * Math.sin(time * 0.23)
    const up = 8.5 + 2 * Math.sin(time * 0.17 + 1)
    _a.copy(here.position).addScaledVector(here.right, side)
    _a.y += up
    _b.copy(ahead.position)
    _b.y += 2.5
    // ease the camera (dt derived from `time`) so spline sampling jitter never shows
    const dt = this._cineTime == null ? 1 : clamp(time - this._cineTime, 0, 0.1)
    this._cineTime = time
    if (dt >= 1) {
      this._pos.copy(_a)
      this._look.copy(_b)
    } else {
      this._pos.lerp(_a, 1 - Math.exp(-5 * dt))
      this._look.lerp(_b, 1 - Math.exp(-6 * dt))
    }
    this.camera.position.copy(this._pos)
    this.camera.lookAt(this._look)
    const fov = 56
    if (Math.abs(this.camera.fov - fov) > 0.01) {
      this.camera.fov = fov
      this.camera.updateProjectionMatrix()
    }
  }
}
