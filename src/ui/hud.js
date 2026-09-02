// In-race HUD: position badge, lap/timer, item slot, speedometer, minimap, drift/boost bars,
// wrong-way banner, lap times, fps, pause/mute buttons. `update()` only touches the DOM on change.
import { ITEM_IDS } from '../core/constants.js'
import { h, ordinal, replay, svg } from './util.js'
import { Speedometer } from './speedo.js'
import { Minimap } from './minimap.js'
import { itemIconDataUrl, baseItemId } from './itemIcons.js'
import { formatTime } from './format.js'

const RANK_COLORS = ['#ffcc33', '#d7dde8', '#e0965a', '#3ec1ff', '#3ddc84', '#c84bff', '#ff6fae', '#9aa3b5']

export class HUD {
  constructor({ onPause, onMute }) {
    this.el = h('div', { class: 'tkl-hud', attrs: { 'aria-hidden': 'true' } })
    this._last = {}
    this._rouletteIdx = 0
    this._rouletteNext = 0
    this._fpsVisible = false
    this._lapTimesLen = -1

    // ── top-left: position badge + lap times ──
    this.posNum = h('span', { class: 'hud-pos-num', text: '1' })
    this.posSuf = h('span', { class: 'hud-pos-suf', text: 'st' })
    this.pos = h('div', { class: 'hud-pos rank-1' }, this.posNum, this.posSuf)
    this.lapTimes = h('div', { class: 'hud-laptimes' })
    this.el.append(h('div', { class: 'hud-corner hud-tl' }, this.pos, this.lapTimes))

    // ── top-centre: item slot ──
    this.itemImg = h('img', { class: 'hud-item-img', attrs: { alt: '', draggable: 'false' } })
    this.itemCount = h('span', { class: 'hud-item-count', text: '' })
    this.itemSlot = h('div', { class: 'hud-item is-empty' }, h('div', { class: 'hud-item-inner' }, this.itemImg), this.itemCount)
    this.el.append(h('div', { class: 'hud-top-centre' }, this.itemSlot))

    // ── top-right: lap + timer + buttons ──
    this.lapNum = h('span', { class: 'hud-lap-num', text: '1/3' })
    this.timer = h('div', { class: 'hud-timer', text: '0:00.000' })
    this.lapPanel = h('div', { class: 'hud-lap' }, h('div', { class: 'hud-lap-row' }, h('span', { class: 'hud-lap-label', text: 'LAP' }), this.lapNum), this.timer)
    this.pauseBtn = h('button', { class: 'tkl-iconbtn hud-pause', attrs: { type: 'button', 'aria-label': 'Pause', title: 'Pause (Esc)' }, html: svg('pause'), onClick: (e) => { e.stopPropagation(); onPause?.() } })
    this.el.append(h('div', { class: 'hud-corner hud-tr' }, this.lapPanel, h('div', { class: 'hud-btns' }, this.pauseBtn)))

    // ── centre: wrong way ──
    this.wrongWay = h('div', { class: 'hud-wrongway' }, h('span', { class: 'hud-wrongway-arrow', html: svg('arrowL') }), h('span', { text: 'WRONG WAY' }), h('span', { class: 'hud-wrongway-arrow', html: svg('arrowR') }))
    this.el.append(this.wrongWay)

    // ── bottom-left: minimap ──
    this.minimap = new Minimap(180)
    this.el.append(h('div', { class: 'hud-corner hud-bl' }, h('div', { class: 'hud-minimap' }, this.minimap.canvas)))

    // ── bottom-right: speedo + drift + boost ──
    this.speedo = new Speedometer(200)
    this.driftSegs = [1, 2, 3].map((i) => h('span', { class: `hud-drift-seg lvl-${i}` }))
    this.drift = h('div', { class: 'hud-drift lvl-0' }, ...this.driftSegs)
    this.boostFill = h('div', { class: 'hud-boost-fill' })
    this.boost = h('div', { class: 'hud-boost' }, this.boostFill, h('span', { class: 'hud-boost-label', text: 'BOOST' }))
    this.el.append(h('div', { class: 'hud-corner hud-br' }, h('div', { class: 'hud-speedo' }, this.speedo.canvas), this.drift, this.boost))

    // ── fps ──
    this.fps = h('div', { class: 'hud-fps', text: '60 fps' })
    this.el.append(this.fps)
    this._onMute = onMute
  }

  show() {
    this.el.classList.add('is-visible')
    this._last = {}
    this._lapTimesLen = -1
  }

  hide() {
    this.el.classList.remove('is-visible')
  }

  toggleFps() {
    this._fpsVisible = !this._fpsVisible
    this.fps.classList.toggle('is-visible', this._fpsVisible)
  }

