import * as THREE from 'three'
import { buildLevel, igniteLobby, updateCrumbles, updateBoxes, floorIndex, C } from './level.js'
import { createRunnerMesh, createPlayerState, stepPlayer, syncRunnerMesh } from './player.js'
import { createLava, syncLava } from './lava.js'
import { stepCpu, cpuName } from './ai.js'

const PHYS_DT = 1 / 120
const COUNTDOWN = 5
const LAVA_SPEED = 0.34

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.92
renderer.domElement.id = 'game'
document.body.prepend(renderer.domElement)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x0c0708)
scene.fog = new THREE.FogExp2(0x1a0a08, 0.028)

const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.12, 120)

const hemi = new THREE.HemisphereLight(0x7ec8e8, 0x4a1808, 0.55)
scene.add(hemi)
const fill = new THREE.DirectionalLight(0x9ad8ff, 0.35)
fill.position.set(4, 18, 6)
fill.castShadow = true
fill.shadow.mapSize.set(1024, 1024)
fill.shadow.camera.near = 1
fill.shadow.camera.far = 50
fill.shadow.camera.left = -10
fill.shadow.camera.right = 10
fill.shadow.camera.top = 10
fill.shadow.camera.bottom = -10
scene.add(fill, fill.target)

const emergency = new THREE.PointLight(0x7ad7ff, 2.4, 16, 1.8)
emergency.position.set(0, 2.4, C.WELL_D / 2 + 1)
scene.add(emergency)
const emergency2 = new THREE.PointLight(0x7ad7ff, 1.6, 14, 1.8)
emergency2.position.set(0, C.FLOOR_H * 3 + 2.2, 0)
scene.add(emergency2)
const exitLight = new THREE.PointLight(0x3dff8a, 2.2, 10, 2)
exitLight.position.set(0, C.ROOF_Y + 1.8, -C.WELL_D / 2 + 1)
scene.add(exitLight)

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

const level = buildLevel(scene)
const lava = createLava(scene, {
  x: 0,
  z: C.LOBBY_EXT / 2,
  w: C.WELL_W - 0.15,
  d: C.WELL_D + C.LOBBY_EXT - 0.15,
})

const players = []
const meshes = []

function spawnRoster(count) {
  while (players.length) {
    const m = meshes.pop()
    if (m) scene.remove(m.group)
    players.pop()
  }
  const n = Math.max(1, Math.min(8, count))
  for (let i = 0; i < n; i++) {
    const s = level.spawns[i]
    const p = createPlayerState(s.x, s.y, s.z, i)
    p.cpu = i > 0
    p.wp = 0
    players.push(p)
    const mesh = createRunnerMesh(i)
    scene.add(mesh.group)
    meshes.push(mesh)
  }
}
spawnRoster(1)

let phase = 'ready'
let startT = 0
let countdownLeft = COUNTDOWN
let winTime = null
let frames = 0

const keys = new Set()
let jumpPressed = false
let camYaw = Math.PI
let camPitch = -0.22
const mouseSens = 0.0022

function initPointerLock() {
  renderer.domElement.addEventListener('click', () => {
    if (phase === 'ready') return
    renderer.domElement.requestPointerLock?.()
  })
  document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement !== renderer.domElement) return
    camYaw -= e.movementX * mouseSens
    camPitch -= e.movementY * mouseSens
    camPitch = Math.max(-1.15, Math.min(0.48, camPitch))
  })
}
initPointerLock()

window.addEventListener('keydown', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault()
  if (e.repeat) return
  keys.add(e.code)
  initAudio()
  if (e.code === 'Space') jumpPressed = true
  if (e.code === 'KeyR') {
    if (phase === 'win' || phase === 'dead') restartMatch(players.length)
  }
})
window.addEventListener('keyup', (e) => keys.delete(e.code))

function readHumanInput() {
  const f = (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) - (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0)
  const r = (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0)
  const fx = Math.sin(camYaw), fz = Math.cos(camYaw)
  const rx = Math.sin(camYaw - Math.PI / 2), rz = Math.cos(camYaw - Math.PI / 2)
  let x = fx * f + rx * r
  let z = fz * f + rz * r
  const len = Math.hypot(x, z)
  if (len > 1) { x /= len; z /= len }
  const jp = jumpPressed
  jumpPressed = false
  return { x, z, jumpPressed: jp }
}

