import {
  THREE, run, box, clamp, lerp, makeLabel, orthoCamera
} from '../engine.js'

export function start() {
  const camera = orthoCamera(7.5, 12)
  camera.position.set(0, 6.2, 22)
  camera.lookAt(0, 5.5, 0)

  return run('platformer_2d_boss_parry', {
    camera,
    bg: 0x221c2c,
    shadows: true,
  }, (app) => {
    const { scene, input, hud } = app

    box(scene, { w: 21, h: 1, d: 4, color: 0x4b3d50, x: 0, y: -0.5, z: 0 })
    box(scene, { w: 0.7, h: 12, d: 4, color: 0x3b3142, x: -10.35, y: 5.5, z: 0 })
    box(scene, { w: 0.7, h: 12, d: 4, color: 0x3b3142, x: 10.35, y: 5.5, z: 0 })
    box(scene, { w: 21, h: 0.7, d: 4, color: 0x3b3142, x: 0, y: 11.5, z: 0 })
    for (let x = -8; x <= 8; x += 4) {
      box(scene, { w: 0.18, h: 6, d: 0.25, color: 0x5b4a63, x, y: 6.5, z: -2.05 })
    }

    const player = box(scene, {
      w: 1, h: 1.8, d: 1, color: 0x4592e6, x: -6, y: 0.9, z: 0,
    })
    const sword = box(scene, {
      w: 1.35, h: 0.18, d: 0.22, color: 0xdce8ef, x: -5.1, y: 1.1, z: 0.6,
    })
    const boss = box(scene, {
      w: 2.4, h: 4.4, d: 1.8, color: 0xb33b47, x: 6, y: 2.2, z: 0,
    })
    const bossOriginalColor = 0xb33b47

    const meleeZone = box(scene, {
      w: 3.8, h: 2.5, d: 0.18, color: 0xff2525, x: 3.2, y: 1.25, z: 1.2,
    })
    meleeZone.material.transparent = true
    meleeZone.material.opacity = 0.32
    meleeZone.visible = false

    const groundPath = box(scene, {
      w: 14, h: 0.16, d: 0.35, color: 0xff2020, x: -1, y: 0.12, z: 1.15,
    })
    groundPath.material.transparent = true
    groundPath.material.opacity = 0.38
    groundPath.visible = false

    const projectile = box(scene, {
      w: 1.1, h: 0.65, d: 1.2, color: 0xff8a24, x: 0, y: 0.35, z: 0,
    })
    projectile.visible = false

    const hpBack = box(scene, {
      w: 3.6, h: 0.28, d: 0.14, color: 0x241c26, x: boss.position.x, y: 5.3, z: 1.15,
    })
    const hpFill = box(scene, {
      w: 3.45, h: 0.18, d: 0.16, color: 0xe44747, x: boss.position.x, y: 5.3, z: 1.24,
    })
    const postureBack = box(scene, {
      w: 3.6, h: 0.24, d: 0.14, color: 0x241c26, x: boss.position.x, y: 4.88, z: 1.15,
    })
    const postureFill = box(scene, {
      w: 3.45, h: 0.14, d: 0.16, color: 0xffd338, x: boss.position.x, y: 4.88, z: 1.24,
    })
    postureFill.scale.x = 0.001

    const stunLabel = makeLabel('眩晕', { color: '#ffe14a', size: 76, scale: 2.8 })
    stunLabel.visible = false
    scene.add(stunLabel)
    const stars = []
    for (let i = 0; i < 3; i++) {
      const star = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.25),
        new THREE.MeshBasicMaterial({ color: 0xffe34f }),
      )
      star.visible = false
      scene.add(star)
      stars.push(star)
    }

    let playerHP = 5
    let bossHP = 120
    let posture = 0
    let vx = 0
    let vy = 0
    let grounded = true
    let facing = 1
    let bossFacing = -1
    let parryTimer = 0
    let attackTimer = 0
    let attackState = 'cooldown'
    let attackKind = 'melee'
    let attackCooldown = 1.1
    let projectileVx = 0
    let meleeCooldown = 0
    let stunTimer = 0
    let gameOver = false

    function setBar(mesh, ratio, width, centerX) {
      const r = clamp(ratio, 0.001, 1)
      mesh.scale.x = r
      mesh.position.x = centerX - width / 2 + width * r / 2
    }

    function endGame(won) {
      gameOver = true
      meleeZone.visible = false
      groundPath.visible = false
      projectile.visible = false
      hud.showOverlay(won ? '胜利' : '失败', won ? 'Boss 已被击败' : '你的生命值归零')
    }

    function enterStun() {
      posture = 1
      stunTimer = 4.2
      attackState = 'stunned'
      meleeZone.visible = false
      groundPath.visible = false
      projectile.visible = false
      boss.material.color.setHex(0x858585)
      stunLabel.visible = true
      stars.forEach((star) => { star.visible = true })
      hud.flash('完美格挡！Boss 眩晕', 1300)
    }

    function perfectParry() {
      posture = clamp(posture + 1 / 3, 0, 1)
      parryTimer = 0
      player.material.emissive.setHex(0xffee75)
      if (posture >= 0.999) enterStun()
      else hud.flash(`完美格挡！架势 ${Math.round(posture * 3)}/3`)
    }

    function hitPlayer() {
      if (gameOver) return
      if (parryTimer > 0) {
        perfectParry()
        return
      }
      playerHP--
      player.material.emissive.setHex(0xff2020)
      vx = -bossFacing * 6
      vy = 4
      grounded = false
      hud.flash('格挡时机错误，受到伤害！')
      if (playerHP <= 0) endGame(false)
    }

    function beginTelegraph() {
      const fast = bossHP <= 60
      bossFacing = player.position.x < boss.position.x ? -1 : 1
      if (attackKind === 'melee') {
        attackState = 'telegraphMelee'
        attackTimer = fast ? 0.58 : 0.86
        meleeZone.visible = true
        meleeZone.position.x = boss.position.x + bossFacing * 2.15
        groundPath.visible = false
      } else {
        attackState = 'telegraphGround'
        attackTimer = fast ? 0.72 : 1.02
        const wall = bossFacing < 0 ? -9.7 : 9.7
        groundPath.position.x = (boss.position.x + wall) / 2
        groundPath.scale.x = Math.abs(wall - boss.position.x) / 14
        groundPath.visible = true
        meleeZone.visible = false
      }
    }

    function resolveTelegraph() {
      if (attackState === 'telegraphMelee') {
        meleeZone.visible = false
        const closeX = Math.abs(player.position.x - (boss.position.x + bossFacing * 1.45)) < 2.2
        const lowEnough = player.position.y - 0.9 < 2.6
        if (closeX && lowEnough) hitPlayer()
        attackState = 'recovery'
        attackTimer = bossHP <= 60 ? 0.42 : 0.68
      } else {
        groundPath.visible = false
        projectile.visible = true
        projectile.position.set(boss.position.x + bossFacing * 1.5, 0.36, 0)
        projectileVx = bossFacing * (bossHP <= 60 ? 10.5 : 8)
        attackState = 'projectile'
      }
    }

    function updateBoss(dt, now) {
      if (attackState === 'stunned') {
        stunTimer -= dt
        stunLabel.position.set(boss.position.x, 6.25, 0.8)
        stars.forEach((star, i) => {
          const angle = now * 0.006 + i * Math.PI * 2 / 3
          star.position.set(
            boss.position.x + Math.cos(angle) * 1.35,
            5.75 + Math.sin(angle) * 0.22,
            0.9,
          )
          star.rotation.z += dt * 6
        })
        if (stunTimer <= 0) {
          posture = 0
          boss.material.color.setHex(bossOriginalColor)
          stunLabel.visible = false
          stars.forEach((star) => { star.visible = false })
          attackState = 'cooldown'
          attackCooldown = 1
        }
        return
      }

      bossFacing = player.position.x < boss.position.x ? -1 : 1
      if (attackState === 'cooldown') {
        attackCooldown -= dt
        const distance = Math.abs(player.position.x - boss.position.x)
        if (distance > 4.2) {
          boss.position.x += bossFacing * dt * (bossHP <= 60 ? 2.1 : 1.45)
          boss.position.x = clamp(boss.position.x, -7.8, 7.8)
        }
        if (attackCooldown <= 0) beginTelegraph()
      } else if (attackState === 'telegraphMelee' || attackState === 'telegraphGround') {
        attackTimer -= dt
        if (attackState === 'telegraphMelee') {
          meleeZone.position.x = boss.position.x + bossFacing * 2.15
          meleeZone.material.opacity = 0.24 + Math.sin(now * 0.018) * 0.1
        } else {
          groundPath.material.opacity = 0.29 + Math.sin(now * 0.018) * 0.1
        }
        if (attackTimer <= 0) resolveTelegraph()
      } else if (attackState === 'projectile') {
        projectile.position.x += projectileVx * dt
        projectile.rotation.z += dt * 7
        const hitX = Math.abs(projectile.position.x - player.position.x) < 0.95
        const hitY = player.position.y - 0.9 < 0.8
        if (hitX && hitY) {
          hitPlayer()
          projectile.visible = false
          attackState = 'recovery'
          attackTimer = 0.55
        } else if (Math.abs(projectile.position.x) > 10) {
          projectile.visible = false
          attackState = 'recovery'
          attackTimer = 0.35
        }
      } else if (attackState === 'recovery') {
        attackTimer -= dt
        if (attackTimer <= 0) {
          attackKind = attackKind === 'melee' ? 'ground' : 'melee'
          attackState = 'cooldown'
          attackCooldown = bossHP <= 60 ? 0.55 : 0.95
        }
      }
    }

    function playerMelee() {
      if (meleeCooldown > 0 || gameOver) return
      meleeCooldown = 0.32
      sword.scale.x = 1.45
      const inRange = Math.abs(player.position.x - boss.position.x) < 2.55
        && Math.abs(player.position.y - 0.9 - boss.position.y + 2.2) < 2.2
      if (!inRange) return
      const damage = attackState === 'stunned' ? 30 : 10
      bossHP = Math.max(0, bossHP - damage)
      boss.material.emissive.setHex(0xffffff)
      hud.flash(attackState === 'stunned' ? '眩晕重击！' : '命中 Boss')
      if (bossHP <= 0) endGame(true)
    }

    return {
      update(dt, now) {
        if (!gameOver) {
          if (input.hit('KeyK')) {
            parryTimer = 0.13
            player.material.emissive.setHex(0x72e8ff)
          }
          if (input.hit('KeyJ')) playerMelee()

          const axis = input.axis()
          if (axis.x) {
            facing = Math.sign(axis.x)
            vx += axis.x * 30 * dt
          } else {
            vx *= Math.pow(0.0015, dt)
          }
          vx = clamp(vx, -6.5, 6.5)
          if (input.hit('Space') && grounded) {
            vy = 9.5
            grounded = false
          }
          vy -= 23 * dt
          player.position.x = clamp(player.position.x + vx * dt, -9.25, 9.25)
          player.position.y += vy * dt
          if (player.position.y <= 0.9) {
            player.position.y = 0.9
            vy = 0
            grounded = true
          }
          updateBoss(dt, now)
        }

        parryTimer = Math.max(0, parryTimer - dt)
        meleeCooldown = Math.max(0, meleeCooldown - dt)
        player.material.emissive.lerp(new THREE.Color(0x000000), clamp(dt * 8, 0, 1))
        boss.material.emissive.lerp(new THREE.Color(0x000000), clamp(dt * 9, 0, 1))
        sword.scale.x = lerp(sword.scale.x, 1, clamp(dt * 12, 0, 1))
        sword.position.set(player.position.x + facing * 0.95, player.position.y, 0.65)
        sword.rotation.z = facing < 0 ? Math.PI : 0

        for (const mesh of [hpBack, postureBack]) mesh.position.x = boss.position.x
        setBar(hpFill, bossHP / 120, 3.45, boss.position.x)
        setBar(postureFill, posture, 3.45, boss.position.x)
        hpFill.position.y = hpBack.position.y = boss.position.y + 3.1
        postureFill.position.y = postureBack.position.y = boss.position.y + 2.67

        const bars = (value, max, count = 10) => {
          const n = Math.round(clamp(value / max, 0, 1) * count)
          return '■'.repeat(n) + '□'.repeat(count - n)
        }
        hud.setStats(
          `玩家 HP　${bars(playerHP, 5)} ${playerHP}/5\n`
          + `Boss HP ${bars(bossHP, 120)} ${bossHP}/120\n`
          + `架势　　${bars(posture, 1, 9)} ${Math.round(posture * 3)}/3`,
        )
      },
      cleanup() {},
    }
  })
}
