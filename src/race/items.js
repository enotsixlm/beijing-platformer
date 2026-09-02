// Module 3 — ItemSystem: item boxes, roulette, item usage, projectiles/hazards, collisions.
import * as THREE from 'three'
import { EVT, ITEMS, ITEM_IDS, SURFACE, PHASES, KART_RADIUS } from '../core/constants.js'
import { wrap01, clamp } from '../core/rng.js'
import { ItemAssets, ITEM_BOX_SIZE } from './itemModels.js'

const PICKUP_RADIUS = 1.4
const BOX_RESPAWN = 3
const ROULETTE_TIME = 1.2
const ROULETTE_TICK = 0.1
const OWNER_GRACE = 0.4
const GREEN_SPEED = 38
const RED_SPEED = 40
const GREEN_LIFE = 8
const RED_LIFE = 10
const STATIC_LIFE = 45
const MAX_BOUNCES = 3
const BOMB_FUSE = 2
const BOMB_RADIUS = 4.5
const GRAVITY = 10
const MAX_STATIC = 28

const SHELL_KINDS = new Set(['green_shell', 'red_shell'])
const HIT_KIND = { green_shell: 'shell', red_shell: 'shell', banana: 'banana', fake_box: 'fake_box', bob_omb: 'explosion' }
const REST_Y = { green_shell: 0.05, red_shell: 0.05, banana: 0, bob_omb: 0, fake_box: ITEM_BOX_SIZE * 0.5 + 0.1 }
const RADIUS = { green_shell: 0.6, red_shell: 0.6, banana: 0.55, bob_omb: 0.6, fake_box: 0.8 }

const _dummy = new THREE.Object3D()

function tDelta(from, to) {
  let d = to - from
  d -= Math.round(d)
  return d
}

class Entity {
  constructor() {
    this.active = false
    this.kind = 'banana'
    this.item = 'banana'
    this.position = new THREE.Vector3()
    this.velocity = new THREE.Vector3()
    this.radius = 0.5
    this.owner = null
    this.target = null
    this.age = 0
    this.life = STATIC_LIFE
    this.bounces = 0
    this.hintT = undefined
    this.roadT = undefined // cached road coordinates for AI avoidance
    this.roadLat = 0
    this.airborne = false
    this.fuse = -1
    this.mesh = null
    this.spin = 0
    this.surfaceH = 0
    this.restY = 0
  }
}

export class ItemSystem {
  /**
   * @param {{scene: THREE.Scene, track, karts: Array, events, rng?: () => number}} opts
   */
  constructor({ scene, track, karts, events, rng }) {
    this.scene = scene
    this.track = track
    this.karts = karts
    this.events = events
    this.rng = rng ?? Math.random
    this.assets = new ItemAssets()
    this.time = 0

    this._live = []
    this._free = []
    this._roulettes = []
    this._stars = []
    this._held = new Map()
    this._boxCount = 0
    this._doomed = []
    this._race = null

    this._setupBoxes()
  }

  // ───────────────────────────── item boxes ─────────────────────────────

  _setupBoxes() {
    const boxes = this.track.itemBoxes ?? []
    const n = boxes.length
    this._boxCount = n
    this._boxPos = boxes.map((b) => b.position.clone())
    this._boxActive = new Array(n).fill(true)
    this._boxTimer = new Float32Array(n)
    this._boxScale = new Float32Array(n).fill(1)
    this._boxPhase = new Float32Array(n)
    for (let i = 0; i < n; i++) this._boxPhase[i] = this.rng() * Math.PI * 2
    const inst = this.assets.createBoxInstances(n)
    this._boxCubes = inst.cubes
    this._boxInner = inst.inner
    this._boxCubes.count = n
    this._boxInner.count = n
    if (n > 0 && this.scene) {
      this.scene.add(this._boxCubes)
      this.scene.add(this._boxInner)
    }
    this._animateBoxes(0)
  }

