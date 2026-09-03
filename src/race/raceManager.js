// Module 3 — RaceManager: countdown, checkpoint-gated lap counting, ranking, finish detection,
// VOID respawns, hazard collisions and wrong-way notifications.
import { EVT, PHASES, SURFACE, KART_RADIUS } from '../core/constants.js'
import { wrap01, clamp } from '../core/rng.js'

const COUNTDOWN_START = 3.99
const FINISH_GRACE = 8 // seconds after the player finishes before the race is force-ended
const VOID_FALL_DELAY = 0.6
const RESPAWN_LOCK = 1.0
const HAZARD_COOLDOWN = 1.5

/** Signed shortest delta between two spline parameters, in (-0.5, 0.5]. */
function tDelta(from, to) {
  let d = to - from
  d -= Math.round(d)
  return d
}

/** True when checkpoint parameter `cp` lies in the forward interval (from, to]. */
function crossedForward(from, to, cp) {
  const d = tDelta(from, to)
  if (d <= 0) return false
  const dc = wrap01(cp - from)
  return dc > 0 && dc <= d
}

/** True when `cp` lies in the backward interval [to, from) (kart travelling backwards). */
function crossedBackward(from, to, cp) {
  const d = tDelta(from, to)
  if (d >= 0) return false
  const dc = wrap01(from - cp)
  return dc >= 0 && dc < -d
}

export class RaceManager {
  /**
   * @param {{track, karts, items, events, playerKart}} opts
   */
  constructor({ track, karts, items, events, playerKart }) {
    this.track = track
    this.karts = karts
    this.items = items
    this.events = events
    this.playerKart = playerKart ?? karts.find((k) => k.isPlayer) ?? karts[0]

    this.phase = PHASES.COUNTDOWN
    this.countdown = COUNTDOWN_START
    this.time = 0
    this.totalLaps = track.laps ?? 3
    this.checkpointCount = Math.max(3, track.checkpointCount ?? 4)
    this.results = []

    this._countdownStep = 3 // next COUNTDOWN {n} to emit
    this._raceOver = false
    this._finishTimer = -1
    this._sorted = karts.slice()
    this._info = new Map()
    for (const k of karts) this._info.set(k, this._makeInfo(k))
    this._computeRanks(true)
  }

  _makeInfo(kart) {
    const t = this._kartT(kart)
    return {
      kart,
      lap: 1,
      nextCheckpoint: 1,
      checkpointsPassed: 0,
      lastT: t,
      lastGoodT: t,
      segProgress: 0,
      score: 0,
      rank: kart.index + 1,
      finished: false,
      finishTime: Infinity,
      voidTimer: 0,
      lockTimer: 0,
      hazardTimer: 0,
      wrongWay: false,
      distance: 0,
      lastPos: kart.position ? kart.position.clone() : null,
    }
  }

  _kartT(kart) {
    if (typeof kart.progress === 'number' && Number.isFinite(kart.progress)) return wrap01(kart.progress)
    if (kart.surface && typeof kart.surface.t === 'number') return wrap01(kart.surface.t)
    if (kart.position && this.track.getSurfaceAt) return wrap01(this.track.getSurfaceAt(kart.position).t)
    return 0
  }

  // ───────────────────────────── main update ─────────────────────────────

  update(dt) {
    if (this.phase === PHASES.COUNTDOWN) {
      this._updateCountdown(dt)
      for (const info of this._info.values()) info.lastT = this._kartT(info.kart)
      this._computeRanks(false)
      return
    }

    if (this.phase === PHASES.RACING || this.phase === PHASES.FINISHED) {
      this.time += dt
      for (const info of this._info.values()) {
        this._updateKartProgress(info, dt)
        this._updateVoid(info, dt)
        this._updateWrongWay(info)
      }
      this._updateHazards(dt)
      this._computeRanks(false)
      this._updateFinish(dt)
    }
  }

  _updateCountdown(dt) {
    this.countdown -= dt
    while (this._countdownStep >= 1 && this.countdown <= this._countdownStep) {
      this.events.emit(EVT.COUNTDOWN, { n: this._countdownStep })
      this._countdownStep--
    }
    if (this.countdown <= 0) {
      this.countdown = 0
      this.phase = PHASES.RACING
      this.time = 0
      for (const info of this._info.values()) {
        info.lastT = this._kartT(info.kart)
        info.lastGoodT = info.lastT
        if (info.lastPos && info.kart.position) info.lastPos.copy(info.kart.position)
      }
      this.events.emit(EVT.RACE_START, {})
    }
  }

