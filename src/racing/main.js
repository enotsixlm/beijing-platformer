import * as THREE from 'three'
import { buildTrack } from './track.js'
import { createCarMesh, createCarState, stepCar, syncCarMesh, CAR } from './car.js'
import { createAiDriver, aiInput } from './ai.js'
import { applyPaperEdges } from '../paper.js'

const TOTAL_LAPS = 3
const PHYS_DT = 1 / 120

// ---------- 渲染基础 ----------
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.15
renderer.domElement.id = 'game'
document.body.prepend(renderer.domElement)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x9fd3ec)
scene.fog = new THREE.Fog(0xbfe3ee, 220, 900)

const BASE_FOV = 62
const camera = new THREE.PerspectiveCamera(BASE_FOV, window.innerWidth / window.innerHeight, 0.1, 1500)

const hemi = new THREE.HemisphereLight(0xd6ecff, 0x6fa557, 1.15)
scene.add(hemi)
const sun = new THREE.DirectionalLight(0xfff4da, 1.7)
sun.castShadow = true
sun.shadow.mapSize.set(1536, 1536)
sun.shadow.camera.left = -90
sun.shadow.camera.right = 90
sun.shadow.camera.top = 90
sun.shadow.camera.bottom = -90
sun.shadow.camera.far = 400
scene.add(sun, sun.target)

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// ---------- 赛道 ----------
const track = buildTrack(scene)

// ---------- 赛车阵容(起跑格,2x2 错位排列)----------
const startTangent = track.startTangent
const startRight = new THREE.Vector3(startTangent.z, 0, -startTangent.x)
const startHeading = Math.atan2(startTangent.x, startTangent.z)

const ROSTER = [
  { name: '你', color: 0xe03131, isPlayer: true, row: 0, col: -1 },
  { name: 'AI · 蓝闪', color: 0x2f6fd1, isPlayer: false, row: 0, col: 1 },
  { name: 'AI · 金隼', color: 0xffb300, isPlayer: false, row: 1, col: -1 },
  { name: 'AI · 绿骑', color: 0x2f8a4e, isPlayer: false, row: 1, col: 1 },
]

const cars = ROSTER.map((r) => {
  const back = 6 + r.row * 16
  const side = r.col * (track.roadWidth / 4)
  const x = track.startPos.x - startTangent.x * back + startRight.x * side
  const z = track.startPos.z - startTangent.z * back + startRight.z * side
  const state = createCarState(x, z, startHeading)
  state.pos.y = track.startPos.y + 0.02
  const mesh = createCarMesh(r.color)
  mesh.group.position.copy(state.pos)
  mesh.group.rotation.y = startHeading
  scene.add(mesh.group)
  return { ...r, state, mesh, driver: r.isPlayer ? null : createAiDriver({ aggression: 0.86 + Math.random() * 0.22 }) }
})
const player = cars.find((c) => c.isPlayer)

applyPaperEdges(scene)

// ---------- 输入 ----------
const keys = new Set()
window.addEventListener('keydown', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault()
  keys.add(e.code)
  initAudio()
  if (anyKeyHook) { const h = anyKeyHook; anyKeyHook = null; h() }
  if (e.code === 'KeyR') location.reload()
})
window.addEventListener('keyup', (e) => keys.delete(e.code))

function readPlayerInput() {
  const throttle = (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) - (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0)
  const steer = (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0)
  const handbrake = keys.has('Space')
  return { throttle, steer, handbrake }
}

