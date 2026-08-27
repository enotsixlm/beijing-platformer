import * as THREE from 'three'
import { buildLevel, updateSearchlights, updateChopper, MAP } from './level.js'
import {
  createHumanoid, createPlayerState, stepPlayer, syncPlayerMesh, hurtPlayer, P,
} from './player.js'
import { stepGuards, tryCQC, createAlertState, ALERT, syncGuardDebug } from './guards.js'

const PHYS_DT = 1 / 60

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
scene.background = new THREE.Color(0x071018)
scene.fog = new THREE.Fog(0x0a1622, 28, 95)

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.12, 240)

const hemi = new THREE.HemisphereLight(0x6a88aa, 0x0a120c, 0.55)
scene.add(hemi)
const moon = new THREE.DirectionalLight(0xc5d8f0, 0.85)
moon.position.set(-40, 55, -20)
moon.castShadow = true
moon.shadow.mapSize.set(2048, 2048)
moon.shadow.camera.left = -50
moon.shadow.camera.right = 50
moon.shadow.camera.top = 50
moon.shadow.camera.bottom = -50
moon.shadow.camera.far = 160
scene.add(moon, moon.target)

const alertFill = new THREE.AmbientLight(0xff1a1a, 0)
scene.add(alertFill)

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

const level = buildLevel(scene)
const player = createPlayerState(MAP.start.x, MAP.start.y, MAP.start.z)
const raven = createHumanoid('raven')
scene.add(raven.group)
const alert = createAlertState()

let respawn = { pos: new THREE.Vector3(MAP.start.x, 0, MAP.start.z), name: 'Breach' }
let phase = 'ready'
let hasIntel = false
let startT = 0
let winTime = null
let frames = 0
let extracting = false

const pebbles = []
const noiseEvents = []

const keys = new Set()
let jumpPressed = false
let crouchToggle = false
let boxToggle = false
let cqcPressed = false
let throwPressed = false
let interactPressed = false
let anyKeyHook = null
let camYaw = 0
let camPitch = 0.32
let pointerLocked = false

window.addEventListener('keydown', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault()
  if (e.repeat) return
  keys.add(e.code)
  initAudio()
  if (anyKeyHook) { const h = anyKeyHook; anyKeyHook = null; h() }
  if (e.code === 'Space') jumpPressed = true
  if (e.code === 'ControlLeft' || e.code === 'ControlRight' || e.code === 'KeyC') crouchToggle = true
  if (e.code === 'KeyE') boxToggle = true
  if (e.code === 'KeyF') { cqcPressed = true; interactPressed = true }
  if (e.code === 'KeyG' || e.code === 'KeyQ') throwPressed = true
  if (e.code === 'KeyR') {
    if (phase === 'win') location.reload()
    else if (phase === 'dead') revive()
    else if (phase === 'play') doRespawn()
  }
})
window.addEventListener('keyup', (e) => keys.delete(e.code))

renderer.domElement.addEventListener('click', () => {
  renderer.domElement.requestPointerLock?.()
  initAudio()
  if (anyKeyHook) { const h = anyKeyHook; anyKeyHook = null; h() }
})
document.addEventListener('pointerlockchange', () => {
  pointerLocked = document.pointerLockElement === renderer.domElement
})
window.addEventListener('mousemove', (e) => {
  if (!pointerLocked || phase !== 'play') return
  camYaw -= e.movementX * 0.0022
  camPitch = Math.max(-0.15, Math.min(0.85, camPitch + e.movementY * 0.0016))
})

function readInput() {
  const f = (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) - (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0)
  const r = (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0)
  const fx = Math.sin(camYaw), fz = Math.cos(camYaw)
  const rx = Math.sin(camYaw + Math.PI / 2), rz = Math.cos(camYaw + Math.PI / 2)
  let x = fx * f + rx * r
  let z = fz * f + rz * r
  const len = Math.hypot(x, z)
  if (len > 1) { x /= len; z /= len }
  const input = {
    x, z,
    jumpPressed,
    run: keys.has('ShiftLeft') || keys.has('ShiftRight'),
    crouchToggle,
    boxToggle,
    cqc: cqcPressed,
    throw: throwPressed,
    interact: interactPressed,
  }
  jumpPressed = crouchToggle = boxToggle = cqcPressed = throwPressed = interactPressed = false
  return input
}

