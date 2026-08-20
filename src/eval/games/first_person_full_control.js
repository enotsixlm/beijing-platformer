import { THREE, run, ground, walls, box, clamp, len2, norm2, panel } from '../engine.js'

export function start() {
  return run('first_person_full_control', {
    bg: 0x17243a,
    camPos: [0, 2, 8],
    lookAt: [0, 1, 0],
    far: 180,
  }, (app) => {
    const { scene, camera, renderer, input, hud } = app
    ground(scene, { s: 44, color: 0x40584a })
    const solids = walls(scene, 44, 3.5, 0.65, 0x4b596b)
    solids.push(
      box(scene, { w: 4, h: 1.2, d: 4, color: 0x8f653f, x: -7, y: 0.4, z: -5, y0: true }),
      box(scene, { w: 3, h: 2.4, d: 5, color: 0x687889, x: 6, y: 0.4, z: -7, y0: true }),
      box(scene, { w: 6, h: 1.7, d: 2.5, color: 0x8b5260, x: 4, y: 0.4, z: 5, y0: true }),
      box(scene, { w: 2.5, h: 0.8, d: 2.5, color: 0x77704d, x: -5, y: 0.4, z: 7, y0: true }),
      box(scene, { w: 2, h: 3.2, d: 2, color: 0x455f82, x: 0, y: 0.4, z: -11, y0: true }),
    )

    const crosshair = panel(
      '<div style="width:16px;height:16px;border:2px solid white;border-radius:50%;opacity:.85"></div>',
      'left:50%;top:50%;transform:translate(-50%,-50%);padding:0;background:none;border:0;pointer-events:none',
    )
    const canvas = renderer.domElement
    let locked = document.pointerLockElement === canvas
    let yaw = 0
    let pitch = 0
    let feetY = 0.4
    let verticalSpeed = 0
    let grounded = true
    let bodyHeight = 1.8
    const bodyWidth = 0.68
    const position = new THREE.Vector3(0, feetY, 9)

    const onCanvasClick = () => canvas.requestPointerLock?.()
    const onLockChange = () => {
      locked = document.pointerLockElement === canvas
      if (locked) hud.flash('鼠标已锁定')
    }
    canvas.addEventListener('click', onCanvasClick)
    document.addEventListener('pointerlockchange', onLockChange)

    function overlapsSolid(x, z, height) {
      const centerY = feetY + height * 0.5
      for (const solid of solids) {
        const size = solid.userData.size
        if (
          Math.abs(x - solid.position.x) * 2 < bodyWidth + size.w
          && Math.abs(centerY - solid.position.y) * 2 < height + size.h
          && Math.abs(z - solid.position.z) * 2 < bodyWidth + size.d
        ) return true
      }
      return false
    }

    function overlapsTop(solid) {
      const size = solid.userData.size
      return Math.abs(position.x - solid.position.x) * 2 < bodyWidth + size.w
        && Math.abs(position.z - solid.position.z) * 2 < bodyWidth + size.d
    }

    return {
      update(dt) {
        if (locked) {
          yaw -= input.mouse.dx * 0.0022
          pitch = clamp(pitch - input.mouse.dy * 0.002, -1.45, 1.45)
        }

        const crouching = input.ctrl()
        const targetHeight = crouching ? 1.12 : 1.8
        bodyHeight += (targetHeight - bodyHeight) * (1 - Math.exp(-14 * dt))
        const axis = input.wasd()
        const local = len2(axis.x, axis.z) > 1 ? norm2(axis.x, axis.z) : axis
        const moveX = local.x * Math.cos(yaw) + local.z * Math.sin(yaw)
        const moveZ = -local.x * Math.sin(yaw) + local.z * Math.cos(yaw)
        const speed = input.shift() ? 9.5 : (crouching ? 3.2 : 5.8)
        const nextX = position.x + moveX * speed * dt
        if (!overlapsSolid(nextX, position.z, bodyHeight)) position.x = nextX
        const nextZ = position.z + moveZ * speed * dt
        if (!overlapsSolid(position.x, nextZ, bodyHeight)) position.z = nextZ

        if (input.hit('Space') && grounded) {
          verticalSpeed = 7.4
          grounded = false
        }
        const oldFeet = feetY
        verticalSpeed -= 20 * dt
        feetY += verticalSpeed * dt
        let landingY = 0.4
        if (verticalSpeed <= 0) {
          for (const solid of solids) {
            const top = solid.position.y + solid.userData.size.h * 0.5
            if (overlapsTop(solid) && oldFeet >= top - 0.06 && feetY <= top) {
              landingY = Math.max(landingY, top)
            }
          }
          if (feetY <= landingY) {
            feetY = landingY
            verticalSpeed = 0
            grounded = true
          } else {
            grounded = false
          }
        }
        position.y = feetY

        camera.position.set(position.x, feetY + bodyHeight - 0.12, position.z)
        camera.rotation.order = 'YXZ'
        camera.rotation.y = yaw
        camera.rotation.x = pitch
        camera.rotation.z = 0

        hud.setStats(
          `${locked ? '鼠标视角已锁定' : '点击画面锁定鼠标'}\n`
          + `${input.shift() ? '冲刺' : crouching ? '下蹲' : '行走'} · ${grounded ? '着地' : '空中'}\n`
          + `高度 ${camera.position.y.toFixed(1)} m`,
        )
      },
      cleanup() {
        canvas.removeEventListener('click', onCanvasClick)
        document.removeEventListener('pointerlockchange', onLockChange)
        if (document.pointerLockElement === canvas) document.exitPointerLock?.()
        crosshair.remove()
      },
    }
  })
}
