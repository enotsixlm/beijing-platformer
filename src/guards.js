import * as THREE from 'three'
import { toon } from './toon.js'
import { createHumanoid, playerEye } from './player.js'

export const ALERT = {
  INFILTRATION: 'infiltration',
  ALERT: 'alert',
  EVASION: 'evasion',
  CAUTION: 'caution',
}

function markTex(ch, color) {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  g.fillStyle = 'rgba(0,0,0,0.55)'
  g.beginPath()
  g.arc(32, 32, 28, 0, Math.PI * 2)
  g.fill()
  g.fillStyle = color
  g.font = 'bold 42px ui-monospace, monospace'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillText(ch, 32, 34)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

let texQ, texE
function marks() {
  if (!texQ) {
    texQ = markTex('?', '#ffe066')
    texE = markTex('!', '#ff3b3b')
  }
  return { texQ, texE }
}

function makeFan(range, halfAng, color) {
  const n = 16
  const pos = [0, 0.05, 0]
  for (let i = 0; i <= n; i++) {
    const a = -halfAng + (2 * halfAng * i) / n
    pos.push(Math.sin(a) * range, 0.05, Math.cos(a) * range)
  }
  const idx = []
  for (let i = 1; i <= n; i++) idx.push(0, i, i + 1)
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  const mat = new THREE.MeshBasicMaterial({
    color, transparent: true, opacity: 0.14, side: THREE.DoubleSide, depthWrite: false,
  })
  const m = new THREE.Mesh(geo, mat)
  m.renderOrder = 2
  return m
}

export function lineOfSight(from, to, colliders, targetY) {
  const dx = to.x - from.x
  const dz = to.z - from.z
  const dist = Math.hypot(dx, dz)
  if (dist < 0.2) return true
  const steps = Math.max(2, Math.ceil(dist / 0.38))
  const y0 = from.y
  const y1 = targetY
  for (let i = 1; i < steps; i++) {
    const t = i / steps
    const x = from.x + dx * t
    const y = y0 + (y1 - y0) * t
    const z = from.z + dz * t
    for (const c of colliders) {
      if (c.seeThrough) continue
      if (x >= c.min.x && x <= c.max.x && z >= c.min.z && z <= c.max.z && y >= c.min.y && y <= c.max.y) {
        return false
      }
    }
  }
  return true
}

export function createGuard(scene, opts) {
  const mesh = createHumanoid('guard')
  scene.add(mesh.group)
  const fan = makeFan(opts.range ?? 12.5, THREE.MathUtils.degToRad(opts.fov ?? 42), 0x44ff88)
  mesh.group.add(fan)
  const { texQ, texE } = marks()
  const mark = new THREE.Sprite(new THREE.SpriteMaterial({ map: texQ, transparent: true, depthWrite: false }))
  mark.scale.set(0.7, 0.7, 1)
  mark.position.y = 2.15
  mark.visible = false
  mesh.group.add(mark)
  const flashlight = new THREE.Mesh(
    new THREE.ConeGeometry(0.35, 2.4, 10, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xfff2c4, transparent: true, opacity: 0.09, side: THREE.DoubleSide, depthWrite: false })
  )
  flashlight.position.set(0, 1.45, 1.3)
  flashlight.rotation.x = -Math.PI / 2
  mesh.group.add(flashlight)

  const wps = opts.waypoints.map(([x, z]) => new THREE.Vector3(x, 0, z))
  mesh.group.position.set(wps[0].x, 0, wps[0].z)
  return {
    id: opts.id,
    mesh,
    fan,
    mark,
    visor: mesh.visor,
    pos: new THREE.Vector3(wps[0].x, 0, wps[0].z),
    heading: opts.heading ?? 0,
    waypoints: wps,
    wp: 0,
    wait: 0,
    state: 'patrol',
    detect: 0,
    lastKnown: new THREE.Vector3(),
    lookT: 0,
    fireCd: 0,
    range: opts.range ?? 12.5,
    fov: THREE.MathUtils.degToRad(opts.fov ?? 42),
    walk: opts.walk ?? 1.85,
    chase: opts.chase ?? 4.55,
    ko: false,
    koT: 0,
    searchT: 0,
    searchOff: new THREE.Vector3(),
    muzzle: 0,
  }
}

