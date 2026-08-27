import * as THREE from 'three'
import { toon, canvasTex } from './toon.js'
import { createGuard } from './guards.js'

export const MAP = {
  start: { x: 0, y: 0, z: 1 },
  crateHop: { x: -8, z: 12 },
  intel: { x: 0, z: 84 },
  extract: { x: 26, z: 76, radius: 3.8 },
}

let seed = 90210
const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647

function ctx(scene) {
  return {
    scene,
    colliders: [],
    bushes: [],
    crates: [],
    props: [],
    floodlights: [],
    searchlights: [],
    checkpoints: [],
  }
}

function addCollider(L, x, y, z, w, h, d, extra = {}) {
  const c = {
    min: new THREE.Vector3(x - w / 2, y, z - d / 2),
    max: new THREE.Vector3(x + w / 2, y + h, z + d / 2),
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

function mats() {
  const concrete = canvasTex(128, (g, s) => {
    g.fillStyle = '#5a6158'
    g.fillRect(0, 0, s, s)
    for (let i = 0; i < 180; i++) {
      g.fillStyle = `rgba(20,24,18,${0.04 + rand() * 0.08})`
      g.fillRect(rand() * s, rand() * s, 1 + rand() * 3, 1 + rand() * 3)
    }
    g.strokeStyle = '#6a7268'
    g.lineWidth = 4
    g.strokeRect(0, 0, s, s)
  }, { repeat: 18 })

  const crate = canvasTex(64, (g, s) => {
    g.fillStyle = '#8a6236'
    g.fillRect(0, 0, s, s)
    g.strokeStyle = '#5c3e1e'
    g.lineWidth = 4
    g.strokeRect(3, 3, s - 6, s - 6)
    g.beginPath()
    g.moveTo(8, 8); g.lineTo(s - 8, s - 8)
    g.moveTo(s - 8, 8); g.lineTo(8, s - 8)
    g.stroke()
  }, { wrap: false })

  const metal = canvasTex(64, (g, s) => {
    g.fillStyle = '#2c333c'
    g.fillRect(0, 0, s, s)
    g.strokeStyle = '#3d4652'
    g.lineWidth = 2
    for (let y = 8; y < s; y += 12) {
      g.beginPath(); g.moveTo(0, y); g.lineTo(s, y); g.stroke()
    }
  }, { repeat: 4 })

  const brick = canvasTex(64, (g, s) => {
    g.fillStyle = '#3a4038'
    g.fillRect(0, 0, s, s)
    g.fillStyle = '#2a3028'
    for (let y = 0; y < s; y += 8) {
      const off = (y / 8) % 2 === 0 ? 0 : 8
      for (let x = off; x < s; x += 16) g.fillRect(x + 1, y + 1, 14, 6)
    }
  }, { repeat: 6 })

  const chain = canvasTex(64, (g, s) => {
    g.clearRect(0, 0, s, s)
    g.strokeStyle = '#8a9488'
    g.lineWidth = 2
    for (let x = 0; x < s; x += 10) {
      for (let y = 0; y < s; y += 10) {
        g.strokeRect(x + 1, y + 1, 8, 8)
      }
    }
  }, { wrap: true, repeat: 8 })
  chain.premultiplyAlpha = false

  return {
    ground: toon(0xffffff, { map: concrete }),
    wall: toon(0xffffff, { map: brick }),
    crate: toon(0xffffff, { map: crate }),
    metal: toon(0xffffff, { map: metal }),
    sand: toon(0x8a7a54),
    dark: toon(0x1c221c),
    olive: toon(0x3a4a32),
    rust: toon(0x6a3a28),
    yellow: toon(0xc9a227),
    light: toon(0xfff1c2, { emissive: 0x665522 }),
    chainMat: new THREE.MeshBasicMaterial({
      map: chain, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false,
    }),
  }
}

function bush(L, x, z, r = 1.6) {
  const g = new THREE.Group()
  const mat = toon(0x1f3a22)
  for (let i = 0; i < 4; i++) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(r * (0.45 + rand() * 0.25), 8, 6), mat)
    s.position.set((rand() - 0.5) * r, r * 0.4, (rand() - 0.5) * r)
    s.scale.y = 0.7
    g.add(s)
  }
  g.position.set(x, 0, z)
  g.traverse((o) => { if (o.isMesh) o.castShadow = true })
  L.scene.add(g)
  L.bushes.push({ x, z, r: r * 0.85 })
}

