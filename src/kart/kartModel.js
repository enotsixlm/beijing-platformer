/**
 * Module 2 — procedural toon-shaded kart + driver figure.
 *
 * `buildKartModel(character)` returns `{ group, body, head, wheelPivots, wheelSpins, materials,
 * update(dt, kart), onHop(), onLand(), dispose() }`.
 * The group is meant to be a child of the physics object (which carries position/heading);
 * the model only animates local lean/pitch/spin, wheel steer/spin, squash-stretch and the driver.
 * Nose points local +Z. No canvas textures are used so the module imports cleanly in Node.
 *
 * Draw-call budget: every static part is merged into a handful of meshes with per-part colours
 * baked as vertex colours — per kart: merged body (+ one merged outline shell), merged head,
 * steering wheel, 4 wheels and a boost-flame mesh that is only visible while boosting.
 */
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { makeToonMaterial } from '../core/toon.js'
import { clamp, damp } from '../core/rng.js'

const WHEEL_RADIUS = 0.33
const OUTLINE_SCALE = 1.035
const COL_DARK = '#2a2d3a'
const COL_CHROME = '#d6dbe6'
const COL_TYRE = '#1e1e26'
const COL_WHITE = '#ffffff'

// ─────────────────────────── shared geometry cache ───────────────────────────

let G = null
function geo() {
  if (G) return G
  const rotX = (g, a) => { g.rotateX(a); return g }
  const rotZ = (g, a) => { g.rotateZ(a); return g }
  const scl = (g, x, y, z) => { g.scale(x, y, z); return g }
  G = {
    chassis: new THREE.BoxGeometry(1.25, 0.34, 1.9),
    deck: new THREE.BoxGeometry(0.9, 0.16, 1.0),
    nose: rotX(new THREE.ConeGeometry(0.42, 0.78, 12), Math.PI / 2),
    noseStripe: new THREE.BoxGeometry(0.16, 0.06, 0.9),
    sidePod: new THREE.BoxGeometry(0.28, 0.26, 1.15),
    bumper: new THREE.BoxGeometry(1.35, 0.14, 0.14),
    engine: new THREE.BoxGeometry(0.85, 0.42, 0.5),
    engineFin: new THREE.BoxGeometry(0.9, 0.05, 0.42),
    exhaust: rotX(new THREE.CylinderGeometry(0.075, 0.1, 0.48, 10), Math.PI / 2),
    flame: rotX(new THREE.ConeGeometry(0.11, 0.6, 8), -Math.PI / 2),
    spoiler: new THREE.BoxGeometry(1.5, 0.06, 0.4),
    spoilerEnd: new THREE.BoxGeometry(0.06, 0.16, 0.42),
    strut: new THREE.BoxGeometry(0.06, 0.34, 0.06),
    seatBack: new THREE.BoxGeometry(0.58, 0.55, 0.12),
    seatBase: new THREE.BoxGeometry(0.58, 0.1, 0.45),
    tyre: rotZ(new THREE.CylinderGeometry(WHEEL_RADIUS, WHEEL_RADIUS, 0.3, 16), Math.PI / 2),
    hub: rotZ(new THREE.CylinderGeometry(0.17, 0.17, 0.32, 10), Math.PI / 2),
    hubBolt: rotZ(new THREE.CylinderGeometry(0.06, 0.06, 0.36, 6), Math.PI / 2),
    steering: rotX(new THREE.TorusGeometry(0.17, 0.03, 8, 18), Math.PI / 2),
    steeringBar: new THREE.BoxGeometry(0.3, 0.04, 0.04),
    column: new THREE.CylinderGeometry(0.03, 0.03, 0.38, 8),
    torso: new THREE.BoxGeometry(0.52, 0.48, 0.42),
    stripe: new THREE.BoxGeometry(0.54, 0.12, 0.44),
    shoulder: new THREE.SphereGeometry(0.1, 10, 8),
    arm: new THREE.CylinderGeometry(0.06, 0.055, 0.46, 8),
    hand: new THREE.SphereGeometry(0.085, 10, 8),
    neck: new THREE.CylinderGeometry(0.1, 0.12, 0.12, 10),
    headRound: new THREE.SphereGeometry(0.33, 20, 14),
    headBox: new THREE.BoxGeometry(0.56, 0.52, 0.52),
    headEgg: scl(new THREE.SphereGeometry(0.3, 20, 14), 1, 1.2, 1),
    headWide: scl(new THREE.SphereGeometry(0.32, 20, 14), 1.25, 0.82, 1),
    face: scl(new THREE.SphereGeometry(0.26, 16, 12), 1, 1.15, 0.55),
    eye: new THREE.SphereGeometry(0.075, 12, 10),
    eyeBig: new THREE.SphereGeometry(0.1, 12, 10),
    pupil: new THREE.SphereGeometry(0.038, 8, 6),
    pupilBig: new THREE.SphereGeometry(0.05, 8, 6),
    bulge: new THREE.SphereGeometry(0.115, 12, 10),
    patch: scl(new THREE.SphereGeometry(0.11, 12, 10), 1, 1.35, 0.45),
    brow: new THREE.BoxGeometry(0.2, 0.06, 0.08),
    visor: new THREE.BoxGeometry(0.46, 0.13, 0.08),
    earRound: new THREE.SphereGeometry(0.115, 12, 10),
    earPointy: new THREE.ConeGeometry(0.1, 0.28, 8),
    earInner: new THREE.ConeGeometry(0.055, 0.17, 8),
    horn: new THREE.ConeGeometry(0.07, 0.32, 8),
    antenna: new THREE.CylinderGeometry(0.02, 0.02, 0.26, 6),
    antennaBall: new THREE.SphereGeometry(0.065, 10, 8),
    tuft: new THREE.ConeGeometry(0.1, 0.24, 7),
    muzzle: scl(new THREE.SphereGeometry(0.15, 14, 10), 1.25, 0.8, 1),
    noseTip: new THREE.SphereGeometry(0.05, 8, 6),
    snout: new THREE.BoxGeometry(0.28, 0.2, 0.3),
    beak: rotX(new THREE.ConeGeometry(0.09, 0.3, 8), Math.PI / 2),
    cheek: scl(new THREE.SphereGeometry(0.07, 8, 6), 1, 0.7, 0.5),
    belly: scl(new THREE.SphereGeometry(0.2, 12, 10), 1, 1.1, 0.4),
  }
  return G
}