window.__game = {
  ready: false,
  input: null,
  teleport(x, y, z) {
    player.pos.set(x, y, z)
    player.vx = player.vy = player.vz = 0
  },
  start() { if (anyKeyHook) { const h = anyKeyHook; anyKeyHook = null; h() } },
  giveIntel() { grabIntel() },
  koGuard(i) {
    const g = level.guards[i]
    if (g && !g.ko) {
      g.ko = true; g.state = 'ko'; g.fan.visible = false; g.mark.visible = false
    }
  },
  damage(n) { player.invuln = 0; hurtPlayer(player, n) },
  state() {
    return {
      phase,
      alertPhase: alert.phase,
      hp: player.hp,
      hasIntel,
      boxOn: player.boxOn,
      crouch: player.crouch,
      stamina: +player.stamina.toFixed(2),
      pos: { x: +player.pos.x.toFixed(2), y: +player.pos.y.toFixed(2), z: +player.pos.z.toFixed(2) },
      grounded: player.grounded,
      checkpoint: respawn.name,
      frames,
      guards: syncGuardDebug(level.guards),
    }
  },
}

let audio = null
function initAudio() {
  if (audio) return
  try { audio = new (window.AudioContext || window.webkitAudioContext)() } catch { /* silent */ }
}
function beep(freq, dur = 0.12, vol = 0.14, type = 'square') {
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
  jump: () => beep(220, 0.1, 0.08, 'triangle'),
  cqc: () => { beep(90, 0.16, 0.22, 'sawtooth'); setTimeout(() => beep(60, 0.2, 0.16, 'square'), 70) },
  alert: () => {
    ;[880, 440, 880, 440].forEach((f, i) => setTimeout(() => beep(f, 0.18, 0.12, 'square'), i * 160))
  },
  caution: () => beep(520, 0.2, 0.1, 'triangle'),
  clear: () => beep(660, 0.25, 0.1, 'sine'),
  pebble: () => beep(340, 0.08, 0.12, 'triangle'),
  intel: () => [523, 659, 784].forEach((f, i) => setTimeout(() => beep(f, 0.16, 0.14), i * 90)),
  hit: () => beep(140, 0.2, 0.2, 'sawtooth'),
  box: () => beep(180, 0.1, 0.1, 'square'),
  win: () => [392, 523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.22, 0.16), i * 140)),
  dead: () => beep(80, 0.6, 0.2, 'sawtooth'),
  shot: () => beep(900, 0.05, 0.08, 'square'),
}

const el = {
  overlay: document.getElementById('overlay'),
  banner: document.getElementById('alertBanner'),
  hp: document.getElementById('hpFill'),
  stam: document.getElementById('stamFill'),
  obj: document.getElementById('objective'),
  toast: document.getElementById('toast'),
  prompt: document.getElementById('prompt'),
  radar: document.getElementById('radar'),
  cells: document.getElementById('lifeCells'),
  time: document.getElementById('time'),
}
const rctx = el.radar.getContext('2d')

function lifeCells() {
  el.cells.innerHTML = ''
  const n = 10
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span')
    s.className = 'cell'
    el.cells.appendChild(s)
  }
}
lifeCells()

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
  toastTimer = setTimeout(() => { el.toast.style.opacity = 0 }, 2200)
}

anyKeyHook = () => {
  phase = 'play'
  startT = performance.now()
  el.overlay.classList.add('hidden')
  sfx.clear()
}

function doRespawn() {
  player.pos.copy(respawn.pos)
  player.pos.y += 0.05
  player.vx = player.vy = player.vz = 0
  player.boxOn = false
  toast('Returned to ' + respawn.name)
}

function revive() {
  phase = 'play'
  player.hp = 100
  player.invuln = 1.2
  alert.phase = ALERT.CAUTION
  alert.timer = 0
  el.overlay.classList.add('hidden')
  doRespawn()
}

function grabIntel() {
  if (hasIntel) return
  hasIntel = true
  level.intel.disk.visible = false
  level.intel.beam.visible = false
  sfx.intel()
  toast('CHIMERA DISK ACQUIRED — get to the chopper')
  el.obj.textContent = 'EXTRACT · Helipad'
}

function winMission() {
  phase = 'win'
  extracting = true
  winTime = performance.now() - startT
  sfx.win()
  el.overlay.classList.remove('hidden')
  el.overlay.innerHTML = `
    <div class="codec">COMMS</div>
    <h1>MISSION COMPLETE</h1>
    <div class="sub">
      Disk recovered. Raven is in the air.<br>
      Time ${fmt(winTime)} · Alert peak ${alert.phase.toUpperCase()}
    </div>
    <p class="blink">Press R to run it again</p>`
}

