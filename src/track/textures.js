import * as THREE from 'three'
import { mulberry32 } from '../core/rng.js'

const HAS_DOM = typeof document !== 'undefined' && typeof document.createElement === 'function'

/**
 * Guarded CanvasTexture factory. In a headless (Node) environment there is no canvas, so a 1×1
 * white DataTexture is returned instead; all geometry/logic code paths stay identical.
 * @param {number} w
 * @param {number} h
 * @param {(ctx: CanvasRenderingContext2D, w: number, h: number) => void} draw
 * @param {{repeat?: [number, number], nearest?: boolean, srgb?: boolean}} [opts]
 */
export function tex(w, h, draw, opts = {}) {
  let t
  if (HAS_DOM) {
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    draw(ctx, w, h)
    t = new THREE.CanvasTexture(canvas)
  } else {
    t = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1)
    t.needsUpdate = true
  }
  t.colorSpace = opts.srgb === false ? THREE.NoColorSpace : THREE.SRGBColorSpace
  t.anisotropy = 4
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  if (opts.repeat) t.repeat.set(opts.repeat[0], opts.repeat[1])
  if (opts.nearest) { t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestMipmapLinearFilter }
  return t
}

/** Scatter random speckles for a chunky noisy surface. */
function speckle(ctx, w, h, count, colors, rand, sizeMin = 1, sizeMax = 3) {
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = colors[Math.floor(rand() * colors.length)]
    const s = sizeMin + rand() * (sizeMax - sizeMin)
    ctx.fillRect(rand() * w, rand() * h, s, s)
  }
}

/**
 * Road texture: u spans the road width (0..1), v tiles along the length (one tile ≈ 16 m).
 * Dashed centre line + solid edge lines.
 */
export function asphaltTexture({ base = '#3c3f48', speck = ['#4a4e58', '#33363e', '#565a66'], centre = '#ffd84a', edge = '#f4f4f4', dashes = 2, wet = false } = {}) {
  return tex(512, 512, (ctx, w, h) => {
    const rand = mulberry32(7)
    ctx.fillStyle = base
    ctx.fillRect(0, 0, w, h)
    speckle(ctx, w, h, wet ? 2500 : 5000, speck, rand, 1, 4)
    if (wet) {
      // soft glossy streaks
      for (let i = 0; i < 14; i++) {
        const g = ctx.createLinearGradient(0, 0, w, 0)
        g.addColorStop(0, 'rgba(255,255,255,0)')
        g.addColorStop(0.5, `rgba(180,200,255,${0.03 + rand() * 0.05})`)
        g.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = g
        ctx.fillRect(0, rand() * h, w, 12 + rand() * 30)
      }
    }
    // edge lines
    ctx.fillStyle = edge
    ctx.fillRect(Math.round(w * 0.035), 0, 10, h)
    ctx.fillRect(Math.round(w * 0.965) - 10, 0, 10, h)
    // dashed centre line
    ctx.fillStyle = centre
    const dashLen = h / dashes
    for (let i = 0; i < dashes; i++) ctx.fillRect(w / 2 - 6, i * dashLen + dashLen * 0.15, 12, dashLen * 0.5)
  })
}

/** Red/white (or custom) curb stripes tiling along v. */
export function curbTexture(a = '#e53935', b = '#f7f7f7') {
  return tex(32, 128, (ctx, w, h) => {
    ctx.fillStyle = a
    ctx.fillRect(0, 0, w, h / 2)
    ctx.fillStyle = b
    ctx.fillRect(0, h / 2, w, h / 2)
    // subtle shading line at the inner edge
    ctx.fillStyle = 'rgba(0,0,0,0.18)'
    ctx.fillRect(0, 0, 3, h)
  }, { nearest: true })
}

/** Black & white checker strip (start/finish line, gate banner trims). */
export function checkerTexture(cols = 16, rows = 4) {
  return tex(cols * 16, rows * 16, (ctx, w, h) => {
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      ctx.fillStyle = (x + y) % 2 ? '#111111' : '#f5f5f5'
      ctx.fillRect(x * 16, y * 16, 16, 16)
    }
  }, { nearest: true })
}