  _animateBoxes(dt) {
    const n = this._boxCount
    if (n === 0) return
    const t = this.time
    for (let i = 0; i < n; i++) {
      if (!this._boxActive[i]) {
        this._boxTimer[i] -= dt
        if (this._boxTimer[i] <= 0) {
          this._boxActive[i] = true
          this._boxScale[i] = 0
        }
      } else if (this._boxScale[i] < 1) {
        // Scale-in with a little overshoot.
        this._boxScale[i] = Math.min(1, this._boxScale[i] + dt * 2.5)
      }
      const s0 = this._boxScale[i]
      const s = this._boxActive[i] ? (s0 < 1 ? s0 * (1 + 0.25 * Math.sin(s0 * Math.PI)) : 1) : 0
      const ph = this._boxPhase[i]
      const p = this._boxPos[i]
      _dummy.position.set(p.x, p.y + Math.sin(t * 2.2 + ph) * 0.14, p.z)
      _dummy.rotation.set(t * 0.8 + ph, t * 1.3 + ph, t * 0.5)
      _dummy.scale.setScalar(s)
      _dummy.updateMatrix()
      this._boxCubes.setMatrixAt(i, _dummy.matrix)
      _dummy.rotation.set(0, t * 2.6 + ph, 0)
      _dummy.scale.setScalar(s)
      _dummy.updateMatrix()
      this._boxInner.setMatrixAt(i, _dummy.matrix)
    }
    this._boxCubes.instanceMatrix.needsUpdate = true
    this._boxInner.instanceMatrix.needsUpdate = true
  }

  _updatePickups(race) {
    const n = this._boxCount
    if (n === 0) return
    const r2 = PICKUP_RADIUS * PICKUP_RADIUS
    const total = this.karts.length
    for (let i = 0; i < n; i++) {
      if (!this._boxActive[i] || this._boxScale[i] < 0.5) continue
      const p = this._boxPos[i]
      for (let k = 0; k < total; k++) {
        const kart = this.karts[k]
        if (kart.item || kart.itemRoulette != null || !kart.position) continue
        const dx = kart.position.x - p.x
        const dz = kart.position.z - p.z
        const dy = kart.position.y - p.y
        if (dx * dx + dz * dz < r2 && Math.abs(dy) < 2.5) {
          this._boxActive[i] = false
          this._boxTimer[i] = BOX_RESPAWN
          const rank = race && race.rankOf ? race.rankOf(kart) : 1
          this.giveRandom(kart, rank, total)
          break
        }
      }
    }
  }

  // ───────────────────────────── roulette / distribution ─────────────────────────────

  _lightningInPlay() {
    for (const k of this.karts) if (k.item && k.item.id === 'lightning') return true
    for (const r of this._roulettes) if (r.id === 'lightning') return true
    return false
  }

  _starInPlay() {
    for (const k of this.karts) {
      if (k.item && k.item.id === 'star') return true
      if (k.state && k.state.starTimer > 0) return true
    }
    for (const r of this._roulettes) if (r.id === 'star') return true
    return false
  }

  _anyStarActive() {
    if (this._stars.length > 0) return true
    for (const k of this.karts) if (k.state && k.state.starTimer > 0) return true
    return false
  }

  /** Rank-weighted random item id (respects uniqueness of lightning/star). */
  pickItemId(rank, total) {
    const third = total / 3
    const bucket = rank <= third ? 0 : rank > 2 * third ? 2 : 1
    const noLightning = this._lightningInPlay() || this._anyStarActive()
    const noStar = this._starInPlay()
    const weights = []
    let sum = 0
    for (const id of ITEM_IDS) {
      let w = ITEMS[id].weight[bucket]
      if (id === 'lightning' && noLightning) w = 0
      if (id === 'star' && noStar) w = 0
      weights.push(w)
      sum += w
    }
    if (sum <= 0) return 'mushroom'
    let r = this.rng() * sum
    for (let i = 0; i < ITEM_IDS.length; i++) {
      r -= weights[i]
      if (r < 0) return ITEM_IDS[i]
    }
    return ITEM_IDS[ITEM_IDS.length - 1]
  }

