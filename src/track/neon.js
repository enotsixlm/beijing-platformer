import * as THREE from 'three'
import { makeToonMaterial, makeFlatMaterial } from '../core/toon.js'
import { mulberry32, lerp, clamp } from '../core/rng.js'
import { Track } from './base.js'
import { roundedLoop } from './spline.js'
import { buildRoad, buildWalls, buildStartGate, buildBoostPads, itemBoxRows, buildStartGrid, buildGround, buildPillars, ribbonGeometry, lat } from './roadbuilder.js'
import { groundTexture, neonBarrierTexture, flagTexture, textTexture } from './textures.js'
import {
  instanced, alongWall, animateMaterial, faceRoadRotation, colored, xf, mergeParts,
  lampPostGeometry, lampHeadGeometry, personGeometry, droneGeometry,
  buildSky, buildCity, grandstandGeometry, grandstandCrowd, buildBillboard, placeBeside,
  TrafficDrone, RotorGate,
} from './scenery.js'

const S = 0.88
const WAYPOINTS = [
  [-150, 0, -110],      // start line
  [-150, 2, 200, 45],   // → east
  [-30, 6, 200, 30],    // → south
  [-30, 4, 140, 25],    // → east
  [40, 4, 140, 25],     // → north
  [40, 5, 200, 30],     // → east
  [160, 6, 200, 40],    // → south
  [160, 3, 100, 30],    // → west
  [90, 0, 100, 25],     // → south
  [90, -4, 20, 25],     // → east
  [170, -6, 20, 30],    // → south
  [170, -4, -80, 30],   // → west
  [100, -2, -80, 25],   // → south
  [100, 0, -140, 25],   // → west
  [30, 2, -140, 25],    // → south
  [30, 3, -200, 30],    // → west (long straight)
  [-150, 1, -200, 40],  // → north
].map(([x, y, z, r]) => (r == null ? [x * S, y, z * S] : [x * S, y, z * S, r * S]))

const NEON = ['#37f5ff', '#ff2bd6', '#ffe94a', '#7dff6a', '#b26bff', '#ff7a3c']

