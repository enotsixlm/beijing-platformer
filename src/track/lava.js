import * as THREE from 'three'
import { makeToonMaterial, makeFlatMaterial } from '../core/toon.js'
import { mulberry32, lerp, clamp } from '../core/rng.js'
import { Track } from './base.js'
import { roundedLoop } from './spline.js'
import { buildRoad, buildWalls, buildStartGate, buildBoostPads, itemBoxRows, buildStartGrid, buildGround } from './roadbuilder.js'
import { groundTexture, stoneTexture, flagTexture, crusherFaceTexture, lavaTexture } from './textures.js'
import {
  instanced, scatter, alongWall, animateMaterial, faceRoadRotation, colored, xf, mergeParts, jitter,
  deadTreeGeometry, rockGeometry, torchGeometry, flameGeometry, crystalGeometry, battlementGeometry, personGeometry,
  buildSky, buildMountains, grandstandGeometry, grandstandCrowd, buildBillboard, placeBeside, buildLavaPools,
  RollingBoulder, Crusher,
} from './scenery.js'

const S = 0.85
const WAYPOINTS = [
  [0, 3, -145],         // start line
  [0, 4.5, 100, 40],    // → east onto the lava bridge (z = 85)
  [80, 5, 100],
  [240, 5, 100, 35],    // → south
  [240, 3, 30, 28],     // → west
  [170, 2, 30, 22],     // → south (S)
  [170, 1, -30, 22],    // → west
  [105, 0, -30, 22],    // → north
  [105, 1, 40, 22],     // → west
  [55, 1, 40, 20],      // → south
  [55, 1, -100, 25],    // → east
  [150, 1.5, -100, 25], // → south
  [150, 2, -170, 28],   // → west
  [0, 3, -200, 30],     // → north to the line
].map(([x, y, z, r]) => (r == null ? [x * S, y, z * S] : [x * S, y, z * S, r * S]))

/** signed distance (in t) from the start line, wrapping across t = 0 */
const wrapT = (t) => (t > 0.5 ? t - 1 : t)