// ---------- 音效 ----------
let audio = null
let engineOsc = null
let engineGain = null
function initAudio() {
  if (audio) return
  try {
    audio = new (window.AudioContext || window.webkitAudioContext)()
    engineOsc = audio.createOscillator()
    engineOsc.type = 'sawtooth'
    engineOsc.frequency.value = 90
    engineGain = audio.createGain()
    engineGain.gain.value = 0
    engineOsc.connect(engineGain).connect(audio.destination)
    engineOsc.start()
  } catch { /* 无声环境 */ }
}
function beep(freq, dur = 0.15, vol = 0.18, type = 'square') {
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
  tick: () => beep(660, 0.09, 0.16, 'triangle'),
  go: () => beep(920, 0.3, 0.22, 'triangle'),
  lap: () => { beep(700, 0.09, 0.14); setTimeout(() => beep(940, 0.13, 0.14), 70) },
  bump: () => beep(140, 0.12, 0.16, 'square'),
  finish: () => [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.22, 0.18), i * 130)),
}

// ---------- HUD ----------
const el = {
  lapNum: document.getElementById('lapNum'),
  lapTotal: document.getElementById('lapTotal'),
  posNum: document.getElementById('posNum'),
  posTotal: document.getElementById('posTotal'),
  raceTime: document.getElementById('raceTime'),
  curLap: document.getElementById('curLap'),
  bestLap: document.getElementById('bestLap'),
  speedVal: document.getElementById('speedVal'),
  toast: document.getElementById('toast'),
  countdown: document.getElementById('countdown'),
  overlay: document.getElementById('overlay'),
  miniMap: document.getElementById('miniMap'),
}
el.lapTotal.textContent = TOTAL_LAPS
el.posTotal.textContent = cars.length

function fmt(ms) {
  if (ms == null) return '--:--.-'
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
  toastTimer = setTimeout(() => { el.toast.style.opacity = 0 }, 1500)
}

// ---------- 小地图 ----------
const mmCtx = el.miniMap.getContext('2d')
const MM_SIZE = 150
const MM_PAD = 12
let mmPath = null
let mmTransform = (x, z) => [x, z]
{
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity
  for (const s of track.samples) {
    minX = Math.min(minX, s.p.x); maxX = Math.max(maxX, s.p.x)
    minZ = Math.min(minZ, s.p.z); maxZ = Math.max(maxZ, s.p.z)
  }
  const w = maxX - minX, h = maxZ - minZ
  const scale = (MM_SIZE - MM_PAD * 2) / Math.max(w, h)
  const offX = (MM_SIZE - w * scale) / 2
  const offZ = (MM_SIZE - h * scale) / 2
  mmTransform = (x, z) => [offX + (x - minX) * scale, offZ + (z - minZ) * scale]
  mmPath = new Path2D()
  track.samples.forEach((s, i) => {
    const [mx, my] = mmTransform(s.p.x, s.p.z)
    if (i === 0) mmPath.moveTo(mx, my)
    else mmPath.lineTo(mx, my)
  })
  mmPath.closePath()
}
function drawMiniMap() {
  mmCtx.clearRect(0, 0, MM_SIZE, MM_SIZE)
  mmCtx.strokeStyle = 'rgba(255,252,240,0.85)'
  mmCtx.lineWidth = 5
  mmCtx.stroke(mmPath)
  mmCtx.strokeStyle = 'rgba(60,60,60,0.7)'
  mmCtx.lineWidth = 2
  mmCtx.stroke(mmPath)
  for (const c of cars) {
    const [mx, my] = mmTransform(c.state.pos.x, c.state.pos.z)
    mmCtx.beginPath()
    mmCtx.fillStyle = c.isPlayer ? '#ffffff' : `#${c.color.toString(16).padStart(6, '0')}`
    mmCtx.arc(mx, my, c.isPlayer ? 4.5 : 3.5, 0, Math.PI * 2)
    mmCtx.fill()
    if (c.isPlayer) {
      mmCtx.strokeStyle = '#20232b'
      mmCtx.lineWidth = 1.2
      mmCtx.stroke()
    }
  }
}

// ---------- 状态机 ----------
let phase = 'ready' // ready → countdown → play → finished
let anyKeyHook = null
let countdownStart = 0
let raceStartTime = 0
let bumpCooldown = 0

anyKeyHook = () => {
  phase = 'countdown'
  countdownStart = performance.now()
  el.overlay.classList.add('hidden')
}

