// 启动一个独立进程组里的 vite dev server,确保测试脚本收尾时能连子进程一起杀干净
// (直接 vite.kill() 有时杀不掉 esbuild/rollup 派生出的子进程,导致测试脚本挂起不退出)。
import { spawn } from 'node:child_process'

export async function startVite(root, port) {
  const vite = spawn('npx', ['vite', '--port', String(port), '--strictPort'], {
    cwd: root,
    stdio: 'pipe',
    detached: true,
  })
  await new Promise((res, rej) => {
    vite.stdout.on('data', (d) => { if (String(d).includes('Local:')) res() })
    vite.stderr.on('data', (d) => process.stderr.write(d))
    vite.on('exit', (c) => rej(new Error('vite exited ' + c)))
    setTimeout(() => rej(new Error('vite start timeout')), 20000)
  })
  return {
    stop() {
      try { process.kill(-vite.pid, 'SIGKILL') } catch { try { vite.kill('SIGKILL') } catch { /* ignore */ } }
    },
  }
}
