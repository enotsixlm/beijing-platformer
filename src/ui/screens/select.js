// Character / track / difficulty selection. Keyboard (arrows, Tab/Enter, Escape), mouse and touch.
import { EVT, DIFFICULTY } from '../../core/constants.js'
import { h, tint, shade, svg, safeStorageGet, safeStorageSet } from '../util.js'

const STORAGE_KEY = 'tkl.select'
const GROUPS = ['chars', 'tracks', 'diff', 'buttons']
const DIFFS = [
  { id: DIFFICULTY.EASY, label: 'Easy' },
  { id: DIFFICULTY.NORMAL, label: 'Normal' },
  { id: DIFFICULTY.HARD, label: 'Hard' },
]
const STATS = [['speed', 'Speed'], ['accel', 'Accel'], ['handling', 'Handling'], ['weight', 'Weight']]
const CHAR_COLS = 4

export class SelectScreen {
  constructor({ characters, tracks, events }) {
    this.characters = Array.isArray(characters) ? characters : []
    this.tracks = Array.isArray(tracks) ? tracks : []
    this.events = events
    this.onConfirm = null
    this.onBack = null

    const saved = safeStorageGet(STORAGE_KEY) || {}
    this.charIdx = Math.max(0, this.characters.findIndex((c) => c.id === saved.characterId))
    this.trackIdx = Math.max(0, this.tracks.findIndex((t) => t.id === saved.trackId))
    this.diffIdx = Math.max(0, DIFFS.findIndex((d) => d.id === saved.difficulty))
    if (this.diffIdx === 0 && !saved.difficulty) this.diffIdx = 1
    this.btnIdx = 0
    this.group = 0

    this._build()
    this._onKey = (e) => this._key(e)
    this._bound = false
  }

