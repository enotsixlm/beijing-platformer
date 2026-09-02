// Module 3 — procedural meshes for items (shells, bananas, bob-ombs, item boxes, fake boxes).
// All geometries/materials are created once per ItemAssets instance and shared; meshes are pooled
// by kind so the hot path never allocates.
import * as THREE from 'three'
import { makeToonMaterial, canvasTexture } from '../core/toon.js'

export const ITEM_BOX_SIZE = 1.2

/** Adds a per-vertex rainbow colour attribute to a geometry (hue driven by position). */
function addRainbowColors(geometry, saturation = 0.9, lightness = 0.62) {
  const pos = geometry.attributes.position
  const colors = new Float32Array(pos.count * 3)
  const c = new THREE.Color()
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    const hue = ((Math.atan2(z, x) / (Math.PI * 2)) + 0.5 + y * 0.35 + 1) % 1
    c.setHSL(hue, saturation, lightness)
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return geometry
}

/** '?' glyph texture (guarded for headless environments). */
function makeQuestionTexture(color = '#ffffff', outline = '#3b2a6e') {
  if (typeof document === 'undefined') return null
  try {
    return canvasTexture(128, 128, (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h)
      ctx.font = 'bold 104px "Luckiest Guy", "Arial Black", Impact, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.lineJoin = 'round'
      ctx.lineWidth = 14
      ctx.strokeStyle = outline
      ctx.strokeText('?', w / 2, h / 2 + 6)
      ctx.fillStyle = color
      ctx.fillText('?', w / 2, h / 2 + 6)
    })
  } catch {
    return null
  }
}

/**
 * Shared geometries and materials for every item visual. Create one per ItemSystem and call
 * `dispose()` when the race is torn down.
 */
