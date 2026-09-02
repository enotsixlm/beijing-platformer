import * as THREE from 'three'

let _gradientMap = null

/** 4-step gradient map shared by all toon materials. */
export function gradientMap() {
  if (_gradientMap) return _gradientMap
  const data = new Uint8Array([90, 150, 210, 255])
  const tex = new THREE.DataTexture(data, 4, 1, THREE.RedFormat)
  tex.minFilter = THREE.NearestFilter
  tex.magFilter = THREE.NearestFilter
  tex.colorSpace = THREE.NoColorSpace
  tex.needsUpdate = true
  _gradientMap = tex
  return tex
}

/**
 * Cel-shaded material with sensible defaults.
 * @param {THREE.ColorRepresentation} color
 * @param {object} [opts] extra MeshToonMaterial params
 */
export function makeToonMaterial(color, opts = {}) {
  return new THREE.MeshToonMaterial({ color, gradientMap: gradientMap(), ...opts })
}

/** Flat-shaded standard material (nice for chunky low-poly props). */
export function makeFlatMaterial(color, opts = {}) {
  return new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85, metalness: 0.05, ...opts })
}

/**
 * Create a CanvasTexture by drawing into a 2D context.
 * @param {number} w
 * @param {number} h
 * @param {(ctx: CanvasRenderingContext2D, w: number, h: number) => void} draw
 */
export function canvasTexture(w, h, draw, opts = {}) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  draw(ctx, w, h)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  if (opts.repeat) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(opts.repeat[0], opts.repeat[1])
  }
  return tex
}

/** Add a dark outline shell to a mesh (back-face expanded copy). */
export function addOutline(mesh, thickness = 0.03, color = 0x1b1b2a) {
  const mat = new THREE.MeshBasicMaterial({ color, side: THREE.BackSide })
  const outline = new THREE.Mesh(mesh.geometry, mat)
  outline.scale.multiplyScalar(1 + thickness)
  mesh.add(outline)
  return outline
}
