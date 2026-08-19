import * as THREE from 'three'
import { toon } from './toon.js'

export const C = {
  WELL_W: 8.4,
  WELL_D: 7.0,
  STAIR_W: 1.52,
  TREAD: 0.34,
  RISER: 0.18,
  STEPS: 10,
  FLOORS: 6,
  TREAD_H: 0.13,
  LANDING_H: 0.16,
  WALL: 0.32,
  LOBBY_EXT: 6.2,
}

C.FLOOR_H = C.STEPS * C.RISER * 2
C.LANDING_D = (C.WELL_D - C.STEPS * C.TREAD) / 2
C.ROOF_Y = C.FLOORS * C.FLOOR_H
C.WEST_X = -C.WELL_W / 2 + C.STAIR_W / 2
C.EAST_X = C.WELL_W / 2 - C.STAIR_W / 2
C.SOUTH_Z0 = C.WELL_D / 2 - C.LANDING_D
C.NORTH_Z1 = -C.WELL_D / 2 + C.LANDING_D
C.LOBBY_Z1 = C.WELL_D / 2 + C.LOBBY_EXT

let seed = 90210
const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d'))
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.needsUpdate = true
  return t
}

function concreteTex() {
  return canvasTex(256, 256, (g) => {
    g.fillStyle = '#6d726c'
    g.fillRect(0, 0, 256, 256)
    for (let i = 0; i < 900; i++) {
      g.fillStyle = `rgba(20,18,16,${0.03 + rand() * 0.08})`
      g.fillRect(rand() * 256, rand() * 256, 1 + rand() * 3, 1 + rand() * 3)
    }
    g.strokeStyle = 'rgba(40,42,38,0.35)'
    g.lineWidth = 2
    g.strokeRect(8, 8, 240, 240)
  })
}

function tileTex() {
  return canvasTex(256, 256, (g) => {
    g.fillStyle = '#3a3f45'
    g.fillRect(0, 0, 256, 256)
    g.strokeStyle = '#2a2e32'
    g.lineWidth = 6
    for (let y = 0; y < 256; y += 64) {
      for (let x = 0; x < 256; x += 64) g.strokeRect(x, y, 64, 64)
    }
    g.fillStyle = 'rgba(200, 170, 80, 0.08)'
    g.fillRect(0, 0, 256, 256)
  })
}

function hazardTex() {
  return canvasTex(128, 32, (g) => {
    g.fillStyle = '#1a1a1a'
    g.fillRect(0, 0, 128, 32)
    g.fillStyle = '#e6c200'
    for (let i = -32; i < 128; i += 28) {
      g.beginPath()
      g.moveTo(i, 0)
      g.lineTo(i + 16, 0)
      g.lineTo(i + 48, 32)
      g.lineTo(i + 32, 32)
      g.closePath()
      g.fill()
    }
  })
}

function floorSignTex(label) {
  return canvasTex(256, 128, (g) => {
    g.fillStyle = '#14181c'
    g.fillRect(0, 0, 256, 128)
    g.strokeStyle = '#7ad7ff'
    g.lineWidth = 8
    g.strokeRect(8, 8, 240, 112)
    g.fillStyle = '#d8f4ff'
    g.font = 'bold 64px sans-serif'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillText(label, 128, 64)
  })
}

function addCollider(L, x, y, z, w, h, d, extra = {}) {
  const c = {
    min: new THREE.Vector3(x - w / 2, y, z - d / 2),
    max: new THREE.Vector3(x + w / 2, y + h, z + d / 2),
    active: true,
    kind: extra.kind || 'static',
    ...extra,
  }
  L.colliders.push(c)
  return c
}

function solidBox(L, x, y, z, w, h, d, mat, extra = {}) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
  m.position.set(x, y + h / 2, z)
  m.castShadow = m.receiveShadow = true
  L.scene.add(m)
  const c = addCollider(L, x, y, z, w, h, d, extra)
  c.mesh = m
  return { mesh: m, c }
}

function visualBox(L, x, y, z, w, h, d, mat) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
  m.position.set(x, y + h / 2, z)
  m.receiveShadow = true
  L.scene.add(m)
  return m
}

