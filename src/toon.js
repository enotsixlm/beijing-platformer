import * as THREE from 'three'

let grad = null
function gradientMap() {
  if (!grad) {
    grad = new THREE.DataTexture(new Uint8Array([140, 255]), 2, 1, THREE.RedFormat)
    grad.minFilter = THREE.NearestFilter
    grad.magFilter = THREE.NearestFilter
    grad.needsUpdate = true
  }
  return grad
}

export function toon(color, opts = {}) {
  return new THREE.MeshToonMaterial({ color, gradientMap: gradientMap(), ...opts })
}

const edgeCache = new Map()
const edgeMat = new THREE.LineBasicMaterial({
  color: 0x3a2a1c,
  transparent: true,
  opacity: 0.55,
})
const edgeMatLight = new THREE.LineBasicMaterial({
  color: 0xfffaf0,
  transparent: true,
  opacity: 0.7,
})

export function addEdges(root, { threshold = 22, light = false } = {}) {
  const mat = light ? edgeMatLight : edgeMat
  root.traverse((o) => {
    if (!o.isMesh || o.isInstancedMesh || o.userData.noEdges) return
    if (o.material && o.material.transparent && o.material.map) return
    let eg = edgeCache.get(o.geometry.uuid)
    if (!eg) {
      eg = new THREE.EdgesGeometry(o.geometry, threshold)
      edgeCache.set(o.geometry.uuid, eg)
    }
    if (!eg.attributes.position || eg.attributes.position.count === 0) return
    o.add(new THREE.LineSegments(eg, mat))
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
