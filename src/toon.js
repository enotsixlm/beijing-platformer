import * as THREE from 'three'

let grad = null
function gradientMap() {
  if (!grad) {
    // 三阶卡通：暗部 / 中间 / 亮部，接近日式赛璐璐
    grad = new THREE.DataTexture(new Uint8Array([96, 168, 255]), 3, 1, THREE.RedFormat)
    grad.minFilter = THREE.NearestFilter
    grad.magFilter = THREE.NearestFilter
    grad.needsUpdate = true
  }
  return grad
}

export function toon(color, opts = {}) {
  return new THREE.MeshToonMaterial({ color, gradientMap: gradientMap(), ...opts })
}

const outlineMat = new THREE.MeshBasicMaterial({
  color: 0x3c2418,
  side: THREE.BackSide,
})
const outlineCache = new Map()

function inflate(geo, amount) {
  let cached = outlineCache.get(geo.uuid + ':' + amount)
  if (cached) return cached
  const g = geo.clone()
  if (!g.attributes.normal) g.computeVertexNormals()
  const p = g.attributes.position
  const n = g.attributes.normal
  for (let i = 0; i < p.count; i++) {
    p.setXYZ(
      i,
      p.getX(i) + n.getX(i) * amount,
      p.getY(i) + n.getY(i) * amount,
      p.getZ(i) + n.getZ(i) * amount
    )
  }
  p.needsUpdate = true
  outlineCache.set(geo.uuid + ':' + amount, g)
  return g
}

/** 反面外扩描边：粗、干净，比棱线更像原作卡通剪影 */
export function addOutline(root, amount = 0.055) {
  const mats = {
    dark: outlineMat,
    light: new THREE.MeshBasicMaterial({ color: 0xfff6e8, side: THREE.BackSide }),
  }
  root.traverse((o) => {
    if (!o.isMesh || o.userData.noOutline || o.userData.noEdges) return
    if (o.material && o.material.transparent && o.material.opacity < 1 && o.material.map) return
    const ol = new THREE.Mesh(inflate(o.geometry, amount), o.userData.lightOutline ? mats.light : mats.dark)
    ol.userData.noOutline = true
    ol.castShadow = false
    ol.receiveShadow = false
    o.add(ol)
  })
}

export function canvasTex(w, h, draw) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d'))
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.needsUpdate = true
  return tex
}

export function makeSky(top, horizon) {
  const tex = canvasTex(4, 64, (g) => {
    const grd = g.createLinearGradient(0, 0, 0, 64)
    grd.addColorStop(0, top)
    grd.addColorStop(0.55, horizon)
    grd.addColorStop(1, horizon)
    g.fillStyle = grd
    g.fillRect(0, 0, 4, 64)
  })
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(420, 24, 16),
    new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, depthWrite: false, fog: false })
  )
  mesh.userData.noOutline = true
  return mesh
}
