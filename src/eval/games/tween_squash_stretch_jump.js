import { THREE, run, box, ground, clamp, lerp } from '../engine.js'

export function start() {
  return run('tween_squash_stretch_jump', {
    bg: 0x1c2440,
    camPos: [0, 4.8, 11],
    lookAt: [0, 1.5, 0],
    hint: 'A/D 移动 · 空格跳跃 · 挤压/回弹的 0.3 秒内再次按空格会被忽略',
  }, ({ scene, camera, input, hud }) => {
    ground(scene, { s: 32, color: 0x3f5b4d, y: 0 })

    for (const [x, z, h, color] of [
      [-10, -3, 2.5, 0x626b94],
      [-5, -4, 1.4, 0x8b6658],
      [6, -4, 2.1, 0x617f75],
      [11, -3, 3.2, 0x7b638b],
    ]) {
      box(scene, { w: 2.2, h, d: 2, color, x, y: 0.4, z, y0: true })
    }

    const player = new THREE.Group()
    player.position.set(0, 0.4, 0)
    scene.add(player)
    const bodyHeight = 1.8
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, bodyHeight, 1),
      new THREE.MeshStandardMaterial({ color: 0x67a7ff, emissive: 0x112d61, roughness: 0.55 }),
    )
    body.position.y = bodyHeight / 2
    body.castShadow = true
    player.add(body)
    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(0.54, 0.26),
      new THREE.MeshBasicMaterial({ color: 0xeef7ff }),
    )
    face.position.set(0, 1.15, 0.506)
    player.add(face)
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x172038 })
    for (const x of [-0.14, 0.14]) {
      const eye = new THREE.Mesh(new THREE.CircleGeometry(0.045, 10), eyeMaterial)
      eye.position.set(x, 1.18, 0.513)
      player.add(eye)
    }

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.72, 24),
      new THREE.MeshBasicMaterial({ color: 0x10151d, transparent: true, opacity: 0.32, depthWrite: false }),
    )
    shadow.rotation.x = -Math.PI / 2
    shadow.position.y = 0.415
    scene.add(shadow)

    let animation = 'idle'
    let tweenTime = 0
    let scaleY = 1
    let velocityY = 0
    let grounded = true
    let ignoredPresses = 0

    function setSquashScale(value) {
      scaleY = value
      const wide = 1 + (1 - value) * 0.58
      body.scale.set(wide, value, wide)
      body.position.y = bodyHeight * value / 2
      face.scale.set(wide, 1, 1)
      face.position.y = bodyHeight * value * 0.64
      for (const child of player.children) {
        if (child.geometry?.type === 'CircleGeometry') child.position.y = bodyHeight * value * 0.66
      }
    }

    return {
      update(dt) {
        if (input.hit('Space')) {
          if (animation === 'idle' && grounded) {
            animation = 'squash'
            tweenTime = 0
          } else if (animation !== 'idle') {
            ignoredPresses += 1
            hud.flash('挤压动画中：跳跃输入已忽略')
          }
        }

        if (animation === 'squash') {
          tweenTime += dt
          const t = clamp(tweenTime / 0.15, 0, 1)
          setSquashScale(lerp(1, 0.7, t))
          if (t >= 1) {
            animation = 'stretch'
            tweenTime = 0
            velocityY = 8.2
            grounded = false
          }
        } else if (animation === 'stretch') {
          tweenTime += dt
          const t = clamp(tweenTime / 0.15, 0, 1)
          const easeOut = 1 - (1 - t) ** 3
          setSquashScale(lerp(0.7, 1, easeOut))
          if (t >= 1) {
            animation = 'idle'
            setSquashScale(1)
          }
        }

        const direction = (input.down('KeyD') ? 1 : 0) - (input.down('KeyA') ? 1 : 0)
        player.position.x = clamp(player.position.x + direction * 5.8 * dt, -14.5, 14.5)
        if (direction) player.rotation.y = direction > 0 ? Math.PI / 2 : -Math.PI / 2

        if (!grounded) {
          velocityY -= 20 * dt
          player.position.y += velocityY * dt
          if (player.position.y <= 0.4) {
            player.position.y = 0.4
            velocityY = 0
            grounded = true
          }
        }

        shadow.position.x = player.position.x
        shadow.scale.setScalar(clamp(1 - (player.position.y - 0.4) * 0.08, 0.48, 1))
        shadow.material.opacity = clamp(0.32 - (player.position.y - 0.4) * 0.025, 0.1, 0.32)

        const desiredCamera = new THREE.Vector3(player.position.x, 4.8, 11)
        camera.position.lerp(desiredCamera, 1 - Math.exp(-dt * 6))
        camera.lookAt(player.position.x, 1.55, 0)
        const phase = animation === 'squash' ? '挤压 0.15s' : animation === 'stretch' ? 'Ease-out 回弹 0.15s' : grounded ? '就绪' : '空中'
        hud.setStats(`状态: ${phase}\nY 缩放: ${scaleY.toFixed(2)}\n动画中忽略输入: ${ignoredPresses}`)
      },
      cleanup() {},
    }
  })
}