function westZ(i) {
  return C.WELL_D / 2 - C.LANDING_D - C.TREAD / 2 - i * C.TREAD
}

function eastZ(i) {
  return -C.WELL_D / 2 + C.LANDING_D + C.TREAD / 2 + i * C.TREAD
}

function addWaypoint(L, x, y, z) {
  L.waypoints.push(new THREE.Vector3(x, y, z))
}

function addRail(L, x, y, z, w, h, d, mat) {
  solidBox(L, x, y, z, w, h, d, mat, { kind: 'rail' })
}

function makeBox(L, x, y, z, mats) {
  const w = 0.72, h = 0.72, d = 0.72
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats)
  mesh.position.set(x, y + h / 2, z)
  mesh.castShadow = mesh.receiveShadow = true
  L.scene.add(mesh)
  const c = addCollider(L, x, y, z, w, h, d, { kind: 'box', pushable: true, vx: 0, vy: 0, vz: 0 })
  c.mesh = mesh
  L.boxes.push(c)
  return c
}

// Per-flight: missing indices, crumble indices, half-step {i, side:-1|1}
const FLIGHTS = [
  { missing: [], crumble: [], half: [] },
  { missing: [], crumble: [8], half: [] },
  { missing: [5], crumble: [], half: [] },
  { missing: [], crumble: [3], half: [{ i: 7, side: 1 }] },
  { missing: [4, 5], crumble: [8], half: [] },
  { missing: [2], crumble: [], half: [{ i: 6, side: -1 }] },
  { missing: [3, 4], crumble: [], half: [] },
  { missing: [], crumble: [2, 7], half: [{ i: 5, side: 1 }] },
  { missing: [4, 5], crumble: [1], half: [{ i: 8, side: -1 }] },
  { missing: [6], crumble: [3, 4], half: [] },
  { missing: [5], crumble: [2, 8], half: [{ i: 3, side: 1 }] },
  { missing: [3, 4], crumble: [7, 9], half: [] },
]

function addTread(L, x, topY, z, spec, mats, flightId, i) {
  let w = C.STAIR_W
  let xx = x
  const half = spec.half.find((h) => h.i === i)
  if (half) {
    w = C.STAIR_W * 0.48
    xx = x + half.side * (C.STAIR_W - w) / 2
  }
  const y = topY - C.TREAD_H
  const crumble = spec.crumble.includes(i)
  const mat = crumble ? mats.crumble : (half ? mats.broken : mats.tread)
  const { mesh, c } = solidBox(L, xx, y, z, w, C.TREAD_H, C.TREAD, mat, {
    kind: crumble ? 'crumble' : 'tread',
    standTime: 0,
    shaken: false,
    flightId,
    stepI: i,
  })
  if (crumble) L.crumbles.push(c)
  addWaypoint(L, xx, topY, z)
  return { mesh, c }
}

function buildFlight(L, floor, side, spec, mats, flightId) {
  const n = floor
  for (let i = 0; i < C.STEPS; i++) {
    if (spec.missing.includes(i)) continue
    if (side === 'west') {
      const topY = n * C.FLOOR_H + (i + 1) * C.RISER
      addTread(L, C.WEST_X, topY, westZ(i), spec, mats, flightId, i)
    } else {
      const topY = n * C.FLOOR_H + C.FLOOR_H / 2 + (i + 1) * C.RISER
      addTread(L, C.EAST_X, topY, eastZ(i), spec, mats, flightId, i)
    }
  }
}

function landingSlab(L, x, topY, z, w, d, mat, kind = 'landing') {
  return solidBox(L, x, topY - C.LANDING_H, z, w, C.LANDING_H, d, mat, { kind })
}

