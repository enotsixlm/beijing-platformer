// Capture screenshots of every screen and every track into ./shots for visual review.
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { mkdirSync } from 'node:fs'
import { startVite, launchBrowser } from './browser.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = process.argv[2] ? process.argv[2] : join(root, 'shots')
mkdirSync(outDir, { recursive: true })
const PORT = 5212

const vite = await startVite(root, PORT)
const browser = await launchBrowser()
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
  page.on('pageerror', (e) => console.error('pageerror', e))
  await page.goto(`http://localhost:${PORT}/`)
  await page.waitForFunction('window.__game && window.__game.ready', null, { timeout: 60000 })
  const shot = async (name) => { await page.screenshot({ path: join(outDir, name + '.png') }); console.log('shot', name) }
  const sleep = (ms) => page.waitForTimeout(ms)

  await sleep(1500)
  await shot('0-title')
  await page.evaluate('window.__game.showSelect()')
  await sleep(800)
  await shot('1-select')

  const tracks = await page.evaluate('window.__game.tracks()')
  const chars = await page.evaluate('window.__game.characters()')
  let i = 2
  for (const trackId of tracks) {
    await page.evaluate(`window.__game.startRace({ characterId: '${chars[i % chars.length]}', trackId: '${trackId}', seed: 11 })`)
    await sleep(1200)
    await shot(`${i}-${trackId}-grid`)
    await page.evaluate('window.__game.skipCountdown(); window.__game.step(0.5)')
    await page.evaluate('window.__game.setInput({ throttle: 1, steer: 0 }); window.__game.step(6)')
    await sleep(300)
    await shot(`${i}-${trackId}-race`)
    await page.evaluate('window.__game.setInput({ throttle: 1, steer: 0.5, hop: true }); window.__game.step(0.9)')
    await sleep(300)
    await shot(`${i}-${trackId}-drift`)
    await page.evaluate('window.__game.setInput({ throttle: 1, steer: 0, hop: false }); window.__game.step(0.3)')
    await page.evaluate("window.__game.giveItem('star'); window.__game.useItem(); window.__game.step(0.8)")
    await sleep(300)
    await shot(`${i}-${trackId}-star`)
    await page.evaluate("window.__game.giveItem('red_shell'); window.__game.useItem(); window.__game.step(0.5)")
    await sleep(300)
    await shot(`${i}-${trackId}-shell`)
    for (const t of [0.25, 0.5, 0.75]) {
      await page.evaluate(`window.__game.teleport(${t}); window.__game.setInput({ throttle: 1, steer: 0 }); window.__game.step(2.5)`)
      await sleep(300)
      await shot(`${i}-${trackId}-t${Math.round(t * 100)}`)
    }
    i++
  }
  await page.evaluate('window.__game.setInput(null)')
  await page.evaluate('window.__game.finishPlayer(); window.__game.step(9)')
  await sleep(800)
  await shot(`${i}-results`)
} finally {
  await browser.close()
  vite.kill()
}
