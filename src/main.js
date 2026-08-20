import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { LOOK, PLAYER, WORLD } from './config.js'
import { createWorld, fillArena, createVoxelView, rayVoxel } from './voxel.js'
import { createCowboy, createPlayerState, lookDir, rightDir, stepPlayer, syncCowboy } from './player.js'
import { createDebris, createPuffs } from './debris.js'
import { createDummies, updateDummies } from './dummies.js'
import {
  createLoadout, currentWeapon, setSlot, startReload, stepLoadout,
  tryFire, stepRockets, makeTracer, makeMuzzle,
} from './combat.js'
import { paintWeaponIcons, showDamage, bindHud, syncHud } from './hud.js'
import { createAudio } from './audio.js'
import { addDecor, stepDecor } from './decor.js'

const PHYS = 1 / 120

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = LOOK.exposure
renderer.domElement.id = 'game'
document.body.prepend(renderer.domElement)

const scene = new THREE.Scene()
scene.background = new THREE.Color(LOOK.bg)
scene.fog = new THREE.Fog(LOOK.bg, LOOK.fogNear, LOOK.fogFar)

const camera = new THREE.PerspectiveCamera(LOOK.fov, innerWidth / innerHeight, 0.08, 200)

const hemi = new THREE.HemisphereLight(0x3a88a8, 0x080c10, 0.48)
scene.add(hemi)
const key = new THREE.DirectionalLight(0xd8e8f4, 0.46)
key.position.set(14, 26, 10)
key.castShadow = true
key.shadow.mapSize.set(1024, 1024)
key.shadow.camera.near = 2
key.shadow.camera.far = 80
key.shadow.camera.left = key.shadow.camera.bottom = -30
key.shadow.camera.right = key.shadow.camera.top = 30
scene.add(key)

const fill = new THREE.PointLight(0x2ee8ff, 1.15, 48, 1.6)
fill.position.set(0, 3.4, 3)
scene.add(fill)

