// Title screen: animated logo, tagline, "press any key / tap" prompt, credits.
import { GAME_TITLE, EVT } from '../../core/constants.js'
import { h } from '../util.js'

const IGNORED_KEYS = new Set(['KeyM', 'F3', 'ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight', 'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight', 'CapsLock', 'Tab', 'Escape'])

export class TitleScreen {
  constructor({ events }) {
    this.events = events
    const words = GAME_TITLE.toUpperCase().split(' ')
    this.el = h('div', { class: 'tkl-screen tkl-title' },
      h('div', { class: 'tkl-bg tkl-bg-stripes' }),
      h('div', { class: 'tkl-bg tkl-bg-checker' }),
      h('div', { class: 'tkl-bg tkl-bg-shapes' }, ...Array.from({ length: 14 }, (_, i) => h('i', { style: {
        '--i': i,
        left: `${(i * 37 + 5) % 100}%`,
        top: `${(i * 53 + 11) % 100}%`,
        '--sz': `${2 + ((i * 7) % 11) * 0.9}vmin`,
      } }))),
      h('div', { class: 'title-content' },
        h('div', { class: 'title-badge', text: 'ARCADE KART RACING' }),
        h('h1', { class: 'title-logo tkl-display', attrs: { 'aria-label': GAME_TITLE } },
          ...words.map((w, i) => h('span', { class: `logo-word logo-word-${i + 1}`, dataset: { text: w } }, h('span', { class: 'logo-text', text: w }), h('span', { class: 'logo-shine', text: w, attrs: { 'aria-hidden': 'true' } }))),
        ),
        h('p', { class: 'title-tagline', text: 'Drift. Boost. Throw. Win.' }),
        h('div', { class: 'title-prompt tkl-display' }, h('span', { class: 'is-desktop', text: 'Press any key to start' }), h('span', { class: 'is-touch', text: 'Tap to start' })),
      ),
      h('div', { class: 'title-credits', text: 'Made with three.js — everything you see and hear is generated procedurally. No assets were harmed.' }),
    )
    this._onStart = null
    this._readyAt = 0
    this._key = (e) => this._maybeStart(e)
    this._ptr = (e) => this._maybeStart(e)
    this._bound = false
  }

  show({ onStart }) {
    this._onStart = onStart
    this._readyAt = performance.now() + 300
    if (!this._bound) {
      window.addEventListener('keydown', this._key)
      window.addEventListener('pointerdown', this._ptr)
      this._bound = true
    }
  }

  hide() {
    this._onStart = null
    if (this._bound) {
      window.removeEventListener('keydown', this._key)
      window.removeEventListener('pointerdown', this._ptr)
      this._bound = false
    }
  }

  _maybeStart(e) {
    if (!this._onStart) return
    if (performance.now() < this._readyAt) return
    if (e.type === 'keydown') {
      if (e.repeat || IGNORED_KEYS.has(e.code)) return
    } else if (e.target && e.target.closest && e.target.closest('.tkl-iconbtn')) {
      return // mute button etc.
    }
    const cb = this._onStart
    this._onStart = null
    this.events?.emit(EVT.UI_SELECT, { screen: 'title' })
    cb()
  }

  dispose() {
    this.hide()
    this.el.remove()
  }
}
