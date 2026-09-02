# TURBO KART LEGENDS — Architecture & Module Contracts

A AAA-feel arcade kart racer (Mario Kart style) built with **three.js r169 + Vite**, no external
assets: every model, texture, sound and UI element is procedurally generated in code.

Five modules are developed in parallel by separate engineers. **Each module owns exactly one
directory** and must only edit files inside it. Everything talks through the interfaces below.
`src/game.js` (the orchestrator) wires the modules together and is the only consumer of them.

```
src/
  main.js            orchestrator bootstrap                   (orchestrator)
  game.js            game loop, race setup, module wiring     (orchestrator)
  core/              shared constants, EventBus, toon helpers (orchestrator; read-only for modules)
  track/             Module 1 — tracks, scenery, surface queries
  kart/              Module 2 — kart physics, kart models, input, chase camera
  race/              Module 3 — AI drivers, race manager, items & projectiles
  ui/                Module 4 — title, selection, HUD, minimap, results, pause, touch controls
  audio/             Module 5a — procedural WebAudio engine/music/sfx
  fx/                Module 5b — particles, skid marks, post-processing
```

## Conventions

* Units are **metres**, Y is up, `dt` is seconds (already clamped to ≤ 1/30 by the orchestrator).
* **Heading**: a kart's yaw in radians. `forward = (sin(heading), 0, cos(heading))`,
  `right = (cos(heading), 0, -sin(heading))`. A kart model's nose points to local **+Z** so that
  `object.rotation.y = heading` makes it face `forward`.
* Track direction of travel = increasing spline parameter `t ∈ [0,1)`. Right-hand side of the road is
  `right = cross(tangent, up)` i.e. `(tangent.z, 0, -tangent.x)` normalised.
* Karts are ~1.6 m wide, ~2.2 m long, collision radius **0.9 m**. Road half-width is ~7 m.
  Top speed of a mid kart ≈ 32 m/s; displayed km/h = m/s × 3.6 × 1.6 (arcade fudge).
* Look: bright, saturated, toon-shaded (`MeshToonMaterial` / flat-shaded `MeshStandardMaterial`),
  chunky geometry, procedural `CanvasTexture`s. Shadows enabled on the renderer
  (`PCFSoftShadowMap`); the track's sun light casts shadows, karts cast & receive.
* Performance target: 60 fps on a laptop iGPU with 8 karts. Reuse geometries/materials, use
  `InstancedMesh` for repeated scenery, keep draw calls < ~400.
* No network requests, no external asset files. Fonts: system stack or a single Google Fonts `<link>`
  in `index.html` (UI module).
* ES modules, no TypeScript, no semicolons-or-not preference; keep code readable with short doc
  comments on public methods.
* Use `import * as THREE from 'three'` and `three/examples/jsm/...` freely.

## `src/core/` (shared, read-only for modules)

* `constants.js` — `ITEMS`, `PHASES`, `SURFACE`, `RACER_COUNT`, `KART_RADIUS`, etc. See file.
* `events.js` — `EventBus` (`on`, `off`, `emit`). One instance is created by the orchestrator and
  passed to every module that needs it. **Event catalogue is in `constants.js` (`EVT`).**
* `toon.js` — `makeToonMaterial(color, opts)`, `gradientMap`, `canvasTexture(w,h,drawFn)`.
* `rng.js` — `mulberry32(seed)` deterministic PRNG.

---

## Module 1 — `src/track/` — Tracks

```js
export const TRACKS = [
  { id: 'sunshine', name: 'Sunshine Speedway', laps: 3, difficulty: 1, blurb: '...', accent: '#hex' },
  { id: 'lava',     name: 'Magma Fortress',    laps: 3, difficulty: 2, ... },
  { id: 'neon',     name: 'Neon Skyline',      laps: 3, difficulty: 3, ... },
]
export function createTrack(id) : Track
```

`Track` instance:

