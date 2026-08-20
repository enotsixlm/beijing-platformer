import * as THREE from 'three'
import { SHIBA_KINDS, createShiba, createOwner, createLeash, updateLeash, animateShiba, animateOwner, createNameTag } from './models.js'
import { sampleAt, pointAt, project, inGap } from './track.js'

export const DIFFS = {
  easy: { id: 'easy', name: '幼柴', nameZh: '幼柴', laps: 3, aiSpeed: 0.82, aiTurn: 0.88, rubber: 0.16 },
  normal: { id: 'normal', name: '若柴', nameZh: '若柴', laps: 3, aiSpeed: 0.95, aiTurn: 1.0, rubber: 0.1 },
  hard: { id: 'hard', name: '厳柴', nameZh: '严柴', laps: 5, aiSpeed: 1.07, aiTurn: 1.12, rubber: 0.06 },
}

const AI_NAMES = ['ポチ', 'ハチ', 'マメ', 'コロ', 'モカ', 'ギン', 'タロウ']
const AI_KINDS = ['aka', 'kuro', 'shiro', 'goma', 'aka', 'kuro', 'shiro']

const LEASH = 4.6
const tmp = new THREE.Vector3()
const tmp2 = new THREE.Vector3()
const tmp3 = new THREE.Vector3()

export function createRacer({ isPlayer, kindId, name, color, track, slot = 0, total = 8 }) {
  const kind = SHIBA_KINDS[kindId] || SHIBA_KINDS.aka
  const row = Math.floor(slot / 2)
  const col = slot % 2 === 0 ? -1.8 : 1.8
  const s0 = 8 + row * 5.5
  const start = pointAt(track, s0, col)
  const sm = sampleAt(track, s0)

  const ownerPos = start.clone().addScaledVector(sm.tangent, -2.6)
  ownerPos.y += 0.5

  const raincoat = !!track.def.raincoat
  const board = !!track.def.board
  const shiba = createShiba(kindId, { raincoat, board })
  const owner = createOwner()
  const leash = createLeash()
  const tag = createNameTag(isPlayer ? 'YOU' : name, isPlayer ? '#ffe08a' : '#ffffff')

  return {
    isPlayer,
    kind,
    kindId,
    name: isPlayer ? 'YOU' : name,
    stats: kind,
    pos: start.clone(),
    heading: sm.heading,
    speed: 0,
    vy: 0,
    airborne: false,
    boostT: 0,
    dashStock: 0,
    coins: 0,
    coinBank: 0,
    stickT: 0,
    stunT: 0,
    driftT: 0,
    driftReady: false,
    s: s0,
    lastS: s0,
    lateral: col,
    trackIndex: sm.index,
    lap: 1,
    place: slot + 1,
    finished: false,
    finishTime: 0,
    steer: 0,
    shiba,
    ownerMesh: owner,
    leash,
    tag,
    owner: {
      pos: ownerPos,
      vel: new THREE.Vector3(),
      stunT: 0,
      lockT: 0,
    },
    ai: {
      targetX: (Math.random() - 0.5) * track.width * 0.3,
      timer: Math.random() * 2,
      skill: 0.7 + Math.random() * 0.3,
    },
    lastBoostS: -999,
    lastJumpS: -999,
    rescueT: 0,
  }
}

export function spawnField(track, playerKind, worldGroup) {
  const racers = []
  racers.push(createRacer({
    isPlayer: true, kindId: playerKind, name: 'YOU', track, slot: 0,
  }))
  for (let i = 0; i < 7; i++) {
    racers.push(createRacer({
      isPlayer: false,
      kindId: AI_KINDS[i],
      name: AI_NAMES[i],
      track,
      slot: i + 1,
    }))
  }
  for (const r of racers) {
    worldGroup.add(r.shiba.group, r.ownerMesh.group, r.leash.tube, r.tag)
  }
  return racers
}

