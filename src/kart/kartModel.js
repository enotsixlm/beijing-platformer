/**
 * Module 2 — procedural toon-shaded kart + driver figure.
 *
 * `buildKartModel(character)` returns `{ group, update(dt, kart), onHop(), onLand(), dispose() }`.
 * The group is meant to be a child of the physics object (which carries position/heading);
 * the model only animates local lean/pitch/spin, wheel steer/spin, squash-stretch and the driver.
 * Nose points local +Z. No canvas textures are used so the module imports cleanly in Node.
 */
import * as THREE from 'three'
import { makeToonMaterial, addOutline } from '../core/toon.js'
import { clamp, damp } from '../core/rng.js'

const WHEEL_RADIUS = 0.33

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

// ─────────────────────────── shared materials ───────────────────────────

let SHARED = null
function shared() {
  if (SHARED) return SHARED
  SHARED = {
    tyre: makeToonMaterial(0x1e1e26),
    chrome: makeToonMaterial(0xd6dbe6),
    dark: makeToonMaterial(0x2a2d3a),
    white: makeToonMaterial(0xffffff),
    black: makeToonMaterial(0x111116),
    flame: new THREE.MeshBasicMaterial({ color: 0xffa020, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }),
    flameCore: new THREE.MeshBasicMaterial({ color: 0xfff3a0, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }),
  }
  return SHARED
}

function mesh(g, m, x = 0, y = 0, z = 0) {
  const o = new THREE.Mesh(g, m)
  o.position.set(x, y, z)
  return o
}

/**
 * Build the kart + driver.
 * @param {object} character entry from CHARACTERS
 */
