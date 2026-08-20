import * as THREE from 'three'

export function addDecor(scene) {
  const colors = [0x3cf0ff, 0xff3ec8, 0xffe14a]
  const cubes = []
  for (let i = 0; i < 18; i++) {
    const hex = colors[i % 3]
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.55, 0.55),
      new THREE.MeshLambertMaterial({ color: hex, emissive: hex, emissiveIntensity: 1.1 }),
    )
    m.position.set(
      (Math.random() - 0.5) * 40,
      4 + Math.random() * 7,
      -8 + (Math.random() - 0.5) * 28,
    )
    m.userData.ph = Math.random() * Math.PI * 2
    m.userData.amp = 0.4 + Math.random() * 0.5
    scene.add(m)
    cubes.push(m)
  }
  // extra back glow
  const back = new THREE.PointLight(0x2ee8ff, 1.6, 40, 2)
  back.position.set(0, 6, -22)
  scene.add(back)
  return cubes
}

export function stepDecor(cubes, t) {
  for (const c of cubes) {
    c.position.y += Math.sin(t * 0.9 + c.userData.ph) * 0.004
    c.rotation.y += 0.004
  }
}
