import * as THREE from 'three'
import { COURSES, THEMES, buildCourse, updateCourseFx, sampleAt, pointAt } from './track.js'
import { DIFFS, spawnField, stepRacer, collectItems, tryDash, syncRacerMeshes, rankRacers, drawMinimap } from './racer.js'
import { SHIBA_KINDS, createShiba, animateShiba } from './models.js'
import { initAudio, sfx } from './sfx.js'

const PHYS_DT = 1 / 120

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
const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.2, 900)

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

let phase = 'menu' // menu | countdown | race | pause | finish
let world = null
let racers = []
let player = null
let raceTime = 0
let countdown = 3
let countdownAcc = 0
let frames = 0
let lastT = performance.now()
let acc = 0
let selectedDog = 'aka'
let selectedCourse = 0
let selectedDiff = 'normal'
let laser = { warn: 0, x: 0, mesh: null }
let menuShiba = null
let menuKind = null

const keys = new Set()
const touchSteer = { l: false, r: false }
let dashQueued = false

function readSteer() {
  if (window.__game.input && window.__game.input.steer != null) return window.__game.input.steer
  let s = 0
  if (keys.has('ArrowLeft') || keys.has('KeyA') || touchSteer.l) s -= 1
  if (keys.has('ArrowRight') || keys.has('KeyD') || touchSteer.r) s += 1
  return s
}

window.addEventListener('keydown', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault()
  if (e.repeat) return
  keys.add(e.code)
  initAudio()
  if (e.code === 'Space') {
    dashQueued = true
    if (phase === 'menu') startRace()
  }
  if (e.code === 'Enter' && phase === 'menu') startRace()
  if ((e.code === 'KeyP' || e.code === 'Escape') && (phase === 'race' || phase === 'pause')) {
    phase = phase === 'race' ? 'pause' : 'race'
    document.getElementById('pause').classList.toggle('hidden', phase !== 'pause')
  }
  if (e.code === 'KeyR' && (phase === 'finish' || phase === 'pause')) restart()
})
window.addEventListener('keyup', (e) => keys.delete(e.code))

function bindHold(id, on, off) {
  const el = document.getElementById(id)
  const down = (ev) => { ev.preventDefault(); initAudio(); on() }
  const up = (ev) => { ev.preventDefault(); off() }
  el.addEventListener('pointerdown', down)
  el.addEventListener('pointerup', up)
  el.addEventListener('pointerleave', up)
  el.addEventListener('pointercancel', up)
}
bindHold('btnL', () => { touchSteer.l = true }, () => { touchSteer.l = false })
bindHold('btnR', () => { touchSteer.r = true }, () => { touchSteer.r = false })
document.getElementById('btnDash').addEventListener('pointerdown', (e) => {
  e.preventDefault()
  initAudio()
  dashQueued = true
})
document.getElementById('btnPause').addEventListener('click', () => {
  if (phase === 'race') {
    phase = 'pause'
    document.getElementById('pause').classList.remove('hidden')
  } else if (phase === 'pause') {
    phase = 'race'
    document.getElementById('pause').classList.add('hidden')
  }
})
document.getElementById('btnResume').addEventListener('click', () => {
  phase = 'race'
  document.getElementById('pause').classList.add('hidden')
})
document.getElementById('btnQuit').addEventListener('click', () => {
  document.getElementById('pause').classList.add('hidden')
  goMenu()
})
document.getElementById('btnAgain').addEventListener('click', () => restart())
document.getElementById('btnMenu').addEventListener('click', () => goMenu())
document.getElementById('btnStart').addEventListener('click', () => { initAudio(); startRace() })

function lsKey(courseId, diff) {
  return `shiba-best:${courseId}:${diff}`
}
function loadBest(courseId, diff) {
  const v = localStorage.getItem(lsKey(courseId, diff))
  return v ? Number(v) : null
}
function saveBest(courseId, diff, t) {
  const prev = loadBest(courseId, diff)
  if (prev == null || t < prev) localStorage.setItem(lsKey(courseId, diff), String(t))
}
function loadBank() {
  return Number(localStorage.getItem('shiba-bank') || '0')
}
function saveBank(n) {
  localStorage.setItem('shiba-bank', String(n))
}

function fmt(ms) {
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  const t = Math.floor((ms % 1000) / 100)
  return `${m}:${String(s).padStart(2, '0')}.${t}`
}

function clearWorld() {
  if (world) {
    scene.remove(world.group, world.hemi, world.sun, world.sun.target)
    if (laser.mesh) { scene.remove(laser.mesh); laser.mesh = null }
  }
  racers = []
  player = null
  world = null
}

