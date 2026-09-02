// Module 3 — AIDriver: racing line following, drifting, obstacle avoidance, recovery,
// rubber-banding and item usage. Writes `kart.controls` every frame.
import * as THREE from 'three'
import { PHASES, SURFACE, DIFFICULTY } from '../core/constants.js'
import { wrap01, clamp, lerp, angleDelta } from '../core/rng.js'

const TUNING = {
  [DIFFICULTY.EASY]: { steerGain: 1.5, throttleMin: 0.72, boostGap: Infinity, boostEvery: 0, boostStrength: 0, boostDur: 0, driftRelease: 1, itemDelay: [1.5, 4], noise: 0.06, throttleCap: 0.9 },
  [DIFFICULTY.NORMAL]: { steerGain: 1.9, throttleMin: 0.85, boostGap: 70, boostEvery: 7, boostStrength: 3.5, boostDur: 0.8, driftRelease: 2, itemDelay: [1, 3], noise: 0.03, throttleCap: 1 },
  [DIFFICULTY.HARD]: { steerGain: 2.3, throttleMin: 0.95, boostGap: 55, boostEvery: 4.5, boostStrength: 5.5, boostDur: 1.0, driftRelease: 3, itemDelay: [1, 2], noise: 0.0, throttleCap: 1 },
}

const _target = new THREE.Vector3()
const _fwd = new THREE.Vector3()
const _right = new THREE.Vector3()
const _rel = new THREE.Vector3()

// Per-frame cache of hazard road coordinates shared by all AI drivers (hazards move every frame).
const _hazardCache = new WeakMap()
function hazardRoadCoords(hazard, track, now) {
  let c = _hazardCache.get(hazard)
  if (!c) {
    c = { time: -1, t: 0, lat: 0 }
    _hazardCache.set(hazard, c)
  }
  if (c.time !== now) {
    const s = track.getSurfaceAt(hazard.position, c.time >= 0 ? c.t : undefined)
    c.time = now
    c.t = s.t
    c.lat = s.lateral
  }
  return c
}

export class AIDriver {
  /**
   * @param {object} kart Kart (Module 2 API)
   * @param {object} track Track (Module 1 API)
   * @param {{difficulty?: string, personality?: number, rng?: () => number}} [opts]
   */
  constructor(kart, track, { difficulty = DIFFICULTY.NORMAL, personality = 0.5, rng = Math.random } = {}) {
    this.kart = kart
    this.track = track
    this.difficulty = TUNING[difficulty] ? difficulty : DIFFICULTY.NORMAL
    this.tune = TUNING[this.difficulty]
    this.personality = clamp(personality, 0, 1)
    this.rng = rng

    // Lane preference −0.4..0.4 of halfWidth; drifts slowly over time so AIs don't stack.
    this.lane = (this.personality - 0.5) * 0.8
    this.laneTarget = this.lane
    this.laneTimer = 2 + this.rng() * 4
    this.aggression = 0.4 + this.personality * 0.6

    this.steer = 0
    this.turnTimer = 0
    this.driftHold = false
    this.driftTime = 0
    this.driftCooldown = 0
    this.stuckTimer = 0
    this.reverseTimer = 0
    this.reverseSteer = 0
    this.itemTimer = 0
    this.itemId = null
    this.itemCooldown = 0
    this.boostTimer = this.rng() * 3
    this.noiseTimer = 0
    this.noise = 0
    this.curvature = 0
    this._threats = []
    this._threatPool = []
  }

