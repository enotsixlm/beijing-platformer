import { spawn } from 'node:child_process'
import { chromium } from 'playwright-core'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { existsSync } from 'node:fs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const PORT = 5211
const BASE = `http://localhost:${PORT}/beijing-platformer/`

const vite = spawn('npx', ['vite', '--port', String(PORT), '--strictPort'], { cwd: root, stdio: 'pipe' })
await new Promise((res, rej) => {
  vite.stdout.on('data', (d) => { if (String(d).includes('Local:')) res() })
  vite.stderr.on('data', (d) => process.stderr.write(d))
  vite.on('exit', (c) => rej(new Error('vite exited ' + c)))
  setTimeout(() => rej(new Error('vite start timeout')), 25000)
})

const chromeCandidates = [
  process.env.CHROME_PATH,
  '/usr/local/bin/google-chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  join(process.env.HOME || '', 'Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell'),
].filter(Boolean)
const executablePath = chromeCandidates.find((p) => existsSync(p))

const browser = await chromium.launch({
  executablePath,
  args: ['--headless=new', '--no-sandbox', '--disable-gpu', '--enable-unsafe-swiftshader'],
})

const failures = []
const pass = (name) => console.log('  ✅', name)
const fail = (name, detail) => { failures.push(name); console.log('  ❌', name, detail ?? '') }
const check = (cond, name, detail) => (cond ? pass(name) : fail(name, detail))

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
  const pageErrors = []
  page.on('pageerror', (e) => pageErrors.push(String(e)))
  page.on('console', (m) => { if (m.type() === 'error') pageErrors.push(m.text()) })

  await page.goto(BASE)
  await page.waitForFunction('window.__game && window.__game.ready', null, { timeout: 30000 })
  pass('页面加载,游戏就绪')

  const S = () => page.evaluate('window.__game.state()')
  const sleep = (ms) => page.waitForTimeout(ms)

  await page.evaluate(`window.__game.start({ dog: 'aka', course: 0, diff: 'easy', skipCountdown: true })`)
  await sleep(400)
  let s = await S()
  check(s.phase === 'race', '进入比赛', s.phase)
  check(s.racerCount === 8, `8 名选手出场(${s.racerCount})`)
  check(s.coinTotal > 8, `赛道有金币(${s.coinTotal})`)

  const s0 = s.s
  await sleep(900)
  s = await S()
  check(s.s > s0 + 4, '柴犬自动往前跑', `s ${s0.toFixed(1)} → ${s.s.toFixed(1)}`)

  const lat0 = s.lateral
  await page.evaluate('window.__game.setSteer(-1)')
  await sleep(700)
  s = await S()
  check(Math.abs(s.lateral - lat0) > 0.35, '左转改变横向位置', `lat ${lat0.toFixed(2)} → ${s.lateral.toFixed(2)}`)
  await page.evaluate('window.__game.setSteer(0)')

  s = await S()
  const ownerDist = Math.hypot(s.pos.x - s.owner.x, s.pos.z - s.owner.z)
  check(ownerDist > 1.2 && ownerDist < 6.5, `饲主被牵在后面(距 ${ownerDist.toFixed(2)})`)

  const c0 = s.coins
  const placed = await page.evaluate('window.__game.placeOwnerOnNearestCoin()')
  await sleep(250)
  s = await S()
  check(placed && s.coins > c0, '饲主捡到金币', `placed=${placed} coins ${c0} → ${s.coins}`)

  const c1 = s.coins
  await page.evaluate('window.__game.placeDogOnNearestCoin()')
  await sleep(250)
  s = await S()
  check(s.coins === c1, '犬踩到金币不会捡', `coins ${c1} → ${s.coins}`)

  await page.evaluate('window.__game.placeDogOnBoost()')
  await sleep(280)
  s = await S()
  check(s.boostT > 0.2, '踩到水色面板加速', `boostT=${s.boostT}`)

  const stunned = await page.evaluate('window.__game.placeOwnerOnSneaker()')
  await sleep(250)
  s = await S()
  check(stunned && s.stunT > 0.2, '饲主碰到球鞋急停', `stunT=${s.stunT}`)

  const stick = await page.evaluate('window.__game.placeDogOnStick()')
  await sleep(280)
  s = await S()
  check(stick && s.stickT > 0.5, '叼到木棒', `stickT=${s.stickT}`)

  await page.evaluate('window.__game.giveCoins(15)')
  s = await S()
  check(s.dashStock >= 1, '15 金币积 1 格 Dash', `stock=${s.dashStock}`)
  await page.evaluate('window.__game.dash()')
  await sleep(200)
  s = await S()
  check(s.dashStock === 0 && s.boostT > 0.4, '空格触发 Coin Dash', JSON.stringify({ stock: s.dashStock, boostT: s.boostT }))

  await page.evaluate('window.__game.forceFinish()')
  await sleep(200)
  s = await S()
  check(s.phase === 'finish', '完走进入结算', s.phase)

  check(s.frames > 80, `渲染帧数正常(${s.frames})`)
  check(pageErrors.length === 0, '无页面报错', pageErrors.slice(0, 4).join(' | '))

  console.log(failures.length ? `\n${failures.length} 项失败` : '\n全部通过 🎉')
  process.exitCode = failures.length ? 1 : 0
} finally {
  await browser.close()
  vite.kill()
}
