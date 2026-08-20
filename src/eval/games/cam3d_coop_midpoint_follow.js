import { run, ground, walls, box, clamp, len2, norm2, moveXZ, lookXZ } from '../engine.js'

export function start() {
  return run('cam3d_coop_midpoint_follow', {
    bg: 0x10223a,
    camPos: [0, 18, 20],
    lookAt: [0, 0, 0],
  }, (app) => {
    const { scene, camera, input, hud } = app
    ground(scene, { s: 72, color: 0x365d48 })
    walls(scene, 72, 2.5, 0.5, 0x274153)

    for (let x = -30; x <= 30; x += 10) {
      for (let z = -30; z <= 30; z += 10) {
        box(scene, {
          w: 0.35, h: 0.05, d: 0.35, color: 0xb9d4a5,
          x, y: 0.42, z, metal: 0.15, rough: 0.5,
        })
      }
    }

    const p1 = box(scene, {
      w: 1.3, h: 1.8, d: 1.3, color: 0x3287ff,
      x: -3, y: 0.4, z: 0, y0: true,
    })
    const p2 = box(scene, {
      w: 1.3, h: 1.8, d: 1.3, color: 0xff4b54,
      x: 3, y: 0.4, z: 0, y0: true,
    })

    const target = { x: 0, z: 0 }

    return {
      update(dt) {
        const a = input.wasd()
        const b = input.arrows()
        const an = len2(a.x, a.z) > 1 ? norm2(a.x, a.z) : a
        const bn = len2(b.x, b.z) > 1 ? norm2(b.x, b.z) : b

        moveXZ(p1, an.x, an.z, dt, 9, 34)
        moveXZ(p2, bn.x, bn.z, dt, 9, 34)
        lookXZ(p1, an.x, an.z)
        lookXZ(p2, bn.x, bn.z)

        target.x = (p1.position.x + p2.position.x) * 0.5
        target.z = (p1.position.z + p2.position.z) * 0.5
        const separation = p1.position.distanceTo(p2.position)
        const distance = clamp(13 + separation * 0.72, 13, 32)
        const desiredX = target.x
        const desiredY = 7 + distance * 0.62
        const desiredZ = target.z + distance * 0.82
        const follow = 1 - Math.exp(-4.5 * dt)

        camera.position.x += (desiredX - camera.position.x) * follow
        camera.position.y += (desiredY - camera.position.y) * follow
        camera.position.z += (desiredZ - camera.position.z) * follow
        camera.lookAt(target.x, 0.8, target.z)
        hud.setStats(
          `P1 蓝方  WASD\nP2 红方  方向键\n玩家距离 ${separation.toFixed(1)} m\n相机自动取景`,
        )
      },
    }
  })
}