export function createAlertState() {
  return {
    phase: ALERT.INFILTRATION,
    timer: 0,
    lastKnown: new THREE.Vector3(),
    siren: 0,
  }
}

function forward(heading) {
  return { x: Math.sin(heading), z: Math.cos(heading) }
}

function turnToward(cur, target, rate, dt) {
  let d = target - cur
  while (d > Math.PI) d -= Math.PI * 2
  while (d < -Math.PI) d += Math.PI * 2
  const max = rate * dt
  if (d > max) d = max
  if (d < -max) d = -max
  return cur + d
}

function inCone(g, tx, tz, range, fov) {
  const dx = tx - g.pos.x
  const dz = tz - g.pos.z
  const dist = Math.hypot(dx, dz)
  if (dist > range || dist < 0.05) return { hit: dist <= range && dist < 0.8, dist }
  const f = forward(g.heading)
  const ang = Math.acos(Math.min(1, Math.max(-1, (f.x * dx + f.z * dz) / dist)))
  return { hit: ang <= fov, dist, ang }
}

function moveToward(g, tx, tz, speed, dt, colliders) {
  const dx = tx - g.pos.x
  const dz = tz - g.pos.z
  const dist = Math.hypot(dx, dz)
  if (dist < 0.25) return dist
  const want = Math.atan2(dx, dz)
  g.heading = turnToward(g.heading, want, 4.8, dt)
  const f = forward(g.heading)
  const step = speed * dt
  const nx = g.pos.x + f.x * step
  const nz = g.pos.z + f.z * step
  if (!blocked(nx, nz, colliders, g.pos)) {
    g.pos.x = nx
    g.pos.z = nz
  } else if (!blocked(g.pos.x + f.x * step, g.pos.z, colliders, g.pos)) {
    g.pos.x += f.x * step
  } else if (!blocked(g.pos.x, g.pos.z + f.z * step, colliders, g.pos)) {
    g.pos.z += f.z * step
  }
  return dist
}

function blocked(x, z, colliders, from) {
  const r = 0.34
  for (const c of colliders) {
    if (c.max.y < 0.6) continue
    if (x + r > c.min.x && x - r < c.max.x && z + r > c.min.z && z - r < c.max.z) {
      // allow if we're already overlapping (don't get stuck)
      if (from && from.x + r > c.min.x && from.x - r < c.max.x && from.z + r > c.min.z && from.z - r < c.max.z) continue
      return true
    }
  }
  return false
}

function behindGuard(g, px, pz) {
  const dx = px - g.pos.x
  const dz = pz - g.pos.z
  const dist = Math.hypot(dx, dz)
  const f = forward(g.heading)
  return { behind: (f.x * dx + f.z * dz) < -0.15 * dist, dist }
}

export function tryCQC(player, guards) {
  if (player.cqcCooldown > 0 || player.boxOn) return null
  let best = null
  let bestD = 1.55
  for (const g of guards) {
    if (g.ko) continue
    const { behind, dist } = behindGuard(g, player.pos.x, player.pos.z)
    if (dist < bestD) {
      bestD = dist
      best = { g, behind, dist }
    }
  }
  if (!best) return null
  player.cqcCooldown = 0.7
  if (best.behind || best.dist < 1.05) {
    knockOut(best.g)
    return { kind: 'ko', guard: best.g, silent: best.behind }
  }
  best.g.detect = 1
  best.g.lastKnown.copy(player.pos)
  return { kind: 'scuffle', guard: best.g }
}

export function knockOut(g) {
  g.ko = true
  g.state = 'ko'
  g.detect = 0
  g.koT = 0
  g.fan.visible = false
  g.mark.visible = false
}

