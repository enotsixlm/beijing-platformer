import { Game } from './game.js'

const game = new Game({
  container: document.getElementById('game'),
  uiRoot: document.getElementById('ui'),
})

window.__game = game.debugApi()
game.boot()
