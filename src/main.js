import * as THREE from 'three'
import { buildLevel, updateMovers } from './level.js'
import { createPandaMesh, createPlayerState, stepPlayer, syncPandaMesh, P } from './player.js'
import { applyPaperEdges } from './paper.js'
import {
  initCrazyGames, loadingStop, gameplayStart, gameplayStop, happytime, pickLang,
} from './crazygames.js'

const PHYS_DT = 1 / 120

// ---------- 渲染基础 ----------
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.2
renderer.domElement.id = 'game'
document.body.prepend(renderer.domElement)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xb5d9ec)
scene.fog = new THREE.Fog(0xd3e7f0, 260, 1200)

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1500)

const hemi = new THREE.HemisphereLight(0xd6ecff, 0x8fb573, 1.1)
scene.add(hemi)
const sun = new THREE.DirectionalLight(0xfff4da, 1.7)
sun.castShadow = true
sun.shadow.mapSize.set(2048, 2048)
sun.shadow.camera.left = -80
sun.shadow.camera.right = 80
sun.shadow.camera.top = 80
sun.shadow.camera.bottom = -80
sun.shadow.camera.far = 400
scene.add(sun, sun.target)

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// ---------- 关卡与玩家 ----------
const level = buildLevel(scene)
const player = createPlayerState(0, 0, level.startZ)
const panda = createPandaMesh()
scene.add(panda.group)

let respawn = { pos: new THREE.Vector3(0, 0, level.startZ), name: '天安门广场' }
let coinCount = 0
let phase = 'ready' // ready → play → win
let startT = 0
let winTime = null

applyPaperEdges(scene)

// ---------- 输入 ----------
const keys = new Set()
let jumpPressed = false
let anyKeyHook = null
window.addEventListener('keydown', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault()
  if (e.repeat) return
  keys.add(e.code)
  initAudio()
  if (anyKeyHook) { const h = anyKeyHook; anyKeyHook = null; h() }
  if (e.code === 'Space') jumpPressed = true
  if (e.code === 'KeyR') {
    if (phase === 'win') location.reload()
    else doRespawn(false)
  }
})
window.addEventListener('keyup', (e) => keys.delete(e.code))

let camYaw = Math.PI // 朝 -Z(向北)

function readInput() {
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

// 测试钩子:无头测试可注入输入/传送/读状态
window.__game = {
  ready: false,
  input: null, // {x,z,jumpPressed} 覆盖键盘
  teleport(x, y, z) {
    player.pos.set(x, y, z)
    player.vx = player.vy = player.vz = 0
  },
  start() { if (anyKeyHook) { const h = anyKeyHook; anyKeyHook = null; h() } },
  state() {
    return {
      phase, coinCount,
      pos: { x: +player.pos.x.toFixed(2), y: +player.pos.y.toFixed(2), z: +player.pos.z.toFixed(2) },
      grounded: player.grounded,
      checkpoint: respawn.name,
      frames,
    }
  },
}

// ---------- 音效 ----------
let audio = null
function initAudio() {
  if (audio) return
  try { audio = new (window.AudioContext || window.webkitAudioContext)() } catch { /* 无声环境 */ }
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
  jump: () => beep(440, 0.12, 0.12, 'triangle'),
  double: () => beep(620, 0.12, 0.12, 'triangle'),
  coin: () => { beep(988, 0.08, 0.14); setTimeout(() => beep(1319, 0.13, 0.14), 60) },
  checkpoint: () => { beep(523, 0.1, 0.15); setTimeout(() => beep(784, 0.18, 0.15), 90) },
  fall: () => beep(180, 0.3, 0.2, 'sawtooth'),
  win: () => [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.22, 0.18), i * 130)),
}

// ---------- HUD ----------
const el = {
  coins: document.getElementById('coins'),
  coinsTotal: document.getElementById('coinsTotal'),
  time: document.getElementById('time'),
  cpName: document.getElementById('cpName'),
  toast: document.getElementById('checkpointToast'),
  bar: document.getElementById('progressBar'),
  overlay: document.getElementById('overlay'),
}
el.coinsTotal.textContent = level.coins.length

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