function applyTheme(theme) {
  scene.background = new THREE.Color(theme.sky)
  scene.fog = new THREE.Fog(theme.fog, theme.fogNear, theme.fogFar)
  renderer.toneMappingExposure = theme === THEMES.shiva ? 1.4 : 1.15
}

function startRace() {
  hideMenuShiba()
  clearWorld()
  const def = COURSES[selectedCourse]
  world = buildCourse(scene, def)
  applyTheme(world.theme)
  racers = spawnField(world.track, selectedDog, world.group)
  player = racers[0]
  world.track._jumps = world.items.jumps
  raceTime = 0
  countdown = 3
  countdownAcc = 0
  phase = 'countdown'
  dashQueued = false
  document.getElementById('menu').classList.add('hidden')
  document.getElementById('hud').classList.remove('hidden')
  document.getElementById('touch').classList.remove('hidden')
  document.getElementById('finish').classList.add('hidden')
  document.getElementById('pause').classList.add('hidden')
  document.getElementById('count').classList.remove('hidden')
  document.getElementById('count').textContent = '3'
  sfx.countdown(3)
  if (world.def.lasers) {
    const g = new THREE.Group()
    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 40, 6),
      new THREE.MeshBasicMaterial({ color: 0xff3355, transparent: true, opacity: 0.0 })
    )
    beam.rotation.x = Math.PI / 2
    g.add(beam)
    g.userData.beam = beam
    scene.add(g)
    laser = { warn: 0, x: 0, mesh: g }
  }
}

function restart() {
  document.getElementById('finish').classList.add('hidden')
  document.getElementById('pause').classList.add('hidden')
  startRace()
}

function goMenu() {
  phase = 'menu'
  clearWorld()
  applyTheme(THEMES.day)
  document.getElementById('menu').classList.remove('hidden')
  document.getElementById('hud').classList.add('hidden')
  document.getElementById('touch').classList.add('hidden')
  document.getElementById('finish').classList.add('hidden')
  document.getElementById('pause').classList.add('hidden')
  document.getElementById('count').classList.add('hidden')
  showMenuShiba()
  refreshMenu()
}

function finishRace() {
  phase = 'finish'
  sfx.win()
  saveBest(world.def.id, selectedDiff, raceTime)
  saveBank(loadBank() + player.coins)
  const el = document.getElementById('finish')
  el.classList.remove('hidden')
  document.getElementById('finishTitle').textContent = player.place === 1 ? '優勝！ SHIBA DASH!!' : `${player.place}位 ゴール`
  document.getElementById('finishStats').innerHTML = `
    用时 ${fmt(raceTime)}　周回 ${DIFFS[selectedDiff].laps}<br>
    金币 ${player.coins}　名次 ${player.place} / 8
  `
}

const camPos = new THREE.Vector3(0, 8, 12)
const camLook = new THREE.Vector3()

function stepLaser(dt) {
  if (!world?.def.lasers || !laser.mesh || !player) return
  const beam = laser.mesh.userData.beam
  if (player.place !== 1 || phase !== 'race') {
    beam.material.opacity = 0
    laser.warn = 0
    return
  }
  laser.warn += dt
  const p = pointAt(world.track, player.s + 6, laser.x)
  laser.mesh.position.copy(p)
  laser.mesh.position.y += 6
  if (laser.warn < 1.6) {
    beam.material.opacity = 0.15 + Math.sin(laser.warn * 20) * 0.1
    beam.material.color.setHex(0xffcc33)
    laser.x = THREE.MathUtils.lerp(laser.x, player.lateral, 0.04)
  } else if (laser.warn < 2.1) {
    beam.material.opacity = 0.85
    beam.material.color.setHex(0xff2244)
    if (Math.abs(player.lateral - laser.x) < 2.2) {
      player.speed *= 0.5
      player.stunT = Math.max(player.stunT, 0.6)
      sfx.laser()
      laser.warn = 0
    }
  } else {
    laser.warn = 0
    laser.x = (Math.random() - 0.5) * world.track.width * 0.4
  }
}

