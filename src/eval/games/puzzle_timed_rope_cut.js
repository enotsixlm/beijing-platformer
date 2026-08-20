import {
  THREE, run, box, ground, pick, clamp
} from '../engine.js'

export function start() {
  return run('puzzle_timed_rope_cut', {
    bg: 0xb9ddf3,
    camPos: [11, 9.5, 15],
    lookAt: [1.2, 4, 0],
    shadows: true,
  }, (app) => {
    const { scene, camera, input, hud } = app
    ground(scene, { s: 18, color: 0x8fbd6b })
    box(scene, { w: 11, h: 0.45, d: 7, color: 0xd7c08c, x: 1, y: 0.2, z: 0 })

    const anchor = new THREE.Vector3(-1.5, 8.5, 0)
    const anchorBlock = box(scene, {
      w: 1.1, h: 0.65, d: 1.1, color: 0x555968, x: anchor.x, y: anchor.y + 0.25, z: 0,
    })
    anchorBlock.material.metalness = 0.55
    box(scene, { w: 0.5, h: 8, d: 0.5, color: 0x6c7180, x: anchor.x, y: 4.2, z: -2.8 })
    box(scene, { w: 6, h: 0.5, d: 0.5, color: 0x6c7180, x: 0.9, y: 8.7, z: -2.8 })

    const rope = new THREE.Mesh(
      new THREE.CylinderGeometry(0.105, 0.105, 1, 10),
      new THREE.MeshStandardMaterial({ color: 0xe5d2a0, roughness: 0.9 }),
    )
    rope.castShadow = true
    scene.add(rope)

    const ballRadius = 0.55
    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(ballRadius, 28, 18),
      new THREE.MeshStandardMaterial({ color: 0xf05462, roughness: 0.38 }),
    )
    ball.castShadow = true
    scene.add(ball)

    const basketX = 2.0
    const basketZ = 0
    box(scene, { w: 3.2, h: 0.3, d: 2.8, color: 0xa8672c, x: basketX, y: 0.5, z: basketZ })
    box(scene, { w: 0.28, h: 1.25, d: 2.8, color: 0xc0813e, x: basketX - 1.46, y: 1.0, z: basketZ })
    box(scene, { w: 0.28, h: 1.25, d: 2.8, color: 0xc0813e, x: basketX + 1.46, y: 1.0, z: basketZ })
    box(scene, { w: 3.2, h: 1.25, d: 0.25, color: 0xc0813e, x: basketX, y: 1.0, z: basketZ - 1.28 })
    box(scene, { w: 3.2, h: 0.55, d: 0.25, color: 0xc0813e, x: basketX, y: 0.65, z: basketZ + 1.28 })

    const rimMat = new THREE.MeshBasicMaterial({ color: 0xffd36b })
    const rim = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(3.2, 1.35, 2.8)),
      rimMat,
    )
    rim.position.set(basketX, 1.0, basketZ)
    scene.add(rim)

    const ropeLength = 5.1
    const amplitude = 0.78
    const omega = 1.45
    const up = new THREE.Vector3(0, 1, 0)
    const ropeDirection = new THREE.Vector3()
    let state = 'swing'
    let elapsed = 0
    let vx = 0
    let vy = 0
    let vz = 0

    function setRopeBetween(a, b) {
      ropeDirection.subVectors(b, a)
      const length = ropeDirection.length()
      rope.position.copy(a).add(b).multiplyScalar(0.5)
      rope.scale.set(1, length, 1)
      rope.quaternion.setFromUnitVectors(up, ropeDirection.normalize())
    }

    function swingPosition() {
      const angle = -amplitude * Math.cos(omega * elapsed)
      ball.position.set(
        anchor.x + Math.sin(angle) * ropeLength,
        anchor.y - Math.cos(angle) * ropeLength,
        0,
      )
      setRopeBetween(anchor, ball.position)
      return angle
    }

    function cutRope() {
      const angle = -amplitude * Math.cos(omega * elapsed)
      const angleVelocity = amplitude * omega * Math.sin(omega * elapsed)
      vx = ropeLength * Math.cos(angle) * angleVelocity
      vy = ropeLength * Math.sin(angle) * angleVelocity
      vz = 0
      rope.visible = false
      state = 'fall'
      hud.flash('绳子已切断！')
    }

    function reset() {
      state = 'swing'
      elapsed = 0
      vx = vy = vz = 0
      rope.visible = true
      ball.visible = true
      ball.rotation.set(0, 0, 0)
      hud.hideOverlay()
      swingPosition()
    }

    function insideBasket() {
      return Math.abs(ball.position.x - basketX) < 1.2
        && Math.abs(ball.position.z - basketZ) < 1.0
    }

    swingPosition()

    return {
      update(dt) {
        if (state === 'swing') {
          elapsed += dt
          swingPosition()
          ball.rotation.z += dt * 0.8
          if (input.mouse.justDown) {
            const hit = pick(camera, input.mouse.ndc, [rope])
            if (hit) cutRope()
          }
        } else if (state === 'fall') {
          vy -= 9.8 * dt
          ball.position.x += vx * dt
          ball.position.y += vy * dt
          ball.position.z += vz * dt
          ball.rotation.z -= vx * dt / ballRadius

          if (vy < 0 && ball.position.y <= 1.55 && insideBasket()) {
            ball.position.y = 1.05
            vx = vy = vz = 0
            state = 'complete'
            hud.showOverlay('完成', '糖果落入篮筐')
          } else if (ball.position.y <= 0.78) {
            ball.position.y = 0.78
            vx = vy = vz = 0
            state = 'fail'
            hud.showOverlay('失败', '按 R 重新开始')
          }
        } else if (state === 'fail' && input.hit('KeyR')) {
          reset()
        }

        const phase = {
          swing: '点击绳子，把握摆动时机',
          fall: '糖果下落中……',
          complete: '完成',
          fail: '失败 · 按 R 重试',
        }[state]
        hud.setStats(`状态：${phase}　摆幅：${Math.round(clamp(Math.abs(ball.position.x - anchor.x) / ropeLength, 0, 1) * 100)}%`)
      },
      cleanup() {},
    }
  })
}