| member | description |
|---|---|
| `id`, `name`, `laps` | from TRACKS |
| `group: THREE.Group` | everything visual incl. lights (a `DirectionalLight` sun with shadows, an ambient/hemisphere light). Orchestrator adds it to the scene. |
| `environment` | `{ background: THREE.Color, fog: { color: THREE.Color, near, far } \| null }` |
| `spline: THREE.CatmullRomCurve3` | closed centreline (`closed = true`), y = road height |
| `length: number` | spline length in metres (900–1400) |
| `startGrid: Array<{ position: Vector3, heading: number }>` | 8 slots, 2 columns × 4 rows, staggered, behind the start line, facing direction of travel. Slot 0 is pole. |
| `itemBoxes: Array<{ position: Vector3 }>` | 4–6 rows of 3–5 boxes each. Y is road height + 1.0. |
| `boostPads: Array<{ position: Vector3, heading: number, halfLength, halfWidth }>` | visual pads are drawn by the track; surface query returns `SURFACE.BOOST` inside them |
| `hazards: Array<{ position: Vector3, radius: number, kind: string, active: boolean }>` | moving/animated obstacles; `position`/`active` updated in `update()`. Colliding karts get `kart.hit('hazard')`. Optional but each track should have at least one kind (e.g. rolling boulders, crushers, traffic). |
| `getSurfaceAt(position: Vector3, hintT?: number) : SurfaceInfo` | see below. Must be fast (called ~200×/frame). Use `hintT` (previous t) to search locally; full search only when hint missing or the local search fails. |
| `sample(t) : { position: Vector3, tangent: Vector3, right: Vector3, halfWidth: number, wallHalfWidth: number }` | for AI racing line and respawns |
| `respawnPoint(t) : { position: Vector3, heading: number }` | centre of road at `t`, 0.5 m up |
| `checkpointCount: number` | ≥ 3; checkpoint `i` is at `t = i / checkpointCount` |
| `minimap : { points: Array<{x: number, z: number}>, bounds: { minX, maxX, minZ, maxZ } }` | ~120 centreline points in world XZ |
| `update(dt: number, time: number)` | animate scenery/hazards |
| `dispose()` | free geometries/materials |

```js
SurfaceInfo = {
  t: number,          // nearest spline parameter
  height: number,     // road surface y at this XZ (extrapolated when off road)
  lateral: number,    // signed distance from centreline, +right
  halfWidth: number,  // road half width here (~6–8)
  wallHalfWidth: number, // where the wall is (halfWidth + 3..6). |lateral| >= wallHalfWidth => wall
  type: SURFACE.ROAD | SURFACE.OFFROAD | SURFACE.BOOST | SURFACE.VOID,
  tangent: Vector3, right: Vector3,   // at t
}
```
`SURFACE.VOID` = a pit (e.g. lava / water gap). Karts on VOID are respawned by the race manager.
Every track must have: a start/finish gate, item box rows, at least 2 boost pads, one hazard type,
abundant themed scenery (buildings/trees/lava/crowd stands with animated flags), a sky (large
gradient sphere or `scene.background` colour + fog). Roads use `ExtrudeGeometry` / ribbon strips
along the spline with curbs (red/white) and a dashed centre line texture. Include gentle elevation
changes (spline y varies ±6 m) and banking is NOT required.

Also export a headless-friendly `getTrackList()` = `TRACKS`.

---

## Module 2 — `src/kart/` — Kart physics, models, input, camera