  /**
   * Start the item roulette for a kart; after ~1.2 s `kart.item` is assigned and ITEM_PICKUP fires.
   * @returns {boolean} false if the kart already holds/rolls an item
   */
  giveRandom(kart, rank = 1, total = this.karts.length) {
    if (kart.item || kart.itemRoulette != null) return false
    const id = this.pickItemId(rank, total)
    kart.itemRoulette = 0
    this._roulettes.push({ kart, t: 0, tick: 0, id, rank, total })
    return true
  }

  _updateRoulettes(dt) {
    for (let i = this._roulettes.length - 1; i >= 0; i--) {
      const r = this._roulettes[i]
      const kart = r.kart
      if (kart.itemRoulette == null) {
        // Cancelled externally (e.g. lightning stole it).
        this._roulettes.splice(i, 1)
        continue
      }
      r.t += dt / ROULETTE_TIME
      r.tick += dt
      if (r.tick >= ROULETTE_TICK) {
        r.tick -= ROULETTE_TICK
        this.events.emit(EVT.ITEM_ROULETTE_TICK, { kart, progress: Math.min(1, r.t) })
      }
      if (r.t >= 1) {
        this._roulettes.splice(i, 1)
        let id = r.id
        // Re-validate uniqueness at assignment time.
        if ((id === 'lightning' && (this._lightningInPlay() || this._anyStarActive())) || (id === 'star' && this._starInPlay())) {
          id = this.pickItemId(r.rank, r.total)
        }
        kart.item = { id, count: ITEMS[id].count }
        kart.itemRoulette = null
        this.events.emit(EVT.ITEM_PICKUP, { kart, item: kart.item })
      } else {
        kart.itemRoulette = r.t
      }
    }
  }

  hasItem(kart) {
    return !!(kart && kart.item)
  }

  // ───────────────────────────── use ─────────────────────────────

  /**
   * Fire the kart's current item.
   * @param {object} kart
   * @param {{backwards?: boolean, forward?: boolean}} [opts] `backwards` throws/looks back; `forward` tosses droppables ahead
   * @returns {boolean} true if an item was used
   */
  use(kart, opts = {}) {
    const item = kart.item
    if (!item || kart.itemRoulette != null) return false
    const st = kart.state
    if (st && (st.spinTimer > 0 || st.stunTimer > 0)) return false
    const backwards = !!opts.backwards
    const forward = !!opts.forward && !backwards
    const id = item.id

    switch (id) {
      case 'mushroom':
      case 'triple_mushroom':
        kart.applyBoost(10, 0.9)
        break
      case 'banana':
      case 'triple_banana':
        if (forward) this._spawnToss('banana', kart)
        else this._spawnDrop('banana', kart)
        break
      case 'fake_box':
        if (forward) this._spawnToss('fake_box', kart)
        else this._spawnDrop('fake_box', kart)
        break
      case 'green_shell':
      case 'triple_green':
        this._spawnShell('green_shell', kart, backwards, null)
        break
      case 'red_shell': {
        const target = backwards ? null : this._findRedTarget(kart, opts.race)
        this._spawnShell('red_shell', kart, backwards, target)
        break
      }
      case 'star':
        kart.setStar(10)
        this._stars.push({ kart, timer: 10 })
        this.events.emit(EVT.STAR_START, { kart })
        break
      case 'lightning':
        this._lightning(kart, opts.race)
        break
      case 'bob_omb':
        if (backwards) this._spawnDrop('bob_omb', kart, BOMB_FUSE)
        else this._spawnToss('bob_omb', kart, BOMB_FUSE)
        break
      default:
        return false
    }

    this.events.emit(EVT.ITEM_USE, { kart, item: { id, count: item.count } })
    item.count -= 1
    if (item.count <= 0) kart.item = null
    return true
  }

