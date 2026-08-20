import {
  THREE, run, box, clamp, len2, norm2, orthoCamera, raycaster
} from '../engine.js'

export function start() {
  const camera = orthoCamera(10, 24)
  camera.up.set(0, 0, -1)
  camera.position.set(0, 24, 0.01)
  camera.lookAt(0, 0, 0)

  return run('pool_cue_ball_impulse', {
    camera,
    bg: 0x171c25,
    shadows: true,
  }, (app) => {
    const { scene, input, hud } = app

    box(scene, { w: 11.2, h: 0.7, d: 17.2, color: 0x4d2b19, x: 0, y: 0, z: 0 })
    box(scene, { w: 10, h: 0.24, d: 16, color: 0x16704f, x: 0, y: 0.45, z: 0 })
    box(scene, { w: 11, h: 0.75, d: 0.55, color: 0x6a3c21, x: 0, y: 0.65, z: -8.25 })
    box(scene, { w: 11, h: 0.75, d: 0.55, color: 0x6a3c21, x: 0, y: 0.65, z: 8.25 })
    box(scene, { w: 0.55, h: 0.75, d: 16, color: 0x6a3c21, x: -5.25, y: 0.65, z: 0 })
    box(scene, { w: 0.55, h: 0.75, d: 16, color: 0x6a3c21, x: 5.25, y: 0.65, z: 0 })

    const radius = 0.4
    const balls = []
    function addBall(x, z, color, cue = false) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 24, 16),
        new THREE.MeshStandardMaterial({ color, roughness: 0.28 }),
      )
      mesh.castShadow = true
      mesh.position.set(x, 0.9, z)
      scene.add(mesh)
      const ball = { mesh, x, z, vx: 0, vz: 0, cue }
      balls.push(ball)
      return ball
    }

    const cue = addBall(0, 3.4, 0xffffff, true)
    addBall(0, -3.6, 0xe64848)
    addBall(-0.48, -4.45, 0xf0cb36)
    addBall(0.48, -4.45, 0x3576df)

    const aimGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(),
      new THREE.Vector3(),
    ])
    const aimLine = new THREE.Line(
      aimGeometry,
      new THREE.LineBasicMaterial({ color: 0xfff078, transparent: true, opacity: 0.95 }),
    )
    aimLine.visible = false
    scene.add(aimLine)

    const powerMarker = new THREE.Mesh(
      new THREE.ConeGeometry(0.18, 0.45, 12),
      new THREE.MeshBasicMaterial({ color: 0xffdf4f }),
    )
    powerMarker.rotation.x = Math.PI / 2
    powerMarker.visible = false
    scene.add(powerMarker)

    const tablePlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.58)
    const mousePoint = new THREE.Vector3()
    let aiming = false
    let aimPower = 0

    function stopped() {
      return balls.every((ball) => len2(ball.vx, ball.vz) < 0.05)
    }

    function mouseOnTable() {
      raycaster.setFromCamera(input.mouse.ndc, camera)
      return raycaster.ray.intersectPlane(tablePlane, mousePoint)
    }

    function updateAim() {
      if (!mouseOnTable()) return
      const dx = mousePoint.x - cue.x
      const dz = mousePoint.z - cue.z
      const distance = clamp(len2(dx, dz), 0, 6)
      const n = norm2(dx, dz)
      const endX = cue.x + n.x * distance
      const endZ = cue.z + n.z * distance
      const positions = aimLine.geometry.attributes.position
      positions.setXYZ(0, cue.x, 1.05, cue.z)
      positions.setXYZ(1, endX, 1.05, endZ)
      positions.needsUpdate = true
      powerMarker.position.set(endX, 1.05, endZ)
      powerMarker.rotation.z = -Math.atan2(n.z, n.x) - Math.PI / 2
      aimPower = distance / 6
    }

    function strike() {
      if (!mouseOnTable()) return
      const dx = cue.x - mousePoint.x
      const dz = cue.z - mousePoint.z
      const distance = clamp(len2(dx, dz), 0, 6)
      if (distance < 0.2) return
      const n = norm2(dx, dz)
      const speed = 3 + distance * 2.15
      cue.vx = n.x * speed
      cue.vz = n.z * speed
    }

    function collideBalls(a, b) {
      let dx = b.x - a.x
      let dz = b.z - a.z
      let distance = len2(dx, dz)
      const minDistance = radius * 2
      if (distance >= minDistance) return
      if (distance < 0.0001) {
        dx = 1
        dz = 0
        distance = 1
      }
      const nx = dx / distance
      const nz = dz / distance
      const overlap = minDistance - distance
      a.x -= nx * overlap * 0.5
      a.z -= nz * overlap * 0.5
      b.x += nx * overlap * 0.5
      b.z += nz * overlap * 0.5

      const relative = (b.vx - a.vx) * nx + (b.vz - a.vz) * nz
      if (relative >= 0) return
      const impulse = -(1 + 0.96) * relative / 2
      a.vx -= impulse * nx
      a.vz -= impulse * nz
      b.vx += impulse * nx
      b.vz += impulse * nz
    }

    function physics(dt) {
      const steps = 3
      const step = dt / steps
      for (let s = 0; s < steps; s++) {
        for (const ball of balls) {
          ball.x += ball.vx * step
          ball.z += ball.vz * step
          if (ball.x < -4.6 + radius) {
            ball.x = -4.6 + radius
            ball.vx = Math.abs(ball.vx) * 0.88
          }
          if (ball.x > 4.6 - radius) {
            ball.x = 4.6 - radius
            ball.vx = -Math.abs(ball.vx) * 0.88
          }
          if (ball.z < -7.6 + radius) {
            ball.z = -7.6 + radius
            ball.vz = Math.abs(ball.vz) * 0.88
          }
          if (ball.z > 7.6 - radius) {
            ball.z = 7.6 - radius
            ball.vz = -Math.abs(ball.vz) * 0.88
          }
        }
        for (let i = 0; i < balls.length; i++) {
          for (let j = i + 1; j < balls.length; j++) collideBalls(balls[i], balls[j])
        }
      }
      const drag = Math.pow(0.33, dt)
      for (const ball of balls) {
        ball.vx *= drag
        ball.vz *= drag
        if (len2(ball.vx, ball.vz) < 0.045) ball.vx = ball.vz = 0
        ball.mesh.position.set(ball.x, 0.9, ball.z)
        ball.mesh.rotation.x += ball.vz * dt / radius
        ball.mesh.rotation.z -= ball.vx * dt / radius
      }
    }

    return {
      update(dt) {
        const canShoot = stopped()
        if (input.mouse.justDown && canShoot) {
          aiming = true
          aimLine.visible = true
          powerMarker.visible = true
          updateAim()
        }
        if (aiming && input.mouse.down) updateAim()
        if (aiming && input.mouse.justUp) {
          updateAim()
          strike()
          aiming = false
          aimLine.visible = false
          powerMarker.visible = false
        }
        if (!canShoot && aiming) {
          aiming = false
          aimLine.visible = false
          powerMarker.visible = false
        }

        physics(dt)
        hud.setStats(
          stopped()
            ? `球已静止　${aiming ? `力度：${Math.round(aimPower * 100)}%` : '按住左键瞄准'}`
            : '球运动中，请等待全部停止',
        )
      },
      cleanup() {},
    }
  })
}
