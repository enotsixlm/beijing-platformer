import { THREE, run, box, ground, clamp, norm2 } from '../engine.js'

export function start() {
  return run('savestate_save_load_hotkey', {
    bg: 0xb9ddf2,
    camPos: [10, 12, 14],
    lookAt: [0, 0, 0],
    hint: '方向键移动 · F5 保存到 slot1 · F9 读取 slot1',
  }, ({ scene, camera, input, hud }) => {
    ground(scene, { s: 30, color: 0x6a9b59, y: 0 })
    for (let i = -12; i <= 12; i += 4) {
      box(scene, { w: 0.06, h: 0.015, d: 26, color: 0x83ae73, x: i, y: 0.42, cast: false })
      box(scene, { w: 26, h: 0.015, d: 0.06, color: 0x83ae73, z: i, y: 0.42, cast: false })
    }
    const player = box(scene, { w: 1.4, h: 1.4, d: 1.4, color: 0x347fda, x: 0, y: 0.4, z: 0, y0: true })
    const arrow = new THREE.Mesh(
      new THREE.ConeGeometry(0.35, 0.8, 4),
      new THREE.MeshStandardMaterial({ color: 0xffdc62 }),
    )
    arrow.rotation.x = Math.PI / 2
    arrow.position.set(0, 1.25, -0.8)
    player.add(arrow)

    const scoreText = document.createElement('div')
    scoreText.style.cssText = 'position:fixed;left:18px;top:88px;z-index:20;padding:10px 15px;background:#0b163ddd;border:1px solid #79bfff;border-radius:8px;color:white;font:bold 22px monospace;pointer-events:none'
    scoreText.textContent = 'ScoreText: 0'
    document.body.append(scoreText)

    let score = 0
    let secondClock = 0
    let loadTimer = 0
    let slotStatus = 'slot1: empty or unknown'

    try {
      if (localStorage.getItem('slot1')) slotStatus = 'slot1: saved'
    } catch {
      slotStatus = 'slot1: unavailable'
    }

    const preventHotkeyDefaults = (event) => {
      if (event.code === 'F5' || event.code === 'F9') event.preventDefault()
    }
    window.addEventListener('keydown', preventHotkeyDefaults)

    function save() {
      const data = {
        x: player.position.x,
        y: player.position.y,
        z: player.position.z,
        score,
        secondClock,
      }
      try {
        localStorage.setItem('slot1', JSON.stringify(data))
        slotStatus = 'slot1: saved'
        hud.flash('Saved → slot1')
      } catch {
        slotStatus = 'slot1: unavailable'
        hud.flash('Save failed')
      }
    }

    function load() {
      try {
        const raw = localStorage.getItem('slot1')
        if (!raw) {
          hud.flash('slot1 is empty')
          return false
        }
        const data = JSON.parse(raw)
        if (![data.x, data.y, data.z, data.score].every(Number.isFinite)) throw new Error('bad save')
        player.position.set(data.x, data.y, data.z)
        score = data.score
        secondClock = Number.isFinite(data.secondClock) ? data.secondClock : 0
        scoreText.textContent = `ScoreText: ${score}`
        slotStatus = 'slot1: loaded'
        loadTimer = 0.5
        hud.showOverlay('Loaded')
        return true
      } catch {
        hud.flash('slot1 is invalid')
        return false
      }
    }

    return {
      update(dt) {
        if (input.hit('F5')) save()
        const loadedThisFrame = input.hit('F9') && load()

        const axis = input.arrows()
        if (!loadedThisFrame && (axis.x || axis.z)) {
          const n = norm2(axis.x, axis.z)
          player.position.x = clamp(player.position.x + n.x * 6 * dt, -13, 13)
          player.position.z = clamp(player.position.z + n.z * 6 * dt, -13, 13)
          player.rotation.y = Math.atan2(n.x, n.z)
        }

        if (!loadedThisFrame) {
          secondClock += dt
          while (secondClock >= 1) {
            secondClock -= 1
            score++
            scoreText.textContent = `ScoreText: ${score}`
          }
        }

        if (loadTimer > 0) {
          loadTimer -= dt
          if (loadTimer <= 0) hud.hideOverlay()
        }

        const desired = new THREE.Vector3(player.position.x + 10, 12, player.position.z + 14)
        camera.position.lerp(desired, 1 - Math.exp(-4 * dt))
        camera.lookAt(player.position.x, 0.6, player.position.z)
        hud.setStats(`${slotStatus}  ·  Position ${player.position.x.toFixed(2)}, ${player.position.z.toFixed(2)}`)
      },
      cleanup() {
        window.removeEventListener('keydown', preventHotkeyDefaults)
        scoreText.remove()
        hud.hideOverlay()
      },
    }
  })
}