  /** @param {import('./index.js').HudState} s */
  update(s) {
    if (!s) return
    const L = this._last
    const now = performance.now()

    // position
    if (s.rank !== L.rank) {
      const { n, suffix } = ordinal(s.rank)
      this.posNum.textContent = String(n)
      this.posSuf.textContent = suffix
      this.pos.className = `hud-pos rank-${Math.min(8, Math.max(1, n))}`
      this.pos.style.setProperty('--rank-color', RANK_COLORS[Math.min(7, Math.max(0, n - 1))])
      if (L.rank !== undefined) replay(this.pos, 'is-pop')
      L.rank = s.rank
    }

    // lap
    if (s.lap !== L.lap || s.totalLaps !== L.totalLaps) {
      this.lapNum.textContent = `${s.lap ?? 1}/${s.totalLaps ?? 3}`
      if (L.lap !== undefined) replay(this.lapPanel, 'is-pop')
      L.lap = s.lap
      L.totalLaps = s.totalLaps
    }

    // timer (only update text when the millisecond string changes)
    const t = formatTime(s.time)
    if (t !== L.timeStr) {
      this.timer.textContent = t
      L.timeStr = t
    }

    // item slot
    const roulette = s.itemRoulette
    if (roulette != null) {
      if (!L.rouletting) {
        this.itemSlot.classList.add('is-rolling')
        this.itemSlot.classList.remove('is-empty')
        this.itemCount.textContent = ''
        L.rouletting = true
        L.itemKey = null
      }
      // slot-machine: fast at the start, slowing down toward the end
      if (now >= this._rouletteNext) {
        this._rouletteIdx = (this._rouletteIdx + 1 + ((Math.random() * (ITEM_IDS.length - 1)) | 0)) % ITEM_IDS.length
        this.itemImg.src = itemIconDataUrl(ITEM_IDS[this._rouletteIdx])
        this._rouletteNext = now + 55 + roulette * roulette * 220
      }
    } else {
      if (L.rouletting) {
        this.itemSlot.classList.remove('is-rolling')
        L.rouletting = false
        L.itemKey = null
      }
      const item = s.item
      const key = item ? `${item.id}:${item.count}` : ''
      if (key !== L.itemKey) {
        L.itemKey = key
        if (item) {
          this.itemImg.src = itemIconDataUrl(baseItemId(item.id), { badge: false })
          this.itemCount.textContent = item.count > 1 ? `×${item.count}` : ''
          this.itemSlot.classList.remove('is-empty')
          replay(this.itemSlot, 'is-got')
        } else {
          this.itemSlot.classList.add('is-empty')
          this.itemCount.textContent = ''
        }
      }
    }

    // drift level
    const dl = s.driftLevel | 0
    if (dl !== L.driftLevel) {
      this.drift.className = `hud-drift lvl-${dl}`
      L.driftLevel = dl
    }

    // boost bar
    const b = Math.round((s.boost || 0) * 100) / 100
    if (b !== L.boost) {
      this.boostFill.style.transform = `scaleX(${b})`
      this.boost.classList.toggle('is-active', b > 0)
      L.boost = b
    }

    // star
    if (!!s.star !== L.star) {
      this.el.classList.toggle('is-star', !!s.star)
      L.star = !!s.star
    }

    // wrong way
    if (!!s.wrongWay !== L.wrongWay) {
      this.wrongWay.classList.toggle('is-visible', !!s.wrongWay)
      L.wrongWay = !!s.wrongWay
    }

    // lap times (last 3 + best)
    const lt = s.lapTimes || []
    if (lt.length !== this._lapTimesLen || s.bestLap !== L.bestLap) {
      this._lapTimesLen = lt.length
      L.bestLap = s.bestLap
      this.lapTimes.textContent = ''
      const start = Math.max(0, lt.length - 3)
      for (let i = start; i < lt.length; i++) {
        const best = s.bestLap != null && Math.abs(lt[i] - s.bestLap) < 1e-6
        this.lapTimes.append(h('div', { class: 'hud-laptime' + (best ? ' is-best' : '') }, h('span', { class: 'hud-laptime-k', text: `LAP ${i + 1}` }), h('span', { class: 'hud-laptime-v', text: formatTime(lt[i]) })))
      }
      if (s.bestLap != null) {
        this.lapTimes.append(h('div', { class: 'hud-laptime is-best-row' }, h('span', { class: 'hud-laptime-k', text: 'BEST' }), h('span', { class: 'hud-laptime-v', text: formatTime(s.bestLap) })))
      }
      this.lapTimes.classList.toggle('is-visible', lt.length > 0)
      if (lt.length > 0) replay(this.lapTimes, 'is-fade')
    }

    // fps
    if (this._fpsVisible) {
      const f = Math.round(s.fps || 0)
      if (f !== L.fps) {
        this.fps.textContent = `${f} fps`
        L.fps = f
      }
    }

    // canvases: cheap enough every frame
    this.speedo.draw(s.speedKmh || 0, s.boost || 0, !!s.star, s.time || now / 1000)
    if (s.minimap) this.minimap.draw(s.minimap)
  }

  dispose() {
    this.el.remove()
  }
}
