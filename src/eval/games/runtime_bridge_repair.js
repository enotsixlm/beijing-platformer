import { THREE, run, box, makeLabel, clamp, norm2 } from '../engine.js'

export function start() {
  return run('runtime_bridge_repair', {
    bg: 0x91c6e4,
    far: 180,
    camPos: [10, 8, 24],
    lookAt: [0, 0, 0],
    hint: 'WASD 移动 · 靠近黄色施工台按 E 建桥 · R 拆桥',
  }, ({ scene, camera, input, hud }) => {
    box(scene, { w: 60, h: 0.4, d: 80, color: 0x273948, x: 0, y: -7, z: 0, y0: true, cast: false })
    box(scene, { w: 24, h: 2, d: 18, color: 0x6f7f53, x: 0, y: -1.6, z: 15, y0: true })
    box(scene, { w: 24, h: 2, d: 18, color: 0x718455, x: 0, y: -1.6, z: -15, y0: true })
    box(scene, { w: 24, h: 5.4, d: 1.1, color: 0x765846, x: 0, y: -5.4, z: 5.9, y0: true })
    box(scene, { w: 24, h: 5.4, d: 1.1, color: 0x765846, x: 0, y: -5.4, z: -5.9, y0: true })

    for (const x of [-10, -7, 7, 10]) {
      box(scene, { w: 1.2, h: 2 + (Math.abs(x) % 3), d: 1.2, color: 0x4d6e3f, x, y: 0.4, z: 13 + (x % 2) * 3, y0: true })
      box(scene, { w: 1.2, h: 2.5, d: 1.2, color: 0x4d6e3f, x: -x, y: 0.4, z: -14 + (x % 2) * 2, y0: true })
    }

    const pad = box(scene, { w: 3.2, h: 0.22, d: 2.5, color: 0xffd23d, x: -5, y: 0.4, z: 7.4, y0: true, metal: 0.15 })
    const padLabel = makeLabel('E · BUILD BRIDGE', { color: '#ffe668', scale: 4.2 })
    padLabel.position.set(-5, 3, 7.4)
    scene.add(padLabel)

    const exitPad = box(scene, { w: 5, h: 0.12, d: 3.2, color: 0x49d17d, x: 0, y: 0.4, z: -18, y0: true })
    const exitLabel = makeLabel('EXIT', { color: '#79ff9f', scale: 2.5 })
    exitLabel.position.set(0, 3, -18)
    scene.add(exitLabel)

    const player = box(scene, { w: 1.15, h: 1.7, d: 1.15, color: 0x328deb, x: 0, y: 1.25, z: 16 })
    box(player, { w: 0.82, h: 0.35, d: 0.82, color: 0xbfe5ff, x: 0, y: 0.45, z: -0.05 })
    let facing = Math.PI
    let bridge = null
    let bridgeReady = false
    let stateText = 'BRIDGE MISSING'

    function archAt(z) {
      const t = clamp(Math.abs(z) / 6, 0, 1)
      return 0.22 + (1 - t * t) * 0.62
    }

    function buildBridge() {
      if (bridge) {
        hud.flash('桥梁已经就绪')
        return
      }
      bridge = new THREE.Group()
      bridge.name = 'runtime-bridge'
      const count = 15
      for (let i = 0; i < count; i++) {
        const z = -5.6 + i * (11.2 / (count - 1))
        const y = archAt(z)
        const plank = box(bridge, {
          w: 5.4,
          h: 0.32,
          d: 0.72,
          color: i % 2 ? 0x9b673a : 0xb37a43,
          x: 0,
          y,
          z,
          y0: true,
          rough: 0.88,
        })
        plank.rotation.y = (i % 3 - 1) * 0.008
        for (const x of [-2.72, 2.72]) {
          box(bridge, { w: 0.14, h: 1.25, d: 0.14, color: 0x66717c, metal: 0.85, rough: 0.28, x, y: y + 0.25, z, y0: true })
          box(bridge, { w: 0.18, h: 0.16, d: 0.78, color: 0x8c99a5, metal: 0.9, rough: 0.22, x, y: y + 1.35, z, y0: true })
        }
      }
      scene.add(bridge)
      bridgeReady = true
      stateText = 'BRIDGE READY'
      hud.flash('完整桥梁已生成', 1200)
    }

    function dismantleBridge() {
      if (bridge) {
        scene.remove(bridge)
        bridge.traverse((object) => {
          object.geometry?.dispose()
          if (Array.isArray(object.material)) object.material.forEach((m) => m.dispose())
          else object.material?.dispose()
        })
        bridge = null
      }
      bridgeReady = false
      if (Math.abs(player.position.z) < 6.1) {
        player.position.x = 0
        player.position.z = 7
      }
      stateText = 'BRIDGE MISSING'
      hud.flash('桥梁已完全拆除')
    }

    function validPosition(x, z) {
      if (Math.abs(x) > 11.1 || Math.abs(z) > 20.5) return false
      if (z >= 6 || z <= -6) return true
      return bridgeReady && Math.abs(x) < 2.45
    }

    function floorHeight(x, z) {
      if (bridgeReady && Math.abs(z) < 6 && Math.abs(x) < 2.5) return archAt(z) + 0.32
      return 0.4
    }

    return {
      update(dt) {
        if (input.hit('KeyR')) dismantleBridge()
        const nearPad = Math.hypot(player.position.x - pad.position.x, player.position.z - pad.position.z) < 3
        if (input.hit('KeyE') && nearPad) buildBridge()

        const axis = input.wasd()
        if (axis.x || axis.z) {
          const n = norm2(axis.x, axis.z)
          const speed = 6
          const nextX = player.position.x + n.x * speed * dt
          const nextZ = player.position.z + n.z * speed * dt
          if (validPosition(nextX, player.position.z)) player.position.x = nextX
          if (validPosition(player.position.x, nextZ)) player.position.z = nextZ
          facing = Math.atan2(n.x, n.z)
          player.rotation.y = facing
        }
        player.position.y = floorHeight(player.position.x, player.position.z) + 0.85

        if (player.position.z < -16.4 && Math.abs(player.position.x) < 3.2) {
          if (stateText !== 'EXIT REACHED') hud.flash('EXIT REACHED', 1500)
          stateText = 'EXIT REACHED'
        } else if (stateText === 'EXIT REACHED') {
          stateText = bridgeReady ? 'BRIDGE READY' : 'BRIDGE MISSING'
        }

        pad.material.emissive = new THREE.Color(nearPad ? 0x8a6d00 : 0x000000)
        pad.material.emissiveIntensity = nearPad ? 0.9 : 0

        const behind = 8
        const desired = new THREE.Vector3(
          player.position.x - Math.sin(facing) * behind + 3,
          player.position.y + 5.2,
          player.position.z - Math.cos(facing) * behind,
        )
        camera.position.lerp(desired, 1 - Math.exp(-4 * dt))
        camera.lookAt(player.position.x, player.position.y + 0.5, player.position.z)

        hud.setStats(`${stateText}${nearPad && !bridgeReady ? '  ·  PRESS E' : ''}`)
      },
      cleanup() {
        if (bridge) {
          scene.remove(bridge)
          bridge = null
        }
      },
    }
  })
}