export function stepRacer(r, input, dt, track, racers, diff, racing) {
  if (r.finished) {
    r.speed = Math.max(0, r.speed - 18 * dt)
    integrate(r, dt, track)
    return
  }
  if (r.rescueT > 0) r.rescueT -= dt

  const steer = racing ? THREE.MathUtils.clamp(input.steer, -1, 1) : 0
  r.steer = THREE.MathUtils.lerp(r.steer, steer, 1 - Math.exp(-12 * dt))

  const onTrack = Math.abs(r.lateral) < track.width * 0.5
  const grip = track.grip * (onTrack ? 1 : 0.42) * (r.stunT > 0 ? 0.35 : 1)
  const top = r.stats.topSpeed * (r.isPlayer ? 1 : diff.aiSpeed)
  const rubber = r.isPlayer ? 1 : 1 + (r.place - 1) / 7 * diff.rubber

  if (r.stunT > 0) r.stunT -= dt
  if (r.owner.stunT > 0) r.owner.stunT -= dt
  if (r.stickT > 0) r.stickT -= dt
  if (r.boostT > 0) r.boostT -= dt

  // accel
  let accel = r.stats.accel * rubber
  if (r.boostT > 0) accel += 38 + r.stats.dash * 0.4
  if (r.stunT > 0 || r.owner.stunT > 0) accel *= 0.15
  if (!racing) accel = 0

  const drag = 1.15 + Math.abs(r.steer) * 0.55 * (r.driftT > 0.2 ? 0.4 : 1)
  r.speed += accel * dt
  r.speed *= Math.exp(-drag * 0.22 * dt)
  const cap = (r.boostT > 0 ? top * 1.45 : top) * (onTrack ? 1 : 0.55)
  if (r.speed > cap) r.speed = THREE.MathUtils.lerp(r.speed, cap, 1 - Math.exp(-6 * dt))
  if (r.speed < 0) r.speed = 0

  // turn + drift
  const turnRate = r.stats.turn * grip * (0.32 + 0.68 * (1 - Math.min(1, r.speed / (top + 1))))
  r.heading += r.steer * turnRate * dt

  if (Math.abs(r.steer) > 0.62 && r.speed > 12 && onTrack && !r.airborne) {
    r.driftT += dt
    if (r.driftT > 0.72) r.driftReady = true
  } else {
    if (r.driftReady && r.driftT > 0.72) {
      r.boostT = Math.max(r.boostT, 0.7)
      r.speed += 4.5
    }
    r.driftT = 0
    r.driftReady = false
  }

  // jump pads
  for (const j of track._jumps || []) {
    if (Math.abs(r.s - j.s) < 2.2 && r.s - r.lastS >= 0 && r.s - j.s < 4) {
      if (Math.abs(r.lastJumpS - j.s) > 6) {
        r.vy = j.vy
        r.airborne = true
        r.lastJumpS = j.s
      }
    }
  }

  // air / gravity
  const sm = sampleAt(track, r.s)
  const groundY = sm.pos.y
  if (r.airborne || r.pos.y > groundY + 0.35) {
    r.vy -= 28 * dt
    r.pos.y += r.vy * dt
    r.airborne = true
    if (r.pos.y <= groundY + 0.05 && r.vy <= 0 && !inGap(track, r.s)) {
      r.pos.y = groundY
      r.vy = 0
      r.airborne = false
    }
  } else {
    r.pos.y = groundY
    r.airborne = false
    r.vy = 0
  }

  integrate(r, dt, track)

  // walls
  const half = track.width * 0.5 + 0.35
  if (Math.abs(r.lateral) > half && !r.airborne) {
    r.lateral = THREE.MathUtils.clamp(r.lateral, -half, half)
    const p = pointAt(track, r.s, r.lateral)
    r.pos.x = p.x
    r.pos.z = p.z
    r.speed *= 0.72
  }

  // fall into gap
  if (inGap(track, r.s) && !r.airborne && r.pos.y <= groundY + 0.4) {
    r.airborne = true
    r.vy = 2
  }
  if (r.pos.y < groundY - 10 || (inGap(track, r.s) && r.pos.y < groundY - 2 && r.vy < 0)) {
    rescue(r, track)
  }

  stepOwner(r, dt, track)
  collideRacers(r, racers, dt)
}

function integrate(r, dt, track) {
  const fwdX = Math.sin(r.heading)
  const fwdZ = Math.cos(r.heading)
  r.pos.x += fwdX * r.speed * dt
  r.pos.z += fwdZ * r.speed * dt
  const pr = project(track, r.pos, r.trackIndex, r.s)
  r.lastS = r.s
  r.s = pr.s
  r.lateral = pr.lateral
  r.trackIndex = pr.index
  // lap wrap
  if (r.lastS > track.length * 0.78 && r.s < track.length * 0.22) {
    r.lap += 1
  }
}

