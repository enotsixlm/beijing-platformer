import * as THREE from 'three'

const MAX = 420

export function createDebris(scene) {
  const geo = new THREE.BoxGeometry(1, 1, 1)
  const mat = new THREE.MeshBasicMaterial({ vertexColors: true })
  const mesh = new THREE.InstancedMesh(geo, mat, MAX)
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  mesh.castShadow = true
  scene.add(mesh)

  const dummy = new THREE.Object3D()
  const color = new THREE.Color()
  const items = []
  for (let i = 0; i < MAX; i++) {
    items.push({
      alive: false, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, life: 0, size: 0.18, r: 1, g: 1, b: 1,
    })
  }
  let cursor = 0

  function spawn(x, y, z, vx, vy, vz, hex, size = 0.2, life = 1.1) {
    const it = items[cursor]
    cursor = (cursor + 1) % MAX
    color.setHex(hex)
    it.alive = true
    it.x = x; it.y = y; it.z = z
    it.vx = vx; it.vy = vy; it.vz = vz
    it.life = life
    it.size = size
    it.r = color.r; it.g = color.g; it.b = color.b
  }

  function burst(x, y, z, hex, n, speed, size) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2
      const b = Math.random() * Math.PI
      const s = speed * (0.4 + Math.random())
      spawn(
        x, y, z,
        Math.cos(a) * Math.sin(b) * s,
        Math.cos(b) * s + 2,
        Math.sin(a) * Math.sin(b) * s,
        hex, size * (0.7 + Math.random() * 0.6), 0.7 + Math.random() * 0.7,
      )
    }
  }

  function update(dt) {
    let shown = 0
    for (let i = 0; i < MAX; i++) {
      const it = items[i]
      if (!it.alive) continue
      it.life -= dt
      it.vy -= 22 * dt
      it.x += it.vx * dt
      it.y += it.vy * dt
      it.z += it.vz * dt
      if (it.y < 0.08) {
        it.y = 0.08
        it.vy *= -0.22
        it.vx *= 0.55
        it.vz *= 0.55
      }
      if (it.life <= 0) { it.alive = false; continue }
      dummy.position.set(it.x, it.y, it.z)
      dummy.scale.setScalar(it.size)
      dummy.rotation.set(it.life * 4, it.life * 2.2, 0)
      dummy.updateMatrix()
      mesh.setMatrixAt(shown, dummy.matrix)
      mesh.setColorAt(shown, color.setRGB(it.r, it.g, it.b))
      shown++
    }
    mesh.count = shown
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }

  return { spawn, burst, update, mesh }
}

export function createPuffs(scene) {
  const geo = new THREE.BoxGeometry(1, 1, 1)
  const mat = new THREE.MeshBasicMaterial({ color: 0xf4fbff, transparent: true, opacity: 0.85 })
  const mesh = new THREE.InstancedMesh(geo, mat, 80)
  scene.add(mesh)
  const dummy = new THREE.Object3D()
  const items = []
  for (let i = 0; i < 80; i++) items.push({ alive: false, x: 0, y: 0, z: 0, life: 0, size: 0.2 })
  let c = 0

  function puff(x, y, z) {
    for (let i = 0; i < 6; i++) {
      const it = items[c]; c = (c + 1) % items.length
      it.alive = true
      it.x = x + (Math.random() - 0.5) * 0.4
      it.y = y + Math.random() * 0.2
      it.z = z + (Math.random() - 0.5) * 0.4
      it.life = 0.28 + Math.random() * 0.12
      it.size = 0.12 + Math.random() * 0.12
    }
  }

  function update(dt) {
    let n = 0
    for (const it of items) {
      if (!it.alive) continue
      it.life -= dt
      it.y += dt * 0.8
      if (it.life <= 0) { it.alive = false; continue }
      dummy.position.set(it.x, it.y, it.z)
      dummy.scale.setScalar(it.size * (it.life / 0.3))
      dummy.updateMatrix()
      mesh.setMatrixAt(n++, dummy.matrix)
    }
    mesh.count = n
    mesh.instanceMatrix.needsUpdate = true
  }

  return { puff, update }
}
