import * as THREE from 'three'

export function addDecor(scene) {
  const colors = [0x3cf0ff, 0xff3ec8, 0xffe14a]
  const spots = [
    [-18.5, 6.4, -20], [18, 7.2, -16], [-12, 8.1, 4], [14, 5.8, 8],
    [-8, 9.4, -22], [9, 6.6, -8], [-20, 5.2, -4], [20, 8.8, -6],
    [0, 10.2, -24], [-15, 7.6, 10], [12, 9.0, -21], [4, 6.1, 6],
    [-6, 8.4, -12], [16, 5.4, -22], [-22, 6.8, -14],
  ]
  const cubes = []
  for (let i = 0; i < spots.length; i++) {
    const hex = colors[i % 3]
    const s = 0.42 + (i % 3) * 0.08
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(s, s, s),
      new THREE.MeshBasicMaterial({ color: hex }),
    )
    m.position.set(...spots[i])
    m.userData.ph = i * 0.7
    m.userData.baseY = spots[i][1]
    scene.add(m)
    cubes.push(m)
  }
  const back = new THREE.PointLight(0x2ee8ff, 2.4, 48, 1.8)
  back.position.set(0, 6.4, -22)
  scene.add(back)
  const floorGlow = new THREE.PointLight(0x1ad8e8, 1.1, 28, 1.8)
  floorGlow.position.set(0, 1.2, 2)
  scene.add(floorGlow)
  return cubes
}

export function stepDecor(cubes, t) {
  for (const c of cubes) {
    c.position.y = c.userData.baseY + Math.sin(t * 0.9 + c.userData.ph) * 0.28
    c.rotation.y += 0.006
    c.rotation.x += 0.002
  }
}
