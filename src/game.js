import * as THREE from 'three'
import { EventBus } from './core/events.js'
import { EVT, PHASES, RACER_COUNT, DIFFICULTY, KART_RADIUS } from './core/constants.js'
import { mulberry32 } from './core/rng.js'
import { TRACKS, createTrack } from './track/index.js'
import { CHARACTERS, Kart, PlayerInput, ChaseCamera, resolveKartCollisions } from './kart/index.js'
import { AIDriver, ItemSystem, RaceManager } from './race/index.js'
import { UI } from './ui/index.js'
import { AudioManager } from './audio/index.js'
import { FXSystem, createPostFX } from './fx/index.js'

const MAX_DT = 1 / 30

/**
 * Orchestrator: owns renderer/scene/camera, screen flow and the game loop.
 * All gameplay logic lives in the modules; this file only wires them together.
 */
export class Game {
  constructor({ container, uiRoot }) {
    this.container = container
    this.uiRoot = uiRoot
    this.events = new EventBus()
    this.screen = 'boot'
    this.paused = false
    this.race = null
    this.ready = false
    this.time = 0
    this._fps = 60
    this._lastTs = 0
    this._raf = 0
    this._menuTrack = null
  }

  boot() {
    this._setupRenderer()
    this.ui = new UI({ root: this.uiRoot, characters: CHARACTERS, tracks: TRACKS, events: this.events })
    this.audio = new AudioManager({ events: this.events })
    this.fx = new FXSystem({ scene: this.scene, events: this.events })
    this.postfx = createPostFX(this.renderer, this.scene, this.camera)
    this.input = new PlayerInput()
    this.chaseCam = new ChaseCamera(this.camera)

    this.events.on(EVT.UI_MUTE_TOGGLE, () => {
      this.audio.setMuted(!this.audio.muted)
      this.ui.setMuted(this.audio.muted)
    })

    const unlock = () => this.audio.unlock()
    window.addEventListener('pointerdown', unlock, { passive: true })
    window.addEventListener('keydown', unlock)
    window.addEventListener('keydown', (e) => this._onKey(e))
    window.addEventListener('resize', () => this._resize())
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.screen === 'race' && !this.paused) this.togglePause(true)
    })

    this._loadMenuScene()
    this.showTitle()
    this.ready = true
    this._lastTs = performance.now()
    this._raf = requestAnimationFrame((ts) => this._frame(ts))
  }

  // ───────────────────────────── screens ─────────────────────────────

  showTitle() {
    this._setScreen('title')
    this.audio.setMusic('menu')
    this.ui.showTitle({ onStart: () => this.showSelect() })
  }

  showSelect() {
    this._setScreen('select')
    this.audio.setMusic('menu')
    this.ui.showSelect({
      onConfirm: (choice) => this.startRace(choice),
      onBack: () => this.showTitle(),
    })
  }

  /**
   * Build a full race: track, karts, AI, items, race manager.
   * @param {{characterId?: string, trackId?: string, difficulty?: string, seed?: number}} choice
   */
  startRace(choice = {}) {
    this.ui.showLoading('Starting engines…')
    this._teardownRace()
    this._unloadMenuScene()

    const characterId = choice.characterId ?? CHARACTERS[0].id
    const trackId = choice.trackId ?? TRACKS[0].id
    const difficulty = choice.difficulty ?? DIFFICULTY.NORMAL
    const seed = choice.seed ?? ((Math.random() * 1e9) | 0)
    const rng = mulberry32(seed)

    const track = createTrack(trackId)
    this.scene.add(track.group)
    this._applyEnvironment(track)

    const playerChar = CHARACTERS.find((c) => c.id === characterId) ?? CHARACTERS[0]
    const others = CHARACTERS.filter((c) => c.id !== playerChar.id)
    for (let i = others.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[others[i], others[j]] = [others[j], others[i]]
    }
    const roster = [playerChar, ...others.slice(0, RACER_COUNT - 1)]

    // Player starts near the back of the grid for a proper comeback race.
    const playerSlot = Math.min(RACER_COUNT - 1, track.startGrid.length - 1)
    const karts = []
    const ais = []
    let playerKart = null
    for (let i = 0; i < roster.length; i++) {
      const isPlayer = i === 0
      const slot = isPlayer ? playerSlot : i - 1
      const grid = track.startGrid[slot]
      const kart = new Kart({ character: roster[i], track, isPlayer, index: i, events: this.events })
      kart.reset(grid.position.clone(), grid.heading)
      this.scene.add(kart.object)
      this.fx.attachKart(kart)
      karts.push(kart)
      if (isPlayer) playerKart = kart
      else ais.push(new AIDriver(kart, track, { difficulty, personality: rng(), rng }))
    }

    const items = new ItemSystem({ scene: this.scene, track, karts, events: this.events, rng })
    const manager = new RaceManager({ track, karts, items, events: this.events, playerKart })

    this.race = { track, karts, ais, items, manager, playerKart, difficulty, choice: { characterId, trackId, difficulty, seed }, lapTimes: [], lastLapTime: 0, bestLap: null, finishedHandled: false }
    this._wireRaceEvents()

    this.chaseCam.snap(playerKart)
    this._setScreen('race')
    this.ui.hideLoading()
    this.ui.showHUD()
    this.audio.setMusic('race')
    this.paused = false
  }

  restartRace() {
    if (!this.race) return this.showSelect()
    this.ui.hidePause()
    this.startRace(this.race.choice)
  }

  quitToMenu() {
    this.ui.hidePause()
    this._teardownRace()
    this._loadMenuScene()
    this.showSelect()
  }

  togglePause(force) {
    if (this.screen !== 'race') return
    const next = typeof force === 'boolean' ? force : !this.paused
    if (next === this.paused) return
    this.paused = next
    this.events.emit(EVT.PAUSE, { paused: next })
    if (next) {
      this.ui.showPause({
        onResume: () => this.togglePause(false),
        onRestart: () => this.restartRace(),
        onMenu: () => this.quitToMenu(),
      })
    } else {
      this.ui.hidePause()
    }
  }

  // ───────────────────────────── loop ─────────────────────────────

  _frame(ts) {
    this._raf = requestAnimationFrame((t) => this._frame(t))
    let dt = (ts - this._lastTs) / 1000
    this._lastTs = ts
    if (!(dt > 0)) dt = 1 / 60
    this._fps = this._fps * 0.95 + (1 / dt) * 0.05
    dt = Math.min(dt, MAX_DT)
    this.time += dt

    this.renderer.info.reset()
    try {
      if (this.screen === 'race' && this.race) {
        if (!this.paused) this._updateRace(dt)
      } else {
        this._updateMenu(dt)
      }
      this.fx.update(dt, this.camera)
      this.audio.update(dt)
      this.postfx.render(dt)
    } catch (err) {
      console.error('[game] frame error', err)
    }
  }

  _updateMenu(dt) {
    if (this._menuTrack) {
      this._menuTrack.update(dt, this.time)
      this.chaseCam.cinematic(this._menuTrack, this.time)
    }
    this.postfx.setSpeed(0)
  }

  _updateRace(dt) {
    const r = this.race
    const { manager, karts, ais, items, playerKart, track } = r

    // Input: keyboard/gamepad merged with touch.
    this.input.update(dt)
    const touch = this.ui.getTouchControls()
    const c = playerKart.controls
    const racing = manager.phase !== PHASES.COUNTDOWN
    const src = this.input.controls
    c.throttle = Math.max(src.throttle, touch?.throttle ?? 0)
    c.brake = Math.max(src.brake, touch?.brake ?? 0)
    c.steer = Math.abs(src.steer) >= Math.abs(touch?.steer ?? 0) ? src.steer : touch.steer
    c.hop = src.hop || !!touch?.hop
    c.useItem = src.useItem || !!touch?.useItem
    c.lookBack = src.lookBack || !!touch?.lookBack
    if (this._debugInput) Object.assign(c, this._debugInput)
    if (!racing) {
      // Rev on the line, but don't move.
      c.throttle = 0
      c.brake = 0
      c.hop = false
    }
    if (manager.isControlLocked?.(playerKart)) {
      c.throttle = 0
      c.brake = 0
      c.steer = 0
      c.hop = false
      c.useItem = false
    }
    if (playerKart.state.finished) {
      c.useItem = false
    } else if (c.useItem && racing && !this._itemLatch) {
      items.use(playerKart, { backwards: c.lookBack })
    }
    this._itemLatch = c.useItem

    for (const ai of ais) ai.update(dt, manager)
    if (!racing) {
      for (const k of karts) {
        k.controls.throttle = 0
        k.controls.brake = 0
      }
    }

    track.update(dt, this.time)
    for (const k of karts) k.update(dt)
    resolveKartCollisions(karts)
    items.update(dt, manager)
    manager.update(dt)

    // Engine audio.
    const camPos = this.camera.position
    for (const k of karts) {
      const d = k.position.distanceTo(camPos)
      const gain = k.isPlayer ? 1 : THREE.MathUtils.clamp(1 - d / 45, 0, 0.5)
      const rel = this._tmpV.copy(k.position).sub(camPos).applyQuaternion(this._tmpQ.copy(this.camera.quaternion).invert())
      const pan = k.isPlayer ? 0 : THREE.MathUtils.clamp(rel.x / 20, -1, 1)
      this.audio.setEngine(k.index, { rpm: k.getRpm(), throttle: k.controls.throttle, gain, pan })
    }

    this.chaseCam.update(playerKart, dt)

    const speed01 = THREE.MathUtils.clamp(Math.abs(playerKart.speed) / 40, 0, 1)
    const boost01 = playerKart.state.boostTimer > 0 ? 1 : 0
    this.postfx.setSpeed(Math.max(speed01 * 0.6, boost01))

    this._updateHud()

    if (manager.phase === PHASES.FINISHED && !r.finishedHandled) {
      r.finishedHandled = true
      this._onRaceOver()
    }
  }

  _updateHud() {
    const r = this.race
    const { manager, playerKart, karts, track } = r
    const mm = track.minimap
    this._hudKarts.length = 0
    for (const k of karts) {
      this._hudKarts.push({ x: k.position.x, z: k.position.z, color: k.character.color, isPlayer: k.isPlayer, rank: manager.rankOf(k) })
    }
    this.ui.updateHUD({
      rank: manager.rankOf(playerKart),
      total: karts.length,
      lap: manager.lapOf(playerKart),
      totalLaps: manager.totalLaps,
      speedKmh: playerKart.getSpeedKmh(),
      item: playerKart.item ?? null,
      itemRoulette: playerKart.itemRoulette ?? null,
      time: manager.time,
      driftLevel: playerKart.state.driftLevel,
      boost: playerKart.state.boostTimer > 0 ? Math.min(1, playerKart.state.boostTimer / 1.5) : 0,
      star: playerKart.state.starTimer > 0,
      wrongWay: playerKart.state.wrongWay,
      minimap: { points: mm.points, bounds: mm.bounds, karts: this._hudKarts },
      lapTimes: r.lapTimes,
      bestLap: r.bestLap,
      fps: this._fps,
      phase: manager.phase,
    })
  }

  _onRaceOver() {
    const r = this.race
    this._setScreen('results')
    this.ui.hideHUD()
    const playerResult = r.manager.results.find((x) => x.kart === r.playerKart)
    this.audio.setMusic('results')
    this.audio.play(playerResult && playerResult.rank <= 3 ? 'finish_win' : 'finish_lose')
    const standings = r.manager.results
      .slice()
      .sort((a, b) => a.rank - b.rank)
      .map((x) => ({ name: x.kart.character.name, title: x.kart.character.title, color: x.kart.character.color, time: x.time, isPlayer: x.kart.isPlayer, rank: x.rank }))
    this.ui.showResults({
      standings,
      onRestart: () => this.restartRace(),
      onMenu: () => this.quitToMenu(),
    })
  }

  _wireRaceEvents() {
    this._unwireRaceEvents()
    const offs = []
    const r = this.race
    offs.push(this.events.on(EVT.COUNTDOWN, ({ n }) => this.ui.showCountdown(n)))
    offs.push(this.events.on(EVT.RACE_START, () => this.ui.showCountdown('GO!')))
    offs.push(this.events.on(EVT.LAP, ({ kart, lap, isFinal }) => {
      if (kart !== r.playerKart) return
      const t = r.manager.time
      const lapTime = t - r.lastLapTime
      r.lastLapTime = t
      if (lap > 1) {
        r.lapTimes.push(lapTime)
        if (r.bestLap == null || lapTime < r.bestLap) r.bestLap = lapTime
      }
      if (isFinal) {
        this.ui.flash('FINAL LAP!', { style: 'final' })
        this.audio.setMusic('final')
      } else if (lap > 1) {
        this.ui.flash(`LAP ${lap}`, { style: 'lap' })
      }
    }))
    offs.push(this.events.on(EVT.FINISH, ({ kart, rank }) => {
      if (kart !== r.playerKart) return
      const t = r.manager.time
      const lapTime = t - r.lastLapTime
      r.lapTimes.push(lapTime)
      if (r.bestLap == null || lapTime < r.bestLap) r.bestLap = lapTime
      this.ui.flash(`FINISH! ${ordinal(rank)}`, { style: 'info' })
      this.postfx.setSpeed(0)
    }))
    offs.push(this.events.on(EVT.WRONG_WAY, ({ kart, on }) => {
      if (kart === r.playerKart && on) this.ui.flash('WRONG WAY!', { style: 'wrongway' })
    }))
    this._raceOffs = offs
  }

  _unwireRaceEvents() {
    if (this._raceOffs) for (const off of this._raceOffs) off()
    this._raceOffs = null
  }

  _teardownRace() {
    this._unwireRaceEvents()
    if (!this.race) return
    const r = this.race
    for (const k of r.karts) {
      this.fx.detachKart(k)
      this.scene.remove(k.object)
      k.dispose?.()
    }
    r.items.dispose?.()
    this.scene.remove(r.track.group)
    r.track.dispose?.()
    for (const k of r.karts) this.audio.setEngine(k.index, { rpm: 0, throttle: 0, gain: 0, pan: 0 })
    this.race = null
    this.ui.hideHUD()
  }

  // ───────────────────────────── scene / renderer ─────────────────────────────

  _setupRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.info.autoReset = false
    this.container.appendChild(renderer.domElement)
    this.renderer = renderer
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x87c7ff)
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.3, 900)
    this.camera.position.set(0, 6, -14)
    this._tmpV = new THREE.Vector3()
    this._tmpQ = new THREE.Quaternion()
    this._hudKarts = []
  }

  _resize() {
    const w = window.innerWidth
    const h = window.innerHeight
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h)
    this.postfx.setSize(w, h)
  }

  _applyEnvironment(track) {
    const env = track.environment ?? {}
    this.scene.background = env.background ?? new THREE.Color(0x87c7ff)
    this.scene.fog = env.fog ? new THREE.Fog(env.fog.color, env.fog.near, env.fog.far) : null
  }

  _loadMenuScene() {
    if (this._menuTrack) return
    const id = TRACKS[Math.floor(Math.random() * TRACKS.length)].id
    try {
      this._menuTrack = createTrack(id)
      this.scene.add(this._menuTrack.group)
      this._applyEnvironment(this._menuTrack)
    } catch (err) {
      console.error('[game] menu scene failed', err)
      this._menuTrack = null
    }
  }

  _unloadMenuScene() {
    if (!this._menuTrack) return
    this.scene.remove(this._menuTrack.group)
    this._menuTrack.dispose?.()
    this._menuTrack = null
  }

  _setScreen(name) {
    this.screen = name
    this.events.emit(EVT.SCREEN, { name })
  }

  _onKey(e) {
    if (e.code === 'Escape' || e.code === 'KeyP') {
      if (this.screen === 'race') this.togglePause()
    }
    if (e.code === 'KeyM') this.events.emit(EVT.UI_MUTE_TOGGLE)
  }

  // ───────────────────────────── debug / smoke-test API ─────────────────────────────

  debugApi() {
    const self = this
    return {
      get ready() { return self.ready },
      get screen() { return self.screen },
      get fps() { return self._fps },
      tracks: () => TRACKS.map((t) => t.id),
      characters: () => CHARACTERS.map((c) => c.id),
      startRace: (choice) => self.startRace(choice ?? {}),
      showTitle: () => self.showTitle(),
      showSelect: () => self.showSelect(),
      pause: (v) => self.togglePause(v),
      setInput: (controls) => { self._debugInput = controls || null },
      skipCountdown: () => { if (self.race) self.race.manager.countdown = 0.01 },
      /** Advance the race simulation deterministically without rendering (for headless tests). */
      step: (seconds = 1, dt = 1 / 60) => {
        if (!self.race || self.screen !== 'race') return 0
        const n = Math.max(1, Math.round(seconds / dt))
        const t0 = performance.now()
        for (let i = 0; i < n; i++) {
          if (self.screen !== 'race') break
          self.time += dt
          self._updateRace(dt)
          self.fx.update(dt, self.camera)
        }
        return (performance.now() - t0) / n
      },
      teleport: (t, lateral = 0) => {
        if (!self.race) return
        const p = self.race.track.respawnPoint(t)
        if (lateral) {
          const s = self.race.track.sample(t)
          p.position.addScaledVector(s.right, lateral)
        }
        self.race.playerKart.reset(p.position, p.heading)
      },
      internals: () => self,
      giveItem: (id) => {
        if (!self.race) return
        self.race.playerKart.item = { id, count: 1 }
        self.race.playerKart.itemRoulette = null
      },
      useItem: () => self.race && self.race.items.use(self.race.playerKart, {}),
      finishPlayer: () => {
        if (!self.race) return
        const m = self.race.manager
        m.debugFinish?.(self.race.playerKart)
      },
      state: () => {
        if (!self.race) return { screen: self.screen }
        const r = self.race
        const k = r.playerKart
        return {
          screen: self.screen,
          phase: r.manager.phase,
          countdown: r.manager.countdown,
          time: r.manager.time,
          rank: r.manager.rankOf(k),
          lap: r.manager.lapOf(k),
          totalLaps: r.manager.totalLaps,
          progress: k.progress,
          pos: { x: +k.position.x.toFixed(2), y: +k.position.y.toFixed(2), z: +k.position.z.toFixed(2) },
          heading: k.heading,
          speed: k.speed,
          kmh: k.getSpeedKmh(),
          surface: k.surface?.type,
          state: { ...k.state },
          item: k.item ?? null,
          results: r.manager.results.map((x) => ({ name: x.kart.character.name, rank: x.rank, time: x.time, isPlayer: x.kart.isPlayer })),
          karts: r.karts.map((x) => ({ name: x.character.name, rank: r.manager.rankOf(x), lap: r.manager.lapOf(x), progress: +x.progress.toFixed(3), speed: +x.speed.toFixed(1), surface: x.surface?.type })),
          drawCalls: self.renderer.info.render.calls,
          triangles: self.renderer.info.render.triangles,
        }
      },
    }
  }
}

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export { KART_RADIUS }
