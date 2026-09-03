/**
 * Module 5a — procedural WebAudio: engines, music, sound effects.
 *
 * Everything before `unlock()` is a no-op (never throws). The manager subscribes to the
 * EventBus itself so the orchestrator only has to drive `setEngine`, `setMusic`, `update`.
 */
import { EVT } from '../core/constants.js'
import { SFX, SFX_NAMES } from './sfx.js'
import { EngineVoice } from './engine.js'
import { MusicPlayer, Sequencer, SONGS } from './music.js'
import { noiseBuffer, panGain, scheduleDisconnect } from './synth.js'

const BUS_LEVELS = { music: 0.5, sfx: 0.8, engines: 0.35 }
const RATE_LIMITED = {
  bump: 0.08, hit_wall: 0.08, shell_bounce: 0.08, drift_level: 0.05, roulette_tick: 0.03,
  explosion: 0.15, shell_hit: 0.06, banana_slip: 0.1, lightning: 0.5, star: 0.2, offroad: 0.4,
}
const DUCK_PAUSED = 0.3

export class AudioManager {
  /** @param {{events: import('../core/events.js').EventBus}} p */
  constructor({ events } = {}) {
    this.events = events
    this.ctx = null
    this.master = null
    this.compressor = null
    this.buses = null
    this.music = null
    this.engines = new Map()
    this._muted = false
    this._pendingMusic = null
    this._musicName = null
    this._duck = 1
    this._lastPlayed = new Map()
    this._drift = null
    this._starLoop = null
    this._offs = []
    this._wire()
  }

  get muted() {
    return this._muted
  }

  get unlocked() {
    return !!this.ctx && this.ctx.state === 'running'
  }

  /** Create/resume the AudioContext. Safe to call repeatedly (first user gesture). */
  unlock() {
    try {
      if (!this.ctx) {
        const AC = typeof window !== 'undefined' ? window.AudioContext || window.webkitAudioContext : null
        if (!AC) return
        this.ctx = new AC({ latencyHint: 'interactive' })
        this._buildGraph()
      }
      if (this.ctx.state === 'suspended') {
        const p = this.ctx.resume()
        if (p && p.catch) p.catch(() => {})
      }
      if (this._pendingMusic !== undefined && this._pendingMusic !== null) {
        const name = this._pendingMusic
        this._pendingMusic = null
        this.music.set(name)
        this._musicName = name
      }
      // Pre-warm the shared noise buffer so the first sfx doesn't stall.
      noiseBuffer(this.ctx)
    } catch (err) {
      console.warn('[audio] unlock failed', err)
    }
  }

  _buildGraph() {
    const ctx = this.ctx
    this.master = ctx.createGain()
    this.master.gain.value = this._muted ? 0 : 1
    this.compressor = ctx.createDynamicsCompressor()
    this.compressor.threshold.value = -14
    this.compressor.knee.value = 18
    this.compressor.ratio.value = 4
    this.compressor.attack.value = 0.004
    this.compressor.release.value = 0.18
    this.master.connect(this.compressor).connect(ctx.destination)

    this.buses = {}
    for (const k of Object.keys(BUS_LEVELS)) {
      const g = ctx.createGain()
      g.gain.value = BUS_LEVELS[k]
      g.connect(this.master)
      this.buses[k] = g
    }
    this.music = new MusicPlayer(ctx, this.buses.music)
  }

  // ───────────────────────────── music ─────────────────────────────

  /** @param {'menu'|'race'|'final'|'results'|null} name */
  setMusic(name) {
    if (name !== null && name !== undefined && !SONGS[name]) name = null
    this._musicName = name
    if (!this.music) {
      this._pendingMusic = name
      return
    }
    try {
      this.music.set(name)
    } catch (err) {
      console.warn('[audio] setMusic failed', err)
    }
  }

  // ───────────────────────────── engines ─────────────────────────────

  /** @param {number} id kart.index @param {{rpm:number,throttle:number,gain:number,pan:number}} p */
  setEngine(id, p) {
    if (!this.ctx) return
    let v = this.engines.get(id)
    if (!v) {
      if (!p || (p.gain ?? 0) <= 0.001) return // don't create voices for silent karts
      try {
        v = new EngineVoice(this.ctx, this.buses.engines)
      } catch (err) {
        console.warn('[audio] engine voice failed', err)
        return
      }
      this.engines.set(id, v)
    }
    v.set(p || {})
  }

  // ───────────────────────────── sfx ─────────────────────────────

