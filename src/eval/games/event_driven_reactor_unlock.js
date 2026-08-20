import { THREE, run, ground, walls, box, makeLabel, pick, len2, norm2, moveXZ, lookXZ, orthoCamera } from '../engine.js'

function createEventBus() {
  const listeners = new Map()
  return {
    on(type, fn) {
      if (!listeners.has(type)) listeners.set(type, new Set())
      listeners.get(type).add(fn)
      return () => listeners.get(type)?.delete(fn)
    },
    emit(type, payload) {
      for (const fn of [...(listeners.get(type) || [])]) fn(payload)
    },
    clear() {
      listeners.clear()
    },
  }
}

function disposeTree(root) {
  root.traverse((node) => {
    node.geometry?.dispose()
    if (Array.isArray(node.material)) {
      for (const material of node.material) {
        material.map?.dispose()
        material.dispose()
      }
    } else if (node.material) {
      node.material.map?.dispose()
      node.material.dispose()
    }
  })
  root.removeFromParent()
}

export function start() {
  const camera = orthoCamera(15, 25)
  camera.position.set(0, 24, 11)
  camera.lookAt(0, 0, 0)
  return run('event_driven_reactor_unlock', {
    bg: 0x0e1828,
    camera,
  }, (app) => {
    const { scene, input, hud } = app
    ground(scene, { s: 28, color: 0x243542 })
    walls(scene, 28, 3.2, 0.55, 0x536170)
    const player = box(scene, {
      w: 1.1, h: 1.7, d: 1.1, color: 0x5aa8ff,
      x: 0, y: 0.4, z: 7, y0: true,
    })
    const door = box(scene, {
      w: 5.5, h: 3.6, d: 0.55, color: 0xd65a46,
      x: 0, y: 0.4, z: -13.72, y0: true, metal: 0.35,
    })
    const exitGlow = box(scene, {
      w: 4.5, h: 0.05, d: 2.8, color: 0x48e89a,
      x: 0, y: 0.42, z: -11.8,
    })
    exitGlow.visible = false

    const locations = [
      { id: 'A', x: -8, z: 3, color: 0x56a8ff },
      { id: 'B', x: 0, z: -5, color: 0xffc84d },
      { id: 'C', x: 8, z: 3, color: 0xc269ff },
    ]
    let generation = 0
    let activeSet = null
    let doorOpen = false

    function createReactors() {
      generation++
      const bus = createEventBus()
      const roots = []
      const clickables = []
      const started = new Set()
      const triggerLog = []
      let unlocked = false

      const unsubs = [
        bus.on('reactor:start', ({ id }) => {
          triggerLog.push(id)
          hud.flash(`Reactor ${id} Started`)
          hud.setStats(`实体事件顺序: ${triggerLog.join(' → ')}\n${triggerLog.length}/3 反应堆已启动\nR 重置事件场景`)
          if (started.size === 3) bus.emit('scene:unlock')
        }),
        bus.on('scene:unlock', () => {
          if (unlocked) return
          unlocked = true
          doorOpen = true
          exitGlow.visible = true
          hud.flash('Exit Unlocked', 1600)
        }),
      ]

      for (const info of locations) {
        const root = new THREE.Group()
        root.position.set(info.x, 0.4, info.z)
        const base = new THREE.Mesh(
          new THREE.CylinderGeometry(1.5, 1.8, 0.7, 20),
          new THREE.MeshStandardMaterial({ color: 0x303b48, metalness: 0.55, roughness: 0.38 }),
        )
        base.position.y = 0.35
        const coreMaterial = new THREE.MeshStandardMaterial({
          color: 0x402f38,
          emissive: 0x16070a,
          roughness: 0.3,
        })
        const core = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.82, 2.2, 20), coreMaterial)
        core.position.y = 1.55
        core.castShadow = true
        const label = makeLabel(`REACTOR ${info.id}`, { scale: 2.7 })
        label.position.y = 3.5
        root.add(base, core, label)
        scene.add(root)
        roots.push(root)
        clickables.push(core)
        core.userData.activate = () => {
          if (started.has(info.id)) {
            hud.flash(`Reactor ${info.id} 已启动`)
            return
          }
          started.add(info.id)
          coreMaterial.color.set(info.color)
          coreMaterial.emissive.set(info.color).multiplyScalar(0.35)
          bus.emit('reactor:start', { id: info.id, generation })
        }
      }

      hud.setStats('实体事件顺序: （空）\n0/3 反应堆已启动\nR 重置事件场景')
      return {
        clickables,
        destroy() {
          for (const unsubscribe of unsubs) unsubscribe()
          bus.clear()
          for (const root of roots) disposeTree(root)
        },
      }
    }

    function reset() {
      activeSet?.destroy()
      doorOpen = false
      door.position.y = 2.2
      exitGlow.visible = false
      activeSet = createReactors()
      hud.flash('新反应堆组已创建')
    }

    activeSet = createReactors()

    return {
      update(dt) {
        const axis = input.wasd()
        const movement = len2(axis.x, axis.z) > 1 ? norm2(axis.x, axis.z) : axis
        moveXZ(player, movement.x, movement.z, dt, 7.5, 12.6)
        lookXZ(player, movement.x, movement.z)

        if (input.mouse.justDown) {
          const hit = pick(camera, input.mouse.ndc, activeSet.clickables)
          hit?.object?.userData.activate?.()
        }
        if (input.hit('KeyR')) reset()

        const targetY = doorOpen ? 6.3 : 2.2
        door.position.y += (targetY - door.position.y) * (1 - Math.exp(-7 * dt))
      },
      cleanup() {
        activeSet?.destroy()
      },
    }
  })
}
