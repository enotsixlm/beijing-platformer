import * as THREE from 'three'
import { clamp, lerp } from '../core/rng.js'
import { TrackSpline } from './spline.js'

/**
 * Common Track implementation (see ARCHITECTURE.md, Module 1). Theme files construct one of these,
 * then add their road, scenery, hazards and lights to `group`.
 */
export class Track {
  /**
   * @param {{id:string,name:string,laps:number}} def entry from TRACKS
   * @param {Array<[number,number,number]>} controlPoints closed centreline
   * @param {object} [splineOpts] see TrackSpline
   */
  constructor(def, controlPoints, splineOpts = {}) {
    this.id = def.id
    this.name = def.name
    this.laps = def.laps
    this._spline = new TrackSpline(controlPoints, splineOpts)
    /** @type {THREE.CatmullRomCurve3} closed centreline; note t is arc-length uniform (use getPointAt) */
    this.spline = this._spline.curve
    this.length = this._spline.length
    this.group = new THREE.Group()
    this.group.name = 'track:' + def.id
    this.environment = { background: new THREE.Color(0x87c7ff), fog: null }
    this.startGrid = []
    this.itemBoxes = []
    this.boostPads = []
    this.hazards = []
    this.checkpointCount = clamp(Math.round(this.length / 100), 8, 16)
    this.minimap = this._buildMinimap()
    this._animated = []
    this._timeMaterials = []
    this._skirt = null
    this._groundY = -1
    this._time = 0
  }

  // ───────────────────────── queries ─────────────────────────

  /** @see TrackSpline.getSurfaceAt */
  getSurfaceAt(position, hintT) {
    return this._spline.getSurfaceAt(position, hintT)
  }

  /** Centreline sample at t (allocates fresh vectors). */
  sample(t) {
    return this._spline.sample(t)
  }

  /** Centre of the road at t, 0.5 m up, facing the direction of travel. */
  respawnPoint(t) {
    const s = this._spline.sample(t)
    s.position.y += 0.5
    return { position: s.position, heading: Math.atan2(s.tangent.x, s.tangent.z) }
  }

  /**
   * Ground height (for scenery placement) at world XZ: road/skirt height near the track, ground
   * plane elsewhere.
   */
  terrainHeight(x, z, info = null) {
    if (!info) info = this._spline.getSurfaceAt(new THREE.Vector3(x, 0, z))
    const L = Math.abs(info.lateral)
    if (!this._skirt) return L <= info.wallHalfWidth + 0.5 ? info.height : this._groundY
    const { width } = this._skirt
    const outerY = Math.min(this._groundY, info.height - 0.5)
    if (L <= info.wallHalfWidth + 0.5) return info.height
    if (L >= info.wallHalfWidth + width) return this._groundY
    return lerp(info.height, outerY, (L - info.wallHalfWidth - 0.5) / (width - 0.5))
  }

  // ───────────────────────── building helpers ─────────────────────────

  /** Register something that needs `update(dt, time)`. */
  animate(obj) {
    this._animated.push(obj)
    return obj
  }

  /** Register a material with a `userData.uTime` uniform (see scenery.animateMaterial). */
  timeMaterial(mat) {
    this._timeMaterials.push(mat)
    return mat
  }

  /** Add a hazard record (or several) to the public list. */
  addHazard(h) {
    if (Array.isArray(h)) this.hazards.push(...h)
    else this.hazards.push(h)
  }

  /**
   * Sun + hemisphere lights. The sun's orthographic shadow frustum covers the whole track.
   */
  setupLights({ sunColor = 0xfff2d6, sunIntensity = 2.4, sunDir = [0.5, 1, 0.35], hemiSky = 0xbfe4ff, hemiGround = 0x6a8f4a, hemiIntensity = 0.9, shadowMapSize = 2048, ambient = null } = {}) {
    const b = this._spline.bounds(40)
    const cx = (b.minX + b.maxX) / 2, cz = (b.minZ + b.maxZ) / 2
    const half = Math.max(b.maxX - b.minX, b.maxZ - b.minZ) / 2 + 10
    const sun = new THREE.DirectionalLight(sunColor, sunIntensity)
    const dir = new THREE.Vector3(...sunDir).normalize()
    sun.position.set(cx + dir.x * 400, dir.y * 400, cz + dir.z * 400)
    sun.target.position.set(cx, 0, cz)
    sun.castShadow = true
    sun.shadow.mapSize.set(shadowMapSize, shadowMapSize)
    const cam = sun.shadow.camera
    cam.left = -half; cam.right = half; cam.top = half; cam.bottom = -half
    cam.near = 50; cam.far = 800
    sun.shadow.bias = -0.0006
    sun.shadow.normalBias = 0.6
    sun.name = 'sun'
    this.group.add(sun, sun.target)
    const hemi = new THREE.HemisphereLight(hemiSky, hemiGround, hemiIntensity)
    hemi.name = 'hemi'
    this.group.add(hemi)
    if (ambient) this.group.add(new THREE.AmbientLight(ambient.color, ambient.intensity))
    this.sun = sun
    this.hemi = hemi
    return sun
  }

  _buildMinimap() {
    const points = []
    const n = 120
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity
    for (let i = 0; i < n; i++) {
      const s = this._spline.sample(i / n)
      points.push({ x: s.position.x, z: s.position.z })
      minX = Math.min(minX, s.position.x); maxX = Math.max(maxX, s.position.x)
      minZ = Math.min(minZ, s.position.z); maxZ = Math.max(maxZ, s.position.z)
    }
    return { points, bounds: { minX, maxX, minZ, maxZ } }
  }

  // ───────────────────────── runtime ─────────────────────────

  /** Animate flags, waves, hazards, neon pulses… */
  update(dt, time) {
    this._time = time
    for (let i = 0; i < this._timeMaterials.length; i++) this._timeMaterials[i].userData.uTime.value = time
    for (let i = 0; i < this._animated.length; i++) this._animated[i].update(dt, time)
  }

  /** Free every geometry, material and texture reachable from `group`. */
  dispose() {
    const seen = new Set()
    const disposeMat = (m) => {
      if (!m || seen.has(m)) return
      seen.add(m)
      // (the shared toon gradientMap from core is deliberately left alive)
      for (const k of ['map', 'emissiveMap', 'alphaMap']) {
        const t = m[k]
        if (t && !seen.has(t)) { seen.add(t); t.dispose() }
      }
      m.dispose()
    }
    this.group.traverse((o) => {
      if (o.geometry && !seen.has(o.geometry)) { seen.add(o.geometry); o.geometry.dispose() }
      if (o.material) Array.isArray(o.material) ? o.material.forEach(disposeMat) : disposeMat(o.material)
      if (o.isInstancedMesh) o.dispose()
    })
    this._animated.length = 0
    this._timeMaterials.length = 0
    this.hazards.length = 0
  }
}
