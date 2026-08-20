import { THREE, run, box, makeLabel, pick, clamp, norm2, orthoCamera } from '../engine.js'

export function start() {
  const camera = orthoCamera(17, 38)
  return run('rts_squad_control', {
    camera,
    bg: 0x17202a,
    shadows: true,
    hint: '左键点选/框选 · Shift 加减选 · 右键移动 · Ctrl+1 编队 · 双击 1 聚焦',
  }, ({ scene, camera: cam, input, hud }) => {
    const map = box(scene, { w: 72, h: 0.3, d: 72, color: 0x55734a, y: -0.3, y0: true, cast: false })
    map.receiveShadow = true

    for (let i = -30; i <= 30; i += 6) {
      const lineA = box(scene, { w: 0.05, h: 0.01, d: 66, color: 0x64835a, x: i, y: 0.01, cast: false })
      const lineB = box(scene, { w: 66, h: 0.01, d: 0.05, color: 0x64835a, z: i, y: 0.01, cast: false })
      lineA.receiveShadow = lineB.receiveShadow = true
    }

    const base = box(scene, { w: 10, h: 2.2, d: 8, color: 0x2d67a9, x: -24, y: 0, z: 24, y0: true })
    box(scene, { w: 5, h: 1.4, d: 4, color: 0x4d9de0, x: -24, y: 2.2, z: 24, y0: true })
    const baseLabel = makeLabel('FRIENDLY BASE', { color: '#aee3ff', scale: 4 })
    baseLabel.position.set(-24, 5.5, 24)
    scene.add(baseLabel)

    const buildingSpecs = [
      { x: -8, z: 12, w: 8, d: 7, h: 5, c: 0x7d6551 },
      { x: 8, z: 20, w: 7, d: 10, h: 7, c: 0x65566f },
      { x: 21, z: 7, w: 10, d: 7, h: 4, c: 0x8a7356 },
      { x: -2, z: -4, w: 9, d: 8, h: 6, c: 0x5e6672 },
      { x: -21, z: -10, w: 8, d: 12, h: 5, c: 0x766252 },
      { x: 14, z: -15, w: 12, d: 8, h: 6, c: 0x67706a },
      { x: -3, z: -25, w: 7, d: 7, h: 4, c: 0x7e5c52 },
      { x: 27, z: -27, w: 8, d: 8, h: 7, c: 0x665b71 },
    ]
    for (const b of buildingSpecs) {
      box(scene, { w: b.w, h: b.h, d: b.d, color: b.c, x: b.x, y: 0, z: b.z, y0: true })
      box(scene, { w: b.w * 0.65, h: 0.4, d: b.d * 0.65, color: 0xc0a477, x: b.x, y: b.h, z: b.z, y0: true })
    }

    const units = []
    const unitMeshes = []
    const starts = [
      [-28, 18], [-24, 18], [-20, 18],
      [-28, 14], [-24, 14], [-20, 14],
    ]
    for (let i = 0; i < starts.length; i++) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.7, 0.94, 24),
        new THREE.MeshBasicMaterial({ color: 0x76ff87, side: THREE.DoubleSide, transparent: true, opacity: 0.9 }),
      )
      ring.rotation.x = -Math.PI / 2
      ring.position.set(starts[i][0], 0.06, starts[i][1])
      ring.visible = false
      scene.add(ring)
      const mesh = box(scene, { w: 1.1, h: 1.15, d: 1.1, color: 0x45a9ef, x: starts[i][0], y: 0, z: starts[i][1], y0: true })
      mesh.userData.unitIndex = i
      unitMeshes.push(mesh)
      units.push({ mesh, ring, selected: false, path: [], target: null })
    }

    const marker = new THREE.Mesh(
      new THREE.RingGeometry(0.55, 0.82, 28),
      new THREE.MeshBasicMaterial({ color: 0xffe36b, side: THREE.DoubleSide, transparent: true, opacity: 0.9 }),
    )
    marker.rotation.x = -Math.PI / 2
    marker.position.y = 0.08
    marker.visible = false
    scene.add(marker)
    let markerLife = 0

    const dragBox = document.createElement('div')
    dragBox.style.cssText = 'position:fixed;display:none;border:2px solid #73c7ff;background:#54a8e633;pointer-events:none;z-index:30'
    document.body.append(dragBox)

    let dragStart = null
    let camX = -14
    let camZ = 14
    let zoom = 17
    let group1 = []
    let lastGroupTap = -1000
    let mouseSeen = false

    function setSelected(unit, selected) {
      unit.selected = selected
      unit.ring.visible = selected
    }

    function clearSelection() {
      for (const unit of units) setSelected(unit, false)
    }

    function selectOnly(list) {
      clearSelection()
      for (const unit of list) setSelected(unit, true)
    }

    function screenPoint(object) {
      const p = object.position.clone().project(cam)
      return { x: (p.x + 1) * innerWidth / 2, y: (1 - p.y) * innerHeight / 2 }
    }

    const GRID_STEP = 2
    const GRID_HALF = 34
    const GRID_N = 35
    function toGrid(v) {
      return clamp(Math.round((v + GRID_HALF) / GRID_STEP), 0, GRID_N - 1)
    }
    function toWorld(i) {
      return -GRID_HALF + i * GRID_STEP
    }
    function blocked(gx, gz) {
      const x = toWorld(gx)
      const z = toWorld(gz)
      return buildingSpecs.some((b) => Math.abs(x - b.x) < b.w / 2 + 1.05 && Math.abs(z - b.z) < b.d / 2 + 1.05)
    }

    function makePath(sx, sz, tx, tz) {
      const startX = toGrid(sx)
      const startZ = toGrid(sz)
      let goalX = toGrid(tx)
      let goalZ = toGrid(tz)
      if (blocked(goalX, goalZ)) {
        outer: for (let r = 1; r < 6; r++) {
          for (let dz = -r; dz <= r; dz++) {
            for (let dx = -r; dx <= r; dx++) {
              const gx = clamp(goalX + dx, 0, GRID_N - 1)
              const gz = clamp(goalZ + dz, 0, GRID_N - 1)
              if (!blocked(gx, gz)) {
                goalX = gx
                goalZ = gz
                break outer
              }
            }
          }
        }
      }
      const count = GRID_N * GRID_N
      const start = startZ * GRID_N + startX
      const goal = goalZ * GRID_N + goalX
      const came = new Int32Array(count)
      came.fill(-1)
      const cost = new Float32Array(count)
      cost.fill(Infinity)
      cost[start] = 0
      const open = [start]
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]]

      while (open.length) {
        let bestAt = 0
        let bestScore = Infinity
        for (let i = 0; i < open.length; i++) {
          const idx = open[i]
          const x = idx % GRID_N
          const z = Math.floor(idx / GRID_N)
          const score = cost[idx] + Math.abs(x - goalX) + Math.abs(z - goalZ)
          if (score < bestScore) {
            bestScore = score
            bestAt = i
          }
        }
        const current = open.splice(bestAt, 1)[0]
        if (current === goal) break
        const cx = current % GRID_N
        const cz = Math.floor(current / GRID_N)
        for (const [dx, dz] of dirs) {
          const nx = cx + dx
          const nz = cz + dz
          if (nx < 0 || nx >= GRID_N || nz < 0 || nz >= GRID_N || blocked(nx, nz)) continue
          const next = nz * GRID_N + nx
          const nextCost = cost[current] + 1
          if (nextCost >= cost[next]) continue
          cost[next] = nextCost
          came[next] = current
          if (!open.includes(next)) open.push(next)
        }
      }

      if (goal !== start && came[goal] < 0) return [{ x: tx, z: tz }]
      const cells = []
      let at = goal
      while (at !== start && at >= 0) {
        cells.push({ x: toWorld(at % GRID_N), z: toWorld(Math.floor(at / GRID_N)) })
        at = came[at]
      }
      cells.reverse()
      cells.push({ x: tx, z: tz })
      return cells
    }

    function issueMove(point) {
      const selected = units.filter((u) => u.selected)
      if (!selected.length) {
        hud.flash('先选择单位')
        return
      }
      const columns = Math.ceil(Math.sqrt(selected.length))
      selected.forEach((unit, i) => {
        const row = Math.floor(i / columns)
        const col = i % columns
        const ox = (col - (columns - 1) / 2) * 1.7
        const oz = (row - (Math.ceil(selected.length / columns) - 1) / 2) * 1.7
        const tx = clamp(point.x + ox, -33, 33)
        const tz = clamp(point.z + oz, -33, 33)
        unit.path = makePath(unit.mesh.position.x, unit.mesh.position.z, tx, tz)
      })
      marker.position.set(point.x, 0.08, point.z)
      marker.visible = true
      markerLife = 1.2
    }

    function updateProjection() {
      const aspect = innerWidth / innerHeight
      cam.left = -zoom * aspect
      cam.right = zoom * aspect
      cam.top = zoom
      cam.bottom = -zoom
      cam.userData.orthoSize = zoom
      cam.updateProjectionMatrix()
    }
    updateProjection()

    return {
      update(dt, now) {
        if (Math.abs(input.mouse.dx) + Math.abs(input.mouse.dy) > 0 || input.mouse.x > 0 || input.mouse.y > 0) mouseSeen = true

        if (input.mouse.justDown) {
          dragStart = { x: input.mouse.x, y: input.mouse.y }
          dragBox.style.display = 'block'
        }
        if (dragStart && input.mouse.down) {
          const x = Math.min(dragStart.x, input.mouse.x)
          const y = Math.min(dragStart.y, input.mouse.y)
          dragBox.style.left = `${x}px`
          dragBox.style.top = `${y}px`
          dragBox.style.width = `${Math.abs(input.mouse.x - dragStart.x)}px`
          dragBox.style.height = `${Math.abs(input.mouse.y - dragStart.y)}px`
        }
        if (dragStart && input.mouse.justUp) {
          const end = { x: input.mouse.x, y: input.mouse.y }
          const moved = Math.hypot(end.x - dragStart.x, end.y - dragStart.y)
          if (moved < 7) {
            const hit = pick(cam, input.mouse.ndc, unitMeshes)
            const unit = hit ? units[hit.object.userData.unitIndex] : null
            if (unit) {
              if (input.shift()) setSelected(unit, !unit.selected)
              else selectOnly([unit])
            } else if (!input.shift()) {
              clearSelection()
            }
          } else {
            const minX = Math.min(dragStart.x, end.x)
            const maxX = Math.max(dragStart.x, end.x)
            const minY = Math.min(dragStart.y, end.y)
            const maxY = Math.max(dragStart.y, end.y)
            if (!input.shift()) clearSelection()
            for (const unit of units) {
              const p = screenPoint(unit.mesh)
              if (p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY) setSelected(unit, true)
            }
          }
          dragStart = null
          dragBox.style.display = 'none'
        }

        if (input.mouse.justRight) {
          const hit = pick(cam, input.mouse.ndc, [map])
          if (hit) issueMove(hit.point)
        }

        if (input.hit('Digit1')) {
          if (input.ctrl()) {
            group1 = units.filter((u) => u.selected)
            hud.flash(`编队 1：${group1.length} 个单位`)
          } else if (group1.length) {
            selectOnly(group1)
            if (now - lastGroupTap < 350) {
              camX = group1.reduce((sum, u) => sum + u.mesh.position.x, 0) / group1.length
              camZ = group1.reduce((sum, u) => sum + u.mesh.position.z, 0) / group1.length
              hud.flash('镜头聚焦编队 1')
            }
            lastGroupTap = now
          }
        }

        const arrows = input.arrows()
        let panX = arrows.x
        let panZ = arrows.z
        if (mouseSeen && !dragStart) {
          if (input.mouse.x < 18) panX -= 1
          if (input.mouse.x > innerWidth - 18) panX += 1
          if (input.mouse.y < 18) panZ -= 1
          if (input.mouse.y > innerHeight - 18) panZ += 1
        }
        if (panX || panZ) {
          const n = norm2(panX, panZ)
          camX = clamp(camX + n.x * dt * zoom * 0.9, -31, 31)
          camZ = clamp(camZ + n.z * dt * zoom * 0.9, -31, 31)
        }
        if (input.mouse.wheel) {
          zoom = clamp(zoom + input.mouse.wheel * 1.6, 9, 28)
          updateProjection()
        }
        cam.position.set(camX, 38, camZ + 0.001)
        cam.lookAt(camX, 0, camZ)

        for (const unit of units) {
          if (unit.path.length) {
            const target = unit.path[0]
            const dx = target.x - unit.mesh.position.x
            const dz = target.z - unit.mesh.position.z
            const distance = Math.hypot(dx, dz)
            if (distance < 0.18) {
              unit.path.shift()
            } else {
              const n = norm2(dx, dz)
              const step = Math.min(distance, dt * 5.2)
              unit.mesh.position.x += n.x * step
              unit.mesh.position.z += n.z * step
              unit.mesh.rotation.y = Math.atan2(n.x, n.z)
            }
          }
          unit.ring.position.x = unit.mesh.position.x
          unit.ring.position.z = unit.mesh.position.z
        }

        if (markerLife > 0) {
          markerLife -= dt
          marker.scale.setScalar(1 + (1.2 - markerLife) * 0.5)
          marker.material.opacity = clamp(markerLife, 0, 0.9)
          if (markerLife <= 0) {
            marker.visible = false
            marker.scale.setScalar(1)
          }
        }
        hud.setStats(`已选择 ${units.filter((u) => u.selected).length}/6  ·  编队1 ${group1.length}  ·  缩放 ${Math.round(zoom)}`)
      },
      cleanup() {
        dragBox.remove()
      },
    }
  })
}