function rescue(r, track) {
  const s = Math.max(2, r.s - 10)
  const p = pointAt(track, s, 0)
  const sm = sampleAt(track, s)
  r.pos.copy(p)
  r.heading = sm.heading
  r.speed *= 0.45
  r.vy = 0
  r.airborne = false
  r.s = s
  r.lateral = 0
  r.rescueT = 0.8
  r.owner.pos.copy(p).addScaledVector(sm.tangent, -2.4)
  r.owner.vel.set(0, 0, 0)
}

function stepOwner(r, dt, track) {
  const fwd = tmp.set(Math.sin(r.heading), 0, Math.cos(r.heading))
  const right = tmp2.set(Math.cos(r.heading), 0, -Math.sin(r.heading))
  const attach = r.pos.clone().addScaledVector(fwd, -0.55)
  attach.y += 0.55
  const rest = r.pos.clone().addScaledVector(fwd, -LEASH * 0.68)
  rest.y = r.pos.y + 0.5

  // centrifugal from yaw
  const yawRate = r.steer * r.stats.turn * r.speed * 0.04
  const o = r.owner
  if (o.lockT > 0) {
    o.lockT -= dt
    return
  }
  if (o.stunT > 0) {
    o.vel.multiplyScalar(Math.exp(-8 * dt))
  } else {
    tmp3.copy(rest).sub(o.pos)
    o.vel.addScaledVector(tmp3, 16 * dt)
    o.vel.addScaledVector(right, yawRate * r.speed * 0.08 * dt)
    o.vel.multiplyScalar(Math.exp(-3.8 * dt))
    o.pos.addScaledVector(o.vel, dt)
  }

  o.pos.y = r.pos.y + 0.42 + Math.abs(Math.sin(o.pos.x * 0.4 + o.pos.z * 0.3)) * Math.min(0.45, r.speed * 0.018)

  const delta = o.pos.clone().sub(attach)
  const dist = delta.length()
  if (dist > LEASH) {
    delta.multiplyScalar(LEASH / dist)
    o.pos.copy(attach).add(delta)
    const radial = delta.normalize()
    const vn = o.vel.dot(radial)
    if (vn > 0) o.vel.addScaledVector(radial, -vn)
  }
}

function collideRacers(r, racers, dt) {
  for (const o of racers) {
    if (o === r) continue
    const dx = r.pos.x - o.pos.x
    const dz = r.pos.z - o.pos.z
    const d2 = dx * dx + dz * dz
    const min = 1.55
    if (d2 < min * min && d2 > 1e-4) {
      const d = Math.sqrt(d2)
      const nx = dx / d
      const nz = dz / d
      const push = (min - d) * 0.5
      r.pos.x += nx * push
      r.pos.z += nz * push
      if (o.stickT > 0 && o.s > r.s && Math.abs(o.lateral - r.lateral) < 3.2) {
        r.speed *= 0.55
        r.pos.x -= nx * 0.4
        r.pos.z -= nz * 0.4
      }
    }
  }
}

export function collectItems(r, world, sfx, events) {
  const owner = r.owner.pos
  if (r.isPlayer) {
    for (const c of world.items.coins) {
      if (c.taken) continue
      const p = c.mesh.position
      const dx = p.x - owner.x
      const dy = p.y - owner.y
      const dz = p.z - owner.z
      if (dx * dx + dz * dz < 1.15 * 1.15 && Math.abs(dy) < 1.3) {
        c.taken = true
        c.mesh.visible = false
        r.coins++
        r.coinBank++
        if (r.coinBank >= 15 && r.dashStock < 2) {
          r.coinBank -= 15
          r.dashStock++
          events.push('dashReady')
        }
        events.push('coin')
      }
    }
  }
  for (const b of world.items.boosts) {
    const p = b.mesh.position
    const dx = p.x - r.pos.x
    const dz = p.z - r.pos.z
    const ds = Math.abs(r.s - b.s)
    const dsWrap = Math.min(ds, world.track.length - ds)
    if (dx * dx + dz * dz < 3.2 * 3.2 || (dsWrap < 3.5 && Math.abs(r.lateral - b.x) < 2.8)) {
      if (r.boostT < 0.85) {
        r.boostT = 1.15
        r.speed += 6
        if (r.isPlayer) events.push('boost')
      }
    }
  }
  for (const sn of world.items.sneakers) {
    const p = sn.mesh.position
    const dx = p.x - owner.x
    const dy = p.y - owner.y
    const dz = p.z - owner.z
    if (dx * dx + dz * dz < 1.1 * 1.1 && Math.abs(dy) < 1.2) {
      if (r.owner.stunT <= 0) {
        r.owner.stunT = 1.35
        r.stunT = 1.35
        r.speed *= 0.38
        r.owner.vel.set(0, 0, 0)
        if (r.isPlayer) events.push('sneaker')
      }
    }
  }
  for (const st of world.items.sticks) {
    if (st.taken) continue
    const p = st.mesh.position
    const dx = p.x - r.pos.x
    const dz = p.z - r.pos.z
    const ds = Math.abs(r.s - st.s)
    const dsWrap = Math.min(ds, world.track.length - ds)
    if (dx * dx + dz * dz < 1.8 * 1.8 || (dsWrap < 2.2 && Math.abs(r.lateral - st.x) < 1.5)) {
      st.taken = true
      st.mesh.visible = false
      r.stickT = 4.2
      if (r.isPlayer) events.push('stick')
    }
  }
}

