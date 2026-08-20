import { spawn } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'shots')
mkdirSync(outDir, { recursive: true })
const PORT = 5220 + Math.floor(Math.random() * 30)

function findChrome() {
  const list = [
    process.env.PLAYWRIGHT_CHROMIUM,
    process.env.CHROME_PATH,
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ].filter(Boolean)
  for (const p of list) if (existsSync(p)) return p
  return null
}

const vite = spawn('npx', ['vite', '--port', String(PORT), '--strictPort'], { cwd: root, stdio: 'pipe' })
await new Promise((res, rej) => {
  const onData = (d) => { if (String(d).includes('Local:')) res() }
  vite.stdout.on('data', onData)
  vite.stderr.on('data', onData)
  vite.on('exit', (c) => rej(new Error('vite exited ' + c)))
  setTimeout(() => rej(new Error('vite start timeout')), 20000)
})

const browser = await chromium.launch({
  executablePath: findChrome() || undefined,
  args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader'],
})
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
  await page.goto(`http://localhost:${PORT}/`)
  await page.waitForFunction('window.__game && window.__game.ready', null, { timeout: 30000 })
  await page.screenshot({ path: join(outDir, '0-title.png') })
  await page.evaluate(() => {
    window.__game.start()
    window.__game.advance(300)
  })
  await page.screenshot({ path: join(outDir, '1-range.png') })
  await page.evaluate(() => {
    window.__game.teleport(-2.5, 1.05, -6)
    window.__game.aimAt(-2.5, 3.2, -16.2)
    window.__game.slot(1)
    window.__game.holdFire(true)
    window.__game.advance(500)
    window.__game.holdFire(false)
  })
  await page.screenshot({ path: join(outDir, '2-shoot.png') })
  await page.evaluate(() => {
    window.__game.slot(3)
    window.__game.teleport(8, 1.05, -9)
    window.__game.aimAt(21, 3.2, -9)
    window.__game.fire()
    window.__game.advance(900)
  })
  await page.screenshot({ path: join(outDir, '3-carve.png') })
} finally {
  await browser.close().catch(() => {})
  vite.kill('SIGKILL')
}
