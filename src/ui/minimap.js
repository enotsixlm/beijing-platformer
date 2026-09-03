// Canvas minimap: track polyline fitted to bounds + kart dots (player drawn last).

const NAVY = '#1b1f3b'

export class Minimap {
  constructor(size = 180) {
    this.size = size
    this.dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.canvas = document.createElement('canvas')
    this.canvas.className = 'hud-minimap-canvas'
    this.canvas.width = size * this.dpr
    this.canvas.height = size * this.dpr
    this.ctx = this.canvas.getContext('2d')
    this._points = null
    this._boundsKey = ''
    this._path = null
    this._track = null
    this._fit = { sx: 1, sy: 1, ox: 0, oz: 0 }
    this._sorted = []
  }

  _fitTo(points, bounds) {
    const pad = this.size * 0.11
    const dx = Math.max(1e-3, bounds.maxX - bounds.minX)
    const dz = Math.max(1e-3, bounds.maxZ - bounds.minZ)
    const sc = Math.min((this.size - pad * 2) / dx, (this.size - pad * 2) / dz)
    const w = dx * sc, hgt = dz * sc
    this._fit = {
      sc,
      ox: (this.size - w) / 2 - bounds.minX * sc,
      oz: (this.size - hgt) / 2 - bounds.minZ * sc,
    }
    // Pre-render the track once to an offscreen canvas.
    const c = document.createElement('canvas')
    c.width = c.height = this.size * this.dpr
    const ctx = c.getContext('2d')
    ctx.scale(this.dpr, this.dpr)
    if (points && points.length > 1) {
      const path = new Path2D()
      points.forEach((p, i) => {
        const [x, y] = this.project(p.x, p.z)
        i ? path.lineTo(x, y) : path.moveTo(x, y)
      })
      path.closePath()
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      ctx.lineWidth = this.size * 0.075
      ctx.strokeStyle = NAVY
      ctx.stroke(path)
      ctx.lineWidth = this.size * 0.045
      ctx.strokeStyle = '#cfd6f5'
      ctx.stroke(path)
      ctx.setLineDash([this.size * 0.02, this.size * 0.02])
      ctx.lineWidth = this.size * 0.008
      ctx.strokeStyle = 'rgba(27,31,59,.5)'
      ctx.stroke(path)
      ctx.setLineDash([])
      // start/finish marker
      const [sx, sy] = this.project(points[0].x, points[0].z)
      const n = points[1]
      const [nx, ny] = this.project(n.x, n.z)
      const ang = Math.atan2(ny - sy, nx - sx) + Math.PI / 2
      ctx.save()
      ctx.translate(sx, sy)
      ctx.rotate(ang)
      const L = this.size * 0.03, W = this.size * 0.012
      for (let i = -1; i <= 1; i++) {
        ctx.fillStyle = i === 0 ? NAVY : '#fff'
        ctx.fillRect(-L, i * W - W / 2, L * 2, W)
      }
      ctx.restore()
    }
    this._track = c
  }

  project(x, z) {
    const f = this._fit
    return [x * f.sc + f.ox, z * f.sc + f.oz]
  }

  /** @param {{points: {x:number,z:number}[], bounds: {minX,maxX,minZ,maxZ}, karts: {x,z,color,isPlayer,rank}[]}} mm */
  draw(mm) {
    if (!mm) return
    const points = mm.points || []
    const b = mm.bounds || { minX: -1, maxX: 1, minZ: -1, maxZ: 1 }
    const key = `${b.minX}|${b.maxX}|${b.minZ}|${b.maxZ}|${points.length}`
    if (points !== this._points || key !== this._boundsKey || !this._track) {
      this._points = points
      this._boundsKey = key
      this._fitTo(points, b)
    }
    const ctx = this.ctx
    const s = this.size
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, s * this.dpr, s * this.dpr)
    ctx.drawImage(this._track, 0, 0)
    ctx.scale(this.dpr, this.dpr)

    const karts = mm.karts || []
    const sorted = this._sorted
    sorted.length = 0
    for (const k of karts) if (!k.isPlayer) sorted.push(k)
    for (const k of karts) if (k.isPlayer) sorted.push(k)
    const r = s * 0.028
    for (const k of sorted) {
      const [x, y] = this.project(k.x, k.z)
      ctx.beginPath()
      if (k.isPlayer) {
        ctx.arc(x, y, r * 1.55, 0, Math.PI * 2)
        ctx.fillStyle = '#fff'
        ctx.fill()
        ctx.lineWidth = 1.5
        ctx.strokeStyle = NAVY
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(x, y, r * 1.0, 0, Math.PI * 2)
        ctx.fillStyle = k.color || '#3ec1ff'
        ctx.fill()
      } else {
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fillStyle = k.color || '#9aa3b5'
        ctx.fill()
        ctx.lineWidth = 1.5
        ctx.strokeStyle = NAVY
        ctx.stroke()
      }
    }
  }
}