```js
export const CHARACTERS = [ // 8 original mascots, not Nintendo IP
  { id: 'bao',   name: 'Bao',   title: 'Panda', color: '#hex', stats: { speed: 3, accel: 3, handling: 3, weight: 3 } },
  ... 8 total, stats 1–5 with variety (light/quick vs heavy/fast)
]
export class Kart {
  constructor({ character, track, isPlayer, index, events })
  object: THREE.Group        // add to scene; includes wheels, body, driver figure, spoiler etc.
  character, isPlayer, index, track, events   // stored from constructor
  item: null | { id: string, count: number }   // OWNED/WRITTEN by ItemSystem, kart only initialises to null
  itemRoulette: null | number                  // 0..1 while the item roulette spins (ItemSystem writes)
  position: Vector3 (alias of object.position), heading: number, velocity: Vector3
  speed: number              // signed forward speed m/s
  maxSpeed: number           // current cap incl. boosts
  controls: { throttle: 0..1, brake: 0..1, steer: -1..1, hop: boolean, useItem: boolean, lookBack: boolean }
  surface: SurfaceInfo       // last surface query
  progress: number           // spline t (0..1)
  state: {
    drifting: boolean, driftDir: -1|0|1, driftCharge: number /*0..1*/, driftLevel: 0|1|2|3,
    boostTimer: number, boostStrength: number,
    airborne: boolean, hopTimer: number,
    spinTimer: number,  // > 0 while spun out (banana / shell)
    stunTimer: number,  // > 0 while squashed/stunned (lightning)
    starTimer: number,  // invincible
    shrunk: boolean,
    finished: boolean,  // race manager sets; kart auto-drives gently
    wrongWay: boolean,
  }
  update(dt)                 // physics: accel/brake/steer/drift/hop/mini-turbo, surface & wall response
  applyBoost(strength /*m/s added to cap, e.g. 8..14*/, duration /*s*/)
  hit(kind /* 'banana'|'shell'|'hazard'|'lightning'|'explosion' */)   // spin/stun unless starTimer > 0 → ignored
  setStar(duration)          // invincible + speed boost + rainbow tint
  shrink(duration)           // lightning effect: scale 0.6, slow
  reset(position, heading)   // teleport & zero velocity
  bump(impulse: Vector3)     // from kart-kart collisions
  getSpeedKmh(): number
  getRpm(): number           // 0..1 for audio
  dispose()
}
export function resolveKartCollisions(karts: Kart[])  // pairwise circle collisions, weight-aware push, calls bump()
export class PlayerInput { update(dt); controls /* same shape as kart.controls */ ; dispose() }  // keyboard (WASD/arrows, Space=hop/drift, Shift/Ctrl/E=item, Q/Down=look back, Esc/P handled by orchestrator) + Gamepad API (left stick / RT / LT / A=hop / X or LB=item)
export class ChaseCamera {
  constructor(camera: THREE.PerspectiveCamera)
  update(kart: Kart, dt)     // smooth follow, FOV widens with speed/boost, look-back when kart.controls.lookBack, gentle shake on hit
  snap(kart)                 // immediate placement (race start)
  cinematic(track, time)     // orbiting camera for the title/menu (returns nothing, positions camera)
}
```

Physics feel (target): accel 0→top in ~3 s; braking strong; steering rate scales inversely with
speed; **drift**: hold `hop` while steering → hop then drift; drift accumulates `driftCharge` →
levels 1/2/3 (blue/orange/purple sparks, thresholds ~0.35/0.7/1.0 of charge); releasing gives a
mini-turbo boost proportional to level. Off-road halves top speed unless boosting/star. Walls:
push out along `right`, kill lateral velocity, lose ~30 % speed, small bounce. Spin-out: 1.2 s
rotation, speed decays. Stun (lightning): shrink + slow. Karts tilt/lean into turns, wheels spin
and steer, driver head bobs. Kart weight influences collision push.

Events emitted (`events.emit(EVT.X, { kart, ... })`): `DRIFT_START`, `DRIFT_LEVEL` ({level}),
`DRIFT_END` ({level}), `BOOST`, `HOP`, `LAND`, `HIT` ({kind}), `WALL_HIT`, `OFFROAD_ENTER`,
`OFFROAD_EXIT`, `KART_BUMP` ({a, b, force}).

---

## Module 3 — `src/race/` — AI, race manager, items

```js
export class AIDriver {
  constructor(kart, track, { difficulty: 'easy'|'normal'|'hard', personality: number /*0..1*/, rng })
  update(dt, race: RaceManager)   // writes kart.controls; uses items via race.items.use(kart)
}
```
AI: follow a racing line (spline centre + lateral offset per personality, cut corners using
look-ahead), steer with a PID-ish controller, drift on sustained turns, avoid hazards/bananas/shells
by looking at `race.items.getObstacles()`, use boost pads, **rubber-banding** toward the player
(slower when far ahead, faster when far behind, subtle on `easy`, minimal on `hard`), throw shells
when a target is ahead, drop bananas when a kart is close behind, recover from wall hits and
wrong-way by reversing briefly.