function crate(L, M, x, z, stack = 1, s = 1.15) {
  for (let i = 0; i < stack; i++) {
    solidBox(L, x + (i > 0 ? (rand() - 0.5) * 0.05 : 0), i * s, z, s, s, s, M.crate)
  }
}

function sandbag(L, M, x, z, rot = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.55, 0.7), M.sand)
  m.position.set(x, 0.28, z)
  m.rotation.y = rot
  m.castShadow = m.receiveShadow = true
  L.scene.add(m)
  addCollider(L, x, 0, z, 1.8, 0.55, 0.7)
}

function wallSeg(L, M, x, z, w, d, h = 3.6) {
  return solidBox(L, x, 0, z, w, h, d, M.wall)
}

function floodlight(L, M, x, z, lookX, lookZ) {
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 4.2, 8), M.metal)
  pole.position.set(x, 2.1, z)
  pole.castShadow = true
  const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.28, 0.4), M.light)
  lamp.position.set(x, 4.15, z)
  L.scene.add(pole, lamp)
  const pt = new THREE.PointLight(0xffe6a8, 1.6, 18, 2)
  pt.position.set(x, 4.0, z)
  L.scene.add(pt)
  L.floodlights.push(lamp)
}

function jeep(L, M, x, z, rot) {
  const g = new THREE.Group()
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.7, 4.2), M.olive)
  body.position.y = 0.7
  g.add(body)
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.7, 1.6), M.dark)
  cabin.position.set(0, 1.35, -0.4)
  g.add(cabin)
  const wheelG = new THREE.CylinderGeometry(0.38, 0.38, 0.28, 10)
  for (const [wx, wz] of [[-1.1, 1.3], [1.1, 1.3], [-1.1, -1.3], [1.1, -1.3]]) {
    const w = new THREE.Mesh(wheelG, M.dark)
    w.rotation.z = Math.PI / 2
    w.position.set(wx, 0.38, wz)
    g.add(w)
  }
  g.position.set(x, 0, z)
  g.rotation.y = rot
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true } })
  L.scene.add(g)
  addCollider(L, x, 0, z, rot % Math.PI === 0 ? 2.2 : 4.2, 1.6, rot % Math.PI === 0 ? 4.2 : 2.2)
}

function tree(L, x, z, s = 1) {
  const g = new THREE.Group()
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18 * s, 0.26 * s, 2.2 * s, 6), toon(0x3a2a18))
  trunk.position.y = 1.1 * s
  g.add(trunk)
  const leaf = toon(0x16351c)
  for (const [dx, y, dz, r] of [[0, 2.6, 0, 1.3], [-0.6, 2.2, 0.3, 0.9], [0.5, 2.3, -0.2, 0.85]]) {
    const c = new THREE.Mesh(new THREE.SphereGeometry(r * s, 8, 6), leaf)
    c.position.set(dx * s, y * s, dz * s)
    g.add(c)
  }
  g.position.set(x, 0, z)
  g.traverse((o) => { if (o.isMesh) o.castShadow = true })
  L.scene.add(g)
}

