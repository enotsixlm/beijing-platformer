// Radial canvas speedometer: 0–240 km/h arc gauge, needle, digital readout.
import { clamp } from './util.js'

const MAX_KMH = 240
const START = Math.PI * 0.75 // 135°
const SWEEP = Math.PI * 1.5 // 270°
const NAVY = '#1b1f3b'

export class Speedometer {
  constructor(size = 200) {
    this.size = size
    this.dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.canvas = document.createElement('canvas')
    this.canvas.className = 'hud-speedo-canvas'
    this.canvas.width = size * this.dpr
    this.canvas.height = size * this.dpr
    this.ctx = this.canvas.getContext('2d')
    this._shown = -1
    this._boost = -1
    this._star = null
    this._bg = null
    this.draw(0, 0, false, 0)
  }

  /** Static background (rim, arc track, ticks, labels) rendered once to an offscreen canvas. */
  _buildBackground() {
    const s = this.size
    const c = document.createElement('canvas')
    c.width = c.height = s * this.dpr
    const ctx = c.getContext('2d')
    ctx.scale(this.dpr, this.dpr)
    const cx = s / 2, cy = s / 2, R = s * 0.44

    // dark disc
    const g = ctx.createRadialGradient(cx, cy * 0.8, R * 0.2, cx, cy, R)
    g.addColorStop(0, 'rgba(46,52,96,.96)')
    g.addColorStop(1, 'rgba(20,23,48,.96)')
    ctx.beginPath()
    ctx.arc(cx, cy, R, 0, Math.PI * 2)
    ctx.fillStyle = g
    ctx.fill()
    ctx.lineWidth = s * 0.03
    ctx.strokeStyle = '#fff'
    ctx.stroke()

    // arc track
    ctx.beginPath()
    ctx.arc(cx, cy, R * 0.78, START, START + SWEEP)
    ctx.lineWidth = s * 0.075
    ctx.lineCap = 'round'
    ctx.strokeStyle = 'rgba(255,255,255,.14)'
    ctx.stroke()

    // ticks + labels
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (let v = 0; v <= MAX_KMH; v += 10) {
      const a = START + (v / MAX_KMH) * SWEEP
      const major = v % 40 === 0
      const r0 = R * (major ? 0.62 : 0.66)
      const r1 = R * 0.7
      ctx.beginPath()
      ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0)
      ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1)
      ctx.lineWidth = major ? 2.5 : 1.2
      ctx.strokeStyle = major ? '#fff' : 'rgba(255,255,255,.5)'
      ctx.stroke()
      if (major) {
        ctx.font = `800 ${Math.round(s * 0.068)}px "Nunito", Arial, sans-serif`
        ctx.fillStyle = 'rgba(255,255,255,.85)'
        ctx.fillText(String(v), cx + Math.cos(a) * R * 0.5, cy + Math.sin(a) * R * 0.5)
      }
    }
    ctx.font = `800 ${Math.round(s * 0.058)}px "Nunito", Arial, sans-serif`
    ctx.fillStyle = 'rgba(255,255,255,.6)'
    ctx.fillText('km/h', cx, cy + R * 0.86)
    return c
  }

  /**
   * @param {number} kmh
   * @param {number} boost 0..1
   * @param {boolean} star
   * @param {number} time seconds (for rainbow animation)
   */
  draw(kmh, boost, star, time = 0) {
    kmh = clamp(Math.abs(kmh) || 0, 0, 320)
    const shown = Math.round(kmh)
    // Skip redraw when nothing visible changed (needle eased to rest and static state).
    if (shown === this._shown && Math.abs(kmh - this._kmh) < 0.05 && boost === this._boost && star === this._star && !star && !(boost > 0)) return
    this._shown = shown
    this._kmh = kmh
    this._boost = boost
    this._star = star
    if (!this._bg) this._bg = this._buildBackground()

    const ctx = this.ctx
    const s = this.size
    const dpr = this.dpr
    const cx = s / 2, cy = s / 2, R = s * 0.44
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, s * dpr, s * dpr)
    ctx.drawImage(this._bg, 0, 0)
    ctx.scale(dpr, dpr)

    const frac = clamp(kmh / MAX_KMH, 0, 1)
    const endA = START + frac * SWEEP

    // coloured fill arc
    let color
    if (star) {
      color = `hsl(${((time * 240) % 360).toFixed(0)}, 100%, 60%)`
    } else if (boost > 0) {
      color = '#ff9f1a'
    } else if (frac < 0.45) color = '#3ec1ff'
    else if (frac < 0.8) color = '#ffcc33'
    else color = '#ff4757'

    if (frac > 0.002) {
      ctx.save()
      ctx.shadowColor = color
      ctx.shadowBlur = boost > 0 || star ? s * 0.12 : s * 0.05
      ctx.beginPath()
      ctx.arc(cx, cy, R * 0.78, START, endA)
      ctx.lineWidth = s * 0.075
      ctx.lineCap = 'round'
      ctx.strokeStyle = color
      ctx.stroke()
      ctx.restore()
    }

    // glow ring when boosting / star
    if (boost > 0 || star) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.lineWidth = s * 0.03
      ctx.strokeStyle = color
      ctx.shadowColor = color
      ctx.shadowBlur = s * 0.15 * (star ? 1 : boost)
      ctx.stroke()
      ctx.restore()
    }

    // needle
    const a = START + frac * SWEEP
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(a)
    ctx.beginPath()
    ctx.moveTo(-s * 0.05, 0)
    ctx.lineTo(R * 0.7, -s * 0.012)
    ctx.lineTo(R * 0.72, 0)
    ctx.lineTo(R * 0.7, s * 0.012)
    ctx.lineTo(-s * 0.05, 0)
    ctx.closePath()
    ctx.fillStyle = '#ff4757'
    ctx.strokeStyle = NAVY
    ctx.lineWidth = 2
    ctx.fill()
    ctx.stroke()
    ctx.restore()
    // hub
    ctx.beginPath()
    ctx.arc(cx, cy, s * 0.045, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.lineWidth = 2.5
    ctx.strokeStyle = NAVY
    ctx.stroke()

    // digital readout
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `${Math.round(s * 0.17)}px "Luckiest Guy", "Arial Black", Impact, sans-serif`
    ctx.lineWidth = s * 0.028
    ctx.lineJoin = 'round'
    ctx.strokeStyle = NAVY
    ctx.strokeText(String(shown), cx, cy + R * 0.62)
    ctx.fillStyle = star ? color : '#fff'
    ctx.fillText(String(shown), cx, cy + R * 0.62)
  }
}