/** Natural ground textures: 'sand' | 'grass' | 'ash' | 'gravel' | 'concrete' | 'rock' */
export function groundTexture(kind) {
  const presets = {
    sand: { base: '#e9cf8f', speck: ['#f2dea6', '#d9bd7b', '#f7e7b8', '#cbb06d'], count: 4000 },
    grass: { base: '#5cb843', speck: ['#6fcf4f', '#4aa235', '#82d95e', '#3f8f2c'], count: 6000 },
    ash: { base: '#2b2529', speck: ['#3a3236', '#1f1a1d', '#4a3f42', '#6b3a2a'], count: 4500 },
    gravel: { base: '#4a4f5c', speck: ['#5a606e', '#3c414d', '#6a7182', '#2f333c'], count: 5000 },
    concrete: { base: '#8d929c', speck: ['#9aa0aa', '#7e838c', '#a6abb5'], count: 3000 },
    rock: { base: '#5a4a48', speck: ['#6b5a57', '#4a3b39', '#7c6a66', '#3a2e2c'], count: 4000 },
    lavaRock: { base: '#231a1c', speck: ['#31262a', '#1a1214', '#3d2d30', '#552a20'], count: 5000 },
  }
  const p = presets[kind] ?? presets.grass
  return tex(256, 256, (ctx, w, h) => {
    const rand = mulberry32(kind.length * 31)
    ctx.fillStyle = p.base
    ctx.fillRect(0, 0, w, h)
    speckle(ctx, w, h, p.count, p.speck, rand, 1, kind === 'rock' || kind === 'lavaRock' ? 6 : 3)
    if (kind === 'grass') {
      ctx.strokeStyle = 'rgba(30,90,20,0.35)'
      for (let i = 0; i < 400; i++) {
        const x = rand() * w, y = rand() * h
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + rand() * 4 - 2, y - 4 - rand() * 4); ctx.stroke()
      }
    }
    if (kind === 'ash' || kind === 'lavaRock') {
      ctx.strokeStyle = 'rgba(255,120,30,0.55)'
      ctx.lineWidth = 2
      for (let i = 0; i < 18; i++) {
        let x = rand() * w, y = rand() * h
        ctx.beginPath(); ctx.moveTo(x, y)
        for (let k = 0; k < 6; k++) { x += rand() * 30 - 15; y += rand() * 30 - 15; ctx.lineTo(x, y) }
        ctx.stroke()
      }
    }
  })
}

/** Vertical sky gradient (v = 0 bottom → 1 top). Optional stars for night skies. */
export function skyTexture(stops, { stars = 0 } = {}) {
  return tex(stars > 0 ? 1024 : 64, 512, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, h, 0, 0)
    for (const [pos, color] of stops) g.addColorStop(pos, color)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
    if (stars > 0) {
      const rand = mulberry32(99)
      for (let i = 0; i < stars; i++) {
        const y = rand() * h * 0.7
        ctx.fillStyle = `rgba(255,255,255,${0.4 + rand() * 0.6})`
        ctx.fillRect(rand() * w, y, rand() < 0.15 ? 2 : 1, rand() < 0.15 ? 2 : 1)
      }
    }
  })
}

/**
 * Bold procedural text banner (billboards, start gate, neon signs).
 */
export function textTexture(text, { w = 512, h = 128, bg = '#1e2a44', fg = '#ffffff', stroke = '#000000', accent = null, font = 'Impact, "Arial Black", "Helvetica Neue", sans-serif', glow = 0 } = {}) {
  return tex(w, h, (ctx) => {
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)
    if (accent) {
      ctx.fillStyle = accent
      ctx.fillRect(0, 0, w, h * 0.08)
      ctx.fillRect(0, h * 0.92, w, h * 0.08)
    }
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    let size = Math.floor(h * 0.7)
    ctx.font = `bold ${size}px ${font}`
    while (ctx.measureText(text).width > w * 0.9 && size > 10) { size -= 4; ctx.font = `bold ${size}px ${font}` }
    if (glow > 0) { ctx.shadowColor = fg; ctx.shadowBlur = glow }
    ctx.lineWidth = Math.max(2, size * 0.08)
    ctx.strokeStyle = stroke
    ctx.strokeText(text, w / 2, h / 2)
    ctx.fillStyle = fg
    ctx.fillText(text, w / 2, h / 2)
  })
}