function watchtower(L, M, x, z) {
  const g = new THREE.Group()
  for (const [lx, lz] of [[-1.1, -1.1], [1.1, -1.1], [-1.1, 1.1], [1.1, 1.1]]) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 7, 6), M.metal)
    p.position.set(lx, 3.5, lz)
    g.add(p)
  }
  const deck = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.18, 3.2), M.metal)
  deck.position.y = 7
  g.add(deck)
  const hut = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.6, 2.2), M.olive)
  hut.position.y = 7.9
  g.add(hut)
  const roof = new THREE.Mesh(new THREE.ConeGeometry(1.8, 0.8, 4), M.rust)
  roof.position.y = 9.1
  roof.rotation.y = Math.PI / 4
  g.add(roof)
  g.position.set(x, 0, z)
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true } })
  L.scene.add(g)
  addCollider(L, x, 0, z, 2.6, 7, 2.6)

  const spot = new THREE.SpotLight(0xfff0c0, 8, 42, 0.22, 0.45, 1.2)
  spot.position.set(x, 8.4, z)
  spot.castShadow = false
  const tgt = new THREE.Object3D()
  tgt.position.set(x + 8, 0, z + 6)
  L.scene.add(spot, tgt)
  spot.target = tgt
  L.searchlights.push({ light: spot, target: tgt, ox: x, oz: z, t: 0 })
}

function helicopter(L, M, x, z) {
  const g = new THREE.Group()
  const fuse = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.3, 5.4), M.olive)
  fuse.position.y = 1.4
  g.add(fuse)
  const nose = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.9, 1.4), toon(0x2a3328, { transparent: true, opacity: 0.85 }))
  nose.position.set(0, 1.5, 3.1)
  g.add(nose)
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 4.2), M.olive)
  tail.position.set(0, 1.7, -4.4)
  g.add(tail)
  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.1, 0.7), M.olive)
  fin.position.set(0, 2.3, -6.3)
  g.add(fin)
  const rotor = new THREE.Mesh(new THREE.BoxGeometry(9.5, 0.06, 0.28), M.dark)
  rotor.position.y = 2.25
  g.add(rotor)
  const rotor2 = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.06, 9.5), M.dark)
  rotor2.position.y = 2.25
  g.add(rotor2)
  for (const s of [-1, 1]) {
    const skid = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 4.4), M.metal)
    skid.position.set(0.9 * s, 0.4, 0.3)
    g.add(skid)
  }
  g.position.set(x, 0, z)
  g.rotation.y = Math.PI
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true } })
  L.scene.add(g)
  addCollider(L, x, 0, z, 2.6, 2.2, 6.2)
  return { group: g, rotors: [rotor, rotor2] }
}

function helipadMark(L, x, z) {
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(3.6, 4.1, 32),
    new THREE.MeshBasicMaterial({ color: 0xc9a227, transparent: true, opacity: 0.7, side: THREE.DoubleSide })
  )
  ring.rotation.x = -Math.PI / 2
  ring.position.set(x, 0.03, z)
  L.scene.add(ring)
  const h = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.2), new THREE.MeshBasicMaterial({ color: 0xc9a227, transparent: true, opacity: 0.7, side: THREE.DoubleSide }))
  h.rotation.x = -Math.PI / 2
  h.position.set(x, 0.04, z)
  L.scene.add(h)
}

function intelProp(L, M, x, z) {
  const desk = solidBox(L, x, 0, z, 2.4, 0.9, 1.1, M.metal)
  const disk = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.08, 0.45), toon(0x33ffaa, { emissive: 0x0a5533 }))
  disk.position.set(x, 1.02, z)
  L.scene.add(disk)
  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 6, 12, 1, true),
    new THREE.MeshBasicMaterial({ color: 0x33ffaa, transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false })
  )
  beam.position.set(x, 4, z)
  L.scene.add(beam)
  return { desk, disk, beam, pos: new THREE.Vector3(x, 0, z) }
}

function checkpoint(L, name, x, z) {
  L.checkpoints.push({ name, pos: new THREE.Vector3(x, 0, z), radius: 4.2, active: false })
}

function ground(L, M) {
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(220, 220), M.ground)
  floor.rotation.x = -Math.PI / 2
  floor.position.set(4, -0.02, 46)
  floor.receiveShadow = true
  L.scene.add(floor)

  const dirt = new THREE.Mesh(new THREE.PlaneGeometry(80, 24), toon(0x24301c))
  dirt.rotation.x = -Math.PI / 2
  dirt.position.set(0, -0.01, -4)
  dirt.receiveShadow = true
  L.scene.add(dirt)

  const pad = new THREE.Mesh(new THREE.CircleGeometry(6.5, 28), toon(0x3a4038))
  pad.rotation.x = -Math.PI / 2
  pad.position.set(26, 0.01, 78)
  pad.receiveShadow = true
  L.scene.add(pad)
}

