/**
 * Module 2 — player input (keyboard + gamepad) → `controls`.
 *
 * Keyboard: W/↑ throttle, S/↓ brake, A/D/←/→ steer (ramped so it's not binary),
 * Space / Right-Shift hop+drift, E / Ctrl / Left-Shift use item, Q look back.
 * Gamepad (standard mapping): left stick X steer, RT throttle, LT brake, A/Cross hop,
 * X/Square or LB item, RB look back, D-pad as digital fallback.
 * Esc / P (pause) and M (mute) are handled by the orchestrator.
 */
import { clamp } from '../core/rng.js'

const STEER_RAMP_UP = 0.15   // seconds to reach full keyboard steer
const STEER_RAMP_DOWN = 0.1  // seconds to return to centre
const STICK_DEADZONE = 0.15

const KEYS = {
  throttle: ['KeyW', 'ArrowUp'],
  brake: ['KeyS', 'ArrowDown'],
  left: ['KeyA', 'ArrowLeft'],
  right: ['KeyD', 'ArrowRight'],
  hop: ['Space', 'ShiftRight'],
  useItem: ['KeyE', 'ControlLeft', 'ControlRight', 'ShiftLeft'],
  lookBack: ['KeyQ'],
}
const CAPTURED = new Set(Object.values(KEYS).flat())

function isEditable(el) {
  if (!el || !el.tagName) return false
  const tag = el.tagName.toLowerCase()
  return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable === true
}

export class PlayerInput {
  constructor() {
    /** Same shape as kart.controls; the object is reused every frame. */
    this.controls = { throttle: 0, brake: 0, steer: 0, hop: false, useItem: false, lookBack: false }
    this.gamepadIndex = null
    this._down = new Set()
    this._kbSteer = 0
    this._hasWindow = typeof window !== 'undefined'
    this._onKeyDown = (e) => this._keyDown(e)
    this._onKeyUp = (e) => this._keyUp(e)
    this._onBlur = () => this._down.clear()
    if (this._hasWindow) {
      window.addEventListener('keydown', this._onKeyDown)
      window.addEventListener('keyup', this._onKeyUp)
      window.addEventListener('blur', this._onBlur)
    }
  }

  /** Poll gamepad and integrate keyboard steering ramp. */
  update(dt) {
    if (!(dt > 0)) dt = 1 / 60
    const c = this.controls
    const d = this._down
    const any = (list) => { for (const k of list) if (d.has(k)) return true; return false }

    // keyboard
    let target = 0
    if (any(KEYS.right)) target += 1
    if (any(KEYS.left)) target -= 1
    if (target !== 0) {
      const step = dt / STEER_RAMP_UP
      // reverse direction quickly: pass through zero at ramp-down speed first
      if (Math.sign(this._kbSteer) === -Math.sign(target) && this._kbSteer !== 0) {
        this._kbSteer += target * (dt / STEER_RAMP_DOWN)
        if (Math.sign(this._kbSteer) === Math.sign(target)) this._kbSteer = 0
      } else {
        this._kbSteer = clamp(this._kbSteer + target * step, -1, 1)
      }
    } else if (this._kbSteer !== 0) {
      const step = dt / STEER_RAMP_DOWN
      if (Math.abs(this._kbSteer) <= step) this._kbSteer = 0
      else this._kbSteer -= Math.sign(this._kbSteer) * step
    }
    let throttle = any(KEYS.throttle) ? 1 : 0
    let brake = any(KEYS.brake) ? 1 : 0
    let steer = this._kbSteer
    let hop = any(KEYS.hop)
    let useItem = any(KEYS.useItem)
    let lookBack = any(KEYS.lookBack)

    // gamepad
    const gp = this._gamepad()
    if (gp) {
      const ax = gp.axes[0] || 0
      let gs = 0
      if (Math.abs(ax) > STICK_DEADZONE) gs = Math.sign(ax) * ((Math.abs(ax) - STICK_DEADZONE) / (1 - STICK_DEADZONE))
      const btn = (i) => gp.buttons[i]
      const val = (i) => { const b = btn(i); return b ? (typeof b.value === 'number' ? b.value : (b.pressed ? 1 : 0)) : 0 }
      const pressed = (i) => { const b = btn(i); return !!(b && b.pressed) }
      if (pressed(14)) gs = -1
      if (pressed(15)) gs = 1
      if (Math.abs(gs) > Math.abs(steer)) steer = gs
      throttle = Math.max(throttle, val(7), pressed(12) ? 1 : 0)
      brake = Math.max(brake, val(6), pressed(13) ? 1 : 0)
      hop = hop || pressed(0)
      useItem = useItem || pressed(2) || pressed(4)
      lookBack = lookBack || pressed(5)
    }

    c.throttle = clamp(throttle, 0, 1)
    c.brake = clamp(brake, 0, 1)
    c.steer = clamp(steer, -1, 1)
    c.hop = hop
    c.useItem = useItem
    c.lookBack = lookBack
    return c
  }

  dispose() {
    if (this._hasWindow) {
      window.removeEventListener('keydown', this._onKeyDown)
      window.removeEventListener('keyup', this._onKeyUp)
      window.removeEventListener('blur', this._onBlur)
    }
    this._down.clear()
  }

  _gamepad() {
    if (typeof navigator === 'undefined' || typeof navigator.getGamepads !== 'function') return null
    let pads
    try { pads = navigator.getGamepads() } catch { return null }
    if (!pads) return null
    if (this.gamepadIndex != null) {
      const p = pads[this.gamepadIndex]
      if (p && p.connected) return p
      this.gamepadIndex = null
    }
    for (let i = 0; i < pads.length; i++) {
      const p = pads[i]
      if (p && p.connected && p.mapping === 'standard') { this.gamepadIndex = i; return p }
    }
    for (let i = 0; i < pads.length; i++) {
      const p = pads[i]
      if (p && p.connected) { this.gamepadIndex = i; return p }
    }
    return null
  }

  _keyDown(e) {
    if (isEditable(e.target)) return
    if (!CAPTURED.has(e.code)) return
    if (!e.repeat) this._down.add(e.code)
    // stop page scrolling on arrows/space, but let focused buttons/links keep their key activation
    const tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : ''
    if (tag !== 'button' && tag !== 'a') e.preventDefault()
  }

  _keyUp(e) {
    this._down.delete(e.code)
  }
}
