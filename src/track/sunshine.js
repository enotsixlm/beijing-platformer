import * as THREE from 'three'
import { makeToonMaterial, makeFlatMaterial } from '../core/toon.js'
import { mulberry32, lerp, clamp } from '../core/rng.js'
import { Track } from './base.js'
import { roundedLoop } from './spline.js'
import { buildRoad, buildStartGate, buildBoostPads, itemBoxRows, buildStartGrid, buildGround, ribbonGeometry, lat, inVoid } from './roadbuilder.js'
import { groundTexture, fenceTexture, flagTexture } from './textures.js'
import {
  instanced, scatter, alongWall, animateMaterial, faceRoadRotation, colored, xf, mergeParts, jitter,
  palmTreeGeometry, roundTreeGeometry, rockGeometry, tyreStackGeometry, beachHutGeometry, personGeometry,
  buildSky, buildMountains, buildClouds, grandstandGeometry, grandstandCrowd, buildBillboard, placeBeside, buildSea,
  BeachBall, Balloon,
} from './scenery.js'

const S = 0.92
const WAYPOINTS = [
  [130, 3, -150],       // start line, heading +z along the beach
  [130, 5, 200, 40],    // → west
  [40, 7, 200, 40],     // → south (hill hairpin)
  [40, 5, 110, 30],     // → west
  [-60, 2, 110, 30],    // → south (meadow dip)
  [-60, 0, 30, 25],     // → east  (S-bend)
  [-20, 1, 30, 18],     // → south
  [-20, 2, -20, 18],    // → west
  [-85, 3, -20, 25],    // → south
  [-85, 5, -110, 28],   // → west (lighthouse loop)
  [-135, 7, -110, 28],  // → south
  [-135, 8, -190, 30],  // → east (long bottom sweep)
  [130, 3, -230, 40],   // → north onto the beach straight
].map(([x, y, z, r]) => (r == null ? [x * S, y, z * S] : [x * S, y, z * S, r * S]))

const SEA_X = 150 // sea starts here (+x side); the sand skirt runs down into it