/** Glowing chevron strip for boost pads (v scrolls along the pad). */
export function chevronTexture(color = '#ffcc33', bg = '#1d2b6b') {
  return tex(128, 128, (ctx, w, h) => {
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = color
    for (let i = 0; i < 2; i++) {
      const y0 = i * (h / 2)
      ctx.beginPath()
      ctx.moveTo(0, y0 + h * 0.05)
      ctx.lineTo(w / 2, y0 + h * 0.3)
      ctx.lineTo(w, y0 + h * 0.05)
      ctx.lineTo(w, y0 + h * 0.25)
      ctx.lineTo(w / 2, y0 + h * 0.5)
      ctx.lineTo(0, y0 + h * 0.25)
      ctx.closePath()
      ctx.fill()
    }
  })
}

/** Glowing lava: bright cracks over dark crust. */
export function lavaTexture() {
  return tex(256, 256, (ctx, w, h) => {
    const rand = mulberry32(5)
    ctx.fillStyle = '#ff6a00'
    ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < 70; i++) {
      const r = 8 + rand() * 26
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r)
      g.addColorStop(0, '#ffe680')
      g.addColorStop(0.5, '#ff9a1f')
      g.addColorStop(1, 'rgba(255,90,0,0)')
      ctx.save(); ctx.translate(rand() * w, rand() * h); ctx.fillStyle = g
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.restore()
    }
    ctx.fillStyle = 'rgba(60,20,10,0.85)'
    for (let i = 0; i < 40; i++) {
      ctx.beginPath()
      const x = rand() * w, y = rand() * h, r = 6 + rand() * 18
      ctx.moveTo(x + r, y)
      for (let k = 1; k < 7; k++) { const a = (k / 7) * Math.PI * 2; const rr = r * (0.6 + rand() * 0.6); ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) }
      ctx.closePath(); ctx.fill()
    }
  })
}

/** Sea surface: blue with foam streaks (scrolled in update). */
export function waterTexture() {
  return tex(256, 256, (ctx, w, h) => {
    const rand = mulberry32(11)
    ctx.fillStyle = '#2f9fe0'
    ctx.fillRect(0, 0, w, h)
    speckle(ctx, w, h, 900, ['#3badf0', '#2a90d0', '#48bbf7'], rand, 3, 10)
    ctx.strokeStyle = 'rgba(255,255,255,0.75)'
    ctx.lineWidth = 3
    for (let i = 0; i < 26; i++) {
      const x = rand() * w, y = rand() * h
      ctx.beginPath(); ctx.moveTo(x, y)
      ctx.bezierCurveTo(x + 15, y - 6, x + 30, y + 6, x + 45 + rand() * 20, y)
      ctx.stroke()
    }
  })
}

/** Night-city facade: dark building with randomly lit windows (also used as emissive map). */
export function windowsTexture(seed = 1, tint = '#ffd27a') {
  return tex(128, 256, (ctx, w, h) => {
    const rand = mulberry32(seed)
    ctx.fillStyle = '#0b0f1e'
    ctx.fillRect(0, 0, w, h)
    const cols = 6, rows = 14, cw = w / cols, rh = h / rows
    const palette = [tint, '#8be9fd', '#ff79c6', '#fff6d0', '#9cffb0']
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      if (rand() < 0.42) {
        ctx.fillStyle = rand() < 0.75 ? tint : palette[Math.floor(rand() * palette.length)]
        ctx.globalAlpha = 0.6 + rand() * 0.4
        ctx.fillRect(x * cw + cw * 0.2, y * rh + rh * 0.2, cw * 0.6, rh * 0.55)
      }
    }
    ctx.globalAlpha = 1
  })
}