const COPY = {
  zh: {
    title: '🐼 北京跑酷',
    sub: '从天安门出发，翻过胡同屋脊、灯笼桥、天坛与 CBD 楼顶，<br>一路向北跳进鸟巢！小心别掉到马路上。',
    start: '按任意键开始',
    tips: 'WASD/方向键 移动 · 空格 跳(可二段跳) · Q/E 转视角 · R 回检查点',
    win: '🏅 跳进鸟巢!',
    retry: '按 R 再跑一次',
    coins: (t, n) => `用时 ${t}<br>金币 ${n} / ${level.coins.length}`,
  },
  en: {
    title: '🐼 Beijing Parkour',
    sub: 'Start at Tiananmen, vault hutong roofs, lantern bridges, the Temple of Heaven and CBD towers,<br>then leap into the Bird\'s Nest. Don\'t fall onto the street.',
    start: 'Press any key to start',
    tips: 'WASD/Arrows move · Space jump (double-jump) · Q/E camera · R checkpoint',
    win: '🏅 Into the Bird\'s Nest!',
    retry: 'Press R to run again',
    coins: (t, n) => `Time ${t}<br>Coins ${n} / ${level.coins.length}`,
  },
}

const lang = pickLang()
const copy = COPY[lang] || COPY.zh
document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN'
document.title = lang === 'en' ? 'Beijing Parkour · Panda Jump' : '北京跑酷 · 熊猫跳跳'
{
  const h1 = el.overlay.querySelector('h1')
  const sub = el.overlay.querySelector('.sub')
  const blink = el.overlay.querySelector('.blink')
  const tips = document.getElementById('tips')
  if (h1) h1.innerHTML = copy.title
  if (sub) sub.innerHTML = copy.sub
  if (blink) blink.textContent = copy.start
  if (tips) tips.textContent = copy.tips
}

anyKeyHook = () => {
  phase = 'play'
  startT = performance.now()
  el.overlay.classList.add('hidden')
  gameplayStart()
}

function doRespawn(fell) {
  player.pos.copy(respawn.pos)
  player.pos.y += 0.1
  player.vx = player.vy = player.vz = 0
  if (fell) {
    sfx.fall()
    toast(lang === 'en'
      ? `Fell on the street! Back to ${respawn.name}`
      : '掉到马路上啦!回到 ' + respawn.name)
  }
}

function winRace() {
  phase = 'win'
  winTime = performance.now() - startT
  sfx.win()
  gameplayStop()
  happytime()
  el.overlay.classList.remove('hidden')
  el.overlay.innerHTML = `
    <h1>${copy.win}</h1>
    <div class="sub">
      ${copy.coins(fmt(winTime), coinCount)}
    </div>
    <p class="blink">${copy.retry}</p>`
}

// ---------- 主循环 ----------
let lastT = performance.now()
let acc = 0
let frames = 0
const camPos = new THREE.Vector3(0, 6, level.startZ + 10)
const camLook = new THREE.Vector3()

