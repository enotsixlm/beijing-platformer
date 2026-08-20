import * as THREE from 'three'

function neonBar(x, y, z, w, h, d, hex = 0x3cf0ff) {
  const m = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshBasicMaterial({ color: hex }),
  )
  m.position.set(x, y, z)
  return m
}

export function addDecor(scene) {
  const colors = [0x3cf0ff, 0xff3ec8, 0xffe14a]
  const planes = [
    [-16, 7.2, -18, 1.6, 0.9], [14, 8.4, -12, 1.2, 0.7], [-10, 9.5, 2, 0.9, 1.4],
    [18, 6.2, -6, 1.4, 0.8], [0, 11.2, -22, 2.2, 0.6], [-20, 5.6, -8, 1.1, 1.1],
    [9, 8.8, -20, 0.8, 1.6], [-6, 6.8, 8, 1.3, 0.7], [12, 9.6, 4, 0.9, 0.9],
    [-14, 10.4, -4, 1.5, 0.5], [20, 7.4, -16, 1.0, 1.3],
  ]
  const cubes = []
  for (let i = 0; i < planes.length; i++) {
    const [x, y, z, w, h] = planes[i]
    const hex = colors[i % 3]
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: hex, side: THREE.DoubleSide, transparent: true, opacity: 0.92 }),
    )
    m.position.set(x, y, z)
    m.userData.ph = i * 0.7
    m.userData.baseY = y
    scene.add(m)
    cubes.push(m)
  }

  const frame = new THREE.Group()
  const fw = 28, fh = 8.2, y0 = 1.15, z0 = -25.35
  const t = 0.14
  frame.add(neonBar(0, y0, z0, fw, t, t))
  frame.add(neonBar(0, y0 + fh, z0, fw, t, t))
  frame.add(neonBar(-fw / 2, y0 + fh / 2, z0, t, fh, t))
  frame.add(neonBar(fw / 2, y0 + fh / 2, z0, t, fh, t))
  scene.add(frame)

  const horizon = neonBar(0, 9.4, -27.2, 48, 0.08, 0.08)
  scene.add(horizon)

  const back = new THREE.PointLight(0x2ee8ff, 1.2, 42, 1.8)
  back.position.set(0, 5.6, -22)
  scene.add(back)
  return cubes
}

export function stepDecor(cubes, t) {
  for (const c of cubes) {
    c.position.y = c.userData.baseY + Math.sin(t * 0.9 + c.userData.ph) * 0.22
    c.rotation.y = Math.sin(t * 0.2 + c.userData.ph) * 0.15
  }
}