function buildStairwell(L, mats) {
  const hw = C.WELL_W / 2
  const hd = C.WELL_D / 2
  const H = C.ROOF_Y + 3.4

  // Outer walls
  solidBox(L, 0, -1.2, -hd - C.WALL / 2, C.WELL_W + C.WALL * 2, H, C.WALL, mats.wall, { kind: 'wall' })
  solidBox(L, -hw - C.WALL / 2, -1.2, (C.LOBBY_Z1 - hd) / 2, C.WALL, H, C.WELL_D + C.LOBBY_EXT + C.WALL, mats.wall, { kind: 'wall' })
  solidBox(L, hw + C.WALL / 2, -1.2, (C.LOBBY_Z1 - hd) / 2, C.WALL, H, C.WELL_D + C.LOBBY_EXT + C.WALL, mats.wall, { kind: 'wall' })
  solidBox(L, 0, -1.2, C.LOBBY_Z1 + C.WALL / 2, C.WELL_W + C.WALL * 2, H, C.WALL, mats.wall, { kind: 'wall' })

  // Lobby + floor-1 well bottom (lethal after countdown)
  const lobbyDepth = C.LANDING_D + C.LOBBY_EXT
  const lobbyZ = hd - C.LANDING_D / 2 + C.LOBBY_EXT / 2
  const lobby = landingSlab(L, 0, 0, lobbyZ, C.WELL_W, lobbyDepth, mats.tile, 'lobby')
  L.lobbyFloor = lobby.c
  // well bottom under the open shaft
  const wellFloor = landingSlab(L, 0, 0, 0, C.WELL_W, C.WELL_D, mats.tile, 'lobby')
  L.wellFloor = wellFloor.c

  // lobby props (visual)
  visualBox(L, -2.6, 0, C.LOBBY_Z1 - 1.6, 1.8, 1.05, 0.7, mats.desk)
  visualBox(L, -2.6, 1.05, C.LOBBY_Z1 - 1.6, 1.6, 0.08, 0.6, mats.deskTop)
  const ext = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.1, 0.7, 8),
    toon(0xb42318, { emissive: 0x5a1008, emissiveIntensity: 0.4 })
  )
  ext.position.set(2.8, 0.42, C.LOBBY_Z1 - 1.2)
  L.scene.add(ext)

  addWaypoint(L, 0, 0, C.WELL_D / 2 + 2.4)
  addWaypoint(L, C.WEST_X, 0, C.SOUTH_Z0 + 0.4)

  const arrow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, 0.55),
    new THREE.MeshBasicMaterial({ color: 0x7ad7ff, transparent: true, opacity: 0.55, side: THREE.DoubleSide })
  )
  arrow.rotation.x = -Math.PI / 2
  arrow.position.set(C.WEST_X, 0.03, C.WELL_D / 2 + 1.1)
  L.scene.add(arrow)

  for (let n = 0; n < C.FLOORS; n++) {
    const fy = n * C.FLOOR_H
    // south landing (n>0 — 1F south is the lobby floor)
    if (n > 0) {
      landingSlab(L, 0, fy, hd - C.LANDING_D / 2, C.WELL_W, C.LANDING_D, mats.tile)
      addWaypoint(L, 0, fy, hd - C.LANDING_D / 2)
      addRail(L, 0, fy, C.SOUTH_Z0 + 0.06, C.WELL_W - C.STAIR_W * 2 - 0.15, 0.9, 0.08, mats.rail)
    }

    buildFlight(L, n, 'west', FLIGHTS[n * 2], mats, n * 2)

    const midY = fy + C.FLOOR_H / 2
    landingSlab(L, 0, midY, -hd + C.LANDING_D / 2, C.WELL_W, C.LANDING_D, mats.tile)
    addWaypoint(L, 0, midY, -hd + C.LANDING_D / 2)
    addRail(L, 0, midY, C.NORTH_Z1 - 0.06, C.WELL_W - C.STAIR_W * 2 - 0.15, 0.9, 0.08, mats.rail)

    buildFlight(L, n, 'east', FLIGHTS[n * 2 + 1], mats, n * 2 + 1)

    const westRailX = C.WEST_X + C.STAIR_W / 2 + 0.05
    const eastRailX = C.EAST_X - C.STAIR_W / 2 - 0.05
    visualBox(L, westRailX, fy + 0.15, 0, 0.06, 0.7, C.WELL_D - C.LANDING_D * 2 - 0.25, mats.rail)
    visualBox(L, eastRailX, fy + C.FLOOR_H / 2 + 0.15, 0, 0.06, 0.7, C.WELL_D - C.LANDING_D * 2 - 0.25, mats.rail)

    // floor plaque
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 0.55), new THREE.MeshBasicMaterial({ map: floorSignTex(`${n + 1}F`) }))
    sign.position.set(-hw + 0.03, fy + 1.7, hd - C.LANDING_D / 2)
    sign.rotation.y = Math.PI / 2
    L.scene.add(sign)

    // emergency cage light
    const lamp = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.12, 0.22),
      toon(0xbfefff, { emissive: 0x7ad7ff, emissiveIntensity: 0.85 })
    )
    lamp.position.set(0, fy + 2.55, n % 2 === 0 ? hd - 0.4 : -hd + 0.4)
    L.scene.add(lamp)
    L.lamps.push(lamp)
  }

  // Roof slab + lookdown hole (railed)
  const roofY = C.ROOF_Y
  landingSlab(L, 0, roofY, hd - C.LANDING_D / 2, C.WELL_W, C.LANDING_D, mats.tile)
  landingSlab(L, 0, roofY, -hd + C.LANDING_D / 2, C.WELL_W, C.LANDING_D, mats.tile)
  landingSlab(L, C.WEST_X, roofY, 0, C.STAIR_W, C.WELL_D - C.LANDING_D * 2, mats.tile)
  landingSlab(L, C.EAST_X, roofY, 0, C.STAIR_W, C.WELL_D - C.LANDING_D * 2, mats.tile)
  addRail(L, 0, roofY, C.SOUTH_Z0, C.WELL_W - C.STAIR_W * 2, 0.95, 0.08, mats.rail)
  addRail(L, 0, roofY, C.NORTH_Z1, C.WELL_W - C.STAIR_W * 2, 0.95, 0.08, mats.rail)
  addWaypoint(L, 0, roofY, 0)
  addWaypoint(L, 0, roofY, -hd + 0.9)

  // ceiling
  visualBox(L, 0, roofY + 2.8, (C.LOBBY_Z1 - hd) / 2, C.WELL_W + 0.2, 0.25, C.WELL_D + C.LOBBY_EXT + 0.2, mats.ceiling)

  // EXIT door
  const doorZ = -hd + 0.18
  const door = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 0.14), toon(0x1c2420, { emissive: 0x0a2014, emissiveIntensity: 0.3 }))
  door.position.set(0, roofY + 1.15, doorZ)
  L.scene.add(door)
  const bar = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.12, 0.16), toon(0x3dff8a, { emissive: 0x1aff6a, emissiveIntensity: 1 }))
  bar.position.set(0, roofY + 1.05, doorZ - 0.04)
  L.scene.add(bar)
  const exitSign = new THREE.Mesh(
    new THREE.PlaneGeometry(1.3, 0.38),
    new THREE.MeshBasicMaterial({ color: 0x3dff8a })
  )
  exitSign.position.set(0, roofY + 2.45, doorZ + 0.02)
  L.scene.add(exitSign)
  L.goal = { pos: new THREE.Vector3(0, roofY, doorZ + 0.8), radius: 1.55, door, bar }

  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(1.1, 1.1, 3.2, 16, 1, true),
    new THREE.MeshBasicMaterial({ color: 0x3dff8a, transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false })
  )
  beam.position.set(0, roofY + 1.6, doorZ + 0.6)
  L.scene.add(beam)

  // hazard strips on landing edges
  for (let n = 1; n <= C.FLOORS; n++) {
    const y = n * C.FLOOR_H + 0.02
    const strip = new THREE.Mesh(new THREE.PlaneGeometry(C.WELL_W - 0.4, 0.18), new THREE.MeshBasicMaterial({ map: mats.hazard }))
    strip.rotation.x = -Math.PI / 2
    strip.position.set(0, y, C.SOUTH_Z0 + 0.12)
    L.scene.add(strip)
  }
}