function stars(scene) {
  const n = 400
  const pos = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const a = rand() * Math.PI * 2
    const y = 40 + rand() * 80
    const r = 80 + rand() * 90
    pos[i * 3] = Math.cos(a) * r
    pos[i * 3 + 1] = y
    pos[i * 3 + 2] = 40 + Math.sin(a) * r
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xcfe6ff, size: 0.55 })))
}

function moon(scene) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(6, 16, 12), new THREE.MeshBasicMaterial({ color: 0xdde8f8 }))
  m.position.set(-40, 55, -20)
  scene.add(m)
  const glow = new THREE.Mesh(new THREE.SphereGeometry(8, 12, 8), new THREE.MeshBasicMaterial({ color: 0x88aacc, transparent: true, opacity: 0.12 }))
  glow.position.copy(m.position)
  scene.add(glow)
}

function perimeter(L, M) {
  // south fence with a gap
  wallSeg(L, M, -16, 6, 22, 0.55, 3.4)
  wallSeg(L, M, 20, 6, 30, 0.55, 3.4)
  // chain-link visual in the gap sides already walls. Gap at x=0
  const fenceL = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), M.chainMat)
  fenceL.position.set(-3.4, 1.3, 6.3)
  const fenceR = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), M.chainMat)
  fenceR.position.set(3.4, 1.3, 6.3)
  L.scene.add(fenceL, fenceR)

  wallSeg(L, M, -28, 48, 0.7, 85, 3.6)
  wallSeg(L, M, 36, 48, 0.7, 85, 3.6)
  wallSeg(L, M, 4, 90, 65, 0.7, 3.6)

  // gate posts
  for (const x of [-2.4, 2.4]) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 3.2, 8), M.metal)
    p.position.set(x, 1.6, 6)
    p.castShadow = true
    L.scene.add(p)
  }
}

function warehouse(L, M) {
  // U-shaped warehouse, open to the south
  wallSeg(L, M, -18, 50, 20, 0.7, 4.2)
  wallSeg(L, M, -28, 41, 0.7, 18, 4.2)
  wallSeg(L, M, -8, 41, 0.7, 18, 4.2)
  const roof = new THREE.Mesh(new THREE.BoxGeometry(21, 0.25, 19), M.metal)
  roof.position.set(-18, 4.3, 41)
  roof.castShadow = true
  L.scene.add(roof)
  crate(L, M, -22, 38, 2)
  crate(L, M, -20, 44, 1)
  crate(L, M, -14, 42, 2)
  crate(L, M, -16, 36, 1)
}

function commandBuilding(L, M) {
  // south wall with door
  wallSeg(L, M, -7.5, 66, 9, 0.7, 3.8)
  wallSeg(L, M, 7.5, 66, 9, 0.7, 3.8)
  wallSeg(L, M, -12, 77, 0.7, 22, 3.8)
  wallSeg(L, M, 12, 70, 0.7, 8, 3.8)
  wallSeg(L, M, 12, 83.5, 0.7, 9, 3.8)
  wallSeg(L, M, 0, 88, 24.7, 0.7, 3.8)
  // interior partition
  wallSeg(L, M, -4, 78, 8, 0.55, 3.2)
  const roof = new THREE.Mesh(new THREE.BoxGeometry(25, 0.22, 23), M.metal)
  roof.position.set(0, 3.95, 77)
  L.scene.add(roof)
  const lamp = new THREE.PointLight(0xffd9a0, 2.2, 16, 2)
  lamp.position.set(0, 3.2, 84)
  L.scene.add(lamp)
}

function buildSky(scene) {
  stars(scene)
  moon(scene)
}

