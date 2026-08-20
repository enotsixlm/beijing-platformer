import { THREE, run, box, makeLabel, clamp, lerp } from '../engine.js'

export function start() {
  return run('runner_lane_dodge_and_shield', {
    bg: 0x87c7ed,
    far: 220,
    camPos: [8, 7, 13],
    lookAt: [0, 0, -10],
    hint: 'A/D 换道 · 空格跳跃 · R 重开',
  }, ({ scene, camera, input, hud }) => {
    box(scene, { w: 22, h: 0.3, d: 150, color: 0x4d8a45, x: 0, y: -0.3, z: -62, y0: true, cast: false })
    const road = box(scene, { w: 11, h: 0.18, d: 145, color: 0x343a40, x: 0, y: 0, z: -62, y0: true, cast: false })
    road.receiveShadow = true
    for (const x of [-1.8, 1.8]) {
      for (let z = 5; z > -132; z -= 7) {
        box(scene, { w: 0.09, h: 0.025, d: 3.3, color: 0xf5e8a8, x, y: 0.19, z, cast: false })
      }
    }
    for (let z = 4; z > -134; z -= 6) {
      box(scene, { w: 0.25, h: 0.8, d: 0.25, color: 0xe9edf2, x: -5.4, y: 0.1, z, y0: true })
      box(scene, { w: 0.25, h: 0.8, d: 0.25, color: 0xe9edf2, x: 5.4, y: 0.1, z, y0: true })
    }

    const lanes = [-3.2, 0, 3.2]
    const player = box(scene, { w: 1.25, h: 1.25, d: 1.25, color: 0x37a6ff, x: 0, y: 0.76, z: 5 })
    const shieldRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.05, 0.11, 12, 36),
      new THREE.MeshStandardMaterial({ color: 0x5ef5ff, emissive: 0x1cb6dc, emissiveIntensity: 2.2 }),
    )
    shieldRing.rotation.x = Math.PI / 2
    shieldRing.visible = false
    scene.add(shieldRing)

    const obstacleSpecs = [
      { lane: 1, z: -22, label: '1 · DODGE THIS' },
      { lane: 0, z: -49, label: '3 · SHIELDED HIT' },
      { lane: 0, z: -96, label: '4 · SHIELD EXPIRED' },
    ]
    const obstacles = obstacleSpecs.map((spec, i) => {
      const mesh = box(scene, {
        w: 2.15,
        h: i === 1 ? 1.45 : 1.2,
        d: 1.2,
        color: i === 1 ? 0xff713d : 0xe64747,
        x: lanes[spec.lane],
        y: 0.18,
        z: spec.z,
        y0: true,
      })
      const label = makeLabel(spec.label, { color: '#fff4b3', scale: 4.5 })
      label.position.set(lanes[spec.lane], 3.15, spec.z)
      scene.add(label)
      return { ...spec, mesh, label, active: true }
    })

    const shieldPickup = new THREE.Group()
    const shieldCore = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.65, 1),
      new THREE.MeshStandardMaterial({ color: 0x60eeff, emissive: 0x1aa5d5, emissiveIntensity: 1.8, metalness: 0.25 }),
    )
    const pickupRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.95, 0.08, 10, 28),
      new THREE.MeshBasicMaterial({ color: 0xb6fbff }),
    )
    pickupRing.rotation.x = Math.PI / 2
    shieldPickup.add(shieldCore, pickupRing)
    shieldPickup.position.set(lanes[0], 1.1, -39)
    scene.add(shieldPickup)
    const shieldLabel = makeLabel('2 · PICK UP SHIELD', { color: '#77f7ff', scale: 4.6 })
    shieldLabel.position.set(lanes[0], 3.35, -39)
    scene.add(shieldLabel)

    let lane = 1
    let targetX = lanes[lane]
    let vy = 0
    let grounded = true
    let failed = false
    let shieldTime = 0
    let pickupActive = true
    let runTime = 0

    function reset() {
      lane = 1
      targetX = lanes[lane]
      player.position.set(0, 0.76, 5)
      player.scale.set(1, 1, 1)
      vy = 0
      grounded = true
      failed = false
      shieldTime = 0
      pickupActive = true
      runTime = 0
      shieldPickup.visible = true
      shieldLabel.visible = true
      shieldRing.visible = false
      for (const obstacle of obstacles) {
        obstacle.active = true
        obstacle.mesh.visible = true
      }
      hud.hideOverlay()
      hud.flash('RUN!')
    }

    function crash(message) {
      failed = true
      hud.showOverlay('CRASH!', `${message} · 按 R 重新开始`)
    }

    function overlaps(obstacle) {
      return obstacle.active
        && Math.abs(player.position.x - obstacle.mesh.position.x) < 1.55
        && Math.abs(player.position.z - obstacle.mesh.position.z) < 1.2
        && Math.abs(player.position.y - obstacle.mesh.position.y) < 1.25
    }

    return {
      update(dt) {
        if (input.hit('KeyR')) reset()
        if (!failed) {
          if (input.hit('KeyA')) lane = Math.max(0, lane - 1)
          if (input.hit('KeyD')) lane = Math.min(2, lane + 1)
          targetX = lanes[lane]
          player.position.x = lerp(player.position.x, targetX, 1 - Math.exp(-12 * dt))

          if (input.hit('Space') && grounded) {
            vy = 7.2
            grounded = false
          }
          vy -= 18 * dt
          player.position.y += vy * dt
          if (player.position.y <= 0.76) {
            player.position.y = 0.76
            vy = 0
            grounded = true
          }

          player.position.z -= 8.2 * dt
          runTime += dt

          if (pickupActive
            && Math.abs(player.position.x - shieldPickup.position.x) < 1.25
            && Math.abs(player.position.z - shieldPickup.position.z) < 1.25
            && player.position.y < 1.9) {
            pickupActive = false
            shieldPickup.visible = false
            shieldLabel.visible = false
            shieldTime = 5
            shieldRing.visible = true
            hud.flash('SHIELD · 5.0 秒', 1100)
          }

          for (const obstacle of obstacles) {
            if (!overlaps(obstacle)) continue
            if (shieldTime > 0) {
              obstacle.active = false
              obstacle.mesh.visible = false
              hud.flash('护盾吸收撞击！', 1000)
            } else {
              crash(obstacle.z < -80 ? '护盾已失效' : '障碍会导致失败')
            }
          }

          if (shieldTime > 0) {
            shieldTime = Math.max(0, shieldTime - dt)
            const blink = shieldTime < 1 ? Math.floor(shieldTime * 12) % 2 === 0 : true
            shieldRing.visible = blink
            shieldRing.rotation.z += dt * 3.5
            if (shieldTime === 0) {
              shieldRing.visible = false
              hud.flash('SHIELD EXPIRED')
            }
          }
        }

        shieldPickup.rotation.y += dt * 1.8
        shieldRing.position.copy(player.position)
        shieldRing.position.y += 0.05

        const desiredCam = new THREE.Vector3(player.position.x + 7.8, player.position.y + 5.4, player.position.z + 11.5)
        camera.position.lerp(desiredCam, 1 - Math.exp(-5 * dt))
        camera.lookAt(player.position.x, player.position.y + 0.25, player.position.z - 6)

        const shieldText = shieldTime > 0 ? `${shieldTime.toFixed(1)}s` : 'OFF'
        hud.setStats(`距离 ${Math.max(0, Math.floor(5 - player.position.z))}m  ·  车道 ${lane + 1}  ·  护盾 ${shieldText}`)
      },
      cleanup() {},
    }
  })
}
