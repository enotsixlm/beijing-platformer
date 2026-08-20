import { THREE, run, box, ground, walls, makeLabel, clamp, norm2, moveXZ, lookXZ, orthoCamera } from '../engine.js'

export function start() {
  const DEFAULT_SIZE = 11
  const camera = orthoCamera(DEFAULT_SIZE, 24)
  return run('topdown_full_control', {
    camera,
    bg: 0x101826,
    hint: 'WASD 八方向移动 · F 自由观察/返回跟随 · 自由观察时屏幕边缘平移、滚轮缩放',
  }, ({ scene, camera: cam, input, hud }) => {
    ground(scene, { s: 52, color: 0x263e38, y: -0.4 })
    walls(scene, 52, 1.2, 0.35, 0x40525c)

    const landmarks = [
      { x: -16, z: -14, name: '北塔', color: 0x5887b8, h: 4.5 },
      { x: 15, z: -12, name: '红色仓库', color: 0xa75e56, h: 2.4 },
      { x: -14, z: 13, name: '通讯阵列', color: 0x6e72ad, h: 3.2 },
      { x: 14, z: 15, name: '补给站', color: 0x9a864d, h: 1.8 },
      { x: 0, z: -18, name: '拱门', color: 0x597260, h: 2.7 },
    ]
    for (const landmark of landmarks) {
      box(scene, {
        w: landmark.name === '拱门' ? 4 : 2.8,
        h: landmark.h,
        d: landmark.name === '拱门' ? 1 : 2.8,
        color: landmark.color,
        x: landmark.x,
        y: 0,
        z: landmark.z,
        y0: true,
      })
      const label = makeLabel(landmark.name, { scale: 1.9 })
      label.position.set(landmark.x, landmark.h + 0.8, landmark.z)
      scene.add(label)
    }

    for (let i = -20; i <= 20; i += 5) {
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x567068, transparent: true, opacity: 0.16 })
      const gx = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(i, 0.03, -24), new THREE.Vector3(i, 0.03, 24),
      ])
      const gz = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-24, 0.03, i), new THREE.Vector3(24, 0.03, i),
      ])
      scene.add(new THREE.Line(gx, lineMaterial), new THREE.Line(gz, lineMaterial.clone()))
    }

    const player = new THREE.Group()
    player.position.set(0, 0.08, 0)
    scene.add(player)
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.52, 0.66, 0.85, 10),
      new THREE.MeshStandardMaterial({ color: 0x55a7ff, emissive: 0x0c315e }),
    )
    body.position.y = 0.48
    body.castShadow = true
    player.add(body)
    const arrow = new THREE.Mesh(
      new THREE.ConeGeometry(0.26, 0.85, 3),
      new THREE.MeshBasicMaterial({ color: 0xfff25a }),
    )
    arrow.rotation.x = Math.PI / 2
    arrow.position.set(0, 0.55, 0.95)
    player.add(arrow)
    const arrowGlow = new THREE.PointLight(0xffee55, 1.1, 3)
    arrowGlow.position.set(0, 0.8, 0.8)
    player.add(arrowGlow)

    let mode = 'follow'
    const viewCenter = new THREE.Vector2(player.position.x, player.position.z)
    let viewSize = DEFAULT_SIZE

    function applyCamera() {
      const aspect = innerWidth / innerHeight
      cam.left = -viewSize * aspect
      cam.right = viewSize * aspect
      cam.top = viewSize
      cam.bottom = -viewSize
      cam.userData.orthoSize = viewSize
      cam.position.set(viewCenter.x, 24, viewCenter.y + 0.001)
      cam.lookAt(viewCenter.x, 0, viewCenter.y)
      cam.updateProjectionMatrix()
    }
    applyCamera()

    return {
      update(dt) {
        const axis = input.wasd()
        if (axis.x || axis.z) {
          const direction = norm2(axis.x, axis.z)
          moveXZ(player, direction.x, direction.z, dt, 7.2, 24.5)
          lookXZ(player, direction.x, direction.z)
        }

        if (input.hit('KeyF')) {
          if (mode === 'follow') {
            mode = 'free'
            hud.flash('自由观察：移动鼠标到屏幕边缘')
          } else if (mode === 'free') {
            mode = 'returning'
            hud.flash('返回玩家')
          } else {
            mode = 'free'
          }
        }

        if (mode === 'follow') {
          viewCenter.set(player.position.x, player.position.z)
        } else if (mode === 'free') {
          const margin = 70
          let panX = 0
          let panZ = 0
          if (input.mouse.x < margin) panX -= 1
          else if (input.mouse.x > innerWidth - margin) panX += 1
          if (input.mouse.y < margin) panZ -= 1
          else if (input.mouse.y > innerHeight - margin) panZ += 1
          if (panX || panZ) {
            const direction = norm2(panX, panZ)
            const panSpeed = viewSize * 0.85
            viewCenter.x = clamp(viewCenter.x + direction.x * panSpeed * dt, -24, 24)
            viewCenter.y = clamp(viewCenter.y + direction.z * panSpeed * dt, -24, 24)
          }
          if (input.mouse.wheel) {
            viewSize = clamp(viewSize * (input.mouse.wheel > 0 ? 1.12 : 0.89), 6, 20)
          }
        } else {
          const blend = 1 - Math.exp(-dt * 5)
          viewCenter.x += (player.position.x - viewCenter.x) * blend
          viewCenter.y += (player.position.z - viewCenter.y) * blend
          viewSize += (DEFAULT_SIZE - viewSize) * blend
          if (viewCenter.distanceTo(new THREE.Vector2(player.position.x, player.position.z)) < 0.04
            && Math.abs(viewSize - DEFAULT_SIZE) < 0.03) {
            mode = 'follow'
            viewSize = DEFAULT_SIZE
            viewCenter.set(player.position.x, player.position.z)
          }
        }
        applyCamera()

        const status = mode === 'follow' ? '跟随（玩家居中）' : mode === 'free' ? '自由观察' : '平滑返回中'
        hud.setStats(`相机: ${status}\n缩放: ${viewSize.toFixed(1)}\n位置: ${player.position.x.toFixed(1)}, ${player.position.z.toFixed(1)}`)
      },
      cleanup() {},
    }
  })
}
