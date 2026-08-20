import { THREE, run, box, ground, walls, makeLabel, norm2, moveXZ, lookXZ, panel, orthoCamera, BASE } from '../engine.js'

const HOTKEY_IDS = ['scout', 'tank', 'runner']

export function start() {
  const camera = orthoCamera(9.5, 18)
  return run('table_driven_enemy_arena', {
    camera,
    bg: 0x101827,
    hint: 'WASD 移动 · 左键造成 25 伤害 · 1/2/3 按数据表行切换敌人',
  }, ({ scene, input, hud }) => {
    ground(scene, { s: 22, color: 0x293d3b, y: -0.4 })
    walls(scene, 22, 1.1, 0.35, 0x465a68)

    for (const [x, z, color] of [[-6, -5, 0x355c72], [6, -4, 0x634a6a], [-5, 5, 0x51633f], [6, 5, 0x6b5639]]) {
      box(scene, { w: 1.2, h: 0.25, d: 1.2, color, x, y: 0, z, y0: true })
    }

    const player = box(scene, {
      w: 0.9, h: 1.15, d: 0.9, color: 0x72a7ff,
      x: 0, y: 0, z: 3.5, y0: true,
    })
    const playerMark = new THREE.Mesh(
      new THREE.ConeGeometry(0.16, 0.55, 5),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x5060aa }),
    )
    playerMark.rotation.x = Math.PI / 2
    playerMark.position.set(0, 0.35, 0.57)
    player.add(playerMark)

    const controls = panel(
      '<button data-reload>Reload Data</button><div data-status style="margin-top:7px;font-size:12px;color:#b9c9ea">Loading Enemy Data</div>',
      'right:18px;top:58px;min-width:180px',
    )
    const reloadButton = controls.querySelector('[data-reload]')
    const loadStatus = controls.querySelector('[data-status]')
    for (const eventName of ['pointerdown', 'mousedown']) {
      controls.addEventListener(eventName, (event) => {
        event.stopPropagation()
        if (eventName === 'pointerdown') event.preventDefault()
      })
    }

    let rows = []
    let enemy = null
    let score = 0
    let initialReady = false
    let loading = false
    let loadMessage = 'Loading Enemy Data'
    let requestVersion = 0
    let active = true
    let controller = null

    function removeEnemy() {
      if (!enemy) return
      scene.remove(enemy.mesh, enemy.label)
      enemy.label.material.map.dispose()
      enemy.label.material.dispose()
      enemy.mesh.geometry.dispose()
      enemy.mesh.material.dispose()
      enemy = null
    }

    function refreshEnemyLabel() {
      if (!enemy) return
      if (enemy.label) {
        scene.remove(enemy.label)
        enemy.label.material.map.dispose()
        enemy.label.material.dispose()
      }
      enemy.label = makeLabel(`${enemy.row.displayName}  ${enemy.hp}/${enemy.row.maxHp}`, {
        color: enemy.row.color,
        scale: 2.25,
      })
      enemy.label.position.set(enemy.mesh.position.x, 1.75, enemy.mesh.position.z)
      scene.add(enemy.label)
    }

    function spawnEnemy(row) {
      removeEnemy()
      const mesh = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.52, 0.72, 5, 10),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(row.color),
          emissive: new THREE.Color(row.color).multiplyScalar(0.18),
        }),
      )
      mesh.position.set(0, 0.86, -4.5)
      mesh.castShadow = true
      scene.add(mesh)
      enemy = { row, mesh, hp: row.maxHp, label: null, hitPulse: 0 }
      refreshEnemyLabel()
    }

    function validateTable(data) {
      if (!data || !Array.isArray(data.enemies) || data.enemies.length < 1) {
        throw new Error('enemies 数组缺失')
      }
      const ids = new Set()
      return data.enemies.map((row) => {
        if (!row || typeof row.id !== 'string' || typeof row.displayName !== 'string'
          || typeof row.color !== 'string' || !Number.isFinite(row.maxHp)
          || !Number.isFinite(row.moveSpeed) || !Number.isFinite(row.score)
          || row.maxHp <= 0 || row.moveSpeed < 0) {
          throw new Error('敌人行字段无效')
        }
        if (ids.has(row.id)) throw new Error(`重复 id: ${row.id}`)
        ids.add(row.id)
        return Object.freeze({
          id: row.id,
          displayName: row.displayName,
          color: row.color,
          maxHp: row.maxHp,
          moveSpeed: row.moveSpeed,
          score: row.score,
        })
      })
    }

    async function loadData(useInvalidUrl = false) {
      const version = ++requestVersion
      controller?.abort()
      controller = new AbortController()
      loading = true
      loadMessage = useInvalidUrl ? 'Testing invalid data URL…' : 'Loading Enemy Data'
      loadStatus.textContent = loadMessage
      if (!initialReady) hud.setStats('Loading Enemy Data')
      try {
        const url = useInvalidUrl
          ? `${BASE}eval-data/enemies.invalid.json?failure=${Date.now()}`
          : `${BASE}eval-data/enemies.json`
        const response = await fetch(url, { signal: controller.signal, cache: 'no-store' })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const nextRows = validateTable(await response.json())
        if (!active || version !== requestVersion) return
        const currentId = enemy?.row.id
        rows = nextRows
        const nextRow = rows.find((row) => row.id === currentId) || rows[0]
        spawnEnemy(nextRow)
        initialReady = true
        loading = false
        loadMessage = `Loaded ${rows.length} rows`
        loadStatus.textContent = loadMessage
        hud.flash('Enemy Data 已加载')
      } catch (error) {
        if (!active || version !== requestVersion || error.name === 'AbortError') return
        loading = false
        loadMessage = `可恢复错误: ${error.message}`
        loadStatus.textContent = loadMessage
        hud.flash('加载失败，保留上一版数据', 1700)
        if (!initialReady) hud.setStats(`Loading Enemy Data\n可恢复错误: ${error.message}`)
      }
    }

    reloadButton.addEventListener('click', (event) => loadData(event.shiftKey))
    loadData(false)

    function switchRow(id) {
      const row = rows.find((entry) => entry.id === id)
      if (!initialReady || !row) return
      spawnEnemy(row)
      hud.flash(`切换到 ${row.id}`)
    }

    function hitEnemy() {
      if (!enemy || enemy.hp <= 0) return
      enemy.hp = Math.max(0, enemy.hp - 25)
      enemy.hitPulse = 0.14
      refreshEnemyLabel()
      if (enemy.hp <= 0) {
        const defeatedRow = enemy.row
        score += defeatedRow.score
        hud.flash(`${defeatedRow.displayName} 击败  +${defeatedRow.score}`)
        spawnEnemy(defeatedRow)
      }
    }

    return {
      update(dt) {
        if (!initialReady) return

        const axis = input.wasd()
        if (axis.x || axis.z) {
          const direction = norm2(axis.x, axis.z)
          moveXZ(player, direction.x, direction.z, dt, 6.5, 9.7)
          lookXZ(player, direction.x, direction.z)
        }

        for (let i = 0; i < HOTKEY_IDS.length; i += 1) {
          if (input.hit(`Digit${i + 1}`)) switchRow(HOTKEY_IDS[i])
        }
        if (input.mouse.justDown) hitEnemy()

        if (enemy) {
          const dx = player.position.x - enemy.mesh.position.x
          const dz = player.position.z - enemy.mesh.position.z
          const distance = Math.hypot(dx, dz)
          if (distance > 2.35) {
            const direction = norm2(dx, dz)
            const step = Math.min(dt * enemy.row.moveSpeed, distance - 2.35)
            enemy.mesh.position.x += direction.x * step
            enemy.mesh.position.z += direction.z * step
            lookXZ(enemy.mesh, direction.x, direction.z)
          } else {
            enemy.mesh.rotation.y += dt * 1.4
          }
          enemy.label.position.set(enemy.mesh.position.x, 1.75, enemy.mesh.position.z)
          enemy.hitPulse = Math.max(0, enemy.hitPulse - dt)
          const pulse = enemy.hitPulse > 0 ? 1.25 : 1
          enemy.mesh.scale.lerp(new THREE.Vector3(pulse, pulse, pulse), 1 - Math.exp(-dt * 18))
        }

        const row = enemy?.row
        const shortcuts = HOTKEY_IDS
          .map((id, i) => rows.some((entry) => entry.id === id) ? `${i + 1}:${id}` : '')
          .filter(Boolean)
          .join('  ')
        hud.setStats(
          `Score: ${score}\n`
          + `Row: ${row.id} / ${row.displayName}\n`
          + `HP: ${enemy.hp} / ${row.maxHp}  Speed: ${row.moveSpeed}  Kill Score: ${row.score}\n`
          + `${shortcuts}\n${loadMessage}`,
        )
      },
      cleanup() {
        active = false
        requestVersion += 1
        controller?.abort()
        controls.remove()
        removeEnemy()
      },
    }
  })
}
