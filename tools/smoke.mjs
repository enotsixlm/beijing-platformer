// Headless smoke test: boots the game, runs races through the debug API and checks the core loop.
// Gameplay is advanced with the deterministic `step(seconds)` hook so results don't depend on the
// (very slow) software-rendered frame rate.
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { startVite, launchBrowser } from './browser.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const PORT = 5211

const failures = []
const pass = (name) => console.log('  PASS', name)
const fail = (name, detail) => { failures.push(name); console.log('  FAIL', name, detail ?? '') }
const check = (cond, name, detail) => (cond ? pass(name) : fail(name, detail))

const vite = await startVite(root, PORT)
const browser = await launchBrowser()

try {
  const page = await browser.newPage({ viewport: { width: 960, height: 540 } })
  const pageErrors = []
  page.on('pageerror', (e) => pageErrors.push(String(e)))
  page.on('console', (m) => { if (m.type() === 'error') pageErrors.push(m.text()) })

  await page.goto(`http://localhost:${PORT}/`)
  await page.waitForFunction('window.__game && window.__game.ready', null, { timeout: 60000 })
  pass('page loads, game ready')

  const S = () => page.evaluate('window.__game.state()')
  const sleep = (ms) => page.waitForTimeout(ms)
  const setInput = (o) => page.evaluate(`window.__game.setInput(${JSON.stringify(o)})`)
  const step = (sec) => page.evaluate(`window.__game.step(${sec})`)
  const wrapDist = (a, b) => ((b - a) % 1 + 1) % 1

  const tracks = await page.evaluate('window.__game.tracks()')
  const chars = await page.evaluate('window.__game.characters()')
  check(tracks.length >= 3, `3+ tracks (${tracks.join(', ')})`)
  check(chars.length === 8, `8 characters (${chars.join(', ')})`)

  check((await S()).screen === 'title', 'title screen shown')
  await page.keyboard.press('Enter')
  await sleep(600)
  check((await S()).screen === 'select', 'select screen after key press')

  let ci = 0
  for (const trackId of tracks) {
    console.log(`\n== Track ${trackId}`)
    const characterId = chars[ci++ % chars.length]
    await page.evaluate(`window.__game.startRace({ characterId: '${characterId}', trackId: '${trackId}', difficulty: 'normal', seed: 7 })`)
    await sleep(700)
    let s = await S()
    check(s.screen === 'race' && s.phase === 'countdown', 'race starts in countdown', s.phase)
    check(s.surface === 'road', 'player spawns on road', s.surface)
    check(s.drawCalls > 20 && s.drawCalls < 700, `draw calls bounded (${s.drawCalls})`)
    check(s.karts.every((k) => k.surface === 'road'), 'all karts on road at grid', JSON.stringify(s.karts.map((k) => k.surface)))

    // Countdown must hold karts still.
    await setInput({ throttle: 1, steer: 0 })
    await step(2)
    s = await S()
    check(s.phase === 'countdown' && Math.abs(s.speed) < 0.5, 'karts frozen during countdown', JSON.stringify({ phase: s.phase, speed: s.speed }))
    await step(2.5)
    s = await S()
    check(s.phase === 'racing', 'countdown reaches racing', s.phase)

    // Drive forward with full throttle.
    const p0 = s.progress
    const msPerStep = await step(3)
    s = await S()
    check(s.speed > 20, `kart accelerates (speed ${s.speed.toFixed(1)} m/s, ${s.kmh.toFixed(0)} km/h)`)
    check(wrapDist(p0, s.progress) > 0.02, `progress advances (${p0.toFixed(3)} → ${s.progress.toFixed(3)})`)
    check(s.pos.y > -5 && s.pos.y < 60, `kart y sane (${s.pos.y})`)
    check(msPerStep < 8, `sim step cost ok (${msPerStep.toFixed(2)} ms / 60Hz step incl. fx)`)
    const aiMoving = s.karts.filter((k) => k.speed > 8).length
    check(aiMoving >= 7, `karts moving (${aiMoving}/8)`)

    // Teleport near the end and cross the line; no checkpoints → no lap credit.
    await setInput({ throttle: 0, steer: 0 })
    await page.evaluate('window.__game.teleport(0.97)')
    await step(0.2)
    const lapBefore = (await S()).lap
    check(lapBefore === 1, 'still on lap 1 before line test')
    await setInput({ throttle: 1, steer: 0 })
    await step(3)
    s = await S()
    await setInput({ throttle: 0, steer: 0 })
    check(s.progress < 0.5, `progress wrapped past finish (${s.progress.toFixed(3)})`)
    check(s.lap === lapBefore, `no lap credited without checkpoints (lap ${s.lap})`)

    // Drift: start from the left edge of the road so a right-hand drift has room before the wall.
    await setInput({ throttle: 0, steer: 0 })
    // Find a straight stretch with no boost pads so the drift can run its course.
    const straightT = await page.evaluate(`(() => {
      const g = window.__game.internals(); const track = g.race.track
      let best = { t: 0.05, score: Infinity }
      for (let t = 0.02; t < 0.9; t += 0.005) {
        const a = track.sample(t), b = track.sample(t + 60 / track.length), c = track.sample(t + 130 / track.length)
        let turn = Math.atan2(a.tangent.x, a.tangent.z) - Math.atan2(c.tangent.x, c.tangent.z)
        turn = Math.abs(Math.atan2(Math.sin(turn), Math.cos(turn)))
        const padNear = track.boostPads.some((p) => p.position.distanceTo(b.position) < 90)
        const hazardNear = track.hazards.some((h) => h.position.distanceTo(b.position) < 70)
        const score = turn + (padNear ? 10 : 0) + (hazardNear ? 10 : 0)
        if (score < best.score) best = { t, score }
      }
      return best.t
    })()`)
    await page.evaluate(`(() => { const track = window.__game.internals().race.track; const hw = track.sample(${straightT} + 40 / track.length).halfWidth; window.__game.teleport(${straightT}, -(hw - 1.2)) })()`)
    await setInput({ throttle: 1, steer: 0 })
    await step(1.8)
    s = await S()
    check(s.surface === 'road' && s.speed > 20, `on road at speed before drift (${s.surface}, ${s.speed.toFixed(1)} m/s, t=${straightT})`)
    await setInput({ throttle: 1, steer: 0.4, hop: true })
    await step(0.5)
    s = await S()
    check(s.state.drifting, 'drift engages with hop+steer', JSON.stringify(s.state))
    await setInput({ throttle: 1, steer: 0, hop: true }) // neutral drift keeps a wide arc
    await step(0.5)
    s = await S()
    check(s.state.drifting && s.state.driftLevel >= 1, `drift charges to level ${s.state.driftLevel}`, JSON.stringify(s.state))
    const lvl = s.state.driftLevel
    await setInput({ throttle: 1, steer: 0, hop: false })
    await step(0.2)
    s = await S()
    check(s.state.boostTimer > 0, `drift release (level ${lvl}) yields mini-turbo`, JSON.stringify({ boost: s.state.boostTimer, speed: s.speed }))
    await step(1.5)

    // Settle on the centre line before item tests.
    await setInput({ throttle: 0, steer: 0 })
    await page.evaluate(`window.__game.teleport(${straightT})`)
    await setInput({ throttle: 1, steer: 0 })
    await step(2)


    // Items: give mushroom and use it.
    await page.evaluate("window.__game.giveItem('mushroom')")
    await step(0.5)
    const sp = (await S()).speed
    await page.evaluate('window.__game.useItem()')
    await step(0.3)
    s = await S()
    check(s.state.boostTimer > 0 || s.speed > sp + 2, 'mushroom boosts', JSON.stringify({ before: sp, after: s.speed, boost: s.state.boostTimer }))
    check(s.item === null, 'item consumed after use', JSON.stringify(s.item))

    // Every item can be used without breaking the race.
    for (const id of ['green_shell', 'red_shell', 'banana', 'bob_omb', 'lightning', 'star', 'triple_mushroom', 'triple_banana', 'triple_green', 'fake_box']) {
      await page.evaluate(`window.__game.giveItem('${id}')`)
      await page.evaluate('window.__game.useItem()')
      await step(0.4)
    }
    s = await S()
    check(s.state.starTimer > 0 || s.state.starTimer === 0, 'star state readable')
    await step(4)
    s = await S()
    check(s.screen === 'race', 'race still running after using all items')

    // Let the race run for a while: AI should progress and nobody should be stuck.
    await setInput({ throttle: 1, steer: 0 })
    await step(20)
    s = await S()
    const stuck = s.karts.filter((k) => k.progress < 0.02 && k.lap === 1 && k.speed < 3)
    check(stuck.length === 0, 'no AI stuck at start', JSON.stringify(stuck))
    const leader = s.karts.slice().sort((a, b) => a.rank - b.rank)[0]
    check(leader.rank === 1 && (leader.lap > 1 || leader.progress > 0.25), `leader is progressing (${leader.name} lap ${leader.lap} t=${leader.progress})`)
    check(s.rank >= 1 && s.rank <= 8, `player rank in range (${s.rank})`)

    // Finish the race via debug hook → results screen.
    await page.evaluate('window.__game.finishPlayer()')
    await step(9)
    await sleep(400)
    s = await S()
    check(s.screen === 'results', 'results screen after finish', s.screen)
    check(s.results.length === 8, `results for all 8 karts (${s.results.length})`)
    check(s.results.some((r) => r.isPlayer), 'player in results')
    check(new Set(s.results.map((r) => r.rank)).size === 8, 'ranks unique')
    const resultsVisible = await page.evaluate('document.body.innerText.toLowerCase().includes("race again")')
    check(resultsVisible, 'results UI visible')
  }

  // Menu return
  await page.evaluate('window.__game.showSelect()')
  await sleep(500)
  check((await S()).screen === 'select', 'back to select')

  // Full AI race to completion on easy: does the race end by itself?
  console.log('\n== Full race (player idle, hard AI)')
  await page.evaluate(`window.__game.startRace({ trackId: '${tracks[0]}', difficulty: 'hard', seed: 3 })`)
  await sleep(500)
  await setInput({ throttle: 1, steer: 0 })
  // Player drives full throttle without steering: it'll hit walls but keep moving; give the race up to 5 sim minutes.
  let done = false
  for (let i = 0; i < 30; i++) {
    await step(10)
    const st = await S()
    if (st.screen === 'results') { done = true; break }
  }
  const fin = await S()
  check(fin.screen === 'results' || fin.results.length >= 7, `race completes on its own (screen ${fin.screen}, ${fin.results.length} finishers)`)
  if (!done) console.log('    karts:', JSON.stringify(fin.karts))

  // Pause in a race
  await page.evaluate(`window.__game.startRace({ trackId: '${tracks[1]}', seed: 3 })`)
  await sleep(500)
  await page.keyboard.press('Escape')
  await sleep(300)
  const paused = await page.evaluate('document.body.innerText.toLowerCase().includes("paused")')
  check(paused, 'pause overlay visible after Escape')
  await page.keyboard.press('Escape')
  await sleep(300)

  const fps = await page.evaluate('window.__game.fps')
  console.log(`\nfps (headless swiftshader, indicative only): ${fps.toFixed(1)}`)

  const realErrors = pageErrors.filter((e) => !/WebGL|GPU|swiftshader|AudioContext|Autoplay|favicon|fonts.googleapis|fonts.gstatic|net::ERR/i.test(e))
  check(realErrors.length === 0, 'no page errors', realErrors.slice(0, 5).join('\n'))
} catch (err) {
  fail('exception', err?.stack || String(err))
} finally {
  await browser.close()
  vite.kill()
}

console.log(failures.length ? `\n${failures.length} failure(s): ${failures.join('; ')}` : '\nAll checks passed')
process.exit(failures.length ? 1 : 0)
