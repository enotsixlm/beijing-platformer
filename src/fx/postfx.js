/**
 * Post-processing: RenderPass → UnrealBloomPass (subtle) → speed/vignette/CA ShaderPass → OutputPass.
 * Falls back to plain renderer.render() when WebGL2/float targets are unavailable or setup throws.
 */
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { SPEED_VERT, SPEED_FRAG } from './shaders.js'

const SPEED_SMOOTH = 0.15 // seconds

/**
 * @param {THREE.WebGLRenderer} renderer
 * @param {THREE.Scene} scene
 * @param {THREE.Camera} camera
 * @returns {{ render(dt:number), setSize(w:number,h:number), setSpeed(v:number), setEnabled(v:boolean), enabled:boolean, composer: EffectComposer|null }}
 */
export function createPostFX(renderer, scene, camera) {
  let composer = null
  let bloom = null
  let speedPass = null
  let enabled = true
  let speed = 0
  let targetSpeed = 0
  let time = 0

  const size = new THREE.Vector2()
  renderer.getSize(size)
  const pr = renderer.getPixelRatio ? renderer.getPixelRatio() : 1

  const supported = (() => {
    try {
      const caps = renderer.capabilities
      if (!caps || !caps.isWebGL2) return false
      const gl = renderer.getContext()
      if (!gl) return false
      return true
    } catch (_) {
      return false
    }
  })()

  if (supported) {
    try {
      const halfFloat = renderer.extensions.has('EXT_color_buffer_float') || renderer.extensions.has('EXT_color_buffer_half_float')
      // MSAA on the scene target: the canvas' own antialiasing doesn't apply when rendering via the composer.
      const samples = pr > 1.5 ? 2 : 4
      const target = new THREE.WebGLRenderTarget(Math.max(1, size.x * pr), Math.max(1, size.y * pr), {
        type: halfFloat ? THREE.HalfFloatType : THREE.UnsignedByteType,
        colorSpace: THREE.LinearSRGBColorSpace,
        samples,
      })
      composer = new EffectComposer(renderer, target)
      composer.setPixelRatio(pr)
      composer.setSize(size.x, size.y)

      composer.addPass(new RenderPass(scene, camera))

      bloom = new UnrealBloomPass(new THREE.Vector2(size.x, size.y), 0.35, 0.4, 0.85)
      composer.addPass(bloom)

      speedPass = new ShaderPass(
        new THREE.ShaderMaterial({
          uniforms: {
            tDiffuse: { value: null },
            uSpeed: { value: 0 },
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(size.x * pr, size.y * pr) },
            uVignette: { value: 0.55 },
            uSaturation: { value: 1.12 },
          },
          vertexShader: SPEED_VERT,
          fragmentShader: SPEED_FRAG,
          depthTest: false,
          depthWrite: false,
        }),
        'tDiffuse'
      )
      composer.addPass(speedPass)
      composer.addPass(new OutputPass())
    } catch (err) {
      console.warn('[fx] post-processing unavailable, falling back to plain render', err)
      composer = null
      bloom = null
      speedPass = null
    }
  } else {
    console.warn('[fx] WebGL2 not available; post-processing disabled')
  }

  const plain = () => renderer.render(scene, camera)

  return {
    composer,
    get enabled() {
      return enabled && !!composer
    },

    render(dt = 1 / 60) {
      if (!(dt > 0)) dt = 1 / 60
      time += dt
      speed += (targetSpeed - speed) * (1 - Math.exp(-dt / SPEED_SMOOTH))
      if (!enabled || !composer) return plain()
      try {
        speedPass.uniforms.uSpeed.value = speed
        speedPass.uniforms.uTime.value = time
        composer.render(dt)
      } catch (err) {
        console.warn('[fx] composer failed; disabling post-processing', err)
        enabled = false
        plain()
      }
    },

    setSize(w, h) {
      if (!composer) return
      const p = renderer.getPixelRatio ? renderer.getPixelRatio() : 1
      composer.setPixelRatio(p)
      composer.setSize(w, h)
      if (bloom) bloom.setSize(w, h)
      if (speedPass) speedPass.uniforms.uResolution.value.set(w * p, h * p)
    },

    /** 0..1 — smoothed internally over ~0.15 s. */
    setSpeed(v) {
      targetSpeed = Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0))
    },

    setEnabled(v) {
      enabled = !!v
    },

    dispose() {
      composer?.dispose?.()
      bloom?.dispose?.()
      speedPass?.material?.dispose?.()
    },
  }
}
