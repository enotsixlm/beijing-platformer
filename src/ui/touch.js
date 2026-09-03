// On-screen touch controls: steer pad (drag → -1..1) + GAS / BRAKE / HOP / ITEM / LOOK buttons.
import { h, clamp, svg } from './util.js'

export function isTouchDevice() {
  const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints || 0) > 0
  const coarse = typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches
  return hasTouch && coarse
}

export class TouchControls {
  constructor() {
    this.controls = { steer: 0, throttle: 0, brake: 0, hop: false, useItem: false, lookBack: false }
    this._pointers = new Map() // pointerId → role
    this._steerPointer = null
    this._buttons = []

    this.el = h('div', { class: 'tkl-touch', attrs: { 'aria-hidden': 'true' } })

    // Steer pad
    this.pad = h('div', { class: 'touch-pad' },
      h('span', { class: 'touch-pad-arrow is-left', html: svg('arrowL') }),
      h('span', { class: 'touch-pad-arrow is-right', html: svg('arrowR') }),
      (this.knob = h('span', { class: 'touch-knob' })),
    )
    this.el.append(h('div', { class: 'touch-left' }, this.pad))

    const mk = (role, label, cls) => {
      const b = h('div', { class: `touch-btn ${cls}`, dataset: { role } }, h('span', { class: 'touch-btn-label', text: label }))
      this._buttons.push(b)
      return b
    }
    this.el.append(
      h('div', { class: 'touch-right' },
        h('div', { class: 'touch-col is-secondary' },
          mk('lookBack', 'LOOK', 'is-look'),
          mk('useItem', 'ITEM', 'is-item'),
          mk('hop', 'HOP', 'is-hop'),
        ),
        h('div', { class: 'touch-col is-primary' },
          mk('brake', 'BRAKE', 'is-brake'),
          mk('throttle', 'GAS', 'is-gas'),
        ),
      ),
    )

    this._onDown = (e) => this._down(e)
    this._onMove = (e) => this._move(e)
    this._onUp = (e) => this._up(e)
    this.el.addEventListener('pointerdown', this._onDown)
    this.el.addEventListener('pointermove', this._onMove)
    this.el.addEventListener('pointerup', this._onUp)
    this.el.addEventListener('pointercancel', this._onUp)
    this.el.addEventListener('lostpointercapture', this._onUp)
    this.el.addEventListener('contextmenu', (e) => e.preventDefault())
  }

  _down(e) {
    const btn = e.target.closest('.touch-btn')
    if (btn) {
      const role = btn.dataset.role
      this._pointers.set(e.pointerId, role)
      btn.setPointerCapture?.(e.pointerId)
      btn.classList.add('is-down')
      this._setRole(role, true)
      e.preventDefault()
      return
    }
    if (e.target.closest('.touch-pad') && this._steerPointer == null) {
      this._steerPointer = e.pointerId
      this._pointers.set(e.pointerId, 'steer')
      this.pad.setPointerCapture?.(e.pointerId)
      this.pad.classList.add('is-down')
      this._steerFrom(e)
      e.preventDefault()
    }
  }

  _move(e) {
    if (this._pointers.get(e.pointerId) === 'steer') this._steerFrom(e)
  }

  _up(e) {
    const role = this._pointers.get(e.pointerId)
    if (!role) return
    this._pointers.delete(e.pointerId)
    if (role === 'steer') {
      this._steerPointer = null
      this.controls.steer = 0
      this.knob.style.transform = 'translate(-50%, -50%)'
      this.pad.classList.remove('is-down')
      return
    }
    // Only release if no other pointer still holds this role.
    let stillHeld = false
    for (const r of this._pointers.values()) if (r === role) stillHeld = true
    if (!stillHeld) {
      this._setRole(role, false)
      for (const b of this._buttons) if (b.dataset.role === role) b.classList.remove('is-down')
    }
  }

  _steerFrom(e) {
    const r = this.pad.getBoundingClientRect()
    const half = r.width / 2
    const dx = e.clientX - (r.left + half)
    const visual = clamp(dx / (half * 0.75), -1, 1)
    this.controls.steer = -visual
    this.knob.style.transform = `translate(calc(-50% + ${(visual * half * 0.6).toFixed(1)}px), -50%)`
    this.pad.classList.toggle('is-left', visual < -0.15)
    this.pad.classList.toggle('is-right', visual > 0.15)
    this.pad.classList.toggle('is-left', steer < -0.15)
    this.pad.classList.toggle('is-right', steer > 0.15)
  }

  _setRole(role, on) {
    const c = this.controls
    if (role === 'throttle' || role === 'brake') c[role] = on ? 1 : 0
    else c[role] = on
  }

  show() { this.el.classList.add('is-visible') }
  hide() {
    this.el.classList.remove('is-visible')
    this._pointers.clear()
    this._steerPointer = null
    Object.assign(this.controls, { steer: 0, throttle: 0, brake: 0, hop: false, useItem: false, lookBack: false })
    for (const b of this._buttons) b.classList.remove('is-down')
  }

  dispose() {
    this.el.remove()
    this._pointers.clear()
  }
}
