import { THREE, run, box, clamp, norm2 } from '../engine.js'

export function start() {
  return run('sports_full_control', {
    bg: 0x8cc9ef,
    far: 180,
    camPos: [10, 11, 19],
    lookAt: [0, 0, -4],
    hint: 'WASD 当前球员 · Shift 冲刺 · J 传球并切换 · K 朝面向方向射门',
  }, ({ scene, camera, input, hud }) => {
    const field = box(scene, { w: 30, h: 0.35, d: 50, color: 0x3f944c, y: 0, z: 0, y0: true, cast: false })
    field.receiveShadow = true
    box(scene, { w: 0.12, h: 0.025, d: 50, color: 0xf3f5e9, x: -14.7, y: 0.36, cast: false })
    box(scene, { w: 0.12, h: 0.025, d: 50, color: 0xf3f5e9, x: 14.7, y: 0.36, cast: false })
    box(scene, { w: 30, h: 0.025, d: 0.12, color: 0xf3f5e9, z: -24.7, y: 0.36, cast: false })
    box(scene, { w: 30, h: 0.025, d: 0.12, color: 0xf3f5e9, z: 24.7, y: 0.36, cast: false })
    box(scene, { w: 30, h: 0.025, d: 0.1, color: 0xf3f5e9, z: 0, y: 0.36, cast: false })
    const centerCircle = new THREE.Mesh(
      new THREE.RingGeometry(3.3, 3.4, 48),
      new THREE.MeshBasicMaterial({ color: 0xf3f5e9, side: THREE.DoubleSide }),
    )
    centerCircle.rotation.x = -Math.PI / 2
    centerCircle.position.y = 0.38
    scene.add(centerCircle)

    const goalZ = -24.2
    for (const x of [-3.7, 3.7]) {
      box(scene, { w: 0.22, h: 3.2, d: 0.22, color: 0xf5f5f5, x, y: 0.35, z: goalZ, y0: true, metal: 0.25 })
      box(scene, { w: 0.12, h: 2.8, d: 2.3, color: 0xb9dce8, x, y: 0.5, z: goalZ - 1.05, y0: true, metal: 0.1 })
    }
    box(scene, { w: 7.6, h: 0.22, d: 0.22, color: 0xf5f5f5, x: 0, y: 3.55, z: goalZ, metal: 0.25 })
    box(scene, { w: 7.5, h: 0.08, d: 2.2, color: 0xb9dce8, x: 0, y: 3.35, z: goalZ - 1.05, metal: 0.1 })

    const players = []
    const starts = [[-5, 7], [0, 11], [5, 7]]
    for (let i = 0; i < 3; i++) {
      const group = new THREE.Group()
      group.position.set(starts[i][0], 0.36, starts[i][1])
      const body = box(group, { w: 1.05, h: 1.55, d: 1.05, color: 0x247bd1, y: 0, y0: true })
      box(group, { w: 0.72, h: 0.28, d: 0.72, color: 0xc5e7ff, y: 1.55, y0: true })
      const number = new THREE.Mesh(
        new THREE.PlaneGeometry(0.38, 0.5),
        new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }),
      )
      number.position.set(0, 1, 0.531)
      group.add(number)
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.72, 0.92, 28),
        new THREE.MeshBasicMaterial({ color: 0xffeb57, side: THREE.DoubleSide }),
      )
      ring.rotation.x = -Math.PI / 2
      ring.position.y = 0.03
      group.add(ring)
      scene.add(group)
      players.push({ group, body, ring, facing: { x: 0, z: -1 } })
    }

    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(0.38, 20, 14),
      new THREE.MeshStandardMaterial({ color: 0xf7f7f2, roughness: 0.7 }),
    )
    ball.position.set(0, 0.76, 3)
    ball.castShadow = true
    scene.add(ball)
    const ballVelocity = new THREE.Vector3()

    let current = 1
    let goals = 0
    let goalTimer = 0
    let lastAction = 'Dribble toward the goal'

    function setCurrent(index) {
      current = index
      players.forEach((player, i) => {
        player.ring.visible = i === current
        player.body.material.color.setHex(i === current ? 0x239cff : 0x247bd1)
      })
    }

    function nearBall(player, radius = 1.65) {
      return Math.hypot(player.group.position.x - ball.position.x, player.group.position.z - ball.position.z) < radius
    }

    function passAndSwitch() {
      const passer = players[current]
      if (!nearBall(passer, 1.9)) {
        hud.flash('靠近球才能传球')
        return
      }
      const choices = players
        .map((player, index) => ({ player, index }))
        .filter(({ index }) => index !== current)
        .sort((a, b) => {
          const da = Math.hypot(a.player.group.position.x - ball.position.x, a.player.group.position.z - ball.position.z)
          const db = Math.hypot(b.player.group.position.x - ball.position.x, b.player.group.position.z - ball.position.z)
          return da - db
        })
      const receiver = choices[0]
      const dx = receiver.player.group.position.x - ball.position.x
      const dz = receiver.player.group.position.z - ball.position.z
      const n = norm2(dx, dz)
      ballVelocity.set(n.x * 11.5, 0, n.z * 11.5)
      setCurrent(receiver.index)
      lastAction = `Pass → Player ${receiver.index + 1}`
      hud.flash(lastAction)
    }

    function shoot() {
      const player = players[current]
      if (!nearBall(player, 1.9)) {
        hud.flash('靠近球才能射门')
        return
      }
      ball.position.x = player.group.position.x + player.facing.x * 1.1
      ball.position.z = player.group.position.z + player.facing.z * 1.1
      ballVelocity.set(player.facing.x * 18, 0, player.facing.z * 18)
      lastAction = `Player ${current + 1} shot`
      hud.flash('SHOOT!')
    }

    function scoreGoal() {
      goals++
      goalTimer = 1.1
      hud.showOverlay('进球', `训练继续 · 总进球 ${goals}`)
      ball.position.set(0, 0.76, 0)
      ballVelocity.set(0, 0, 0)
      lastAction = 'Goal — ball reset at center'
    }

    setCurrent(current)

    return {
      update(dt) {
        const controlled = players[current]
        const axis = input.wasd()
        let moving = false
        if (axis.x || axis.z) {
          const n = norm2(axis.x, axis.z)
          const speed = input.shift() ? 8.6 : 5.6
          controlled.group.position.x = clamp(controlled.group.position.x + n.x * speed * dt, -13.7, 13.7)
          controlled.group.position.z = clamp(controlled.group.position.z + n.z * speed * dt, -23.5, 23.5)
          controlled.facing = n
          controlled.group.rotation.y = Math.atan2(n.x, n.z)
          moving = true
        }

        if (input.hit('KeyJ')) passAndSwitch()
        else if (input.hit('KeyK')) shoot()

        const active = players[current]
        let dribbling = false
        if (!input.hit('KeyJ') && !input.hit('KeyK') && nearBall(active, 1.45) && moving && ballVelocity.length() < 7) {
          const targetX = active.group.position.x + active.facing.x * 1.05
          const targetZ = active.group.position.z + active.facing.z * 1.05
          const oldX = ball.position.x
          const oldZ = ball.position.z
          ball.position.x += (targetX - ball.position.x) * (1 - Math.exp(-14 * dt))
          ball.position.z += (targetZ - ball.position.z) * (1 - Math.exp(-14 * dt))
          ballVelocity.x = (ball.position.x - oldX) / Math.max(dt, 0.001)
          ballVelocity.z = (ball.position.z - oldZ) / Math.max(dt, 0.001)
          dribbling = true
          lastAction = input.shift() ? 'Sprint dribble' : 'Dribble'
        }

        if (!dribbling) {
          ball.position.x += ballVelocity.x * dt
          ball.position.z += ballVelocity.z * dt
          const friction = Math.pow(0.22, dt)
          ballVelocity.multiplyScalar(friction)
          if (ballVelocity.length() < 0.06) ballVelocity.set(0, 0, 0)
        }
        ball.rotation.x += ballVelocity.z * dt / 0.38
        ball.rotation.z -= ballVelocity.x * dt / 0.38

        if (ball.position.z < -23.45 && Math.abs(ball.position.x) < 3.55) {
          scoreGoal()
        } else {
          if (Math.abs(ball.position.x) > 14.4) {
            ball.position.x = clamp(ball.position.x, -14.4, 14.4)
            ballVelocity.x *= -0.62
          }
          if (ball.position.z > 24.2 || ball.position.z < -24.4) {
            ball.position.z = clamp(ball.position.z, -24.4, 24.2)
            ballVelocity.z *= -0.62
          }
        }

        if (goalTimer > 0) {
          goalTimer -= dt
          if (goalTimer <= 0) hud.hideOverlay()
        }

        for (let i = 0; i < players.length; i++) {
          if (i === current) continue
          const player = players[i]
          const dx = ball.position.x - player.group.position.x
          const dz = ball.position.z - player.group.position.z
          if (Math.abs(dx) + Math.abs(dz) > 0.1) player.group.rotation.y = Math.atan2(dx, dz)
        }

        const focus = new THREE.Vector3(
          (players[current].group.position.x + ball.position.x) / 2,
          0.8,
          (players[current].group.position.z + ball.position.z) / 2,
        )
        const separation = Math.hypot(
          players[current].group.position.x - ball.position.x,
          players[current].group.position.z - ball.position.z,
        )
        const desiredCamera = new THREE.Vector3(
          focus.x + 7,
          8.5 + separation * 0.27,
          focus.z + 10.5 + separation * 0.38,
        )
        camera.position.lerp(desiredCamera, 1 - Math.exp(-4 * dt))
        camera.lookAt(focus)

        hud.setStats(`Player ${current + 1}  ·  Goals ${goals}  ·  ${lastAction}`)
      },
      cleanup() {
        hud.hideOverlay()
      },
    }
  })
}
