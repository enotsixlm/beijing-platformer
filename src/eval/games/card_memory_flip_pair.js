import { THREE, run, ground, box, pick, seedRand, orthoCamera } from '../engine.js'

export function start() {
  const camera = orthoCamera(7.3, 17)
  return run('card_memory_flip_pair', {
    bg: 0x11182b,
    camera,
  }, (app) => {
    const { scene, input, hud } = app
    ground(scene, { s: 16, color: 0x263754 })
    box(scene, { w: 15, h: 0.12, d: 0.16, color: 0x7185aa, x: 0, y: 0.45, z: -4.2 })
    box(scene, { w: 15, h: 0.12, d: 0.16, color: 0x7185aa, x: 0, y: 0.45, z: 4.2 })

    const values = [
      0xe64b4b, 0xe64b4b,
      0x42c874, 0x42c874,
      0xf1ce45, 0xf1ce45,
      0xa85ae0, 0xa85ae0,
    ]
    const rand = seedRand(0x4ca2d)
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1))
      ;[values[i], values[j]] = [values[j], values[i]]
    }

    const cards = []
    const clickable = []
    for (let i = 0; i < 8; i++) {
      const side = new THREE.MeshStandardMaterial({ color: 0x293651, roughness: 0.65 })
      const front = new THREE.MeshStandardMaterial({
        color: values[i],
        roughness: 0.38,
        metalness: 0.08,
      })
      const back = new THREE.MeshStandardMaterial({
        color: 0x30343e,
        roughness: 0.75,
        metalness: 0.12,
      })
      const materials = [side, side, front, back, side, side]
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.3, 2.8), materials)
      mesh.position.set((i % 4 - 1.5) * 3.1, 0.78, (Math.floor(i / 4) - 0.5) * 3.5)
      mesh.rotation.x = Math.PI
      mesh.castShadow = true
      mesh.receiveShadow = true
      scene.add(mesh)
      const card = {
        mesh,
        value: values[i],
        target: Math.PI,
        faceUp: false,
        matched: false,
      }
      mesh.userData.card = card
      cards.push(card)
      clickable.push(mesh)
    }

    let selected = []
    let locked = false
    let resolveAt = 0
    let resolvingMatch = false
    let matchedPairs = 0

    function select(card) {
      if (locked || card.faceUp || card.matched) return
      card.faceUp = true
      card.target = 0
      selected.push(card)
      if (selected.length === 2) {
        locked = true
        resolvingMatch = selected[0].value === selected[1].value
        resolveAt = performance.now() + 500
      }
    }

    return {
      update(dt, now) {
        for (const card of cards) {
          card.mesh.rotation.x += (card.target - card.mesh.rotation.x) * (1 - Math.exp(-16 * dt))
        }

        if (input.mouse.justDown && !locked) {
          const hit = pick(camera, input.mouse.ndc, clickable)
          if (hit?.object?.userData.card) select(hit.object.userData.card)
        }

        if (locked && now >= resolveAt) {
          if (resolvingMatch) {
            for (const card of selected) {
              card.matched = true
              card.mesh.visible = false
            }
            matchedPairs++
            selected = []
            locked = false
            hud.flash(`配对成功 ${matchedPairs}/4`)
            if (matchedPairs === 4) hud.showOverlay('完成', '四组颜色全部配对成功')
          } else {
            for (const card of selected) {
              card.faceUp = false
              card.target = Math.PI
            }
            selected = []
            locked = false
            hud.flash('颜色不同')
          }
        }
        hud.setStats(`已配对 ${matchedPairs}/4\n${locked ? '正在检查…' : '点击两张牌翻开'}`)
      },
      cleanup() {
        for (const card of cards) {
          card.mesh.geometry.dispose()
          for (const material of new Set(card.mesh.material)) material.dispose()
        }
      },
    }
  })
}