/** Magma Fortress — volcanic castle with lava pits, crushers and rolling boulders. */
export function buildLava(def) {
  const rand = mulberry32(66613)
  const track = new Track(def, roundedLoop(WAYPOINTS), { halfWidth: () => 7, wallGap: () => 4 })
  const sp = track._spline
  const g = track.group
  const groundY = -3.6
  track._groundY = groundY
  track._skirt = { width: 24 }
  const terrain = (x, z, info) => track.terrainHeight(x, z, info)
  const tNear = (x, z) => sp.getSurfaceAt(new THREE.Vector3(x, 0, z)).t

  // ── void pits (lava) ──
  const bridgeT0 = tNear(28 * S, 100 * S), bridgeT1 = tNear(212 * S, 100 * S)
  sp.addVoid(bridgeT0, bridgeT1, 0)                                   // bridge: lava both sides
  sp.addVoid(tNear(240 * S, 72 * S), tNear(240 * S, 42 * S), -1)      // outside of the south run
  sp.addVoid(tNear(118 * S, -170 * S), tNear(40 * S, -170 * S), 1)    // inside of the bottom straight

  // ── environment & lights ──
  // Relit for ACES tone mapping (exposure 1.05): a strong warm key, a red/orange hemisphere and an
  // orange ambient "lava bounce" so undersides never go black. Point lights over the pools + start torches ≤ 6.
  track.environment = { background: new THREE.Color(0x2a1020), fog: { color: new THREE.Color(0x7a2e1a), near: 210, far: 780 } }
  track.setupLights({
    sunColor: 0xffcfa0, sunIntensity: 2.7, sunDir: [-0.45, 0.85, -0.35],
    hemiSky: 0xa03a28, hemiGround: 0x6b2a10, hemiIntensity: 1.15,
    ambient: { color: 0x7a3418, intensity: 0.75 },
  })
  g.add(buildSky([[0, '#ffa43a'], [0.05, '#e8602a'], [0.12, '#962c34'], [0.26, '#56204a'], [0.5, '#2e1638'], [1, '#1a0f26']], { stars: 220, starColor: '255,225,200', starAlpha: [0.2, 0.6], embers: 140 }).mesh)
  const b = sp.bounds(0)
  const centre = [(b.minX + b.maxX) / 2, (b.minZ + b.maxZ) / 2]
  g.add(buildMountains(rand, { centre, radius: 520, spread: 120, count: 30, color: '#4a2a34', height: [60, 150], base: [90, 170], y: groundY }).mesh)
  // the big volcano
  {
    const vx = centre[0] + 330, vz = centre[1] - 260
    const cone = colored(new THREE.ConeGeometry(190, 170, 9), '#4a2c36')
    jitter(cone, 14, rand)
    cone.translate(vx, groundY + 85 - 3, vz)
    const crater = colored(new THREE.CylinderGeometry(38, 30, 8, 9), '#ffb347')
    crater.translate(vx, groundY + 170 - 6, vz)
    const volcano = new THREE.Mesh(mergeParts([cone]), makeFlatMaterial(0xffffff, { vertexColors: true }))
    g.add(volcano)
    const glow = new THREE.Mesh(crater, new THREE.MeshBasicMaterial({ color: new THREE.Color(0xff8a2a).multiplyScalar(1.8), fog: true }))
    g.add(glow)
    const smokeGeo = mergeParts([0, 1, 2, 3].map((i) => xf(colored(new THREE.SphereGeometry(22 + i * 8, 8, 6), '#3a3038'), { p: [i * 10, i * 30, -i * 6] })))
    const smoke = new THREE.Mesh(smokeGeo, makeToonMaterial(0xffffff, { vertexColors: true, transparent: true, opacity: 0.85 }))
    smoke.position.set(vx, groundY + 190, vz)
    g.add(smoke)
    track.animate({ update: (dt, time) => { smoke.position.y = groundY + 190 + Math.sin(time * 0.3) * 4; smoke.rotation.y = time * 0.05 } })
  }

  // ── ground & road ──
  const ash = new THREE.Color('#4a363a'), ash2 = new THREE.Color('#5c4446'), ember = new THREE.Color('#8a3c26')
  const ground = buildGround({
    size: 1700, cells: 56, y: groundY, texture: groundTexture('lavaRock'),
    colorAt: (x, z) => {
      const n = (Math.sin(x * 0.031) * Math.cos(z * 0.027) + Math.sin(x * 0.011 + z * 0.017)) * 0.5
      const c = ash.clone().lerp(ash2, clamp(n + 0.5, 0, 1))
      return c.lerp(ember, clamp(n * 0.6, 0, 1))
    },
  })
  g.add(ground.mesh)
  const road = buildRoad(sp, {
    asphalt: { base: '#504a56', speck: ['#605a68', '#423c48', '#6e6876', '#7a5a58'], centre: '#ffa23c', edge: '#ffe2b0' },
    curbColors: ['#e0182e', '#fff4e6'],
    offroadTexture: groundTexture('ash'),
    skirt: { width: 24, groundY, texture: groundTexture('lavaRock') },
  })
  g.add(road.group)
  // warm underglow on the asphalt so the road never falls to black under the tone mapper
  road.group.traverse((o) => { if (o.isMesh && o.name === 'asphalt') { o.material.emissive = new THREE.Color(0x1e1412); o.material.emissiveIntensity = 0.55 } })
  const stoneTex = stoneTexture('#6e5e66', '#3a2c32')
  const walls = buildWalls(sp, { height: 2.2, texture: stoneTex, tile: 5, sink: 0.6, emissive: 0x3a1408, emissiveIntensity: 0.35 })
  g.add(walls.mesh)
  // battlement caps along the walls (instanced small crenellations)
  const crenGeo = colored(new THREE.BoxGeometry(1.2, 0.7, 0.8), '#5c4c56')
  const crenPl = alongWall(sp, { every: 3.0, offset: 0, yOffset: 2.55 })
  g.add(instanced(crenGeo, makeToonMaterial(0xffffff, { vertexColors: true }), crenPl))

  // lava pools filling the pits + decorative lakes
  const pools = buildLavaPools(sp, { drop: 2.7, reach: 26, emissiveIntensity: 1.6 })
  if (pools) {
    g.add(pools.mesh)
    track.animate({ update: (dt, time) => {
      pools.texture.offset.y += dt * 0.03; pools.texture.offset.x += dt * 0.012
      pools.material.emissiveIntensity = 1.6 + Math.sin(time * 1.7) * 0.2 // slow magma pulse
    } })
  }
  {
    const lakeTex = lavaTexture(); lakeTex.repeat.set(4, 4)
    const lakeMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffffff, emissiveMap: lakeTex, emissiveIntensity: 1.6, roughness: 1 })
    const lakes = []
    let tries = 0
    while (lakes.length < 7 && tries++ < 200) {
      const x = centre[0] + (rand() - 0.5) * 700, z = centre[1] + (rand() - 0.5) * 700
      const info = sp.getSurfaceAt(new THREE.Vector3(x, 0, z))
      const r = 25 + rand() * 40
      if (Math.abs(info.lateral) < info.wallHalfWidth + 30 + r) continue
      const c = new THREE.CircleGeometry(r, 14)
      const cp = c.attributes.position
      for (let k = 1; k < cp.count; k++) cp.setXY(k, cp.getX(k) * (0.8 + rand() * 0.4), cp.getY(k) * (0.8 + rand() * 0.4))
      c.rotateX(-Math.PI / 2)
      c.translate(x, groundY + 0.25, z)
      lakes.push(c)
    }
    if (lakes.length) {
      const lakeMesh = new THREE.Mesh(mergeParts(lakes.map((c) => colored(c, '#ffffff'))), lakeMat)
      g.add(lakeMesh)
      track.animate({ update: (dt) => { lakeTex.offset.x += dt * 0.01 } })
    }
  }
  // warm point lights (no shadows) — 4 over the biggest lava pits beside the road, 2 on the start-straight torches = 6 total
  const poolLights = []
  for (const [t, side] of [[(bridgeT0 + bridgeT1) / 2, 1], [(bridgeT0 + bridgeT1) / 2, -1], [tNear(240 * S, 57 * S), -1], [tNear(80 * S, -170 * S), 1]]) {
    const s = sp.sample(t)
    const pl = new THREE.PointLight(0xff8a2a, 420, 60, 2)
    pl.position.copy(s.position).addScaledVector(s.right, side * (s.wallHalfWidth + 6)).add(new THREE.Vector3(0, 3, 0))
    g.add(pl)
    poolLights.push(pl)
  }
  track.animate({ update: (dt, time) => { for (let i = 0; i < poolLights.length; i++) poolLights[i].intensity = 420 + Math.sin(time * 2.1 + i * 1.3) * 60 } })

  // ── start gate, pads, boxes, grid ──
  g.add(buildStartGate(sp, { accent: '#ff6a1a', bannerText: 'MAGMA FORTRESS', pillarColor: 0x4d4249 }).group)
  const pads = buildBoostPads(sp, [{ t: 0.09, lateral: 0 }, { t: (bridgeT0 + bridgeT1) / 2 + 0.03, lateral: 0, halfLength: 4 }, { t: 0.62, lateral: 1.4 }, { t: 0.86, lateral: -1.4 }], { color: '#ffb02e', bg: '#5a1010' })
  track.boostPads = pads.pads
  track.animate({ update: (dt) => { pads.texture.offset.y -= dt * 1.6 } })
  g.add(pads.mesh)
  track.itemBoxes = itemBoxRows(sp, [{ t: 0.05, count: 4 }, { t: bridgeT0 - 0.03, count: 3 }, { t: 0.46, count: 4 }, { t: 0.7, count: 4 }, { t: 0.9, count: 5 }])
  track.startGrid = buildStartGrid(sp)

  // ── scenery ──
  // shared prop material: vertex colours + a faint warm emissive so shadowed sides read as lava-lit stone
  const propMat = makeToonMaterial(0xffffff, { vertexColors: true, emissive: 0x3a1408, emissiveIntensity: 0.45 })
  const trees = scatter(sp, rand, { count: 70, minGap: 3, maxGap: 40, clearance: 3, heightAt: terrain, scaleRange: [0.8, 1.6], tries: 10 })
  g.add(instanced(deadTreeGeometry(rand, '#3e2c2c'), propMat, trees))
  const rocks = scatter(sp, rand, { count: 140, minGap: 1.5, maxGap: 45, clearance: 2, heightAt: terrain, scaleRange: [0.8, 3.2], yOffset: -0.3, tries: 10 })
  g.add(instanced(rockGeometry(rand, '#5e4a50', 1), propMat, rocks))
  const crystals = scatter(sp, rand, { count: 90, minGap: 1.2, maxGap: 30, clearance: 2, heightAt: terrain, scaleRange: [0.6, 1.8], tries: 10 })
  const crystalMat = new THREE.MeshStandardMaterial({ color: 0xff7a30, emissive: 0xff5a14, emissiveIntensity: 1.4, roughness: 0.4, flatShading: true })
  g.add(instanced(crystalGeometry(), crystalMat, crystals.map((c) => ({ ...c, tilt: (rand() - 0.5) * 0.6, roll: (rand() - 0.5) * 0.6 }))))
  // watch towers around the track
  const towers = scatter(sp, rand, { count: 16, minGap: 8, maxGap: 30, clearance: 6, heightAt: terrain, scaleRange: [1.1, 1.8], tries: 12 })
  g.add(instanced(battlementGeometry({ body: '#6a5a64', trim: '#524450', roof: '#d0402e' }), propMat, towers.map((t) => ({ ...t, rotationY: Math.round(t.rotationY / (Math.PI / 2)) * (Math.PI / 2) }))))
  // the keep (north of the bridge)
  {
    const kx = 100 * S, kz = 165 * S
    const keep = mergeParts([
      xf(colored(new THREE.BoxGeometry(46, 26, 30), '#6a5a64'), { p: [0, 13, 0] }),
      xf(colored(new THREE.BoxGeometry(48, 2, 32), '#524450'), { p: [0, 27, 0] }),
      ...[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z]) => xf(colored(new THREE.CylinderGeometry(5, 5.5, 40, 8), '#6a5a64'), { p: [x * 22, 20, z * 14] })),
      ...[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z]) => xf(colored(new THREE.ConeGeometry(6, 9, 8), '#d0402e'), { p: [x * 22, 44, z * 14] })),
      xf(colored(new THREE.CylinderGeometry(7, 8, 56, 8), '#6a5a64'), { p: [0, 28, 0] }),
      xf(colored(new THREE.ConeGeometry(8.5, 12, 8), '#d0402e'), { p: [0, 62, 0] }),
      xf(colored(new THREE.BoxGeometry(10, 14, 2), '#1a1014'), { p: [0, 7, -15.5] }),
    ])
    const keepMesh = new THREE.Mesh(keep, propMat)
    keepMesh.position.set(kx, groundY, kz)
    keepMesh.castShadow = true
    g.add(keepMesh)
    // glowing windows
    const winGeo = new THREE.PlaneGeometry(1.6, 2.6)
    const winPl = []
    for (let i = 0; i < 12; i++) winPl.push({ position: new THREE.Vector3(kx - 18 + i * 3.3, groundY + 12 + (i % 2) * 6, kz - 15.2), rotationY: Math.PI })
    for (let i = 0; i < 6; i++) winPl.push({ position: new THREE.Vector3(kx - 23.2, groundY + 10 + i * 2.5, kz - 10 + i * 4), rotationY: -Math.PI / 2 })
    g.add(instanced(winGeo, new THREE.MeshBasicMaterial({ color: new THREE.Color(0xffa040).multiplyScalar(1.6) }), winPl, { shadows: false }))
  }

  // torches with flickering flames (colour pushed > 1 so the bloom pass catches them)
  const torchPl = alongWall(sp, { every: 16, offset: -0.6, yOffset: 0, phase: 0.3 })
  g.add(instanced(torchGeometry(), propMat, torchPl))
  const flameMat = animateMaterial(new THREE.MeshBasicMaterial({ color: new THREE.Color(0xffb038).multiplyScalar(2.0) }), 'flame')
  track.timeMaterial(flameMat)
  g.add(instanced(flameGeometry(), flameMat, torchPl, { shadows: false }))
  // small flickering point lights on the two torches nearest the start line (one per side)
  {
    const near = (side) => torchPl
      .map((p) => ({ p, s: sp.getSurfaceAt(p.position) }))
      .filter(({ s }) => Math.sign(s.lateral) === side && (s.t < 0.02 || s.t > 0.98))
      .sort((a, b) => Math.abs(wrapT(a.s.t)) - Math.abs(wrapT(b.s.t)))[0]?.p
    const torchLights = [near(-1), near(1)].filter(Boolean).map((p) => {
      const pl = new THREE.PointLight(0xffa040, 90, 40, 2)
      pl.position.copy(p.position).add(new THREE.Vector3(0, 3.8, 0))
      g.add(pl)
      return pl
    })
    track.animate({ update: (dt, time) => { for (let i = 0; i < torchLights.length; i++) torchLights[i].intensity = 90 + Math.sin(time * 9 + i * 2) * 14 + Math.sin(time * 23 + i) * 8 } })
  }

  // grandstands + crowd + banners
  const standGeo = grandstandGeometry({ length: 22, tiers: 4, color: '#6a5a62', roof: '#b8322a' })
  const standDefs = [{ t: 0.03, side: -1 }, { t: 0.07, side: 1 }, { t: 0.965, side: 1 }, { t: 0.5, side: -1 }]
  const standPl = [], crowdPl = [], flagPl = []
  for (const d of standDefs) {
    const s = sp.sample(d.t)
    const rotY = faceRoadRotation(s.tangent, d.side)
    const pos = s.position.clone().addScaledVector(s.right, d.side * (s.wallHalfWidth + 3))
    pos.y = terrain(pos.x, pos.z)
    standPl.push({ position: pos, rotationY: rotY })
    const m = new THREE.Matrix4().compose(pos, new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotY), new THREE.Vector3(1, 1, 1))
    for (const c of grandstandCrowd(rand, { length: 22, tiers: 4, density: 0.7 })) crowdPl.push({ position: c.local.applyMatrix4(m), rotationY: rotY + Math.PI, scale: c.scale, color: c.color })
    for (const fx of [-8, 0, 8]) flagPl.push({ position: new THREE.Vector3(fx, 8.4, 6.2).applyMatrix4(m), rotationY: rotY })
  }
  g.add(instanced(standGeo, propMat, standPl))
  const crowdMat = animateMaterial(makeToonMaterial(0xffffff, { vertexColors: true }), 'crowd')
  track.timeMaterial(crowdMat)
  g.add(instanced(personGeometry(), crowdMat, crowdPl, { colors: true, shadows: false }))
  for (const p of alongWall(sp, { every: 18, side: 0, offset: 1.0, tRanges: [[0.0, 0.16], [0.9, 1]] })) { p.position.y += 4.2; flagPl.push(p) }
  for (const tw of towers) flagPl.push({ position: tw.position.clone().add(new THREE.Vector3(0, 8.2 * tw.scale + 2.4, 0)), rotationY: tw.rotationY })
  const flagGeo = new THREE.PlaneGeometry(1.8, 1.1, 8, 3)
  flagGeo.translate(0.9, 0, 0)
  const flagMat = animateMaterial(makeToonMaterial(0xffffff, { map: flagTexture('#b8322a', '#ffb02e'), side: THREE.DoubleSide }), 'flag', { width: 1.8 })
  track.timeMaterial(flagMat)
  g.add(instanced(flagGeo, flagMat, flagPl.map((p) => ({ ...p, rotationY: (p.rotationY ?? 0) + Math.PI / 2 })), { shadows: false }))
  const poleGeo = new THREE.CylinderGeometry(0.06, 0.08, 4.6, 5)
  poleGeo.translate(0, -1.8, 0)
  g.add(instanced(poleGeo, makeFlatMaterial(0x2a2226), flagPl, { shadows: false }))

  // billboards
  const bbDefs = [
    ['MAGMA FORTRESS', 0.12, -1, '#3a1a14', '#ffb02e'], ['TURBO', 0.2, 1, '#ff5a36', '#fff'], ['KART CUP', 0.44, -1, '#1e2a44', '#ffd23f'],
    ['FIRE DRIFT', 0.57, 1, '#c8102e', '#fff'], ['LAVA LOOP', 0.75, -1, '#2b1420', '#ff7a1a'], ['NITRO COLA', 0.92, -1, '#c8102e', '#fff'],
  ]
  for (const [text, t, side, bg, fg] of bbDefs) {
    const bb = buildBillboard(text, { bg, fg, accent: '#ffb02e' })
    placeBeside(bb.group, sp, t, side, 3 + rand() * 5, (x, z) => terrain(x, z))
    g.add(bb.group)
  }

  // ── hazards ──
  const stoneMat = makeToonMaterial(0x6a5f68, { map: stoneTex })
  const faceMat = new THREE.MeshBasicMaterial({ map: crusherFaceTexture() })
  const bridgeMid = (bridgeT0 + bridgeT1) / 2
  const crusherDefs = [[bridgeT0 + 0.012, -3.2, 0], [bridgeMid - 0.01, 3.2, 1.4], [bridgeMid + 0.015, -3.2, 2.8], [bridgeT1 - 0.012, 3.0, 4.0]]
  for (const [t, lateral, phase] of crusherDefs) {
    const c = new Crusher(sp, { t, lateral, phase, period: 4.6, size: 3.4, material: stoneMat, faceMaterial: faceMat })
    track.animate(c)
    track.addHazard(c.hazard)
    g.add(c.mesh)
  }
  const boulderGeo = rockGeometry(rand, '#4e3e46', 1)
  boulderGeo.scale(1.6, 1.6 / 0.75, 1.6)
  const boulderMat = makeToonMaterial(0xffffff, { vertexColors: true })
  const bT0 = tNear(140 * S, -170 * S), bT1 = tNear(10 * S, -190 * S)
  for (let i = 0; i < 3; i++) {
    const rb = new RollingBoulder(sp, { t0: bT0, t1: bT1, speed: 9, radius: 1.6, lateralAmp: 0.55, phase: i / 3, direction: -1, geometry: boulderGeo, material: boulderMat })
    track.animate(rb)
    track.addHazard(rb.hazard)
    g.add(rb.mesh)
  }
  // a second boulder run down the S-section hill
  const sT0 = tNear(170 * S, 20 * S), sT1 = tNear(150 * S, -30 * S)
  for (let i = 0; i < 2; i++) {
    const rb = new RollingBoulder(sp, { t0: sT0, t1: sT1, speed: 7, radius: 1.4, lateralAmp: 0.5, phase: i / 2, direction: -1, geometry: boulderGeo, material: boulderMat })
    track.animate(rb)
    track.addHazard(rb.hazard)
    g.add(rb.mesh)
  }

  return track
}
