import {
  THREE, run, box, ground, makeLabel, clamp, len2, norm2, lookXZ, seedRand, orthoCamera
} from '../engine.js'

export function start() {
  const camera = orthoCamera(14, 25)
  camera.position.set(0, 25, 10)
  camera.lookAt(0, 0, 0)

  return run('life_sim_fishing_minigame', {
    camera,
    bg: 0xa8dcff,
  }, (app) => {
    const { scene, input, hud } = app
    ground(scene, { s: 28, color: 0x87b957 })

    const pond = box(scene, {
      w: 13, h: 0.18, d: 9, color: 0x2789bd, x: 0, y: 0.23, z: -1.5,
    })
    pond.material.roughness = 0.25
    pond.material.metalness = 0.1
    const shallow = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(13.5, 0.2, 9.5)),
      new THREE.LineBasicMaterial({ color: 0xa8e9df }),
    )
    shallow.position.set(0, 0.24, -1.5)
    scene.add(shallow)

    for (const [x, z] of [[-7, -5], [7, -5], [-7, 3], [7, 3], [-7, -1], [7, -1]]) {
      const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.45 + Math.abs(x + z) % 0.25),
        new THREE.MeshStandardMaterial({ color: 0x87957b }),
      )
      rock.position.set(x, 0.45, z)
      scene.add(rock)
    }

    const pondLabel = makeLabel('鱼塘', { color: '#d8fbff', scale: 2.5 })
    pondLabel.position.set(0, 1, -1.5)
    scene.add(pondLabel)

    const player = box(scene, {
      w: 0.85, h: 1.45, d: 0.85, color: 0xf2a83b, x: 0, y: 0.2, z: 7, y0: true,
    })
    const rod = box(scene, {
      w: 0.09, h: 0.09, d: 1.15, color: 0x5b3822, x: 0, y: 1.25, z: 6.3,
    })
    const facing = { x: 0, z: -1 }
    const random = seedRand(11037)

    const bobber = new THREE.Group()
    const bobTop = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 12, 8),
      new THREE.MeshStandardMaterial({ color: 0xff3e3e }),
    )
    const bobBottom = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 12, 8),
      new THREE.MeshStandardMaterial({ color: 0xffffff }),
    )
    bobTop.position.y = 0.14
    bobBottom.position.y = -0.05
    bobber.add(bobTop, bobBottom)
    bobber.visible = false
    scene.add(bobber)

    const biteLabel = makeLabel('！', { color: '#fff04d', size: 120, scale: 2.5 })
    biteLabel.visible = false
    scene.add(biteLabel)

    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(),
      new THREE.Vector3(),
    ])
    const line = new THREE.Line(
      lineGeometry,
      new THREE.LineBasicMaterial({ color: 0xf4f4f4, transparent: true, opacity: 0.8 }),
    )
    line.visible = false
    scene.add(line)

    let state = 'idle'
    let timer = 0
    let progress = 0
    let tension = 0
    let fish = 0

    function inWater(x, z, margin = 0) {
      return Math.abs(x) < 6.5 - margin && z > -6 + margin && z < 3 - margin
    }

    function castPoint() {
      for (let distance = 1.4; distance <= 8; distance += 0.25) {
        const x = player.position.x + facing.x * distance
        const z = player.position.z + facing.z * distance
        if (inWater(x, z, 0.35)) return { x, z }
      }
      return null
    }

    function updateLine() {
      const positions = line.geometry.attributes.position
      positions.setXYZ(0, rod.position.x, rod.position.y, rod.position.z)
      positions.setXYZ(1, bobber.position.x, bobber.position.y, bobber.position.z)
      positions.needsUpdate = true
    }

    function resetCast(message) {
      state = 'idle'
      timer = 0
      progress = 0
      tension = 0
      bobber.visible = false
      biteLabel.visible = false
      line.visible = false
      if (message) hud.flash(message, 1200)
    }

    function cast() {
      const point = castPoint()
      if (!point || inWater(player.position.x, player.position.z, -0.4)) {
        hud.flash('站在岸边并面向水面再抛竿')
        return
      }
      bobber.position.set(point.x, 0.48, point.z)
      bobber.visible = true
      line.visible = true
      updateLine()
      state = 'waiting'
      timer = 0.8 + random() * 1.7
      hud.flash('浮标入水，等待咬钩……')
    }

    function onAction() {
      if (state === 'idle') {
        cast()
      } else if (state === 'waiting') {
        resetCast('太早提竿，鱼被吓跑了！')
      } else if (state === 'bite') {
        state = 'reeling'
        progress = 0.08
        tension = 0.22
        biteLabel.visible = false
        hud.flash('咬钩！按住/松开空格控制张力')
      }
    }

    function bar(value, width = 12) {
      const filled = Math.round(clamp(value, 0, 1) * width)
      return '■'.repeat(filled) + '□'.repeat(width - filled)
    }

    return {
      update(dt, now) {
        if (input.hit('KeyE')) onAction()

        if (state === 'waiting') {
          timer -= dt
          bobber.position.y = 0.48 + Math.sin(now * 0.006) * 0.05
          if (timer <= 0) {
            state = 'bite'
            timer = 0.78
            biteLabel.visible = true
            biteLabel.position.set(bobber.position.x, 2.0, bobber.position.z)
          }
        } else if (state === 'bite') {
          timer -= dt
          bobber.position.y = 0.30 + Math.sin(now * 0.025) * 0.1
          biteLabel.scale.setScalar(1 + Math.sin(now * 0.02) * 0.16)
          if (timer <= 0) resetCast('太晚了，鱼脱钩！')
        } else if (state === 'reeling') {
          if (input.down('Space')) {
            progress += dt * 0.34
            tension += dt * 0.55
            bobber.position.x += (player.position.x - bobber.position.x) * dt * 0.42
            bobber.position.z += (player.position.z - bobber.position.z) * dt * 0.42
          } else {
            tension -= dt * 0.48
          }
          tension = clamp(tension, 0.06, 1.1)
          if (tension >= 1) {
            resetCast('张力过高，鱼逃走了！')
          } else if (progress >= 1) {
            fish++
            resetCast('成功钓到一条鱼！')
          }
        }

        if (state === 'idle') {
          const axis = input.axis()
          if (len2(axis.x, axis.z) > 0) {
            const n = norm2(axis.x, axis.z)
            const nx = clamp(player.position.x + n.x * 5 * dt, -12.5, 12.5)
            const nz = clamp(player.position.z + n.z * 5 * dt, -12.5, 12.5)
            if (!inWater(nx, nz, -0.35)) {
              player.position.x = nx
              player.position.z = nz
            }
            facing.x = n.x
            facing.z = n.z
            lookXZ(player, n.x, n.z)
          }
        }

        rod.position.set(
          player.position.x + facing.x * 0.62,
          1.25,
          player.position.z + facing.z * 0.62,
        )
        rod.rotation.y = Math.atan2(facing.x, facing.z)
        if (line.visible) updateLine()

        const status = {
          idle: '岸边面向水面按 E 抛竿',
          waiting: '等待咬钩……',
          bite: '！立刻按 E ！',
          reeling: `收线 ${bar(progress)}　张力 ${bar(tension)}`,
        }[state]
        hud.setStats(`鱼：${fish}　${status}`)
      },
      cleanup() {},
    }
  })
}