function buildBoxes(L, mats) {
  makeBox(L, 1.7, 0, C.WELL_D / 2 + 1.8, mats.box)
  makeBox(L, -1.2, 0, C.WELL_D / 2 + 3.1, mats.box)
  // 2F north landing — help the first gap
  makeBox(L, 1.15, C.FLOOR_H + C.FLOOR_H / 2, -C.WELL_D / 2 + C.LANDING_D / 2, mats.box)
  // 4F south landing — help the 2-step gap on the next west? wait 4F is n=3
  makeBox(L, -1.1, C.FLOOR_H * 3, C.WELL_D / 2 - C.LANDING_D / 2, mats.box)
  // 5F north
  makeBox(L, 1.2, C.FLOOR_H * 4 + C.FLOOR_H / 2, -C.WELL_D / 2 + C.LANDING_D / 2, mats.box)
}

export function buildLevel(scene) {
  seed = 90210
  const conc = concreteTex()
  conc.wrapS = conc.wrapT = THREE.RepeatWrapping
  conc.repeat.set(2, 4)
  const tiles = tileTex()
  tiles.wrapS = tiles.wrapT = THREE.RepeatWrapping
  tiles.repeat.set(4, 4)
  const hazard = hazardTex()
  hazard.wrapS = THREE.RepeatWrapping
  hazard.repeat.set(6, 1)

  const boxMap = canvasTex(64, 64, (g) => {
    g.fillStyle = '#c4a574'
    g.fillRect(0, 0, 64, 64)
    g.strokeStyle = '#8a6a3a'
    g.lineWidth = 3
    g.strokeRect(2, 2, 60, 60)
    g.beginPath()
    g.moveTo(8, 8)
    g.lineTo(56, 56)
    g.moveTo(56, 8)
    g.lineTo(8, 56)
    g.stroke()
  })

  const mats = {
    wall: toon(0x7a7f76, { map: conc }),
    tile: toon(0x9aa0a6, { map: tiles }),
    tread: toon(0x8b9088),
    crumble: toon(0xa87858),
    broken: toon(0x6a6560),
    rail: toon(0x2a3036, { emissive: 0x111418, emissiveIntensity: 0.15 }),
    desk: toon(0x3a3330),
    deskTop: toon(0x2a2420),
    ceiling: toon(0x2c3034),
    hazard,
    box: toon(0xc4a574, { map: boxMap }),
  }

  const L = {
    scene,
    colliders: [],
    crumbles: [],
    boxes: [],
    waypoints: [],
    lamps: [],
    lobbyFloor: null,
    wellFloor: null,
    goal: null,
    lavaY: -1.2,
    lavaStarted: false,
  }

  buildStairwell(L, mats)
  buildBoxes(L, mats)

  const crumble0 = L.crumbles[0]
  L.test = {
    spawn: { x: 0, y: 0.02, z: C.WELL_D / 2 + 2.6 },
    stair: { x: C.WEST_X, y: C.RISER + 0.05, z: westZ(0) },
    crumble: crumble0
      ? {
          x: (crumble0.min.x + crumble0.max.x) / 2,
          y: crumble0.max.y + 0.05,
          z: (crumble0.min.z + crumble0.max.z) / 2,
        }
      : { x: C.EAST_X, y: C.FLOOR_H / 2 + 9 * C.RISER, z: eastZ(8) },
    goal: { x: 0, y: C.ROOF_Y + 0.05, z: -C.WELL_D / 2 + 1.0 },
    lobby: { x: 0, y: 0.02, z: C.WELL_D / 2 + 2.6 },
    mid2: { x: 0, y: C.FLOOR_H + 0.05, z: C.WELL_D / 2 - C.LANDING_D / 2 },
  }

  L.spawns = []
  for (let i = 0; i < 8; i++) {
    const col = i % 4
    const row = Math.floor(i / 4)
    L.spawns.push({
      x: (col - 1.5) * 1.15,
      y: 0.02,
      z: C.WELL_D / 2 + 1.8 + row * 1.35,
    })
  }

  return L
}