  /**
   * Play a one-shot sound.
   * @param {string} name see SFX_NAMES
   * @param {{pan?:number, gain?:number, pitch?:number, level?:number}} [opts]
   */
  play(name, opts = {}) {
    if (!this.ctx) return
    const fn = SFX[name]
    if (!fn) return
    const ctx = this.ctx
    const now = ctx.currentTime
    const minGap = RATE_LIMITED[name]
    if (minGap) {
      const last = this._lastPlayed.get(name) ?? -1
      if (now - last < minGap) return
      this._lastPlayed.set(name, now)
    }
    try {
      const gain = opts.gain ?? 1
      const dest = panGain(ctx, this.buses.sfx, 1, opts.pan ?? 0)
      const end = fn(ctx, dest, { t: now + 0.003, p: opts.pitch ?? 1, v: gain, level: opts.level })
      scheduleDisconnect(ctx, dest, (typeof end === 'number' ? end : now + 2) + 0.1)
    } catch (err) {
      console.warn(`[audio] sfx "${name}" failed`, err)
    }
  }

  /** Looping tyre-skid noise for the player's drift. */
  startDrift(level = 0) {
    if (!this.ctx) return
    if (this._drift) {
      this.setDriftLevel(level)
      return
    }
    const ctx = this.ctx
    const src = ctx.createBufferSource()
    src.buffer = noiseBuffer(ctx)
    src.loop = true
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.Q.value = 1.6
    filter.frequency.value = 1100
    const lfo = ctx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = 9
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 180
    lfo.connect(lfoGain).connect(filter.frequency)
    const g = ctx.createGain()
    g.gain.value = 0
    g.gain.setTargetAtTime(0.32, ctx.currentTime, 0.05)
    src.connect(filter).connect(g).connect(this.buses.sfx)
    src.start()
    lfo.start()
    this._drift = { src, filter, g, lfo }
    this.setDriftLevel(level)
  }

  setDriftLevel(level) {
    if (!this._drift) return
    this._drift.filter.frequency.setTargetAtTime(1100 + 260 * level, this.ctx.currentTime, 0.08)
  }

  stopDrift() {
    const d = this._drift
    if (!d) return
    this._drift = null
    const ctx = this.ctx
    const now = ctx.currentTime
    d.g.gain.cancelScheduledValues(now)
    d.g.gain.setTargetAtTime(0, now, 0.06)
    d.src.stop(now + 0.35)
    d.lfo.stop(now + 0.35)
    d.src.onended = () => {
      d.g.disconnect()
      d.lfo.disconnect()
    }
  }

  /** Star-power jingle loop (sfx bus). */
  startStarLoop() {
    if (!this.ctx || this._starLoop) return
    try {
      this._starLoop = new Sequencer(this.ctx, this.buses.sfx, SONGS.star())
      this._starLoop.out.gain.value = 0
      this._starLoop.start(0.2)
      // Star loop is a lead line, keep it under the music.
      this._starLoop.out.gain.cancelScheduledValues(this.ctx.currentTime)
      this._starLoop.out.gain.setValueAtTime(0, this.ctx.currentTime)
      this._starLoop.out.gain.linearRampToValueAtTime(0.7, this.ctx.currentTime + 0.2)
      this._duckMusic()
    } catch (err) {
      console.warn('[audio] star loop failed', err)
    }
  }

  stopStarLoop() {
    if (!this._starLoop) return
    this._starLoop.stop(0.4)
    this._starLoop = null
    this._duckMusic()
  }

  // ───────────────────────────── mix ─────────────────────────────

  setMuted(m) {
    this._muted = !!m
    if (!this.master) return
    this.master.gain.setTargetAtTime(this._muted ? 0 : 1, this.ctx.currentTime, 0.03)
  }

  _duckMusic() {
    if (!this.buses) return
    const level = BUS_LEVELS.music * this._duck * (this._starLoop ? 0.55 : 1)
    this.buses.music.gain.setTargetAtTime(level, this.ctx.currentTime, 0.12)
  }

  /** Called every frame; keeps the sequencers scheduled even if timers are late. */
  update(_dt) {
    if (!this.ctx) return
    this.music?.tick()
    this._starLoop?.tick()
  }

  // ───────────────────────────── events ─────────────────────────────

