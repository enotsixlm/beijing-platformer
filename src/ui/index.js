// Module 4 — UI. See ARCHITECTURE.md for the contract.
// Exports: `UI` (screen manager + HUD + overlays) and `formatTime`.
import './ui.css'
import { EVT } from '../core/constants.js'
import { h, svg } from './util.js'
import { formatTime } from './format.js'
import { HUD } from './hud.js'
import { TouchControls, isTouchDevice } from './touch.js'
import { TitleScreen } from './screens/title.js'
import { SelectScreen } from './screens/select.js'
import { ResultsScreen } from './screens/results.js'
import { PauseScreen } from './screens/pause.js'

export { formatTime }

const OUT_MS = 380
const COUNTDOWN_MS = 800
const FLASH_MS = 1600

/**
 * @typedef {Object} HudState
 * @property {number} rank
 * @property {number} total
 * @property {number} lap
 * @property {number} totalLaps
 * @property {number} speedKmh
 * @property {null|{id:string,count:number}} item
 * @property {null|number} itemRoulette 0..1 while the roulette spins
 * @property {number} time race clock in seconds
 * @property {number} driftLevel 0..3
 * @property {number} boost 0..1
 * @property {boolean} star
 * @property {boolean} wrongWay
 * @property {{points:{x:number,z:number}[],bounds:{minX:number,maxX:number,minZ:number,maxZ:number},karts:{x:number,z:number,color:string,isPlayer:boolean,rank:number}[]}} minimap
 * @property {number[]} lapTimes
 * @property {number|null} bestLap
 * @property {number} fps
 * @property {string} [phase]
 */

export class UI {
  /**
   * @param {{root: HTMLElement, characters: Array, tracks: Array, events: import('../core/events.js').EventBus}} opts
   */
  constructor({ root, characters = [], tracks = [], events } = {}) {
    this.root = root || document.getElementById('ui') || document.body
    this.events = events
    this.characters = Array.isArray(characters) ? characters : []
    this.tracks = Array.isArray(tracks) ? tracks : []
    this.muted = false
    this._timers = new Set()
    this._current = null // name of the visible main screen
    this._disposed = false

    this.isTouch = isTouchDevice()
    this.el = h('div', { class: 'tkl' + (this.isTouch ? ' is-touch' : '') })
    this.root.appendChild(this.el)

    // main screens
    this.title = new TitleScreen({ events })
    this.select = new SelectScreen({ characters: this.characters, tracks: this.tracks, events })
    this.results = new ResultsScreen({ events })
    this._screens = { title: this.title, select: this.select, results: this.results }

    // HUD
    this.hud = new HUD({
      onPause: () => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape', key: 'Escape', bubbles: true })),
    })

    // overlays
    this.pause = new PauseScreen({ events })
    this.loading = h('div', { class: 'tkl-overlay tkl-loading' },
      h('div', { class: 'loading-tyre' }, h('i'), h('i'), h('i'), h('i')),
      (this.loadingText = h('div', { class: 'loading-text tkl-display', text: 'Loading…' })),
    )
    this.countdown = h('div', { class: 'tkl-countdown tkl-display', attrs: { 'aria-live': 'assertive' } }, (this.countdownText = h('span', { class: 'countdown-text' })), h('span', { class: 'countdown-ring' }))
    this.flashEl = h('div', { class: 'tkl-flash tkl-display', attrs: { 'aria-live': 'polite' } }, (this.flashText = h('span')))

    // persistent mute button
    this.muteBtn = h('button', { class: 'tkl-iconbtn tkl-mute', attrs: { type: 'button', 'aria-label': 'Toggle sound', title: 'Sound (M)' }, html: svg('speaker'), onClick: (e) => { e.stopPropagation(); this.events?.emit(EVT.UI_MUTE_TOGGLE, {}) } })
    this.muteBtn.addEventListener('pointerdown', (e) => e.stopPropagation())

    // touch controls
    this.touch = this.isTouch ? new TouchControls() : null

    this.el.append(this.title.el, this.select.el, this.results.el, this.hud.el)
    if (this.touch) this.el.append(this.touch.el)
    this.el.append(this.countdown, this.flashEl, this.pause.el, this.loading, this.muteBtn)

    this._onKey = (e) => {
      if (e.code === 'F3') {
        e.preventDefault()
        this.hud.toggleFps()
      }
    }
    window.addEventListener('keydown', this._onKey)
  }

  // ───────────────────────────── screen manager ─────────────────────────────

  _present(name, args) {
    const prev = this._current
    if (prev && prev !== name) this._dismiss(prev)
    this._current = name
    const scr = this._screens[name]
    const el = scr.el
    this._clearTimer(el)
    el.classList.remove('is-out')
    el.classList.add('is-in')
    scr.show(args)
  }

