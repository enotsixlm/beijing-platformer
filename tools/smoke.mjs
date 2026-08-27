import { spawn } from 'node:child_process'
import { chromium } from 'playwright-core'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { existsSync } from 'node:fs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const PORT = 5211

const vite = spawn('npx', ['vite', '--port', String(PORT), '--strictPort'], { cwd: root, stdio: 'pipe' })
await new Promise((res, rej) => {
  vite.stdout.on('data', (d) => { if (String(d).includes('Local:')) res() })
  vite.stderr.on('data', (d) => process.stderr.write(d))
  vite.on('exit', (c) => rej(new Error('vite exited ' + c)))
  setTimeout(() => rej(new Error('vite start timeout')), 20000)
})

function chromePath() {
  const cands = [
    process.env.CHROME,
    '/usr/local/bin/google-chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    join(process.env.HOME || '', 'Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell'),
  ]
  return cands.find((p) => p && existsSync(p))
}

const browser = await chromium.launch({
  executablePath: chromePath(),
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-gl=angle'],
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
  pass('page loaded, game ready')

  const S = () => page.evaluate('window.__game.state()')
  const tp = (x, y, z) => page.evaluate(`window.__game.teleport(${x}, ${y}, ${z})`)
  const setInput = (o) => page.evaluate(`window.__game.input = ${JSON.stringify(o)}`)
  const idle = () => page.evaluate('window.__game.input = {x:0,z:0,jumpPressed:false}')
  const sleep = (ms) => page.waitForTimeout(ms)

  await page.evaluate('window.__game.start()')
  await sleep(350)
  check((await S()).phase === 'play', 'enter play')

  const s0 = await S()
  await setInput({ x: 0, z: 1, jumpPressed: false })
  await sleep(1100)
  await idle()
  const s1 = await S()
  check(s1.pos.z > s0.pos.z + 2.5, 'walk north into the compound', JSON.stringify([s0.pos, s1.pos]))

  await tp(-8, 1.25, 12)
  await sleep(400)
  let s = await S()
  check(s.grounded && s.pos.y > 0.9, 'stand on crate cover', JSON.stringify(s.pos))

  await tp(0, 0, 8)
  await sleep(150)
  await setInput({ x: 0, z: 0, crouchToggle: true })
  await sleep(200)
  await idle()
  s = await S()
  check(s.crouch === true, 'crouch toggle', JSON.stringify(s))

  await setInput({ x: 0, z: 0, boxToggle: true })
  await sleep(200)
  await idle()
  s = await S()
  check(s.boxOn === true, 'cardboard box on', JSON.stringify({ boxOn: s.boxOn, crouch: s.crouch }))
  await setInput({ x: 0, z: 0, boxToggle: true })
  await sleep(150)
  await idle()

  // CQC from behind whichever way guard 0 is facing
  await page.evaluate(() => {
    const g = window.__game.state().guards[0]
    window.__game.teleport(g.x - Math.sin(g.heading) * 1.15, 0, g.z - Math.cos(g.heading) * 1.15)
    window.__game.input = { x: 0, z: 0, cqc: true, jumpPressed: false }
  })
  await sleep(350)
  await idle()
  s = await S()
  check(s.guards[0].ko === true, 'CQC knockout from behind', JSON.stringify(s.guards[0]))

  // Spotting: stand in front of guard 1
  const g1 = s.guards[1]
  const hx = Math.sin(g1.heading), hz = Math.cos(g1.heading)
  await tp(g1.x + hx * 2.2, 0, g1.z + hz * 2.2)
  let spotted = false
  for (let i = 0; i < 18; i++) {
    await sleep(120)
    s = await S()
    if (s.alertPhase === 'alert' || s.guards[1].detect > 0.8 || s.guards[1].state === 'chase') {
      spotted = true
      break
    }
  }
  check(spotted, 'standing in a vision cone raises alert', JSON.stringify({ alert: s.alertPhase, g: s.guards[1] }))

  await page.evaluate('window.__game.giveIntel()')
  await sleep(200)
  s = await S()
  check(s.hasIntel === true, 'acquire CHIMERA disk')

  await tp(26, 0, 76)
  await sleep(250)
  await setInput({ x: 0, z: 0, interact: true })
  await sleep(500)
  s = await S()
  check(s.phase === 'win', 'board helicopter and extract', s.phase)

  check(s.frames > 180, `frames rendered (${s.frames})`)
  check(pageErrors.length === 0, 'no page errors', pageErrors.slice(0, 4).join(' | '))

  console.log(failures.length ? `\n${failures.length} failed` : '\nall passed')
  process.exitCode = failures.length ? 1 : 0
} finally {
  await browser.close()
  vite.kill()
}