  _build() {
    // characters
    this.charCards = this.characters.map((c, i) => {
      const color = c.color || '#3ec1ff'
      const ring = c.secondary || tint(color, 0.55)
      const card = h('button', {
        class: 'sel-card sel-char',
        attrs: { type: 'button', tabindex: '-1' },
        dataset: { id: c.id },
        style: { '--c': color, '--c-light': tint(color, 0.35), '--c-dark': shade(color, 0.35), '--ring': ring },
        onClick: () => { this._setGroup(0); this._setChar(i, true); },
        onPointerenter: () => { if (this.charIdx !== i) { this._setGroup(0); this._setChar(i, true) } },
      },
        h('div', { class: 'sel-avatar' }, h('span', { class: 'sel-avatar-letter tkl-display', text: (c.name || '?').charAt(0).toUpperCase() })),
        h('div', { class: 'sel-char-name tkl-display', text: c.name || '???' }),
        h('div', { class: 'sel-char-title', text: c.title || '' }),
        h('div', { class: 'sel-stats' }, ...STATS.map(([k, label]) => {
          const v = Math.max(0, Math.min(5, Number(c.stats?.[k]) || 0))
          return h('div', { class: 'sel-stat' }, h('span', { class: 'sel-stat-k', text: label }), h('span', { class: 'sel-stat-bar' }, h('i', { style: { '--v': v / 5 } })))
        })),
      )
      return card
    })
    this.charGrid = h('div', { class: 'sel-group sel-chars', attrs: { role: 'listbox', 'aria-label': 'Characters' } }, ...this.charCards)
    if (!this.charCards.length) this.charGrid.append(h('div', { class: 'sel-empty', text: 'No racers available' }))

    // tracks
    this.trackCards = this.tracks.map((t, i) => {
      const accent = t.accent || '#ff9f1a'
      const diff = Math.max(1, Math.min(3, Number(t.difficulty) || 1))
      return h('button', {
        class: 'sel-card sel-track',
        attrs: { type: 'button', tabindex: '-1' },
        dataset: { id: t.id },
        style: { '--c': accent, '--c-light': tint(accent, 0.4), '--c-dark': shade(accent, 0.45) },
        onClick: () => { this._setGroup(1); this._setTrack(i, true) },
        onPointerenter: () => { if (this.trackIdx !== i) { this._setGroup(1); this._setTrack(i, true) } },
      },
        h('div', { class: 'sel-track-art' }, h('i', { class: 'sel-track-road' })),
        h('div', { class: 'sel-track-body' },
          h('div', { class: 'sel-track-name tkl-display', text: t.name || t.id }),
          h('div', { class: 'sel-track-meta' },
            h('span', { class: 'sel-track-laps', text: `${t.laps ?? 3} LAPS` }),
            h('span', { class: 'sel-flags', attrs: { title: `Difficulty ${diff}/3` } }, ...[1, 2, 3].map((n) => h('span', { class: 'sel-flag' + (n <= diff ? ' is-on' : ''), html: svg('flag') }))),
          ),
          h('div', { class: 'sel-track-blurb', text: t.blurb || '' }),
        ),
      )
    })
    this.trackList = h('div', { class: 'sel-group sel-tracks', attrs: { role: 'listbox', 'aria-label': 'Tracks' } }, ...this.trackCards)
    if (!this.trackCards.length) this.trackList.append(h('div', { class: 'sel-empty', text: 'No tracks available' }))

    // difficulty
    this.diffBtns = DIFFS.map((d, i) => h('button', {
      class: 'sel-seg', attrs: { type: 'button', tabindex: '-1' }, dataset: { id: d.id }, text: d.label,
      onClick: () => { this._setGroup(2); this._setDiff(i, true) },
    }))
    this.diffSeg = h('div', { class: 'sel-group sel-diff', attrs: { role: 'radiogroup', 'aria-label': 'Difficulty' } }, h('span', { class: 'sel-diff-label', text: 'AI DIFFICULTY' }), h('div', { class: 'sel-segmented' }, ...this.diffBtns))

    // buttons
    this.startBtn = h('button', { class: 'tkl-btn tkl-btn-primary sel-start tkl-display', attrs: { type: 'button', tabindex: '-1' }, text: 'START RACE', onClick: () => this._confirm(), onPointerenter: () => this._setButton(0) })
    this.backBtn = h('button', { class: 'tkl-btn tkl-btn-ghost sel-back', attrs: { type: 'button', tabindex: '-1' }, text: 'Back', onClick: () => this._back(), onPointerenter: () => this._setButton(1) })
    this.buttons = h('div', { class: 'sel-group sel-buttons' }, this.backBtn, this.startBtn)

    this.el = h('div', { class: 'tkl-screen tkl-select' },
      h('div', { class: 'tkl-bg tkl-bg-stripes' }),
      h('div', { class: 'tkl-bg tkl-bg-checker' }),
      h('div', { class: 'sel-scroll' },
        h('header', { class: 'sel-header' },
          h('h2', { class: 'sel-heading tkl-display', text: 'CHOOSE YOUR RACER' }),
          h('p', { class: 'sel-hint' }, h('kbd', { text: 'Arrows' }), ' move  ', h('kbd', { text: 'Tab' }), ' / ', h('kbd', { text: 'Enter' }), ' next  ', h('kbd', { text: 'Esc' }), ' back'),
        ),
        h('div', { class: 'sel-columns' },
          h('section', { class: 'sel-col sel-col-chars' }, this.charGrid),
          h('section', { class: 'sel-col sel-col-race' },
            h('h3', { class: 'sel-subheading tkl-display', text: 'PICK A TRACK' }),
            this.trackList,
            this.diffSeg,
            this.buttons,
          ),
        ),
      ),
    )
    this._groupEls = [this.charGrid, this.trackList, this.diffSeg, this.buttons]
    this._render()
  }

  // ── state ──

  _render() {
    this.charCards.forEach((c, i) => c.classList.toggle('is-selected', i === this.charIdx))
    this.trackCards.forEach((c, i) => c.classList.toggle('is-selected', i === this.trackIdx))
    this.diffBtns.forEach((b, i) => { b.classList.toggle('is-selected', i === this.diffIdx); b.setAttribute('aria-checked', String(i === this.diffIdx)) })
    this.startBtn.classList.toggle('is-cursor', this.group === 3 && this.btnIdx === 0)
    this.backBtn.classList.toggle('is-cursor', this.group === 3 && this.btnIdx === 1)
    this._groupEls.forEach((g, i) => g.classList.toggle('is-focused', i === this.group))
    const c = this.characters[this.charIdx]
    if (c) this.el.style.setProperty('--sel-accent', c.color || '#3ec1ff')
    this.startBtn.disabled = !this.characters.length || !this.tracks.length
  }

  _move() { this.events?.emit(EVT.UI_MOVE, { screen: 'select' }) }

  _setGroup(g) {
    g = (g + GROUPS.length) % GROUPS.length
    if (g === this.group) return
    this.group = g
    this._render()
    this._scrollIntoView(this._groupEls[g])
  }

  _setChar(i, fromPointer = false) {
    if (!this.characters.length) return
    i = (i + this.characters.length) % this.characters.length
    if (i === this.charIdx) return
    this.charIdx = i
    this._move()
    this._render()
    if (!fromPointer) this._scrollIntoView(this.charCards[i])
  }

