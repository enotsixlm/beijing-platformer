import * as THREE from 'three'
import { GAMES } from './catalog.js'

export const BASE = import.meta.env.BASE_URL || '/'

export { THREE, GAMES }

export function hubUrl() {
  return '#/'
}

export function bootGame(id, extra = {}) {
  const meta = GAMES.find((g) => g.id === id)
  const renderer = extra.renderer || new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.shadowMap.enabled = extra.shadows !== false
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.domElement.id = 'game'
  document.body.prepend(renderer.domElement)

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(extra.bg ?? 0x10182c)
  if (extra.fog) scene.fog = extra.fog

  const camera = extra.camera || new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.08, extra.far ?? 400)
  if (extra.camPos) camera.position.set(...extra.camPos)
  if (extra.lookAt) camera.lookAt(...extra.lookAt)

  const hemi = new THREE.HemisphereLight(0xdde7ff, 0x223344, extra.hemi ?? 1.05)
  scene.add(hemi)
  const sun = new THREE.DirectionalLight(0xfff3d6, extra.sun ?? 1.35)
  sun.position.set(18, 28, 12)
  sun.castShadow = true
  sun.shadow.mapSize.set(1024, 1024)
  const sc = extra.shadowCam ?? 40
  sun.shadow.camera.left = sun.shadow.camera.bottom = -sc
  sun.shadow.camera.right = sun.shadow.camera.top = sc
  scene.add(sun, sun.target)

  const hud = mountHUD(meta, extra.hint || meta?.hint)

  const input = createInput(renderer.domElement)
  const onResize = () => {
    const w = innerWidth, h = innerHeight
    renderer.setSize(w, h)
    if (camera.isPerspectiveCamera) {
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    } else if (camera.isOrthographicCamera) {
      const s = camera.userData.orthoSize || 12
      const a = w / h
      camera.left = -s * a; camera.right = s * a
      camera.top = s; camera.bottom = -s
      camera.updateProjectionMatrix()
    }
    extra.onResize?.(w, h)
  }
  window.addEventListener('resize', onResize)

  let raf = 0, last = performance.now(), alive = true
  function loop(tick) {
    const step = (now) => {
      if (!alive) return
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      tick(dt, now)
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
  }

  function destroy() {
    alive = false
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', onResize)
    document.exitPointerLock?.()
    input.destroy()
    hud.destroy()
    document.querySelectorAll('.ui-panel, .vjoy-base, .vjoy-knob, .vjump, .hand').forEach((n) => n.remove())
    renderer.dispose()
    renderer.domElement.remove()
  }

  return { THREE, scene, camera, renderer, sun, input, hud, loop, destroy, meta }
}

/** Convenience wrapper: setup(), then loop update/render until the player goes back to the hub. */
export function run(id, extra, setup) {
  const app = bootGame(id, extra)
  const state = setup(app) || {}
  app.loop((dt, now) => {
    state.update?.(dt, now)
    if (!extra.manualRender) app.renderer.render(app.scene, app.camera)
    app.input.endFrame()
  })
  return () => {
    state.cleanup?.()
    app.destroy()
  }
}

export function orthoCamera(size = 12, y = 22) {
  const a = innerWidth / innerHeight
  const cam = new THREE.OrthographicCamera(-size * a, size * a, size, -size, 0.1, 200)
  cam.position.set(0, y, 0.001)
  cam.lookAt(0, 0, 0)
  cam.userData.orthoSize = size
  return cam
}