function tickPhysics(dt) {
  if (!world || !player) return
  const racing = phase === 'race'
  const diff = DIFFS[selectedDiff]
  if (dashQueued) {
    dashQueued = false
    if (racing && tryDash(player)) sfx.dash()
  }
  const events = []
  for (const r of racers) {
    const input = { steer: r.isPlayer ? readSteer() : aiSteerLocal(r, dt, diff) }
    stepRacer(r, input, dt, world.track, racers, diff, racing)
    if (racing) collectItems(r, world, sfx, events)
    if (!r.finished && r.lap > diff.laps) {
      r.finished = true
      r.finishTime = raceTime
      if (r.isPlayer) finishRace()
    }
  }
  rankRacers(racers, world.track)
  for (const ev of events) {
    if (ev === 'coin') sfx.coin()
    if (ev === 'boost') sfx.boost()
    if (ev === 'sneaker') sfx.sneaker()
    if (ev === 'stick') sfx.stick()
    if (ev === 'dashReady') sfx.boost()
  }
  stepLaser(dt)
}

function aiSteerLocal(r, dt, diff) {
  r.ai.timer -= dt
  if (r.ai.timer <= 0) {
    r.ai.timer = 0.5 + Math.random() * 1.5
    r.ai.targetX = (Math.random() - 0.5) * world.track.width * 0.36
  }
  const look = 12 + r.speed * 0.4
  const future = pointAt(world.track, r.s + look, r.ai.targetX)
  const dx = future.x - r.pos.x
  const dz = future.z - r.pos.z
  const desired = Math.atan2(dx, dz)
  let err = desired - r.heading
  while (err > Math.PI) err -= Math.PI * 2
  while (err < -Math.PI) err += Math.PI * 2
  err += Math.max(-0.4, Math.min(0.4, (r.ai.targetX - r.lateral) * 0.08))
  return Math.max(-1, Math.min(1, err * 1.65 * diff.aiTurn * r.ai.skill))
}

function updateHUD() {
  if (!player || !world) return
  const diff = DIFFS[selectedDiff]
  document.getElementById('place').textContent = `${player.place}`
  document.getElementById('lap').textContent = `${Math.min(player.lap, diff.laps)}/${diff.laps}`
  document.getElementById('time').textContent = fmt(raceTime)
  document.getElementById('speed').textContent = `${Math.round(player.speed * 3.6)}`
  document.getElementById('coins').textContent = `${player.coins}`
  document.getElementById('dashA').classList.toggle('on', player.dashStock >= 1)
  document.getElementById('dashB').classList.toggle('on', player.dashStock >= 2)
  document.getElementById('courseName').textContent = world.def.name
  const best = loadBest(world.def.id, selectedDiff)
  document.getElementById('best').textContent = best == null ? '--:--.-' : fmt(best)
  const mm = document.getElementById('minimap')
  const ctx = mm.getContext('2d')
  drawMinimap(ctx, world.track, racers, mm.width, mm.height)
}

function showMenuShiba() {
  hideMenuShiba()
  menuShiba = createShiba(selectedDog)
  menuKind = selectedDog
  menuShiba.group.position.set(0, 0, 0)
  scene.add(menuShiba.group)
  applyTheme(THEMES.day)
  if (!scene.getObjectByName('menuLight')) {
    const h = new THREE.HemisphereLight(0xfff4dc, 0x7bb36a, 1.1)
    h.name = 'menuLight'
    scene.add(h)
    const s = new THREE.DirectionalLight(0xfff2c4, 1.4)
    s.name = 'menuSun'
    s.position.set(8, 14, 6)
    scene.add(s)
  }
}
function hideMenuShiba() {
  if (menuShiba) {
    scene.remove(menuShiba.group)
    menuShiba = null
  }
  const h = scene.getObjectByName('menuLight')
  const s = scene.getObjectByName('menuSun')
  if (h) scene.remove(h)
  if (s) scene.remove(s)
}

function refreshMenu() {
  document.querySelectorAll('[data-dog]').forEach((b) => {
    b.classList.toggle('sel', b.dataset.dog === selectedDog)
  })
  document.querySelectorAll('[data-course]').forEach((b) => {
    b.classList.toggle('sel', Number(b.dataset.course) === selectedCourse)
  })
  document.querySelectorAll('[data-diff]').forEach((b) => {
    b.classList.toggle('sel', b.dataset.diff === selectedDiff)
  })
  const k = SHIBA_KINDS[selectedDog]
  document.getElementById('dogStat').textContent =
    `${k.name}　${k.descZh}　最高速 ${Math.round(k.topSpeed * 3.6)} km/h　转向 ${k.turn.toFixed(1)}　Dash ${k.dash}`
  const c = COURSES[selectedCourse]
  const d = DIFFS[selectedDiff]
  const best = loadBest(c.id, selectedDiff)
  document.getElementById('courseStat').textContent =
    `${c.name} / ${c.nameZh}　${d.laps} 周　纪录 ${best == null ? '无' : fmt(best)}　累计金币 ${loadBank()}`
  if (menuKind !== selectedDog) showMenuShiba()
}