function beginRace() {
  phase = 'play'
  raceStartTime = performance.now()
  for (const c of cars) c.state.lapStartTime = raceStartTime
  sfx.go()
}

function finishRace() {
  phase = 'finished'
  const ranking = [...cars].sort((a, b) => b.state.distance - a.state.distance)
  const rank = ranking.indexOf(player) + 1
  const total = player.state.finishTime - raceStartTime
  sfx.finish()
  el.overlay.classList.remove('hidden')
  const medal = rank === 1 ? '🏆' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '🏁'
  el.overlay.innerHTML = `
    <h1>${medal} 完赛第 ${rank} 名!</h1>
    <div class="sub">
      总用时 ${fmt(total)}<br>
      最快单圈 ${fmt(player.state.bestLap)}<br>
      ${ranking.map((c, i) => `${i + 1}. ${c.name}`).join(' · ')}
    </div>
    <p class="blink">按 R 再来一次</p>`
}

// ---------- 测试钩子 ----------
window.__racing = {
  ready: false,
  input: null,
  teleport(x, z, heading = 0) {
    player.state.pos.set(x, track.startPos.y, z)
    player.state.heading = heading
    player.state.speed = 0
    player.state.lateralVel = 0
  },
  start() { if (anyKeyHook) { const h = anyKeyHook; anyKeyHook = null; h() } },
  skipCountdown() { if (phase === 'countdown') beginRace() },
  state() {
    const ranking = [...cars].sort((a, b) => b.state.distance - a.state.distance)
    return {
      phase,
      lap: player.state.lap,
      totalLaps: TOTAL_LAPS,
      position: ranking.indexOf(player) + 1,
      onTrack: player.state.onTrack,
      finished: player.state.finished,
      speed: +player.state.speed.toFixed(2),
      pos: { x: +player.state.pos.x.toFixed(2), y: +player.state.pos.y.toFixed(2), z: +player.state.pos.z.toFixed(2) },
      frames,
    }
  },
}

// ---------- 主循环 ----------
let lastT = performance.now()
let acc = 0
let frames = 0
let lastCountdownDigit = null
const camPos = new THREE.Vector3()
const camLook = new THREE.Vector3()
let camInit = false

