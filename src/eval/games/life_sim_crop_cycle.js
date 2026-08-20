import {
  THREE, run, box, ground, makeLabel, clamp, len2, norm2, moveXZ, lookXZ, orthoCamera
} from '../engine.js'

export function start() {
  const camera = orthoCamera(13, 24)
  camera.position.set(0, 24, 11)
  camera.lookAt(0, 0, 0)

  return run('life_sim_crop_cycle', {
    camera,
    bg: 0x9fd6ff,
    shadows: true,
  }, (app) => {
    const { scene, input, hud } = app
    ground(scene, { s: 26, color: 0x62a955 })

    const fenceColor = 0xe2bd77
    box(scene, { w: 25, h: 0.7, d: 0.35, color: fenceColor, x: 0, y: 0.2, z: -12 })
    box(scene, { w: 25, h: 0.7, d: 0.35, color: fenceColor, x: 0, y: 0.2, z: 12 })
    box(scene, { w: 0.35, h: 0.7, d: 24, color: fenceColor, x: -12.3, y: 0.2, z: 0 })
    box(scene, { w: 0.35, h: 0.7, d: 24, color: fenceColor, x: 12.3, y: 0.2, z: 0 })

    const player = box(scene, {
      w: 0.8, h: 1.4, d: 0.8, color: 0x3978d4, x: 0, y: 0.2, z: 8.4, y0: true,
    })
    const facingMark = box(scene, {
      w: 0.18, h: 0.18, d: 0.65, color: 0xffed74, x: 0, y: 1.0, z: 7.9,
    })
    const facing = { x: 0, z: -1 }

    const plotLabel = makeLabel('农田 3 × 3', { color: '#fff6b0', scale: 3 })
    plotLabel.position.set(0, 1.1, -6.3)
    scene.add(plotLabel)

    const plots = []
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const x = (col - 1) * 3
        const z = (row - 1) * 3
        const soil = box(scene, {
          w: 2.35, h: 0.24, d: 2.35, color: 0x8b633f, x, y: 0.2, z,
        })
        const rim = new THREE.LineSegments(
          new THREE.EdgesGeometry(new THREE.BoxGeometry(2.45, 0.28, 2.45)),
          new THREE.LineBasicMaterial({ color: 0xe7cb83 }),
        )
        rim.position.set(x, 0.2, z)
        scene.add(rim)
        plots.push({
          x, z, soil, rim,
          stage: 'empty',
          watered: false,
          growth: 0,
          crop: null,
        })
      }
    }

    function makeCrop(plot) {
      const group = new THREE.Group()
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x5eab3d })
      for (const [ox, oz] of [[-0.55, -0.55], [0.55, -0.55], [-0.55, 0.55], [0.55, 0.55]]) {
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.8, 8), stemMat)
        stem.position.set(ox, 0.4, oz)
        const leaf = new THREE.Mesh(
          new THREE.SphereGeometry(0.2, 8, 6),
          new THREE.MeshStandardMaterial({ color: 0x79ca48 }),
        )
        leaf.scale.set(1.5, 0.6, 0.8)
        leaf.position.set(ox + 0.1, 0.55, oz)
        group.add(stem, leaf)
      }
      group.position.set(plot.x, 0.32, plot.z)
      group.scale.setScalar(0.28)
      scene.add(group)
      plot.crop = group
    }

    function updatePlotVisual(plot) {
      const colors = {
        empty: 0x8b633f,
        tilled: 0x5c3928,
        sown: 0x4d3022,
      }
      plot.soil.material.color.setHex(colors[plot.stage] ?? 0x4d3022)
      if (plot.crop) {
        const scale = plot.growth >= 3 ? 1.35 : 0.38 + plot.growth * 0.29
        plot.crop.scale.setScalar(scale)
        plot.crop.children.forEach((part, index) => {
          if (plot.growth >= 3 && index % 2 === 1) part.material.color.setHex(0xf2c94c)
        })
      }
      plot.rim.material.color.setHex(plot.watered ? 0x55b8ff : 0xe7cb83)
    }

    function facingPlot() {
      let best = null
      let bestDist = Infinity
      for (const plot of plots) {
        const dx = plot.x - player.position.x
        const dz = plot.z - player.position.z
        const dist = len2(dx, dz)
        if (dist < 1.1 || dist > 2.75) continue
        const n = norm2(dx, dz)
        if (n.x * facing.x + n.z * facing.z < 0.62) continue
        if (dist < bestDist) {
          best = plot
          bestDist = dist
        }
      }
      return best
    }

    const toolNames = ['锄头', '种子', '浇水壶']
    let tool = 0
    let seeds = 9
    let harvests = 0
    let day = 1

    function useTool() {
      const plot = facingPlot()
      if (!plot) {
        hud.flash('请站在农田旁并面向它')
        return
      }
      if (tool === 0) {
        if (plot.stage !== 'empty') return hud.flash('这里已经耕过了')
        plot.stage = 'tilled'
        hud.flash('土地已翻耕')
      } else if (tool === 1) {
        if (plot.stage !== 'tilled') return hud.flash('必须先用锄头翻耕')
        if (seeds <= 0) return hud.flash('没有种子了')
        plot.stage = 'sown'
        seeds--
        makeCrop(plot)
        hud.flash('种子已播下')
      } else {
        if (plot.stage !== 'sown') return hud.flash('必须先翻耕并播种')
        if (plot.growth >= 3) return hud.flash('作物已经成熟')
        if (plot.watered) return hud.flash('今天已经浇过水')
        plot.watered = true
        hud.flash('今天已浇水')
      }
      updatePlotVisual(plot)
    }

    function endDay() {
      day++
      let grew = 0
      for (const plot of plots) {
        if (plot.stage === 'sown' && plot.watered && plot.growth < 3) {
          plot.growth++
          grew++
        }
        plot.watered = false
        updatePlotVisual(plot)
      }
      hud.flash(grew ? `${grew} 块作物长大了一次` : '没有浇水的作物生长')
    }

    function harvest() {
      const plot = facingPlot()
      if (!plot || plot.stage !== 'sown' || plot.growth < 3) {
        hud.flash('面向成熟作物才能收获')
        return
      }
      scene.remove(plot.crop)
      plot.crop.traverse((obj) => {
        obj.geometry?.dispose()
        obj.material?.dispose()
      })
      plot.crop = null
      plot.stage = 'empty'
      plot.watered = false
      plot.growth = 0
      harvests++
      updatePlotVisual(plot)
      hud.flash('收获成功！')
    }

    return {
      update(dt) {
        if (input.hit('Digit1')) tool = 0
        if (input.hit('Digit2')) tool = 1
        if (input.hit('Digit3')) tool = 2
        if (input.hit('Space')) useTool()
        if (input.hit('KeyE')) harvest()
        if (input.hit('KeyN')) endDay()

        const axis = input.axis()
        if (len2(axis.x, axis.z) > 0) {
          const n = norm2(axis.x, axis.z)
          facing.x = n.x
          facing.z = n.z
          moveXZ(player, n.x, n.z, dt, 5.2, 11)
          lookXZ(player, n.x, n.z)
        }
        facingMark.position.set(
          player.position.x + facing.x * 0.5,
          1.0,
          player.position.z + facing.z * 0.5,
        )
        facingMark.rotation.y = Math.atan2(facing.x, facing.z)

        const target = facingPlot()
        plots.forEach((plot) => {
          const color = plot === target ? 0xffff66 : (plot.watered ? 0x55b8ff : 0xe7cb83)
          plot.rim.material.color.setHex(color)
        })
        player.position.x = clamp(player.position.x, -11, 11)
        player.position.z = clamp(player.position.z, -11, 11)
        hud.setStats(`工具：${tool + 1} ${toolNames[tool]}　种子：${seeds}　收获：${harvests}　第 ${day} 天`)
      },
      cleanup() {},
    }
  })
}