document.getElementById('dogs').addEventListener('click', (e) => {
  const b = e.target.closest('[data-dog]')
  if (!b) return
  selectedDog = b.dataset.dog
  sfx.menu()
  initAudio()
  refreshMenu()
})
document.getElementById('courses').addEventListener('click', (e) => {
  const b = e.target.closest('[data-course]')
  if (!b) return
  selectedCourse = Number(b.dataset.course)
  sfx.menu()
  initAudio()
  refreshMenu()
})
document.getElementById('diffs').addEventListener('click', (e) => {
  const b = e.target.closest('[data-diff]')
  if (!b) return
  selectedDiff = b.dataset.diff
  sfx.menu()
  initAudio()
  refreshMenu()
})

window.__game = {
  ready: false,
  input: null,
  start(opts = {}) {
    if (opts.dog) selectedDog = opts.dog
    if (opts.course != null) selectedCourse = opts.course
    if (opts.diff) selectedDiff = opts.diff
    startRace()
    // skip countdown for tests if requested
    if (opts.skipCountdown) {
      phase = 'race'
      document.getElementById('count').classList.add('hidden')
    }
  },
  skipCountdown() {
    if (phase === 'countdown') {
      phase = 'race'
      document.getElementById('count').classList.add('hidden')
    }
  },
  setSteer(v) { this.input = { ...(this.input || {}), steer: v } },
  dash() { dashQueued = true },
  teleport(s, x = 0) {
    if (!player || !world) return
    const p = pointAt(world.track, s, x)
    const sm = sampleAt(world.track, s)
    player.pos.copy(p)
    player.heading = sm.heading
    player.s = ((s % world.track.length) + world.track.length) % world.track.length
    player.lastS = player.s
    player.trackIndex = sm.index
    player.lateral = x
    player.speed = 12
    player.owner.pos.copy(p).addScaledVector(sm.tangent, -2.5)
    player.owner.vel.set(0, 0, 0)
  },
  setLap(n) { if (player) player.lap = n },
  state() {
    return {
      phase,
      frames,
      dog: selectedDog,
      course: world?.def.id || null,
      coins: player?.coins ?? 0,
      dashStock: player?.dashStock ?? 0,
      speed: player ? +player.speed.toFixed(2) : 0,
      s: player ? +player.s.toFixed(2) : 0,
      lateral: player ? +player.lateral.toFixed(2) : 0,
      lap: player?.lap ?? 0,
      place: player?.place ?? 0,
      stunT: player?.stunT ?? 0,
      stickT: player?.stickT ?? 0,
      boostT: player?.boostT ?? 0,
      pos: player ? { x: +player.pos.x.toFixed(2), y: +player.pos.y.toFixed(2), z: +player.pos.z.toFixed(2) } : null,
      owner: player ? { x: +player.owner.pos.x.toFixed(2), z: +player.owner.pos.z.toFixed(2) } : null,
      racerCount: racers.length,
      coinTotal: world?.items.coins.length ?? 0,
      trackLength: world?.track.length ?? 0,
      finished: player?.finished ?? false,
    }
  },
  nearestCoin() {
    if (!world || !player) return null
    let best = null
    let bestD = Infinity
    for (const c of world.items.coins) {
      if (c.taken) continue
      const d = Math.abs(c.s - player.s)
      const wrap = Math.min(d, world.track.length - d)
      if (wrap < bestD) { bestD = wrap; best = c }
    }
    return best ? { s: best.s, x: best.x } : null
  },
  placeOwnerOnNearestCoin() {
    const c = this.nearestCoin()
    if (!c || !player) return false
    const p = pointAt(world.track, c.s, c.x)
    player.owner.pos.set(p.x, p.y + 0.6, p.z)
    player.owner.vel.set(0, 0, 0)
    player.owner.lockT = 0.35
    return true
  },
  placeDogOnNearestCoin() {
    const c = this.nearestCoin()
    if (!c || !player) return false
    this.teleport(c.s, c.x)
    // keep owner away
    const sm = sampleAt(world.track, c.s)
    player.owner.pos.copy(player.pos).addScaledVector(sm.tangent, -4.2).addScaledVector(sm.right, 3.5)
    return true
  },
  nearestBoost() {
    if (!world) return null
    const b = world.items.boosts[0]
    return b ? { s: b.s, x: b.x } : null
  },
  nearestSneaker() {
    const sn = world?.items.sneakers[0]
    return sn ? { s: sn.s, x: sn.x } : null
  },
  placeOwnerOnSneaker() {
    const sn = world?.items.sneakers[0]
    if (!sn || !player) return false
    player.owner.pos.copy(sn.mesh.position)
    player.owner.vel.set(0, 0, 0)
    player.owner.lockT = 0.35
    return true
  },
  placeDogOnStick() {
    const st = world?.items.sticks.find((s) => !s.taken)
    if (!st || !player) return false
    this.teleport(st.s, st.x)
    return true
  },
  placeDogOnBoost() {
    const b = world?.items.boosts[0]
    if (!b || !player) return false
    this.teleport(b.s, b.x)
    player.speed = 10
    player.boostT = 0
    return true
  },
  nearestStick() {
    const st = world?.items.sticks.find((s) => !s.taken)
    return st ? { s: st.s, x: st.x } : null
  },
  giveCoins(n) {
    if (!player) return
    for (let i = 0; i < n; i++) {
      player.coins++
      player.coinBank++
      if (player.coinBank >= 15 && player.dashStock < 2) {
        player.coinBank -= 15
        player.dashStock++
      }
    }
  },
  forceFinish() {
    if (!player) return
    player.finished = true
    player.finishTime = raceTime
    finishRace()
  },
}