  _findRedTarget(kart, race) {
    race = race ?? this._race
    const standings = race && race.standings ? race.standings() : null
    if (standings) {
      const idx = standings.indexOf(kart)
      for (let i = idx - 1; i >= 0; i--) {
        const k = standings[i]
        if (k && !(k.state && k.state.finished)) return k
      }
      return null
    }
    // Fallback: nearest kart in front by heading.
    const fx = Math.sin(kart.heading)
    const fz = Math.cos(kart.heading)
    let best = null
    let bestD = Infinity
    for (const k of this.karts) {
      if (k === kart) continue
      const dx = k.position.x - kart.position.x
      const dz = k.position.z - kart.position.z
      const along = dx * fx + dz * fz
      if (along <= 0) continue
      const d = dx * dx + dz * dz
      if (d < bestD) {
        bestD = d
        best = k
      }
    }
    return best
  }

  _lightning(user, race) {
    race = race ?? this._race
    for (const k of this.karts) {
      if (k === user) continue
      if (k.state && k.state.starTimer > 0) continue
      if (k.state && k.state.finished) continue
      k.hit('lightning')
      this.events.emit(EVT.ITEM_HIT, { kart: k, item: 'lightning', position: k.position })
    }
    let leader = null
    if (race && race.standings) leader = race.standings()[0]
    if (leader && leader !== user) {
      leader.item = null
      leader.itemRoulette = null
    }
    this.events.emit(EVT.LIGHTNING, { kart: user })
  }

  // ───────────────────────────── spawning ─────────────────────────────

  _acquire(kind) {
    let e = this._free.pop()
    if (!e) e = new Entity()
    e.active = true
    e.kind = kind
    e.item = kind
    e.radius = RADIUS[kind] ?? 0.5
    e.restY = REST_Y[kind] ?? 0
    e.owner = null
    e.target = null
    e.age = 0
    e.life = SHELL_KINDS.has(kind) ? (kind === 'red_shell' ? RED_LIFE : GREEN_LIFE) : STATIC_LIFE
    e.bounces = 0
    e.hintT = undefined
    e.roadT = undefined
    e.roadLat = 0
    e.airborne = false
    e.fuse = -1
    e.spin = 0
    e.velocity.set(0, 0, 0)
    e.mesh = this.assets.acquire(kind)
    if (this.scene) this.scene.add(e.mesh)
    this._live.push(e)
    if (!SHELL_KINDS.has(kind)) this._capStatics()
    return e
  }

  _capStatics() {
    let statics = 0
    for (const e of this._live) if (!SHELL_KINDS.has(e.kind)) statics++
    if (statics <= MAX_STATIC) return
    for (const e of this._live) {
      if (!SHELL_KINDS.has(e.kind) && !e.airborne) {
        this._remove(e)
        return
      }
    }
  }

  _remove(e) {
    if (!e.active) return
    e.active = false
    this.assets.release(e.mesh)
    e.mesh = null
    e.owner = null
    e.target = null
    const i = this._live.indexOf(e)
    if (i >= 0) {
      this._live[i] = this._live[this._live.length - 1]
      this._live.pop()
    }
    this._free.push(e)
  }

  _groundHeight(e) {
    const s = this.track.getSurfaceAt(e.position, e.hintT)
    e.hintT = s.t
    e.roadT = s.t
    e.roadLat = s.lateral
    return s
  }

  _spawnDrop(kind, kart, fuse = -1) {
    const e = this._acquire(kind)
    e.owner = kart
    const fx = Math.sin(kart.heading)
    const fz = Math.cos(kart.heading)
    e.position.set(kart.position.x - fx * 2.5, kart.position.y, kart.position.z - fz * 2.5)
    e.hintT = kart.progress
    const s = this._groundHeight(e)
    e.position.y = s.height + e.restY
    e.surfaceH = s.height
    e.fuse = fuse
    e.mesh.rotation.y = kart.heading
    if (s.type === SURFACE.VOID) e.life = 0.01
    this._syncMesh(e)
    return e
  }

