// Shared helpers for the headless test tools: start a Vite dev server and launch Chrome.
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from 'playwright-core'

export function chromePath() {
  const cands = [
    process.env.CHROME,
    '/usr/local/bin/google-chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    join(process.env.HOME || '', 'Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell'),
  ]
  return cands.find((p) => p && existsSync(p))
}

export async function startVite(root, port) {
  const vite = spawn('npx', ['vite', '--port', String(port), '--strictPort'], { cwd: root, stdio: 'pipe' })
  await new Promise((res, rej) => {
    vite.stdout.on('data', (d) => { if (String(d).includes('Local:')) res() })
    vite.stderr.on('data', (d) => process.stderr.write(d))
    vite.on('exit', (c) => rej(new Error('vite exited ' + c)))
    setTimeout(() => rej(new Error('vite start timeout')), 30000)
  })
  return vite
}

export async function launchBrowser() {
  const exe = chromePath()
  return chromium.launch({
    executablePath: exe,
    args: [
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-unsafe-swiftshader',
      '--ignore-gpu-blocklist',
      '--no-sandbox',
      '--autoplay-policy=no-user-gesture-required',
      '--mute-audio',
    ],
  })
}