// ─────────────────────────── merge helpers ───────────────────────────

const _m = new THREE.Matrix4()
const _q = new THREE.Quaternion()
const _e = new THREE.Euler()
const _p = new THREE.Vector3()
const _s = new THREE.Vector3(1, 1, 1)
const _c = new THREE.Color()

function colorize(g, hex) {
  _c.set(hex)
  const n = g.attributes.position.count
  const arr = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    arr[i * 3] = _c.r
    arr[i * 3 + 1] = _c.g
    arr[i * 3 + 2] = _c.b
  }
  g.setAttribute('color', new THREE.BufferAttribute(arr, 3))
}

/** Collects transformed, vertex-coloured part copies and merges them into one geometry. */
class Merger {
  constructor(withOutline = false) {
    this.parts = []
    this.outline = withOutline ? [] : null
  }
  /** @param {number[]|null} rot Euler xyz radians */
  add(geometry, color, x = 0, y = 0, z = 0, rot = null) {
    _e.set(rot ? rot[0] : 0, rot ? rot[1] : 0, rot ? rot[2] : 0)
    _m.compose(_p.set(x, y, z), _q.setFromEuler(_e), _s)
    const g = geometry.clone().applyMatrix4(_m)
    colorize(g, color)
    this.parts.push(g)
    if (this.outline) {
      // inflate each part about its own centre (same look as a per-mesh back-face outline)
      this.outline.push(geometry.clone().scale(OUTLINE_SCALE, OUTLINE_SCALE, OUTLINE_SCALE).applyMatrix4(_m))
    }
    return this
  }
  build() {
    const merged = mergeGeometries(this.parts, false)
    for (const p of this.parts) p.dispose()
    let outline = null
    if (this.outline) {
      outline = mergeGeometries(this.outline, false)
      for (const p of this.outline) p.dispose()
    }
    return { merged, outline }
  }
}

// ─────────────────────────── per-character geometry cache ───────────────────────────