function failMission() {
  phase = 'dead'
  sfx.dead()
  el.overlay.classList.remove('hidden')
  el.overlay.innerHTML = `
    <div class="codec">COMMS</div>
    <h1>MISSION FAILED</h1>
    <div class="sub">Raven is down. The disk is still in the compound.</div>
    <p class="blink">Press R to retry from ${respawn.name}</p>`
}

function throwPebble() {
  if (player.throwCooldown > 0) return
  player.throwCooldown = 1.25
  const f = { x: Math.sin(player.heading), z: Math.cos(player.heading) }
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), new THREE.MeshBasicMaterial({ color: 0x888888 }))
  mesh.position.set(player.pos.x + f.x * 0.4, player.pos.y + 1.1, player.pos.z + f.z * 0.4)
  scene.add(mesh)
  pebbles.push({
    mesh,
    vx: f.x * 11,
    vy: 4.2,
    vz: f.z * 11,
    alive: true,
  })
  sfx.pebble()
}

function stepPebbles(dt) {
  for (const p of pebbles) {
    if (!p.alive) continue
    p.vy -= 18 * dt
    p.mesh.position.x += p.vx * dt
    p.mesh.position.y += p.vy * dt
    p.mesh.position.z += p.vz * dt
    if (p.mesh.position.y <= 0.08) {
      p.mesh.position.y = 0.08
      p.alive = false
      p.mesh.visible = false
      noiseEvents.push({ x: p.mesh.position.x, z: p.mesh.position.z, radius: 15, t: 0.45 })
      sfx.pebble()
    }
  }
}

function drawRadar() {
  const c = rctx
  const W = el.radar.width, H = el.radar.height
  c.clearRect(0, 0, W, H)
  c.fillStyle = 'rgba(0, 12, 4, 0.82)'
  c.beginPath(); c.arc(W / 2, H / 2, W / 2 - 2, 0, Math.PI * 2); c.fill()
  c.strokeStyle = '#1dff6a'
  c.lineWidth = 2
  c.stroke()
  c.globalAlpha = 0.35
  for (const r of [0.33, 0.66]) {
    c.beginPath(); c.arc(W / 2, H / 2, (W / 2 - 4) * r, 0, Math.PI * 2); c.stroke()
  }
  c.beginPath(); c.moveTo(W / 2, 8); c.lineTo(W / 2, H - 8)
  c.moveTo(8, H / 2); c.lineTo(W - 8, H / 2); c.stroke()
  c.globalAlpha = 1

  const range = 22
  const scale = (W / 2 - 10) / range
  const px = player.pos.x, pz = player.pos.z
  const to = (x, z) => [W / 2 + (x - px) * scale, H / 2 - (z - pz) * scale]

  // compound hint
  c.strokeStyle = 'rgba(29,255,106,0.25)'
  const [x1, y1] = to(-28, 6)
  const [x2, y2] = to(36, 90)
  c.strokeRect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1))

  for (const g of level.guards) {
    if (g.ko) continue
    const [gx, gy] = to(g.pos.x, g.pos.z)
    const d = Math.hypot(g.pos.x - px, g.pos.z - pz)
    if (d > range + 4) continue
    c.fillStyle = g.state === 'chase' ? '#ff3b3b' : '#f4f4f4'
    c.beginPath(); c.arc(gx, gy, 3.2, 0, Math.PI * 2); c.fill()
    c.strokeStyle = g.state === 'chase' ? 'rgba(255,60,60,0.35)' : 'rgba(29,255,106,0.28)'
    c.beginPath()
    c.moveTo(gx, gy)
    const fA = g.heading - g.fov
    const tA = g.heading + g.fov
    c.lineTo(gx + Math.sin(fA) * 18, gy - Math.cos(fA) * 18)
    c.lineTo(gx + Math.sin(tA) * 18, gy - Math.cos(tA) * 18)
    c.closePath(); c.stroke()
  }

  if (!hasIntel) {
    const [ix, iy] = to(MAP.intel.x, MAP.intel.z)
    c.fillStyle = '#33ffaa'
    c.fillRect(ix - 3, iy - 3, 6, 6)
  } else {
    const [ex, ey] = to(MAP.extract.x, MAP.extract.z)
    c.strokeStyle = '#ffd24a'
    c.beginPath(); c.arc(ex, ey, 6, 0, Math.PI * 2); c.stroke()
  }

  c.save()
  c.translate(W / 2, H / 2)
  c.rotate(player.heading)
  c.fillStyle = '#1dff6a'
  c.beginPath(); c.moveTo(0, -7); c.lineTo(4, 5); c.lineTo(0, 3); c.lineTo(-4, 5); c.closePath(); c.fill()
  c.restore()
}

