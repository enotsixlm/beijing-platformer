import * as THREE from 'three'
import { WEAPONS, MAT } from './config.js'
import { rayVoxel, carveSphere } from './voxel.js'
import { hitDummy, rayDummies } from './dummies.js'

export function createLoadout() {
  return {
    slot: 0,
    ammo: WEAPONS.map((w) => w.mag),
    cooldown: 0,
    reloading: false,
    reloadT: 0,
    reloadDur: 1,
  }
}

export function currentWeapon(loadout) {
  return WEAPONS[loadout.slot]
}

export function setSlot(loadout, slot) {
  if (slot === loadout.slot) return
  loadout.slot = slot
  loadout.reloading = false
  loadout.reloadT = 0
  loadout.cooldown = 0.08
}

export function startReload(loadout) {
  const w = currentWeapon(loadout)
  if (loadout.ammo[loadout.slot] >= w.mag || loadout.reloading) return false
  loadout.reloading = true
  loadout.reloadT = 0
  loadout.reloadDur = w.reload
  return true
}

export function stepLoadout(loadout, dt) {
  loadout.cooldown = Math.max(0, loadout.cooldown - dt)
  if (loadout.reloading) {
    loadout.reloadT += dt
    if (loadout.reloadT >= loadout.reloadDur) {
      loadout.reloading = false
      loadout.ammo[loadout.slot] = currentWeapon(loadout).mag
    }
  }
}

const _dir = new THREE.Vector3()
const _spread = new THREE.Vector3()
const _right = new THREE.Vector3()
const _up = new THREE.Vector3()

export function tryFire(ctx) {
  const { loadout, origin, aim, fireHeld, firePressed } = ctx
  const w = currentWeapon(loadout)
  if (loadout.reloading) return null
  if (loadout.ammo[loadout.slot] <= 0) {
    if (firePressed) startReload(loadout)
    return null
  }
  const want = w.auto ? fireHeld : firePressed
  if (!want || loadout.cooldown > 0) return null
  loadout.ammo[loadout.slot]--
  loadout.cooldown = 60 / w.rpm
  if (loadout.ammo[loadout.slot] <= 0) startReload(loadout)

  const shots = []
  if (w.hitscan) {
    for (let i = 0; i < w.pellets; i++) {
      jitterDir(aim, w.spread, _dir)
      shots.push(hitscan(ctx, origin, _dir, w))
    }
  } else {
    shots.push(spawnRocket(ctx, origin, aim, w))
  }
  return { weapon: w, shots }
}

function jitterDir(aim, spread, out) {
  out.copy(aim).normalize()
  if (spread <= 0) return out
  _right.crossVectors(out, new THREE.Vector3(0, 1, 0))
  if (_right.lengthSq() < 1e-6) _right.set(1, 0, 0)
  _right.normalize()
  _up.crossVectors(_right, out).normalize()
  out.addScaledVector(_right, (Math.random() * 2 - 1) * spread)
  out.addScaledVector(_up, (Math.random() * 2 - 1) * spread)
  return out.normalize()
}

function hitscan(ctx, origin, dir, w) {
  const dummyHit = rayDummies(ctx.dummies, origin, dir, 70)
  const worldHit = rayVoxel(ctx.world, origin, dir, 70)
  if (dummyHit && (!worldHit || dummyHit.t <= worldHit.t)) {
    const n = hitDummy(dummyHit.dummy, dummyHit.point, w.dummyRadius, ctx.debris)
    return { kind: 'dummy', point: dummyHit.point, removed: n, dummy: dummyHit.dummy }
  }
  if (worldHit) {
    if (w.carve && ctx.world.destructible(worldHit.id)) {
      const removed = carveSphere(ctx.world, worldHit.x + 0.5, worldHit.y + 0.5, worldHit.z + 0.5, w.carve)
      ctx.dirty = true
      spawnCarveDebris(ctx, removed)
    } else {
      ctx.debris.burst(worldHit.point.x, worldHit.point.y, worldHit.point.z, 0xffc14a, 4, 3, 0.08)
    }
    return { kind: 'world', point: worldHit.point, id: worldHit.id, hit: worldHit }
  }
  const far = origin.clone().addScaledVector(dir, 60)
  return { kind: 'miss', point: far }
}

