// Pause overlay: dimmed backdrop, "PAUSED", Resume / Restart / Main Menu (keyboard navigable).
import { EVT } from '../../core/constants.js'
import { h } from '../util.js'

export class PauseScreen {
  constructor({ events }) {
    this.events = events
    this.cb = null
    this.idx = 0
    this.items = [
      { id: 'resume', label: 'Resume', cls: 'tkl-btn-primary tkl-display' },
      { id: 'restart', label: 'Restart Race', cls: 'tkl-btn-ghost' },
      { id: 'menu', label: 'Main Menu', cls: 'tkl-btn-ghost' },
    ]
    this.buttons = this.items.map((it, i) => h('button', {
      class: `tkl-btn ${it.cls} pause-btn`, attrs: { type: 'button', tabindex: '-1' }, text: it.label,
      onClick: () => this._activate(i),
      onPointerenter: () => this._cursor(i),
    }))
    this.el = h('div', { class: 'tkl-overlay tkl-pause' },
      h('div', { class: 'pause-panel tkl-panel' },
        h('h2', { class: 'pause-heading tkl-display', text: 'PAUSED' }),
        h('p', { class: 'pause-hint', text: 'Take a breather. The race is frozen.' }),
        h('div', { class: 'pause-buttons' }, ...this.buttons),
      ),
    )
    this._onKey = (e) => this._key(e)
    this._bound = false
    this.visible = false
  }

  _cursor(i) {
    i = (i + this.items.length) % this.items.length
    if (i !== this.idx) this.events?.emit(EVT.UI_MOVE, { screen: 'pause' })
    this.idx = i
    this.buttons.forEach((b, j) => b.classList.toggle('is-cursor', j === i))
  }

  _activate(i) {
    if (!this.cb || !this.visible) return
    const id = this.items[i].id
    this.events?.emit(id === 'resume' ? EVT.UI_BACK : EVT.UI_SELECT, { screen: 'pause', action: id })
    const cb = this.cb
    if (id === 'resume') cb.onResume?.()
    else if (id === 'restart') cb.onRestart?.()
    else cb.onMenu?.()
  }

  _key(e) {
    if (!this.visible) return
    switch (e.code) {
      case 'ArrowUp':
      case 'KeyW':
        this._cursor(this.idx - 1)
        break
      case 'ArrowDown':
      case 'KeyS':
        this._cursor(this.idx + 1)
        break
      case 'Enter':
      case 'NumpadEnter':
      case 'Space':
        this._activate(this.idx)
        break
      case 'Escape':
        // The orchestrator also maps Escape → resume; when it runs first it hides us and this is a no-op.
        this._activate(0)
        break
      default:
        return
    }
    e.preventDefault()
  }

  show(cb) {
    this.cb = cb || {}
    this.visible = true
    this.idx = 0
    this._cursor(0)
    if (!this._bound) {
      window.addEventListener('keydown', this._onKey)
      this._bound = true
    }
  }

  hide() {
    this.visible = false
    this.cb = null
    if (this._bound) {
      window.removeEventListener('keydown', this._onKey)
      this._bound = false
    }
  }

  dispose() {
    this.hide()
    this.el.remove()
  }
}