function updateHud(now) {
  el.hp.style.width = `${player.hp}%`
  el.stam.style.width = `${(player.stamina / P.staminaMax) * 100}%`
  const cells = el.cells.children
  const filled = Math.ceil((player.hp / 100) * cells.length)
  for (let i = 0; i < cells.length; i++) cells[i].classList.toggle('off', i >= filled)

  el.banner.className = alert.phase
  el.banner.textContent = alert.phase === ALERT.INFILTRATION ? '' : alert.phase.toUpperCase()
  document.body.dataset.alert = alert.phase
  alertFill.intensity = alert.phase === ALERT.ALERT ? 0.35 : alert.phase === ALERT.EVASION ? 0.12 : 0

  if (phase === 'play') el.time.textContent = fmt(now - startT)

  const dxI = MAP.intel.x - player.pos.x, dzI = MAP.intel.z - player.pos.z
  const dxE = MAP.extract.x - player.pos.x, dzE = MAP.extract.z - player.pos.z
  let prompt = ''
  if (!hasIntel && dxI * dxI + dzI * dzI < 2.4 * 2.4) prompt = 'F  Take CHIMERA disk'
  else if (hasIntel && dxE * dxE + dzE * dzE < MAP.extract.radius * MAP.extract.radius) prompt = 'F  Board helicopter'
  else {
    let near = false
    for (const g of level.guards) {
      if (g.ko) continue
      if (Math.hypot(g.pos.x - player.pos.x, g.pos.z - player.pos.z) < 1.6) { near = true; break }
    }
    if (near) prompt = 'F  CQC'
  }
  el.prompt.textContent = prompt
  drawRadar()
}

const camPos = new THREE.Vector3(MAP.start.x, 3.4, MAP.start.z - 7)
const camLook = new THREE.Vector3(MAP.start.x, 1.2, MAP.start.z)

let lastT = performance.now()
let acc = 0
const tracers = []

function spawnTracer(from, to) {
  const geo = new THREE.BufferGeometry().setFromPoints([from, to])
  const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xffee88, transparent: true, opacity: 0.7 }))
  scene.add(line)
  tracers.push({ line, t: 0.08 })
}

