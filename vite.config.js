export default {
  // GitHub Pages lives under /beijing-platformer/. CrazyGames zip uploads need
  // relative paths so assets resolve inside their iframe.
  base: process.env.CRAZY_BUILD ? './' : '/beijing-platformer/',
}
