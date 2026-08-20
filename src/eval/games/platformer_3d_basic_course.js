import {
  THREE, run, box, ground, clamp, lerp, len2, norm2, lookXZ
} from '../engine.js'

export function start() {
  return run('platformer_3d_basic_course', {
    bg: 0x91c9f2,
    camPos: [10, 9, 13],
    lookAt: [0, 1, 0],
    shadows: true,
    fog: new THREE.Fog(0x91c9f2, 30, 70),
  }, (app) => {
    const { scene, camera, input, hud } = app
    ground(scene, { s: 60, color: 0x79a966, y: -3.4 })

    const safeLabel = new THREE.Mesh(
      new THREE.RingGeometry(3.5, 4, 32),
      new THREE.MeshBasicMaterial({ color: 0xd8f39a, side: THREE.DoubleSide }),
    )
    safeLabel.rotation.x = -Math.PI / 2
    safeLabel.position.set(0, -2.98, 0)
    scene.add(safeLabel)

    const surfaces = [{ x: 0, z: 0, w: 60, d: 60, top: -3.0, safe: true }]
    function addPlatform(x, top, z, w, d, color, name) {
      box(scene, {
        w, h: 0.7, d, color, x, y: top - 0.7, z, y0: true,
      })
      const marker = new THREE.Mesh(
        new THREE.RingGeometry(0.65, 0.85, 24),
        new THREE.MeshBasicMaterial({ color: 0xffee78, side: THREE.DoubleSide }),
      )
      marker.rotation.x = -Math.PI / 2
      marker.position.set(x, top + 0.015, z)
      scene.add(marker)
      surfaces.push({ x, z, w, d, top, safe: false, name })
    }

    addPlatform(0, 0.4, 0, 6, 6, 0x607d99, '起点')
    addPlatform(0, 1.05, -7, 6.5, 4.5, 0xd99454, '前方')
    addPlatform(5.5, 2.0, -11.5, 5.5, 5.2, 0x55a8a1, '右侧')
    addPlatform(0, 3.0, -16.2, 6, 4.5, 0x8e70bd, '高台')
    addPlatform(-6.2, 4.0, -12.5, 5.5, 5, 0xd06d75, '左侧')
    addPlatform(-7.5, 5.0, -5.7, 6, 5, 0x5a9fc8, '回转台')
    addPlatform(-2, 6.0, -1, 6.5, 5.5, 0xd0aa4c, '终点')

    const player = box(scene, {
      w: 0.9, h: 1.7, d: 0.9, color: 0x386ee8, x: 0, y: 1.25, z: 0,
    })
    const front = box(scene, {
      w: 0.22, h: 0.22, d: 0.16, color: 0xffffff, x: 0, y: 1.55, z: -0.5,
    })

    let vx = 0
    let vz = 0
    let vy = 0
    let grounded = true
    let yaw = 0.65
    let pitch = 0.52
    let cameraDistance = 13.5
    let safeTimer = 0
    let highest = 0

    function respawn() {
      player.position.set(0, 1.25, 0)
      vx = vz = vy = 0
      grounded = false
      safeTimer = 0
      hud.flash('安全地面将你送回起点')
    }

    function horizontalOn(surface, x, z) {
      return Math.abs(x - surface.x) < surface.w / 2 + 0.38
        && Math.abs(z - surface.z) < surface.d / 2 + 0.38
    }

    return {
      update(dt) {
        if (input.hit('KeyR')) respawn()

        yaw -= input.mouse.dx * 0.006
        pitch = clamp(pitch - input.mouse.dy * 0.004, 0.22, 0.92)
        cameraDistance = clamp(cameraDistance + input.mouse.wheel * 0.7, 11, 17)

        const axis = input.wasd()
        const forwardX = -Math.sin(yaw)
        const forwardZ = -Math.cos(yaw)
        const rightX = Math.cos(yaw)
        const rightZ = -Math.sin(yaw)
        let desiredX = rightX * axis.x + forwardX * -axis.z
        let desiredZ = rightZ * axis.x + forwardZ * -axis.z
        if (len2(desiredX, desiredZ) > 0) {
          const n = norm2(desiredX, desiredZ)
          desiredX = n.x
          desiredZ = n.z
          const acceleration = grounded ? 28 : 11
          vx += desiredX * acceleration * dt
          vz += desiredZ * acceleration * dt
          lookXZ(player, desiredX, desiredZ)
        } else {
          const drag = Math.pow(grounded ? 0.002 : 0.3, dt)
          vx *= drag
          vz *= drag
        }

        const horizontalSpeed = len2(vx, vz)
        const maxSpeed = grounded ? 6.4 : 6
        if (horizontalSpeed > maxSpeed) {
          vx = vx / horizontalSpeed * maxSpeed
          vz = vz / horizontalSpeed * maxSpeed
        }
        if (input.hit('Space') && grounded) {
          vy = 9.2
          grounded = false
        }

        const oldBottom = player.position.y - 0.85
        vy -= 21 * dt
        player.position.x += vx * dt
        player.position.z += vz * dt
        player.position.y += vy * dt
        grounded = false
        let landedSurface = null

        if (vy <= 0) {
          const newBottom = player.position.y - 0.85
          let bestTop = -Infinity
          for (const surface of surfaces) {
            if (
              horizontalOn(surface, player.position.x, player.position.z)
              && oldBottom >= surface.top - 0.06
              && newBottom <= surface.top
              && surface.top > bestTop
            ) {
              landedSurface = surface
              bestTop = surface.top
            }
          }
          if (landedSurface) {
            player.position.y = landedSurface.top + 0.85
            vy = 0
            grounded = true
            if (!landedSurface.safe) highest = Math.max(highest, landedSurface.top)
          }
        }

        if (grounded && landedSurface?.safe) safeTimer += dt
        else if (player.position.y <= -2.3) safeTimer += dt
        else safeTimer = 0
        if (safeTimer > 0.75) respawn()
        if (player.position.y < -8 || Math.abs(player.position.x) > 31 || Math.abs(player.position.z) > 31) respawn()

        front.position.set(
          player.position.x + Math.sin(player.rotation.y) * 0.5,
          player.position.y + 0.28,
          player.position.z + Math.cos(player.rotation.y) * 0.5,
        )

        const horizontalDistance = Math.cos(pitch) * cameraDistance
        const targetCamX = player.position.x + Math.sin(yaw) * horizontalDistance
        const targetCamZ = player.position.z + Math.cos(yaw) * horizontalDistance
        const targetCamY = player.position.y + Math.sin(pitch) * cameraDistance + 1.2
        const blend = clamp(dt * 7, 0, 1)
        camera.position.x = lerp(camera.position.x, targetCamX, blend)
        camera.position.y = lerp(camera.position.y, targetCamY, blend)
        camera.position.z = lerp(camera.position.z, targetCamZ, blend)
        camera.lookAt(player.position.x, player.position.y + 0.6, player.position.z)

        hud.setStats(`最高平台：${highest.toFixed(1)} m　${grounded ? '已落地' : '空中'}　滚轮调整距离`)
      },
      cleanup() {},
    }
  })
}
