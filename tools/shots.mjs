// 截几个关键场景图,人工目验画面
import { spawn } from 'node:child_process'
import { chromium } from 'playwright-core'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { mkdirSync } from 'node:fs'

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

const shell = join(process.env.HOME, 'Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell')
const browser = await chromium.launch({ executablePath: shell, args: ['--enable-unsafe-swiftshader'] })
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
  await page.goto(`http://localhost:${PORT}/`)
  await page.waitForFunction('window.__game && window.__game.ready', null, { timeout: 30000 })
  await page.screenshot({ path: join(outDir, '0-title.png') })
  await page.evaluate('window.__game.start()')

  const spots = [
    ['1-start', 0, 0, 14],
    ['2-tiananmen-top', 6, 11.5, -14.7],
    ['3-hutong', 0, 5.4, -70.5],
    ['4-lanterns', 0, 8.4, -113.5],
    ['5-temple', 0, 5.0, -143],
    ['6-cbd', 0, 17.5, -197],
    ['7-watercube', 0, 11.5, -262],
    ['8-birdsnest', 0, 6.5, -299],
  ]
  for (const [name, x, y, z] of spots) {
    await page.evaluate(`window.__game.teleport(${x}, ${y}, ${z})`)
    await page.waitForTimeout(1400)
    await page.screenshot({ path: join(outDir, name + '.png') })
    console.log('shot', name)
  }
} finally {
  await browser.close()
  vite.kill()
}
