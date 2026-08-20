import { THREE, run, box, ground, makeLabel, pick, orthoCamera } from '../engine.js'

const SIZE = 6
const CELL = 1.7
const BLOCKED = new Set(['2,2', '2,3', '3,1', '4,3'])
const STEPS = [
  [1, 0], [-1, 0], [0, 1], [0, -1],
]

export function start() {
  const camera = orthoCamera(6.4, 15)
  return run('strategy_turn_based_tactics_skirmish', {
    camera,
    bg: 0x141b2d,
    hint: '点击蓝方 → 选择高亮格移动 → 点击相邻红方攻击 · 每单位每回合移动/攻击各一次',
  }, ({ scene, camera: cam, input, hud }) => {
    ground(scene, { s: 15, color: 0x283346, y: -0.4 })
    const xOf = (c) => (c - (SIZE - 1) / 2) * CELL
    const zOf = (r) => (r - (SIZE - 1) / 2) * CELL
    const key = (c, r) => `${c},${r}`
    const tiles = []

    for (let r = 0; r < SIZE; r += 1) {
      for (let c = 0; c < SIZE; c += 1) {
        const blocked = BLOCKED.has(key(c, r))
        const tile = box(scene, {
          w: CELL - 0.08,
          h: blocked ? 0.7 : 0.09,
          d: CELL - 0.08,
          color: blocked ? 0x222937 : (c + r) % 2 ? 0x3a4a60 : 0x42546b,
          x: xOf(c),
          y: 0,
          z: zOf(r),
          y0: true,
          cast: blocked,
        })
        tile.userData.cell = { c, r, blocked }
        tile.userData.baseColor = tile.material.color.clone()
        tiles.push(tile)
      }
    }

    const units = []
    function addUnit(team, c, r, name) {
      const mesh = new THREE.Mesh(
        team === 'blue'
          ? new THREE.CylinderGeometry(0.48, 0.58, 0.85, 8)
          : new THREE.ConeGeometry(0.58, 1.05, 8),
        new THREE.MeshStandardMaterial({
          color: team === 'blue' ? 0x4f9dff : 0xef6262,
          emissive: team === 'blue' ? 0x102a55 : 0x4c1010,
        }),
      )
      mesh.position.set(xOf(c), 0.58, zOf(r))
      mesh.castShadow = true
      scene.add(mesh)
      const unit = { team, c, r, name, hp: 100, maxHp: 100, mesh, label: null, moved: false, attacked: false }
      mesh.userData.unit = unit
      units.push(unit)
      refreshLabel(unit)
      return unit
    }

    function refreshLabel(unit) {
      if (unit.label) {
        scene.remove(unit.label)
        unit.label.material.map.dispose()
        unit.label.material.dispose()
      }
      unit.label = makeLabel(`${unit.name}  HP ${Math.max(0, unit.hp)}`, {
        color: unit.team === 'blue' ? '#9fd0ff' : '#ffabab',
        scale: 1.75,
      })
      unit.label.position.set(unit.mesh.position.x, 1.55, unit.mesh.position.z)
      scene.add(unit.label)
    }

    addUnit('blue', 0, 5, '蓝盾')
    addUnit('blue', 1, 4, '蓝刃')
    addUnit('red', 5, 0, '红斧')
    addUnit('red', 4, 1, '红枪')

    const endPanel = document.createElement('div')
    endPanel.className = 'ui-panel'
    endPanel.style.cssText = 'right:18px;top:58px;text-align:center'
    endPanel.innerHTML = '<div data-turn style="margin-bottom:8px;font-weight:800;color:#9fc8ff">玩家回合</div><button>结束回合</button>'
    document.body.append(endPanel)
    endPanel.addEventListener('pointerdown', (event) => event.stopPropagation())

    let playerTurn = true
    let selected = null
    let reachable = new Map()
    let moveAnim = null
    let ai = null
    let ended = false

    const aliveUnits = (team) => units.filter((unit) => unit.team === team && unit.hp > 0)
    const occupied = (c, r, ignore = null) =>
      units.some((unit) => unit !== ignore && unit.hp > 0 && unit.c === c && unit.r === r)
    const valid = (c, r) =>
      c >= 0 && c < SIZE && r >= 0 && r < SIZE && !BLOCKED.has(key(c, r))

    function findReachable(unit, range = 3) {
      const found = new Map([[key(unit.c, unit.r), []]])
      const queue = [{ c: unit.c, r: unit.r, path: [] }]
      while (queue.length) {
        const current = queue.shift()
        if (current.path.length >= range) continue
        for (const [dc, dr] of STEPS) {
          const c = current.c + dc
          const r = current.r + dr
          const k = key(c, r)
          if (!valid(c, r) || occupied(c, r, unit) || found.has(k)) continue
          const path = [...current.path, { c, r }]
          found.set(k, path)
          queue.push({ c, r, path })
        }
      }
      found.delete(key(unit.c, unit.r))
      return found
    }

    function shortestPath(unit, target) {
      const seen = new Set([key(unit.c, unit.r)])
      const queue = [{ c: unit.c, r: unit.r, path: [] }]
      while (queue.length) {
        const current = queue.shift()
        for (const [dc, dr] of STEPS) {
          const c = current.c + dc
          const r = current.r + dr
          const k = key(c, r)
          if (!valid(c, r) || seen.has(k)) continue
          if (c === target.c && r === target.r) return [...current.path, { c, r }]
          if (occupied(c, r, unit)) continue
          seen.add(k)
          queue.push({ c, r, path: [...current.path, { c, r }] })
        }
      }
      return []
    }

    function paintReachable() {
      for (const tile of tiles) {
        tile.material.color.copy(tile.userData.baseColor)
        tile.material.emissive.setHex(0x000000)
        const cell = tile.userData.cell
        if (reachable.has(key(cell.c, cell.r))) {
          tile.material.color.setHex(0x3c8b72)
          tile.material.emissive.setHex(0x0c4634)
        }
      }
      if (selected?.hp > 0) selected.mesh.material.emissive.setHex(0x285caa)
      for (const unit of units) {
        if (unit !== selected && unit.hp > 0) {
          unit.mesh.material.emissive.setHex(unit.team === 'blue' ? 0x102a55 : 0x4c1010)
        }
      }
    }

    function selectUnit(unit) {
      selected = unit
      reachable = unit.moved ? new Map() : findReachable(unit)
      paintReachable()
    }

    function startMove(unit, path) {
      if (!path.length) return
      moveAnim = { unit, path: [...path] }
      unit.moved = true
      reachable = new Map()
      paintReachable()
    }

    function damage(unit, amount) {
      unit.hp = Math.max(0, unit.hp - amount)
      refreshLabel(unit)
      unit.mesh.scale.set(1.22, 0.78, 1.22)
      if (unit.hp <= 0) {
        scene.remove(unit.mesh, unit.label)
        if (selected === unit) selected = null
      }
      checkResult()
    }

    function attack(attacker, target, amount = 40) {
      if (attacker.attacked || target.hp <= 0) return
      attacker.attacked = true
      attacker.mesh.lookAt(target.mesh.position.x, attacker.mesh.position.y, target.mesh.position.z)
      damage(target, amount)
      hud.flash(`${attacker.name} 攻击 ${target.name}  -${amount}`)
    }

    function checkResult() {
      if (aliveUnits('red').length === 0) {
        ended = true
        hud.showOverlay('胜利', '所有敌军已被击败')
      } else if (aliveUnits('blue').length === 0) {
        ended = true
        hud.showOverlay('失败', '我方单位全部倒下')
      }
    }

    function updateMove(dt) {
      if (!moveAnim) return
      const { unit, path } = moveAnim
      const next = path[0]
      const tx = xOf(next.c)
      const tz = zOf(next.r)
      const dx = tx - unit.mesh.position.x
      const dz = tz - unit.mesh.position.z
      const distance = Math.hypot(dx, dz)
      const step = Math.min(distance, dt * 6.5)
      if (distance > 0.001) {
        unit.mesh.position.x += dx / distance * step
        unit.mesh.position.z += dz / distance * step
        unit.mesh.rotation.y = Math.atan2(dx, dz)
      }
      unit.label.position.set(unit.mesh.position.x, 1.55, unit.mesh.position.z)
      if (distance <= 0.04) {
        unit.mesh.position.set(tx, 0.58, tz)
        unit.c = next.c
        unit.r = next.r
        path.shift()
        if (!path.length) {
          moveAnim = null
          if (playerTurn && selected === unit) selectUnit(unit)
        }
      }
    }

    function beginEnemyTurn() {
      if (!playerTurn || ended || moveAnim) return
      playerTurn = false
      selected = null
      reachable = new Map()
      paintReachable()
      endPanel.querySelector('[data-turn]').textContent = '敌方回合'
      endPanel.querySelector('button').disabled = true
      ai = { list: [...aliveUnits('red')], index: 0, phase: 'plan', wait: 0, unit: null, target: null }
    }
    endPanel.querySelector('button').addEventListener('click', beginEnemyTurn)

    function finishEnemyUnit() {
      ai.index += 1
      ai.phase = 'plan'
      ai.wait = 0.25
      ai.unit = null
      ai.target = null
    }

    function updateAI(dt) {
      if (!ai || ended) return
      if (ai.wait > 0) {
        ai.wait -= dt
        return
      }
      if (ai.index >= ai.list.length) {
        for (const unit of aliveUnits('blue')) {
          unit.moved = false
          unit.attacked = false
        }
        playerTurn = true
        ai = null
        endPanel.querySelector('[data-turn]').textContent = '玩家回合'
        endPanel.querySelector('button').disabled = false
        hud.flash('玩家回合')
        return
      }

      if (ai.phase === 'plan') {
        const unit = ai.list[ai.index]
        if (!unit || unit.hp <= 0 || aliveUnits('blue').length === 0) {
          finishEnemyUnit()
          return
        }
        const target = aliveUnits('blue').sort((a, b) =>
          (Math.abs(a.c - unit.c) + Math.abs(a.r - unit.r))
          - (Math.abs(b.c - unit.c) + Math.abs(b.r - unit.r)))[0]
        ai.unit = unit
        ai.target = target
        const distance = Math.abs(target.c - unit.c) + Math.abs(target.r - unit.r)
        if (distance > 1) {
          const path = shortestPath(unit, target)
          path.pop()
          ai.path = path.slice(0, 2)
          ai.phase = ai.path.length ? 'move' : 'attack'
        } else {
          ai.phase = 'attack'
        }
      }

      if (ai.phase === 'move') {
        const next = ai.path[0]
        const unit = ai.unit
        const tx = xOf(next.c)
        const tz = zOf(next.r)
        const dx = tx - unit.mesh.position.x
        const dz = tz - unit.mesh.position.z
        const distance = Math.hypot(dx, dz)
        const step = Math.min(distance, dt * 5.2)
        if (distance > 0.001) {
          unit.mesh.position.x += dx / distance * step
          unit.mesh.position.z += dz / distance * step
          unit.mesh.rotation.y = Math.atan2(dx, dz)
        }
        unit.label.position.set(unit.mesh.position.x, 1.55, unit.mesh.position.z)
        if (distance <= 0.04) {
          unit.mesh.position.set(tx, 0.58, tz)
          unit.c = next.c
          unit.r = next.r
          ai.path.shift()
          if (!ai.path.length) ai.phase = 'attack'
        }
        return
      }

      if (ai.phase === 'attack') {
        const adjacent = aliveUnits('blue').filter((unit) =>
          Math.abs(unit.c - ai.unit.c) + Math.abs(unit.r - ai.unit.r) === 1)
        if (adjacent.length) {
          adjacent.sort((a, b) => a.hp - b.hp)
          attack(ai.unit, adjacent[0], 35)
        }
        ai.phase = 'done'
        ai.wait = 0.5
        return
      }
      if (ai.phase === 'done') finishEnemyUnit()
    }

    return {
      update(dt) {
        for (const unit of units) {
          if (unit.hp > 0) unit.mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 1 - Math.exp(-dt * 12))
        }
        if (moveAnim) updateMove(dt)
        else if (!playerTurn) updateAI(dt)

        if (playerTurn && !moveAnim && !ended && input.mouse.justDown) {
          const targets = [...tiles, ...aliveUnits('blue').map((unit) => unit.mesh), ...aliveUnits('red').map((unit) => unit.mesh)]
          const hit = pick(cam, input.mouse.ndc, targets)
          const unit = hit?.object.userData.unit
          if (unit?.team === 'blue') {
            selectUnit(unit)
          } else if (unit?.team === 'red' && selected && !selected.attacked) {
            const adjacent = Math.abs(unit.c - selected.c) + Math.abs(unit.r - selected.r) === 1
            if (adjacent) attack(selected, unit)
            else hud.flash('目标不在相邻格')
          } else {
            const cell = hit?.object.userData.cell
            const path = cell && reachable.get(key(cell.c, cell.r))
            if (selected && path) startMove(selected, path)
          }
        }

        const blue = aliveUnits('blue')
        const red = aliveUnits('red')
        const acted = blue.map((unit) =>
          `${unit.name}: ${unit.moved ? '已移动' : '可移动'} / ${unit.attacked ? '已攻击' : '可攻击'}`).join('\n')
        hud.setStats(`${playerTurn ? '玩家回合' : '敌方行动中'}\n蓝方 ${blue.length}  红方 ${red.length}${acted ? `\n${acted}` : ''}`)
      },
      cleanup() {
        endPanel.remove()
      },
    }
  })
}