  _spawnToss(kind, kart, fuse = -1) {
    const e = this._acquire(kind)
    e.owner = kart
    const fx = Math.sin(kart.heading)
    const fz = Math.cos(kart.heading)
    e.position.set(kart.position.x + fx * 1.2, kart.position.y + 0.9, kart.position.z + fz * 1.2)
    const h = Math.max(0, kart.speed ?? 0) + 10
    e.velocity.set(fx * h, 6, fz * h)
    e.airborne = true
    e.hintT = kart.progress
    e.fuse = fuse
    e.mesh.rotation.y = kart.heading
    this._syncMesh(e)
    return e
  }

  _spawnShell(kind, kart, backwards, target) {
    const e = this._acquire(kind)
    e.owner = kart
    e.target = target
    const dir = backwards ? -1 : 1
    const fx = Math.sin(kart.heading) * dir
    const fz = Math.cos(kart.heading) * dir
    const base = kind === 'red_shell' ? RED_SPEED : GREEN_SPEED
    const speed = backwards ? base : Math.max(base, Math.max(0, kart.speed ?? 0) + base * 0.4)
    e.position.set(kart.position.x + fx * 1.5, kart.position.y + 0.2, kart.position.z + fz * 1.5)
    e.velocity.set(fx * speed, 0, fz * speed)
    e.hintT = kart.progress
    const s = this._groundHeight(e)
    e.position.y = s.height + e.restY
    e.surfaceH = s.height
    this._syncMesh(e)
    return e
  }

  // ───────────────────────────── per-frame ─────────────────────────────

  /**
   * @param {number} dt
   * @param {import('./raceManager.js').RaceManager} [race]
   */
  update(dt, race) {
    this.time += dt
    this._race = race
    this._animateBoxes(dt)
    this._updateRoulettes(dt)
    this._updateStars(dt)
    if (!race || race.phase !== PHASES.COUNTDOWN) this._updatePickups(race)
    this._updateEntities(dt)
    this._resolveKartCollisions()
    this._resolveEntityCollisions()
    this._updateHeld(dt)
  }

  _updateStars(dt) {
    for (let i = this._stars.length - 1; i >= 0; i--) {
      const s = this._stars[i]
      s.timer -= dt
      const kartTimer = s.kart.state ? s.kart.state.starTimer : undefined
      if (s.timer <= 0 || (typeof kartTimer === 'number' && kartTimer <= 0 && s.timer < 9.5)) {
        this._stars.splice(i, 1)
        this.events.emit(EVT.STAR_END, { kart: s.kart })
      }
    }
  }