  /** Drive one frame. `race` is the RaceManager (needs items, playerKart, phase, rankOf, progressOf). */
  update(dt, race) {
    const kart = this.kart
    const c = kart.controls
    const phase = race ? race.phase : PHASES.RACING

    if (phase === PHASES.COUNTDOWN || (race && race.isControlLocked && race.isControlLocked(kart))) {
      c.throttle = 0
      c.brake = 0
      c.steer = 0
      c.hop = false
      c.useItem = false
      c.lookBack = false
      return
    }

    const surface = kart.surface ?? this.track.getSurfaceAt(kart.position, kart.progress)
    const t = typeof kart.progress === 'number' ? wrap01(kart.progress) : wrap01(surface.t)
    const speed = kart.speed ?? 0
    const length = this.track.length || 1000
    const handling = kart.character?.stats?.handling ?? 3
    const finished = !!(kart.state && kart.state.finished)

    this._updateLane(dt)

    // ── racing line ────────────────────────────────────────────────────────
    const lookAhead = 8 + Math.max(0, speed) * 0.6
    const tAhead = wrap01(t + lookAhead / length)
    const s1 = this.track.sample(tAhead)
    const s2 = this.track.sample(wrap01(t + (lookAhead * 2.2) / length))
    const tan0 = surface.tangent ?? s1.tangent
    // Signed turn: > 0 means the road bends right (inside = +right).
    const cross = tan0.z * s2.tangent.x - tan0.x * s2.tangent.z
    const dot = clamp(tan0.x * s2.tangent.x + tan0.z * s2.tangent.z, -1, 1)
    const turnAngle = Math.acos(dot)
    const turnSign = cross >= 0 ? 1 : -1
    this.curvature = turnAngle

    const halfWidth = s1.halfWidth ?? 6
    let lateral = this.lane * halfWidth + turnSign * Math.min(turnAngle * 2.4, halfWidth * 0.55)
    lateral = clamp(lateral, -(halfWidth - 1.3), halfWidth - 1.3)

    // Avoid pits/void edges: when off-road and close to the wall, head for the centre.
    if (surface.type === SURFACE.OFFROAD || surface.type === SURFACE.VOID) {
      const wall = surface.wallHalfWidth ?? surface.halfWidth + 3
      if (wall - Math.abs(surface.lateral) < 2.5 || Math.abs(surface.lateral) > surface.halfWidth) lateral = 0
    }

    // ── obstacle avoidance ─────────────────────────────────────────────────
    _fwd.set(Math.sin(kart.heading), 0, Math.cos(kart.heading))
    _right.set(Math.cos(kart.heading), 0, -Math.sin(kart.heading))
    const starring = kart.state && kart.state.starTimer > 0
    const now = race ? race.time : 0
    this._threats.length = 0
    if (race && race.items && !starring) this._collectThreats(race.items.getObstacles(), kart, false, t, length, now)
    if (this.track.hazards && this.track.hazards.length) this._collectThreats(this.track.hazards, kart, true, t, length, now)
    if (this._threats.length) lateral = this._avoid(lateral, halfWidth - 1.0, surface.lateral ?? 0, lookAhead)

    _target.copy(s1.position).addScaledVector(s1.right, lateral)

    // ── steering ───────────────────────────────────────────────────────────
    const desired = Math.atan2(_target.x - kart.position.x, _target.z - kart.position.z)
    let err = angleDelta(kart.heading, desired)
    if (speed < -0.5) err = -err // reversing: steer the other way to swing the nose
    this.noiseTimer -= dt
    if (this.noiseTimer <= 0) {
      this.noiseTimer = 0.4 + this.rng() * 0.6
      this.noise = (this.rng() * 2 - 1) * this.tune.noise
    }
    const steerRaw = clamp(err * this.tune.steerGain + this.noise, -1, 1)
    this.steer = lerp(this.steer, steerRaw, 1 - Math.exp(-14 * dt))

    // ── throttle ───────────────────────────────────────────────────────────
    let throttle = this.tune.throttleCap
    let brake = 0
    const tightThresh = 0.55 + handling * 0.12
    if (turnAngle > tightThresh) throttle -= clamp((turnAngle - tightThresh) * 0.9, 0, 0.55)
    if (turnAngle > tightThresh + 0.7 && speed > 22) brake = 0.35
    if (Math.abs(err) > 1.2 && speed > 10) {
      throttle = 0.2
      brake = 0.5
    }
    if (surface.type === SURFACE.BOOST) throttle = 1

    // Wrong way: brake hard, then turn around.
    if (kart.state && kart.state.wrongWay && speed > 6) {
      throttle = 0
      brake = 1
    }

    // ── rubber-banding relative to the player ──────────────────────────────
    let boostNow = false
    if (race && race.playerKart && race.playerKart !== kart && race.progressOf && !finished && !race.isPlayerFinished?.()) {
      const gap = race.gapMetres ? race.gapMetres(kart, race.playerKart) : 0
      if (gap > 40) {
        const k = clamp((gap - 40) / 160, 0, 1)
        throttle *= lerp(1, this.tune.throttleMin, k)
      } else if (gap < -this.tune.boostGap && this.tune.boostEvery > 0) {
        this.boostTimer -= dt
        if (this.boostTimer <= 0) {
          this.boostTimer = this.tune.boostEvery * (0.8 + this.rng() * 0.4)
          boostNow = true
        }
      }
    }
    if (boostNow && kart.applyBoost && !(kart.state && kart.state.boostTimer > 0)) {
      kart.applyBoost(this.tune.boostStrength, this.tune.boostDur)
    }

    // ── drifting ───────────────────────────────────────────────────────────
    let hop = false
    this.driftCooldown -= dt
    const absErr = Math.abs(err)
    if (absErr > 0.22 && turnAngle > 0.3) this.turnTimer += dt
    else this.turnTimer = Math.max(0, this.turnTimer - dt * 2)
    const st = kart.state ?? {}
    if (this.driftHold) {
      this.driftTime += dt
      hop = true
      const level = st.driftLevel ?? 0
      const turnEnding = absErr < 0.1 && turnAngle < 0.2
      if (level >= this.tune.driftRelease || turnEnding || this.driftTime > 3.2 || speed < 8 || st.spinTimer > 0) {
        this.driftHold = false
        hop = false
        this.driftCooldown = 0.7
        this.turnTimer = 0
      }
    } else if (!finished && this.driftCooldown <= 0 && this.turnTimer > 0.3 && speed > 14 && !st.airborne && !(st.spinTimer > 0)) {
      this.driftHold = true
      this.driftTime = 0
      hop = true
    }

    // ── stuck recovery ─────────────────────────────────────────────────────
    if (this.reverseTimer > 0) {
      this.reverseTimer -= dt
      throttle = 0
      brake = 1
      this.steer = this.reverseSteer
      hop = false
    } else {
      if (!finished && phase === PHASES.RACING && Math.abs(speed) < 2 && throttle > 0.3 && !(st.spinTimer > 0) && !(st.stunTimer > 0)) {
        this.stuckTimer += dt
      } else {
        this.stuckTimer = 0
      }
      if (this.stuckTimer > 1.5) {
        this.stuckTimer = 0
        this.reverseTimer = 1
        this.reverseSteer = err > 0 ? -1 : 1
      }
    }

    if (finished) {
      throttle = Math.min(throttle, 0.45)
      hop = false
    }

    c.throttle = clamp(throttle, 0, 1)
    c.brake = clamp(brake, 0, 1)
    c.steer = clamp(this.steer, -1, 1)
    c.hop = hop
    c.useItem = false
    c.lookBack = false

    // ── items ──────────────────────────────────────────────────────────────
    if (race && race.items && !finished && phase === PHASES.RACING) this._useItems(dt, race, err, turnAngle, surface)
  }

