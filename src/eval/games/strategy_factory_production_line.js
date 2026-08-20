import { THREE, run, box, ground, makeLabel, pick, orthoCamera } from '../engine.js'

const COLS = 8
const ROWS = 6
const CELL = 1.55
const MINE = { c: 0, r: 2 }
const WAREHOUSE = { c: 7, r: 2 }
const DIRS = [
  { x: 0, z: -1, name: '↑' },
  { x: 1, z: 0, name: '→' },
  { x: 0, z: 1, name: '↓' },
  { x: -1, z: 0, name: '←' },
]

export function start() {
  const camera = orthoCamera(6.8, 15)
  camera.position.z = 0.001

  return run('strategy_factory_production_line', {
    camera,
    bg: 0x111827,
    hint: '选择建筑后点击格子放置 · R 旋转传送带 · 右键拆除',
  }, ({ scene, camera: cam, input, hud }) => {
    ground(scene, { s: 18, color: 0x273445, y: -0.4 })

    const cells = []
    const buildings = new Map()
    const items = []
    const xOf = (c) => (c - (COLS - 1) / 2) * CELL
    const zOf = (r) => (r - (ROWS - 1) / 2) * CELL
    const key = (c, r) => `${c},${r}`

    for (let r = 0; r < ROWS; r += 1) {
      for (let c = 0; c < COLS; c += 1) {
        const special = c === MINE.c && r === MINE.r
          ? 0x365b73
          : c === WAREHOUSE.c && r === WAREHOUSE.r ? 0x5f5133 : 0x344256
        const tile = box(scene, {
          w: CELL - 0.08, h: 0.08, d: CELL - 0.08,
          color: special, x: xOf(c), y: 0, z: zOf(r), y0: true,
          cast: false,
        })
        tile.userData.cell = { c, r }
        cells.push(tile)
      }
    }

    const mineRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.45, 0.12, 8, 20),
      new THREE.MeshStandardMaterial({ color: 0x59c8ff, emissive: 0x123a55 }),
    )
    mineRing.rotation.x = Math.PI / 2
    mineRing.position.set(xOf(MINE.c), 0.18, zOf(MINE.r))
    scene.add(mineRing)
    const mineLabel = makeLabel('矿脉 MINE', { color: '#7ddcff', scale: 2 })
    mineLabel.position.set(xOf(MINE.c), 1.65, zOf(MINE.r))
    scene.add(mineLabel)

    const warehouseMesh = box(scene, {
      w: 1.22, h: 1.35, d: 1.22, color: 0xd6a84d,
      x: xOf(WAREHOUSE.c), y: 0.08, z: zOf(WAREHOUSE.r), y0: true,
    })
    const warehouseLabel = makeLabel('仓库', { color: '#ffe09a', scale: 1.7 })
    warehouseLabel.position.set(xOf(WAREHOUSE.c), 1.85, zOf(WAREHOUSE.r))
    scene.add(warehouseLabel)
    buildings.set(key(WAREHOUSE.c, WAREHOUSE.r), {
      type: 'warehouse', c: WAREHOUSE.c, r: WAREHOUSE.r, mesh: warehouseMesh,
    })

    const ui = document.createElement('div')
    ui.className = 'ui-panel'
    ui.style.cssText = 'left:50%;bottom:48px;transform:translateX(-50%);display:flex;gap:8px;align-items:center'
    ui.innerHTML = `
      <button data-kind="miner">⛏ Miner</button>
      <button data-kind="belt">➜ Belt</button>
      <button data-kind="furnace">♨ Furnace</button>
      <span data-facing style="min-width:76px;color:#bcd0ff;font-size:12px"></span>
    `
    document.body.append(ui)
    ui.addEventListener('pointerdown', (event) => event.stopPropagation())

    let selected = 'belt'
    let beltDir = 1
    let warehouseCount = 0

    function refreshButtons() {
      ui.querySelectorAll('button').forEach((button) => {
        button.style.background = button.dataset.kind === selected ? '#5578db' : '#263d79'
      })
      ui.querySelector('[data-facing]').textContent =
        selected === 'belt' ? `方向 ${DIRS[beltDir].name} (R)` : ''
    }
    ui.addEventListener('click', (event) => {
      const kind = event.target.closest('button')?.dataset.kind
      if (kind) {
        selected = kind
        refreshButtons()
      }
    })
    refreshButtons()

    function addArrow(parent, dir) {
      const arrow = new THREE.Mesh(
        new THREE.ConeGeometry(0.2, 0.58, 4),
        new THREE.MeshStandardMaterial({ color: 0xffef76, emissive: 0x665500 }),
      )
      arrow.rotation.x = Math.PI / 2
      arrow.rotation.z = -dir * Math.PI / 2
      arrow.position.y = 0.34
      parent.add(arrow)
      return arrow
    }

    function place(type, c, r) {
      const k = key(c, r)
      if (buildings.has(k)) {
        hud.flash('格子已被占用')
        return
      }
      let mesh
      const x = xOf(c)
      const z = zOf(r)
      if (type === 'miner') {
        mesh = box(scene, { w: 1.08, h: 0.72, d: 1.08, color: 0x4290b9, x, y: 0.08, z, y0: true })
        const drill = new THREE.Mesh(
          new THREE.ConeGeometry(0.2, 0.65, 8),
          new THREE.MeshStandardMaterial({ color: 0xdaf4ff, metalness: 0.7 }),
        )
        drill.rotation.z = -Math.PI / 2
        drill.position.set(0.45, 0.1, 0)
        mesh.add(drill)
      } else if (type === 'belt') {
        mesh = box(scene, { w: 1.26, h: 0.22, d: 1.26, color: 0x53647a, x, y: 0.08, z, y0: true })
        addArrow(mesh, beltDir)
      } else {
        mesh = box(scene, { w: 1.15, h: 1.05, d: 1.15, color: 0xbb6044, x, y: 0.08, z, y0: true })
        const chimney = box(scene, { w: 0.25, h: 0.55, d: 0.25, color: 0x4b5563, x, y: 0, z: 0, y0: true })
        scene.remove(chimney)
        chimney.position.set(0.3, 0.75, 0.3)
        mesh.add(chimney)
      }
      buildings.set(k, { type, c, r, mesh, dir: type === 'belt' ? beltDir : 1, timer: 0 })
      if (type === 'miner' && (c !== MINE.c || r !== MINE.r)) {
        hud.flash('Miner 只有放在矿脉上才会产矿')
      }
    }

    function removeBuilding(c, r) {
      const k = key(c, r)
      const building = buildings.get(k)
      if (!building || building.type === 'warehouse') return
      scene.remove(building.mesh)
      buildings.delete(k)
      hud.flash('建筑已拆除')
    }

    function spawnOre(building) {
      const occupied = items.some((item) => item.c === building.c && item.r === building.r && !item.moving)
      if (occupied) return
      const mesh = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.22),
        new THREE.MeshStandardMaterial({ color: 0x6ec8ff, emissive: 0x123a55 }),
      )
      mesh.position.set(xOf(building.c), 0.65, zOf(building.r))
      scene.add(mesh)
      items.push({ c: building.c, r: building.r, mesh, kind: 'ore', moving: false, progress: 0 })
    }

    function removeItem(item) {
      scene.remove(item.mesh)
      const index = items.indexOf(item)
      if (index >= 0) items.splice(index, 1)
    }

    function tryMove(item) {
      if (item.moving) return
      const building = buildings.get(key(item.c, item.r))
      if (!building || building.type === 'warehouse') return
      const dirIndex = building.type === 'belt' ? building.dir : 1
      const dir = DIRS[dirIndex]
      const nc = item.c + dir.x
      const nr = item.r + dir.z
      if (nc < 0 || nc >= COLS || nr < 0 || nr >= ROWS) return
      const next = buildings.get(key(nc, nr))
      if (!next || next.type === 'miner') return
      const occupied = items.some((other) =>
        other !== item && ((other.c === nc && other.r === nr && !other.moving)
          || (other.moving && other.toC === nc && other.toR === nr)))
      if (occupied) return
      item.moving = true
      item.progress = 0
      item.fromX = xOf(item.c)
      item.fromZ = zOf(item.r)
      item.toC = nc
      item.toR = nr
    }

    let visualTime = 0
    return {
      update(dt) {
        visualTime += dt
        if (input.hit('KeyR') && selected === 'belt') {
          beltDir = (beltDir + 1) % DIRS.length
          refreshButtons()
          hud.flash(`传送带方向 ${DIRS[beltDir].name}`)
        }

        if (input.mouse.justDown || input.mouse.justRight) {
          const hit = pick(cam, input.mouse.ndc, cells)
          const cell = hit?.object.userData.cell
          if (cell) {
            if (input.mouse.justRight) removeBuilding(cell.c, cell.r)
            else place(selected, cell.c, cell.r)
          }
        }

        for (const building of buildings.values()) {
          if (building.type !== 'miner') continue
          if (building.c !== MINE.c || building.r !== MINE.r) continue
          building.timer += dt
          if (building.timer >= 1.35) {
            building.timer %= 1.35
            spawnOre(building)
          }
          building.mesh.rotation.y = Math.sin(visualTime * 3) * 0.03
        }

        for (const item of [...items]) {
          if (!item.moving) {
            const here = buildings.get(key(item.c, item.r))
            if (here?.type === 'furnace' && item.kind === 'ore') {
              item.kind = 'metal'
              item.mesh.material.color.set(0xffc857)
              item.mesh.material.emissive.set(0x553300)
            }
            tryMove(item)
            continue
          }
          item.progress = Math.min(1, item.progress + dt * 2.15)
          const smooth = item.progress * item.progress * (3 - 2 * item.progress)
          item.mesh.position.x = item.fromX + (xOf(item.toC) - item.fromX) * smooth
          item.mesh.position.z = item.fromZ + (zOf(item.toR) - item.fromZ) * smooth
          item.mesh.rotation.x += dt * 4
          if (item.progress >= 1) {
            item.c = item.toC
            item.r = item.toR
            item.moving = false
            if (buildings.get(key(item.c, item.r))?.type === 'warehouse') {
              warehouseCount += 1
              removeItem(item)
              hud.flash('仓库 +1')
            }
          }
        }

        hud.setStats(
          `仓库库存: ${warehouseCount}\n在途物料: ${items.length}\n已选: ${selected}${selected === 'belt' ? ` ${DIRS[beltDir].name}` : ''}`,
        )
      },
      cleanup() {
        ui.remove()
      },
    }
  })
}
