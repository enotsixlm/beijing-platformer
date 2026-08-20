import { spawn } from 'node:child_process'
import { chromium } from 'playwright-core'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { mkdirSync, existsSync } from 'node:fs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'shots')
mkdirSync(outDir, { recursive: true })
const PORT = 5212
const BASE = `http://localhost:${PORT}/beijing-platformer/`

const vite = spawn('npx', ['vite', '--port', String(PORT), '--strictPort'], { cwd: root, stdio: 'pipe' })
await new Promise((res, rej) => {
  vite.stdout.on('data', (d) => { if (String(d).includes('Local:')) res() })
  vite.on('exit', (c) => rej(new Error('vite exited ' + c)))
  setTimeout(() => rej(new Error('vite start timeout')), 25000)
})

const chromeCandidates = [
  process.env.CHROME_PATH,
  '/usr/local/bin/google-chrome',
  '/usr/bin/google-chrome',
  join(process.env.HOME || '', 'Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell'),
].filter(Boolean)
const executablePath = chromeCandidates.find((p) => existsSync(p))

const browser = await chromium.launch({
  executablePath,
  args: ['--headless=new', '--no-sandbox', '--disable-gpu', '--enable-unsafe-swiftshader'],
})
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
  await page.goto(BASE)
  await page.waitForFunction('window.__game && window.__game.ready', null, { timeout: 30000 })
  await page.screenshot({ path: join(outDir, '0-title.png') })

  const courses = [
    ['1-day', 0],
    ['2-sunset', 1],
    ['3-rain', 2],
    ['4-cool', 3],
    ['5-down', 4],
    ['6-shiva', 5],
  ]
  for (const [name, course] of courses) {
    await page.evaluate(`window.__game.start({ course: ${course}, skipCountdown: true })`)
    await page.waitForTimeout(1600)
    await page.screenshot({ path: join(outDir, name + '.png') })
    console.log('shot', name)
  }
} finally {
  await browser.close()
  vite.kill()
}