function spawnRocket(ctx, origin, aim, w) {
  const dir = aim.clone().normalize()
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.22, 0.46),
    new THREE.MeshLambertMaterial({ color: 0xff9a1a, emissive: 0xff6a00, emissiveIntensity: 1.6 }),
  )
  mesh.position.copy(origin)
  mesh.lookAt(origin.clone().add(dir))
  ctx.scene.add(mesh)
  const light = new THREE.PointLight(0xff8a1a, 2.2, 8)
  mesh.add(light)
  const rocket = {
    mesh, dir, speed: w.speed, alive: true, age: 0, radius: w.radius, dummyRadius: w.dummyRadius,
  }
  ctx.rockets.push(rocket)
  return { kind: 'rocket', point: origin.clone() }
}

export function stepRockets(ctx, dt) {
  for (const r of ctx.rockets) {
    if (!r.alive) continue
    r.age += dt
    const step = r.dir.clone().multiplyScalar(r.speed * dt)
    const next = r.mesh.position.clone().add(step)
    const dummyHit = rayDummies(ctx.dummies, r.mesh.position, r.dir, r.speed * dt + 0.2)
    const worldHit = rayVoxel(ctx.world, r.mesh.position, r.dir, r.speed * dt + 0.35)
    if (dummyHit || worldHit || r.age > 3.2) {
      const p = dummyHit ? dummyHit.point : (worldHit ? worldHit.point : next)
      explode(ctx, p, r.radius, r.dummyRadius)
      r.alive = false
      ctx.scene.remove(r.mesh)
      r.mesh.geometry.dispose()
      continue
    }
    r.mesh.position.copy(next)
    ctx.debris.spawn(
      r.mesh.position.x, r.mesh.position.y, r.mesh.position.z,
      0, 0.2, 0, 0xffc14a, 0.08, 0.18,
    )
  }
  ctx.rockets = ctx.rockets.filter((r) => r.alive)
}

function explode(ctx, point, radius, dummyRadius) {
  const [cx, cy, cz] = ctx.world.worldToCell(point.x, point.y, point.z)
  const removed = carveSphere(ctx.world, cx + 0.5, cy + 0.5, cz + 0.5, radius)
  ctx.dirty = true
  ctx.carved += removed.length
  spawnCarveDebris(ctx, removed)
  ctx.debris.burst(point.x, point.y, point.z, 0xff9a1a, 28, 10, 0.22)
  ctx.debris.burst(point.x, point.y, point.z, 0xffe14a, 16, 8, 0.14)
  for (const d of ctx.dummies) {
    const dx = d.x - point.x
    const dz = d.z - point.z
    const dy = (1.6) - point.y
    if (dx * dx + dy * dy + dz * dz < (dummyRadius + 1.4) ** 2) {
      hitDummy(d, new THREE.Vector3(d.x, 1.8, d.z), dummyRadius, ctx.debris)
    }
  }
  ctx.onExplode?.(point)
}

function spawnCarveDebris(ctx, removed) {
  for (const cell of removed) {
    const p = ctx.world.cellToWorld(cell.x, cell.y, cell.z)
    const hex = cell.id === MAT.NEON ? 0x2ee8ff : cell.id === MAT.FLOOR ? 0x1a3a44 : 0x3a4148
    ctx.debris.spawn(
      p.x, p.y, p.z,
      (Math.random() - 0.5) * 7,
      2 + Math.random() * 6,
      (Math.random() - 0.5) * 7,
      hex, 0.22 + Math.random() * 0.1, 1.0,
    )
  }
}

export function makeTracer(scene, from, to, hex) {
  const geo = new THREE.BufferGeometry().setFromPoints([from, to])
  const line = new THREE.Line(geo, new THREE.LineBasicMaterial({
    color: hex, transparent: true, opacity: 0.95,
  }))
  scene.add(line)
  return { mesh: line, life: 0.07 }
}

export function makeMuzzle(scene, pos) {
  const light = new THREE.PointLight(0xff9a30, 3.2, 7)
  light.position.copy(pos)
  scene.add(light)
  const flash = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.18, 0.18),
    new THREE.MeshBasicMaterial({ color: 0xffe9a0 }),
  )
  flash.position.copy(pos)
  scene.add(flash)
  return { light, flash, life: 0.05 }
}
