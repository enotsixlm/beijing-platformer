import * as THREE from 'three'

let grad = null
function gradientMap() {
  if (!grad) {
    grad = new THREE.DataTexture(new Uint8Array([90, 180, 255]), 3, 1, THREE.RedFormat)
    grad.minFilter = THREE.NearestFilter
    grad.magFilter = THREE.NearestFilter
    grad.needsUpdate = true
  }
  return grad
}

export function toon(color, opts = {}) {
  return new THREE.MeshToonMaterial({ color, gradientMap: gradientMap(), ...opts })
}

export function canvasTex(size, draw, { wrap = true, repeat = 1 } = {}) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  draw(c.getContext('2d'), size)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  if (wrap) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(repeat, repeat)
  }
  tex.magFilter = THREE.LinearFilter
  tex.minFilter = THREE.LinearMipmapLinearFilter
  return tex
}