  _updateLane(dt) {
    this.laneTimer -= dt
    if (this.laneTimer <= 0) {
      this.laneTimer = 3 + this.rng() * 5
      this.laneTarget = clamp((this.personality - 0.5) * 0.8 + (this.rng() * 2 - 1) * 0.25, -0.4, 0.4)
    }
    this.lane = lerp(this.lane, this.laneTarget, 1 - Math.exp(-0.8 * dt))
  }

  /**
   * Collect obstacles ahead of the kart along the road into `this._threats` as
   * {along (m ahead along the spline), lat (road lateral), r (clearance)}. Item entities carry cached
   * road coordinates (`roadT`/`roadLat`, maintained by ItemSystem); hazards are looked up once per
   * frame and shared between all AI drivers via a module-level cache.
   */
  _collectThreats(list, kart, isHazard, kartT, length, now) {
    // ~18 m when slow, ~35 m at top speed so there is time to swerve.
    const range = 18 + Math.max(0, kart.speed ?? 0) * 0.55
    for (let i = 0; i < list.length; i++) {
      const o = list[i]
      let ot, ol
      if (isHazard) {
        if (o.active === false) continue
        const c = hazardRoadCoords(o, this.track, now)
        ot = c.t
        ol = c.lat
      } else {
        if (o.owner === kart && o.age < 1.0) continue
        ot = o.roadT
        ol = o.roadLat
        if (typeof ot !== 'number') continue
      }
      let along = ot - kartT
      along -= Math.round(along)
      along *= length
      if (along < -2 || along > range) continue
      if (Math.abs(o.position.y - kart.position.y) > 5) continue
      let t = this._threatPool[this._threats.length]
      if (!t) {
        t = { along: 0, lat: 0, r: 0 }
        this._threatPool.push(t)
      }
      t.along = along
      t.lat = ol
      t.r = (o.radius ?? 1) + 1.9 // clearance: obstacle radius + kart radius + margin
      this._threats.push(t)
    }
  }

