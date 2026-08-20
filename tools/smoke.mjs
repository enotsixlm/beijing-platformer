import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const PORT = 5211 + Math.floor(Math.random() * 40)

function findChrome() {
  const list = [
    process.env.PLAYWRIGHT_CHROMIUM,
    process.env.CHROME_PATH,
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    join(process.env.HOME || '', 'Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell'),
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

const exe = findChrome()
const browser = await chromium.launch({
  executablePath: exe || undefined,
  args: [
    '--enable-unsafe-swiftshader',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows',
  ],
})

const failures = []
const pass = (name) => console.log('  ✅', name)
const fail = (name, detail) => { failures.push(name); console.log('  ❌', name, detail ?? '') }
const check = (cond, name, detail) => (cond ? pass(name) : fail(name, detail))

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
  await page.bringToFront()
  const pageErrors = []
  page.on('pageerror', (e) => pageErrors.push(String(e)))
  page.on('response', (r) => { if (r.status() === 404) pageErrors.push('404 ' + r.url()) })

  await page.goto(`http://localhost:${PORT}/`)
  await page.waitForFunction('window.__game && window.__game.ready', null, { timeout: 30000 })
  pass('page load')

  await page.evaluate('window.__game.start()')
  await page.waitForTimeout(400)
  const S = () => page.evaluate('window.__game.state()')
  check((await S()).phase === 'play', 'enter play')

  const s0 = await S()
  await page.evaluate('window.__game.input = { x: 0, z: 1, jump: false, dash: false }; window.__game.advance(1400); window.__game.input = { x: 0, z: 0 }')
  const s1 = await S()
  check(s1.pos.z < s0.pos.z - 2, 'walk forward', JSON.stringify([s0.pos, s1.pos]))

  const peak = await page.evaluate(() => {
    window.__game.teleport(0, 1.05, 8)
    window.__game.input = { x: 0, z: 0, jump: true }
    let p = 0
    for (let i = 0; i < 40; i++) {
      window.__game.advance(16)
      p = Math.max(p, window.__game.state().pos.y)
    }
    window.__game.input = { x: 0, z: 0 }
    return p
  })
  check(peak > 2.0 && peak < 4.2, `jump height ${peak.toFixed(2)}`)

  const dash = await page.evaluate(() => {
    window.__game.teleport(0, 1.05, 8)
    window.__game.look(0, 0)
    const before = window.__game.state().pos.z
    window.__game.input = { x: 0, z: 1, dash: true }
    window.__game.advance(280)
    window.__game.input = { x: 0, z: 0 }
    return { before, after: window.__game.state().pos.z }
  })
  check(dash.after < dash.before - 1.4, 'dash displaces', JSON.stringify(dash))

  await page.evaluate('window.__game.slot(1)')
  check((await S()).slot === 1, 'switch autogun')
  const afterShoot = await page.evaluate(() => {
    window.__game.teleport(-2.5, 1.05, -8)
    window.__game.aimAt(-2.5, 3.2, -16.2)
    const ammo0 = window.__game.state().ammo
    window.__game.holdFire(true)
    window.__game.advance(800)
    window.__game.holdFire(false)
    const s = window.__game.state()
    return { ammo0, ammo: s.ammo, dummies: s.dummies }
  })
  check(afterShoot.ammo < afterShoot.ammo0, 'autogun spends ammo', `${afterShoot.ammo0} -> ${afterShoot.ammo}`)
  const dummyHit = afterShoot.dummies.some((d) => d.left < d.base || d.dead)
  check(dummyHit, 'dummy takes voxel damage', JSON.stringify(afterShoot.dummies))

  const afterRocket = await page.evaluate(() => {
    window.__game.slot(3)
    window.__game.teleport(8, 1.05, -9)
    window.__game.aimAt(21, 3.2, -9)
    const carved0 = window.__game.state().carved
    window.__game.fire()
    window.__game.advance(2000)
    const s = window.__game.state()
    return { carved0, carved: s.carved, rockets: s.rockets, pos: s.pos, yaw: s.yaw, pitch: s.pitch, ammo: s.ammo }
  })
  console.log('rocket state', JSON.stringify(afterRocket))
  check(afterRocket.carved > afterRocket.carved0, 'blockbuster carves terrain', `${afterRocket.carved0} -> ${afterRocket.carved} rockets=${afterRocket.rockets}`)

  await page.evaluate('window.__game.slot(0); window.__game.reload(); window.__game.advance(2000)')
  const afterReload = await S()
  check(afterReload.slot === 0 && afterReload.ammo === afterReload.mag && !afterReload.reloading, 'reload fills mag')

  check(pageErrors.length === 0, 'no page errors', pageErrors.join('\n'))
} finally {
  await browser.close().catch(() => {})
  vite.kill('SIGKILL')
}

if (failures.length) {
  console.error('\nfailed:', failures.join(', '))
  process.exit(1)
}
console.log('\nall smoke checks passed')
process.exit(0)
