import { spawn } from 'node:child_process'
import { chromium } from 'playwright-core'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { existsSync, mkdirSync } from 'node:fs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'shots')
mkdirSync(outDir, { recursive: true })
const PORT = 5212

const vite = spawn('npx', ['vite', '--port', String(PORT), '--strictPort'], { cwd: root, stdio: 'pipe' })
await new Promise((res, rej) => {
  vite.stdout.on('data', (d) => { if (String(d).includes('Local:')) res() })
  vite.on('exit', (c) => rej(new Error('vite exited ' + c)))
  setTimeout(() => rej(new Error('vite start timeout')), 20000)
})

function chromePath() {
  const cands = [
    process.env.CHROME,
    '/usr/local/bin/google-chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    join(process.env.HOME || '', 'Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell'),
  ]
  return cands.find((p) => p && existsSync(p))
}

const browser = await chromium.launch({
  executablePath: chromePath(),
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-gl=angle'],
})
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
  await page.goto(`http://localhost:${PORT}/`)
  await page.waitForFunction('window.__game && window.__game.ready', null, { timeout: 30000 })
  await page.screenshot({ path: join(outDir, '0-title.png') })
  await page.evaluate('window.__game.start()')

  const spots = [
    ['1-breach', 0, 0, 2],
    ['2-outer-yard', -6, 0, 16],
    ['3-crates', -8, 1.3, 16],
    ['4-loading', 0, 0, 40],
    ['5-inner-yard', 0, 0, 56],
    ['6-command', 2, 0, 80],
    ['7-intel', 0, 0, 83],
    ['8-helipad', 24, 0, 76],
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