function frame(now) {
  requestAnimationFrame(frame)
  frames++
  const dt = Math.min((now - lastT) / 1000, 0.05)
  lastT = now

  // 相机旋转
  if (keys.has('KeyQ')) camYaw += 1.8 * dt
  if (keys.has('KeyE')) camYaw -= 1.8 * dt

  // 移动平台
  updateMovers(level.movers, now / 1000)

  if (phase === 'play' || phase === 'win') {
    let input
    if (phase !== 'play') {
      input = { x: 0, z: 0, jumpPressed: false }
    } else if (window.__game.input) {
      input = { ...window.__game.input }
      window.__game.input.jumpPressed = false // 单次消费
    } else {
      input = readInput()
    }
    acc += dt
    while (acc >= PHYS_DT) {
      acc -= PHYS_DT
      const wasCanDouble = player.canDouble
      stepPlayer(player, input, PHYS_DT, level.colliders)
      if (player.justJumped) (wasCanDouble && !player.canDouble ? sfx.double : sfx.jump)()
      input = { ...input, jumpPressed: false } // 跳跃只作用于第一个物理子步
    }
    // 站在移动平台上跟着走
    const mv = level.movers.find((m) => m.c === player.groundC)
    if (mv) player.pos.x += mv.delta.x

    // 掉到马路上(过了广场线)→ 回检查点
    if (phase === 'play' && player.grounded && player.pos.y < 0.05 && player.pos.z < level.safeGroundZ) {
      doRespawn(true)
    }

    // 金币
    for (const c of level.coins) {
      if (c.taken) continue
      const dx = c.mesh.position.x - player.pos.x
      const dy = c.mesh.position.y - (player.pos.y + 0.8)
      const dz = c.mesh.position.z - player.pos.z
      if (dx * dx + dz * dz < 1.4 * 1.4 && Math.abs(dy) < 1.6) {
        c.taken = true
        c.mesh.visible = false
        coinCount++
        el.coins.textContent = coinCount
        sfx.coin()
      }
    }
    // 检查点
    for (const cp of level.checkpoints) {
      if (cp.active) continue
      const dx = cp.pos.x - player.pos.x
      const dz = cp.pos.z - player.pos.z
      if (dx * dx + dz * dz < cp.radius * cp.radius && Math.abs(cp.pos.y - player.pos.y) < 3) {
        cp.active = true
        cp.mesh.material = cp.mesh.material.clone()
        cp.mesh.material.emissive = new THREE.Color(0xdd2200)
        respawn = { pos: cp.pos.clone(), name: cp.name }
        el.cpName.textContent = cp.name
        toast('🚩 ' + cp.name)
        sfx.checkpoint()
      }
    }
    // 终点
    if (phase === 'play') {
      const dg = level.goal.pos.distanceTo(player.pos)
      if (dg < level.goal.radius) winRace()
    }
  }

  syncPandaMesh(player, panda, now)

  // 场景动画
  for (const c of level.clouds) {
    c.position.x += c.userData.speed * dt
    if (c.position.x > 420) c.position.x = -420
  }
  for (const c of level.coins) {
    if (c.taken) continue
    c.mesh.rotation.y = now * 0.0035 + c.phase
    c.mesh.position.y = c.baseY + Math.sin(now * 0.004 + c.phase) * 0.15
  }
  for (const p of level.props) {
    p.rotation.z = Math.sin(now * 0.0012 + p.userData.phase) * 0.05
  }
  for (const cp of level.checkpoints) {
    cp.ring.rotation.z = now * 0.001
  }
  level.goal.flag.rotation.y = Math.sin(now * 0.002) * 0.2

  // 相机跟随
  const fx = Math.sin(camYaw), fz = Math.cos(camYaw)
  const targetPos = new THREE.Vector3(
    player.pos.x - fx * 9,
    player.pos.y + 5.2,
    player.pos.z - fz * 9
  )
  const targetLook = new THREE.Vector3(
    player.pos.x + fx * 3,
    player.pos.y + 1.4,
    player.pos.z + fz * 3
  )
  camPos.lerp(targetPos, 1 - Math.exp(-7 * dt))
  camLook.lerp(targetLook, 1 - Math.exp(-10 * dt))
  camera.position.copy(camPos)
  camera.lookAt(camLook)

  // 阳光跟随
  sun.position.set(player.pos.x + 50, 90, player.pos.z + 30)
  sun.target.position.set(player.pos.x, 0, player.pos.z)

  // HUD
  if (phase === 'play') el.time.textContent = fmt(now - startT)
  const prog = Math.max(0, Math.min(1, (level.startZ - player.pos.z) / (level.startZ - level.endZ)))
  el.bar.style.width = (prog * 100).toFixed(1) + '%'

  renderer.render(scene, camera)
}
requestAnimationFrame(frame)
window.__game.ready = true
initCrazyGames().then(() => loadingStop())
