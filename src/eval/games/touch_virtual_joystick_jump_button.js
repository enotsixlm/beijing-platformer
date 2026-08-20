import { THREE, run, box, ground, norm2, moveXZ, lookXZ, panel } from '../engine.js'

export function start() {
  return run('touch_virtual_joystick_jump_button', {
    bg: 0x18243a,
    camPos: [8, 7, 10],
    lookAt: [0, 1, 0],
    hint: '左下虚拟摇杆移动 · 右下跳跃 · 跳跃必须松开再按（桌面可用鼠标或 WASD/空格）',
  }, ({ scene, camera, input, hud }) => {
    ground(scene, { s: 30, color: 0x3c6047, y: 0 })

    const props = [
      [-5, -5, 2.2, 0xd17b58],
      [5, -6, 1.2, 0x5d8bc0],
      [-7, 3, 3.2, 0x8768a3],
      [6, 4, 1.8, 0xd0ae57],
      [0, -9, 0.7, 0x579b76],
    ]
    for (const [x, z, h, color] of props) {
      box(scene, { w: 2.1, h, d: 2.1, color, x, y: 0.4, z, y0: true })
    }

    const player = new THREE.Group()
    player.position.set(0, 0.4, 1)
    scene.add(player)
    const body = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.46, 0.85, 5, 10),
      new THREE.MeshStandardMaterial({ color: 0x58a0ff, emissive: 0x0f315d }),
    )
    body.position.y = 0.9
    body.castShadow = true
    player.add(body)
    const nose = new THREE.Mesh(
      new THREE.ConeGeometry(0.14, 0.48, 5),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x444466 }),
    )
    nose.rotation.x = Math.PI / 2
    nose.position.set(0, 1.04, 0.48)
    player.add(nose)

    const controls = panel(`
      <div class="vjoy-base" data-joy aria-label="移动摇杆"></div>
      <div class="vjoy-knob" data-knob></div>
      <div class="vjump" data-jump aria-label="跳跃">跳跃</div>
    `, 'position:fixed;inset:0;padding:0;border:0;background:none;pointer-events:none')
    const joyBase = controls.querySelector('[data-joy]')
    const joyKnob = controls.querySelector('[data-knob]')
    const jumpButton = controls.querySelector('[data-jump]')
    joyKnob.style.pointerEvents = 'none'

    let joystickPointer = null
    let jumpPointer = null
    let joyX = 0
    let joyZ = 0
    let jumpRequested = false
    let jumpArmed = true

    function updateJoystick(event) {
      const rect = joyBase.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const rawX = event.clientX - centerX
      const rawY = event.clientY - centerY
      const radius = rect.width * 0.36
      const length = Math.hypot(rawX, rawY)
      const scale = length > radius ? radius / length : 1
      const dx = rawX * scale
      const dy = rawY * scale
      joyX = dx / radius
      joyZ = dy / radius
      joyKnob.style.left = `${centerX + dx - 32}px`
      joyKnob.style.top = `${centerY + dy - 32}px`
      joyKnob.style.bottom = 'auto'
    }

    function resetJoystick() {
      joystickPointer = null
      joyX = 0
      joyZ = 0
      const rect = joyBase.getBoundingClientRect()
      joyKnob.style.left = `${rect.left + rect.width / 2 - 32}px`
      joyKnob.style.top = `${rect.top + rect.height / 2 - 32}px`
      joyKnob.style.bottom = 'auto'
    }

    joyBase.addEventListener('pointerdown', (event) => {
      if (joystickPointer !== null) return
      event.preventDefault()
      event.stopPropagation()
      joystickPointer = event.pointerId
      joyBase.setPointerCapture(event.pointerId)
      updateJoystick(event)
    })
    joyBase.addEventListener('pointermove', (event) => {
      if (event.pointerId !== joystickPointer) return
      event.preventDefault()
      updateJoystick(event)
    })
    const endJoystick = (event) => {
      if (event.pointerId !== joystickPointer) return
      event.preventDefault()
      event.stopPropagation()
      resetJoystick()
    }
    joyBase.addEventListener('pointerup', endJoystick)
    joyBase.addEventListener('pointercancel', endJoystick)

    jumpButton.addEventListener('pointerdown', (event) => {
      event.preventDefault()
      event.stopPropagation()
      if (jumpPointer !== null || !jumpArmed) return
      jumpPointer = event.pointerId
      jumpArmed = false
      jumpRequested = true
      jumpButton.setPointerCapture(event.pointerId)
      jumpButton.style.transform = 'scale(0.9)'
      jumpButton.style.background = 'rgba(120,180,255,0.85)'
    })
    const releaseJump = (event) => {
      if (event.pointerId !== jumpPointer) return
      event.preventDefault()
      event.stopPropagation()
      jumpPointer = null
      jumpArmed = true
      jumpButton.style.transform = ''
      jumpButton.style.background = ''
    }
    jumpButton.addEventListener('pointerup', releaseJump)
    jumpButton.addEventListener('pointercancel', releaseJump)

    let velocityY = 0
    let grounded = true
    let jumps = 0

    return {
      update(dt) {
        const keyboard = input.wasd()
        let moveX = Math.abs(joyX) > 0.04 ? joyX : keyboard.x
        let moveZ = Math.abs(joyZ) > 0.04 ? joyZ : keyboard.z
        if (moveX || moveZ) {
          const strength = Math.min(1, Math.hypot(moveX, moveZ))
          const direction = norm2(moveX, moveZ)
          moveX = direction.x
          moveZ = direction.z
          moveXZ(player, moveX, moveZ, dt, 6.2 * Math.max(0.35, strength), 13.8)
          lookXZ(player, moveX, moveZ)
        }

        const keyboardJump = input.hit('Space')
        if ((jumpRequested || keyboardJump) && grounded) {
          velocityY = 8
          grounded = false
          jumps += 1
        }
        jumpRequested = false
        velocityY -= 20 * dt
        player.position.y += velocityY * dt
        if (player.position.y <= 0.4) {
          player.position.y = 0.4
          velocityY = 0
          grounded = true
        }

        const target = new THREE.Vector3(player.position.x, player.position.y + 1.05, player.position.z)
        const desired = new THREE.Vector3(player.position.x + 7.5, player.position.y + 6.5, player.position.z + 9)
        camera.position.lerp(desired, 1 - Math.exp(-dt * 6))
        camera.lookAt(target)
        hud.setStats(`摇杆: ${joystickPointer === null ? '待机' : '按住移动'}\n跳跃: ${grounded ? '就绪' : '空中'}\n跳跃次数: ${jumps}`)
      },
      cleanup() {
        controls.remove()
      },
    }
  })
}
