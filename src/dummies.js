import * as THREE from 'three'
import { DUMMY } from './config.js'

const SIL = [
  '  ####  ',
  ' ###### ',
  ' ###### ',
  '  ####  ',
  '   ##   ',
  ' ###### ',
  '########',
  '########',
  ' ###### ',
  '  ####  ',
  '  ####  ',
  '  #  #  ',
  '  #  #  ',
  ' ##  ## ',
]

const COLORS = [0x3cf0ff, 0xff3ec8, 0xffe14a, 0x5ee6ff]

function makeMat(hex) {
  return new THREE.MeshBasicMaterial({ color: hex })
}

export function createDummies(scene) {
  const specs = [
    { x: -7.5, z: -16.5, color: COLORS[0] },
    { x: -2.5, z: -16.2, color: COLORS[1] },
    { x: 2.5, z: -16.4, color: COLORS[2] },
    { x: 7.5, z: -16.3, color: COLORS[0] },
  ]
  const list = specs.map((s) => makeDummy(scene, s.x, s.z, s.color))
  return list
}

function makeDummy(scene, x, z, hex) {
  const group = new THREE.Group()
  group.position.set(x, 1.02, z)
  scene.add(group)

  const stand = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 1.08, 0.12),
    new THREE.MeshLambertMaterial({ color: 0x12161c }),
  )
  stand.position.y = 0.54
  group.add(stand)

  const disc = new THREE.Mesh(
    new THREE.CircleGeometry(0.62, 28),
    new THREE.MeshBasicMaterial({ color: hex, transparent: true, opacity: 0.16, side: THREE.DoubleSide }),
  )
  disc.rotation.x = -Math.PI / 2
  disc.position.y = 0.03
  group.add(disc)

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.68, 0.92, 32),
    new THREE.MeshBasicMaterial({ color: hex, transparent: true, opacity: 0.95, side: THREE.DoubleSide }),
  )
  ring.rotation.x = -Math.PI / 2
  ring.position.y = 0.04
  group.add(ring)

  const ring2 = new THREE.Mesh(
    new THREE.RingGeometry(1.02, 1.1, 32),
    new THREE.MeshBasicMaterial({ color: hex, transparent: true, opacity: 0.45, side: THREE.DoubleSide }),
  )
  ring2.rotation.x = -Math.PI / 2
  ring2.position.y = 0.045
  group.add(ring2)

  const glow = new THREE.PointLight(hex, 1.65, 7, 2)
  glow.position.y = 1.5
  group.add(glow)

  const body = new THREE.Group()
  body.position.y = 1.12
  group.add(body)

  const mat = makeMat(hex)
  const cells = []
  const vs = DUMMY.voxel
  const colN = SIL[0].length
  const rowN = SIL.length
  const depth = DUMMY.depth
  for (let row = 0; row < rowN; row++) {
    for (let col = 0; col < colN; col++) {
      if (SIL[row][col] !== '#') continue
      for (let d = 0; d < depth; d++) {
        const lx = (col - (colN - 1) / 2) * vs
        const ly = (rowN - 1 - row) * vs
        const lz = (d - (depth - 1) / 2) * vs
        const m = new THREE.Mesh(new THREE.BoxGeometry(vs * 0.96, vs * 0.96, vs * 0.7), mat)
        m.position.set(lx, ly, lz)
        m.castShadow = true
        body.add(m)
        cells.push({ mesh: m, lx, ly, lz, alive: true })
      }
    }
  }

  return {
    group, body, cells, mat, hex, x, z,
    flashT: 0,
    dead: false,
    respawnT: 0,
    baseCount: cells.length,
  }
}

export function updateDummies(list, dt) {
  for (const d of list) {
    if (d.flashT > 0) {
      d.flashT -= dt
      d.mat.color.setHex(d.flashT > 0 ? 0xffffff : d.hex)
    }
    if (d.dead) {
      d.respawnT -= dt
      if (d.respawnT <= 0) respawnDummy(d)
    }
  }
}

function respawnDummy(d) {
  d.dead = false
  for (const c of d.cells) {
    c.alive = true
    c.mesh.visible = true
  }
  d.body.visible = true
}

export function dummyAliveCount(d) {
  let n = 0
  for (const c of d.cells) if (c.alive) n++
  return n
}

export function hitDummy(d, worldPoint, radius, debris) {
  if (d.dead) return 0
  let removed = 0
  const r2 = radius * radius
  for (const c of d.cells) {
    if (!c.alive) continue
    c.mesh.getWorldPosition(_wp)
    const dx = _wp.x - worldPoint.x
    const dy = _wp.y - worldPoint.y
    const dz = _wp.z - worldPoint.z
    if (dx * dx + dy * dy + dz * dz <= r2) {
      c.alive = false
      c.mesh.visible = false
      removed++
      debris.spawn(
        _wp.x, _wp.y, _wp.z,
        (Math.random() - 0.5) * 6,
        3 + Math.random() * 5,
        (Math.random() - 0.5) * 6,
        d.hex, DUMMY.voxel * 0.9, 1.15,
      )
    }
  }
  if (removed) {
    d.flashT = DUMMY.flashMs / 1000
    if (dummyAliveCount(d) < d.baseCount * 0.22) shatterDummy(d, debris)
  }
  return removed
}

const _wp = new THREE.Vector3()

function shatterDummy(d, debris) {
  for (const c of d.cells) {
    if (!c.alive) continue
    c.alive = false
    c.mesh.visible = false
    c.mesh.getWorldPosition(_wp)
    debris.spawn(
      _wp.x, _wp.y, _wp.z,
      (Math.random() - 0.5) * 8,
      4 + Math.random() * 6,
      (Math.random() - 0.5) * 8,
      d.hex, DUMMY.voxel, 1.3,
    )
  }
  d.dead = true
  d.respawnT = DUMMY.respawn
  d.body.visible = false
}

export function rayDummies(list, origin, dir, maxDist = 80) {
  const d = dir.clone().normalize()
  let best = null
  let bestT = maxDist
  const hit = new THREE.Vector3()
  for (const dummy of list) {
    if (dummy.dead) continue
    for (const c of dummy.cells) {
      if (!c.alive) continue
      c.mesh.getWorldPosition(_wp)
      const hs = DUMMY.voxel * 0.5
      const t = rayAABB(origin, d, _wp.x - hs, _wp.y - hs, _wp.z - hs, _wp.x + hs, _wp.y + hs, _wp.z + hs)
      if (t !== null && t < bestT && t > 0) {
        bestT = t
        hit.copy(origin).addScaledVector(d, t)
        best = { dummy, cell: c, t, point: hit.clone() }
      }
    }
  }
  return best
}

function rayAABB(o, d, minX, minY, minZ, maxX, maxY, maxZ) {
  const invX = 1 / (d.x || 1e-8)
  const invY = 1 / (d.y || 1e-8)
  const invZ = 1 / (d.z || 1e-8)
  let t1 = (minX - o.x) * invX, t2 = (maxX - o.x) * invX
  let tmin = Math.min(t1, t2), tmax = Math.max(t1, t2)
  t1 = (minY - o.y) * invY; t2 = (maxY - o.y) * invY
  tmin = Math.max(tmin, Math.min(t1, t2))
  tmax = Math.min(tmax, Math.max(t1, t2))
  t1 = (minZ - o.z) * invZ; t2 = (maxZ - o.z) * invZ
  tmin = Math.max(tmin, Math.min(t1, t2))
  tmax = Math.min(tmax, Math.max(t1, t2))
  if (tmax >= tmin && tmax >= 0) return tmin < 0 ? tmax : tmin
  return null
}