function padInput() {
  const pads = navigator.getGamepads?.() || []
  const g = pads[0]
  if (!g) return null
  const ax = Math.abs(g.axes[0]) > 0.18 ? g.axes[0] : 0
  const az = Math.abs(g.axes[1]) > 0.18 ? g.axes[1] : 0
  const fx = Math.sin(camYaw), fz = Math.cos(camYaw)
  const rx = Math.sin(camYaw - Math.PI / 2), rz = Math.cos(camYaw - Math.PI / 2)
  let x = fx * -az + rx * ax
  let z = fz * -az + rz * ax
  const len = Math.hypot(x, z)
  if (len > 1) { x /= len; z /= len }
  const jump = g.buttons[0]?.pressed || g.buttons[1]?.pressed
  return { x, z, jumpPressed: jump && !g._jumpHeld, _pad: g }
}

window.__game = {
  ready: false,
  input: null,
  teleport(x, y, z, slot = 0) {
    const p = players[slot]
    if (!p) return
    p.pos.set(x, y, z)
    p.vx = p.vy = p.vz = 0
  },
  start(opts = {}) {
    const n = opts.players ?? 1
    beginMatch(n, opts)
  },
  setLava(y) { level.lavaY = y },
  ignite() { igniteLobby(level) },
  state() {
    const p = players[0]
    return {
      phase,
      pos: p ? { x: +p.pos.x.toFixed(2), y: +p.pos.y.toFixed(2), z: +p.pos.z.toFixed(2) } : null,
      grounded: p ? p.grounded : false,
      alive: p ? p.alive : false,
      lavaY: +level.lavaY.toFixed(2),
      floor: p ? floorIndex(p.pos.y) : 1,
      maxY: p ? +p.maxY.toFixed(2) : 0,
      countdown: +countdownLeft.toFixed(2),
      playerCount: players.length,
      crumbleActive: level.crumbles[0] ? level.crumbles[0].active !== false : null,
      frames,
      test: level.test,
    }
  },
}

let audio = null
function initAudio() {
  if (audio) return
  try { audio = new (window.AudioContext || window.webkitAudioContext)() } catch { /* silent */ }
}
function beep(freq, dur = 0.15, vol = 0.16, type = 'square') {
  if (!audio) return
  const o = audio.createOscillator()
  o.type = type
  o.frequency.value = freq
  const g = audio.createGain()
  g.gain.setValueAtTime(vol, audio.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + dur)
  o.connect(g).connect(audio.destination)
  o.start()
  o.stop(audio.currentTime + dur)
}
const sfx = {
  jump: () => beep(420, 0.1, 0.1, 'triangle'),
  double: () => beep(640, 0.1, 0.1, 'triangle'),
  tick: () => beep(880, 0.08, 0.12),
  go: () => { beep(220, 0.4, 0.2, 'sawtooth'); setTimeout(() => beep(330, 0.25, 0.14), 80) },
  crack: () => beep(140, 0.28, 0.18, 'sawtooth'),
  die: () => beep(110, 0.45, 0.22, 'sawtooth'),
  win: () => [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.22, 0.16), i * 130)),
}

const el = {
  overlay: document.getElementById('overlay'),
  countdown: document.getElementById('countdown'),
  time: document.getElementById('time'),
  floor: document.getElementById('floor'),
  lava: document.getElementById('lavaH'),
  toast: document.getElementById('toast'),
  ranks: document.getElementById('ranks'),
  barYou: document.getElementById('barYou'),
  barLava: document.getElementById('barLava'),
}

function fmt(ms) {
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  const t = Math.floor((ms % 1000) / 100)
  return `${m}:${String(s).padStart(2, '0')}.${t}`
}

let toastTimer = null
function toast(text) {
  el.toast.textContent = text
  el.toast.style.opacity = 1
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { el.toast.style.opacity = 0 }, 1600)
}

function beginMatch(count, opts = {}) {
  spawnRoster(count)
  phase = opts.immediate ? 'play' : 'countdown'
  startT = performance.now()
  countdownLeft = opts.immediate ? 0 : COUNTDOWN
  winTime = null
  level.lavaStarted = false
  level.lavaY = opts.lava ?? -1.1
  if (level.lobbyFloor) level.lobbyFloor.active = true
  if (level.wellFloor) level.wellFloor.active = true
  for (const c of level.crumbles) {
    c.active = true
    c.standTime = 0
    c.shaken = false
    if (c.mesh) {
      c.mesh.visible = true
      c.mesh.rotation.set(0, 0, 0)
      c.mesh.position.set((c.min.x + c.max.x) / 2, (c.min.y + c.max.y) / 2, (c.min.z + c.max.z) / 2)
    }
  }
  for (const b of level.boxes) {
    if (!b.home) {
      b.home = {
        min: b.min.clone(),
        max: b.max.clone(),
        x: b.mesh.position.x,
        y: b.min.y,
        z: b.mesh.position.z,
      }
    }
    b.active = true
    b.vx = b.vy = b.vz = 0
    b.min.copy(b.home.min)
    b.max.copy(b.home.max)
    if (b.mesh) {
      b.mesh.visible = true
      b.mesh.position.set((b.min.x + b.max.x) / 2, (b.min.y + b.max.y) / 2, (b.min.z + b.max.z) / 2)
    }
  }
  el.overlay.classList.add('hidden')
  el.countdown.classList.toggle('hidden', phase !== 'countdown')
  if (phase === 'play' && (opts.lava === undefined || opts.lava >= 0)) igniteLobby(level)
  try { renderer.domElement.requestPointerLock?.() } catch { /* headless */ }
}