const GEO_CACHE = new Map()

function characterGeometry(character) {
  const key = character.id
  let entry = GEO_CACHE.get(key)
  if (entry) return entry
  const g = geo()
  const fig = character.figure || {}
  const body = character.color
  const accent = character.secondary || COL_WHITE
  const skin = fig.skin || '#dddddd'
  const suit = fig.suit || accent

  // ── body: chassis + engine + spoiler + seat + column + driver torso/arms ──
  const B = new Merger(true)
  B.add(g.chassis, body, 0, 0.42, 0)
  B.add(g.deck, COL_DARK, 0, 0.62, 0.05)
  B.add(g.nose, body, 0, 0.42, 1.3)
  B.add(g.noseStripe, accent, 0, 0.6, 0.9)
  B.add(g.sidePod, accent, -0.72, 0.36, 0.05)
  B.add(g.sidePod, accent, 0.72, 0.36, 0.05)
  B.add(g.bumper, COL_DARK, 0, 0.32, -0.98)
  B.add(g.engine, COL_DARK, 0, 0.66, -0.78)
  B.add(g.engineFin, COL_CHROME, 0, 0.9, -0.78)
  B.add(g.exhaust, COL_CHROME, -0.24, 0.72, -1.12, [-0.25, 0, 0])
  B.add(g.exhaust, COL_CHROME, 0.24, 0.72, -1.12, [-0.25, 0, 0])
  B.add(g.strut, COL_CHROME, -0.5, 0.95, -0.92)
  B.add(g.strut, COL_CHROME, 0.5, 0.95, -0.92)
  B.add(g.spoiler, accent, 0, 1.14, -0.95, [-0.18, 0, 0])
  B.add(g.spoilerEnd, body, -0.75, 1.17, -0.95)
  B.add(g.spoilerEnd, body, 0.75, 1.17, -0.95)
  B.add(g.seatBase, COL_DARK, 0, 0.7, -0.15)
  B.add(g.seatBack, accent, 0, 0.98, -0.42, [0.15, 0, 0])
  B.add(g.column, COL_CHROME, 0, 0.78, 0.5, [-0.6, 0, 0])
  // driver (torso at 0, 0.72, -0.12)
  const dx = 0, dy = 0.72, dz = -0.12
  B.add(g.torso, suit, dx, dy + 0.3, dz)
  B.add(g.stripe, accent, dx, dy + 0.3, dz)
  if (fig.belly) B.add(g.belly, fig.belly, dx, dy + 0.3, dz + 0.2)
  for (const side of [-1, 1]) {
    B.add(g.shoulder, suit, dx + side * 0.3, dy + 0.5, dz + 0.02)
    B.add(g.arm, suit, dx + side * 0.3, dy + 0.42, dz + 0.28, [-1.15, 0, 0])
    B.add(g.hand, skin, dx + side * 0.22, dy + 0.33, dz + 0.5)
  }
  B.add(g.neck, skin, dx, dy + 0.58, dz)
  const bodyBuilt = B.build()

  // ── head (local origin = head centre) ──
  const H = new Merger(false)
  const headGeo = { round: g.headRound, box: g.headBox, egg: g.headEgg, wide: g.headWide }[fig.head] || g.headRound
  H.add(headGeo, skin)
  const headR = fig.head === 'box' ? 0.27 : fig.head === 'egg' ? 0.3 : 0.32
  const headTop = fig.head === 'box' ? 0.26 : fig.head === 'egg' ? 0.36 : fig.head === 'wide' ? 0.26 : 0.33
  if (fig.face) H.add(g.face, fig.face, 0, -0.02, headR - 0.14)

  const eyes = fig.eyes || { type: 'dot' }
  const pupil = eyes.pupil || '#111111'
  const eyeY = fig.head === 'wide' ? 0.12 : 0.06
  if (eyes.type === 'visor') {
    H.add(g.visor, eyes.color || '#22e5ff', 0, 0.04, headR)
  } else if (eyes.type === 'bulge') {
    for (const side of [-1, 1]) {
      H.add(g.bulge, COL_WHITE, side * 0.2, 0.22, headR - 0.14)
      H.add(g.pupilBig, pupil, side * 0.2, 0.24, headR - 0.04)
    }
  } else {
    const big = eyes.type === 'big'
    const eyeCol = eyes.color || COL_WHITE
    for (const side of [-1, 1]) {
      if (eyes.patches) H.add(g.patch, eyes.patches, side * 0.14, eyeY, headR - 0.06)
      H.add(big ? g.eyeBig : g.eye, eyeCol, side * 0.13, eyeY, headR - 0.03)
      H.add(big ? g.pupilBig : g.pupil, pupil, side * 0.13, eyeY, headR + (big ? 0.06 : 0.04))
      if (eyes.brow) H.add(g.brow, eyes.brow, side * 0.13, eyeY + 0.12, headR - 0.02)
    }
  }

  const snout = fig.snout || { type: 'none' }
  if (snout.type === 'muzzle') {
    H.add(g.muzzle, snout.color || skin, 0, -0.1, headR - 0.02)
    H.add(g.noseTip, snout.nose || '#111111', 0, -0.05, headR + 0.14)
  } else if (snout.type === 'snout') {
    H.add(g.snout, snout.color || skin, 0, -0.08, headR + 0.02)
    H.add(g.noseTip, snout.nose || '#111111', -0.07, -0.03, headR + 0.17)
    H.add(g.noseTip, snout.nose || '#111111', 0.07, -0.03, headR + 0.17)
  } else if (snout.type === 'beak') {
    H.add(g.beak, snout.color || '#ff9a2a', 0, -0.04, headR + 0.08)
  }
  if (fig.cheeks) {
    H.add(g.cheek, fig.cheeks, -0.22, -0.06, headR - 0.08)
    H.add(g.cheek, fig.cheeks, 0.22, -0.06, headR - 0.08)
  }

  const ears = fig.ears || { type: 'none' }
  if (ears.type === 'round') {
    H.add(g.earRound, ears.color || skin, -0.26, headTop - 0.02, 0)
    H.add(g.earRound, ears.color || skin, 0.26, headTop - 0.02, 0)
  } else if (ears.type === 'pointy') {
    for (const side of [-1, 1]) {
      H.add(g.earPointy, ears.color || skin, side * 0.2, headTop + 0.06, 0, [0, 0, -side * 0.35])
      H.add(g.earInner, ears.inner || '#333333', side * 0.2, headTop + 0.05, 0.03, [0, 0, -side * 0.35])
    }
  } else if (ears.type === 'horns') {
    for (const side of [-1, 1]) {
      H.add(g.horn, ears.color || '#ffe0a3', side * 0.16, headTop + 0.02, -0.12, [-0.7, 0, -side * 0.3])
    }
  } else if (ears.type === 'antenna') {
    H.add(g.antenna, COL_CHROME, 0, headTop + 0.12, 0)
    H.add(g.antennaBall, ears.color || '#ffd400', 0, headTop + 0.28, 0)
  } else if (ears.type === 'tuft') {
    H.add(g.tuft, ears.color || skin, 0, headTop + 0.1, -0.02, [-0.3, 0, 0])
    H.add(g.tuft, ears.color || skin, 0.12, headTop + 0.06, -0.06, [0, 0, -0.5])
  }
  const headBuilt = H.build()

  // ── wheel: tyre + accent hub + bolt (local origin = wheel centre) ──
  const W = new Merger(false)
  W.add(g.tyre, COL_TYRE)
  W.add(g.hub, accent)
  W.add(g.hubBolt, COL_DARK)
  const wheelBuilt = W.build()

  entry = { body: bodyBuilt.merged, outline: bodyBuilt.outline, head: headBuilt.merged, wheel: wheelBuilt.merged }
  GEO_CACHE.set(key, entry)
  return entry
}