export function tryDash(r) {
  if (r.dashStock <= 0 || r.finished) return false
  r.dashStock--
  r.boostT = Math.max(r.boostT, 1.35)
  r.speed += 5 + r.stats.dash * 0.25
  return true
}

export function syncRacerMeshes(r, now) {
  const g = r.shiba.group
  g.position.copy(r.pos)
  g.rotation.y = r.heading
  r.shiba.stick.visible = r.stickT > 0
  if (r.shiba.stick.visible) {
    r.shiba.stick.scale.y = 1 + Math.sin(now * 0.01) * 0.05
  }
  animateShiba(r.shiba, {
    speed: r.speed, steer: r.steer, boost: r.boostT > 0, now, airborne: r.airborne,
  })

  const og = r.ownerMesh.group
  og.position.copy(r.owner.pos)
  const toDog = tmp.copy(r.pos).sub(r.owner.pos)
  og.lookAt(r.pos.x, r.owner.pos.y, r.pos.z)
  og.rotateX(0.85)
  animateOwner(r.ownerMesh, { speed: r.speed, now, stunned: r.owner.stunT > 0 })

  const collar = r.pos.clone()
  collar.y += 0.55
  const hands = r.owner.pos.clone()
  hands.y += 0.15
  updateLeash(r.leash, collar, hands)

  r.tag.position.set(r.pos.x, r.pos.y + 1.55, r.pos.z)
}

export function rankRacers(racers, track) {
  const scored = racers.map((r) => ({
    r,
    key: r.finished ? 1e9 + (10000 - r.finishTime) : r.lap * track.length + r.s,
  }))
  scored.sort((a, b) => b.key - a.key)
  scored.forEach((s, i) => { s.r.place = i + 1 })
}

export function drawMinimap(ctx, track, racers, w, h) {
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = 'rgba(20, 16, 12, 0.55)'
  ctx.beginPath()
  ctx.roundRect(0, 0, w, h, 12)
  ctx.fill()
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity
  for (const s of track.samples) {
    minX = Math.min(minX, s.pos.x)
    maxX = Math.max(maxX, s.pos.x)
    minZ = Math.min(minZ, s.pos.z)
    maxZ = Math.max(maxZ, s.pos.z)
  }
  const pad = 16
  const sx = (w - pad * 2) / (maxX - minX + 1)
  const sz = (h - pad * 2) / (maxZ - minZ + 1)
  const sc = Math.min(sx, sz)
  const mx = (x, z) => [pad + (x - minX) * sc, pad + (z - minZ) * sc]
  ctx.strokeStyle = '#d8cbb0'
  ctx.lineWidth = 4
  ctx.beginPath()
  track.samples.forEach((s, i) => {
    const [x, y] = mx(s.pos.x, s.pos.z)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.closePath()
  ctx.stroke()
  for (const r of racers) {
    const [x, y] = mx(r.pos.x, r.pos.z)
    ctx.fillStyle = r.isPlayer ? '#ffe08a' : '#f07050'
    ctx.beginPath()
    ctx.arc(x, y, r.isPlayer ? 5 : 3.2, 0, Math.PI * 2)
    ctx.fill()
  }
}
