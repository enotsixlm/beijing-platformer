import { spawn } from 'node:child_process'
import { chromium } from 'playwright-core'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { mkdirSync, existsSync } from 'node:fs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'shots')
mkdirSync(outDir, { recursive: true })
const PORT = 5212

function findChrome() {
  const candidates = [
    process.env.PLAYWRIGHT_CHROMIUM,
    process.env.CHROME_PATH,
    join(process.env.HOME || '', 'Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell'),
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/usr/bin/chrome',
  ]
  return candidates.find((p) => p && existsSync(p))
}

const vite = spawn('npx', ['vite', '--port', String(PORT), '--strictPort'], { cwd: root, stdio: 'pipe' })
await new Promise((res, rej) => {
  vite.stdout.on('data', (d) => { if (String(d).includes('Local:')) res() })
  vite.on('exit', (c) => rej(new Error('vite exited ' + c)))
  setTimeout(() => rej(new Error('vite start timeout')), 20000)
})

const browser = await chromium.launch({
  executablePath: findChrome(),
  args: ['--enable-unsafe-swiftshader', '--use-gl=angle'],
})
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
  await page.goto(`http://localhost:${PORT}/`)
  await page.waitForFunction('window.__game && window.__game.ready', null, { timeout: 30000 })
  await page.screenshot({ path: join(outDir, '0-title.png') })
  await page.evaluate('window.__game.start({ immediate: true, lava: 0.2, players: 1 })')
  await page.waitForTimeout(400)
  const test = await page.evaluate('window.__game.state().test')
  const spots = [
    ['1-lobby', test.lobby.x, test.lobby.y + 0.4, test.lobby.z],
    ['2-stairs', test.stair.x, test.stair.y, test.stair.z],
    ['3-floor2', test.mid2.x, test.mid2.y, test.mid2.z],
    ['4-roof', test.goal.x, test.goal.y, test.goal.z],
  ]
  for (const [name, x, y, z] of spots) {
    await page.evaluate(`window.__game.teleport(${x}, ${y}, ${z})`)
    await page.waitForTimeout(900)
    await page.screenshot({ path: join(outDir, name + '.png') })
    console.log('shot', name)
  }
} finally {
  await browser.close()
  vite.kill()
}