/** Neon Skyline — night-city skyway on pillars with drones and rotor gates. */
export function buildNeon(def) {
  const rand = mulberry32(80085)
  const track = new Track(def, roundedLoop(WAYPOINTS), { halfWidth: () => 7.5, wallGap: () => 3.5 })
  const sp = track._spline
  const g = track.group
  const groundY = -16
  track._groundY = groundY
  track._skirt = null

  // ── environment & lights ──
  track.environment = { background: new THREE.Color(0x0b0a22), fog: { color: new THREE.Color(0x1a0f33), near: 160, far: 680 } }
  track.setupLights({ sunColor: 0x9fb4ff, sunIntensity: 1.7, sunDir: [-0.3, 1, 0.5], hemiSky: 0x5a4aa0, hemiGround: 0x2a1a3a, hemiIntensity: 0.9 })
  g.add(buildSky([[0, '#5a2a8a'], [0.12, '#251550'], [0.45, '#0b0a2a'], [1, '#04030f']], { stars: 520 }).mesh)

  // ── city, ground ──
  const street = new THREE.Color('#15141f'), street2 = new THREE.Color('#1e1c2c')
  const ground = buildGround({
    size: 1900, cells: 40, y: groundY, texture: groundTexture('gravel'),
    colorAt: (x, z) => street.clone().lerp(street2, (Math.sin(x * 0.02) * Math.cos(z * 0.02) + 1) * 0.5),
  })
  g.add(ground.mesh)
  const near = buildCity(rand, sp, { count: 230, inner: 12, outer: 300, groundY, tint: '#ffd27a', heights: [8, 60] })
  g.add(near.mesh)
  const far = buildCity(rand, sp, { count: 60, inner: 260, outer: 700, groundY, tint: '#8be9fd', heights: [90, 200] })
  g.add(far.mesh)
  // rooftop neon tubes on the near buildings
  {
    const tubeGeo = new THREE.BoxGeometry(0.5, 1, 0.5)
    tubeGeo.translate(0, 0.5, 0)
    const pl = []
    const m = new THREE.Matrix4(), p = new THREE.Vector3(), q = new THREE.Quaternion(), s = new THREE.Vector3()
    for (let i = 0; i < near.mesh.count; i++) {
      if (rand() < 0.45) continue
      near.mesh.getMatrixAt(i, m)
      m.decompose(p, q, s)
      pl.push({ position: new THREE.Vector3(p.x + (rand() - 0.5) * s.x * 0.6, p.y + s.y, p.z + (rand() - 0.5) * s.z * 0.6), scale: new THREE.Vector3(1, 3 + rand() * 9, 1), color: new THREE.Color(NEON[Math.floor(rand() * NEON.length)]) })
    }
    g.add(instanced(tubeGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }), pl, { colors: true, shadows: false }))
  }

  // ── road (wet), curbs, barriers, pillars, underglow ──
  const road = buildRoad(sp, {
    asphalt: { base: '#1c1e2a', speck: ['#262938', '#151722', '#2f3346'], centre: '#ffe94a', edge: '#37f5ff' },
    curbColors: ['#ff2bd6', '#f2f2ff'],
    offroadTexture: groundTexture('gravel'),
    offroadColor: 0x9aa0b8,
    wetRoad: true,
  })
  g.add(road.group)
  const barrierTex = neonBarrierTexture('#37f5ff', '#12141f')
  const barrierMat = new THREE.MeshStandardMaterial({ map: barrierTex, emissive: 0xffffff, emissiveMap: barrierTex, emissiveIntensity: 1.2, roughness: 0.6, side: THREE.DoubleSide })
  const walls = buildWalls(sp, { height: 1.25, sink: 0.9, tile: 3, material: barrierMat })
  g.add(walls.mesh)
  const pillars = buildPillars(sp, { groundY, every: 13, color: 0x2a2d44, width: 1.8 })
  g.add(pillars.mesh)
  // deck underside + underglow strips
  const deckGeo = ribbonGeometry(sp, { edgeA: lat((s) => s.whw + 0.6, -1.0), edgeB: lat((s) => -s.whw - 0.6, -1.0), tile: 20 })
  g.add(new THREE.Mesh(deckGeo, makeToonMaterial(0x1e2030)))
  const glowMat = new THREE.MeshBasicMaterial({ color: 0xff2bd6, transparent: true, opacity: 0.85, side: THREE.DoubleSide })
  const glowL = ribbonGeometry(sp, { edgeA: lat((s) => -s.whw - 0.7, -1.0), edgeB: lat((s) => -s.whw - 0.7, -0.15), tile: 20 })
  const glowR = ribbonGeometry(sp, { edgeA: lat((s) => s.whw + 0.7, -1.0), edgeB: lat((s) => s.whw + 0.7, -0.15), tile: 20 })
  for (const geo of [glowL, glowR]) g.add(new THREE.Mesh(geo, glowMat))
  track.animate({ update: (dt, time) => { glowMat.opacity = 0.7 + Math.sin(time * 2.4) * 0.2; barrierMat.emissiveIntensity = 1.05 + Math.sin(time * 3.1) * 0.25 } })

  // ── start gate, pads, boxes, grid ──
  g.add(buildStartGate(sp, { accent: '#ff2bd6', bannerText: 'NEON SKYLINE', pillarColor: 0x2a2d44 }).group)
  const pads = buildBoostPads(sp, [{ t: 0.08, lateral: 0 }, { t: 0.36, lateral: 1.6 }, { t: 0.56, lateral: 0, halfLength: 4 }, { t: 0.78, lateral: -1.6 }, { t: 0.9, lateral: 0 }], { color: '#37f5ff', bg: '#2a0a4a' })
  track.boostPads = pads.pads
  track.animate({ update: (dt) => { pads.texture.offset.y -= dt * 1.8 } })
  g.add(pads.mesh)
  track.itemBoxes = itemBoxRows(sp, [{ t: 0.05, count: 4 }, { t: 0.22, count: 4 }, { t: 0.43, count: 3 }, { t: 0.63, count: 4 }, { t: 0.72, count: 3 }, { t: 0.86, count: 5 }])
  track.startGrid = buildStartGrid(sp)

  // ── street furniture on the deck ──
  const propMat = makeToonMaterial(0xffffff, { vertexColors: true })
  const lampsL = alongWall(sp, { every: 26, side: -1, offset: -0.9 })
  const lampsR = alongWall(sp, { every: 26, side: 1, offset: -0.9, phase: 0.5 })
  const lamps = [...lampsL, ...lampsR] // arm (local −z) points over the road
  g.add(instanced(lampPostGeometry('#2b2f3a'), propMat, lamps))
  g.add(instanced(lampHeadGeometry(), new THREE.MeshBasicMaterial({ color: 0xe6fbff }), lamps, { shadows: false }))
  // pulsing neon arches over the road
  {
    const archGeo = new THREE.TorusGeometry(sp.hw[0] + 3.2, 0.35, 8, 28, Math.PI)
    const pl = []
    for (const t of [0.04, 0.13, 0.3, 0.47, 0.6, 0.75, 0.88, 0.96]) {
      const s = sp.sample(t)
      pl.push({ position: s.position.clone().add(new THREE.Vector3(0, 0.3, 0)), rotationY: Math.atan2(s.tangent.x, s.tangent.z) + Math.PI / 2, color: new THREE.Color(NEON[pl.length % NEON.length]) })
    }
    const archMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const arches = instanced(archGeo, archMat, pl, { colors: true, shadows: false })
    g.add(arches)
    const base = pl.map((p) => p.color.clone()), tmp = new THREE.Color()
    track.animate({ update: (dt, time) => {
      for (let i = 0; i < pl.length; i++) {
        const k = 0.55 + 0.45 * Math.max(0, Math.sin(time * 2.2 + i * 0.9))
        tmp.copy(base[i]).multiplyScalar(k)
        arches.setColorAt(i, tmp)
      }
      arches.instanceColor.needsUpdate = true
    } })
  }

  // grandstands + crowd + flags
  const standGeo = grandstandGeometry({ length: 24, tiers: 4, color: '#3a3f5c', roof: '#ff2bd6' })
  const standDefs = [{ t: 0.03, side: -1 }, { t: 0.07, side: -1 }, { t: 0.965, side: 1 }, { t: 0.52, side: -1 }]
  const standPl = [], crowdPl = [], flagPl = []
  for (const d of standDefs) {
    const s = sp.sample(d.t)
    const rotY = faceRoadRotation(s.tangent, d.side)
    const pos = s.position.clone().addScaledVector(s.right, d.side * (s.wallHalfWidth + 2.5))
    pos.y = s.position.y - 0.4
    standPl.push({ position: pos, rotationY: rotY })
    const m = new THREE.Matrix4().compose(pos, new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotY), new THREE.Vector3(1, 1, 1))
    for (const c of grandstandCrowd(rand, { length: 24, tiers: 4, density: 0.75 })) crowdPl.push({ position: c.local.applyMatrix4(m), rotationY: rotY + Math.PI, scale: c.scale, color: c.color })
    for (const fx of [-9, -3, 3, 9]) flagPl.push({ position: new THREE.Vector3(fx, 8.4, 6.2).applyMatrix4(m), rotationY: rotY })
  }
  g.add(instanced(standGeo, propMat, standPl))
  // stands stand on their own deck platform + pillars: a simple slab under each
  {
    const slabGeo = new THREE.BoxGeometry(27, 1.2, 10)
    slabGeo.translate(0, -0.6, 3.6)
    g.add(instanced(slabGeo, makeFlatMaterial(0x2a2d44), standPl))
    const legGeo = new THREE.BoxGeometry(1.6, 1, 1.6)
    legGeo.translate(0, 0.5, 0)
    const legs = []
    for (const p of standPl) {
      const m = new THREE.Matrix4().compose(p.position, new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), p.rotationY), new THREE.Vector3(1, 1, 1))
      for (const lx of [-11, 0, 11]) {
        const w = new THREE.Vector3(lx, 0, 4).applyMatrix4(m)
        legs.push({ position: new THREE.Vector3(w.x, groundY, w.z), scale: new THREE.Vector3(1, w.y - groundY - 1.1, 1) })
      }
    }
    g.add(instanced(legGeo, makeFlatMaterial(0x2a2d44), legs))
  }
  const crowdMat = animateMaterial(makeToonMaterial(0xffffff, { vertexColors: true }), 'crowd')
  track.timeMaterial(crowdMat)
  g.add(instanced(personGeometry(), crowdMat, crowdPl, { colors: true, shadows: false }))
  const flagGeo = new THREE.PlaneGeometry(1.6, 1.0, 8, 3)
  flagGeo.translate(0.8, 0, 0)
  const flagMat = animateMaterial(makeToonMaterial(0xffffff, { map: flagTexture('#37f5ff', '#ff2bd6'), side: THREE.DoubleSide }), 'flag', { width: 1.6 })
  track.timeMaterial(flagMat)
  g.add(instanced(flagGeo, flagMat, flagPl.map((p) => ({ ...p, rotationY: p.rotationY + Math.PI / 2 })), { shadows: false }))
  const poleGeo = new THREE.CylinderGeometry(0.05, 0.07, 4.2, 5)
  poleGeo.translate(0, -1.6, 0)
  g.add(instanced(poleGeo, makeFlatMaterial(0xd0d4ff), flagPl, { shadows: false }))

  // glowing billboards / neon signs beside the deck (on tall posts from the street)
  const bbDefs = [
    ['NEON SKYLINE', 0.11, 1, '#12082a', '#37f5ff'], ['TURBO', 0.19, -1, '#2a0a4a', '#ff2bd6'], ['KART CUP', 0.34, 1, '#1e2a44', '#ffe94a'],
    ['SYNTH BAR', 0.41, -1, '#0a1a2a', '#7dff6a'], ['DRIFT ZONE', 0.58, 1, '#2a0a10', '#ff7a3c'], ['24H NOODLES', 0.7, -1, '#12082a', '#ffe94a'],
    ['HOTEL', 0.83, 1, '#0a0a2a', '#b26bff'], ['NITRO COLA', 0.93, -1, '#c8102e', '#ffffff'],
  ]
  for (const [text, t, side, bg, fg] of bbDefs) {
    const s = sp.sample(t)
    const bb = buildBillboard(text, { bg, fg, accent: fg, glow: 18, legs: s.position.y - groundY + 1.5, w: 11, h: 3.6 })
    placeBeside(bb.group, sp, t, side, 3 + rand() * 4, () => groundY)
    g.add(bb.group)
  }
  // holographic floating logo above the start
  {
    const s = sp.sample(0.02)
    const holo = new THREE.Mesh(new THREE.PlaneGeometry(16, 4), new THREE.MeshBasicMaterial({ map: textTexture('TURBO KART LEGENDS', { w: 1024, h: 256, bg: '#000000', fg: '#37f5ff', glow: 30 }), transparent: true, opacity: 0.85, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }))
    holo.position.copy(s.position).add(new THREE.Vector3(0, 14, 0))
    g.add(holo)
    track.animate({ update: (dt, time) => { holo.rotation.y = time * 0.5; holo.position.y = s.position.y + 14 + Math.sin(time) * 0.5 } })
  }

  // ── hazards: traffic drones + rotor gates ──
  const droneGeo = droneGeometry()
  const droneMat = makeToonMaterial(0xffffff, { vertexColors: true })
  for (const [t, speed] of [[0.15, 11], [0.32, 12.5], [0.5, 10.5], [0.66, 12], [0.84, 11.5]]) {
    const d = new TrafficDrone(sp, { t, speed, geometry: droneGeo, material: droneMat })
    track.animate(d)
    track.addHazard(d.hazard)
    g.add(d.mesh)
  }
  const rotorMat = new THREE.MeshStandardMaterial({ color: 0xff2bd6, emissive: 0xff2bd6, emissiveIntensity: 0.8, roughness: 0.4 })
  const hubMat = makeToonMaterial(0x2a2d44)
  for (const [t, speed, phase] of [[0.245, 1.1, 0], [0.585, -1.3, 1.5], [0.805, 1.2, 3]]) {
    const r = new RotorGate(sp, { t, speed, phase, length: 11.5, material: rotorMat, hubMaterial: hubMat })
    track.animate(r)
    track.addHazard(r.hazards)
    g.add(r.group)
  }

  return track
}
