import { THREE, run, ground, walls, box, len2, norm2, moveXZ, lookXZ, panel } from '../engine.js'

export function start() {
  return run('cam3d_split_screen_local_coop_2p', {
    bg: 0x122038,
    manualRender: true,
  }, (app) => {
    const { scene, renderer, input, hud } = app
    ground(scene, { s: 72, color: 0x315c46 })
    walls(scene, 72, 3, 0.5, 0x2a4055)

    for (let i = -28; i <= 28; i += 8) {
      box(scene, { w: 0.12, h: 0.03, d: 56, color: 0x568064, x: i, y: 0.42, z: 0 })
      box(scene, { w: 56, h: 0.03, d: 0.12, color: 0x568064, x: 0, y: 0.42, z: i })
    }

    const p1 = box(scene, {
      w: 1.2, h: 1.8, d: 1.4, color: 0x3287ff,
      x: -6, y: 0.4, z: 0, y0: true,
    })
    const p2 = box(scene, {
      w: 1.2, h: 1.8, d: 1.4, color: 0xff4f58,
      x: 6, y: 0.4, z: 0, y0: true,
    })
    const cam1 = new THREE.PerspectiveCamera(62, 1, 0.08, 300)
    const cam2 = new THREE.PerspectiveCamera(62, 1, 0.08, 300)
    cam1.position.set(-6, 6, 9)
    cam2.position.set(6, 6, 9)
    const divider = panel(
      '',
      'left:50%;top:0;bottom:0;width:3px;transform:translateX(-50%);padding:0;border:0;border-radius:0;background:rgba(10,16,30,.88);pointer-events:none',
    )

    function followCamera(camera, player, dt) {
      const forwardX = Math.sin(player.rotation.y)
      const forwardZ = Math.cos(player.rotation.y)
      const desired = new THREE.Vector3(
        player.position.x - forwardX * 8,
        player.position.y + 5.5,
        player.position.z - forwardZ * 8,
      )
      camera.position.lerp(desired, 1 - Math.exp(-7 * dt))
      camera.lookAt(
        player.position.x + forwardX * 2.5,
        player.position.y + 0.5,
        player.position.z + forwardZ * 2.5,
      )
    }

    const size = new THREE.Vector2()

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
        followCamera(cam1, p1, dt)
        followCamera(cam2, p2, dt)

        renderer.getSize(size)
        const w = Math.max(2, size.x)
        const h = Math.max(1, size.y)
        const leftWidth = Math.floor(w / 2)
        const rightWidth = w - leftWidth
        cam1.aspect = leftWidth / h
        cam2.aspect = rightWidth / h
        cam1.updateProjectionMatrix()
        cam2.updateProjectionMatrix()

        renderer.setScissorTest(true)
        renderer.setViewport(0, 0, leftWidth, h)
        renderer.setScissor(0, 0, leftWidth, h)
        renderer.render(scene, cam1)
        renderer.setViewport(leftWidth, 0, rightWidth, h)
        renderer.setScissor(leftWidth, 0, rightWidth, h)
        renderer.render(scene, cam2)
        renderer.setScissorTest(false)
        renderer.setViewport(0, 0, w, h)

        hud.setStats('左屏 · P1 蓝方 · WASD\n右屏 · P2 红方 · 方向键')
      },
      cleanup() {
        divider.remove()
      },
    }
  })
}
