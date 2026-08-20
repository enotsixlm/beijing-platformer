import { spawn } from 'node:child_process'
import { chromium } from 'playwright-core'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { GAMES } from '../src/eval/catalog.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const PORT = 5212
const BASE = `http://localhost:${PORT}/beijing-platformer/`

const vite = spawn('npx', ['vite', '--port', String(PORT), '--strictPort'], { cwd: root, stdio: 'pipe' })
await new Promise((res, rej) => {
  vite.stdout.on('data', (d) => { if (String(d).includes('Local:')) res() })
  vite.stderr.on('data', (d) => process.stderr.write(d))
  vite.on('exit', (c) => rej(new Error('vite exited ' + c)))
  setTimeout(() => rej(new Error('vite start timeout')), 30000)
})

const browser = await chromium.launch({
  executablePath: '/usr/local/bin/google-chrome',
  args: ['--headless=new', '--enable-unsafe-swiftshader', '--use-gl=swiftshader'],
})

const failures = []
const pass = (name) => console.log('  ✅', name)
const fail = (name, detail) => { failures.push(name); console.log('  ❌', name, detail ?? '') }

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
  const pageErrors = []
  page.on('pageerror', (e) => pageErrors.push(String(e)))
  page.on('console', (m) => { if (m.type() === 'error') pageErrors.push(m.text()) })

  await page.goto(BASE)
  await page.waitForSelector('.grid .card')
  const n = await page.locator('.grid .card').count()
  n === 34 ? pass(`目录 34 张卡片`) : fail('目录卡片数量', String(n))

  for (const g of GAMES) {
    pageErrors.length = 0
    await page.goto(`${BASE}#/${g.id}`)
    try {
      await page.waitForSelector('#game', { timeout: 8000 })
      await page.waitForTimeout(250)
      if (pageErrors.length) fail(`${g.num} ${g.id}`, pageErrors.slice(0, 2).join(' | '))
      else pass(`${g.num} ${g.title}`)
    } catch (e) {
      fail(`${g.num} ${g.id}`, e.message)
    }
  }

  console.log(failures.length ? `\n${failures.length} 项失败` : '\n全部通过')
  process.exitCode = failures.length ? 1 : 0
} finally {
  await browser.close().catch(() => {})
  vite.kill('SIGKILL')
  process.exit(process.exitCode || 0)
}
