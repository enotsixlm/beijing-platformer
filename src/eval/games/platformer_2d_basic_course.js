import {
  THREE, run, box, clamp, lerp, orthoCamera
} from '../engine.js'

export function start() {
  const camera = orthoCamera(8, 12)
  camera.position.set(12, 7, 22)
  camera.lookAt(12, 7, 0)

  return run('platformer_2d_basic_course', {
    camera,
    bg: 0x8bd4ff,
    shadows: true,
  }, (app) => {
    const { scene, input, hud } = app
    const levelLength = 68

    const backdrop = box(scene, {
      w: levelLength, h: 18, d: 0.5, color: 0xb9e5ff,
      x: levelLength / 2, y: 7, z: -3,
    })
    backdrop.material.roughness = 1

    const colliders = []
    function platform(x, y, w, h = 1, color = 0x4f9d50) {
      box(scene, { w, h, d: 3, color, x, y: y - h / 2, z: 0 })
      colliders.push({ left: x - w / 2, right: x + w / 2, top: y })
    }

    platform(8, 0, 16, 2, 0x4b8e47)
    platform(44.5, 0, 47, 2, 0x4b8e47)
    platform(10.5, 2.2, 5, 0.7, 0xd29b55)
    platform(25.5, 2.4, 5, 0.7, 0xd29b55)
    platform(34, 4.2, 6, 0.7, 0xd29b55)
    platform(43, 2.6, 5, 0.7, 0xd29b55)
    platform(51.5, 4.7, 6, 0.7, 0xd29b55)
    platform(60, 2.4, 5, 0.7, 0xd29b55)

    for (const [x, y, s] of [[7, 11, 1.2], [20, 9, 0.8], [38, 12, 1], [57, 10, 1.2]]) {
      const cloud = new THREE.Group()
      for (let i = 0; i < 3; i++) {
        const puff = new THREE.Mesh(
          new THREE.SphereGeometry(s * (0.65 + i * 0.12), 12, 8),
          new THREE.MeshBasicMaterial({ color: 0xffffff }),
        )
        puff.position.set((i - 1) * s, i === 1 ? s * 0.25 : 0, 0)
        cloud.add(puff)
      }
      cloud.position.set(x, y, -2.2)
      scene.add(cloud)
    }

    box(scene, { w: 0.35, h: 5, d: 2, color: 0xeeeeee, x: 65.5, y: 2.5, z: 0 })
    const flag = box(scene, { w: 2.2, h: 1.2, d: 0.18, color: 0xff5c59, x: 66.6, y: 4.3, z: 0 })
    flag.castShadow = false

    const player = box(scene, {
      w: 1, h: 1.8, d: 1, color: 0x3979e6, x: 3, y: 0.9, z: 0,
    })
    const eye = box(scene, {
      w: 0.16, h: 0.16, d: 0.12, color: 0xffffff, x: 3.3, y: 1.25, z: 0.55,
    })

    let vx = 0
    let vy = 0
    let grounded = true
    let cameraX = 12
    let facing = 1

    function respawn() {
      player.position.set(3, 1.2, 0)
      vx = 0
      vy = 0
      grounded = false
      cameraX = Math.max(cameraX, 10)
      hud.flash('掉进缺口，返回起点')
    }

    return {
      update(dt) {
        const axis = input.axis()
        const direction = axis.x
        if (direction) {
          facing = Math.sign(direction)
          const accel = grounded ? 34 : 18
          vx += direction * accel * dt
        } else {
          vx *= Math.pow(grounded ? 0.0008 : 0.2, dt)
        }
        vx = clamp(vx, -7.2, 7.2)

        if (input.hit('Space') && grounded) {
          vy = 10.2
          grounded = false
        }

        const oldBottom = player.position.y - 0.9
        const oldX = player.position.x
        vy -= 24 * dt
        player.position.x = clamp(player.position.x + vx * dt, 0.55, levelLength - 0.55)
        player.position.y += vy * dt
        grounded = false

        if (vy <= 0) {
          const newBottom = player.position.y - 0.9
          let landing = -Infinity
          for (const surface of colliders) {
            const overlapsX = player.position.x + 0.46 > surface.left
              && player.position.x - 0.46 < surface.right
            if (overlapsX && oldBottom >= surface.top - 0.08 && newBottom <= surface.top) {
              landing = Math.max(landing, surface.top)
            }
          }
          if (landing > -Infinity) {
            player.position.y = landing + 0.9
            vy = 0
            grounded = true
          }
        }

        if (player.position.x === 0.55 || player.position.x === levelLength - 0.55) vx = 0
        if (player.position.y < -7) respawn()

        player.rotation.z = lerp(player.rotation.z, -vx * 0.025, clamp(dt * 10, 0, 1))
        eye.position.set(
          player.position.x + facing * 0.3,
          player.position.y + 0.35,
          0.55,
        )

        const viewHalf = camera.userData.orthoSize * (innerWidth / innerHeight)
        const moving = Math.abs(vx) > 0.35 || Math.abs(player.position.x - oldX) > 0.001
        const lookahead = moving ? Math.sign(vx || facing) * 3.2 : 0
        const targetCameraX = clamp(
          player.position.x + lookahead,
          viewHalf,
          levelLength - viewHalf,
        )
        cameraX = lerp(cameraX, targetCameraX, clamp(dt * (moving ? 4.5 : 2.4), 0, 1))
        camera.position.x = cameraX
        camera.lookAt(cameraX, 7, 0)

        hud.setStats(`位置：${Math.round(player.position.x)} / ${levelLength}　${grounded ? '地面' : '空中'}`)
      },
      cleanup() {},
    }
  })
}
