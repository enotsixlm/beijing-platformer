import { THREE, run, ground, box, makeLabel } from '../engine.js'

export function start() {
  return run('flight_patrol_drone_landmark_loop', {
    bg: 0x8bb8d6,
    camPos: [0, 50, 58],
    lookAt: [0, 4, 0],
    far: 300,
    shadowCam: 70,
  }, (app) => {
    const { scene, camera, hud } = app
    ground(scene, { s: 90, color: 0x4d7451 })

    const landmarks = [
      { name: 'RED SHORT', x: -24, z: -15, h: 5, color: 0xf04444 },
      { name: 'BLUE TOWER', x: 17, z: -24, h: 12, color: 0x347eff },
      { name: 'YELLOW MID', x: 27, z: 14, h: 8, color: 0xf4d13e },
      { name: 'PURPLE TALL', x: -16, z: 25, h: 17, color: 0xa84ff0 },
    ]
    for (const landmark of landmarks) {
      box(scene, {
        w: landmark.h > 14 ? 5 : 6,
        h: landmark.h,
        d: landmark.h > 14 ? 5 : 6,
        color: landmark.color,
        x: landmark.x,
        y: 0.4,
        z: landmark.z,
        y0: true,
        rough: 0.48,
      })
      const cap = box(scene, {
        w: 7, h: 0.5, d: 7, color: 0xf4f1dd,
        x: landmark.x, y: landmark.h + 0.65, z: landmark.z,
      })
      cap.rotation.y = Math.PI / 4
      const label = makeLabel(landmark.name, { scale: 3.1 })
      label.position.set(landmark.x, landmark.h + 2.4, landmark.z)
      scene.add(label)
    }

    const pathPoints = landmarks.map((landmark, index) => new THREE.Vector3(
      landmark.x + (index % 2 ? -3 : 3),
      landmark.h + 5.5,
      landmark.z + (index < 2 ? 4 : -4),
    ))
    const path = new THREE.CatmullRomCurve3(pathPoints, true, 'catmullrom', 0.32)

    const drone = new THREE.Group()
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0xe8edf2,
      metalness: 0.55,
      roughness: 0.28,
    })
    const noseMaterial = new THREE.MeshStandardMaterial({
      color: 0xff5a45,
      emissive: 0x5c1208,
      roughness: 0.28,
    })
    const rotorMaterial = new THREE.MeshStandardMaterial({ color: 0x202b34, metalness: 0.7 })
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.85, 18, 12), bodyMaterial)
    body.scale.z = 1.25
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.48, 1.15, 16), noseMaterial)
    nose.rotation.x = Math.PI / 2
    nose.position.z = 1.35
    const arm1 = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.14, 0.16), rotorMaterial)
    const arm2 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 3.8), rotorMaterial)
    const rotors = []
    for (const [x, z] of [[-1.8, -1.8], [1.8, -1.8], [-1.8, 1.8], [1.8, 1.8]]) {
      const rotor = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.14), rotorMaterial)
      rotor.position.set(x, 0.12, z)
      drone.add(rotor)
      rotors.push(rotor)
    }
    drone.add(body, nose, arm1, arm2)
    drone.traverse((node) => {
      if (node.isMesh) node.castShadow = true
    })
    scene.add(drone)

    let cycle = 0
    let loops = 0
    const speed = 0.038
    const position = new THREE.Vector3()
    const tangent = new THREE.Vector3()
    const target = new THREE.Vector3()
    drone.position.copy(path.getPointAt(0))

    return {
      update(dt) {
        const previous = cycle
        cycle = (cycle + speed * Math.max(0, dt)) % 1
        if (cycle < previous) loops++
        path.getPointAt(cycle, position)
        path.getTangentAt(cycle, tangent).normalize()
        drone.position.copy(position)
        target.copy(position).add(tangent)
        drone.lookAt(target)
        for (const rotor of rotors) rotor.rotation.y += dt * 28

        camera.up.set(0, 1, 0)
        camera.lookAt(0, 4, 0)

        let nearest = landmarks[0]
        let nearestDistance = Infinity
        for (const landmark of landmarks) {
          const distance = Math.hypot(position.x - landmark.x, position.z - landmark.z)
          if (distance < nearestDistance) {
            nearest = landmark
            nearestDistance = distance
          }
        }
        hud.setStats(
          `AUTO PATROL · LOOP ${loops + 1}\n最近地标 ${nearest.name}\n`
          + `闭环进度 ${(cycle * 100).toFixed(0)}% · 恒定路径速度`,
        )
      },
    }
  })
}