/** Simple striped flag (pennant) texture. */
export function flagTexture(a = '#ff3355', b = '#ffffff') {
  return tex(64, 64, (ctx, w, h) => {
    ctx.fillStyle = a
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = b
    ctx.fillRect(0, h * 0.35, w, h * 0.3)
    ctx.fillStyle = 'rgba(0,0,0,0.15)'
    ctx.fillRect(0, 0, 4, h)
  })
}

/** White picket fence on a transparent background (use alphaTest). Tiles along v. */
export function fenceTexture(color = '#ffffff', rail = '#ff5a36') {
  return tex(128, 256, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h)
    // u = height (0 bottom → 1 top), v = along the fence
    ctx.fillStyle = rail
    ctx.fillRect(w * 0.55, 0, w * 0.12, h)
    ctx.fillStyle = color
    ctx.fillRect(w * 0.25, 0, w * 0.1, h)
    for (let i = 0; i < 4; i++) {
      const y = i * (h / 4)
      ctx.fillRect(w * 0.05, y + 6, w * 0.8, 14)
      ctx.beginPath(); ctx.moveTo(w * 0.85, y + 6); ctx.lineTo(w * 0.97, y + 13); ctx.lineTo(w * 0.85, y + 20); ctx.closePath(); ctx.fill()
    }
  })
}

/** Dark barrier with a bright neon stripe near the top (used as map + emissiveMap). */
export function neonBarrierTexture(stripe = '#37f5ff', body = '#12141f') {
  return tex(64, 64, (ctx, w, h) => {
    ctx.fillStyle = body
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = 'rgba(255,255,255,0.05)'
    for (let i = 0; i < 8; i++) ctx.fillRect(i * 8, 0, 4, h)
    ctx.fillStyle = stripe
    ctx.fillRect(w * 0.78, 0, w * 0.12, h)
    ctx.fillStyle = 'rgba(255,255,255,0.35)'
    ctx.fillRect(w * 0.1, 0, w * 0.03, h)
  })
}

/** Angry crusher face. */
export function crusherFaceTexture() {
  return tex(128, 128, (ctx, w, h) => {
    ctx.fillStyle = '#5a4f5c'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#1a1418'
    ctx.beginPath(); ctx.moveTo(18, 30); ctx.lineTo(56, 44); ctx.lineTo(18, 54); ctx.closePath(); ctx.fill()
    ctx.beginPath(); ctx.moveTo(110, 30); ctx.lineTo(72, 44); ctx.lineTo(110, 54); ctx.closePath(); ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(24, 40, 12, 8); ctx.fillRect(92, 40, 12, 8)
    ctx.fillStyle = '#1a1418'
    ctx.beginPath(); ctx.moveTo(30, 96); ctx.lineTo(64, 78); ctx.lineTo(98, 96); ctx.lineTo(64, 92); ctx.closePath(); ctx.fill()
  })
}

/** Stone block wall for the fortress. */
export function stoneTexture(base = '#4d4249', mortar = '#2a2226') {
  return tex(256, 256, (ctx, w, h) => {
    const rand = mulberry32(21)
    ctx.fillStyle = mortar
    ctx.fillRect(0, 0, w, h)
    const rows = 6, bh = h / rows
    for (let r = 0; r < rows; r++) {
      const off = (r % 2) * 32
      for (let x = -64; x < w; x += 64) {
        const shade = 0.85 + rand() * 0.3
        ctx.fillStyle = shadeHex(base, shade)
        ctx.fillRect(x + off + 3, r * bh + 3, 58, bh - 6)
      }
    }
  })
}

function shadeHex(hex, f) {
  const c = new THREE.Color(hex)
  c.r = Math.min(1, c.r * f); c.g = Math.min(1, c.g * f); c.b = Math.min(1, c.b * f)
  return '#' + c.getHexString()
}