  _updateKartProgress(info, dt) {
    const kart = info.kart
    const t = this._kartT(kart)
    const N = this.checkpointCount

    // Average speed bookkeeping (used for finish-time estimates).
    if (info.lastPos && kart.position) {
      info.distance += info.lastPos.distanceTo(kart.position)
      info.lastPos.copy(kart.position)
    }

    if (!info.finished) {
      const from = info.lastT
      // Forward crossings (loop in case a big step crosses two checkpoints).
      for (let guard = 0; guard < N; guard++) {
        const cp = info.nextCheckpoint / N
        if (!crossedForward(from, t, cp)) break
        if (info.nextCheckpoint === 0) {
          // Finish line with all checkpoints collected → lap.
          info.lap++
          info.checkpointsPassed = 0
          info.nextCheckpoint = 1
          if (info.lap > this.totalLaps) {
            this._finishKart(info)
            break
          }
          this.events.emit(EVT.LAP, { kart, lap: info.lap, isFinal: info.lap === this.totalLaps })
        } else {
          info.checkpointsPassed++
          info.nextCheckpoint = (info.nextCheckpoint + 1) % N
        }
      }
      // Backward crossings: undo the last checkpoint (and lap) so reversing over the line can't cheat.
      for (let guard = 0; guard < N; guard++) {
        const prev = (info.nextCheckpoint + N - 1) % N
        const cp = prev / N
        if (!crossedBackward(from, t, cp)) break
        if (prev === 0) {
          if (info.lap <= 1) break // can't go before lap 1; nothing to undo
          info.lap--
          info.checkpointsPassed = N - 1
          info.nextCheckpoint = 0
        } else {
          if (info.checkpointsPassed <= 0) break
          info.checkpointsPassed--
          info.nextCheckpoint = prev
        }
      }
    }

    info.lastT = t
    const segStart = ((info.nextCheckpoint + N - 1) % N) / N
    info.segProgress = tDelta(segStart, t) // (-0.5, 0.5]
    info.score = (info.lap - 1) * N + info.checkpointsPassed

    const surf = kart.surface
    if (surf && surf.type !== SURFACE.VOID) info.lastGoodT = t
    else if (!surf) info.lastGoodT = t
  }

  _finishKart(info) {
    if (info.finished) return
    const kart = info.kart
    info.finished = true
    info.finishTime = this.time
    info.lap = this.totalLaps + 1
    info.checkpointsPassed = 0
    info.nextCheckpoint = 1
    if (kart.state) kart.state.finished = true
    const rank = this.results.length + 1
    const entry = { kart, time: this.time, rank }
    info.result = entry
    this.results.push(entry)
    this.events.emit(EVT.FINISH, { kart, rank, time: this.time })
    if (kart === this.playerKart && this._finishTimer < 0) this._finishTimer = FINISH_GRACE
  }

  _updateVoid(info, dt) {
    const kart = info.kart
    if (info.lockTimer > 0) {
      info.lockTimer -= dt
      if (kart.controls) {
        kart.controls.throttle = 0
        kart.controls.brake = 0
        kart.controls.steer = 0
        kart.controls.hop = false
        kart.controls.useItem = false
      }
    }
    const surf = kart.surface
    if (!surf || !kart.position) return
    const inVoid = surf.type === SURFACE.VOID || kart.position.y < surf.height - 6
    if (!inVoid) {
      info.voidTimer = 0
      return
    }
    info.voidTimer += dt
    if (info.voidTimer < VOID_FALL_DELAY) return
    info.voidTimer = 0
    const rp = this.track.respawnPoint(info.lastGoodT)
    kart.reset(rp.position, rp.heading)
    if (kart.velocity) kart.velocity.set(0, 0, 0)
    if (kart.state) {
      if (typeof kart.state.stunTimer === 'number') kart.state.stunTimer = Math.max(kart.state.stunTimer, RESPAWN_LOCK)
      kart.state.airborne = false
    }
    info.lockTimer = RESPAWN_LOCK
    info.lastT = info.lastGoodT
    if (info.lastPos) info.lastPos.copy(kart.position)
    this.events.emit(EVT.RESPAWN, { kart })
  }

  _updateWrongWay(info) {
    const on = !!(info.kart.state && info.kart.state.wrongWay)
    if (on !== info.wrongWay) {
      info.wrongWay = on
      this.events.emit(EVT.WRONG_WAY, { kart: info.kart, on })
    }
  }

  _updateHazards(dt) {
    const hazards = this.track.hazards
    for (const info of this._info.values()) if (info.hazardTimer > 0) info.hazardTimer -= dt
    if (!hazards || hazards.length === 0) return
    for (let h = 0; h < hazards.length; h++) {
      const hz = hazards[h]
      if (!hz.active) continue
      const r = (hz.radius ?? 1) + KART_RADIUS
      const r2 = r * r
      for (let i = 0; i < this.karts.length; i++) {
        const kart = this.karts[i]
        const info = this._info.get(kart)
        if (info.hazardTimer > 0 || !kart.position) continue
        const dx = kart.position.x - hz.position.x
        const dy = kart.position.y - hz.position.y
        const dz = kart.position.z - hz.position.z
        if (dx * dx + dz * dz < r2 && Math.abs(dy) < r + 2) {
          info.hazardTimer = HAZARD_COOLDOWN
          kart.hit('hazard') // the kart emits EVT.HIT itself
        }
      }
    }
  }

