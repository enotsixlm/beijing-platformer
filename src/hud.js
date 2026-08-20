export function paintWeaponIcons(canvases) {
  const drawers = [drawCannon, drawAuto, drawScatter, drawRocket]
  canvases.forEach((c, i) => drawers[i](c.getContext('2d')))
}

function bg(g) {
  g.clearRect(0, 0, 46, 46)
}

function drawCannon(g) {
  bg(g)
  g.fillStyle = '#2c3138'
  g.fillRect(8, 18, 30, 12)
  g.fillStyle = '#ff7a18'
  g.fillRect(6, 20, 8, 8)
  g.fillStyle = '#d8dde3'
  g.fillRect(34, 20, 8, 6)
}

function drawAuto(g) {
  bg(g)
  g.fillStyle = '#2c3138'
  g.fillRect(4, 20, 38, 8)
  g.fillRect(12, 14, 10, 8)
  g.fillStyle = '#ff3a2a'
  g.fillRect(8, 22, 6, 6)
  g.fillStyle = '#e8edf2'
  g.fillRect(38, 21, 6, 5)
}

function drawScatter(g) {
  bg(g)
  g.fillStyle = '#2c3138'
  g.fillRect(8, 16, 22, 14)
  g.fillStyle = '#5a6168'
  g.fillRect(28, 14, 12, 6)
  g.fillRect(28, 26, 12, 6)
  g.fillStyle = '#ffc14a'
  g.fillRect(6, 20, 8, 8)
}

function drawRocket(g) {
  bg(g)
  g.fillStyle = '#2c3138'
  g.fillRect(10, 14, 26, 16)
  g.fillStyle = '#ff9a1a'
  g.fillRect(6, 18, 10, 10)
  g.fillStyle = '#ffe08a'
  g.fillRect(32, 18, 8, 10)
}

export function showDamage(layer, renderer, camera, point, amount) {
  if (amount <= 0) return
  const v = point.clone().project(camera)
  const x = (v.x * 0.5 + 0.5) * renderer.domElement.clientWidth
  const y = (-v.y * 0.5 + 0.5) * renderer.domElement.clientHeight
  const el = document.createElement('div')
  el.className = 'dmg'
  el.textContent = String(amount)
  el.style.left = `${x}px`
  el.style.top = `${y}px`
  layer.appendChild(el)
  setTimeout(() => el.remove(), 560)
}

export function bindHud() {
  return {
    fps: document.getElementById('fps'),
    hpFill: document.getElementById('hpFill'),
    hpText: document.getElementById('hpText'),
    weaponName: document.getElementById('weaponName'),
    ammo: document.getElementById('ammo'),
    slots: [...document.querySelectorAll('.slot')],
    crosshair: document.getElementById('crosshair'),
    reloadWrap: document.getElementById('reloadWrap'),
    reloadArc: document.getElementById('reloadArc'),
    overlay: document.getElementById('overlay'),
    dmgLayer: document.getElementById('dmgLayer'),
  }
}

export function syncHud(hud, player, loadout, weapon, fps) {
  hud.fps.textContent = `${fps} FPS`
  hud.hpFill.style.width = `${player.hp}%`
  hud.hpText.textContent = `${player.hp | 0}/100`
  hud.weaponName.textContent = weapon.name
  hud.ammo.textContent = `${loadout.ammo[loadout.slot]} / ${weapon.mag}`
  hud.ammo.classList.toggle('low', loadout.ammo[loadout.slot] <= Math.ceil(weapon.mag * 0.25))
  hud.slots.forEach((s, i) => s.classList.toggle('active', i === loadout.slot))
  hud.crosshair.className = `hud ${weapon.crosshair}`
  if (loadout.reloading) {
    hud.reloadWrap.classList.add('show')
    const t = loadout.reloadT / loadout.reloadDur
    hud.reloadArc.style.strokeDashoffset = String(88 * (1 - t))
  } else {
    hud.reloadWrap.classList.remove('show')
  }
}
