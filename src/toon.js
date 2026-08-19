import * as THREE from 'three'

let grad = null
function gradientMap() {
  if (!grad) {
    grad = new THREE.DataTexture(new Uint8Array([110, 255]), 2, 1, THREE.RedFormat)
    grad.minFilter = THREE.NearestFilter
    grad.magFilter = THREE.NearestFilter
    grad.needsUpdate = true
  }
  return grad
}

export function toon(color, opts = {}) {
  return new THREE.MeshToonMaterial({ color, gradientMap: gradientMap(), ...opts })
}