export class ItemAssets {
  constructor() {
    this._geos = []
    this._mats = []
    this._tex = []
    this._pools = new Map()

    const geo = (g) => { this._geos.push(g); return g }
    const mat = (m) => { this._mats.push(m); return m }

    // ── shells ───────────────────────────────────────────────────────────────
    this.shellDomeGeo = geo(new THREE.SphereGeometry(0.55, 18, 10, 0, Math.PI * 2, 0, Math.PI * 0.5))
    this.shellRimGeo = geo(new THREE.TorusGeometry(0.53, 0.11, 8, 20))
    this.shellBaseGeo = geo(new THREE.CylinderGeometry(0.5, 0.42, 0.18, 18))
    this.shellStripeGeo = geo(new THREE.TorusGeometry(0.42, 0.05, 6, 20))
    this.greenDomeMat = mat(makeToonMaterial(0x3ddc84))
    this.greenRimMat = mat(makeToonMaterial(0xb8ffd6))
    this.redDomeMat = mat(makeToonMaterial(0xff3b3b))
    this.redRimMat = mat(makeToonMaterial(0xffc2b8))
    this.shellBaseMat = mat(makeToonMaterial(0xfff1d6))
    this.shellStripeMat = mat(makeToonMaterial(0xffffff))

    // ── banana ───────────────────────────────────────────────────────────────
    this.bananaBodyGeo = geo(new THREE.TorusGeometry(0.42, 0.15, 8, 14, Math.PI * 0.95))
    this.bananaTipGeo = geo(new THREE.ConeGeometry(0.12, 0.22, 8))
    this.bananaMat = mat(makeToonMaterial(0xffd93d))
    this.bananaTipMat = mat(makeToonMaterial(0x6b3f1d))

    // ── bob-omb ──────────────────────────────────────────────────────────────
    this.bombBodyGeo = geo(new THREE.SphereGeometry(0.46, 18, 14))
    this.bombFootGeo = geo(new THREE.SphereGeometry(0.16, 10, 8))
    this.bombKeyStemGeo = geo(new THREE.CylinderGeometry(0.05, 0.05, 0.28, 8))
    this.bombKeyRingGeo = geo(new THREE.TorusGeometry(0.16, 0.045, 6, 12))
    this.bombFuseGeo = geo(new THREE.CylinderGeometry(0.035, 0.05, 0.28, 6))
    this.bombSparkGeo = geo(new THREE.IcosahedronGeometry(0.11, 0))
    this.bombEyeGeo = geo(new THREE.SphereGeometry(0.07, 8, 6))
    this.bombBodyMat = mat(makeToonMaterial(0x2a3142))
    this.bombFootMat = mat(makeToonMaterial(0xffa63d))
    this.bombKeyMat = mat(makeToonMaterial(0xfff0a0))
    this.bombFuseMat = mat(makeToonMaterial(0x9b9b9b))
    this.bombSparkMat = mat(new THREE.MeshBasicMaterial({ color: 0xffe066 }))
    this.bombEyeMat = mat(new THREE.MeshBasicMaterial({ color: 0xffffff }))

    // ── item box / fake box ──────────────────────────────────────────────────
    this.boxGeo = geo(addRainbowColors(new THREE.BoxGeometry(ITEM_BOX_SIZE, ITEM_BOX_SIZE, ITEM_BOX_SIZE)))
    this.boxMat = mat(new THREE.MeshStandardMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.62,
      roughness: 0.15,
      metalness: 0.25,
      emissive: 0xffffff,
      emissiveIntensity: 0.18,
      depthWrite: false,
    }))
    this.fakeBoxMat = mat(new THREE.MeshStandardMaterial({
      color: 0xff3b6b,
      transparent: true,
      opacity: 0.78,
      roughness: 0.2,
      metalness: 0.2,
      emissive: 0xc84bff,
      emissiveIntensity: 0.35,
      depthWrite: false,
    }))
    this.questionTex = makeQuestionTexture()
    if (this.questionTex) this._tex.push(this.questionTex)
    this.fakeQuestionTex = makeQuestionTexture('#ffd0dc', '#4a0a2a')
    if (this.fakeQuestionTex) this._tex.push(this.fakeQuestionTex)
    this.questionGeo = geo(new THREE.PlaneGeometry(0.72, 0.72))
    this.coreGeo = geo(new THREE.IcosahedronGeometry(0.34, 0))
    this.questionMat = mat(this.questionTex
      ? new THREE.MeshBasicMaterial({ map: this.questionTex, transparent: true, side: THREE.DoubleSide, depthWrite: false })
      : new THREE.MeshBasicMaterial({ color: 0xffffff }))
    this.fakeQuestionMat = mat(this.fakeQuestionTex
      ? new THREE.MeshBasicMaterial({ map: this.fakeQuestionTex, transparent: true, side: THREE.DoubleSide, depthWrite: false })
      : new THREE.MeshBasicMaterial({ color: 0xffd0dc }))
    this.coreMat = mat(new THREE.MeshBasicMaterial({ color: 0xfff7c2 }))
  }

  // ── builders ───────────────────────────────────────────────────────────────

  _buildShell(red) {
    const g = new THREE.Group()
    const dome = new THREE.Mesh(this.shellDomeGeo, red ? this.redDomeMat : this.greenDomeMat)
    dome.position.y = 0.09
    dome.castShadow = true
    const rim = new THREE.Mesh(this.shellRimGeo, red ? this.redRimMat : this.greenRimMat)
    rim.rotation.x = Math.PI / 2
    rim.position.y = 0.1
    const base = new THREE.Mesh(this.shellBaseGeo, this.shellBaseMat)
    base.position.y = 0.02
    const stripe = new THREE.Mesh(this.shellStripeGeo, this.shellStripeMat)
    stripe.rotation.x = Math.PI / 2
    stripe.position.y = 0.42
    stripe.scale.setScalar(0.8)
    g.add(base, rim, dome, stripe)
    g.userData.spin = dome
    return g
  }

  _buildBanana() {
    const g = new THREE.Group()
    const body = new THREE.Mesh(this.bananaBodyGeo, this.bananaMat)
    body.rotation.z = Math.PI * 0.55
    body.position.y = 0.3
    body.castShadow = true
    const tipA = new THREE.Mesh(this.bananaTipGeo, this.bananaTipMat)
    const tipB = new THREE.Mesh(this.bananaTipGeo, this.bananaTipMat)
    tipA.position.set(-0.43, 0.32, 0)
    tipA.rotation.z = Math.PI * 0.5
    tipB.position.set(0.38, 0.44, 0)
    tipB.rotation.z = Math.PI * 0.2
    g.add(body, tipA, tipB)
    g.userData.spin = null
    return g
  }

  _buildBomb() {
    const g = new THREE.Group()
    const body = new THREE.Mesh(this.bombBodyGeo, this.bombBodyMat)
    body.position.y = 0.48
    body.castShadow = true
    const footL = new THREE.Mesh(this.bombFootGeo, this.bombFootMat)
    const footR = new THREE.Mesh(this.bombFootGeo, this.bombFootMat)
    footL.position.set(-0.2, 0.12, 0.05)
    footR.position.set(0.2, 0.12, 0.05)
    footL.scale.set(1, 0.7, 1.3)
    footR.scale.set(1, 0.7, 1.3)
    const stem = new THREE.Mesh(this.bombKeyStemGeo, this.bombKeyMat)
    stem.rotation.x = Math.PI / 2
    stem.position.set(0, 0.5, -0.55)
    const ring = new THREE.Mesh(this.bombKeyRingGeo, this.bombKeyMat)
    ring.position.set(0, 0.5, -0.72)
    ring.rotation.y = Math.PI / 2
    const fuse = new THREE.Mesh(this.bombFuseGeo, this.bombFuseMat)
    fuse.position.set(0.04, 1.02, 0)
    fuse.rotation.z = -0.25
    const spark = new THREE.Mesh(this.bombSparkGeo, this.bombSparkMat)
    spark.position.set(0.08, 1.18, 0)
    const eyeL = new THREE.Mesh(this.bombEyeGeo, this.bombEyeMat)
    const eyeR = new THREE.Mesh(this.bombEyeGeo, this.bombEyeMat)
    eyeL.position.set(-0.15, 0.56, 0.42)
    eyeR.position.set(0.15, 0.56, 0.42)
    g.add(body, footL, footR, stem, ring, fuse, spark, eyeL, eyeR)
    g.userData.spark = spark
    g.userData.key = ring
    g.userData.spin = null
    return g
  }

  _buildBox(fake) {
    const g = new THREE.Group()
    const cube = new THREE.Mesh(this.boxGeo, fake ? this.fakeBoxMat : this.boxMat)
    cube.renderOrder = 2
    let inner
    if (this.questionTex) {
      inner = new THREE.Mesh(this.questionGeo, fake ? this.fakeQuestionMat : this.questionMat)
      if (fake) inner.rotation.z = Math.PI // upside-down '?' gives the fake away to sharp eyes
    } else {
      inner = new THREE.Mesh(this.coreGeo, this.coreMat)
    }
    inner.renderOrder = 1
    g.add(inner, cube)
    g.userData.cube = cube
    g.userData.inner = inner
    g.userData.spin = null
    return g
  }

  _build(kind) {
    switch (kind) {
      case 'green_shell': return this._buildShell(false)
      case 'red_shell': return this._buildShell(true)
      case 'banana': return this._buildBanana()
      case 'bob_omb': return this._buildBomb()
      case 'fake_box': return this._buildBox(true)
      case 'item_box': return this._buildBox(false)
      default: return this._buildBanana()
    }
  }

  /** Get a pooled mesh (Group) for `kind`. Caller adds it to the scene. */
  acquire(kind) {
    let pool = this._pools.get(kind)
    if (!pool) {
      pool = []
      this._pools.set(kind, pool)
    }
    const m = pool.pop() ?? this._build(kind)
    m.visible = true
    m.scale.setScalar(1)
    m.rotation.set(0, 0, 0)
    m.userData.kind = kind
    return m
  }

  /** Return a mesh to its pool (removes it from its parent). */
  release(mesh) {
    if (!mesh) return
    mesh.removeFromParent()
    mesh.visible = false
    const pool = this._pools.get(mesh.userData.kind)
    if (pool) pool.push(mesh)
  }

  /** Instanced cube + '?' meshes for the static item boxes. */
  createBoxInstances(count) {
    const cubes = new THREE.InstancedMesh(this.boxGeo, this.boxMat, Math.max(1, count))
    cubes.renderOrder = 2
    cubes.frustumCulled = false
    const inner = new THREE.InstancedMesh(
      this.questionTex ? this.questionGeo : this.coreGeo,
      this.questionTex ? this.questionMat : this.coreMat,
      Math.max(1, count),
    )
    inner.renderOrder = 1
    inner.frustumCulled = false
    return { cubes, inner }
  }

  dispose() {
    for (const pool of this._pools.values()) for (const m of pool) m.removeFromParent()
    this._pools.clear()
    for (const g of this._geos) g.dispose()
    for (const m of this._mats) m.dispose()
    for (const t of this._tex) t.dispose()
    this._geos.length = 0
    this._mats.length = 0
    this._tex.length = 0
  }
}