  /**
   * Choose a lateral target that clears the nearest threat in our path, verified against all other
   * threats, preferring the option closest to the racing line and inside the road.
   */
  _avoid(lateral, lim, kartLateral, lookAhead) {
    const threats = this._threats
    let nearest = null
    for (let i = 0; i < threats.length; i++) {
      const t = threats[i]
      // Our lateral when we reach the obstacle, assuming we converge onto the target lateral over
      // the look-ahead distance.
      const planned = lerp(kartLateral, lateral, clamp(Math.max(t.along, 0) / Math.max(lookAhead, 1), 0, 1))
      if (Math.abs(t.lat - planned) > t.r) continue
      if (!nearest || t.along < nearest.along) nearest = t
    }
    if (!nearest) return lateral

    const candA = nearest.lat + nearest.r + 0.4
    const candB = nearest.lat - nearest.r - 0.4
    const score = (cand) => {
      let s = Math.abs(cand - lateral) * 0.5 // stay close to the racing line
      if (Math.abs(cand) > lim) s += (Math.abs(cand) - lim) * 6 // heavily penalise leaving the road
      for (let i = 0; i < threats.length; i++) {
        const t = threats[i]
        if (t === nearest) continue
        const gap = Math.abs(cand - t.lat)
        if (gap < t.r) s += (t.r - gap) * 4
      }
      return s
    }
    const best = score(candA) <= score(candB) ? candA : candB
    return clamp(best, -lim, lim)
  }

  _useItems(dt, race, err, turnAngle, surface) {
    const kart = this.kart
    const items = race.items
    this.itemCooldown -= dt
    const item = kart.item
    if (!item || kart.itemRoulette != null) {
      this.itemId = null
      return
    }
    if (item.id !== this.itemId) {
      this.itemId = item.id
      const [a, b] = this.tune.itemDelay
      this.itemTimer = a + this.rng() * (b - a)
      if (item.id === 'star' || item.id === 'lightning' || item.id === 'bob_omb') this.itemTimer += 1 + this.rng() * 2
    }
    this.itemTimer -= dt
    if (this.itemCooldown > 0 || (race.time ?? 0) < 1.5) return
    if (this.itemTimer > 0 && item.id !== 'green_shell' && item.id !== 'triple_green' && item.id !== 'red_shell') return

    const rank = race.rankOf ? race.rankOf(kart) : 4
    const total = race.karts ? race.karts.length : 8
    const st = kart.state ?? {}

    // Scan nearby karts.
    let aheadDist = Infinity
    let aheadAligned = false
    let behindDist = Infinity
    const karts = race.karts ?? items.karts ?? []
    for (let i = 0; i < karts.length; i++) {
      const k = karts[i]
      if (k === kart || !k.position) continue
      _rel.subVectors(k.position, kart.position)
      const along = _rel.x * _fwd.x + _rel.z * _fwd.z
      const side = _rel.x * _right.x + _rel.z * _right.z
      const d = Math.hypot(_rel.x, _rel.z)
      if (along > 0 && d < aheadDist) {
        aheadDist = d
        aheadAligned = Math.abs(side) < 1.6 + along * 0.14
      }
      if (along < 0 && d < behindDist) behindDist = d
    }

    let use = false
    let backwards = false
    let forward = false
    switch (item.id) {
      case 'green_shell':
      case 'triple_green':
        if (aheadDist < 25 && aheadAligned) use = true
        else if (behindDist < 8 && this.rng() < 0.5) { use = true; backwards = true }
        else if (this.itemTimer < -8) use = true
        break
      case 'red_shell':
        if (rank > 1 && aheadDist < 60) use = true
        else if (this.itemTimer < -6) use = true
        break
      case 'banana':
      case 'triple_banana':
      case 'fake_box':
        if (behindDist < 8) use = true
        else if (turnAngle > 0.35 && this.rng() < dt * 1.2) use = true
        else if (this.itemTimer < -10) use = true
        break
      case 'mushroom':
      case 'triple_mushroom':
        if (st.boostTimer > 0) break
        if (surface.type === SURFACE.OFFROAD) use = true
        else if (turnAngle < 0.25 && Math.abs(err) < 0.2) use = true
        else if (this.itemTimer < -6) use = true
        break
      case 'star':
        if (rank > total / 2 || this.itemTimer < -3) use = true
        break
      case 'lightning':
        if (rank >= 3 || this.itemTimer < -3) use = true
        break
      case 'bob_omb':
        if (aheadDist < 25 && turnAngle < 0.4) { use = true; forward = true }
        else if (behindDist < 6) { use = true; backwards = true }
        else if (this.itemTimer < -4) { use = true; forward = true }
        break
      default:
        use = this.itemTimer < -2
    }
    if (!use) return
    if (items.use(kart, { backwards, forward, race })) {
      this.itemCooldown = 0.45 + this.rng() * 0.4
    }
  }
}
