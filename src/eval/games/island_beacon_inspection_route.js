import { THREE, run, box, makeLabel, clamp, len2, norm2, lookXZ } from '../engine.js'

function terrainHeight(x, z) {
  const radius = Math.sqrt((x / 34) ** 2 + (z / 42) ** 2)
  const coast = clamp((1 - radius) * 5.5, -1.15, 0.58)
  const hill = 3.3 * Math.exp(-((x - 8) ** 2 + (z + 24) ** 2) / 155)
  const ridge = 0.85 * Math.exp(-((x + 8) ** 2 + (z + 2) ** 2) / 280)
  const roll = (Math.sin(x * 0.24) + Math.cos(z * 0.2)) * 0.16
  return coast + hill + ridge + roll
}

export function start() {
  return run('island_beacon_inspection_route', {
    bg: 0x030817,
    fog: new THREE.Fog(0x030817, 30, 105),
    hemi: 0.24,
    sun: 0.42,
    camPos: [0, 8, 43],
    lookAt: [0, 1, 32],
    far: 180,
    shadowCam: 65,
  }, (app) => {
    const { scene, camera, sun, input, hud } = app
    sun.color.set(0x93a9ff)
    sun.position.set(-18, 26, 12)

    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x0d3561,
      roughness: 0.22,
      metalness: 0.48,
      transparent: true,
      opacity: 0.9,
    })
    const water = new THREE.Mesh(new THREE.PlaneGeometry(150, 150), waterMaterial)
    water.rotation.x = -Math.PI / 2
    water.position.y = -0.62
    water.receiveShadow = true
    scene.add(water)

    const terrainGeometry = new THREE.PlaneGeometry(70, 90, 56, 72)
    const positionAttribute = terrainGeometry.attributes.position
    const terrainColors = []
    const lowColor = new THREE.Color(0x314737)
    const highColor = new THREE.Color(0x536148)
    const color = new THREE.Color()
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i)
      const worldZ = -positionAttribute.getY(i)
      const height = terrainHeight(x, worldZ)
      positionAttribute.setZ(i, height)
      color.copy(lowColor).lerp(highColor, clamp((height + 0.4) / 4.2, 0, 1))
      terrainColors.push(color.r, color.g, color.b)
    }
    terrainGeometry.setAttribute('color', new THREE.Float32BufferAttribute(terrainColors, 3))
    terrainGeometry.computeVertexNormals()
    terrainGeometry.rotateX(-Math.PI / 2)
    const terrain = new THREE.Mesh(
      terrainGeometry,
      new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.93 }),
    )
    terrain.receiveShadow = true
    scene.add(terrain)

    const routeControls = [
      new THREE.Vector3(0, 0, 34),
      new THREE.Vector3(-4, 0, 24),
      new THREE.Vector3(5, 0, 14),
      new THREE.Vector3(-5, 0, 3),
      new THREE.Vector3(4, 0, -8),
      new THREE.Vector3(0, 0, -16),
      new THREE.Vector3(8, 0, -25),
    ]
    const route = new THREE.CatmullRomCurve3(routeControls, false, 'catmullrom', 0.35)
    const roadVertices = []
    const roadIndices = []
    const roadSamples = 120
    for (let i = 0; i <= roadSamples; i++) {
      const t = i / roadSamples
      const point = route.getPointAt(t)
      const tangent = route.getTangentAt(t).normalize()
      const sideX = tangent.z
      const sideZ = -tangent.x
      const sideLength = Math.hypot(sideX, sideZ) || 1
      const sx = sideX / sideLength * 1.75
      const sz = sideZ / sideLength * 1.75
      const y = terrainHeight(point.x, point.z) + 0.09
      roadVertices.push(point.x + sx, y, point.z + sz)
      roadVertices.push(point.x - sx, y, point.z - sz)
      if (i < roadSamples) {
        const a = i * 2
        roadIndices.push(a, a + 2, a + 1, a + 2, a + 3, a + 1)
      }
    }
    const roadGeometry = new THREE.BufferGeometry()
    roadGeometry.setAttribute('position', new THREE.Float32BufferAttribute(roadVertices, 3))
    roadGeometry.setIndex(roadIndices)
    roadGeometry.computeVertexNormals()
    const road = new THREE.Mesh(
      roadGeometry,
      new THREE.MeshStandardMaterial({ color: 0x555964, roughness: 0.88 }),
    )
    road.receiveShadow = true
    scene.add(road)

    for (let z = 35; z <= 43; z += 1.2) {
      box(scene, {
        w: 7, h: 0.3, d: 0.9, color: 0x765039,
        x: 0, y: Math.max(0.15, terrainHeight(0, 35) + 0.02), z,
        metal: 0.05, rough: 0.82,
      })
    }
    box(scene, { w: 0.45, h: 2, d: 0.45, color: 0x503627, x: -3, y: -0.35, z: 40 })
    box(scene, { w: 0.45, h: 2, d: 0.45, color: 0x503627, x: 3, y: -0.35, z: 40 })

    const scenery = [
      [-16, 18, 2.8], [13, 22, 2.2], [-18, -8, 3.2], [18, -4, 2.6],
      [-11, -22, 2.4], [19, -20, 3.4], [-22, 7, 2.1], [12, 5, 2.7],
    ]
    for (const [x, z, height] of scenery) {
      const y = terrainHeight(x, z)
      box(scene, {
        w: 0.45, h: height, d: 0.45, color: 0x493425,
        x, y, z, y0: true,
      })
      const crown = new THREE.Mesh(
        new THREE.ConeGeometry(1.5, 3.4, 9),
        new THREE.MeshStandardMaterial({ color: 0x183d2c, roughness: 0.9 }),
      )
      crown.position.set(x, y + height + 1.1, z)
      crown.castShadow = true
      scene.add(crown)
    }

    const beaconInfos = [
      { x: -3.7, z: 22.3, name: 'BEACON 1' },
      { x: -4.6, z: 2.5, name: 'BEACON 2' },
      { x: 8, z: -24.5, name: 'BEACON 3' },
    ]
    const beacons = []
    for (const info of beaconInfos) {
      const y = terrainHeight(info.x, info.z) + 0.12
      const group = new THREE.Group()
      group.position.set(info.x, y, info.z)
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 1.05, 0.55, 16),
        new THREE.MeshStandardMaterial({ color: 0x34404e, metalness: 0.65, roughness: 0.35 }),
      )
      base.position.y = 0.27
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.21, 3.6, 12),
        new THREE.MeshStandardMaterial({ color: 0xaeb7c3, metalness: 0.8, roughness: 0.25 }),
      )
      pole.position.y = 2.05
      const lampMaterial = new THREE.MeshStandardMaterial({
        color: 0xff3038,
        emissive: 0xff1824,
        emissiveIntensity: 2.3,
        roughness: 0.2,
      })
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.52, 18, 12), lampMaterial)
      lamp.position.y = 4.05
      const glow = new THREE.PointLight(0xff2835, 3.4, 12, 1.6)
      glow.position.y = 4.1
      const label = makeLabel(info.name, { color: '#f5f8ff', scale: 3.2 })
      label.position.y = 5.4
      group.add(base, pole, lamp, glow, label)
      group.traverse((node) => {
        if (node.isMesh) node.castShadow = true
      })
      scene.add(group)
      beacons.push({ ...info, group, lampMaterial, glow, inspected: false })
    }

    const player = new THREE.Group()
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 1.5, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x4aa3ff, roughness: 0.48 }),
    )
    body.position.y = 0.75
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 14, 10),
      new THREE.MeshStandardMaterial({ color: 0xf0c7a6, roughness: 0.65 }),
    )
    head.position.y = 1.75
    player.add(body, head)
    player.traverse((node) => {
      if (node.isMesh) node.castShadow = true
    })
    player.position.set(0, terrainHeight(0, 34) + 0.13, 34)
    player.rotation.y = Math.PI
    scene.add(player)

    let footY = player.position.y
    let verticalSpeed = 0
    let grounded = true
    let inspectedCount = 0
    let secured = false
    const cameraTarget = new THREE.Vector3()

    return {
      update(dt) {
        const axis = input.wasd()
        const movement = len2(axis.x, axis.z) > 1 ? norm2(axis.x, axis.z) : axis
        const speed = 6.4
        const candidateX = player.position.x + movement.x * speed * dt
        const candidateZ = player.position.z + movement.z * speed * dt
        const islandRadius = Math.sqrt((candidateX / 32) ** 2 + (candidateZ / 40) ** 2)
        if (islandRadius <= 0.9) {
          player.position.x = candidateX
          player.position.z = candidateZ
        }
        lookXZ(player, movement.x, movement.z)

        const groundY = terrainHeight(player.position.x, player.position.z) + 0.13
        if (input.hit('Space') && grounded) {
          verticalSpeed = 7
          grounded = false
        }
        if (grounded) {
          footY = groundY
        } else {
          verticalSpeed -= 19 * dt
          footY += verticalSpeed * dt
          if (footY <= groundY) {
            footY = groundY
            verticalSpeed = 0
            grounded = true
          }
        }
        footY = Math.max(footY, groundY)
        player.position.y = footY

        const expected = beacons[inspectedCount]
        if (expected) {
          const distance = Math.hypot(
            player.position.x - expected.x,
            player.position.z - expected.z,
          )
          if (distance < 3.1) {
            expected.inspected = true
            expected.lampMaterial.color.set(0x35ff8a)
            expected.lampMaterial.emissive.set(0x16ff72)
            expected.glow.color.set(0x31ff8b)
            inspectedCount++
            hud.flash(`${expected.name} INSPECTED`, 1400)
            if (inspectedCount === beacons.length && !secured) {
              secured = true
              hud.showOverlay('ISLAND SECURED', '三个信标已按路线顺序完成巡检')
            }
          }
        }

        const forwardX = Math.sin(player.rotation.y)
        const forwardZ = Math.cos(player.rotation.y)
        cameraTarget.set(
          player.position.x - forwardX * 8,
          player.position.y + 5.6,
          player.position.z - forwardZ * 8,
        )
        camera.position.lerp(cameraTarget, 1 - Math.exp(-5 * dt))
        camera.up.set(0, 1, 0)
        camera.lookAt(player.position.x, player.position.y + 1.1, player.position.z)

        const nextName = beacons[inspectedCount]?.name || '全部完成'
        hud.setStats(
          `巡检 ${inspectedCount}/3 · 下一目标 ${nextName}\n`
          + `${grounded ? '沿岛路前进' : '跳跃中'} · 海拔 ${footY.toFixed(1)} m`,
        )
      },
    }
  })
}