export function mountHUD(meta, hint) {
  const back = document.createElement('a')
  back.className = 'back'
  back.href = hubUrl()
  back.textContent = '← 评测目录'
  document.body.append(back)

  const title = el('div', 'hud', 'titlebar', `${meta?.num || ''} · ${meta?.title || ''}`)
  const hintbar = el('div', 'hud', 'hintbar', hint || '')
  const stats = el('div', 'hud', 'stats', '')
  const toast = el('div', 'hud', 'toast', '')
  const overlay = el('div', '', 'overlay', '')
  overlay.innerHTML = '<h1></h1><p></p>'
  document.body.append(title, hintbar, stats, toast, overlay)

  return {
    title, hintbar, stats, toast, overlay, back,
    setStats(t) { stats.textContent = t },
    setHint(t) { hintbar.textContent = t },
    flash(text, ms = 900) {
      toast.textContent = text
      toast.style.opacity = '1'
      clearTimeout(toast._t)
      toast._t = setTimeout(() => { toast.style.opacity = '0' }, ms)
    },
    showOverlay(h, p = '') {
      overlay.classList.add('show')
      overlay.querySelector('h1').textContent = h
      overlay.querySelector('p').textContent = p
    },
    hideOverlay() { overlay.classList.remove('show') },
    destroy() {
      for (const n of [back, title, hintbar, stats, toast, overlay]) n.remove()
    },
  }
}

function el(tag, cls, id, text) {
  const n = document.createElement(tag)
  if (cls) n.className = cls
  if (id) n.id = id
  if (text) n.textContent = text
  return n
}

export function createInput(dom) {
  const keys = new Set()
  const mouse = {
    x: 0, y: 0, ndc: new THREE.Vector2(),
    down: false, justDown: false, justUp: false,
    right: false, justRight: false, justRightUp: false,
    dx: 0, dy: 0, wheel: 0,
  }
  const pressed = new Set()
  const released = new Set()

  const onKeyDown = (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault()
    if (!e.repeat) { keys.add(e.code); pressed.add(e.code) }
  }
  const onKeyUp = (e) => { keys.delete(e.code); released.add(e.code) }
  const onMove = (e) => {
    mouse.x = e.clientX; mouse.y = e.clientY
    mouse.ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1)
    mouse.dx += e.movementX || 0
    mouse.dy += e.movementY || 0
  }
  const onDown = (e) => {
    if (e.button === 0) { mouse.down = true; mouse.justDown = true }
    if (e.button === 2) { mouse.right = true; mouse.justRight = true }
  }
  const onUp = (e) => {
    if (e.button === 0) { mouse.down = false; mouse.justUp = true }
    if (e.button === 2) { mouse.right = false; mouse.justRightUp = true }
  }
  const onWheel = (e) => { mouse.wheel += Math.sign(e.deltaY) }
  const onCtx = (e) => e.preventDefault()
  const onBlur = () => keys.clear()

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mousedown', onDown)
  window.addEventListener('mouseup', onUp)
  window.addEventListener('wheel', onWheel, { passive: true })
  window.addEventListener('contextmenu', onCtx)
  window.addEventListener('blur', onBlur)

  return {
    keys, mouse, pressed, released,
    down: (code) => keys.has(code),
    hit: (code) => pressed.has(code),
    shift: () => keys.has('ShiftLeft') || keys.has('ShiftRight'),
    ctrl: () => keys.has('ControlLeft') || keys.has('ControlRight'),
    axis() {
      const x = (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0)
      const z = (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0) - (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0)
      return { x, z }
    },
    wasd() {
      const x = (keys.has('KeyD') ? 1 : 0) - (keys.has('KeyA') ? 1 : 0)
      const z = (keys.has('KeyS') ? 1 : 0) - (keys.has('KeyW') ? 1 : 0)
      return { x, z }
    },
    arrows() {
      const x = (keys.has('ArrowRight') ? 1 : 0) - (keys.has('ArrowLeft') ? 1 : 0)
      const z = (keys.has('ArrowDown') ? 1 : 0) - (keys.has('ArrowUp') ? 1 : 0)
      return { x, z }
    },
    endFrame() {
      mouse.justDown = false
      mouse.justUp = false
      mouse.justRight = false
      mouse.justRightUp = false
      mouse.dx = 0; mouse.dy = 0; mouse.wheel = 0
      pressed.clear(); released.clear()
    },
    destroy() {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('contextmenu', onCtx)
      window.removeEventListener('blur', onBlur)
    },
  }
}