// ─────────────────────────── shared (character-independent) resources ───────────────────────────

let SHARED = null
function shared() {
  if (SHARED) return SHARED
  const g = geo()
  const S = new Merger(false)
  S.add(g.steering, COL_DARK)
  S.add(g.steeringBar, COL_DARK)
  const F = new Merger(false)
  F.add(g.flame, '#ffa020', -0.24, 0, 0)
  F.add(g.flame, '#ffa020', 0.24, 0, 0)
  const core = geo().flame.clone().scale(0.5, 0.5, 0.6)
  F.add(core, '#fff3a0', -0.24, 0, 0.1)
  F.add(core, '#fff3a0', 0.24, 0, 0.1)
  core.dispose()
  SHARED = {
    steering: S.build().merged,
    flame: F.build().merged,
    vertexToon: makeToonMaterial(0xffffff, { vertexColors: true }),
    outline: new THREE.MeshBasicMaterial({ color: 0x1b1b2a, side: THREE.BackSide }),
    flameMat: new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }),
  }
  return SHARED
}

/**
 * Build the kart + driver.
 * @param {object} character entry from CHARACTERS
 */
export function buildKartModel(character) {
  const S = shared()
  const fig = character.figure || {}
  const cg = characterGeometry(character)
  const own = [] // materials owned by this model (disposed with it)

  // one tintable toon material for the body, one for the head (star tint modulates emissive)
  const bodyMat = makeToonMaterial(0xffffff, { vertexColors: true })
  const headMat = makeToonMaterial(0xffffff, fig.metal
    ? { vertexColors: true, emissive: 0x111827, emissiveIntensity: 0.15 }
    : { vertexColors: true })
  own.push(bodyMat, headMat)
  const starMats = [bodyMat, headMat]
  const baseEmissive = starMats.map((m) => ({ color: m.emissive.clone(), intensity: m.emissiveIntensity }))

  const root = new THREE.Group()
  root.name = 'kart-model'
  const body = new THREE.Group() // everything that leans/pitches
  root.add(body)

  const bodyMesh = new THREE.Mesh(cg.body, bodyMat)
  bodyMesh.name = 'body'
  bodyMesh.castShadow = true
  bodyMesh.receiveShadow = true
  body.add(bodyMesh)
  if (cg.outline) {
    const outline = new THREE.Mesh(cg.outline, S.outline)
    outline.name = 'outline'
    body.add(outline)
  }

  const flames = new THREE.Mesh(S.flame, S.flameMat)
  flames.name = 'flames'
  flames.position.set(0, 0.68, -1.42)
  flames.visible = false
  body.add(flames)

  const steeringWheel = new THREE.Mesh(S.steering, S.vertexToon)
  steeringWheel.name = 'steering'
  steeringWheel.position.set(0, 0.95, 0.4)
  steeringWheel.rotation.x = -0.6
  body.add(steeringWheel)

  // ── wheels (front ones sit in steering pivots) ──
  const wheelPivots = []
  const wheelSpins = []
  const wheelDefs = [
    [-0.74, 0.74, true], [0.74, 0.74, true],
    [-0.74, -0.72, false], [0.74, -0.72, false],
  ]
  for (const [x, z, front] of wheelDefs) {
    const wheel = new THREE.Mesh(cg.wheel, S.vertexToon)
    wheel.name = front ? 'wheel-front' : 'wheel-rear'
    wheel.castShadow = true
    wheel.receiveShadow = true
    if (front) {
      const pivot = new THREE.Group()
      pivot.position.set(x, WHEEL_RADIUS, z)
      pivot.add(wheel)
      root.add(pivot) // wheels stay on the ground: not part of the leaning body
      wheelPivots.push(pivot)
    } else {
      wheel.position.set(x, WHEEL_RADIUS, z)
      root.add(wheel)
    }
    wheelSpins.push(wheel)
  }

  // ── driver head (torso/arms are baked into the body) ──
  const head = new THREE.Mesh(cg.head, headMat)
  head.name = 'head'
  head.castShadow = true
  head.receiveShadow = true
  head.position.set(0, 0.72 + 0.92, -0.12)
  body.add(head)

  // ─────────────────────────── animation state ───────────────────────────
  const anim = {
    steer: 0, squash: 0, baseScale: 1, wheelAngle: 0, spin: 0, starOn: false, headYaw: 0, roll: 0, pitch: 0, flame: 0,
  }
  const HEAD_Y = head.position.y

  function update(dt, kart) {
    const s = kart.state
    const speed = kart.speed
    const speedRatio = clamp(Math.abs(speed) / (kart.baseMaxSpeed || 32), 0, 1.3)
    const t = kart.time || 0

    // steering visuals
    const steerTarget = kart.steerVisualTarget ?? kart.controls.steer
    anim.steer = damp(anim.steer, steerTarget, 12, dt)
    wheelPivots[0].rotation.y = wheelPivots[1].rotation.y = anim.steer * 0.45
    steeringWheel.rotation.y = -anim.steer * 0.9

    // wheel roll
    anim.wheelAngle += (speed / WHEEL_RADIUS) * dt
    if (anim.wheelAngle > 1e4 || anim.wheelAngle < -1e4) anim.wheelAngle %= Math.PI * 2
    for (const w of wheelSpins) w.rotation.x = anim.wheelAngle

    // lean into turns + pitch with acceleration
    const driftLean = s.drifting ? s.driftDir * 0.09 : 0
    const rollTarget = -(anim.steer * 0.11 * speedRatio + driftLean)
    anim.roll = damp(anim.roll, rollTarget, 8, dt)
    const pitchTarget = clamp(-(kart.accel || 0) * 0.011, -0.16, 0.12)
    anim.pitch = damp(anim.pitch, pitchTarget, 8, dt)
    body.rotation.z = anim.roll
    body.rotation.x = anim.pitch

    // spin-out (visual only; physics heading is preserved)
    if (s.spinTimer > 0) {
      const p = 1 - clamp(s.spinTimer / (kart.spinDuration || 1.2), 0, 1)
      anim.spin = Math.PI * 4 * (1 - (1 - p) * (1 - p))
    } else {
      anim.spin = 0
    }
    root.rotation.y = anim.spin

    // squash & stretch (landing / hop) + shrink + stun
    anim.squash = damp(anim.squash, 0, 9, dt)
    anim.baseScale = damp(anim.baseScale, s.shrunk ? 0.6 : 1, 6, dt)
    const stun = s.stunTimer > 0 ? 0.25 : 0
    const sy = (1 - anim.squash * 0.25 - stun) * anim.baseScale
    const sxz = (1 + anim.squash * 0.12 + stun * 0.4) * anim.baseScale
    root.scale.set(sxz, sy, sxz)

    // driver head bob / look
    const bob = Math.sin(t * (6 + speedRatio * 10)) * 0.018 * (0.4 + speedRatio)
    head.position.y = HEAD_Y + bob + (s.airborne ? 0.05 : 0)
    head.rotation.z = anim.steer * 0.12
    anim.headYaw = damp(anim.headYaw, s.drifting ? s.driftDir * 0.45 : anim.steer * 0.15, 6, dt)
    head.rotation.y = anim.headYaw

    // exhaust flames when boosting
    const flameTarget = s.boostTimer > 0 ? 1 : 0
    anim.flame = damp(anim.flame, flameTarget, 14, dt)
    if (anim.flame > 0.03) {
      flames.visible = true
      const flick = 0.75 + 0.25 * Math.sin(t * 45) + 0.1 * Math.sin(t * 71)
      const sc = anim.flame * flick
      flames.scale.set(sc, sc, sc * 1.4)
    } else {
      flames.visible = false
    }

    // star: rainbow cycling emissive tint on the whole kart
    if (s.starTimer > 0) {
      const hue = (t * 1.3) % 1
      for (let i = 0; i < starMats.length; i++) {
        starMats[i].emissive.setHSL((hue + i * 0.15) % 1, 1, 0.5)
        starMats[i].emissiveIntensity = 0.75
      }
      anim.starOn = true
    } else if (anim.starOn) {
      for (let i = 0; i < starMats.length; i++) {
        starMats[i].emissive.copy(baseEmissive[i].color)
        starMats[i].emissiveIntensity = baseEmissive[i].intensity
      }
      anim.starOn = false
    }
  }

  function onHop() { anim.squash = -0.6 }
  function onLand() { anim.squash = 1 }

  function dispose() {
    for (const m of own) m.dispose()
    own.length = 0
    // geometries are cached per character and shared between instances; not disposed here
  }

  return {
    group: root,
    body,
    head,
    wheelPivots,
    wheelSpins,
    /** body/accent share one vertex-coloured material; skin is the head material. */
    materials: { body: bodyMat, accent: bodyMat, skin: headMat },
    update,
    onHop,
    onLand,
    dispose,
  }
}
