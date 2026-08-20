import { THREE, run, box, ground, clamp } from '../engine.js'

export function start() {
  return run('softbody_jelly_target_toss', {
    bg: 0xb9e3f4,
    camPos: [10, 8, 13],
    lookAt: [0, 1, -5],
    hint: 'A/D 调整投掷方向 · Space 投出一次 · R 重置果冻',
  }, ({ scene, camera, input, hud }) => {
    ground(scene, { s: 36, color: 0x76a966, y: 0 })
    const zoneCenter = new THREE.Vector3(0, 0.43, -8.5)
    const zoneFill = new THREE.Mesh(
      new THREE.CircleGeometry(3, 48),
      new THREE.MeshStandardMaterial({ color: 0x4d9ee8, transparent: true, opacity: 0.38, side: THREE.DoubleSide }),
    )
    zoneFill.rotation.x = -Math.PI / 2
    zoneFill.position.copy(zoneCenter)
    scene.add(zoneFill)
    const zoneRing = new THREE.Mesh(
      new THREE.RingGeometry(2.72, 3.05, 48),
      new THREE.MeshBasicMaterial({ color: 0xe9f8ff, side: THREE.DoubleSide }),
    )
    zoneRing.rotation.x = -Math.PI / 2
    zoneRing.position.copy(zoneCenter)
    zoneRing.position.y += 0.015
    scene.add(zoneRing)

    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2
      box(scene, {
        w: 0.18,
        h: 0.25,
        d: 0.18,
        color: 0xffffff,
        x: zoneCenter.x + Math.cos(angle) * 2.9,
        y: 0.43,
        z: zoneCenter.z + Math.sin(angle) * 2.9,
        y0: true,
      })
    }

    const jelly = new THREE.Group()
    const jellyMaterial = new THREE.MeshStandardMaterial({
      color: 0xef55b7,
      emissive: 0x66154d,
      emissiveIntensity: 0.5,
      roughness: 0.32,
      transparent: true,
      opacity: 0.9,
    })
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.76, 24, 18), jellyMaterial)
    core.scale.set(1.15, 0.95, 1.15)
    core.castShadow = true
    jelly.add(core)
    for (const [x, y, z] of [[0.55, 0, 0], [-0.55, 0, 0], [0, 0, 0.55], [0, 0, -0.55]]) {
      const lobe = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 12), jellyMaterial)
      lobe.position.set(x, y - 0.06, z)
      lobe.castShadow = true
      jelly.add(lobe)
    }
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x36102d })
    for (const x of [-0.22, 0.22]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 6), eyeMaterial)
      eye.position.set(x, 0.15, -0.72)
      jelly.add(eye)
    }
    scene.add(jelly)

    const aimArrow = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.07, 4),
      new THREE.MeshBasicMaterial({ color: 0xffeb69, transparent: true, opacity: 0.8 }),
    )
    aimArrow.position.y = 0.48
    scene.add(aimArrow)

    const throwOrigin = new THREE.Vector3(0, 1.15, 4)
    let state = 'preparing'
    let prepareTime = 0
    let aim = 0
    let vx = 0
    let vy = 0
    let vz = 0
    let deform = 0
    let wobble = 0
    let bounces = 0
    let score = 0
    let scoredThisThrow = false

    function resetJelly() {
      jelly.position.copy(throwOrigin)
      jelly.rotation.set(0, 0, 0)
      jelly.scale.set(1, 1, 1)
      vx = vy = vz = 0
      deform = 0
      wobble = 0
      bounces = 0
      scoredThisThrow = false
      prepareTime = 0
      state = 'preparing'
      aimArrow.visible = true
      hud.flash('Jelly reset')
    }

    function throwJelly() {
      if (state !== 'ready') return
      vx = Math.sin(aim) * 10
      vz = -Math.cos(aim) * 10
      vy = 7.5
      state = 'flying'
      bounces = 0
      aimArrow.visible = false
      hud.flash('TOSS!')
    }

    resetJelly()
    hud.setStats('Preparing Jelly  ·  Score 0')

    return {
      update(dt) {
        if (input.hit('KeyR')) resetJelly()

        if (state === 'preparing') {
          prepareTime += dt
          deform = Math.sin(prepareTime * 16) * 0.12 * Math.max(0, 1 - prepareTime / 0.85)
          wobble += dt * 8
          if (prepareTime >= 0.85) {
            state = 'ready'
            deform = 0
            hud.flash('Ready')
          }
        }

        if (state === 'ready') {
          const turn = (input.down('KeyD') ? 1 : 0) - (input.down('KeyA') ? 1 : 0)
          aim = clamp(aim + turn * 1.15 * dt, -0.68, 0.68)
          if (input.hit('Space')) throwJelly()
        }

        if (state === 'flying' || state === 'bouncing') {
          jelly.position.x += vx * dt
          jelly.position.y += vy * dt
          jelly.position.z += vz * dt
          vy -= 12 * dt
          jelly.rotation.x += vz * dt * 0.18
          jelly.rotation.z -= vx * dt * 0.18

          const baseY = 1.15
          if (jelly.position.y <= baseY && vy < 0) {
            const impact = Math.abs(vy)
            jelly.position.y = baseY
            deform = clamp(impact / 8, 0.18, 0.9)
            wobble = 0
            bounces++
            const groundGrip = bounces === 1 ? 0.12 : 0.5
            vx *= groundGrip
            vz *= groundGrip
            vy = impact * (bounces === 1 ? 0.46 : 0.32)
            state = 'bouncing'
            if ((impact < 1.05 && Math.hypot(vx, vz) < 0.55) || bounces >= 5) {
              vy = vx = vz = 0
              jelly.position.y = baseY
              state = 'resting'
              const distance = Math.hypot(jelly.position.x - zoneCenter.x, jelly.position.z - zoneCenter.z)
              if (distance <= 3 && !scoredThisThrow) {
                score++
                scoredThisThrow = true
                hud.flash('+1 TARGET!', 1300)
              } else {
                hud.flash('Outside target · R to retry')
              }
            }
          }
        }

        if (state !== 'preparing') deform *= Math.exp(-6.5 * dt)
        wobble += dt * 11
        const ripple = Math.sin(wobble) * deform * 0.16
        jelly.scale.set(1 + deform * 0.4 - ripple, Math.max(0.5, 1 - deform * 0.52), 1 + deform * 0.4 + ripple)

        const fx = Math.sin(aim)
        const fz = -Math.cos(aim)
        aimArrow.position.set(
          throwOrigin.x + fx * 2.15,
          0.48,
          throwOrigin.z + fz * 2.15,
        )
        aimArrow.rotation.y = -aim

        const midpoint = jelly.position.clone().lerp(zoneCenter, 0.35)
        const desiredCamera = new THREE.Vector3(midpoint.x + 10, 8.2, midpoint.z + 12)
        camera.position.lerp(desiredCamera, 1 - Math.exp(-3.5 * dt))
        camera.lookAt(midpoint.x, 1, midpoint.z)

        let status = 'Preparing Jelly'
        if (state === 'ready') status = 'Ready'
        if (state === 'flying') status = 'Flying'
        if (state === 'bouncing') status = `Squash / Bounce ${bounces}`
        if (state === 'resting') status = scoredThisThrow ? 'Resting in Target +1' : 'Resting Outside'
        hud.setStats(`${status}  ·  Aim ${Math.round(aim * 180 / Math.PI)}°  ·  Score ${score}`)
      },
      cleanup() {},
    }
  })
}