function frame(now) {
  requestAnimationFrame(frame)
  frames++
  const dt = Math.min((now - lastT) / 1000, 0.1)
  lastT = now

  if (phase === 'menu') {
    if (menuShiba) {
      animateShiba(menuShiba, { speed: 10, steer: Math.sin(now * 0.001) * 0.4, now, boost: false })
      menuShiba.group.rotation.y = now * 0.0008
      camera.position.set(3.2, 1.8, 4.4)
      camera.lookAt(0, 0.5, 0)
    }
    renderer.render(scene, camera)
    return
  }

  if (phase === 'countdown') {
    countdownAcc += dt
    if (countdownAcc > 1) {
      countdownAcc = 0
      countdown--
      if (countdown <= 0) {
        phase = 'race'
        document.getElementById('count').textContent = 'DASH!!'
        sfx.countdown(0)
        setTimeout(() => document.getElementById('count').classList.add('hidden'), 400)
      } else {
        document.getElementById('count').textContent = String(countdown)
        sfx.countdown(countdown)
      }
    }
  }

  if (phase === 'countdown' || phase === 'race') {
    if (phase === 'race') raceTime += dt * 1000
    acc += dt
    let steps = 0
    while (acc >= PHYS_DT && steps < 14) {
      acc -= PHYS_DT
      steps++
      tickPhysics(PHYS_DT)
    }
  }

  if (world) updateCourseFx(world, now, dt, player?.pos)
  for (const r of racers) syncRacerMeshes(r, now)

  if (player) {
    const fwdX = Math.sin(player.heading)
    const fwdZ = Math.cos(player.heading)
    const dist = 8.4 + player.speed * 0.06
    const targetPos = new THREE.Vector3(
      player.pos.x - fwdX * dist,
      player.pos.y + 4.4,
      player.pos.z - fwdZ * dist
    )
    const targetLook = new THREE.Vector3(
      player.pos.x + fwdX * 8 + player.owner.pos.x * 0.08,
      player.pos.y + 1.1,
      player.pos.z + fwdZ * 8 + player.owner.pos.z * 0.08
    )
    // look mix was wrong — look at a point ahead of dog, slight owner bias
    targetLook.set(
      player.pos.x * 0.85 + player.owner.pos.x * 0.15 + fwdX * 6,
      player.pos.y + 1.0,
      player.pos.z * 0.85 + player.owner.pos.z * 0.15 + fwdZ * 6
    )
    camPos.lerp(targetPos, 1 - Math.exp(-5.5 * dt))
    camLook.lerp(targetLook, 1 - Math.exp(-8 * dt))
    camera.position.copy(camPos)
    camera.lookAt(camLook)
    if (world) {
      world.sun.position.set(player.pos.x + 40, 70, player.pos.z + 25)
      world.sun.target.position.copy(player.pos)
    }
  }

  if (phase === 'race' || phase === 'countdown' || phase === 'finish') updateHUD()
  renderer.render(scene, camera)
}

applyTheme(THEMES.day)
showMenuShiba()
refreshMenu()
requestAnimationFrame(frame)
window.__game.ready = true
