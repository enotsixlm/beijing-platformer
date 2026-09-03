# Turbo Kart Legends

A Mario Kart–style arcade racer built with **three.js** and **Vite**. Everything — tracks, karts,
characters, items, UI, particles, music and sound effects — is generated procedurally in code;
there are no external asset files.

![title](shots/0-title.png)

## Features

- 8 original racers with distinct stats (speed / acceleration / handling / weight) and procedural models
- 3 themed circuits: **Sunshine Speedway**, **Magma Fortress**, **Neon Skyline** — each with hazards, boost pads, item boxes and lap checkpoints
- Arcade kart physics: hop-to-drift with 3-level mini-turbos, boosts, off-road slowdown, wall bounces, spin-outs, kart-to-kart collisions
- Full item roster: Mushroom, Triple Mushroom, Banana, Triple Banana, Green Shell (bounces), Triple Green, Red Shell (homing), Super Star, Lightning, Bob-omb, Fake Item Box — rank-weighted roulette
- 7 AI opponents with racing lines, drifting, obstacle avoidance, item tactics and subtle rubber-banding (Easy / Normal / Hard)
- Console-style UI: animated title, character & track select, HUD with position, laps, timer, item slot, radial speedometer and live minimap, countdown, results podium, pause menu, touch controls
- Procedural WebAudio: per-kart engine synths, sequenced chiptune music (menu / race / final lap / results) and 30+ sound effects
- VFX: pooled particle sparks, boost flames, dust, skid marks, explosions, confetti, star aura; bloom + speed-blur + vignette post-processing

## Controls

| Action | Keyboard | Gamepad |
|---|---|---|
| Accelerate / Brake | W / S or ↑ / ↓ | RT / LT |
| Steer | A / D or ← / → | Left stick |
| Hop / Drift | Space (hold while steering) | A |
| Use item | E / Shift / Ctrl | X / LB |
| Look back | Q | RB |
| Pause | Esc / P | — |
| Mute | M | — |

Touch devices get on-screen controls automatically.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production bundle in dist/
npm run smoke      # headless end-to-end test (needs Chrome)
npm run shots      # regenerate screenshots into shots/
```

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md). The code is split into independent modules that talk through
a small set of interfaces and an event bus:

```
src/game.js   orchestrator (loop, screens, wiring)
src/track/    circuits, scenery, surface queries
src/kart/     physics, kart models, input, chase camera
src/race/     AI drivers, race manager, items & projectiles
src/ui/       menus, HUD, results, touch controls
src/audio/    procedural music, engine and SFX synthesis
src/fx/       particles, skid marks, post-processing
```
