import { THREE, run, box, clamp, norm2, seedRand, orthoCamera } from '../engine.js'

const STEP = 1 / 60

export function start() {
  const camera = orthoCamera(16, 30)
  const originalSeed = (Date.now() ^ 0x5eedc0de) >>> 0
  return run('seeded_input_replay_maze', {
    camera,
    bg: 0x090d22,
    shadows: false,
    hint: 'WASD 移动 · Space 冲刺 · Enter 录制/停止 · P 回放 · N 新种子 · O 原种子',
  }, ({ scene, camera: cam, input, hud }) => {
    box(scene, { w: 30, h: 0.18, d: 30, color: 0x111b38, y: -0.18, y0: true, cast: false })

    const wallSpecs = [
      { x: 0, z: -14.2, w: 29, d: 0.6 }, { x: 0, z: 14.2, w: 29, d: 0.6 },
      { x: -14.2, z: 0, w: 0.6, d: 29 }, { x: 14.2, z: 0, w: 0.6, d: 29 },
      { x: -6.5, z: 7.5, w: 1, d: 10 }, { x: 1, z: 8, w: 9, d: 1 },
      { x: 8.2, z: 5.2, w: 1, d: 7.5 }, { x: 5.5, z: 1.5, w: 6.5, d: 1 },
      { x: -8, z: -1, w: 9, d: 1 }, { x: -3.8, z: -5, w: 1, d: 7 },
      { x: 3, z: -7.5, w: 10, d: 1 }, { x: 9.2, z: -8.5, w: 1, d: 7 },
      { x: -10.5, z: -9, w: 1, d: 6 },
    ]
    for (const wall of wallSpecs) {
      const mesh = box(scene, {
        w: wall.w,
        h: 1.25,
        d: wall.d,
        color: 0x5a4fa1,
        x: wall.x,
        y: 0,
        z: wall.z,
        y0: true,
        cast: false,
      })
      mesh.material.transparent = true
      mesh.material.opacity = 0.7
      mesh.material.emissive.setHex(0x241a62)
      mesh.material.emissiveIntensity = 0.8
    }

    const player = new THREE.Group()
    const ghost = new THREE.Mesh(
      new THREE.SphereGeometry(0.52, 18, 14),
      new THREE.MeshStandardMaterial({
        color: 0x73e8ff,
        emissive: 0x2f9bbd,
        emissiveIntensity: 1.3,
        transparent: true,
        opacity: 0.84,
      }),
    )
    ghost.scale.y = 1.15
    player.add(ghost)
    for (const x of [-0.18, 0.18]) {
      const eye = new THREE.Mesh(
        new THREE.SphereGeometry(0.065, 8, 6),
        new THREE.MeshBasicMaterial({ color: 0x06101d }),
      )
      eye.position.set(x, 0.08, -0.48)
      player.add(eye)
    }
    player.position.set(-12, 0.65, 12)
    scene.add(player)

    let layoutGroup = null
    let stars = []
    let movers = []
    let currentSeed = originalSeed
    let recordSeed = originalSeed
    let frames = []
    let target = null
    let mode = 'idle'
    let replayIndex = 0
    let accumulator = 0
    let pendingDash = false
    let dashTicks = 0
    let invulnerableTicks = 0
    let ticks = 0
    let score = 0
    let hits = 0
    let lastDir = { x: 0, z: -1 }
    let frozenSummary = ''

    function pointBlocked(x, z, radius = 0.55) {
      if (x < -13.4 || x > 13.4 || z < -13.4 || z > 13.4) return true
      return wallSpecs.some((wall) => (
        Math.abs(x - wall.x) < wall.w / 2 + radius
        && Math.abs(z - wall.z) < wall.d / 2 + radius
      ))
    }

    function seededPoint(rand, used) {
      for (let attempt = 0; attempt < 100; attempt++) {
        const x = -12.5 + rand() * 25
        const z = -12.5 + rand() * 25
        if (Math.hypot(x + 12, z - 12) < 2.5 || pointBlocked(x, z, 0.8)) continue
        if (used.some((p) => Math.hypot(x - p.x, z - p.z) < 2.2)) continue
        return { x, z }
      }
      return { x: 11, z: -11 }
    }

    function removeLayout() {
      if (!layoutGroup) return
      scene.remove(layoutGroup)
      layoutGroup.traverse((object) => {
        object.geometry?.dispose()
        if (Array.isArray(object.material)) object.material.forEach((m) => m.dispose())
        else object.material?.dispose()
      })
      layoutGroup = null
    }

    function createLayout(seed) {
      removeLayout()
      layoutGroup = new THREE.Group()
      scene.add(layoutGroup)
      stars = []
      movers = []
      const rand = seedRand(seed)
      const used = []
      for (let i = 0; i < 8; i++) {
        const p = seededPoint(rand, used)
        used.push(p)
        const mesh = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.38, 0),
          new THREE.MeshStandardMaterial({ color: 0xffe66c, emissive: 0xe29c18, emissiveIntensity: 1.5 }),
        )
        mesh.position.set(p.x, 0.6, p.z)
        layoutGroup.add(mesh)
        stars.push({ ...p, mesh, collected: false })
      }
      for (let i = 0; i < 4; i++) {
        const p = seededPoint(rand, used)
        used.push(p)
        const axisX = rand() > 0.5
        const mover = {
          baseX: p.x,
          baseZ: p.z,
          axisX,
          amplitude: 1.1 + rand() * 1.5,
          phase: rand() * Math.PI * 2,
          speed: 0.8 + rand() * 0.8,
          mesh: box(layoutGroup, { w: 1.15, h: 1.15, d: 1.15, color: 0xf0548b, x: p.x, y: 0.08, z: p.z, y0: true, cast: false }),
        }
        mover.mesh.material.emissive.setHex(0x68133c)
        mover.mesh.material.emissiveIntensity = 1.1
        movers.push(mover)
      }
    }

    function updateMoverPositions() {
      const time = ticks * STEP
      for (const mover of movers) {
        const offset = Math.sin(time * mover.speed + mover.phase) * mover.amplitude
        mover.mesh.position.x = mover.baseX + (mover.axisX ? offset : 0)
        mover.mesh.position.z = mover.baseZ + (mover.axisX ? 0 : offset)
        mover.mesh.rotation.y = time * 1.6
      }
    }

    function resetWorld(seed) {
      currentSeed = seed >>> 0
      createLayout(currentSeed)
      player.position.set(-12, 0.65, 12)
      player.rotation.y = 0
      ticks = 0
      score = 0
      hits = 0
      dashTicks = 0
      invulnerableTicks = 0
      pendingDash = false
      lastDir = { x: 0, z: -1 }
      updateMoverPositions()
    }

    function summary() {
      return `Score ${score}/8 · Pos ${player.position.x.toFixed(3)},${player.position.z.toFixed(3)} · Hits ${hits}`
    }

    function liveMask() {
      let mask = 0
      if (input.down('KeyW')) mask |= 1
      if (input.down('KeyS')) mask |= 2
      if (input.down('KeyA')) mask |= 4
      if (input.down('KeyD')) mask |= 8
      if (pendingDash) {
        mask |= 16
        pendingDash = false
      }
      return mask
    }

    function simulate(mask) {
      ticks++
      updateMoverPositions()
      if ((mask & 16) && dashTicks <= 0) dashTicks = 9

      let dx = ((mask & 8) ? 1 : 0) - ((mask & 4) ? 1 : 0)
      let dz = ((mask & 2) ? 1 : 0) - ((mask & 1) ? 1 : 0)
      if (dx || dz) {
        const n = norm2(dx, dz)
        dx = n.x
        dz = n.z
        lastDir = n
      } else if (dashTicks > 0) {
        dx = lastDir.x
        dz = lastDir.z
      }
      const speed = dashTicks > 0 ? 11.5 : 4.8
      const nextX = player.position.x + dx * speed * STEP
      const nextZ = player.position.z + dz * speed * STEP
      if (!pointBlocked(nextX, player.position.z)) player.position.x = nextX
      if (!pointBlocked(player.position.x, nextZ)) player.position.z = nextZ
      if (dx || dz) player.rotation.y = Math.atan2(dx, dz)
      if (dashTicks > 0) dashTicks--

      for (const star of stars) {
        star.mesh.rotation.y += STEP * 2.4
        if (!star.collected && Math.hypot(player.position.x - star.x, player.position.z - star.z) < 0.82) {
          star.collected = true
          star.mesh.visible = false
          score++
        }
      }

      if (invulnerableTicks > 0) invulnerableTicks--
      if (invulnerableTicks <= 0) {
        const hit = movers.some((mover) => Math.hypot(player.position.x - mover.mesh.position.x, player.position.z - mover.mesh.position.z) < 0.9)
        if (hit) {
          hits++
          player.position.set(-12, 0.65, 12)
          dashTicks = 0
          invulnerableTicks = 36
        }
      }
      ghost.material.opacity = invulnerableTicks > 0 && ticks % 8 < 4 ? 0.25 : 0.84
    }

    function startRecording() {
      recordSeed = currentSeed
      resetWorld(recordSeed)
      frames = []
      target = null
      replayIndex = 0
      accumulator = 0
      frozenSummary = ''
      mode = 'recording'
      hud.flash('Recording started from seed reset')
    }

    function stopRecording() {
      mode = 'stopped'
      target = {
        score,
        hits,
        x: player.position.x,
        z: player.position.z,
        remaining: stars.filter((star) => !star.collected).length,
      }
      frozenSummary = summary()
      hud.flash(`Recorded ${frames.length} fixed steps`)
    }

    function startReplay() {
      if (!frames.length || !target) {
        hud.flash('No recording yet')
        return
      }
      resetWorld(recordSeed)
      replayIndex = 0
      accumulator = 0
      mode = 'replay'
      frozenSummary = ''
      hud.flash('Replaying deterministic input')
    }

    function finishReplay() {
      const remaining = stars.filter((star) => !star.collected).length
      const match = score === target.score
        && hits === target.hits
        && remaining === target.remaining
        && Math.abs(player.position.x - target.x) < 1e-7
        && Math.abs(player.position.z - target.z) < 1e-7
      mode = match ? 'match' : 'mismatch'
      frozenSummary = summary()
      hud.flash(match ? 'Replay Match' : 'Replay Mismatch', 1600)
    }

    resetWorld(originalSeed)

    return {
      update(dt) {
        if (mode !== 'replay') {
          if (input.hit('KeyN')) {
            const next = (currentSeed * 1664525 + 1013904223) >>> 0
            resetWorld(next)
            frames = []
            target = null
            frozenSummary = ''
            mode = 'idle'
            hud.flash('New deterministic seed')
          }
          if (input.hit('KeyO')) {
            resetWorld(originalSeed)
            frames = []
            target = null
            frozenSummary = ''
            mode = 'idle'
            hud.flash('Original boot seed restored')
          }
          if (input.hit('Enter')) {
            if (mode === 'recording') stopRecording()
            else startRecording()
          }
          if (input.hit('KeyP') && mode !== 'recording') startReplay()
          if (input.hit('Space')) pendingDash = true
        }

        const simulating = mode === 'idle' || mode === 'recording' || mode === 'replay'
        if (simulating) accumulator += dt
        let guard = 0
        while (simulating && accumulator >= STEP && guard++ < 8) {
          accumulator -= STEP
          let mask
          if (mode === 'replay') {
            if (replayIndex >= frames.length) {
              finishReplay()
              accumulator = 0
              break
            }
            mask = frames[replayIndex++]
          } else {
            mask = liveMask()
            if (mode === 'recording') frames.push(mask)
          }
          simulate(mask)
          if (mode === 'replay' && replayIndex >= frames.length) {
            finishReplay()
            accumulator = 0
            break
          }
        }

        ghost.scale.setScalar(dashTicks > 0 ? 1.16 : 1)
        cam.position.set(0, 30, 0.001)
        cam.lookAt(0, 0, 0)

        let status = 'Ready — Enter to record'
        if (mode === 'recording') status = `Recording · ${frames.length} steps`
        if (mode === 'stopped') status = `Recorded · ${frozenSummary}`
        if (mode === 'replay') status = `Replaying ${replayIndex}/${frames.length}`
        if (mode === 'match') status = `Replay Match · ${frozenSummary}`
        if (mode === 'mismatch') status = `Replay Mismatch · ${frozenSummary}`
        hud.setStats(`Seed ${currentSeed}  ·  ${status}  ·  Stars ${score}/8`)
      },
      cleanup() {
        removeLayout()
      },
    }
  })
}