export function buildKartModel(character) {
  const g = geo()
  const S = shared()
  const fig = character.figure || {}
  const own = [] // materials owned by this model (disposed with it)
  const mat = (color, opts) => { const m = makeToonMaterial(color, opts); own.push(m); return m }

  const bodyMat = mat(character.color)
  const accentMat = mat(character.secondary || '#ffffff')
  const skinMat = mat(fig.skin || '#dddddd', fig.metal ? { emissive: 0x111827, emissiveIntensity: 0.2 } : undefined)
  const suitMat = mat(fig.suit || character.secondary || '#ffffff')
  const starMats = [bodyMat, accentMat]

  const root = new THREE.Group()
  root.name = 'kart-model'
  const body = new THREE.Group() // everything that leans/pitches
  root.add(body)

  // ── chassis ──
  const chassis = mesh(g.chassis, bodyMat, 0, 0.42, 0)
  body.add(chassis)
  addOutline(chassis, 0.035).name = 'outline'
  body.add(mesh(g.deck, S.dark, 0, 0.62, 0.05))
  const nose = mesh(g.nose, bodyMat, 0, 0.42, 1.3)
  body.add(nose)
  addOutline(nose, 0.05).name = 'outline'
  body.add(mesh(g.noseStripe, accentMat, 0, 0.6, 0.9))
  body.add(mesh(g.sidePod, accentMat, -0.72, 0.36, 0.05))
  body.add(mesh(g.sidePod, accentMat, 0.72, 0.36, 0.05))
  body.add(mesh(g.bumper, S.dark, 0, 0.32, -0.98))

  // ── engine + exhausts ──
  body.add(mesh(g.engine, S.dark, 0, 0.66, -0.78))
  body.add(mesh(g.engineFin, S.chrome, 0, 0.9, -0.78))
  const exhaustL = mesh(g.exhaust, S.chrome, -0.24, 0.72, -1.12)
  const exhaustR = mesh(g.exhaust, S.chrome, 0.24, 0.72, -1.12)
  exhaustL.rotation.x = exhaustR.rotation.x = -0.25
  body.add(exhaustL, exhaustR)
  const flames = new THREE.Group()
  flames.position.set(0, 0.68, -1.42)
  const flameL = mesh(g.flame, S.flame, -0.24, 0, 0)
  const flameR = mesh(g.flame, S.flame, 0.24, 0, 0)
  const coreL = mesh(g.flame, S.flameCore, -0.24, 0, 0.1)
  const coreR = mesh(g.flame, S.flameCore, 0.24, 0, 0.1)
  coreL.scale.set(0.5, 0.5, 0.6)
  coreR.scale.set(0.5, 0.5, 0.6)
  flames.add(flameL, flameR, coreL, coreR)
  flames.visible = false
  body.add(flames)

  // ── spoiler ──
  body.add(mesh(g.strut, S.chrome, -0.5, 0.95, -0.92))
  body.add(mesh(g.strut, S.chrome, 0.5, 0.95, -0.92))
  const spoiler = mesh(g.spoiler, accentMat, 0, 1.14, -0.95)
  spoiler.rotation.x = -0.18
  body.add(spoiler)
  body.add(mesh(g.spoilerEnd, bodyMat, -0.75, 1.17, -0.95))
  body.add(mesh(g.spoilerEnd, bodyMat, 0.75, 1.17, -0.95))

  // ── seat ──
  body.add(mesh(g.seatBase, S.dark, 0, 0.7, -0.15))
  const seatBack = mesh(g.seatBack, accentMat, 0, 0.98, -0.42)
  seatBack.rotation.x = 0.15
  body.add(seatBack)

  // ── steering wheel ──
  const column = mesh(g.column, S.chrome, 0, 0.78, 0.5)
  column.rotation.x = -0.6
  body.add(column)
  const steeringWheel = new THREE.Group()
  steeringWheel.position.set(0, 0.95, 0.4)
  steeringWheel.rotation.x = -0.6
  steeringWheel.add(mesh(g.steering, S.dark))
  steeringWheel.add(mesh(g.steeringBar, S.dark))
  body.add(steeringWheel)

  // ── wheels ──
  const wheelPivots = []
  const wheelSpins = []
  const wheelDefs = [
    [-0.74, 0.74, true], [0.74, 0.74, true],
    [-0.74, -0.72, false], [0.74, -0.72, false],
  ]
  for (const [x, z, front] of wheelDefs) {
    const pivot = new THREE.Group()
    pivot.position.set(x, WHEEL_RADIUS, z)
    const spin = new THREE.Group()
    spin.add(mesh(g.tyre, S.tyre))
    spin.add(mesh(g.hub, accentMat))
    spin.add(mesh(g.hubBolt, S.dark))
    pivot.add(spin)
    root.add(pivot) // wheels stay on the ground: not part of the leaning body
    if (front) wheelPivots.push(pivot)
    wheelSpins.push(spin)
  }

  // ── driver ──
  const driver = new THREE.Group()
  driver.position.set(0, 0.72, -0.12)
  body.add(driver)
  driver.add(mesh(g.torso, suitMat, 0, 0.3, 0))
  driver.add(mesh(g.stripe, accentMat, 0, 0.3, 0))
  if (fig.belly) driver.add(mesh(g.belly, mat(fig.belly), 0, 0.3, 0.2))
  for (const side of [-1, 1]) {
    driver.add(mesh(g.shoulder, suitMat, side * 0.3, 0.5, 0.02))
    const arm = mesh(g.arm, suitMat, side * 0.3, 0.42, 0.28)
    arm.rotation.x = -1.15
    driver.add(arm)
    driver.add(mesh(g.hand, skinMat, side * 0.22, 0.33, 0.5))
  }
  driver.add(mesh(g.neck, skinMat, 0, 0.58, 0))

  const head = new THREE.Group()
  head.position.set(0, 0.92, 0)
  driver.add(head)
  const headGeo = { round: g.headRound, box: g.headBox, egg: g.headEgg, wide: g.headWide }[fig.head] || g.headRound
  const headMesh = mesh(headGeo, skinMat)
  head.add(headMesh)
  const headR = fig.head === 'box' ? 0.27 : fig.head === 'egg' ? 0.3 : 0.32
  const headTop = fig.head === 'box' ? 0.26 : fig.head === 'egg' ? 0.36 : fig.head === 'wide' ? 0.26 : 0.33
  if (fig.face) head.add(mesh(g.face, mat(fig.face), 0, -0.02, headR - 0.14))

  // eyes
  const eyes = fig.eyes || { type: 'dot' }
  const pupilMat = mat(eyes.pupil || '#111111')
  const eyeY = fig.head === 'wide' ? 0.12 : 0.06
  if (eyes.type === 'visor') {
    const visor = mesh(g.visor, mat(eyes.color || '#22e5ff', { emissive: eyes.color || '#22e5ff', emissiveIntensity: 0.8 }), 0, 0.04, headR)
    head.add(visor)
  } else if (eyes.type === 'bulge') {
    for (const side of [-1, 1]) {
      head.add(mesh(g.bulge, S.white, side * 0.2, 0.22, headR - 0.14))
      head.add(mesh(g.pupilBig, pupilMat, side * 0.2, 0.24, headR - 0.04))
    }
  } else {
    const big = eyes.type === 'big'
    const eyeMat = eyes.color ? mat(eyes.color) : S.white
    for (const side of [-1, 1]) {
      if (eyes.patches) head.add(mesh(g.patch, mat(eyes.patches), side * 0.14, eyeY, headR - 0.06))
      head.add(mesh(big ? g.eyeBig : g.eye, eyeMat, side * 0.13, eyeY, headR - 0.03))
      head.add(mesh(big ? g.pupilBig : g.pupil, pupilMat, side * 0.13, eyeY, headR + (big ? 0.06 : 0.04)))
      if (eyes.brow) head.add(mesh(g.brow, mat(eyes.brow), side * 0.13, eyeY + 0.12, headR - 0.02))
    }
  }

  // snout / muzzle / beak
  const snout = fig.snout || { type: 'none' }
  if (snout.type === 'muzzle') {
    head.add(mesh(g.muzzle, mat(snout.color || fig.skin), 0, -0.1, headR - 0.02))
    head.add(mesh(g.noseTip, mat(snout.nose || '#111111'), 0, -0.05, headR + 0.14))
  } else if (snout.type === 'snout') {
    head.add(mesh(g.snout, mat(snout.color || fig.skin), 0, -0.08, headR + 0.02))
    head.add(mesh(g.noseTip, mat(snout.nose || '#111111'), -0.07, -0.03, headR + 0.17))
    head.add(mesh(g.noseTip, mat(snout.nose || '#111111'), 0.07, -0.03, headR + 0.17))
  } else if (snout.type === 'beak') {
    head.add(mesh(g.beak, mat(snout.color || '#ff9a2a'), 0, -0.04, headR + 0.08))
  }
  if (fig.cheeks) {
    const cm = mat(fig.cheeks)
    head.add(mesh(g.cheek, cm, -0.22, -0.06, headR - 0.08))
    head.add(mesh(g.cheek, cm, 0.22, -0.06, headR - 0.08))
  }

  // ears / horns / antenna / tuft
  const ears = fig.ears || { type: 'none' }
  if (ears.type === 'round') {
    const em = mat(ears.color || fig.skin)
    head.add(mesh(g.earRound, em, -0.26, headTop - 0.02, 0))
    head.add(mesh(g.earRound, em, 0.26, headTop - 0.02, 0))
  } else if (ears.type === 'pointy') {
    const em = mat(ears.color || fig.skin)
    const im = mat(ears.inner || '#333333')
    for (const side of [-1, 1]) {
      const ear = mesh(g.earPointy, em, side * 0.2, headTop + 0.06, 0)
      ear.rotation.z = -side * 0.35
      head.add(ear)
      const inner = mesh(g.earInner, im, side * 0.2, headTop + 0.05, 0.03)
      inner.rotation.z = -side * 0.35
      head.add(inner)
    }
  } else if (ears.type === 'horns') {
    const hm = mat(ears.color || '#ffe0a3')
    for (const side of [-1, 1]) {
      const horn = mesh(g.horn, hm, side * 0.16, headTop + 0.02, -0.12)
      horn.rotation.x = -0.7
      horn.rotation.z = -side * 0.3
      head.add(horn)
    }
  } else if (ears.type === 'antenna') {
    head.add(mesh(g.antenna, S.chrome, 0, headTop + 0.12, 0))
    head.add(mesh(g.antennaBall, mat(ears.color || '#ffd400', { emissive: ears.color || '#ffd400', emissiveIntensity: 0.6 }), 0, headTop + 0.28, 0))
  } else if (ears.type === 'tuft') {
    const tm = mat(ears.color || fig.skin)
    const t = mesh(g.tuft, tm, 0, headTop + 0.1, -0.02)
    t.rotation.x = -0.3
    head.add(t)
    const t2 = mesh(g.tuft, tm, 0.12, headTop + 0.06, -0.06)
    t2.rotation.z = -0.5
    head.add(t2)
  }

  // shadows for everything except outlines / flames
  root.traverse((o) => {
    if (o.isMesh && o.name !== 'outline' && o.material !== S.flame && o.material !== S.flameCore) {
      o.castShadow = true
      o.receiveShadow = true
    }
  })

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

    // driver
    const bob = Math.sin(t * (6 + speedRatio * 10)) * 0.018 * (0.4 + speedRatio)
    head.position.y = HEAD_Y + bob + (s.airborne ? 0.05 : 0)
    head.rotation.z = anim.steer * 0.12
    anim.headYaw = damp(anim.headYaw, s.drifting ? s.driftDir * 0.45 : anim.steer * 0.15, 6, dt)
    head.rotation.y = anim.headYaw
    driver.rotation.x = clamp(-(kart.accel || 0) * 0.01, -0.12, 0.08)

    // exhaust flames when boosting
    const flameTarget = s.boostTimer > 0 ? 1 : 0
    anim.flame = damp(anim.flame, flameTarget, 14, dt)
    if (anim.flame > 0.03) {
      flames.visible = true
      const flick = 0.75 + 0.25 * Math.sin(t * 45) + 0.1 * Math.sin(t * 71)
      const sc = anim.flame * flick
      flameL.scale.set(sc, sc, sc * 1.4)
      flameR.scale.set(sc, sc, sc * 1.4)
      coreL.scale.set(sc * 0.5, sc * 0.5, sc * 0.8)
      coreR.scale.set(sc * 0.5, sc * 0.5, sc * 0.8)
    } else {
      flames.visible = false
    }

    // star: rainbow cycling emissive tint on body materials
    if (s.starTimer > 0) {
      const hue = (t * 1.3) % 1
      for (let i = 0; i < starMats.length; i++) {
        starMats[i].emissive.setHSL((hue + i * 0.15) % 1, 1, 0.5)
        starMats[i].emissiveIntensity = 0.75
      }
      anim.starOn = true
    } else if (anim.starOn) {
      for (const m of starMats) {
        m.emissive.setRGB(0, 0, 0)
        m.emissiveIntensity = 1
      }
      anim.starOn = false
    }
  }

  function onHop() { anim.squash = -0.6 }
  function onLand() { anim.squash = 1 }

  function dispose() {
    for (const m of own) m.dispose()
    own.length = 0
  }

  return {
    group: root,
    body,
    head,
    wheelPivots,
    wheelSpins,
    materials: { body: bodyMat, accent: accentMat, skin: skinMat },
    update,
    onHop,
    onLand,
    dispose,
  }
}
