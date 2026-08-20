import { THREE, run, box, ground, makeLabel, clamp, orthoCamera } from '../engine.js'

const PATH_POINTS = [
  new THREE.Vector3(3.5, 0, -11),
  new THREE.Vector3(3.5, 0, -3),
  new THREE.Vector3(-3.5, 0, 2.5),
  new THREE.Vector3(-3.5, 0, 9.5),
]

export function start() {
  const camera = orthoCamera(12.5, 24)
  return run('strategy_turret_defense', {
    camera,
    bg: 0x111827,
    hint: '固定炮台自动瞄准射程内、最接近基地的敌人',
  }, ({ scene, hud }) => {
    ground(scene, { s: 28, color: 0x263c34, y: -0.4 })

    const lengths = []
    let totalLength = 0
    for (let i = 0; i < PATH_POINTS.length - 1; i += 1) {
      const a = PATH_POINTS[i]
      const b = PATH_POINTS[i + 1]
      const length = a.distanceTo(b)
      lengths.push(length)
      totalLength += length
      const segment = box(scene, {
        w: 1.7, h: 0.08, d: length + 0.35, color: 0x7a684f,
        x: (a.x + b.x) / 2, y: 0, z: (a.z + b.z) / 2, y0: true,
        cast: false,
      })
      segment.rotation.y = Math.atan2(b.x - a.x, b.z - a.z)
    }

    function pathPosition(distance) {
      let d = clamp(distance, 0, totalLength)
      for (let i = 0; i < lengths.length; i += 1) {
        if (d <= lengths[i]) {
          return PATH_POINTS[i].clone().lerp(PATH_POINTS[i + 1], d / lengths[i])
        }
        d -= lengths[i]
      }
      return PATH_POINTS[PATH_POINTS.length - 1].clone()
    }

    const basePos = PATH_POINTS[PATH_POINTS.length - 1]
    const base = box(scene, {
      w: 3.3, h: 2.4, d: 2.8, color: 0x4c7fc1,
      x: basePos.x, y: 0.08, z: basePos.z + 1, y0: true,
    })
    const baseTop = new THREE.Mesh(
      new THREE.ConeGeometry(2.2, 1.2, 4),
      new THREE.MeshStandardMaterial({ color: 0x7ab7ef }),
    )
    baseTop.rotation.y = Math.PI / 4
    baseTop.position.y = 1.85
    base.add(baseTop)
    const baseLabel = makeLabel('BASE', { color: '#b9ddff', scale: 2.2 })
    baseLabel.position.set(basePos.x, 3.45, basePos.z + 1)
    scene.add(baseLabel)

    const turret = new THREE.Group()
    turret.position.set(1.2, 0.08, 3.2)
    scene.add(turret)
    const turretBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.85, 1.05, 0.75, 12),
      new THREE.MeshStandardMaterial({ color: 0x586a80, metalness: 0.55 }),
    )
    turretBase.position.y = 0.4
    turretBase.castShadow = true
    turret.add(turretBase)
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.62, 12, 8),
      new THREE.MeshStandardMaterial({ color: 0xf0b84a, emissive: 0x3d2700, metalness: 0.4 }),
    )
    head.position.y = 1.1
    turret.add(head)
    const barrel = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.22, 1.8),
      new THREE.MeshStandardMaterial({ color: 0xe7edf6, metalness: 0.8 }),
    )
    barrel.position.set(0, 1.15, 0.8)
    barrel.castShadow = true
    turret.add(barrel)
    const range = new THREE.Mesh(
      new THREE.RingGeometry(5.9, 6, 64),
      new THREE.MeshBasicMaterial({ color: 0x6fa6dd, transparent: true, opacity: 0.16, side: THREE.DoubleSide }),
    )
    range.rotation.x = -Math.PI / 2
    range.position.set(turret.position.x, 0.1, turret.position.z)
    scene.add(range)

    const enemies = []
    function makeEnemy(index) {
      const mesh = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.42, 0.6, 5, 8),
        new THREE.MeshStandardMaterial({ color: [0xff665e, 0xff8d52, 0xe95a83, 0xf1bc4f][index], emissive: 0x3b0c0c }),
      )
      mesh.castShadow = true
      scene.add(mesh)
      const hpBack = new THREE.Mesh(
        new THREE.PlaneGeometry(1.15, 0.13),
        new THREE.MeshBasicMaterial({ color: 0x27191d, side: THREE.DoubleSide }),
      )
      const hpFill = new THREE.Mesh(
        new THREE.PlaneGeometry(1.1, 0.09),
        new THREE.MeshBasicMaterial({ color: 0x68e07b, side: THREE.DoubleSide }),
      )
      scene.add(hpBack, hpFill)
      const enemy = {
        mesh, hpBack, hpFill, hp: 50, maxHp: 50,
        progress: -index * 2.8, speed: 2.15 + index * 0.08,
        dead: false, active: false,
      }
      enemies.push(enemy)
      return enemy
    }
    for (let i = 0; i < 4; i += 1) makeEnemy(i)

    let baseHp = 100
    let shotCooldown = 0
    let target = null
    let ended = false
    const tracers = []

    function setEnemyVisible(enemy, visible) {
      enemy.mesh.visible = visible
      enemy.hpBack.visible = visible
      enemy.hpFill.visible = visible
    }
    enemies.forEach((enemy) => setEnemyVisible(enemy, false))

    function removeEnemy(enemy) {
      enemy.dead = true
      enemy.active = false
      scene.remove(enemy.mesh, enemy.hpBack, enemy.hpFill)
      if (target === enemy) target = null
    }

    function shoot(enemy) {
      shotCooldown = 0.5
      enemy.hp = Math.max(0, enemy.hp - 25)
      enemy.mesh.scale.set(1.35, 0.72, 1.35)
      const start = new THREE.Vector3(turret.position.x, 1.22, turret.position.z)
      const end = enemy.mesh.position.clone()
      end.y = 0.85
      const geometry = new THREE.BufferGeometry().setFromPoints([start, end])
      const line = new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({ color: 0xfff09a, transparent: true, opacity: 1 }),
      )
      scene.add(line)
      tracers.push({ line, life: 0.1 })
      if (enemy.hp <= 0) {
        removeEnemy(enemy)
        hud.flash('目标摧毁 · 切换目标')
      }
    }

    return {
      update(dt) {
        if (!ended) {
          for (const enemy of enemies) {
            if (enemy.dead) continue
            enemy.progress += enemy.speed * dt
            if (enemy.progress >= 0 && !enemy.active) {
              enemy.active = true
              setEnemyVisible(enemy, true)
            }
            if (!enemy.active) continue
            const position = pathPosition(enemy.progress)
            enemy.mesh.position.set(position.x, 0.76, position.z)
            enemy.mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 1 - Math.exp(-dt * 15))
            const nextPosition = pathPosition(enemy.progress + 0.15)
            enemy.mesh.rotation.y = Math.atan2(nextPosition.x - position.x, nextPosition.z - position.z)

            enemy.hpBack.position.set(position.x, 1.62, position.z)
            enemy.hpFill.position.set(position.x - (1 - enemy.hp / enemy.maxHp) * 0.55, 1.625, position.z - 0.003)
            enemy.hpFill.scale.x = enemy.hp / enemy.maxHp
            enemy.hpBack.quaternion.copy(camera.quaternion)
            enemy.hpFill.quaternion.copy(camera.quaternion)

            if (enemy.progress >= totalLength - 0.2) {
              baseHp = Math.max(0, baseHp - 20)
              removeEnemy(enemy)
              hud.flash('基地受到 20 点伤害')
            }
          }

          const candidates = enemies
            .filter((enemy) => enemy.active && !enemy.dead
              && enemy.mesh.position.distanceTo(turret.position) <= 6)
            .sort((a, b) => b.progress - a.progress)
          target = candidates[0] || null
          shotCooldown = Math.max(0, shotCooldown - dt)

          if (target) {
            const dx = target.mesh.position.x - turret.position.x
            const dz = target.mesh.position.z - turret.position.z
            const wanted = Math.atan2(dx, dz)
            let delta = ((wanted - turret.rotation.y + Math.PI) % (Math.PI * 2)) - Math.PI
            if (delta < -Math.PI) delta += Math.PI * 2
            const turn = clamp(delta, -dt * 5.5, dt * 5.5)
            turret.rotation.y += turn
            if (Math.abs(delta) < 0.055 && shotCooldown <= 0) shoot(target)
          } else {
            turret.rotation.y += dt * 0.28
          }

          if (baseHp <= 0) {
            ended = true
            hud.showOverlay('基地失守', 'Base HP 归零')
          } else if (enemies.every((enemy) => enemy.dead)) {
            ended = true
            hud.showOverlay('防守成功', `基地剩余 ${baseHp} HP`)
          }
        }

        for (let i = tracers.length - 1; i >= 0; i -= 1) {
          const tracer = tracers[i]
          tracer.life -= dt
          tracer.line.material.opacity = Math.max(0, tracer.life * 10)
          if (tracer.life <= 0) {
            scene.remove(tracer.line)
            tracer.line.geometry.dispose()
            tracer.line.material.dispose()
            tracers.splice(i, 1)
          }
        }

        const remaining = enemies.filter((enemy) => !enemy.dead).length
        hud.setStats(`BASE HP: ${baseHp} / 100\n剩余敌人: ${remaining}\n目标: ${target ? '锁定' : '搜索中'}`)
      },
      cleanup() {},
    }
  })
}