  _updateEntities(dt) {
    const live = this._live
    for (let i = live.length - 1; i >= 0; i--) {
      if (i >= live.length) continue // explosions may have removed several entities at once
      const e = live[i]
      e.age += dt
      if (e.age > e.life) {
        this._remove(e)
        continue
      }
      if (e.fuse > 0) {
        e.fuse -= dt
        if (e.fuse <= 0) {
          this._explode(e)
          continue
        }
      }

      if (e.airborne) {
        e.velocity.y -= GRAVITY * dt
        e.position.addScaledVector(e.velocity, dt)
        const s = this._groundHeight(e)
        if (e.position.y <= s.height + e.restY) {
          if (s.type === SURFACE.VOID) {
            this._remove(e)
            continue
          }
          e.position.y = s.height + e.restY
          e.surfaceH = s.height
          e.airborne = false
          if (SHELL_KINDS.has(e.kind)) e.velocity.y = 0
          else e.velocity.set(0, 0, 0)
        }
        e.spin += dt * 8
      } else if (SHELL_KINDS.has(e.kind)) {
        if (e.kind === 'red_shell') this._homeRedShell(e, dt)
        e.position.addScaledVector(e.velocity, dt)
        const s = this._groundHeight(e)
        if (s.type === SURFACE.VOID) {
          this._remove(e)
          continue
        }
        // Follow road height smoothly.
        const targetY = s.height + e.restY
        e.position.y += (targetY - e.position.y) * Math.min(1, dt * 14)
        e.surfaceH = s.height
        // Wall response.
        const lat = s.lateral
        const wall = (s.wallHalfWidth ?? (s.halfWidth + 3)) - 0.5
        if (Math.abs(lat) >= wall) {
          if (e.kind === 'red_shell' || e.bounces >= MAX_BOUNCES) {
            this.events.emit(EVT.ITEM_HIT, { kart: null, item: e.item, position: e.position, destroyed: true })
            this._remove(e)
            continue
          }
          const sign = lat > 0 ? 1 : -1
          const nx = s.right.x * sign
          const nz = s.right.z * sign
          const vn = e.velocity.x * nx + e.velocity.z * nz
          if (vn > 0) {
            e.velocity.x -= 2 * vn * nx
            e.velocity.z -= 2 * vn * nz
          }
          const push = Math.abs(lat) - (wall - 0.1)
          e.position.x -= nx * push
          e.position.z -= nz * push
          e.bounces++
          this.events.emit(EVT.SHELL_BOUNCE, { position: e.position, kart: e.owner })
        }
        e.spin += dt * 14
      } else {
        // Static obstacle: idle wobble.
        e.spin += dt * 2
      }
      this._syncMesh(e)
    }
  }

  _homeRedShell(e, dt) {
    const target = e.target
    if (!target || !target.position || (target.state && target.state.finished)) return
    const speed = e.velocity.length() || RED_SPEED
    const dx = target.position.x - e.position.x
    const dz = target.position.z - e.position.z
    const dist = Math.hypot(dx, dz)
    let ax, az
    let turnRate
    const tShell = e.hintT ?? 0
    const tTarget = typeof target.progress === 'number' ? target.progress : (target.surface ? target.surface.t : tShell)
    const ahead = tDelta(tShell, tTarget)
    if (dist < 15 || ahead <= 0) {
      ax = dx
      az = dz
      turnRate = 6
    } else {
      const len = this.track.length || 1000
      const look = Math.min(ahead, 14 / len)
      const smp = this.track.sample(wrap01(tShell + look))
      const hw = smp.halfWidth ?? 6
      const lat = clamp((target.surface && target.surface.lateral) || 0, -hw + 1, hw - 1) * 0.6
      ax = smp.position.x + smp.right.x * lat - e.position.x
      az = smp.position.z + smp.right.z * lat - e.position.z
      turnRate = 3.5
    }
    const al = Math.hypot(ax, az)
    if (al < 1e-4) return
    ax /= al
    az /= al
    const cur = Math.atan2(e.velocity.x, e.velocity.z)
    const want = Math.atan2(ax, az)
    let d = want - cur
    d = Math.atan2(Math.sin(d), Math.cos(d))
    const maxStep = turnRate * dt
    const step = clamp(d, -maxStep, maxStep)
    const h = cur + step
    e.velocity.x = Math.sin(h) * speed
    e.velocity.z = Math.cos(h) * speed
  }

  _syncMesh(e) {
    const m = e.mesh
    if (!m) return
    m.position.copy(e.position)
    if (SHELL_KINDS.has(e.kind)) {
      if (m.userData.spin) m.userData.spin.rotation.y = e.spin
      m.rotation.y = e.spin * 0.5
    } else if (e.kind === 'bob_omb') {
      const fuse01 = e.fuse > 0 ? 1 - e.fuse / BOMB_FUSE : 0
      const spark = m.userData.spark
      if (spark) spark.scale.setScalar(0.6 + fuse01 * 1.6 + Math.sin(e.age * 40) * 0.15)
      if (m.userData.key) m.userData.key.rotation.y = e.age * 6
      m.rotation.y = e.airborne ? e.spin : m.rotation.y
      m.scale.setScalar(1 + fuse01 * 0.15)
    } else if (e.kind === 'fake_box') {
      m.rotation.set(e.age * 0.8, e.age * 1.3, e.age * 0.5)
      m.position.y = e.position.y + Math.sin(e.age * 2.2) * 0.1
    } else {
      // banana: wobble a little, spin when airborne
      m.rotation.y = e.airborne ? e.spin : m.rotation.y
      m.rotation.z = Math.sin(e.spin) * 0.08
    }
  }

