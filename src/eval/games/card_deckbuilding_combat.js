import { run, ground, box, makeLabel, panel, seedRand } from '../engine.js'

const CARDS = {
  attack: { key: 'attack', name: 'Attack', cost: 1, text: '造成 6 点伤害', damage: 6 },
  defend: { key: 'defend', name: 'Defend', cost: 1, text: '获得 5 点格挡', block: 5 },
  heavy: { key: 'heavy', name: 'Heavy', cost: 2, text: '造成 14 点伤害', damage: 14 },
  quick: { key: 'quick', name: 'Quick Strike', cost: 0, text: '造成 4 点伤害', damage: 4 },
  fortress: { key: 'fortress', name: 'Fortify', cost: 1, text: '获得 9 点格挡', block: 9 },
  crush: { key: 'crush', name: 'Crush', cost: 2, text: '造成 18 点伤害', damage: 18 },
}

export function start() {
  return run('card_deckbuilding_combat', {
    bg: 0x171326,
    camPos: [0, 9, 15],
    lookAt: [0, 1.8, 0],
  }, (app) => {
    const { scene, hud } = app
    ground(scene, { s: 32, color: 0x332943 })
    const playerMesh = box(scene, {
      w: 2, h: 3, d: 2, color: 0x3c8cff,
      x: -5, y: 0.4, z: 0, y0: true,
    })
    const enemyMesh = box(scene, {
      w: 3.2, h: 4.2, d: 2.8, color: 0xd94755,
      x: 5, y: 0.4, z: 0, y0: true, rough: 0.45,
    })
    box(scene, { w: 1, h: 1, d: 1, color: 0xffd66b, x: 4.1, y: 4.9, z: 0 })
    box(scene, { w: 1, h: 1, d: 1, color: 0xffd66b, x: 5.9, y: 4.9, z: 0 })

    const topUI = panel('', 'top:62px;left:50%;transform:translateX(-50%);min-width:460px;text-align:center')
    const handUI = panel(
      '',
      'left:50%;bottom:54px;transform:translateX(-50%);width:min(760px,94vw);text-align:center',
    )
    const rand = seedRand(0xc0ffee)
    const deck = [
      'attack', 'attack', 'attack', 'attack',
      'defend', 'defend', 'defend', 'defend',
      'heavy', 'heavy',
    ]

    let playerHP = 50
    let playerBlock = 0
    let enemyHP = 40
    let enemyMaxHP = 40
    let enemyIntent = 10
    let energy = 3
    let fight = 1
    let phase = 'fight'
    let drawPile = []
    let discard = []
    let hand = []
    let intentLabel = null
    let hitPulse = 0

    function shuffle(list) {
      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1))
        ;[list[i], list[j]] = [list[j], list[i]]
      }
      return list
    }

    function setIntent() {
      enemyIntent = 8 + Math.floor(rand() * 7)
      if (intentLabel) {
        scene.remove(intentLabel)
        intentLabel.material.map?.dispose()
        intentLabel.material.dispose()
      }
      intentLabel = makeLabel(`NEXT: ${enemyIntent} DMG`, { color: '#ffd36c', scale: 3.4 })
      intentLabel.position.set(5, 7.2, 0)
      scene.add(intentLabel)
    }

    function drawOne() {
      if (!drawPile.length && discard.length) {
        drawPile = shuffle(discard.splice(0))
        hud.flash('洗回弃牌堆')
      }
      const card = drawPile.pop()
      if (card) hand.push(card)
    }

    function beginTurn() {
      playerBlock = 0
      energy = 3
      for (let i = 0; i < 5; i++) drawOne()
      renderUI()
    }

    function startFight(number) {
      fight = number
      phase = 'fight'
      enemyMaxHP = number === 1 ? 40 : 70
      enemyHP = enemyMaxHP
      enemyMesh.visible = true
      enemyMesh.scale.set(1, 1, 1)
      enemyMesh.material.color.set(number === 1 ? 0xd94755 : 0x9d49d6)
      drawPile = shuffle(deck.map((key) => CARDS[key]))
      discard = []
      hand = []
      setIntent()
      beginTurn()
      hud.hideOverlay()
      hud.flash(`战斗 ${number}`)
    }

    function cardHTML(card, index) {
      const unavailable = energy < card.cost ? ' off' : ''
      return `
        <button class="card-tile${unavailable}" data-card="${index}">
          <div class="cost">⚡ ${card.cost}</div>
          <h3>${card.name}</h3>
          <p style="margin-top:12px;color:#cbd8f7">${card.text}</p>
        </button>`
    }

    function renderUI() {
      topUI.innerHTML = `
        <div style="display:flex;gap:44px;justify-content:center;font-weight:800">
          <span style="color:#78b5ff">玩家 HP ${playerHP}/50 · 格挡 ${playerBlock}</span>
          <span style="color:#ff7d88">敌人 HP ${Math.max(0, enemyHP)}/${enemyMaxHP}</span>
        </div>
        <div style="margin-top:5px;color:#b9c8ea">战斗 ${fight}/2 · 能量 ⚡ ${energy}/3 · 牌组 ${deck.length}</div>`

      if (phase === 'fight') {
        handUI.innerHTML = `
          <div class="hand">${hand.map(cardHTML).join('')}</div>
          <button data-action="end" style="margin-top:9px;background:#9d4b35">结束回合</button>
          <div style="font-size:11px;color:#94a7d0;margin-top:6px">
            抽牌堆 ${drawPile.length} · 弃牌堆 ${discard.length}
          </div>`
      }
    }

    function reward() {
      phase = 'reward'
      enemyMesh.visible = false
      const rewards = [CARDS.quick, CARDS.fortress, CARDS.crush]
      handUI.innerHTML = `
        <h2 style="margin-bottom:8px">选择一张奖励牌加入牌组</h2>
        <div class="hand">
          ${rewards.map((card) => `
            <button class="card-tile" data-reward="${card.key}">
              <div class="cost">⚡ ${card.cost}</div>
              <h3>${card.name}</h3>
              <p style="margin-top:12px;color:#cbd8f7">${card.text}</p>
            </button>`).join('')}
        </div>`
      hud.flash('敌人被击败！')
    }

    function winFight() {
      enemyMesh.visible = false
      if (fight === 1) {
        reward()
      } else {
        phase = 'won'
        handUI.innerHTML = '<h2>全部战斗胜利</h2>'
        hud.showOverlay('胜利', `剩余生命 ${playerHP}/50 · 最终牌组 ${deck.length} 张`)
      }
    }

    function playCard(index) {
      if (phase !== 'fight') return
      const card = hand[index]
      if (!card) return
      if (energy < card.cost) {
        hud.flash('能量不足')
        return
      }
      energy -= card.cost
      hand.splice(index, 1)
      discard.push(card)
      if (card.damage) {
        enemyHP -= card.damage
        hitPulse = 0.18
        hud.flash(`${card.name} 造成 ${card.damage} 伤害`)
      }
      if (card.block) {
        playerBlock += card.block
        hud.flash(`${card.name} 获得 ${card.block} 格挡`)
      }
      if (enemyHP <= 0) winFight()
      else renderUI()
    }

    function endTurn() {
      if (phase !== 'fight') return
      discard.push(...hand.splice(0))
      const absorbed = Math.min(playerBlock, enemyIntent)
      const damage = enemyIntent - absorbed
      playerBlock -= absorbed
      playerHP -= damage
      if (damage) hud.flash(`敌人造成 ${damage} 伤害`)
      else hud.flash('格挡了全部伤害')
      if (playerHP <= 0) {
        playerHP = 0
        phase = 'lost'
        handUI.innerHTML = '<h2>战斗失败</h2>'
        renderUI()
        hud.showOverlay('失败', '牌组没能撑过敌人的攻击')
        return
      }
      setIntent()
      beginTurn()
    }

    const onClick = (event) => {
      const cardButton = event.target.closest('[data-card]')
      if (cardButton) {
        playCard(Number(cardButton.dataset.card))
        return
      }
      if (event.target.closest('[data-action="end"]')) {
        endTurn()
        return
      }
      const rewardButton = event.target.closest('[data-reward]')
      if (rewardButton && phase === 'reward') {
        const key = rewardButton.dataset.reward
        deck.push(key)
        hud.flash(`${CARDS[key].name} 已加入牌组`)
        startFight(2)
      }
    }
    handUI.addEventListener('click', onClick)
    startFight(1)

    return {
      update(dt) {
        if (hitPulse > 0) {
          hitPulse -= dt
          enemyMesh.rotation.z = Math.sin(hitPulse * 75) * 0.09
        } else {
          enemyMesh.rotation.z *= Math.exp(-14 * dt)
        }
        playerMesh.rotation.y = Math.sin(performance.now() * 0.001) * 0.08
      },
      cleanup() {
        handUI.removeEventListener('click', onClick)
        topUI.remove()
        handUI.remove()
        if (intentLabel) {
          scene.remove(intentLabel)
          intentLabel.material.map?.dispose()
          intentLabel.material.dispose()
        }
      },
    }
  })
}
