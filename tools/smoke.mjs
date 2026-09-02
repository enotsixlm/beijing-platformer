// Headless smoke test: boots the game, runs a race with the debug API and checks the core loop.
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
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
  const pageErrors = []
  page.on('pageerror', (e) => pageErrors.push(String(e)))
  page.on('console', (m) => { if (m.type() === 'error') pageErrors.push(m.text()) })

  await page.goto(`http://localhost:${PORT}/`)
  await page.waitForFunction('window.__game && window.__game.ready', null, { timeout: 60000 })
  pass('page loads, game ready')

  const S = () => page.evaluate('window.__game.state()')
  const sleep = (ms) => page.waitForTimeout(ms)
  const setInput = (o) => page.evaluate(`window.__game.setInput(${JSON.stringify(o)})`)

  const tracks = await page.evaluate('window.__game.tracks()')
  const chars = await page.evaluate('window.__game.characters()')
  check(tracks.length >= 3, `3+ tracks (${tracks.join(', ')})`)
  check(chars.length === 8, `8 characters (${chars.join(', ')})`)

  // Title → select via keyboard
  check((await S()).screen === 'title', 'title screen shown')
  await page.keyboard.press('Enter')
  await sleep(600)
  check((await S()).screen === 'select', 'select screen after key press')

  for (const trackId of tracks) {
    console.log(`\n== Track ${trackId}`)
    await page.evaluate(`window.__game.startRace({ characterId: '${chars[0]}', trackId: '${trackId}', difficulty: 'normal', seed: 7 })`)
    await sleep(800)
    let s = await S()
    check(s.screen === 'race' && s.phase === 'countdown', 'race starts in countdown', s.phase)
    check(s.surface === 'road', 'player spawns on road', s.surface)
    check(s.drawCalls < 700, `draw calls bounded (${s.drawCalls})`)

    await sleep(4500)
    s = await S()
    check(s.phase === 'racing', 'countdown reaches racing', s.phase)

    // Drive forward with full throttle for a few seconds.
    const p0 = s.progress
    await setInput({ throttle: 1, steer: 0 })
    await sleep(3000)
    s = await S()
    check(s.speed > 15, `kart accelerates (speed ${s.speed.toFixed(1)} m/s, ${s.kmh.toFixed(0)} km/h)`)
    check(((s.progress - p0 + 1) % 1) > 0.005, `progress advances (${p0.toFixed(3)} → ${s.progress.toFixed(3)})`)
    check(s.pos.y > -5 && s.pos.y < 60, `kart y sane (${s.pos.y})`)

    // AI karts should be moving too.
    const moving = s.karts.filter((k) => !k.name || k.speed > 5).length
    check(moving >= 6, `AI karts moving (${moving}/8)`)

    // Drift: hold hop + steer.
    await setInput({ throttle: 1, steer: 1, hop: true })
    await sleep(1600)
    s = await S()
    check(s.state.drifting || s.state.driftLevel > 0 || s.state.boostTimer > 0, 'drift engages with hop+steer', JSON.stringify(s.state))
    await setInput({ throttle: 1, steer: 0, hop: false })
    await sleep(300)
    s = await S()
    check(s.state.boostTimer > 0 || s.speed > 20, 'drift release yields boost/speed', JSON.stringify({ boost: s.state.boostTimer, speed: s.speed }))

    // Items: give mushroom and use it.
    await page.evaluate("window.__game.giveItem('mushroom')")
    const sp = (await S()).speed
    await page.evaluate('window.__game.useItem()')
    await sleep(400)
    s = await S()
    check(s.state.boostTimer > 0 || s.speed > sp + 2, 'mushroom boosts', JSON.stringify({ before: sp, after: s.speed, boost: s.state.boostTimer }))
    check(s.item === null, 'item consumed after use', JSON.stringify(s.item))

    // Shells shouldn't crash.
    for (const id of ['green_shell', 'red_shell', 'banana', 'bob_omb', 'lightning', 'star', 'triple_mushroom', 'fake_box']) {
      await page.evaluate(`window.__game.giveItem('${id}')`)
      await page.evaluate('window.__game.useItem()')
      await sleep(250)
    }
    await sleep(2500)
    s = await S()
    check(s.screen === 'race', 'race still running after using all items')

    // Teleport near the end and complete a lap.
    await setInput({ throttle: 0, steer: 0 })
    await page.evaluate('window.__game.teleport(0.97)')
    await sleep(200)
    await setInput({ throttle: 1, steer: 0 })
    await sleep(3500)
    s = await S()
    await setInput({ throttle: 0, steer: 0 })
    // With checkpoints gated, teleporting shouldn't have granted a lap. Progress should have wrapped.
    check(s.progress < 0.5, `progress wrapped past finish (${s.progress.toFixed(3)})`)
    check(s.lap === 1, `no lap credited without checkpoints (lap ${s.lap})`)

    // Finish the race via debug hook → results screen.
    await page.evaluate('window.__game.finishPlayer()')
    await sleep(9500)
    s = await S()
    check(s.screen === 'results', 'results screen after finish', s.screen)
    check(s.results.length === 8, `results for all 8 karts (${s.results.length})`)
    check(s.results.some((r) => r.isPlayer), 'player in results')
    check(new Set(s.results.map((r) => r.rank)).size === 8, 'ranks unique')

    // Pause/unpause shouldn't throw from results (no-op)
    await page.evaluate('window.__game.pause(true)')
    await page.evaluate('window.__game.pause(false)')
  }

  // Menu return
  await page.evaluate('window.__game.showSelect()')
  await sleep(500)
  check((await S()).screen === 'select', 'back to select')

  // Pause in a race
  await page.evaluate(`window.__game.startRace({ trackId: '${tracks[0]}', seed: 3 })`)
  await sleep(500)
  await page.keyboard.press('Escape')
  await sleep(300)
  const paused = await page.evaluate('document.body.innerText.toLowerCase().includes("paused")')
  check(paused, 'pause overlay visible after Escape')
  await page.keyboard.press('Escape')
  await sleep(300)

  const fps = await page.evaluate('window.__game.fps')
  console.log(`\nfps (headless swiftshader, indicative only): ${fps.toFixed(1)}`)

  const realErrors = pageErrors.filter((e) => !/WebGL|GPU|swiftshader|AudioContext|Autoplay|favicon|fonts.googleapis|net::ERR/i.test(e))
  check(realErrors.length === 0, 'no page errors', realErrors.slice(0, 5).join('\n'))
} catch (err) {
  fail('exception', err?.stack || String(err))
} finally {
  await browser.close()
  vite.kill()
}

console.log(failures.length ? `\n${failures.length} failure(s): ${failures.join('; ')}` : '\nAll checks passed')
process.exit(failures.length ? 1 : 0)
