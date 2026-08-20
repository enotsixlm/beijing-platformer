import { THREE, run, box, clamp, lerp } from '../engine.js'

export function start() {
  return run('racing_full_control', {
    bg: 0x8ec9ee,
    far: 260,
    camPos: [0, 8, 12],
    lookAt: [0, 0, 0],
    hint: 'W 油门 · S 刹车/倒车 · A/D 转向 · 空格手刹 · Shift 氮气',
  }, ({ scene, camera, input, hud }) => {
    const grass = box(scene, { w: 92, h: 0.25, d: 106, color: 0x498b45, y: -0.25, y0: true, cast: false })
    grass.receiveShadow = true

    const roadMat = new THREE.MeshStandardMaterial({ color: 0x30343b, roughness: 0.92 })
    const roadLeft = new THREE.Mesh(new THREE.BoxGeometry(6, 0.12, 44), roadMat)
    const roadRight = roadLeft.clone()
    roadLeft.position.set(-10, 0.06, 0)
    roadRight.position.set(10, 0.06, 0)
    scene.add(roadLeft, roadRight)

    function addCurve(z, startAngle) {
      const mesh = new THREE.Mesh(
        new THREE.RingGeometry(7, 13, 48, 1, startAngle, Math.PI),
        roadMat,
      )
      mesh.rotation.x = -Math.PI / 2
      mesh.position.set(0, 0.07, z)
      mesh.receiveShadow = true
      scene.add(mesh)
    }
    addCurve(-22, 0)
    addCurve(22, Math.PI)

    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xf5e9a8, roughness: 0.8 })
    for (const x of [-10, 10]) {
      for (let z = -19; z <= 19; z += 5) {
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.025, 2.2), stripeMat)
        stripe.position.set(x, 0.14, z)
        scene.add(stripe)
      }
    }

    const barriers = []
    function addBarrier(x, z, tangent, color) {
      const b = box(scene, { w: 1.75, h: 0.7, d: 0.34, color, x, y: 0.12, z, y0: true })
      b.rotation.y = tangent
      barriers.push(b)
    }
    for (const x of [-6.65, -13.35, 6.65, 13.35]) {
      for (let z = -20; z <= 20; z += 2.7) addBarrier(x, z, 0, ((z + 20) / 2.7) % 2 < 1 ? 0xf3f3ef : 0xe94a45)
    }
    for (const top of [-22, 22]) {
      for (const radius of [6.65, 13.35]) {
        for (let i = 0; i <= 18; i++) {
          const a = (top < 0 ? 0 : Math.PI) + (i / 18) * Math.PI
          const x = Math.cos(a) * radius
          const z = top - Math.sin(a) * radius
          addBarrier(x, z, a + Math.PI / 2, i % 2 ? 0xf3f3ef : 0xe94a45)
        }
      }
    }

    const finish = new THREE.Group()
    for (let i = 0; i < 6; i++) {
      const tile = box(finish, { w: 1, h: 0.035, d: 1, color: i % 2 ? 0xffffff : 0x151515, x: -12.5 + i, y: 0.14, z: 2 })
      tile.castShadow = false
    }
    scene.add(finish)

    const car = new THREE.Group()
    const chassis = box(car, { w: 1.65, h: 0.48, d: 3, color: 0x1687e0, y: 0.34 })
    box(car, { w: 1.35, h: 0.48, d: 1.35, color: 0x93d6f4, y: 0.78, z: 0.2, metal: 0.15 })
    for (const x of [-0.88, 0.88]) {
      for (const z of [-0.92, 0.92]) {
        const wheel = new THREE.Mesh(
          new THREE.CylinderGeometry(0.34, 0.34, 0.25, 12),
          new THREE.MeshStandardMaterial({ color: 0x16191d, roughness: 0.9 }),
        )
        wheel.rotation.z = Math.PI / 2
        wheel.position.set(x, 0.32, z)
        wheel.castShadow = true
        car.add(wheel)
      }
    }
    car.position.set(-10, 0.15, 10)
    scene.add(car)

    let speed = 0
    let heading = Math.PI
    let cameraHeading = heading
    let nitro = 100
    let lastZ = car.position.z
    let laps = 0

    function nearestTrackPoint(x, z) {
      if (z >= -22 && z <= 22) {
        const sx = x < 0 ? -10 : 10
        return { x: sx, z, distance: Math.abs(x - sx) }
      }
      const cz = z < -22 ? -22 : 22
      const dx = x
      const dz = z - cz
      const l = Math.hypot(dx, dz) || 1
      return { x: (dx / l) * 10, z: cz + (dz / l) * 10, distance: Math.abs(l - 10) }
    }

    function angleDelta(a, b) {
      let d = b - a
      while (d > Math.PI) d -= Math.PI * 2
      while (d < -Math.PI) d += Math.PI * 2
      return d
    }

    return {
      update(dt) {
        const throttle = input.down('KeyW')
        const brake = input.down('KeyS')
        const steer = (input.down('KeyD') ? 1 : 0) - (input.down('KeyA') ? 1 : 0)
        const handbrake = input.down('Space')
        const usingNitro = input.shift() && throttle && speed > 2 && nitro > 0

        if (throttle) speed += (usingNitro ? 20 : 12) * dt
        if (brake) {
          if (speed > 0.6) speed -= 22 * dt
          else speed -= 8 * dt
        }
        if (!throttle && !brake) speed *= Math.pow(0.36, dt)
        if (handbrake) speed *= Math.pow(0.18, dt)
        if (usingNitro) nitro = Math.max(0, nitro - 24 * dt)
        else nitro = Math.min(100, nitro + 7 * dt)

        speed = clamp(speed, -8, usingNitro ? 31 : 22)
        const speedTurn = clamp(Math.abs(speed) / 5, 0.22, 1)
        const turnRate = (handbrake ? 2.45 : 1.55) * speedTurn
        heading += steer * turnRate * dt * (speed >= 0 ? 1 : -1)
        car.rotation.y = heading

        car.position.x += Math.sin(heading) * speed * dt
        car.position.z += Math.cos(heading) * speed * dt

        const nearest = nearestTrackPoint(car.position.x, car.position.z)
        if (nearest.distance > 3.05) {
          speed *= Math.pow(0.1, dt)
          const correction = clamp((nearest.distance - 3.05) * dt * 2.8, 0, 0.2)
          car.position.x = lerp(car.position.x, nearest.x, correction)
          car.position.z = lerp(car.position.z, nearest.z, correction)
          chassis.material.color.setHex(0xe16638)
        } else {
          chassis.material.color.setHex(usingNitro ? 0x42c9ff : 0x1687e0)
        }

        if (lastZ > 2 && car.position.z <= 2 && car.position.x < -7 && speed > 0) laps++
        lastZ = car.position.z

        const lagRate = Math.abs(steer) > 0.5 && Math.abs(speed) > 10 ? 1.8 : 4.5
        cameraHeading += angleDelta(cameraHeading, heading) * (1 - Math.exp(-lagRate * dt))
        const pullBack = 7.5 + clamp(Math.abs(speed) / 22, 0, 1.4) * 5
        const desired = new THREE.Vector3(
          car.position.x - Math.sin(cameraHeading) * pullBack,
          4.3 + Math.abs(speed) * 0.075,
          car.position.z - Math.cos(cameraHeading) * pullBack,
        )
        camera.position.lerp(desired, 1 - Math.exp(-3.8 * dt))
        const lookAhead = new THREE.Vector3(
          car.position.x + Math.sin(heading) * 4,
          0.65,
          car.position.z + Math.cos(heading) * 4,
        )
        camera.lookAt(lookAhead)

        hud.setStats(`速度 ${Math.round(Math.abs(speed) * 8)} km/h  ·  氮气 ${Math.round(nitro)}%  ·  圈数 ${laps}`)
      },
      cleanup() {},
    }
  })
}