  // ───────────────────────────── collisions ─────────────────────────────

  _resolveKartCollisions() {
    const live = this._live
    const karts = this.karts
    for (let i = live.length - 1; i >= 0; i--) {
      if (i >= live.length) continue
      const e = live[i]
      const r = e.radius + KART_RADIUS
      const r2 = r * r
      for (let k = 0; k < karts.length; k++) {
        const kart = karts[k]
        if (!kart.position) continue
        if (kart === e.owner && e.age < OWNER_GRACE) continue
        const dx = kart.position.x - e.position.x
        const dz = kart.position.z - e.position.z
        if (dx * dx + dz * dz > r2) continue
        if (Math.abs(kart.position.y - e.position.y) > 2.2) continue
        const star = kart.state && kart.state.starTimer > 0
        if (star) {
          this.events.emit(EVT.ITEM_HIT, { kart, item: e.item, position: e.position, destroyed: true })
          this._remove(e)
          break
        }
        if (e.kind === 'bob_omb') {
          this._explode(e)
          break
        }
        kart.hit(HIT_KIND[e.kind] ?? 'shell')
        this.events.emit(EVT.ITEM_HIT, { kart, item: e.item, position: e.position })
        this._remove(e)
        break
      }
    }
  }

  _resolveEntityCollisions() {
    const live = this._live
    const n = live.length
    if (n < 2) return
    const doomed = this._doomed
    doomed.length = 0
    for (let i = 0; i < n; i++) {
      const a = live[i]
      const aShell = SHELL_KINDS.has(a.kind)
      for (let j = i + 1; j < n; j++) {
        const b = live[j]
        const bShell = SHELL_KINDS.has(b.kind)
        if (!aShell && !bShell) continue
        const r = a.radius + b.radius
        const dx = a.position.x - b.position.x
        const dz = a.position.z - b.position.z
        if (dx * dx + dz * dz > r * r) continue
        if (Math.abs(a.position.y - b.position.y) > 2) continue
        if (doomed.indexOf(a) < 0) doomed.push(a)
        if (doomed.indexOf(b) < 0) doomed.push(b)
      }
    }
    for (let i = 0; i < doomed.length; i++) this._destroyOrExplode(doomed[i])
    doomed.length = 0
  }

  _destroyOrExplode(e) {
    if (!e.active) return
    if (e.kind === 'bob_omb') {
      this._explode(e)
      return
    }
    this.events.emit(EVT.ITEM_HIT, { kart: null, item: e.item, position: e.position, destroyed: true })
    this._remove(e)
  }

  _explode(e) {
    if (!e.active) return
    const owner = e.owner
    const pos = e.position.clone()
    this._remove(e)
    this.events.emit(EVT.EXPLOSION, { position: pos, kart: owner })
    const r2 = BOMB_RADIUS * BOMB_RADIUS
    for (const kart of this.karts) {
      if (!kart.position) continue
      if (kart.state && kart.state.starTimer > 0) continue
      const dx = kart.position.x - pos.x
      const dz = kart.position.z - pos.z
      const dy = kart.position.y - pos.y
      if (dx * dx + dz * dz <= r2 && Math.abs(dy) < 4) {
        kart.hit('explosion')
        this.events.emit(EVT.ITEM_HIT, { kart, item: 'bob_omb', position: pos })
      }
    }
    // Chain-destroy nearby obstacles.
    for (let i = this._live.length - 1; i >= 0; i--) {
      const o = this._live[i]
      if (!o.active) continue
      const dx = o.position.x - pos.x
      const dz = o.position.z - pos.z
      if (dx * dx + dz * dz <= r2) {
        if (o.kind === 'bob_omb') this._explode(o)
        else {
          this.events.emit(EVT.ITEM_HIT, { kart: null, item: o.item, position: o.position, destroyed: true })
          this._remove(o)
        }
      }
    }
  }