```js
export class ItemSystem {
  constructor({ scene, track, karts, events, rng })
  update(dt, race)
  getObstacles(): Array<{ position: Vector3, radius: number, kind: string }>   // bananas, shells, fake boxes
  giveRandom(kart, rank, total)          // rank-weighted roulette; sets kart.item = {id, count} after ~1.2 s roulette (kart.itemRoulette 0..1 while rolling)
  use(kart, { backwards?: boolean })     // fires kart.item; returns true if used
  hasItem(kart): boolean
  dispose()
}
```
Items (see `ITEMS` in constants): `mushroom` (boost 1×), `triple_mushroom` (3 charges),
`banana` (drop behind / throw forward), `triple_banana`, `green_shell` (straight, bounces off
walls up to 3×), `red_shell` (homing on next kart ahead), `triple_green`, `star` (10 s
invincibility), `lightning` (all others spin/shrink; leader loses item), `bob_omb` (throw, 2 s fuse,
4 m explosion radius), `fake_box` (looks like item box, spins out). Item boxes: spinning
translucent rainbow cubes with a `?` at `track.itemBoxes`, picked up on contact (radius 1.4),
respawn after 3 s (scale-in animation). Distribution: front-runners get bananas/greens, back-runners
get stars/lightning/bob-ombs/triples. Karts with `starTimer > 0` are immune and destroy shells on
contact. Shells/bananas hitting a kart call `kart.hit(kind)` and emit `EVT.ITEM_HIT`.
Projectiles follow the road height (`track.getSurfaceAt`), despawn on VOID.

```js
export class RaceManager {
  constructor({ track, karts, items, events, playerKart })
  phase: PHASES.COUNTDOWN | PHASES.RACING | PHASES.FINISHED
  countdown: number          // 3.99 → 0 seconds; emits EVT.COUNTDOWN {n: 3|2|1} and EVT.RACE_START
  time: number               // race clock (s) since GO
  totalLaps: number
  update(dt)                 // lap counting (checkpoint gated, robust to reversing), positions, VOID respawn, hazard collision, finish detection, AI auto-drive for finished karts, item box pickup via items
  standings(): Array<Kart>   // sorted by rank (lap, checkpoint, t, then finish time)
  rankOf(kart): number       // 1-based
  lapOf(kart): number        // 1-based current lap (capped at totalLaps)
  progressOf(kart): number   // 0..1 overall race progress
  results: Array<{ kart, time: number, rank: number }>   // filled as karts finish; AI that hasn't finished when player finishes gets estimated times after ~8 s
  isPlayerFinished(): boolean
  debugFinish(kart)          // test hook: immediately mark kart as finished with current time
}
```
Phase transitions: `COUNTDOWN` (3.99 s; karts frozen by orchestrator) → `RACING` → `FINISHED`
(when the player has finished and either all karts finished or ~8 s passed). `phase === FINISHED`
must set `results` for **all** karts. Emit `EVT.RACE_OVER` once.
```js
```
Events: `COUNTDOWN {n}`, `RACE_START`, `LAP {kart, lap, isFinal}`, `FINISH {kart, rank, time}`,
`RACE_OVER`, `POSITION_CHANGE {kart, rank, prev}` (player only), `RESPAWN {kart}`,
`ITEM_PICKUP {kart, item}`, `ITEM_USE {kart, item}`, `ITEM_HIT {kart, item}`, `WRONG_WAY {kart, on}`.

---

## Module 4 — `src/ui/` — UI

