import {
  THREE, run, box, ground, pick, clamp, lerp, seedRand, orthoCamera
} from '../engine.js'

const COLORS = [0xe84b4b, 0x3f79e8, 0x45bf69]

export function start() {
  const camera = orthoCamera(6.5, 16)
  camera.up.set(0, 0, -1)
  camera.position.set(0, 16, 0.01)
  camera.lookAt(0, 0, 0)

  return run('match3_swap_two_adjacent', {
    camera,
    bg: 0x17233c,
  }, (app) => {
    const { scene, input, hud } = app
    ground(scene, { s: 13, color: 0x263754, y: -0.35 })
    box(scene, { w: 6.5, h: 0.22, d: 6.5, color: 0x111a2d, y: -0.08 })

    const random = seedRand(12025)
    const cells = Array.from({ length: 5 }, () => Array(5))
    const cubes = []

    function randomColor() {
      return Math.floor(random() * COLORS.length)
    }

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        let color = randomColor()
        while (
          (col >= 2 && cells[row][col - 1].color === color && cells[row][col - 2].color === color)
          || (row >= 2 && cells[row - 1][col].color === color && cells[row - 2][col].color === color)
        ) color = randomColor()

        const mesh = box(scene, {
          w: 0.92, h: 0.7, d: 0.92,
          color: COLORS[color],
          x: col - 2, y: 0.38, z: row - 2,
        })
        mesh.userData.row = row
        mesh.userData.col = col
        mesh.userData.baseZ = row - 2
        const cell = { row, col, color, mesh, removed: false }
        cells[row][col] = cell
        cubes.push(mesh)
      }
    }

    let selected = null
    let score = 0
    let busy = false
    let phaseTimer = 0
    let finished = false

    function setSelected(cell) {
      if (selected) {
        selected.mesh.material.emissive.setHex(0x000000)
        selected.mesh.scale.setScalar(1)
      }
      selected = cell
      if (selected) {
        selected.mesh.material.emissive.setHex(0xffd94a)
        selected.mesh.material.emissiveIntensity = 0.85
        selected.mesh.scale.setScalar(1.12)
      }
    }

    function findMatches() {
      const matches = new Set()
      for (let row = 0; row < 5; row++) {
        let start = 0
        for (let col = 1; col <= 5; col++) {
          if (col < 5 && cells[row][col].color === cells[row][start].color) continue
          if (col - start >= 3) {
            for (let c = start; c < col; c++) matches.add(cells[row][c])
          }
          start = col
        }
      }
      for (let col = 0; col < 5; col++) {
        let start = 0
        for (let row = 1; row <= 5; row++) {
          if (row < 5 && cells[row][col].color === cells[start][col].color) continue
          if (row - start >= 3) {
            for (let r = start; r < row; r++) matches.add(cells[r][col])
          }
          start = row
        }
      }
      return matches
    }

    function beginResolve() {
      const matches = findMatches()
      if (!matches.size) {
        busy = false
        return
      }
      busy = true
      phaseTimer = 0.18
      matches.forEach((cell) => {
        cell.removed = true
        cell.mesh.scale.setScalar(0.15)
        cell.mesh.material.emissive.setHex(0xffffff)
      })
      score += matches.size
      if (score >= 10 && !finished) {
        finished = true
        hud.showOverlay('完成', `获得 ${score} 分`)
      }
    }

    function collapse() {
      for (let col = 0; col < 5; col++) {
        const survivors = []
        for (let row = 4; row >= 0; row--) {
          const cell = cells[row][col]
          if (!cell.removed) survivors.push({ color: cell.color, from: row })
        }
        let sourceIndex = 0
        for (let row = 4; row >= 0; row--) {
          const cell = cells[row][col]
          let item = survivors[sourceIndex++]
          if (!item) {
            item = { color: randomColor(), from: -1 - (sourceIndex - survivors.length) }
          }
          cell.color = item.color
          cell.removed = false
          cell.mesh.material.color.setHex(COLORS[item.color])
          cell.mesh.material.emissive.setHex(0x000000)
          cell.mesh.visible = true
          cell.mesh.scale.setScalar(1)
          cell.mesh.position.z = item.from - 2
          cell.mesh.userData.baseZ = row - 2
        }
      }
      phaseTimer = 0.28
    }

    function swap(a, b) {
      const color = a.color
      a.color = b.color
      b.color = color
      a.mesh.material.color.setHex(COLORS[a.color])
      b.mesh.material.color.setHex(COLORS[b.color])
      setSelected(null)
      beginResolve()
    }

    function clickCell() {
      if (busy || finished) return
      const hit = pick(camera, input.mouse.ndc, cubes)
      if (!hit) {
        setSelected(null)
        return
      }
      const mesh = hit.object
      const cell = cells[mesh.userData.row][mesh.userData.col]
      if (!selected) {
        setSelected(cell)
        return
      }
      if (cell === selected) {
        setSelected(null)
        return
      }
      const adjacent = Math.abs(cell.row - selected.row) + Math.abs(cell.col - selected.col) === 1
      if (!adjacent) {
        setSelected(cell)
        return
      }
      swap(selected, cell)
    }

    return {
      update(dt) {
        if (input.mouse.justDown) clickCell()

        if (busy) {
          phaseTimer -= dt
          let moving = false
          for (const mesh of cubes) {
            const dz = mesh.userData.baseZ - mesh.position.z
            if (Math.abs(dz) > 0.01) {
              mesh.position.z = lerp(mesh.position.z, mesh.userData.baseZ, clamp(dt * 14, 0, 1))
              moving = true
            } else {
              mesh.position.z = mesh.userData.baseZ
            }
          }
          if (phaseTimer <= 0) {
            const hasRemoved = cells.some((row) => row.some((cell) => cell.removed))
            if (hasRemoved) {
              collapse()
            } else if (!moving) {
              const cascades = findMatches()
              if (cascades.size) beginResolve()
              else busy = false
            } else {
              phaseTimer = 0.05
            }
          }
        }

        hud.setStats(`分数：${score}`)
      },
      cleanup() {},
    }
  })
}
