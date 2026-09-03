// Procedural 64×64 canvas icons for every item in ITEMS. Cached as data URLs.
import { ITEMS } from '../core/constants.js'

const SIZE = 64
const NAVY = '#1b1f3b'
const urlCache = new Map()
const canvasCache = new Map()

const TRIPLE_BASE = {
  triple_mushroom: 'mushroom',
  triple_banana: 'banana',
  triple_green: 'green_shell',
}

/** Base (single) item id for a triple id; identity otherwise. */
export function baseItemId(id) {
  return TRIPLE_BASE[id] || id
}

function outline(ctx, w = 3) {
  ctx.lineWidth = w
  ctx.strokeStyle = NAVY
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.stroke()
}

function roundRect(ctx, x, y, w, hgt, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + hgt, r)
  ctx.arcTo(x + w, y + hgt, x, y + hgt, r)
  ctx.arcTo(x, y + hgt, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function eyes(ctx, x1, x2, y, r = 2.2) {
  ctx.fillStyle = NAVY
  for (const x of [x1, x2]) {
    ctx.beginPath()
    ctx.ellipse(x, y, r, r * 1.5, 0, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawMushroom(ctx) {
  // stem
  roundRect(ctx, 21, 30, 22, 22, 8)
  ctx.fillStyle = '#ffe9c9'
  ctx.fill()
  outline(ctx)
  eyes(ctx, 28, 36, 40)
  // cap
  ctx.beginPath()
  ctx.moveTo(8, 33)
  ctx.bezierCurveTo(6, 6, 58, 6, 56, 33)
  ctx.quadraticCurveTo(32, 40, 8, 33)
  ctx.closePath()
  ctx.fillStyle = '#ff4757'
  ctx.fill()
  outline(ctx)
  ctx.fillStyle = '#fff'
  for (const [x, y, r] of [[20, 22, 5], [34, 14, 6], [47, 25, 4.5]]) {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawBanana(ctx) {
  ctx.beginPath()
  ctx.moveTo(16, 12)
  ctx.bezierCurveTo(4, 40, 24, 60, 54, 48)
  ctx.bezierCurveTo(58, 46, 58, 42, 54, 42)
  ctx.bezierCurveTo(30, 50, 20, 34, 22, 14)
  ctx.closePath()
  ctx.fillStyle = '#ffd93d'
  ctx.fill()
  outline(ctx)
  // highlight
  ctx.beginPath()
  ctx.moveTo(14, 26)
  ctx.bezierCurveTo(14, 42, 26, 52, 40, 52)
  ctx.strokeStyle = 'rgba(255,255,255,.65)'
  ctx.lineWidth = 3
  ctx.stroke()
  // tips
  ctx.fillStyle = '#7a4a1e'
  ctx.beginPath()
  ctx.ellipse(19, 12, 4, 3, -0.6, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(55, 45, 3.5, 3, 0.3, 0, Math.PI * 2)
  ctx.fill()
}

function drawShell(ctx, color, spot) {
  // rim
  roundRect(ctx, 6, 36, 52, 14, 7)
  ctx.fillStyle = '#fff2cc'
  ctx.fill()
  outline(ctx)
  // dome
  ctx.beginPath()
  ctx.moveTo(8, 38)
  ctx.bezierCurveTo(8, 8, 56, 8, 56, 38)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
  outline(ctx)
  // plates
  ctx.fillStyle = spot
  for (const [x, y, r] of [[22, 28, 5.5], [32, 18, 6], [43, 28, 5.5]]) {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.lineWidth = 2
    ctx.strokeStyle = NAVY
    ctx.stroke()
  }
}

function drawStar(ctx) {
  const cx = 32, cy = 33, R = 27, r = 12.5
  ctx.beginPath()
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    const rad = i % 2 === 0 ? R : r
    ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad)
  }
  ctx.closePath()
  ctx.fillStyle = '#ffe066'
  ctx.fill()
  outline(ctx)
  eyes(ctx, 27, 37, 31, 2)
}

function drawLightning(ctx) {
  ctx.beginPath()
  const pts = [[38, 3], [14, 36], [29, 36], [22, 61], [50, 25], [35, 25], [46, 3]]
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
  ctx.closePath()
  ctx.lineWidth = 7
  ctx.strokeStyle = '#ffe066'
  ctx.lineJoin = 'round'
  ctx.stroke()
  const g = ctx.createLinearGradient(0, 0, 0, 64)
  g.addColorStop(0, '#dff2ff')
  g.addColorStop(1, '#3ec1ff')
  ctx.fillStyle = g
  ctx.fill()
  outline(ctx, 2.5)
}

function drawBobOmb(ctx) {
  // feet
  ctx.fillStyle = '#ff9f1a'
  for (const x of [22, 42]) {
    ctx.beginPath()
    ctx.ellipse(x, 57, 8, 4.5, 0, 0, Math.PI * 2)
    ctx.fill()
    outline(ctx, 2.5)
  }
  // body
  ctx.beginPath()
  ctx.arc(32, 36, 21, 0, Math.PI * 2)
  const g = ctx.createRadialGradient(24, 28, 4, 32, 36, 22)
  g.addColorStop(0, '#5a6480')
  g.addColorStop(1, '#232838')
  ctx.fillStyle = g
  ctx.fill()
  outline(ctx)
  // key/wind-up on the side
  roundRect(ctx, 48, 30, 10, 8, 2)
  ctx.fillStyle = '#ffd93d'
  ctx.fill()
  outline(ctx, 2)
  // fuse
  roundRect(ctx, 27, 8, 10, 10, 3)
  ctx.fillStyle = '#ffd93d'
  ctx.fill()
  outline(ctx, 2.5)
  ctx.beginPath()
  ctx.moveTo(32, 8)
  ctx.quadraticCurveTo(38, 2, 44, 6)
  ctx.lineWidth = 2.5
  ctx.strokeStyle = NAVY
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(45, 6, 4, 0, Math.PI * 2)
  ctx.fillStyle = '#ff9f1a'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(45, 6, 2, 0, Math.PI * 2)
  ctx.fillStyle = '#ffe066'
  ctx.fill()
  // eyes
  ctx.fillStyle = '#fff'
  for (const x of [25, 39]) {
    ctx.beginPath()
    ctx.ellipse(x, 34, 4, 5.5, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  eyes(ctx, 26, 40, 35, 1.8)
}

function drawFakeBox(ctx) {
  // cube: front + top + side
  const f = [[14, 22], [42, 22], [42, 50], [14, 50]]
  const t = [[14, 22], [24, 12], [52, 12], [42, 22]]
  const s = [[42, 22], [52, 12], [52, 40], [42, 50]]
  const poly = (p, fill) => {
    ctx.beginPath()
    p.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
    ctx.closePath()
    ctx.fillStyle = fill
    ctx.fill()
    ctx.lineWidth = 3
    ctx.strokeStyle = '#c84bff'
    ctx.lineJoin = 'round'
    ctx.stroke()
  }
  poly(t, 'rgba(255,90,140,.75)')
  poly(s, 'rgba(200,75,255,.75)')
  poly(f, 'rgba(255,71,87,.8)')
  ctx.font = 'bold 26px "Luckiest Guy", "Arial Black", Impact, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.lineWidth = 4
  ctx.strokeStyle = NAVY
  ctx.strokeText('?', 28, 37)
  ctx.fillStyle = '#fff'
  ctx.fillText('?', 28, 37)
}

function drawUnknown(ctx, color) {
  ctx.beginPath()
  ctx.arc(32, 32, 24, 0, Math.PI * 2)
  ctx.fillStyle = color || '#9aa3b5'
  ctx.fill()
  outline(ctx)
  ctx.font = 'bold 28px "Luckiest Guy", "Arial Black", Impact, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#fff'
  ctx.fillText('?', 32, 34)
}

function drawBadge(ctx, text) {
  ctx.beginPath()
  ctx.arc(50, 50, 12, 0, Math.PI * 2)
  ctx.fillStyle = '#fff'
  ctx.fill()
  outline(ctx, 3)
  ctx.font = 'bold 13px "Nunito", "Arial Black", Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = NAVY
  ctx.fillText(text, 50, 51)
}

/**
 * Draw the icon for `id` into `ctx` at the given pixel size (origin 0,0).
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} id item id from ITEMS
 * @param {number} size pixel size (square)
 * @param {{badge?: boolean}} [opts]
 */
export function drawItemIcon(ctx, id, size = SIZE, opts = {}) {
  ctx.save()
  ctx.scale(size / SIZE, size / SIZE)
  const base = baseItemId(id)
  switch (base) {
    case 'mushroom': drawMushroom(ctx); break
    case 'banana': drawBanana(ctx); break
    case 'green_shell': drawShell(ctx, '#3ddc84', '#b5f5cf'); break
    case 'red_shell': drawShell(ctx, '#ff3b3b', '#ffb3b3'); break
    case 'star': drawStar(ctx); break
    case 'lightning': drawLightning(ctx); break
    case 'bob_omb': drawBobOmb(ctx); break
    case 'fake_box': drawFakeBox(ctx); break
    default: drawUnknown(ctx, ITEMS[id]?.color)
  }
  const isTriple = base !== id || (ITEMS[id]?.count ?? 1) > 1
  if (isTriple && opts.badge !== false) drawBadge(ctx, '×3')
  ctx.restore()
}

/** Returns a cached 64×64 canvas for the item. */
export function itemIconCanvas(id, opts = {}) {
  const key = id + (opts.badge === false ? ':nobadge' : '')
  let c = canvasCache.get(key)
  if (!c) {
    c = document.createElement('canvas')
    c.width = SIZE
    c.height = SIZE
    drawItemIcon(c.getContext('2d'), id, SIZE, opts)
    canvasCache.set(key, c)
  }
  return c
}

/** Cached PNG data URL for an item icon (64×64). */
export function itemIconDataUrl(id, opts = {}) {
  const key = id + (opts.badge === false ? ':nobadge' : '')
  let url = urlCache.get(key)
  if (!url) {
    url = itemIconCanvas(id, opts).toDataURL('image/png')
    urlCache.set(key, url)
  }
  return url
}