export function buildLevel(scene) {
  const L = ctx(scene)
  const M = mats()
  L.mats = M
  ground(L, M)
  buildSky(scene)
  perimeter(L, M)

  // jungle approach
  for (let i = 0; i < 18; i++) {
    const side = i % 2 === 0 ? -1 : 1
    tree(L, side * (8 + rand() * 16), -6 + rand() * 10, 0.8 + rand() * 0.6)
  }
  bush(L, -3.2, 3.2, 1.7)
  bush(L, 3.4, 2.8, 1.5)
  bush(L, -6.5, 4.5, 1.4)

  // outer yard cover
  crate(L, M, -8, 12, 1)
  crate(L, M, -8, 16, 2)
  crate(L, M, 7.5, 14, 1)
  crate(L, M, -12, 24, 1)
  crate(L, M, 4, 22, 2)
  sandbag(L, M, -4, 20, 0.2)
  sandbag(L, M, 5, 28, -0.4)
  jeep(L, M, 22, 16, 0.15)
  jeep(L, M, 22, 28, -0.05)
  floodlight(L, M, -24, 14)
  floodlight(L, M, 30, 20)
  floodlight(L, M, -24, 54)
  floodlight(L, M, 32, 54)

  warehouse(L, M)
  crate(L, M, -2, 36, 1)
  crate(L, M, 3, 40, 2)
  crate(L, M, -4, 44, 1)
  crate(L, M, 8, 34, 1)
  crate(L, M, 10, 46, 2)

  watchtower(L, M, -22, 58)
  sandbag(L, M, -8, 54, 0)
  sandbag(L, M, 8, 60, 1.1)
  crate(L, M, 6, 52, 1)
  crate(L, M, -6, 62, 2)

  commandBuilding(L, M)
  const intel = intelProp(L, M, MAP.intel.x, MAP.intel.z)

  helipadMark(L, 26, 76)
  const chopper = helicopter(L, M, 26, 84)

  // more trees outside walls
  for (let i = 0; i < 22; i++) {
    tree(L, -36 - rand() * 12, rand() * 90, 0.9 + rand() * 0.8)
    tree(L, 44 + rand() * 12, rand() * 90, 0.9 + rand() * 0.8)
  }

  checkpoint(L, 'Breach', 0, 4)
  checkpoint(L, 'Loading Bay', 0, 40)
  checkpoint(L, 'Command', 0, 68)

  const guards = [
    createGuard(scene, {
      id: 0, range: 12.2, fov: 40,
      waypoints: [[-12, 18], [12, 18]],
    }),
    createGuard(scene, {
      id: 1, range: 11.5, fov: 38,
      waypoints: [[18, 10], [18, 26]],
    }),
    createGuard(scene, {
      id: 2, range: 11.8, fov: 42,
      waypoints: [[-6, 36], [6, 36], [6, 46], [-6, 46]],
    }),
    createGuard(scene, {
      id: 3, range: 12.5, fov: 40,
      waypoints: [[-12, 56], [12, 56]],
    }),
    createGuard(scene, {
      id: 4, range: 11, fov: 38,
      waypoints: [[0, 52], [0, 64]],
    }),
    createGuard(scene, {
      id: 5, range: 10.5, fov: 44,
      waypoints: [[-7, 74], [7, 74], [7, 82], [-7, 82]],
    }),
    createGuard(scene, {
      id: 6, range: 12, fov: 40,
      waypoints: [[22, 72], [30, 80]],
    }),
  ]

  return {
    colliders: L.colliders,
    bushes: L.bushes,
    checkpoints: L.checkpoints,
    searchlights: L.searchlights,
    floodlights: L.floodlights,
    intel,
    chopper,
    guards,
    map: MAP,
    start: MAP.start,
  }
}

export function updateSearchlights(lights, t) {
  for (const sl of lights) {
    const a = Math.sin(t * 0.55 + sl.oz) * 0.95
    sl.target.position.set(sl.ox + Math.sin(a) * 16, 0.2, sl.oz + Math.cos(a) * 14)
  }
}

export function updateChopper(chopper, dt, extracting) {
  const spd = extracting ? 14 : 2.2
  for (const r of chopper.rotors) r.rotation.y += spd * dt
}