```js
export class UI {
  constructor({ root: HTMLElement, characters, tracks, events })
  // screens (only one visible at a time; use CSS transitions, animated title logo, parallax bg)
  showTitle({ onStart })                                   // "press any key / tap"
  showSelect({ onConfirm({ characterId, trackId, difficulty }), onBack })   // grid of characters w/ stat bars, track cards, difficulty (easy/normal/hard); keyboard+mouse+touch navigable
  showLoading(text); hideLoading()
  showHUD(); hideHUD()
  updateHUD(h)   // see HudState; call every frame (cheap: only touch DOM when values change)
  showCountdown(n)     // 3, 2, 1, 'GO!' — big animated
  flash(text, { style: 'lap'|'final'|'wrongway'|'info' })   // big centre message, auto-hide
  showResults({ standings: [{ name, title, color, time, isPlayer, rank }], onRestart, onMenu })   // podium animation + table
  showPause({ onResume, onRestart, onMenu }); hidePause()
  getTouchControls(): null | { steer: -1..1, throttle: 0..1, brake: 0..1, hop: boolean, useItem: boolean, lookBack: boolean }   // on-screen controls when a touch device is detected
  setMuted(bool)   // mute button state, emits EVT.UI_MUTE_TOGGLE
  dispose()
}
HudState = {
  rank, total, lap, totalLaps, speedKmh, item: null | { id, count }, itemRoulette: null | 0..1,
  time /*s*/, driftLevel: 0..3, boost: 0..1, star: boolean, wrongWay: boolean,
  minimap: { points, bounds, karts: [{ x, z, color, isPlayer, rank }] },
  lapTimes: number[], bestLap: number|null, fps: number
}
```
Also export `formatTime(seconds) -> "m:ss.mmm"`. Item icons are inline SVG or emoji-free CSS art
(canvas) keyed by item id; the HUD item slot animates the roulette by cycling icons. Position badge
uses ordinal ("1st" … "8th") with a colour ramp. Speedometer is a radial gauge (canvas or SVG).
Minimap is a canvas: track polyline + kart dots. All text in English. Use bold display typography
(e.g. a Google Font like "Luckiest Guy"/"Bangers" + fallbacks) and a warm playful palette.
The UI module **owns `index.html`** (keep `<div id="game"></div>`, `<div id="ui"></div>` and
`<script type="module" src="/src/main.js"></script>`; put CSS in `src/ui/ui.css` imported from
`src/ui/index.js`).

---

## Module 5 — `src/audio/` and `src/fx/`

```js
export class AudioManager {
  constructor({ events })
  unlock()                   // create/resume AudioContext on first user gesture (orchestrator calls)
  setMusic(track: 'menu'|'race'|'final'|'results'|null)  // procedural sequenced chiptune/synth loops, crossfade; 'final' = faster tempo variant
  setEngine(id, { rpm: 0..1, throttle: 0..1, gain: 0..1, pan: -1..1 })   // per-kart engine synth (player loudest); create lazily; ids are kart.index
  play(sfx, opts?)           // 'hop','land','drift','drift_level','boost','item_pickup','item_use','roulette_tick','shell_throw','shell_bounce','shell_hit','banana_slip','explosion','star','lightning','hit_wall','bump','countdown','go','lap','final_lap','finish_win','finish_lose','menu_move','menu_select','menu_back','respawn','offroad'
  setMuted(bool); muted
  update(dt)
}
```
Audio subscribes itself to `events` (EVT.*) so the orchestrator needn't glue every sound; the
orchestrator still calls `setEngine` per kart and `setMusic`.

```js
export class FXSystem {
  constructor({ scene, events })
  update(dt, camera)
  attachKart(kart)           // exhaust smoke, drift sparks at rear wheels, boost flames, star aura — driven from kart.state each frame
  detachKart(kart)
  burst(position, { color, count, speed, size, life })   // generic particle burst
  explosion(position)        // bob-omb
  hitSpark(position)         // shell impact
  bananaSplat(position)
  lightningFlash()           // full-screen flash + sky bolt sprites
  confetti(position)         // finish
  skidMark(position, heading, intensity)   // decal ribbon on the road
  dispose()
}
export function createPostFX(renderer, scene, camera) : { render(dt), setSize(w, h), setSpeed(0..1), setEnabled(bool) }
```
FX: use a pooled `Points`/instanced sprite particle system with additive materials; skid marks as
ring-buffered `BufferGeometry` strips. Post FX: `EffectComposer` with `RenderPass`, subtle
`UnrealBloomPass`, and a custom `ShaderPass` doing vignette + radial speed blur/chromatic streaks
scaled by `setSpeed`. Must gracefully fall back to plain render if WebGL2 float targets are
unavailable. FX subscribes to `events` for item/hit/finish bursts.

---

## Orchestrator (`src/game.js`) responsibilities (for reference)

Renderer/scene/camera setup, resize, RAF loop with fixed-ish dt clamp, screen flow
(title → select → race → results), race setup (track, 8 karts, AI for 7, item system, race manager,
FX attach, engine audio), input merge (keyboard/gamepad from `PlayerInput`, touch from `UI`),
pause (Esc/P), music state changes, `window.__game` debug hooks for headless smoke tests.