function restartMatch(count) {
  beginMatch(count)
}

function ranking() {
  return [...players].sort((a, b) => {
    if (a.finishTime && b.finishTime) return a.finishTime - b.finishTime
    if (a.finishTime) return -1
    if (b.finishTime) return 1
    if (a.alive !== b.alive) return a.alive ? -1 : 1
    return b.maxY - a.maxY
  })
}

function renderRanks() {
  const rows = ranking().map((p, i) => {
    const tag = p.finishTime ? '门' : (p.alive ? `${floorIndex(p.pos.y)}F` : '熔')
    const me = p.slot === 0 ? ' me' : ''
    return `<div class="rk${me}">${i + 1}. ${cpuName(p.slot)} <span>${tag}</span></div>`
  })
  el.ranks.innerHTML = rows.join('')
}

function kill(p, reason) {
  if (!p.alive) return
  p.alive = false
  p.deadReason = reason
  p.vx = p.vy = p.vz = 0
  sfx.die()
  if (p.slot === 0) toast('被熔岩追上了')
  maybeEnd()
}

function markWin(p) {
  if (p.finishTime) return
  p.finishTime = performance.now() - startT
  if (phase !== 'win' && p.slot === 0) {
    phase = 'win'
    winTime = p.finishTime
    sfx.win()
    showEnd(true)
  } else if (phase !== 'win') {
    const humansLeft = players.filter((x) => x.alive && !x.cpu && !x.finishTime)
    if (!humansLeft.length && players.some((x) => x.finishTime)) {
      phase = 'win'
      showEnd(true)
    }
  }
}

function maybeEnd() {
  if (phase === 'win' || phase === 'ready') return
  const live = players.filter((p) => p.alive && !p.finishTime)
  if (live.length) return
  if (players.some((p) => p.finishTime)) {
    phase = 'win'
    showEnd(true)
  } else {
    phase = 'dead'
    showEnd(false)
  }
}

function showEnd(won) {
  document.exitPointerLock?.()
  const you = players[0]
  const board = ranking().map((p, i) => {
    const info = p.finishTime ? `抵达 ${fmt(p.finishTime)}` : `${floorIndex(p.maxY)}F · 高度 ${p.maxY.toFixed(1)}m`
    return `${i + 1}. ${cpuName(p.slot)} — ${info}`
  }).join('<br>')
  el.overlay.classList.remove('hidden')
  el.countdown.classList.add('hidden')
  el.overlay.innerHTML = won
    ? `<h1>安全门已到</h1><div class="sub">用时 ${fmt(winTime || you?.finishTime || 0)}<br>${board}</div><p class="blink">按 R 再逃一次</p>`
    : `<h1>熔岩追上了</h1><div class="sub">爬到 ${floorIndex(you?.maxY || 0)}F · 高度 ${(you?.maxY || 0).toFixed(1)}m<br>${board}</div><p class="blink">按 R 再逃一次</p>`
}

document.getElementById('btns')?.addEventListener('click', (e) => {
  const n = Number(e.target?.dataset?.n)
  if (n) {
    initAudio()
    beginMatch(n)
  }
})

let lastT = performance.now()
let acc = 0
const camPos = new THREE.Vector3(0, 2.4, C.WELL_D / 2 + 6)
const camLook = new THREE.Vector3()
let lastTick = 6
let lastCrack = 0