  _updateFinish(dt) {
    if (this._raceOver) return
    let graceOver = false
    if (this._finishTimer >= 0) {
      this._finishTimer -= dt
      graceOver = this._finishTimer <= 0
    }
    const allDone = this.results.length >= this.karts.length
    if (allDone || graceOver) this._endRace()
  }

  _endRace() {
    if (this._raceOver) return
    this._raceOver = true
    // Fill in estimated finish times for karts still racing, in current rank order.
    const pending = this._sorted.filter((k) => !this._info.get(k).finished)
    let lastTime = this.results.length ? this.results[this.results.length - 1].time : this.time
    const trackLen = this.track.length ?? 1000
    for (const kart of pending) {
      const info = this._info.get(kart)
      const remaining = Math.max(0, 1 - this.progressOf(kart)) * this.totalLaps * trackLen
      const avg = this.time > 1 ? info.distance / this.time : 0
      const speed = Math.max(8, avg, Math.abs(kart.speed ?? 0) * 0.8)
      let est = this.time + remaining / speed
      if (est <= lastTime) est = lastTime + 0.05 + Math.random() * 0.2
      lastTime = est
      info.finished = true
      info.finishTime = est
      if (kart.state) kart.state.finished = true
      const entry = { kart, time: est, rank: this.results.length + 1 }
      info.result = entry
      this.results.push(entry)
    }
    this._computeRanks(false)
    this.phase = PHASES.FINISHED
    this.events.emit(EVT.RACE_OVER, { results: this.results })
  }

  // ───────────────────────────── ranking ─────────────────────────────

  _compare(a, b) {
    const ia = this._info.get(a)
    const ib = this._info.get(b)
    if (ia.finished || ib.finished) {
      if (ia.finished && ib.finished) return ia.finishTime - ib.finishTime
      return ia.finished ? -1 : 1
    }
    if (ia.score !== ib.score) return ib.score - ia.score
    if (ia.segProgress !== ib.segProgress) return ib.segProgress - ia.segProgress
    return a.index - b.index
  }

  _computeRanks(initial) {
    const arr = this._sorted
    arr.sort((a, b) => this._compare(a, b))
    for (let i = 0; i < arr.length; i++) {
      const info = this._info.get(arr[i])
      const rank = i + 1
      if (rank !== info.rank) {
        const prev = info.rank
        info.rank = rank
        if (!initial && arr[i] === this.playerKart && this.phase !== PHASES.COUNTDOWN) {
          this.events.emit(EVT.POSITION_CHANGE, { kart: arr[i], rank, prev })
        }
      }
    }
  }

  // ───────────────────────────── public queries ─────────────────────────────

  /** Karts sorted by rank. Returns the manager's internal (live) array — do not mutate. */
  standings() {
    return this._sorted
  }

  /** 1-based rank. */
  rankOf(kart) {
    const info = this._info.get(kart)
    return info ? info.rank : this.karts.length
  }

  /** 1-based current lap, capped at totalLaps. */
  lapOf(kart) {
    const info = this._info.get(kart)
    if (!info) return 1
    return clamp(info.lap, 1, this.totalLaps)
  }

  /** Overall race progress 0..1 (1 when finished). */
  progressOf(kart) {
    const info = this._info.get(kart)
    if (!info) return 0
    if (info.finished) return 1
    const N = this.checkpointCount
    const seg = clamp(info.segProgress * N, -0.5, 1)
    return clamp((info.score + seg) / (this.totalLaps * N), 0, 1)
  }

  /** Progress gap between two karts in metres (positive when `a` is ahead of `b`). */
  gapMetres(a, b) {
    return (this.progressOf(a) - this.progressOf(b)) * this.totalLaps * (this.track.length ?? 1000)
  }

  isPlayerFinished() {
    const info = this._info.get(this.playerKart)
    return !!(info && info.finished)
  }

  /** True while a kart is in its post-respawn no-control window (AI drivers check this). */
  isControlLocked(kart) {
    const info = this._info.get(kart)
    return !!(info && info.lockTimer > 0)
  }

  /** Seconds since GO (0 during countdown). */
  get raceTime() {
    return this.phase === PHASES.COUNTDOWN ? 0 : this.time
  }

  /** Test hook: mark a kart finished right now. */
  debugFinish(kart) {
    const info = this._info.get(kart)
    if (!info || info.finished) return
    if (this.phase === PHASES.COUNTDOWN) {
      this.countdown = 0
      this.phase = PHASES.RACING
      this.time = 0
      this.events.emit(EVT.RACE_START, {})
    }
    this._finishKart(info)
    this._computeRanks(false)
    if (this.results.length >= this.karts.length) this._endRace()
  }
}