export function igniteLobby(L) {
  L.lavaStarted = true
  if (L.lobbyFloor) L.lobbyFloor.active = false
  if (L.wellFloor) L.wellFloor.active = false
  L.lavaY = 0.12
}

export function updateCrumbles(L, players, dt) {
  for (const c of L.crumbles) {
    if (c.active === false) {
      if (c.mesh && c.mesh.visible) {
        c.mesh.position.y -= 9 * dt
        c.mesh.rotation.z += 1.6 * dt
        c.mesh.rotation.x += 0.8 * dt
        if (c.mesh.position.y < L.lavaY - 2) c.mesh.visible = false
      }
      continue
    }
    const stood = players.some((p) => p.alive && p.grounded && p.groundC === c)
    if (stood) c.standTime += dt
    else c.standTime = Math.max(0, c.standTime - dt * 0.35)

    if (c.standTime > 0.45 && c.mesh) {
      const cx = (c.min.x + c.max.x) / 2
      c.mesh.position.x = cx + Math.sin(c.standTime * 48) * 0.018
      if (!c.shaken) {
        c.mesh.material = c.mesh.material.clone()
        c.mesh.material.color = new THREE.Color(0xc45a32)
        c.shaken = true
      }
    }
    if (c.standTime >= 1.2) {
      c.active = false
      if (c.mesh) c.mesh.material.color = new THREE.Color(0x5a2a18)
    }
  }
}

