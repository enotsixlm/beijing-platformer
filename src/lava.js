import * as THREE from 'three'

function lavaTex() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')
  g.fillStyle = '#3a0800'
  g.fillRect(0, 0, 256, 256)
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * 256
    const y = Math.random() * 256
    const r = 12 + Math.random() * 38
    const grd = g.createRadialGradient(x, y, 0, x, y, r)
    grd.addColorStop(0, Math.random() > 0.5 ? '#ffee88' : '#ffcc44')
    grd.addColorStop(0.35, '#ff6a18')
    grd.addColorStop(1, 'rgba(80,10,0,0)')
    g.fillStyle = grd
    g.beginPath()
    g.arc(x, y, r, 0, Math.PI * 2)
    g.fill()
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(3, 3)
  return t
}

export function createLava(scene, bounds) {
  const tex = lavaTex()
  const mat = new THREE.MeshStandardMaterial({
    color: 0xff5a12,
    emissive: 0xff3a00,
    emissiveMap: tex,
    emissiveIntensity: 2.4,
    roughness: 0.55,
    metalness: 0.05,
  })
  const w = bounds.w
  const d = bounds.d
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, 1, d), mat)
  mesh.position.set(bounds.x, -2, bounds.z)
  mesh.receiveShadow = false
  mesh.castShadow = false
  scene.add(mesh)

  const glow = new THREE.Mesh(
    new THREE.BoxGeometry(w * 0.98, 0.08, d * 0.98),
    new THREE.MeshBasicMaterial({ color: 0xff9a3a, transparent: true, opacity: 0.55 })
  )
  scene.add(glow)

  const light = new THREE.PointLight(0xff5a18, 0, 28, 1.6)
  light.position.set(0, 0, 0)
  scene.add(light)

  const haze = []
  const spriteMap = (() => {
    const c = document.createElement('canvas')
    c.width = c.height = 64
    const g = c.getContext('2d')
    const grd = g.createRadialGradient(32, 32, 4, 32, 32, 30)
    grd.addColorStop(0, 'rgba(255,140,60,0.55)')
    grd.addColorStop(1, 'rgba(255,40,0,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, 64, 64)
    const t = new THREE.CanvasTexture(c)
    return t
  })()
  for (let i = 0; i < 42; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: spriteMap,
      transparent: true,
      depthWrite: false,
      opacity: 0.22,
    }))
    s.scale.set(1.4, 2.2, 1)
    s.userData = {
      x: (Math.random() - 0.5) * (w - 1.5),
      z: (Math.random() - 0.5) * (d - 1.5),
      phase: Math.random() * Math.PI * 2,
      speed: 0.6 + Math.random() * 1.4,
    }
    scene.add(s)
    haze.push(s)
  }

  return { mesh, glow, light, tex, haze, bounds }
}

export function syncLava(lava, lavaY, now, started) {
  const thick = Math.max(0.4, lavaY + 2.2)
  lava.mesh.scale.y = thick
  lava.mesh.position.y = lavaY - thick / 2
  lava.glow.position.set(0, lavaY + 0.04, lava.bounds.z)
  lava.light.position.set(0, lavaY + 0.8, 0)
  lava.light.intensity = started ? 28 + Math.sin(now * 0.006) * 5 : 4
  lava.tex.offset.y = (now * 0.00008) % 1
  lava.tex.offset.x = Math.sin(now * 0.0003) * 0.05
  for (const s of lava.haze) {
    const u = s.userData
    const rise = ((now * 0.001 * u.speed + u.phase) % 1)
    const y = lavaY + rise * 9
    s.position.set(u.x + Math.sin(now * 0.001 + u.phase) * 0.4, y, u.z)
    s.material.opacity = started ? 0.28 * (1 - rise) : 0
    const sc = 1.2 + rise * 2.2
    s.scale.set(sc, sc * 1.4, 1)
  }
}