export function stepGuards(guards, dt, world) {
  const { player, colliders, noiseEvents, alert, bushes } = world
  const shots = []
  const events = []
  let spotted = false
  const alertBoost = alert.phase === ALERT.ALERT || alert.phase === ALERT.EVASION
  const caution = alert.phase === ALERT.CAUTION

  for (const g of guards) {
    if (g.ko) {
      g.koT += dt
      g.mesh.group.position.set(g.pos.x, 0.18, g.pos.z)
      g.mesh.group.rotation.set(Math.PI / 2, g.heading, 0)
      g.fan.visible = false
      continue
    }

    const range = (alertBoost ? g.range * 1.25 : caution ? g.range * 1.1 : g.range)
    const fov = alertBoost ? g.fov * 1.15 : g.fov
    const eye = { x: g.pos.x, y: 1.48, z: g.pos.z }
    const pEyeY = playerEye(player)
    const hiddenBush = player.crouch && inBush(player, bushes)

    let seeing = false
    let dist = 99
    if (!hiddenBush) {
      const cone = inCone(g, player.pos.x, player.pos.z, range, fov)
      dist = cone.dist
      const los = cone.hit && lineOfSight(eye, player.pos, colliders, pEyeY)
      if (player.boxOn) {
        if (dist < 1.2) seeing = true
        else if (los && player.moving && dist < 5.5) seeing = true
      } else if (los) {
        seeing = true
      }
    }

    if (seeing) {
      const distFactor = 1 - Math.min(1, dist / range)
      let stance = player.boxOn ? 0.2 : player.crouch ? 0.38 : 1
      if (dist < 3.2 && !player.boxOn) stance = Math.max(stance, 1.4)
      const rate = (0.55 + distFactor * 2.1) * stance
      g.detect = Math.min(1, g.detect + rate * dt)
      g.lastKnown.copy(player.pos)
      if (g.detect >= 1) spotted = true
    } else {
      g.detect = Math.max(0, g.detect - dt * (alertBoost ? 0.18 : 0.55))
    }

    // hear player
    if (!seeing && player.noise > 0.5) {
      const hd = Math.hypot(player.pos.x - g.pos.x, player.pos.z - g.pos.z)
      if (hd < player.noise) {
        g.lastKnown.copy(player.pos)
        if (g.state === 'patrol') {
          g.state = 'suspicious'
          g.lookT = 0
        }
      }
    }
    for (const n of noiseEvents) {
      const hd = Math.hypot(n.x - g.pos.x, n.z - g.pos.z)
      if (hd < n.radius) {
        g.lastKnown.set(n.x, 0, n.z)
        if (g.state === 'patrol' || g.state === 'search') {
          g.state = 'suspicious'
          g.lookT = 0
        }
      }
    }

    // see KO bodies
    for (const o of guards) {
      if (!o.ko || o === g) continue
      const cone = inCone(g, o.pos.x, o.pos.z, 11, fov)
      if (cone.hit && lineOfSight(eye, o.pos, colliders, 0.4)) {
        g.lastKnown.copy(o.pos)
        spotted = true
        g.detect = 1
        events.push({ kind: 'body', guard: g })
      }
    }

    g.fireCd = Math.max(0, g.fireCd - dt)
    g.muzzle = Math.max(0, g.muzzle - dt)

    if (g.detect >= 1 || (alert.phase === ALERT.ALERT && g.state !== 'chase')) {
      if (g.detect >= 1) g.state = 'chase'
    }

    if (alert.phase === ALERT.ALERT && g.state === 'patrol') {
      g.state = 'search'
      g.lastKnown.copy(alert.lastKnown)
      g.searchT = 0
    }

    const speed = g.state === 'chase' ? g.chase : g.state === 'suspicious' || g.state === 'search' ? g.walk * 1.25 : g.walk

    if (g.state === 'patrol') {
      const wp = g.waypoints[g.wp]
      if (g.wait > 0) {
        g.wait -= dt
        g.heading += dt * 0.15
      } else {
        const d = moveToward(g, wp.x, wp.z, speed, dt, colliders)
        if (d < 0.55) {
          g.wait = 1.1 + (g.id % 3) * 0.4
          g.wp = (g.wp + 1) % g.waypoints.length
        }
      }
    } else if (g.state === 'suspicious') {
      const d = moveToward(g, g.lastKnown.x, g.lastKnown.z, speed, dt, colliders)
      if (d < 0.8) {
        g.lookT += dt
        g.heading += Math.sin(g.lookT * 2.2) * dt * 1.8
        if (g.lookT > 2.4 && g.detect < 0.15) {
          g.state = 'patrol'
          g.lookT = 0
        }
      }
    } else if (g.state === 'chase') {
      const target = seeing ? player.pos : g.lastKnown
      moveToward(g, target.x, target.z, speed, dt, colliders)
      if (seeing && g.fireCd <= 0 && dist < 16) {
        g.fireCd = 1.05
        g.muzzle = 0.08
        const acc = dist < 6 ? 0.92 : 0.62
        shots.push({ guard: g, hit: Math.random() < acc, dmg: 18 + Math.random() * 8 })
      }
      if (!seeing) {
        g.searchT += dt
        if (g.searchT > 2.5) {
          g.state = 'search'
          g.searchT = 0
        }
      } else g.searchT = 0
    } else if (g.state === 'search') {
      g.searchT += dt
      if (g.searchT > 1.6 || g.searchOff.lengthSq() < 0.1) {
        g.searchOff.set((Math.random() - 0.5) * 10, 0, (Math.random() - 0.5) * 10)
        g.searchT = 0
      }
      moveToward(g, g.lastKnown.x + g.searchOff.x, g.lastKnown.z + g.searchOff.z, speed, dt, colliders)
      if (alert.phase === ALERT.INFILTRATION && g.detect < 0.05) g.state = 'patrol'
    }

    // sync mesh
    g.mesh.group.position.set(g.pos.x, 0, g.pos.z)
    g.mesh.group.rotation.set(0, g.heading, 0)
    const sw = Math.sin(world.now * 0.01 * (g.state === 'chase' ? 1.7 : 1)) * 0.18
    g.mesh.arms[0].position.z = sw
    g.mesh.arms[1].position.z = -sw
    g.mesh.legs[0].position.z = -sw
    g.mesh.legs[1].position.z = sw

    g.fan.visible = true
    g.fan.material.color.set(g.detect > 0.75 ? 0xff3344 : g.detect > 0.12 ? 0xffcc33 : 0x44ff88)
    g.fan.material.opacity = 0.1 + g.detect * 0.16

    if (g.detect >= 1 || g.state === 'chase') {
      g.mark.visible = true
      g.mark.material.map = marks().texE
    } else if (g.detect > 0.12 || g.state === 'suspicious') {
      g.mark.visible = true
      g.mark.material.map = marks().texQ
    } else {
      g.mark.visible = false
    }

    if (g.visor) {
      g.visor.material.emissive = new THREE.Color(g.state === 'chase' ? 0xaa1111 : 0x081008)
    }
  }

  if (spotted) {
    alert.lastKnown.copy(player.pos)
    if (alert.phase !== ALERT.ALERT) {
      alert.phase = ALERT.ALERT
      alert.timer = 0
      alert.siren = 1
      for (const g of guards) {
        if (g.ko) continue
        g.lastKnown.copy(player.pos)
        if (g.state !== 'chase') g.state = 'search'
      }
      events.push({ kind: 'alert' })
    } else {
      alert.timer = 0
    }
  } else if (alert.phase === ALERT.ALERT) {
    alert.timer += dt
    if (alert.timer > 10) {
      alert.phase = ALERT.EVASION
      alert.timer = 0
      for (const g of guards) if (!g.ko && g.state === 'chase') g.state = 'search'
      events.push({ kind: 'evasion' })
    }
  } else if (alert.phase === ALERT.EVASION) {
    alert.timer += dt
    if (alert.timer > 16) {
      alert.phase = ALERT.CAUTION
      alert.timer = 0
      for (const g of guards) if (!g.ko) g.state = 'patrol'
      events.push({ kind: 'caution' })
    }
  } else if (alert.phase === ALERT.CAUTION) {
    alert.timer += dt
    if (alert.timer > 18) {
      alert.phase = ALERT.INFILTRATION
      alert.timer = 0
      events.push({ kind: 'clear' })
    }
  }

  return { shots, events, spotted }
}

function inBush(player, bushes) {
  if (!bushes) return false
  for (const b of bushes) {
    const d = Math.hypot(player.pos.x - b.x, player.pos.z - b.z)
    if (d < b.r) return true
  }
  return false
}

export function syncGuardDebug(guards) {
  return guards.map((g) => ({
    id: g.id,
    state: g.state,
    ko: g.ko,
    detect: +g.detect.toFixed(2),
    x: +g.pos.x.toFixed(2),
    z: +g.pos.z.toFixed(2),
    heading: +g.heading.toFixed(2),
  }))
}
