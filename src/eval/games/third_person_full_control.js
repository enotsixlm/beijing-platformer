import { THREE, run, box, ground, walls, clamp, lerp, norm2, lookXZ } from '../engine.js'

export function start() {
  return run('third_person_full_control', {
    bg: 0x172238,
    camPos: [0, 4, -7],
    lookAt: [0, 1, 0],
    far: 120,
    hint: '点击画面锁定鼠标 · WASD 移动 · 空格跳跃 · 按住 Ctrl 蹲伏',
  }, ({ scene, camera, renderer, input, hud }) => {
    ground(scene, { s: 30, color: 0x365443, y: 0 })
    walls(scene, 30, 3, 0.45, 0x536274)

    for (const [x, z, h, color] of [
      [-6, -4, 1.6, 0x7c5c48],
      [5, 4, 2.2, 0x4b6680],
      [-7, 7, 1.1, 0x6d5879],
      [7, -7, 1.5, 0x5f704a],
    ]) {
      box(scene, { w: 2, h, d: 2, color, x, y: 0.4, z, y0: true })
    }

    const player = new THREE.Group()
    player.position.set(0, 0.4, 0)
    scene.add(player)

    const body = box(scene, { w: 0.82, h: 1.55, d: 0.66, color: 0x4e91ee, y0: false })
    scene.remove(body)
    body.position.set(0, 0.775, 0)
    player.add(body)
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.38, 14, 10),
      new THREE.MeshStandardMaterial({ color: 0xffd2aa }),
    )
    head.position.set(0, 1.75, 0)
    head.castShadow = true
    player.add(head)
    const facing = new THREE.Mesh(
      new THREE.ConeGeometry(0.13, 0.45, 5),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x555577 }),
    )
    facing.rotation.x = Math.PI / 2
    facing.position.set(0, 1.15, 0.48)
    player.add(facing)

    let yaw = 0
    let pitch = 0.42
    let velocityX = 0
    let velocityZ = 0
    let velocityY = 0
    let grounded = true
    let crouchAmount = 0

    const lockPointer = () => {
      if (document.pointerLockElement !== renderer.domElement) renderer.domElement.requestPointerLock?.()
    }
    renderer.domElement.addEventListener('click', lockPointer)

    return {
      update(dt) {
        if (document.pointerLockElement === renderer.domElement) {
          yaw -= input.mouse.dx * 0.0025
          pitch = clamp(pitch + input.mouse.dy * 0.0018, 0.15, 0.78)
        }

        const crouching = input.ctrl()
        const crouchTarget = crouching ? 1 : 0
        crouchAmount += (crouchTarget - crouchAmount) * (1 - Math.exp(-dt * 13))
        const heightScale = lerp(1, 0.62, crouchAmount)
        body.scale.y = heightScale
        body.position.y = 0.775 * heightScale
        head.position.y = 1.75 * heightScale
        facing.position.y = 1.15 * heightScale

        const axis = input.wasd()
        let targetX = 0
        let targetZ = 0
        if (axis.x || axis.z) {
          const stick = norm2(axis.x, axis.z)
          const forwardX = Math.sin(yaw)
          const forwardZ = Math.cos(yaw)
          const rightX = Math.cos(yaw)
          const rightZ = -Math.sin(yaw)
          const moveX = rightX * stick.x + forwardX * -stick.z
          const moveZ = rightZ * stick.x + forwardZ * -stick.z
          const speed = lerp(6.4, 3.4, crouchAmount)
          targetX = moveX * speed
          targetZ = moveZ * speed
        }

        const response = axis.x || axis.z ? 13 : 9
        const blend = 1 - Math.exp(-response * dt)
        velocityX += (targetX - velocityX) * blend
        velocityZ += (targetZ - velocityZ) * blend
        player.position.x = clamp(player.position.x + velocityX * dt, -14.15, 14.15)
        player.position.z = clamp(player.position.z + velocityZ * dt, -14.15, 14.15)
        if (Math.hypot(velocityX, velocityZ) > 0.15) lookXZ(player, velocityX, velocityZ)

        if (input.hit('Space') && grounded) {
          velocityY = 7.8
          grounded = false
        }
        velocityY -= 20 * dt
        player.position.y += velocityY * dt
        if (player.position.y <= 0.4) {
          player.position.y = 0.4
          velocityY = 0
          grounded = true
        }

        const eyeHeight = lerp(1.55, 0.92, crouchAmount)
        const target = new THREE.Vector3(player.position.x, player.position.y + eyeHeight, player.position.z)
        const horizontal = Math.cos(pitch) * 6.2
        const desired = new THREE.Vector3(
          target.x - Math.sin(yaw) * horizontal,
          target.y + Math.sin(pitch) * 6.2,
          target.z - Math.cos(yaw) * horizontal,
        )
        camera.position.lerp(desired, 1 - Math.exp(-dt * 9))
        camera.lookAt(target)

        const speed = Math.hypot(velocityX, velocityZ)
        hud.setStats(
          `${document.pointerLockElement === renderer.domElement ? '鼠标已锁定' : '点击画面锁定鼠标'}\n`
          + `状态: ${crouching ? '蹲伏' : grounded ? '站立' : '跳跃'}\n速度: ${speed.toFixed(1)}`,
        )
      },
      cleanup() {
        renderer.domElement.removeEventListener('click', lockPointer)
        if (document.pointerLockElement === renderer.domElement) document.exitPointerLock?.()
      },
    }
  })
}