export function box(scene, { w = 1, h = 1, d = 1, color = 0x8899bb, x = 0, y = 0, z = 0, y0 = false, metal = 0, rough = 0.7, receive = true, cast = true } = {}) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({ color, metalness: metal, roughness: rough }),
  )
  mesh.position.set(x, y0 ? y + h / 2 : y, z)
  mesh.castShadow = cast
  mesh.receiveShadow = receive
  mesh.userData.size = { w, h, d }
  scene.add(mesh)
  return mesh
}

export function ground(scene, { s = 40, color = 0x3d5a40, y = 0 } = {}) {
  return box(scene, { w: s, h: 0.4, d: s, color, x: 0, y, z: 0, y0: true, receive: true, cast: false })
}

export function walls(scene, s = 40, h = 3, t = 0.5, color = 0x445566) {
  const half = s / 2
  return [
    box(scene, { w: s, h, d: t, color, x: 0, y: 0, z: -half, y0: true }),
    box(scene, { w: s, h, d: t, color, x: 0, y: 0, z: half, y0: true }),
    box(scene, { w: t, h, d: s, color, x: -half, y: 0, z: 0, y0: true }),
    box(scene, { w: t, h, d: s, color, x: half, y: 0, z: 0, y0: true }),
  ]
}

export function makeLabel(text, { color = '#fff', size = 64, scale = 2.2 } = {}) {
  const c = document.createElement('canvas')
  c.width = 256; c.height = 64
  const g = c.getContext('2d')
  g.fillStyle = 'rgba(0,0,0,0.45)'
  roundRect(g, 8, 8, 240, 48, 10); g.fill()
  g.fillStyle = color
  g.font = `bold ${size * 0.42}px sans-serif`
  g.textAlign = 'center'; g.textBaseline = 'middle'
  g.fillText(text, 128, 34)
  const tex = new THREE.CanvasTexture(c)
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false })
  const spr = new THREE.Sprite(mat)
  spr.scale.set(scale, scale * 0.25, 1)
  return spr
}

function roundRect(g, x, y, w, h, r) {
  g.beginPath()
  g.moveTo(x + r, y)
  g.arcTo(x + w, y, x + w, y + h, r)
  g.arcTo(x + w, y + h, x, y + h, r)
  g.arcTo(x, y + h, x, y, r)
  g.arcTo(x, y, x + w, y, r)
  g.closePath()
}

export const raycaster = new THREE.Raycaster()
export function pick(camera, ndc, objects) {
  raycaster.setFromCamera(ndc, camera)
  const hits = raycaster.intersectObjects(objects, true)
  return hits[0] || null
}

export function clamp(v, a, b) { return Math.max(a, Math.min(b, v)) }
export function lerp(a, b, t) { return a + (b - a) * t }
export function len2(x, z) { return Math.hypot(x, z) }
export function norm2(x, z) {
  const l = Math.hypot(x, z) || 1
  return { x: x / l, z: z / l }
}

export function moveXZ(mesh, vx, vz, dt, speed, bounds) {
  let x = mesh.position.x + vx * speed * dt
  let z = mesh.position.z + vz * speed * dt
  if (bounds) {
    x = clamp(x, -bounds, bounds)
    z = clamp(z, -bounds, bounds)
  }
  mesh.position.x = x
  mesh.position.z = z
}

export function lookXZ(mesh, dx, dz) {
  if (Math.abs(dx) + Math.abs(dz) > 0.01) mesh.rotation.y = Math.atan2(dx, dz)
}

export function aabbOverlap(a, b) {
  return Math.abs(a.x - b.x) * 2 < a.w + b.w
    && Math.abs(a.y - b.y) * 2 < a.h + b.h
    && Math.abs(a.z - b.z) * 2 < a.d + b.d
}

export function bodyOf(mesh) {
  const s = mesh.userData.size || { w: 1, h: 1, d: 1 }
  return { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z, ...s }
}

export function seedRand(seed) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

export function panel(html, style = '') {
  const n = document.createElement('div')
  n.className = 'ui-panel'
  n.style.cssText = style
  n.innerHTML = html
  document.body.append(n)
  return n
}