/** Sunshine Speedway — sunny beach & meadow circuit. */
export function buildSunshine(def) {
  const rand = mulberry32(20240601)
  const track = new Track(def, roundedLoop(WAYPOINTS), { halfWidth: () => 7, wallGap: () => 4.5 })
  const sp = track._spline
  const g = track.group
  const groundY = -0.6
  track._groundY = groundY
  track._skirt = { width: 28 }
  const terrain = (x, z, info) => track.terrainHeight(x, z, info)

  // ── environment & lights ──
  track.environment = { background: new THREE.Color(0x7ec8ff), fog: { color: new THREE.Color(0xd6ecff), near: 320, far: 860 } }
  track.setupLights({ sunColor: 0xfff1cf, sunIntensity: 2.6, sunDir: [0.55, 1, 0.3], hemiSky: 0xbfe4ff, hemiGround: 0x7aa35a, hemiIntensity: 0.95 })
  g.add(buildSky([[0, '#f7e9c8'], [0.12, '#9fd8ff'], [0.45, '#4fa9f2'], [1, '#2a6fd6']]).mesh)
  const b = sp.bounds(0)
  const centre = [(b.minX + b.maxX) / 2, (b.minZ + b.maxZ) / 2]
  g.add(buildMountains(rand, { centre, radius: 560, spread: 140, count: 30, color: '#6fa06a', snow: '#f4fbff', height: [50, 130], base: [90, 170], y: groundY, allow: (x) => x < 90 }).mesh)
  g.add(buildClouds(rand, { centre, count: 28, radius: [120, 640], height: [80, 150] }).mesh)

  // ── ground, sea, road ──
  const sand = new THREE.Color('#efd48f'), grass = new THREE.Color('#5fbe47'), grass2 = new THREE.Color('#4fa93d')
  const groundTex = groundTexture('grass')
  const ground = buildGround({
    size: 1700, cells: 60, y: groundY, texture: groundTex,
    colorAt: (x, z) => {
      const k = clamp((x - 128) / 14, 0, 1)
      const c = grass.clone().lerp(grass2, (Math.sin(x * 0.05) * Math.cos(z * 0.04) + 1) * 0.5)
      return c.lerp(sand, k)
    },
  })
  g.add(ground.mesh)
  const sea = buildSea({ centre: [SEA_X + 700, 0], size: 1400, y: groundY + 1.25 })
  track.timeMaterial(sea.material)
  track.animate({ update: (dt) => { sea.texture.offset.x += dt * 0.012; sea.texture.offset.y -= dt * 0.008 } })
  g.add(sea.mesh)

  const road = buildRoad(sp, { asphalt: { base: '#454955', centre: '#ffd84a' }, offroadTexture: groundTexture('sand'), offroadColor: 0xffffff })
  g.add(road.group)
  // embankment skirt: sand on the beach side of the straight, grass elsewhere
  const isBeach = (s) => s.t > 0.9 || s.t < 0.23
  const outerY = (s) => Math.min(groundY, s.y - 0.5)
  const innerY = (s) => s.y - 0.06
  const skirtR = (skip) => ribbonGeometry(sp, { edgeA: lat((s) => s.whw + 0.5, innerY), edgeB: lat((s) => s.whw + 28, outerY), tile: 12, skip })
  const skirtL = ribbonGeometry(sp, { edgeA: lat((s) => -(s.whw + 28), outerY), edgeB: lat((s) => -(s.whw + 0.5), innerY), tile: 12 })
  const sandTex = groundTexture('sand'); sandTex.repeat.set(3, 1)
  const grassTex = groundTexture('grass'); grassTex.repeat.set(3, 1)
  for (const [geo, tex] of [[skirtR((s) => !isBeach(s)), sandTex], [skirtR(isBeach), grassTex], [skirtL, grassTex]]) {
    const m = new THREE.Mesh(geo, makeToonMaterial(0xffffff, { map: tex }))
    m.receiveShadow = true
    g.add(m)
  }

  // walls: white picket fence + tyre stacks on the corners
  const fenceTex = fenceTexture('#ffffff', '#ff5a36')
  const fenceMat = makeToonMaterial(0xffffff, { map: fenceTex, transparent: false, alphaTest: 0.5, side: THREE.DoubleSide })
  const fenceL = ribbonGeometry(sp, { edgeA: lat((s) => -s.whw, -0.1), edgeB: lat((s) => -s.whw, 1.25), tile: 4 })
  const fenceR = ribbonGeometry(sp, { edgeA: lat((s) => s.whw, -0.1), edgeB: lat((s) => s.whw, 1.25), tile: 4 })
  for (const geo of [fenceL, fenceR]) { const m = new THREE.Mesh(geo, fenceMat); m.castShadow = true; g.add(m) }
  const tyreGeo = tyreStackGeometry()
  const tyreMat = makeToonMaterial(0xffffff, { vertexColors: true })
  const tyres = alongWall(sp, { every: 2.4, offset: -0.7, tRanges: [[0.24, 0.31], [0.36, 0.41], [0.5, 0.56], [0.58, 0.63], [0.68, 0.74], [0.88, 0.93]] })
  g.add(instanced(tyreGeo, tyreMat, tyres.map((p) => ({ ...p, scale: 0.95 }))))

  // ── start gate, pads, boxes, grid ──
  g.add(buildStartGate(sp, { accent: '#ff5a36', bannerText: 'SUNSHINE SPEEDWAY', pillarColor: 0xfff4e0 }).group)
  const pads = buildBoostPads(sp, [{ t: 0.1, lateral: 0 }, { t: 0.47, lateral: -1.5 }, { t: 0.79, lateral: 1.5 }, { t: 0.955, lateral: 0 }], { color: '#ffd23f', bg: '#1f4fbf' })
  track.boostPads = pads.pads
  track.animate({ update: (dt) => { pads.texture.offset.y -= dt * 1.6 } })
  g.add(pads.mesh)
  track.itemBoxes = itemBoxRows(sp, [{ t: 0.06, count: 4 }, { t: 0.27, count: 4 }, { t: 0.45, count: 3 }, { t: 0.66, count: 4 }, { t: 0.86, count: 5 }])
  track.startGrid = buildStartGrid(sp)

  // ── scenery ──
  const propMat = makeToonMaterial(0xffffff, { vertexColors: true })
  const isLand = (x) => x < SEA_X - 4
  const palms = scatter(sp, rand, { count: 110, minGap: 2.5, maxGap: 22, clearance: 3, heightAt: terrain, allow: (x, z) => isLand(x) && x > 60, scaleRange: [0.8, 1.35], tries: 10 })
  palms.push(...scatter(sp, rand, { count: 30, minGap: 2.5, maxGap: 30, clearance: 3, heightAt: terrain, allow: (x) => isLand(x) && x <= 60, scaleRange: [0.8, 1.2] }))
  g.add(instanced(palmTreeGeometry(rand), propMat, palms))
  const trees = scatter(sp, rand, { count: 170, minGap: 3, maxGap: 55, clearance: 3, heightAt: terrain, allow: (x) => x < 70, scaleRange: [0.7, 1.5], tries: 10 })
  g.add(instanced(roundTreeGeometry(rand), propMat, trees))
  const rocks = scatter(sp, rand, { count: 60, minGap: 1.5, maxGap: 30, clearance: 2, heightAt: terrain, allow: isLand, scaleRange: [0.6, 2.2], yOffset: -0.2 })
  g.add(instanced(rockGeometry(rand, '#9aa0ab'), propMat, rocks))
  const huts = scatter(sp, rand, { count: 12, side: 1, minGap: 6, maxGap: 24, clearance: 4, heightAt: terrain, tRanges: [[0.92, 1], [0.0, 0.2]], allow: isLand, scaleRange: [0.9, 1.15], tries: 12 })
  g.add(instanced(beachHutGeometry(rand), propMat, huts.map((h) => ({ ...h, rotationY: h.faceRoad + (rand() - 0.5) * 0.3 }))))
  // umbrellas on the beach
  const umbGeo = mergeParts([
    xf(colored(new THREE.CylinderGeometry(0.05, 0.05, 2.4, 5), '#f5f5f5'), { p: [0, 1.2, 0] }),
    xf(colored(new THREE.ConeGeometry(1.6, 0.6, 8), '#ff6b6b'), { p: [0, 2.5, 0] }),
  ])
  const umbs = scatter(sp, rand, { count: 40, side: 1, minGap: 4, maxGap: 34, clearance: 3, heightAt: terrain, tRanges: [[0.9, 1], [0, 0.22]], allow: isLand })
  g.add(instanced(umbGeo, propMat, umbs))

  // grandstands (one InstancedMesh) + crowd (one InstancedMesh, hopping shader) + flags
  const standGeo = grandstandGeometry({ length: 24, tiers: 4, roof: '#ff5a36' })
  const standDefs = [{ t: 0.035, side: -1 }, { t: 0.075, side: -1 }, { t: 0.965, side: -1 }, { t: 0.41, side: 1 }, { t: 0.72, side: -1 }]
  const standPl = [], crowdPl = [], flagPl = []
  const personGeo = personGeometry()
  for (const d of standDefs) {
    const s = sp.sample(d.t)
    const rotY = faceRoadRotation(s.tangent, d.side)
    const pos = s.position.clone().addScaledVector(s.right, d.side * (s.wallHalfWidth + 3))
    pos.y = terrain(pos.x, pos.z)
    standPl.push({ position: pos, rotationY: rotY })
    const m = new THREE.Matrix4().compose(pos, new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotY), new THREE.Vector3(1, 1, 1))
    for (const c of grandstandCrowd(rand, { length: 24, tiers: 4, density: 0.75 })) crowdPl.push({ position: c.local.applyMatrix4(m), rotationY: rotY + Math.PI, scale: c.scale, color: c.color })
    for (const fx of [-10, -5, 0, 5, 10]) flagPl.push({ position: new THREE.Vector3(fx, 8.4, 6.2).applyMatrix4(m), rotationY: rotY })
  }
  g.add(instanced(standGeo, propMat, standPl))
  const crowdMat = animateMaterial(makeToonMaterial(0xffffff, { vertexColors: true }), 'crowd')
  track.timeMaterial(crowdMat)
  g.add(instanced(personGeo, crowdMat, crowdPl, { colors: true, shadows: false }))
  // flags along the start straight too
  for (const p of alongWall(sp, { every: 14, side: -1, offset: 1.2, tRanges: [[0.0, 0.2], [0.9, 1]] })) { p.position.y += 3.8; flagPl.push(p) }
  const flagGeo = new THREE.PlaneGeometry(1.6, 1.0, 8, 3)
  flagGeo.translate(0.8, 0, 0)
  const flagMat = animateMaterial(makeToonMaterial(0xffffff, { map: flagTexture('#ff3355', '#ffffff'), side: THREE.DoubleSide }), 'flag', { width: 1.6 })
  track.timeMaterial(flagMat)
  g.add(instanced(flagGeo, flagMat, flagPl.map((p) => ({ ...p, rotationY: (p.rotationY ?? 0) + Math.PI / 2 })), { shadows: false }))
  const poleGeo = new THREE.CylinderGeometry(0.05, 0.07, 4.2, 5)
  poleGeo.translate(0, -1.6, 0)
  g.add(instanced(poleGeo, makeFlatMaterial(0xf4f4f4), flagPl, { shadows: false }))

  // billboards
  const bbDefs = [
    ['TURBO', 0.15, 1, '#ff5a36', '#fff'], ['KART CUP', 0.3, -1, '#1e2a44', '#ffd23f'], ['NITRO COLA', 0.52, 1, '#c8102e', '#fff'],
    ['DRIFT KING', 0.64, -1, '#12b886', '#fff'], ['WAVE RIDER', 0.84, 1, '#1f4fbf', '#8be9fd'], ['SUNSHINE SPEEDWAY', 0.93, 1, '#ffb703', '#1e2a44'],
  ]
  for (const [text, t, side, bg, fg] of bbDefs) {
    const bb = buildBillboard(text, { bg, fg, accent: '#ffffff' })
    placeBeside(bb.group, sp, t, side, 4 + rand() * 6, (x, z) => terrain(x, z))
    g.add(bb.group)
  }

  // lighthouse inside the west loop
  {
    const cx = -108 * S, cz = -150 * S
    const parts = [
      xf(colored(new THREE.CylinderGeometry(2.2, 2.8, 6, 12), '#ffffff'), { p: [0, 3, 0] }),
      xf(colored(new THREE.CylinderGeometry(2.0, 2.2, 6, 12), '#e63946'), { p: [0, 9, 0] }),
      xf(colored(new THREE.CylinderGeometry(1.8, 2.0, 6, 12), '#ffffff'), { p: [0, 15, 0] }),
      xf(colored(new THREE.CylinderGeometry(2.4, 2.4, 0.6, 12), '#2b2f3a'), { p: [0, 18.3, 0] }),
      xf(colored(new THREE.ConeGeometry(2.2, 2.2, 12), '#e63946'), { p: [0, 21, 0] }),
    ]
    const lh = new THREE.Mesh(mergeParts(parts), propMat)
    lh.position.set(cx, terrain(cx, cz), cz)
    lh.castShadow = true
    g.add(lh)
    const lampMat = new THREE.MeshBasicMaterial({ color: 0xfff1a8 })
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 1.6, 10), lampMat)
    lamp.position.set(cx, lh.position.y + 19.4, cz)
    g.add(lamp)
    const beam = new THREE.Mesh(new THREE.PlaneGeometry(60, 1.4), new THREE.MeshBasicMaterial({ color: 0xfff1a8, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false }))
    beam.geometry.translate(30, 0, 0)
    beam.position.copy(lamp.position)
    g.add(beam)
    track.animate({ update: (dt, time) => { beam.rotation.y = time * 0.8 } })
  }

  // hot-air balloons
  for (let i = 0; i < 4; i++) {
    const bl = new Balloon({ centre: [centre[0] + (rand() - 0.5) * 120, centre[1] + (rand() - 0.5) * 120], radius: 90 + rand() * 90, height: 55 + rand() * 30, speed: 0.03 + rand() * 0.02, phase: rand() * 6, colorA: ['#ff5a5a', '#1f4fbf', '#12b886', '#ff8c42'][i], colorB: '#fff3c4' })
    track.animate(bl)
    g.add(bl.mesh)
  }

  // ── hazards: bouncing beach balls ──
  const ballGeo = new THREE.SphereGeometry(1.25, 14, 10)
  {
    const col = ballGeo.attributes.position, colors = new Float32Array(col.count * 3)
    const cs = ['#ff4757', '#ffffff', '#1e90ff', '#ffa502', '#2ed573', '#ffffff'].map((c) => new THREE.Color(c))
    for (let i = 0; i < col.count; i++) {
      const a = Math.atan2(col.getZ(i), col.getX(i))
      const c = cs[Math.floor(((a + Math.PI) / (Math.PI * 2)) * 6) % 6]
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b
    }
    ballGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  }
  const ballMat = makeToonMaterial(0xffffff, { vertexColors: true })
  for (const [t, phase] of [[0.3, 0], [0.55, 2.1], [0.83, 4.2]]) {
    const ball = new BeachBall(sp, { t, speed: 0.85 + phase * 0.05, phase, geometry: ballGeo, material: ballMat })
    track.animate(ball)
    track.addHazard(ball.hazard)
    g.add(ball.mesh)
  }

  return track
}
