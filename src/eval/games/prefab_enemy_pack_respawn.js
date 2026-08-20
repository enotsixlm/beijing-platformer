import {
  THREE, run, box, ground, walls, clamp, len2, norm2, moveXZ, lookXZ, orthoCamera
} from '../engine.js'

export function start() {
  const camera = orthoCamera(12, 22)
  camera.position.set(0, 20, 11)
  camera.lookAt(0, 0, 0)

  return run('prefab_enemy_pack_respawn', {
    camera,
    bg: 0x243148,
    shadows: true,
  }, (app) => {
    const { scene, input, hud } = app
    ground(scene, { s: 22, color: 0x485b4d })
    walls(scene, 22, 1.2, 0.45, 0x667080)

    const player = box(scene, {
      w: 0.9, h: 1.5, d: 0.9, color: 0xf2c94c, x: 0, y: 0.2, z: 6, y0: true,
    })
    const playerFront = box(scene, {
      w: 0.2, h: 0.2, d: 0.35, color: 0xffffff, x: 0, y: 1.25, z: 5.45,
    })

    const enemies = []
    function createEnemy(x, z, color, name) {
      const body = box(scene, {
        w: 1.35, h: 1.65, d: 1.35, color, x, y: 0.2, z, y0: true,
      })
      body.material.roughness = 0.45

      const barGroup = new THREE.Group()
      const back = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.2, 0.15),
        new THREE.MeshBasicMaterial({ color: 0x241f28 }),
      )
      const fill = new THREE.Mesh(
        new THREE.BoxGeometry(1.68, 0.12, 0.18),
        new THREE.MeshBasicMaterial({ color: 0x50e070 }),
      )
      fill.position.z = 0.09
      barGroup.add(back, fill)
      barGroup.position.set(x, 2.35, z)
      scene.add(barGroup)

      const enemy = {
        body, barGroup, fill, x, z, color, name,
        hp: 100,
        alive: true,
        respawn: 0,
        flash: 0,
      }
      enemies.push(enemy)
      return enemy
    }

    createEnemy(-5.5, -3, 0xd94d4d, '红')
    createEnemy(0, -5.5, 0x477ee2, '蓝')
    createEnemy(5.5, -2, 0x4cbf67, '绿')

    const attackGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(),
      new THREE.Vector3(),
    ])
    const attackLine = new THREE.Line(
      attackGeometry,
      new THREE.LineBasicMaterial({ color: 0xffee70, transparent: true, opacity: 0.9 }),
    )
    attackLine.visible = false
    scene.add(attackLine)

    let kills = 0
    let attackTimer = 0
    let attackCooldown = 0

    function updateBar(enemy) {
      const ratio = clamp(enemy.hp / 100, 0, 1)
      enemy.fill.scale.x = Math.max(0.001, ratio)
      enemy.fill.position.x = -0.84 + 0.84 * ratio
      enemy.fill.material.color.setHex(ratio > 0.5 ? 0x50e070 : ratio > 0.25 ? 0xffc83d : 0xff4848)
    }

    function nearestEnemy() {
      let nearest = null
      let distance = Infinity
      for (const enemy of enemies) {
        if (!enemy.alive) continue
        const d = len2(enemy.x - player.position.x, enemy.z - player.position.z)
        if (d < distance) {
          distance = d
          nearest = enemy
        }
      }
      return nearest
    }

    function attack() {
      if (attackCooldown > 0) return
      const enemy = nearestEnemy()
      if (!enemy) {
        hud.flash('没有存活的敌人')
        return
      }
      attackCooldown = 0.22
      attackTimer = 0.13
      attackLine.visible = true
      const points = attackLine.geometry.attributes.position
      points.setXYZ(0, player.position.x, 1.15, player.position.z)
      points.setXYZ(1, enemy.x, 1.2, enemy.z)
      points.needsUpdate = true

      enemy.hp = Math.max(0, enemy.hp - 25)
      enemy.flash = 0.13
      enemy.body.material.emissive.setHex(0xffffff)
      updateBar(enemy)
      if (enemy.hp === 0) {
        enemy.alive = false
        enemy.respawn = 1
        enemy.body.visible = false
        enemy.barGroup.visible = false
        kills++
        hud.flash(`${enemy.name}色敌人被击败，1 秒后重生`)
      } else {
        hud.flash(`${enemy.name}色敌人 -25 HP`)
      }
    }

    function respawn(enemy) {
      enemy.hp = 100
      enemy.alive = true
      enemy.respawn = 0
      enemy.body.position.set(enemy.x, 1.025, enemy.z)
      enemy.barGroup.position.set(enemy.x, 2.35, enemy.z)
      enemy.body.visible = true
      enemy.barGroup.visible = true
      enemy.body.material.emissive.setHex(0x000000)
      updateBar(enemy)
    }

    return {
      update(dt) {
        const axis = input.wasd()
        if (len2(axis.x, axis.z) > 0) {
          const n = norm2(axis.x, axis.z)
          moveXZ(player, n.x, n.z, dt, 5.8, 9.8)
          lookXZ(player, n.x, n.z)
        }
        player.position.x = clamp(player.position.x, -9.7, 9.7)
        player.position.z = clamp(player.position.z, -9.7, 9.7)
        playerFront.position.set(
          player.position.x + Math.sin(player.rotation.y) * 0.55,
          1.25,
          player.position.z + Math.cos(player.rotation.y) * 0.55,
        )

        if (input.mouse.justDown) attack()
        attackCooldown = Math.max(0, attackCooldown - dt)
        attackTimer -= dt
        if (attackTimer <= 0) attackLine.visible = false

        for (const enemy of enemies) {
          if (!enemy.alive) {
            enemy.respawn -= dt
            if (enemy.respawn <= 0) respawn(enemy)
          } else if (enemy.flash > 0) {
            enemy.flash -= dt
            if (enemy.flash <= 0) enemy.body.material.emissive.setHex(0x000000)
          }
        }

        const alive = enemies.filter((enemy) => enemy.alive).length
        hud.setStats(`存活：${alive} / 3　击杀：${kills}　每次攻击：25 HP`)
      },
      cleanup() {},
    }
  })
}
