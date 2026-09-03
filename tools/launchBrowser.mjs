// 跨平台启动无头浏览器:依赖 `node node_modules/playwright-core/cli.js install chromium`
// 预先下载好与本地 playwright-core 版本匹配的浏览器,而不是写死某个操作系统的可执行文件路径。
import { chromium } from 'playwright-core'

export async function launchBrowser(extraArgs = []) {
  return chromium.launch({ args: ['--enable-unsafe-swiftshader', ...extraArgs] })
}