function frame(now) {
  requestAnimationFrame(frame)
  frames++
  const dt = Math.min((now - lastT) / 1000, 0.05)
  lastT = now

  emergency.intensity = 2.1 + Math.sin(now * 0.012) * 0.5 + (Math.random() < 0.01 ? -1.2 : 0)

  if (phase === 'countdown') {
    countdownLeft = Math.max(0, COUNTDOWN - (now - startT) / 1000)
    const sec = Math.ceil(countdownLeft)
    el.countdown.textContent = sec > 0 ? String(sec) : '逃!'
    if (sec !== lastTick && sec > 0) { sfx.tick(); lastTick = sec }
    if (countdownLeft <= 0) {
      phase = 'play'
      igniteLobby(level)
      sfx.go()
      toast('一楼已是熔岩')
      el.countdown.classList.add('hidden')
    }
  }

  if (phase === 'play' && level.lavaStarted) {
    level.lavaY += (LAVA_SPEED + Math.max(0, (now - startT) / 1000 - COUNTDOWN) * 0.003) * dt
    if (level.lavaY > C.ROOF_Y + 0.6) level.lavaY = C.ROOF_Y + 0.6
  }

  if (phase === 'countdown' || phase === 'play') {
    const human = window.__game.input
      ? { ...window.__game.input, jumpPressed: window.__game.input.jumpPressed }
      : readHumanInput()
    if (window.__game.input) window.__game.input.jumpPressed = false

    const extraPad = players.length > 1 && !players[1].cpu ? padInput() : null

    acc += dt
    while (acc >= PHYS_DT) {
      acc -= PHYS_DT
      for (let i = 0; i < players.length; i++) {
        const p = players[i]
        if (!p.alive) continue
        let input
        if (i === 0) input = human
        else if (i === 1 && extraPad) input = extraPad
        else input = stepCpu(p, PHYS_DT, level.waypoints)
        const wasCanDouble = p.canDouble
        stepPlayer(p, input, PHYS_DT, level.colliders)
        if (p.justJumped && i === 0) (wasCanDouble && !p.canDouble ? sfx.double : sfx.jump)()
      }
      human.jumpPressed = false
      updateCrumbles(level, players, PHYS_DT)
      updateBoxes(level, PHYS_DT)
    }

    for (const p of players) {
      if (!p.alive) continue
      if (level.lavaStarted && p.pos.y < level.lavaY - 0.02) kill(p, 'lava')
      if (p.pos.y < -4) kill(p, 'fall')
      if (phase === 'play' || phase === 'countdown') {
        const g = level.goal
        const dx = p.pos.x - g.pos.x
        const dz = p.pos.z - g.pos.z
        if (dx * dx + dz * dz < g.radius * g.radius && Math.abs(p.pos.y - g.pos.y) < 2.2) markWin(p)
      }
    }

    for (const c of level.crumbles) {
      if (c.active === false && c.standTime >= 1.2 && now - lastCrack > 200) {
        sfx.crack()
        lastCrack = now
        c.standTime = 0
      }
    }
  }

  for (let i = 0; i < players.length; i++) syncRunnerMesh(players[i], meshes[i], now)
  syncLava(lava, level.lavaY, now, level.lavaStarted)

  const focus = players[0]
  const cy = Math.cos(camPitch), sy = Math.sin(camPitch)
  const fx = Math.sin(camYaw), fz = Math.cos(camYaw)
  let dist = 3.55
  const targetLook = new THREE.Vector3(focus.pos.x + fx * 1.6, focus.pos.y + 1.15, focus.pos.z + fz * 1.6)
  let targetPos = new THREE.Vector3(
    focus.pos.x - fx * cy * dist,
    focus.pos.y + 1.45 - sy * dist,
    focus.pos.z - fz * cy * dist
  )
  const hw = C.WELL_W / 2 - 0.35
  const z0 = -C.WELL_D / 2 + 0.35
  const z1 = C.LOBBY_Z1 - 0.35
  targetPos.x = Math.max(-hw, Math.min(hw, targetPos.x))
  targetPos.z = Math.max(z0, Math.min(z1, targetPos.z))
  targetPos.y = Math.max(level.lavaY + 0.6, targetPos.y)
  camPos.lerp(targetPos, 1 - Math.exp(-8 * dt))
  camLook.lerp(targetLook, 1 - Math.exp(-11 * dt))
  camera.position.copy(camPos)
  camera.lookAt(camLook)
  fill.target.position.copy(focus.pos)
  fill.position.set(focus.pos.x + 3, focus.pos.y + 12, focus.pos.z + 4)

  const fogBase = 0.022 + Math.max(0, (level.lavaY / C.ROOF_Y)) * 0.02
  scene.fog.density = fogBase
  scene.background.lerp(new THREE.Color(level.lavaStarted ? 0x1a0806 : 0x0c0708), 0.05)

  if (phase === 'play' || phase === 'countdown') {
    el.time.textContent = fmt(now - startT)
    const fl = floorIndex(focus.pos.y)
    el.floor.textContent = fl > C.FLOORS ? '天台' : `${fl}F`
    el.lava.textContent = `${Math.max(0, level.lavaY).toFixed(1)}m`
    const youPct = Math.max(0, Math.min(1, focus.pos.y / C.ROOF_Y))
    const lavaPct = Math.max(0, Math.min(1, level.lavaY / C.ROOF_Y))
    el.barYou.style.bottom = (youPct * 100).toFixed(1) + '%'
    el.barLava.style.height = (lavaPct * 100).toFixed(1) + '%'
    renderRanks()
  }

  renderer.render(scene, camera)
}
requestAnimationFrame(frame)
window.__game.ready = true
