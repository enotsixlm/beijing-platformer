// 截几个关键场景图,人工目验剪纸拉力赛画面
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { mkdirSync } from 'node:fs'
import { launchBrowser } from './launchBrowser.mjs'
import { startVite } from './startVite.mjs'
import viteConfig from '../vite.config.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'shots')
mkdirSync(outDir, { recursive: true })
const PORT = 5214
const BASE = viteConfig.base ?? '/'

const vite = await startVite(root, PORT)
const browser = await launchBrowser()
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
  await page.goto(`http://localhost:${PORT}${BASE}racing.html`)
  await page.waitForFunction('window.__racing && window.__racing.ready', null, { timeout: 30000 })
  await page.screenshot({ path: join(outDir, 'racing-0-title.png') })

  await page.evaluate('window.__racing.start()')
  await page.waitForTimeout(600)
  await page.screenshot({ path: join(outDir, 'racing-1-countdown.png') })

  await page.evaluate('window.__racing.skipCountdown()')
  await page.waitForTimeout(300)
  await page.evaluate('window.__racing.input = {throttle:1,steer:0,handbrake:false}')
  await page.waitForTimeout(2500)
  await page.screenshot({ path: join(outDir, 'racing-2-play.png') })

  await page.evaluate('window.__racing.input = {throttle:1,steer:1,handbrake:true}')
  await page.waitForTimeout(1200)
  await page.screenshot({ path: join(outDir, 'racing-3-drift.png') })

  console.log('shots saved')
} finally {
  await browser.close()
  vite.stop()
}