  _setTrack(i, fromPointer = false) {
    if (!this.tracks.length) return
    i = (i + this.tracks.length) % this.tracks.length
    if (i === this.trackIdx) return
    this.trackIdx = i
    this._move()
    this._render()
    if (!fromPointer) this._scrollIntoView(this.trackCards[i])
  }

  _setDiff(i) {
    i = (i + DIFFS.length) % DIFFS.length
    if (i === this.diffIdx) return
    this.diffIdx = i
    this._move()
    this._render()
  }

  _setButton(i) {
    this._setGroup(3)
    if (i === this.btnIdx) return
    this.btnIdx = i
    this._move()
    this._render()
  }

  _scrollIntoView(el) {
    try { el?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' }) } catch { /* noop */ }
  }

  _choice() {
    return {
      characterId: this.characters[this.charIdx]?.id ?? null,
      trackId: this.tracks[this.trackIdx]?.id ?? null,
      difficulty: DIFFS[this.diffIdx].id,
    }
  }

  _confirm() {
    if (!this.onConfirm || this.startBtn.disabled) return
    const choice = this._choice()
    safeStorageSet(STORAGE_KEY, choice)
    this.events?.emit(EVT.UI_SELECT, { screen: 'select', choice })
    this.el.classList.add('is-confirmed')
    const cb = this.onConfirm
    this.onConfirm = null
    cb(choice)
  }

  _back() {
    if (!this.onBack) return
    this.events?.emit(EVT.UI_BACK, { screen: 'select' })
    const cb = this.onBack
    this.onBack = null
    cb()
  }

  // ── keyboard ──

  _key(e) {
    if (!this.onConfirm && !this.onBack) return
    const k = e.code
    let handled = true
    switch (k) {
      case 'Escape':
      case 'Backspace':
        this._back()
        break
      case 'Tab':
        this._setGroup(this.group + (e.shiftKey ? -1 : 1))
        this._move()
        break
      case 'Enter':
      case 'Space':
      case 'NumpadEnter':
        if (this.group === 3) {
          if (this.btnIdx === 0) this._confirm()
          else this._back()
        } else {
          this.events?.emit(EVT.UI_SELECT, { screen: 'select', step: GROUPS[this.group] })
          this._setGroup(this.group + 1)
        }
        break
      case 'ArrowLeft':
      case 'KeyA':
        this._arrow(-1, 0)
        break
      case 'ArrowRight':
      case 'KeyD':
        this._arrow(1, 0)
        break
      case 'ArrowUp':
      case 'KeyW':
        this._arrow(0, -1)
        break
      case 'ArrowDown':
      case 'KeyS':
        this._arrow(0, 1)
        break
      default:
        handled = false
    }
    if (handled) e.preventDefault()
  }

  _arrow(dx, dy) {
    switch (this.group) {
      case 0: {
        const n = this.characters.length
        if (!n) return this._setGroup(this.group + (dy || dx))
        const cols = Math.min(CHAR_COLS, n)
        if (dx) {
          this._setChar(this.charIdx + dx)
        } else if (dy) {
          const next = this.charIdx + dy * cols
          if (next < 0 || next >= n) {
            // leaving the grid vertically moves to the neighbouring group
            if (dy > 0) this._setGroup(1)
            else this._setGroup(3)
            this._move()
          } else this._setChar(next)
        }
        break
      }
      case 1: {
        const d = dx || dy
        const n = this.tracks.length
        if (!n) return this._setGroup(this.group + d)
        const next = this.trackIdx + d
        if (dy && (next < 0 || next >= n)) {
          this._setGroup(dy > 0 ? 2 : 0)
          this._move()
        } else this._setTrack(next)
        break
      }
      case 2:
        if (dx) this._setDiff(this.diffIdx + dx)
        else if (dy) { this._setGroup(dy > 0 ? 3 : 1); this._move() }
        break
      case 3:
        if (dx) { this.btnIdx = dx > 0 ? 0 : 1; this._move(); this._render() }
        else if (dy) { this._setGroup(dy > 0 ? 0 : 2); this._move() }
        break
    }
  }

  // ── lifecycle ──

  show({ onConfirm, onBack }) {
    this.onConfirm = onConfirm
    this.onBack = onBack
    this.group = 0
    this.btnIdx = 0
    this.el.classList.remove('is-confirmed')
    this._render()
    // restart stat-bar animations
    this.el.classList.remove('is-animated')
    requestAnimationFrame(() => this.el.classList.add('is-animated'))
    if (!this._bound) {
      window.addEventListener('keydown', this._onKey)
      this._bound = true
    }
  }

  hide() {
    this.onConfirm = null
    this.onBack = null
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