function frame(now) {
  requestAnimationFrame(frame)
  frames++
  const dt = Math.min((now - lastT) / 1000, 0.05)
  lastT = now

  if (phase === 'countdown') {
    const t = now - countdownStart
    const digit = t < 1000 ? 3 : t < 2000 ? 2 : t < 3000 ? 1 : 0
    if (digit !== lastCountdownDigit) {
      lastCountdownDigit = digit
      if (digit > 0) { el.countdown.textContent = digit; sfx.tick() } else { el.countdown.textContent = 'GO!'; beginRace() }
      el.countdown.style.opacity = 1
    }
    if (t > 3700) el.countdown.style.opacity = 0
  }

  if (phase === 'play' || phase === 'countdown') {
    let playerInput = { throttle: 0, steer: 0, handbrake: false }
    if (phase === 'play') {
      playerInput = window.__racing.input ? { ...window.__racing.input } : readPlayerInput()
    }
    acc += dt
    while (acc >= PHYS_DT) {
      acc -= PHYS_DT
      for (const c of cars) {
        if (c.state.finished) continue
        const input = c.isPlayer ? playerInput : aiInput(c.state, track, c.driver, now)
        stepCar(c.state, input, PHYS_DT, track, TOTAL_LAPS)
        if (c.state.justCrossedLine && c.isPlayer) {
          toast(c.state.lap >= TOTAL_LAPS ? '🏁 完赛!' : `圈数 ${c.state.lap}/${TOTAL_LAPS}`)
          sfx.lap()
        }
      }
    }

    // 车间简单碰撞分离
    bumpCooldown = Math.max(0, bumpCooldown - dt)
    for (let i = 0; i < cars.length; i++) {
      for (let j = i + 1; j < cars.length; j++) {
        const a = cars[i].state, b = cars[j].state
        const dx = b.pos.x - a.pos.x, dz = b.pos.z - a.pos.z
        const dist = Math.hypot(dx, dz)
        const minDist = CAR.bodyRadius * 1.7
        if (dist > 0 && dist < minDist) {
          const push = (minDist - dist) / 2
          const nx = dx / dist, nz = dz / dist
          a.pos.x -= nx * push; a.pos.z -= nz * push
          b.pos.x += nx * push; b.pos.z += nz * push
          a.speed *= 0.92; b.speed *= 0.92
          if (bumpCooldown <= 0 && (cars[i].isPlayer || cars[j].isPlayer) && Math.abs(a.speed - b.speed) > 4) {
            sfx.bump(); bumpCooldown = 0.4
          }
        }
      }
    }

    if (player.state.finished && phase === 'play') finishRace()
  }

  for (const c of cars) syncCarMesh(c.state, c.mesh, dt)

  // 引擎音效随速度变化
  if (engineGain && engineOsc) {
    const running = phase === 'play' || phase === 'countdown'
    const speedFrac = Math.min(1, Math.abs(player.state.speed) / CAR.maxSpeed)
    engineOsc.frequency.setTargetAtTime(90 + speedFrac * 260, audio.currentTime, 0.05)
    engineGain.gain.setTargetAtTime(running ? 0.05 + speedFrac * 0.05 : 0, audio.currentTime, 0.08)
  }

  // 相机跟随(第三人称追尾镜头)
  const fx = Math.sin(player.state.heading), fz = Math.cos(player.state.heading)
  const speedFrac = Math.min(1, Math.abs(player.state.speed) / CAR.maxSpeed)
  const targetPos = new THREE.Vector3(
    player.state.pos.x - fx * (7.5 + speedFrac * 1.5),
    player.state.pos.y + 3.6,
    player.state.pos.z - fz * (7.5 + speedFrac * 1.5)
  )
  const targetLook = new THREE.Vector3(
    player.state.pos.x + fx * 6,
    player.state.pos.y + 1.1,
    player.state.pos.z + fz * 6
  )
  if (!camInit) { camPos.copy(targetPos); camLook.copy(targetLook); camInit = true }
  camPos.lerp(targetPos, 1 - Math.exp(-6 * dt))
  camLook.lerp(targetLook, 1 - Math.exp(-9 * dt))
  camera.position.copy(camPos)
  camera.lookAt(camLook)
  const targetFov = BASE_FOV + speedFrac * 8
  if (Math.abs(camera.fov - targetFov) > 0.05) {
    camera.fov += (targetFov - camera.fov) * Math.min(1, 5 * dt)
    camera.updateProjectionMatrix()
  }

  // 阳光跟随
  sun.position.set(player.state.pos.x + 60, 100, player.state.pos.z + 40)
  sun.target.position.set(player.state.pos.x, 0, player.state.pos.z)

  // 云朵漂移
  for (const cl of track.clouds) {
    cl.position.x += cl.userData.speed * dt
    if (cl.position.x > 420) cl.position.x = -420
  }

  // HUD
  if (phase === 'play') {
    el.raceTime.textContent = fmt(now - raceStartTime)
    el.curLap.textContent = fmt(now - player.state.lapStartTime)
  }
  el.bestLap.textContent = fmt(player.state.bestLap)
  el.lapNum.textContent = Math.min(player.state.lap + (player.state.finished ? 0 : 1), TOTAL_LAPS)
  const ranking = [...cars].sort((a, b) => b.state.distance - a.state.distance)
  el.posNum.textContent = ranking.indexOf(player) + 1
  el.speedVal.textContent = Math.round(Math.abs(player.state.speed) * 3.6)
  drawMiniMap()

  renderer.render(scene, camera)
}

requestAnimationFrame(frame)
window.__racing.ready = true