const VignetteShader = {
  uniforms: {
    tDiffuse: { value: null },
    offset: { value: 1.05 },
    darkness: { value: 1.22 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float offset;
    uniform float darkness;
    varying vec2 vUv;
    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      vec2 uv = (vUv - 0.5) * vec2(offset);
      float vig = clamp(pow(1.0 - dot(uv, uv), darkness), 0.0, 1.0);
      gl_FragColor = vec4(texel.rgb * mix(vec3(1.0), vec3(vig), 0.72), texel.a);
    }
  `,
}

let composer = null
try {
  composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  const bloom = new UnrealBloomPass(
    new THREE.Vector2(innerWidth, innerHeight),
    LOOK.bloomStrength,
    LOOK.bloomRadius,
    LOOK.bloomThreshold,
  )
  composer.addPass(bloom)
  composer.addPass(new ShaderPass(VignetteShader))
  composer.addPass(new OutputPass())
} catch {
  composer = null
}

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
  composer?.setSize(innerWidth, innerHeight)
})

const world = createWorld()
fillArena(world)
const voxels = createVoxelView(scene)
voxels.rebuild(world)

const player = createPlayerState()
const cowboy = createCowboy()
scene.add(cowboy.root)
const rim = new THREE.PointLight(0xffc080, 1.15, 7, 2)
cowboy.root.add(rim)
rim.position.set(0.45, 1.45, 0.85)

const debris = createDebris(scene)
const puffs = createPuffs(scene)
const dummies = createDummies(scene)
const decor = addDecor(scene)
const loadout = createLoadout()
const rockets = []
const tracers = []
const flashes = []
const audio = createAudio()
const hud = bindHud()
paintWeaponIcons(hud.slots.map((s) => s.querySelector('canvas')))

const combatCtx = {
  world, dummies, debris, scene, rockets,
  loadout, origin: new THREE.Vector3(), aim: new THREE.Vector3(),
  fireHeld: false, firePressed: false,
  dirty: false, carved: 0,
  onExplode(p) {
    player.shake = Math.max(player.shake, 0.38)
    audio.boom()
    showDamage(hud.dmgLayer, renderer, camera, p, 18)
  },
}

const keys = new Set()
const input = { x: 0, z: 0, jump: false, dash: false }
let jumpQueued = false
let dashQueued = false
let fireHeld = false
let fireQueued = false
let phase = 'ready'
let pointerLocked = false
let frames = 0
let fps = 60
let fpsT = 0
let fpsN = 0

window.addEventListener('keydown', (e) => {
  if (['Space', 'ShiftLeft', 'ShiftRight'].includes(e.code)) e.preventDefault()
  if (e.repeat) return
  keys.add(e.code)
  audio.init()
  if (e.code === 'Space') jumpQueued = true
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') dashQueued = true
  if (e.code === 'KeyR') { if (startReload(loadout)) audio.reload() }
  if (e.code === 'Digit1') setSlot(loadout, 0)
  if (e.code === 'Digit2') setSlot(loadout, 1)
  if (e.code === 'Digit3') setSlot(loadout, 2)
  if (e.code === 'Digit4') setSlot(loadout, 3)
})
window.addEventListener('keyup', (e) => keys.delete(e.code))
window.addEventListener('mousedown', (e) => {
  if (e.button === 0) { fireHeld = true; fireQueued = true }
})
window.addEventListener('mouseup', (e) => { if (e.button === 0) fireHeld = false })
window.addEventListener('wheel', (e) => {
  const dir = e.deltaY > 0 ? 1 : -1
  setSlot(loadout, (loadout.slot + dir + 4) % 4)
})
window.addEventListener('mousemove', (e) => {
  if (!pointerLocked || phase !== 'play') return
  player.yaw -= e.movementX * PLAYER.mouseSens
  player.pitch -= e.movementY * PLAYER.mouseSens
  player.pitch = Math.max(-1.15, Math.min(1.2, player.pitch))
})
document.addEventListener('pointerlockchange', () => {
  pointerLocked = document.pointerLockElement === renderer.domElement
})

function startGame() {
  phase = 'play'
  hud.overlay.classList.add('hidden')
  audio.init()
  snapCamera()
  renderer.domElement.requestPointerLock?.()
}

hud.overlay.addEventListener('click', startGame)

function readMove() {
  const f = (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) - (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0)
  const r = (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0)
  return { x: r, z: f }
}

function solidCell(ix, iy, iz) {
  return world.get(ix - WORLD.originX, iy - WORLD.originY, iz - WORLD.originZ) !== 0
}

const _look = new THREE.Vector3()
const _right = new THREE.Vector3()
const _camTarget = new THREE.Vector3()
const _desired = new THREE.Vector3()
const camPos = new THREE.Vector3(0, 4, 16)

function desiredCamera() {
  lookDir(player.yaw, player.pitch, _look)
  rightDir(player.yaw, _right)
  _camTarget.copy(player.pos)
  _camTarget.y += PLAYER.camHeight
  _camTarget.addScaledVector(_right, PLAYER.camShoulder)
  _desired.copy(_camTarget).addScaledVector(_look, -PLAYER.camDist)
  const hit = rayVoxel(world, _camTarget, _desired.clone().sub(_camTarget).normalize(), PLAYER.camDist)
  if (hit && hit.t < PLAYER.camDist - 0.2) {
    _desired.copy(_camTarget).addScaledVector(_look, -(Math.max(0.45, hit.t - 0.25)))
  }
  return _desired
}

function snapCamera() {
  camPos.copy(desiredCamera())
  camera.position.copy(camPos)
  camera.lookAt(_camTarget.clone().addScaledVector(_look, 6))
}

function updateCamera(dt) {
  desiredCamera()
  camPos.lerp(_desired, 1 - Math.exp(-14 * dt))
  if (player.shake > 0) {
    camPos.x += (Math.random() - 0.5) * player.shake
    camPos.y += (Math.random() - 0.5) * player.shake * 0.6
    player.shake *= Math.exp(-8 * dt)
  }
  camera.position.copy(camPos)
  camera.lookAt(_camTarget.clone().addScaledVector(_look, 6))
}

function muzzleWorld() {
  const gun = cowboy.guns[currentWeapon(loadout).id]
  const local = gun.userData.muzzle.clone()
  return gun.localToWorld(local)
}

function handleFire() {
  lookDir(player.yaw, player.pitch, combatCtx.aim)
  combatCtx.origin.copy(camera.position).addScaledVector(combatCtx.aim, 0.9)
  combatCtx.fireHeld = fireHeld || !!window.__game.input?.fireHeld
  combatCtx.firePressed = fireQueued || !!window.__game.input?.fire
  const result = tryFire(combatCtx)
  if (result) {
    fireQueued = false
    if (window.__game.input) window.__game.input.fire = false
  }
  if (!result) return
  const w = result.weapon
  audio[w.id === 'blockbuster' ? 'rocket' : w.id === 'scattergun' ? 'scatter' : w.id === 'autogun' ? 'autogun' : 'cannon']()
  const mz = muzzleWorld()
  flashes.push(makeMuzzle(scene, mz))
  for (const shot of result.shots) {
    if (w.tracer && shot.point) tracers.push(makeTracer(scene, mz.clone(), shot.point, w.tracer))
    if (shot.kind === 'dummy' && shot.removed) {
      audio.dummy()
      showDamage(hud.dmgLayer, renderer, camera, shot.point, shot.removed)
    }
  }
  if (combatCtx.dirty) {
    voxels.rebuild(world)
    combatCtx.dirty = false
  }
}

function stepFx(dt) {
  for (let i = tracers.length - 1; i >= 0; i--) {
    const t = tracers[i]
    t.life -= dt
    const k = Math.max(0, t.life / 0.09)
    if (t.core) {
      t.core.material.opacity = k
      t.glow.material.opacity = k * 0.38
    }
    if (t.life <= 0) {
      scene.remove(t.mesh)
      t.core?.geometry.dispose()
      t.glow?.geometry.dispose()
      t.mesh.geometry?.dispose()
      tracers.splice(i, 1)
    }
  }
  for (let i = flashes.length - 1; i >= 0; i--) {
    const f = flashes[i]
    f.life -= dt
    f.light.intensity = 5.8 * (f.life / 0.055)
    if (f.corona) f.corona.material.opacity = 0.75 * (f.life / 0.055)
    if (f.life <= 0) {
      scene.remove(f.light); scene.remove(f.flash)
      if (f.corona) scene.remove(f.corona)
      flashes.splice(i, 1)
    }
  }
}

let last = performance.now()
let acc = 0
let simNow = 0
function tick(dt, now) {
  frames++
  fpsT += dt
  fpsN++
  if (fpsT >= 0.4) { fps = Math.round(fpsN / fpsT); fpsT = 0; fpsN = 0 }

  if (phase === 'play' || window.__game?.forcePlay) {
    const mv = window.__game?.input ? { x: window.__game.input.x || 0, z: window.__game.input.z || 0 } : readMove()
    input.x = mv.x
    input.z = mv.z
    input.jump = jumpQueued || !!window.__game?.input?.jump
    input.dash = dashQueued || !!window.__game?.input?.dash
    jumpQueued = false
    dashQueued = false
    if (window.__game?.input) {
      window.__game.input.jump = false
      window.__game.input.dash = false
    }

    acc += dt
    while (acc >= PHYS) {
      acc -= PHYS
      stepPlayer(player, input, PHYS, solidCell)
      input.jump = false
      input.dash = false
    }
    if (player.pos.y < -6) {
      player.pos.set(0, 1.05, 12)
      player.vel.set(0, 0, 0)
    }
    if (player.justDashed) { audio.dash(); puffs.puff(player.pos.x, player.pos.y + 0.15, player.pos.z) }
    if (player.justJumped) audio.jump()
    if (Math.hypot(player.vel.x, player.vel.z) > 2 && player.grounded && frames % 8 === 0) {
      puffs.puff(player.pos.x, player.pos.y + 0.08, player.pos.z)
    }

    stepLoadout(loadout, dt)
    handleFire()
    stepRockets(combatCtx, dt)
    if (combatCtx.dirty) { voxels.rebuild(world); combatCtx.dirty = false }
    updateDummies(dummies, dt)
  }

  debris.update(dt)
  puffs.update(dt)
  stepFx(dt)
  stepDecor(decor, now / 1000)
  const moving = Math.hypot(player.vel.x, player.vel.z) > 0.4
  syncCowboy(player, cowboy, now, moving)
  for (const [id, gun] of Object.entries(cowboy.guns)) gun.visible = id === currentWeapon(loadout).id
  updateCamera(dt)
  syncHud(hud, player, loadout, currentWeapon(loadout), fps)
}

function frame(now) {
  requestAnimationFrame(frame)
  const dt = Math.min(0.05, (now - last) / 1000)
  last = now
  simNow = now
  tick(dt, now)
  if (composer) composer.render()
  else renderer.render(scene, camera)
}
syncCowboy(player, cowboy, 0, false)
snapCamera()
requestAnimationFrame(frame)

window.__game = {
  ready: true,
  input: null,
  start: startGame,
  teleport(x, y, z) { player.pos.set(x, y, z); player.vel.set(0, 0, 0); snapCamera() },
  look(yaw, pitch) { player.yaw = yaw; player.pitch = pitch; snapCamera() },
  aimAt(x, y, z) {
    const target = new THREE.Vector3(x, y, z)
    const from = player.pos.clone()
    from.y += PLAYER.camHeight
    player.yaw = Math.atan2(target.x - from.x, -(target.z - from.z))
    from.add(rightDir(player.yaw, new THREE.Vector3()).multiplyScalar(PLAYER.camShoulder))
    const d = target.sub(from).normalize()
    player.yaw = Math.atan2(d.x, -d.z)
    player.pitch = Math.asin(Math.max(-1, Math.min(1, d.y)))
    snapCamera()
  },
  fire() { fireQueued = true; fireHeld = true; setTimeout(() => { fireHeld = false }, 40) },
  holdFire(on) { fireHeld = !!on },
  slot(n) { setSlot(loadout, n) },
  reload() { startReload(loadout) },
  advance(ms) {
    const dt = 1 / 60
    const n = Math.max(1, Math.ceil(ms / (dt * 1000)))
    for (let i = 0; i < n; i++) {
      simNow += dt * 1000
      tick(dt, simNow)
    }
    if (composer) composer.render()
    else renderer.render(scene, camera)
  },
  state() {
    return {
      phase, frames, fps,
      pos: { x: +player.pos.x.toFixed(2), y: +player.pos.y.toFixed(2), z: +player.pos.z.toFixed(2) },
      grounded: player.grounded,
      slot: loadout.slot,
      ammo: loadout.ammo[loadout.slot],
      mag: currentWeapon(loadout).mag,
      reloading: loadout.reloading,
      carved: combatCtx.carved,
      dummies: dummies.map((d) => ({
        dead: d.dead,
        left: d.cells.filter((c) => c.alive).length,
        base: d.baseCount,
      })),
      hp: player.hp,
      yaw: +player.yaw.toFixed(3),
      pitch: +player.pitch.toFixed(3),
      rockets: combatCtx.rockets.length,
      carved: combatCtx.carved,
    }
  },
}
