// Results: podium (top 3) with confetti + full standings table + Race Again / Main Menu.
import { EVT } from '../../core/constants.js'
import { h, ordinal, tint, shade } from '../util.js'
import { formatTime } from '../format.js'

const CONFETTI_COLORS = ['#ffcc33', '#ff4757', '#3ec1ff', '#3ddc84', '#c84bff', '#ffffff', '#ff9f1a']

export class ResultsScreen {
  constructor({ events }) {
    this.events = events
    this.onRestart = null
    this.onMenu = null
    this.btnIdx = 0

    this.podium = h('div', { class: 'res-podium' })
    this.tableBody = h('tbody')
    this.heading = h('h2', { class: 'res-heading tkl-display', text: 'RACE RESULTS' })
    this.sub = h('p', { class: 'res-sub' })
    this.againBtn = h('button', { class: 'tkl-btn tkl-btn-primary tkl-display', attrs: { type: 'button', tabindex: '-1' }, text: 'RACE AGAIN', onClick: () => this._restart(), onPointerenter: () => this._cursor(0) })
    this.menuBtn = h('button', { class: 'tkl-btn tkl-btn-ghost', attrs: { type: 'button', tabindex: '-1' }, text: 'Main Menu', onClick: () => this._menu(), onPointerenter: () => this._cursor(1) })
    this.confetti = h('div', { class: 'res-confetti', attrs: { 'aria-hidden': 'true' } })

    this.el = h('div', { class: 'tkl-screen tkl-results' },
      h('div', { class: 'tkl-bg tkl-bg-stripes' }),
      h('div', { class: 'tkl-bg tkl-bg-checker' }),
      this.confetti,
      h('div', { class: 'res-scroll' },
        h('header', { class: 'res-header' }, this.heading, this.sub),
        h('div', { class: 'res-columns' },
          this.podium,
          h('div', { class: 'res-table-wrap tkl-panel' },
            h('table', { class: 'res-table' },
              h('thead', {}, h('tr', {}, h('th', { text: '#' }), h('th', { text: '' }), h('th', { text: 'Racer' }), h('th', { text: 'Time' }))),
              this.tableBody,
            ),
          ),
        ),
        h('div', { class: 'res-buttons' }, this.menuBtn, this.againBtn),
      ),
    )
    this._onKey = (e) => this._key(e)
    this._bound = false
  }

  _cursor(i) {
    if (i !== this.btnIdx) {
      this.btnIdx = i
      this.events?.emit(EVT.UI_MOVE, { screen: 'results' })
    }
    this.againBtn.classList.toggle('is-cursor', this.btnIdx === 0)
    this.menuBtn.classList.toggle('is-cursor', this.btnIdx === 1)
  }

  _restart() {
    if (!this.onRestart) return
    this.events?.emit(EVT.UI_SELECT, { screen: 'results' })
    const cb = this.onRestart
    this.onRestart = null
    this.onMenu = null
    cb()
  }

  _menu() {
    if (!this.onMenu) return
    this.events?.emit(EVT.UI_BACK, { screen: 'results' })
    const cb = this.onMenu
    this.onRestart = null
    this.onMenu = null
    cb()
  }

  _key(e) {
    switch (e.code) {
      case 'Enter':
      case 'NumpadEnter':
      case 'Space':
        if (this.btnIdx === 0) this._restart()
        else this._menu()
        break
      case 'Escape':
      case 'Backspace':
        this._menu()
        break
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'KeyA':
      case 'KeyW':
        this._cursor(1)
        break
      case 'ArrowRight':
      case 'ArrowDown':
      case 'KeyD':
      case 'KeyS':
        this._cursor(0)
        break
      default:
        return
    }
    e.preventDefault()
  }

  show({ standings, onRestart, onMenu }) {
    this.onRestart = onRestart
    this.onMenu = onMenu
    const rows = (Array.isArray(standings) ? standings : []).slice().sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))
    const player = rows.find((r) => r.isPlayer)
    const pr = player?.rank ?? 0
    const o = ordinal(pr)
    this.sub.textContent = player ? (pr === 1 ? 'Victory! You took the chequered flag in 1st place!' : pr <= 3 ? `On the podium — you finished ${o.n}${o.suffix}!` : `You finished ${o.n}${o.suffix}. Better luck next race!`) : ''
    this.el.classList.toggle('is-win', pr === 1)

    // podium: 2nd, 1st, 3rd
    this.podium.textContent = ''
    const order = [rows[1], rows[0], rows[2]]
    order.forEach((r, i) => {
      if (!r) return
      const place = i === 1 ? 1 : i === 0 ? 2 : 3
      const color = r.color || '#3ec1ff'
      const oo = ordinal(place)
      this.podium.append(h('div', { class: `res-place res-place-${place}` + (r.isPlayer ? ' is-player' : ''), style: { '--c': color, '--c-light': tint(color, 0.35), '--c-dark': shade(color, 0.35), '--i': i } },
        h('div', { class: 'res-avatar' }, h('span', { class: 'tkl-display', text: (r.name || '?').charAt(0).toUpperCase() })),
        h('div', { class: 'res-place-name tkl-display', text: r.name || '???' }),
        h('div', { class: 'res-block' }, h('span', { class: 'res-block-rank tkl-display' }, oo.n, h('small', { text: oo.suffix }))),
      ))
    })

    // table
    this.tableBody.textContent = ''
    rows.forEach((r, i) => {
      const oo = ordinal(r.rank ?? i + 1)
      this.tableBody.append(h('tr', { class: 'res-row' + (r.isPlayer ? ' is-player' : ''), style: { '--i': i } },
        h('td', { class: 'res-rank tkl-display' }, `${oo.n}`, h('small', { text: oo.suffix })),
        h('td', { class: 'res-swatch-cell' }, h('span', { class: 'res-swatch', style: { '--c': r.color || '#9aa3b5' } })),
        h('td', { class: 'res-name' }, h('strong', { text: r.name || '???' }), r.isPlayer ? h('span', { class: 'res-you', text: 'YOU' }) : null, h('span', { class: 'res-title', text: r.title || '' })),
        h('td', { class: 'res-time', text: formatTime(r.time) }),
      ))
    })

    // confetti
    this.confetti.textContent = ''
    const n = pr === 1 ? 70 : 40
    for (let i = 0; i < n; i++) {
      this.confetti.append(h('i', { style: {
        '--x': (Math.random() * 100).toFixed(1) + 'vw',
        '--d': (2.6 + Math.random() * 2.4).toFixed(2) + 's',
        '--delay': (-Math.random() * 5).toFixed(2) + 's',
        '--r': (Math.random() * 360).toFixed(0) + 'deg',
        '--s': (0.6 + Math.random() * 0.8).toFixed(2),
        '--col': CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      } }))
    }

    this.btnIdx = 0
    this._cursor(0)
    if (!this._bound) {
      window.addEventListener('keydown', this._onKey)
      this._bound = true
    }
  }

  hide() {
    this.onRestart = null
    this.onMenu = null
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