  _wire() {
    const ev = this.events
    if (!ev || typeof ev.on !== 'function') return
    const on = (type, fn) => this._offs.push(ev.on(type, fn))
    const isPlayer = (p) => !!(p && p.kart && p.kart.isPlayer)
    const kartGain = (p, playerGain = 1, otherGain = 0.45) => (isPlayer(p) ? playerGain : otherGain)

    on(EVT.HOP, (p) => { if (isPlayer(p)) this.play('hop') })
    on(EVT.LAND, (p) => { if (isPlayer(p)) this.play('land') })
    on(EVT.DRIFT_START, (p) => { if (isPlayer(p)) this.startDrift(p.level ?? 0) })
    on(EVT.DRIFT_LEVEL, (p) => {
      if (!isPlayer(p)) return
      this.setDriftLevel(p.level ?? 1)
      this.play('drift_level', { level: p.level ?? 1 })
    })
    on(EVT.DRIFT_END, (p) => { if (isPlayer(p)) this.stopDrift() })
    on(EVT.BOOST, (p) => { if (isPlayer(p)) this.play('boost') })
    on(EVT.HIT, (p) => {
      const g = kartGain(p)
      switch (p?.kind) {
        case 'banana': this.play('banana_slip', { gain: g }); break
        case 'shell': this.play('shell_hit', { gain: g }); break
        case 'explosion': this.play('explosion', { gain: g * 0.6 }); break
        case 'hazard': this.play('hit_wall', { gain: g }); break
        default: break // lightning: LIGHTNING event covers it
      }
    })
    on(EVT.WALL_HIT, (p) => this.play('hit_wall', { gain: kartGain(p, 1, 0.3) }))
    on(EVT.OFFROAD_ENTER, (p) => { if (isPlayer(p)) this.play('offroad') })
    on(EVT.KART_BUMP, (p) => {
      const involved = !!(p && ((p.a && p.a.isPlayer) || (p.b && p.b.isPlayer) || isPlayer(p)))
      this.play('bump', { gain: involved ? 1 : 0.35 })
    })
    on(EVT.COUNTDOWN, () => this.play('countdown'))
    on(EVT.RACE_START, () => this.play('go'))
    on(EVT.LAP, (p) => { if (isPlayer(p)) this.play(p.isFinal ? 'final_lap' : 'lap') })
    on(EVT.ITEM_PICKUP, (p) => { if (isPlayer(p)) this.play('item_pickup') })
    on(EVT.ITEM_ROULETTE_TICK, (p) => { if (isPlayer(p)) this.play('roulette_tick') })
    on(EVT.ITEM_USE, (p) => {
      const g = kartGain(p, 1, 0.4)
      this.play('item_use', { gain: g })
      const item = itemId(p)
      if (item && /shell|bob_omb/.test(item)) this.play('shell_throw', { gain: g })
    })
    on(EVT.ITEM_HIT, (p) => {
      const g = kartGain(p, 1, 0.5)
      const item = itemId(p)
      if (item && /banana/.test(item)) this.play('banana_slip', { gain: g })
      else if (item === 'fake_box') this.play('shell_hit', { gain: g, pitch: 0.8 })
      else this.play('shell_hit', { gain: g })
    })
    on(EVT.SHELL_BOUNCE, () => this.play('shell_bounce', { gain: 0.6 }))
    on(EVT.EXPLOSION, () => this.play('explosion'))
    on(EVT.STAR_START, (p) => {
      this.play('star', { gain: kartGain(p, 1, 0.5) })
      if (isPlayer(p)) this.startStarLoop()
    })
    on(EVT.STAR_END, (p) => { if (isPlayer(p)) this.stopStarLoop() })
    on(EVT.LIGHTNING, () => this.play('lightning'))
    on(EVT.RESPAWN, (p) => this.play('respawn', { gain: kartGain(p, 1, 0.3) }))
    on(EVT.UI_MOVE, () => this.play('menu_move'))
    on(EVT.UI_SELECT, () => this.play('menu_select'))
    on(EVT.UI_BACK, () => this.play('menu_back'))
    on(EVT.PAUSE, (p) => {
      this._duck = p && p.paused ? DUCK_PAUSED : 1
      this._duckMusic()
      if (p && p.paused) this.stopDrift()
    })
    on(EVT.SCREEN, (p) => {
      // Leaving the race: kill loops that only make sense mid-race.
      if (p && p.name !== 'race') {
        this.stopDrift()
        this.stopStarLoop()
      }
    })
    on(EVT.FINISH, (p) => {
      if (isPlayer(p)) {
        this.stopDrift()
      }
    })
  }

  dispose() {
    for (const off of this._offs) off()
    this._offs = []
    this.stopDrift()
    this.stopStarLoop()
    this.music?.dispose()
    for (const v of this.engines.values()) v.dispose()
    this.engines.clear()
    if (this.ctx && this.ctx.close) this.ctx.close().catch(() => {})
    this.ctx = null
  }
}

function itemId(p) {
  const it = p?.item
  if (!it) return null
  return typeof it === 'string' ? it : it.id ?? null
}

export { SFX_NAMES }