  _dismiss(name) {
    const scr = this._screens[name]
    if (!scr) return
    scr.hide()
    const el = scr.el
    if (el.classList.contains('is-in')) {
      el.classList.remove('is-in')
      el.classList.add('is-out')
      this._after(OUT_MS, () => el.classList.remove('is-out'), el)
    }
    if (this._current === name) this._current = null
  }

  _after(ms, fn, key) {
    if (key) this._clearTimer(key)
    const t = setTimeout(() => {
      this._timers.delete(t)
      if (key) this._keyed?.delete(key)
      if (!this._disposed) fn()
    }, ms)
    this._timers.add(t)
    if (key) {
      this._keyed = this._keyed || new Map()
      this._keyed.set(key, t)
    }
    return t
  }

  _clearTimer(key) {
    const t = this._keyed?.get(key)
    if (t != null) {
      clearTimeout(t)
      this._timers.delete(t)
      this._keyed.delete(key)
    }
  }

  // ───────────────────────────── screens ─────────────────────────────

  /** Title screen. `onStart` fires on any key / tap (debounced 300 ms after show). */
  showTitle({ onStart } = {}) {
    this.hideHUD()
    this.hidePause()
    this._present('title', { onStart: () => onStart?.() })
  }

  /** Character / track / difficulty selection. */
  showSelect({ onConfirm, onBack } = {}) {
    this.hideHUD()
    this.hidePause()
    this._present('select', {
      onConfirm: (choice) => onConfirm?.(choice),
      onBack: () => onBack?.(),
    })
  }

  showLoading(text = 'Loading…') {
    this.loadingText.textContent = text
    this.loading.classList.add('is-visible')
  }

  hideLoading() {
    this.loading.classList.remove('is-visible')
  }

  showHUD() {
    if (this._current) this._dismiss(this._current)
    this.hud.show()
    this.touch?.show()
    this.el.classList.add('is-racing')
  }

  hideHUD() {
    this.hud.hide()
    this.touch?.hide()
    this.el.classList.remove('is-racing')
  }

  /** @param {HudState} state */
  updateHUD(state) {
    this.hud.update(state)
  }

  /** @param {number|'GO!'} n */
  showCountdown(n) {
    const isGo = typeof n === 'string'
    const el = this.countdown
    this.countdownText.textContent = isGo ? 'GO!' : String(n)
    el.classList.remove('is-visible', 'is-go', 'is-num')
    // eslint-disable-next-line no-unused-expressions
    void el.offsetWidth
    el.classList.add('is-visible', isGo ? 'is-go' : 'is-num')
    this._after(isGo ? COUNTDOWN_MS + 150 : COUNTDOWN_MS, () => el.classList.remove('is-visible', 'is-go', 'is-num'), el)
  }

  /** @param {string} text @param {{style?: 'lap'|'final'|'wrongway'|'info'}} opts */
  flash(text, { style = 'info' } = {}) {
    const el = this.flashEl
    this.flashText.textContent = text
    el.className = 'tkl-flash tkl-display'
    // eslint-disable-next-line no-unused-expressions
    void el.offsetWidth
    el.classList.add('is-visible', `style-${style}`)
    this._after(FLASH_MS, () => el.classList.remove('is-visible'), el)
  }

  showResults({ standings = [], onRestart, onMenu } = {}) {
    this.hideHUD()
    this.hidePause()
    this._present('results', { standings, onRestart: () => onRestart?.(), onMenu: () => onMenu?.() })
  }

  showPause(cb = {}) {
    this.pause.show(cb)
    this.pause.el.classList.add('is-visible')
    this.el.classList.add('is-paused')
  }

  hidePause() {
    this.pause.hide()
    this.pause.el.classList.remove('is-visible')
    this.el.classList.remove('is-paused')
  }

  /** Live touch control state or null on non-touch devices. */
  getTouchControls() {
    return this.touch ? this.touch.controls : null
  }

  /** Update the mute button icon (does not emit). */
  setMuted(muted) {
    this.muted = !!muted
    this.muteBtn.innerHTML = svg(this.muted ? 'speakerOff' : 'speaker')
    this.muteBtn.classList.toggle('is-muted', this.muted)
    this.muteBtn.setAttribute('aria-pressed', String(this.muted))
  }

  dispose() {
    this._disposed = true
    for (const t of this._timers) clearTimeout(t)
    this._timers.clear()
    this._keyed?.clear()
    window.removeEventListener('keydown', this._onKey)
    this.title.dispose()
    this.select.dispose()
    this.results.dispose()
    this.pause.dispose()
    this.hud.dispose()
    this.touch?.dispose()
    this.el.remove()
  }
}