export function updateBoxes(L, dt) {
  for (const b of L.boxes) {
    if (b.active === false) continue
    b.vy = (b.vy || 0) - 28 * dt
    if (b.vy < -20) b.vy = -20
    b.vx = (b.vx || 0) * Math.exp(-6 * dt)
    b.vz = (b.vz || 0) * Math.exp(-6 * dt)

    const w = b.max.x - b.min.x
    const h = b.max.y - b.min.y
    const d = b.max.z - b.min.z
    const nx = (b.min.x + b.max.x) / 2 + b.vx * dt
    const ny = b.min.y + b.vy * dt
    const nz = (b.min.z + b.max.z) / 2 + b.vz * dt
    b.min.set(nx - w / 2, ny, nz - d / 2)
    b.max.set(nx + w / 2, ny + h, nz + d / 2)

    let grounded = false
    for (const c of L.colliders) {
      if (c === b || c.active === false || c.pushable) continue
      if (b.max.x <= c.min.x || b.min.x >= c.max.x) continue
      if (b.max.y <= c.min.y || b.min.y >= c.max.y) continue
      if (b.max.z <= c.min.z || b.min.z >= c.max.z) continue
      const pushY = b.max.y - c.min.y < c.max.y - b.min.y ? c.min.y - b.max.y : c.max.y - b.min.y
      const pushX = b.max.x - c.min.x < c.max.x - b.min.x ? c.min.x - b.max.x : c.max.x - b.min.x
      const pushZ = b.max.z - c.min.z < c.max.z - b.min.z ? c.min.z - b.max.z : c.max.z - b.min.z
      if (Math.abs(pushY) <= Math.abs(pushX) && Math.abs(pushY) <= Math.abs(pushZ)) {
        b.min.y += pushY
        b.max.y += pushY
        if (pushY > 0) { b.vy = 0; grounded = true }
        else if (pushY < 0) b.vy = 0
      } else if (Math.abs(pushX) <= Math.abs(pushZ)) {
        b.min.x += pushX
        b.max.x += pushX
        b.vx = 0
      } else {
        b.min.z += pushZ
        b.max.z += pushZ
        b.vz = 0
      }
    }
    if (b.min.y + 0.1 < L.lavaY && L.lavaStarted) {
      b.active = false
      if (b.mesh) b.mesh.visible = false
      continue
    }
    if (b.mesh) {
      b.mesh.position.set((b.min.x + b.max.x) / 2, (b.min.y + b.max.y) / 2, (b.min.z + b.max.z) / 2)
    }
    void grounded
  }
}

export function floorIndex(y) {
  return Math.max(1, Math.min(C.FLOORS + 1, Math.floor(y / C.FLOOR_H + 1.001)))
}