function frame(now) {
  requestAnimationFrame(frame)
  frames++
  const dt = Math.min((now - lastT) / 1000, 0.05)
  lastT = now

  if (keys.has('ArrowLeft') && !pointerLocked) camYaw += 1.7 * dt
  if (keys.has('ArrowRight') && !pointerLocked) camYaw -= 1.7 * dt
  if (keys.has('KeyZ')) camYaw += 1.7 * dt
  if (keys.has('KeyX')) camYaw -= 1.7 * dt

  updateSearchlights(level.searchlights, now / 1000)
  updateChopper(level.chopper, dt, extracting || phase === 'win')

  if (phase === 'play') {
    let input
    if (window.__game.input) {
      input = { run: false, crouchToggle: false, boxToggle: false, cqc: false, throw: false, interact: false, ...window.__game.input }
      window.__game.input.jumpPressed = false
      window.__game.input.crouchToggle = false
      window.__game.input.boxToggle = false
      window.__game.input.cqc = false
      window.__game.input.throw = false
      window.__game.input.interact = false
    } else {
      input = readInput()
    }

    acc += dt
    let stepInput = input
    while (acc >= PHYS_DT) {
      acc -= PHYS_DT
      stepPlayer(player, stepInput, PHYS_DT, level.colliders)
      stepInput = { ...stepInput, jumpPressed: false, crouchToggle: false, boxToggle: false }
    }
    if (player.justJumped) sfx.jump()
    if (input.boxToggle) sfx.box()

    if (input.cqc || input.interact) {
      const dxI = MAP.intel.x - player.pos.x, dzI = MAP.intel.z - player.pos.z
      const dxE = MAP.extract.x - player.pos.x, dzE = MAP.extract.z - player.pos.z
      if (!hasIntel && dxI * dxI + dzI * dzI < 2.4 * 2.4) grabIntel()
      else if (hasIntel && dxE * dxE + dzE * dzE < MAP.extract.radius * MAP.extract.radius) winMission()
      else {
        const r = tryCQC(player, level.guards)
        if (r) {
          sfx.cqc()
          player.noise = r.silent ? 3.5 : 12
          if (!r.silent) {
            r.guard.detect = 1
            alert.phase = ALERT.ALERT
            alert.timer = 0
            alert.lastKnown.copy(player.pos)
            sfx.alert()
          }
        }
      }
    }
    if (input.throw) throwPebble()

    for (const n of noiseEvents) n.t -= dt
    for (let i = noiseEvents.length - 1; i >= 0; i--) if (noiseEvents[i].t <= 0) noiseEvents.splice(i, 1)
    stepPebbles(dt)

    const { shots, events } = stepGuards(level.guards, dt, {
      player, colliders: level.colliders, noiseEvents, alert, bushes: level.bushes, now,
    })
    for (const ev of events) {
      if (ev.kind === 'alert') { sfx.alert(); toast('ALERT — hide!') }
      if (ev.kind === 'evasion') toast('EVASION — they lost you')
      if (ev.kind === 'caution') { sfx.caution(); toast('CAUTION') }
      if (ev.kind === 'clear') { sfx.clear(); toast('Infiltration restored') }
    }
    for (const s of shots) {
      sfx.shot()
      const from = new THREE.Vector3(s.guard.pos.x, 1.35, s.guard.pos.z)
      const to = new THREE.Vector3(player.pos.x, player.pos.y + 1.1, player.pos.z)
      spawnTracer(from, to)
      if (s.hit && hurtPlayer(player, s.dmg)) sfx.hit()
    }
    if (player.hp <= 0) failMission()

    // searchlight detection
    for (const sl of level.searchlights) {
      const dx = player.pos.x - sl.ox
      const dz = player.pos.z - sl.oz
      const dist = Math.hypot(dx, dz)
      if (dist > 22 || player.boxOn) continue
      const toP = Math.atan2(player.pos.x - sl.ox, player.pos.z - sl.oz)
      const toL = Math.atan2(sl.target.position.x - sl.ox, sl.target.position.z - sl.oz)
      let dA = Math.abs(toP - toL)
      if (dA > Math.PI) dA = Math.PI * 2 - dA
      if (dA < 0.18 && dist < 20 && !player.crouch) {
        const g = level.guards.find((g) => !g.ko)
        if (g && g.detect < 0.7) g.detect = Math.min(1, g.detect + dt * 0.8)
      }
    }

    for (const cp of level.checkpoints) {
      if (cp.active) continue
      const dx = cp.pos.x - player.pos.x
      const dz = cp.pos.z - player.pos.z
      if (dx * dx + dz * dz < cp.radius * cp.radius) {
        cp.active = true
        respawn = { pos: cp.pos.clone(), name: cp.name }
        toast('▲ ' + cp.name)
      }
    }
  }

  for (let i = tracers.length - 1; i >= 0; i--) {
    tracers[i].t -= dt
    tracers[i].line.material.opacity = Math.max(0, tracers[i].t / 0.08)
    if (tracers[i].t <= 0) {
      scene.remove(tracers[i].line)
      tracers.splice(i, 1)
    }
  }

  syncPlayerMesh(player, raven, now)
  if (player.invuln > 0 && Math.floor(now / 80) % 2 === 0) raven.group.visible = false
  else raven.group.visible = true

  const dist = 6.4
  const height = 2.55 + camPitch * 2.2
  const fx = Math.sin(camYaw), fz = Math.cos(camYaw)
  const targetPos = new THREE.Vector3(
    player.pos.x - fx * dist,
    player.pos.y + height,
    player.pos.z - fz * dist
  )
  const targetLook = new THREE.Vector3(
    player.pos.x + fx * 2.2,
    player.pos.y + 1.15,
    player.pos.z + fz * 2.2
  )
  camPos.lerp(targetPos, 1 - Math.exp(-8 * dt))
  camLook.lerp(targetLook, 1 - Math.exp(-10 * dt))
  camera.position.copy(camPos)
  camera.lookAt(camLook)

  moon.target.position.set(player.pos.x, 0, player.pos.z)

  if (phase === 'win') {
    camera.position.lerp(new THREE.Vector3(30, 8, 70), 0.02)
    camera.lookAt(26, 2, 82)
  }

  updateHud(now)
  renderer.render(scene, camera)
}
requestAnimationFrame(frame)
window.__game.ready = true
