import { spawn } from 'node:child_process'
import { chromium } from 'playwright-core'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { mkdirSync, existsSync } from 'node:fs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'shots')
mkdirSync(outDir, { recursive: true })
const PORT = 5233

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
  vite.stderr.on('data', (d) => process.stderr.write(d))
  setTimeout(() => rej(new Error('vite start timeout')), 20000)
})

const browser = await chromium.launch({
  executablePath: findChrome(),
  args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'],
})
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
  await page.goto(`http://localhost:${PORT}/`)
  await page.waitForFunction('window.__game && window.__game.ready', null, { timeout: 30000 })
  await page.screenshot({ path: join(outDir, '0-title.png') })
  await page.evaluate('window.__game.start({ immediate: true, lava: -1, players: 1 })')
  await page.waitForTimeout(400)
  const test = await page.evaluate('window.__game.state().test')
  const spots = [
    ['1-lobby', test.lobby.x, test.lobby.y + 0.05, test.lobby.z],
    ['2-stairs', test.stair.x, test.stair.y, test.stair.z],
    ['3-floor2', test.mid2.x, test.mid2.y, test.mid2.z],
    ['4-roof', test.roof.x, test.roof.y, test.roof.z],
  ]
  for (const [name, x, y, z] of spots) {
    await page.evaluate(`window.__game.teleport(${x}, ${y}, ${z})`)
    if (name === '3-floor2') await page.evaluate('window.__game.setLava(1.4)')
    await page.waitForTimeout(1100)
    await page.screenshot({ path: join(outDir, name + '.png') })
    console.log('shot', name)
  }
} finally {
  try { await browser.close() } catch { /* ignore */ }
  try { vite.kill('SIGKILL') } catch { /* ignore */ }
  process.exit(0)
}