  // ───────────────────────────── held item visuals ─────────────────────────────

  _heldKindFor(id) {
    switch (id) {
      case 'banana':
      case 'triple_banana': return 'banana'
      case 'green_shell':
      case 'triple_green': return 'green_shell'
      case 'red_shell': return 'red_shell'
      case 'bob_omb': return 'bob_omb'
      case 'fake_box': return 'fake_box'
      default: return null
    }
  }

  _updateHeld(dt) {
    for (const kart of this.karts) {
      let rec = this._held.get(kart)
      const item = kart.item
      const id = item ? item.id : null
      const count = item ? item.count : 0
      const kind = id ? this._heldKindFor(id) : null
      const wantCount = kind ? count : 0
      if (!rec) {
        rec = { id: null, count: 0, meshes: [], kind: null, phase: this.rng() * 6.28 }
        this._held.set(kart, rec)
      }
      if (rec.kind !== kind || rec.count !== wantCount) {
        for (const m of rec.meshes) this.assets.release(m)
        rec.meshes.length = 0
        rec.kind = kind
        rec.count = wantCount
        if (kind) {
          for (let i = 0; i < wantCount; i++) {
            const m = this.assets.acquire(kind)
            m.scale.setScalar(0.85)
            if (this.scene) this.scene.add(m)
            rec.meshes.push(m)
          }
        }
      }
      if (rec.meshes.length === 0 || !kart.position) continue
      const fx = Math.sin(kart.heading)
      const fz = Math.cos(kart.heading)
      const rx = Math.cos(kart.heading)
      const rz = -Math.sin(kart.heading)
      const y = kart.position.y + (kind === 'fake_box' ? 0.9 : 0.35)
      const n = rec.meshes.length
      for (let i = 0; i < n; i++) {
        const m = rec.meshes[i]
        if (kind === 'green_shell' && n > 1) {
          // Orbit around the kart.
          const a = this.time * 3 + rec.phase + (i / n) * Math.PI * 2
          const ox = Math.cos(a) * 2.0
          const oz = Math.sin(a) * 2.0
          m.position.set(kart.position.x + ox, y + 0.2, kart.position.z + oz)
          if (m.userData.spin) m.userData.spin.rotation.y = this.time * 6
        } else {
          // Trailing chain behind the kart.
          const back = 1.7 + i * 1.15
          const sway = Math.sin(this.time * 4 + i) * 0.08
          m.position.set(kart.position.x - fx * back + rx * sway, y, kart.position.z - fz * back + rz * sway)
          m.rotation.y = kart.heading
          if (kind === 'fake_box') m.rotation.set(this.time * 0.8, this.time * 1.3, this.time * 0.5)
          if (m.userData.spin) m.userData.spin.rotation.y = this.time * 4
        }
      }
    }
  }

  // ───────────────────────────── queries ─────────────────────────────

  /** Live array of active projectiles/obstacles ({position, radius, kind, ...}). Do not mutate. */
  getObstacles() {
    return this._live
  }

  dispose() {
    for (let i = this._live.length - 1; i >= 0; i--) this._remove(this._live[i])
    this._live.length = 0
    this._free.length = 0
    this._roulettes.length = 0
    this._stars.length = 0
    for (const rec of this._held.values()) for (const m of rec.meshes) this.assets.release(m)
    this._held.clear()
    if (this._boxCubes) {
      this._boxCubes.removeFromParent()
      this._boxInner.removeFromParent()
      this._boxCubes.dispose()
      this._boxInner.dispose()
    }
    this.assets.dispose()
  }
}
