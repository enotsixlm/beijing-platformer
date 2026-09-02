// Small DOM / colour helpers shared by the UI module.

/**
 * Create an element. `attrs` supports: class, text, html, style (object), dataset (object),
 * attrs (object of raw attributes) and any `on<Event>` handler (e.g. onClick).
 */
export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null) continue
    if (k === 'class') el.className = v
    else if (k === 'text') el.textContent = v
    else if (k === 'html') el.innerHTML = v
    else if (k === 'style') setStyle(el, v)
    else if (k === 'dataset') Object.assign(el.dataset, v)
    else if (k === 'attrs') for (const [a, b] of Object.entries(v)) el.setAttribute(a, b)
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v)
    else el.setAttribute(k, v)
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue
    el.append(c instanceof Node ? c : document.createTextNode(String(c)))
  }
  return el
}

/** Assign styles; supports custom properties (`--foo`). */
export function setStyle(el, styles) {
  for (const [k, v] of Object.entries(styles)) {
    if (k.startsWith('--')) el.style.setProperty(k, String(v))
    else el.style[k] = v
  }
}

export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)

export function ordinal(n) {
  n = Math.max(1, Math.round(n || 1))
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return { n, suffix: s[(v - 20) % 10] || s[v] || s[0] }
}

export function hexToRgb(hex) {
  let s = String(hex || '#888888').replace('#', '')
  if (s.length === 3) s = s.split('').map((c) => c + c).join('')
  const n = parseInt(s.slice(0, 6), 16)
  if (Number.isNaN(n)) return [136, 136, 136]
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function rgbToHex([r, g, b]) {
  return '#' + [r, g, b].map((x) => clamp(Math.round(x), 0, 255).toString(16).padStart(2, '0')).join('')
}

/** Mix a colour toward white (amt 0..1). */
export function tint(hex, amt) {
  return rgbToHex(hexToRgb(hex).map((c) => c + (255 - c) * amt))
}

/** Mix a colour toward black (amt 0..1). */
export function shade(hex, amt) {
  return rgbToHex(hexToRgb(hex).map((c) => c * (1 - amt)))
}

export function rgba(hex, a) {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r},${g},${b},${a})`
}

/** Restart a CSS animation on an element by toggling a class. */
export function replay(el, cls) {
  el.classList.remove(cls)
  // eslint-disable-next-line no-unused-expressions
  void el.offsetWidth
  el.classList.add(cls)
}

export function safeStorageGet(key) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : null
  } catch {
    return null
  }
}

export function safeStorageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore quota / privacy errors */
  }
}

// ── inline SVG icons (no emoji anywhere) ──────────────────────────────────────

const ICONS = {
  speaker: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 12h6l7-6v20l-7-6H4z" fill="currentColor"/><path d="M20 11c2.5 2.5 2.5 7.5 0 10M24 7c5 5 5 13 0 18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`,
  speakerOff: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 12h6l7-6v20l-7-6H4z" fill="currentColor"/><path d="M21 12l8 8M29 12l-8 8" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/></svg>`,
  pause: `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="7" y="6" width="7" height="20" rx="2" fill="currentColor"/><rect x="18" y="6" width="7" height="20" rx="2" fill="currentColor"/></svg>`,
  flag: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 4v25" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><path d="M9 5h16l-4 6 4 6H9z" fill="currentColor"/></svg>`,
  star: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3l3.9 8.3 9.1 1.1-6.7 6.3 1.8 9L16 23.3 7.9 27.7l1.8-9L3 12.4l9.1-1.1z" fill="currentColor"/></svg>`,
  arrowL: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M20 5L9 16l11 11" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  arrowR: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M12 5l11 11-11 11" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  eye: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M2 16s5-9 14-9 14 9 14 9-5 9-14 9S2 16 2 16z" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="16" cy="16" r="4.5" fill="currentColor"/></svg>`,
  trophy: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M9 4h14v7a7 7 0 0 1-14 0z" fill="currentColor"/><path d="M9 6H4v2a5 5 0 0 0 5 5M23 6h5v2a5 5 0 0 1-5 5" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M13 18h6v4h3v4H10v-4h3z" fill="currentColor"/></svg>`,
  bolt: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M18 2L7 18h8l-2 12 12-17h-8z" fill="currentColor"/></svg>`,
}

export function svg(name) {
  return ICONS[name] || ''
}
