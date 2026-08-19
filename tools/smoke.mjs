// 无头冒烟:走/跳/二段跳/倒计时熔岩/楼梯/开裂踏步/天台胜利
import { spawn } from 'node:child_process'
import { chromium } from 'playwright-core'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { existsSync } from 'node:fs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const PORT = 5211

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
  vite.on('exit', (c) => rej(new Error('vite exited ' + c)))
  setTimeout(() => rej(new Error('vite start timeout')), 20000)
})

const shell = findChrome()
const browser = await chromium.launch({
  executablePath: shell,
  args: ['--enable-unsafe-swiftshader', '--use-gl=angle'],
})

const failures = []
const pass = (name) => console.log('  ✅', name)
const fail = (name, detail) => { failures.push(name); console.log('  ❌', name, detail ?? '') }
const check = (cond, name, detail) => (cond ? pass(name) : fail(name, detail))

try {
  const page = await browser.newPage()
  const pageErrors = []
  page.on('pageerror', (e) => pageErrors.push(String(e)))
  page.on('console', (m) => { if (m.type() === 'error') pageErrors.push(m.text()) })

  await page.goto(`http://localhost:${PORT}/`)
  await page.waitForFunction('window.__game && window.__game.ready', null, { timeout: 30000 })
  pass('页面加载,游戏就绪')

  const S = () => page.evaluate('window.__game.state()')
  const tp = (x, y, z) => page.evaluate(`window.__game.teleport(${x}, ${y}, ${z})`)
  const setInput = (o) => page.evaluate(`window.__game.input = ${JSON.stringify(o)}`)
  const idle = () => page.evaluate('window.__game.input = {x:0,z:0,jumpPressed:false}')
  const sleep = (ms) => page.waitForTimeout(ms)

  await page.evaluate('window.__game.start({ immediate: true, lava: -1, players: 1 })')
  await sleep(300)
  check((await S()).phase === 'play', '进入游戏(play)')
  check((await S()).playerCount === 1, '1 人开局')

  const s0 = await S()
  await setInput({ x: 0, z: -1, jumpPressed: false })
  await sleep(1100)
  await idle()
  const s1 = await S()
  check(s1.pos.z < s0.pos.z - 4, '朝楼梯井行走', JSON.stringify([s0.pos, s1.pos]))

  await tp(s0.pos.x, 0.02, s0.pos.z)
  await sleep(200)
  await setInput({ x: 0, z: 0, jumpPressed: true })
  let peak = 0
  for (let i = 0; i < 14; i++) {
    await sleep(60)
    const s = await S()
    peak = Math.max(peak, s.pos.y)
  }
  check(peak > 1.3 && peak < 2.5, `单跳高度约 1.7m(实测 ${peak.toFixed(2)})`)

  await tp(s0.pos.x, 0.02, s0.pos.z)
  await sleep(200)
  await setInput({ x: 0, z: 0, jumpPressed: true })
  await sleep(260)
  await setInput({ x: 0, z: 0, jumpPressed: true })
  peak = 0
  for (let i = 0; i < 20; i++) {
    await sleep(60)
    const s = await S()
    peak = Math.max(peak, s.pos.y)
  }
  check(peak > 2.4, `二段跳更高(实测 ${peak.toFixed(2)})`)
  await idle()

  const test = (await S()).test
  await tp(test.stair.x, test.stair.y, test.stair.z)
  await sleep(400)
  let s = await S()
  check(s.grounded && s.pos.y > 0.1, '站上第一级踏步', JSON.stringify(s.pos))

  await tp(test.mid2.x, test.mid2.y, test.mid2.z)
  await sleep(400)
  s = await S()
  check(s.grounded && s.floor >= 2, '站上 2 楼休息平台', JSON.stringify(s.pos))

  await tp(test.crumble.x, test.crumble.y, test.crumble.z)
  await sleep(200)
  s = await S()
  check(s.grounded, '站上开裂踏步', JSON.stringify(s.pos))
  await sleep(1400)
  s = await S()
  check(!s.grounded || s.pos.y < test.crumble.y - 0.3, '踏步 1.2s 后开裂掉落', JSON.stringify(s.pos))

  await page.evaluate('window.__game.teleport(window.__game.state().test.lobby.x, 0.02, window.__game.state().test.lobby.z)')
  await page.evaluate('window.__game.ignite()')
  await sleep(400)
  s = await S()
  check(s.alive === false && s.phase === 'dead', '大厅熔岩即死', JSON.stringify(s))

  await page.evaluate('window.__game.start({ immediate: true, lava: -1, players: 1 })')
  await sleep(200)
  await page.evaluate('const t = window.__game.state().test.goal; window.__game.teleport(t.x, t.y, t.z)')
  await sleep(700)
  s = await S()
  check(s.phase === 'win', '天台安全门胜利', s.phase)

  check(s.frames > 200, `渲染帧数正常(${s.frames})`)
  check(pageErrors.length === 0, '无页面报错', pageErrors.slice(0, 3).join(' | '))

  console.log(failures.length ? `\n${failures.length} 项失败` : '\n全部通过 🎉')
  process.exitCode = failures.length ? 1 : 0
} finally {
  await browser.close()
  vite.kill()
}
