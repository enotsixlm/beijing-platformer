import { THREE, run, ground, box, clamp } from '../engine.js'

export function start() {
  return run('flight_full_control', {
    bg: 0x78a8d8,
    camPos: [0, 20, 30],
    far: 650,
    shadowCam: 90,
  }, (app) => {
    const { scene, camera, renderer, input, hud } = app
    ground(scene, { s: 420, color: 0x47734b })

    const buildingData = [
      [-42, -52, 12, 0x8f735d], [38, -68, 25, 0x667a91],
      [78, -18, 17, 0x9a6264], [-88, 8, 31, 0x5c6680],
      [22, 58, 20, 0x88754c], [-48, 72, 14, 0x6e8276],
      [104, 76, 38, 0x596d87], [-122, -90, 28, 0x84646d],
      [0, -125, 44, 0x637184], [130, 18, 22, 0x927b58],
    ]
    for (const [x, z, height, color] of buildingData) {
      box(scene, {
        w: 8 + (height % 5), h: height, d: 8 + (height % 7),
        color, x, y: 0.4, z, y0: true, rough: 0.6,
      })
    }

    const plane = new THREE.Group()
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0xf1eee4,
      metalness: 0.45,
      roughness: 0.28,
    })
    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0xe34a42,
      metalness: 0.25,
      roughness: 0.4,
    })
    const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x263447, roughness: 0.4 })
    const fuselage = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.9, 4.4), bodyMaterial)
    const wings = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.18, 1.4), accentMaterial)
    wings.position.z = 0.25
    const tailWing = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.15, 0.8), accentMaterial)
    tailWing.position.set(0, 0.25, 1.75)
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.3, 0.9), accentMaterial)
    fin.position.set(0, 0.65, 1.7)
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.58, 1.25, 16), accentMaterial)
    nose.rotation.x = -Math.PI / 2
    nose.position.z = -2.75
    const propeller = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.12, 0.18), darkMaterial)
    propeller.position.z = -3.35
    plane.add(fuselage, wings, tailWing, fin, nose, propeller)
    plane.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true
        node.receiveShadow = true
      }
    })
    plane.position.set(0, 18, 18)
    scene.add(plane)

    let speed = 20
    let yaw = 0
    let pitch = 0
    let roll = 0
    let aimYaw = 0
    let aimPitch = 0
    let locked = false
    const canvas = renderer.domElement
    const forward = new THREE.Vector3()
    const planeUp = new THREE.Vector3()
    const desiredCamera = new THREE.Vector3()
    const lookTarget = new THREE.Vector3()
    const orientation = new THREE.Euler(0, 0, 0, 'YXZ')

    const onClick = () => canvas.requestPointerLock?.()
    const onLock = () => {
      locked = document.pointerLockElement === canvas
      if (locked) hud.flash('飞行鼠标已锁定')
    }
    canvas.addEventListener('click', onClick)
    document.addEventListener('pointerlockchange', onLock)

    return {
      update(dt) {
        if (input.down('KeyW')) speed += 14 * dt
        if (input.down('KeyS')) speed -= 14 * dt
        speed = clamp(speed, 8, 42)

        if (locked) {
          aimYaw -= input.mouse.dx * 0.0035
          aimPitch -= input.mouse.dy * 0.0028
        } else {
          aimYaw -= input.mouse.ndc.x * 0.8 * dt
          aimPitch += input.mouse.ndc.y * 0.55 * dt
        }
        aimPitch = clamp(aimPitch, -0.72, 0.72)
        const turnBlend = 1 - Math.exp(-3.6 * dt)
        yaw += (aimYaw - yaw) * turnBlend
        pitch += (aimPitch - pitch) * turnBlend

        let desiredRoll = 0
        if (input.down('KeyA')) desiredRoll = 1.25
        if (input.down('KeyD')) desiredRoll = -1.25
        roll += (desiredRoll - roll) * (1 - Math.exp(-(desiredRoll ? 5 : 2.5) * dt))

        orientation.set(pitch, yaw, roll)
        plane.quaternion.setFromEuler(orientation)
        forward.set(0, 0, -1).applyQuaternion(plane.quaternion).normalize()
        plane.position.addScaledVector(forward, speed * dt)
        if (plane.position.y < 3.5) {
          plane.position.y = 3.5
          aimPitch = Math.max(aimPitch, 0.14)
          pitch = Math.max(pitch, 0)
        }
        if (plane.position.y > 85) {
          plane.position.y = 85
          aimPitch = Math.min(aimPitch, -0.08)
        }
        propeller.rotation.z += speed * dt * 1.8

        desiredCamera.set(0, 3.6, 10.5).applyQuaternion(plane.quaternion).add(plane.position)
        camera.position.lerp(desiredCamera, 1 - Math.exp(-4.2 * dt))
        planeUp.set(0, 1, 0).applyQuaternion(plane.quaternion).normalize()
        camera.up.lerp(planeUp, 1 - Math.exp(-4.5 * dt)).normalize()
        lookTarget.copy(plane.position).addScaledVector(forward, 7)
        camera.lookAt(lookTarget)

        hud.setStats(
          `速度 ${speed.toFixed(0)} m/s · 高度 ${plane.position.y.toFixed(0)} m\n`
          + `${locked ? '鼠标转向已锁定' : '移动鼠标转向 · 点击锁定'}\nA / D 自由横滚`,
        )
      },
      cleanup() {
        canvas.removeEventListener('click', onClick)
        document.removeEventListener('pointerlockchange', onLock)
        if (document.pointerLockElement === canvas) document.exitPointerLock?.()
      },
    }
  })
}
