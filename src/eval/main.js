import './common.css'
import { GAMES } from './catalog.js'

const loaders = {
  cam3d_coop_midpoint_follow: () => import('./games/cam3d_coop_midpoint_follow.js'),
  cam3d_split_screen_local_coop_2p: () => import('./games/cam3d_split_screen_local_coop_2p.js'),
  card_deckbuilding_combat: () => import('./games/card_deckbuilding_combat.js'),
  card_memory_flip_pair: () => import('./games/card_memory_flip_pair.js'),
  event_driven_reactor_unlock: () => import('./games/event_driven_reactor_unlock.js'),
  first_person_full_control: () => import('./games/first_person_full_control.js'),
  flight_full_control: () => import('./games/flight_full_control.js'),
  flight_patrol_drone_landmark_loop: () => import('./games/flight_patrol_drone_landmark_loop.js'),
  island_beacon_inspection_route: () => import('./games/island_beacon_inspection_route.js'),
  life_sim_crop_cycle: () => import('./games/life_sim_crop_cycle.js'),
  life_sim_fishing_minigame: () => import('./games/life_sim_fishing_minigame.js'),
  match3_swap_two_adjacent: () => import('./games/match3_swap_two_adjacent.js'),
  platformer_2d_basic_course: () => import('./games/platformer_2d_basic_course.js'),
  platformer_2d_boss_parry: () => import('./games/platformer_2d_boss_parry.js'),
  platformer_3d_basic_course: () => import('./games/platformer_3d_basic_course.js'),
  pool_cue_ball_impulse: () => import('./games/pool_cue_ball_impulse.js'),
  prefab_enemy_pack_respawn: () => import('./games/prefab_enemy_pack_respawn.js'),
  puzzle_timed_rope_cut: () => import('./games/puzzle_timed_rope_cut.js'),
  racing_full_control: () => import('./games/racing_full_control.js'),
  rts_squad_control: () => import('./games/rts_squad_control.js'),
  runner_lane_dodge_and_shield: () => import('./games/runner_lane_dodge_and_shield.js'),
  runtime_bridge_repair: () => import('./games/runtime_bridge_repair.js'),
  savestate_save_load_hotkey: () => import('./games/savestate_save_load_hotkey.js'),
  seeded_input_replay_maze: () => import('./games/seeded_input_replay_maze.js'),
  softbody_jelly_target_toss: () => import('./games/softbody_jelly_target_toss.js'),
  sports_full_control: () => import('./games/sports_full_control.js'),
  strategy_factory_production_line: () => import('./games/strategy_factory_production_line.js'),
  strategy_turn_based_tactics_skirmish: () => import('./games/strategy_turn_based_tactics_skirmish.js'),
  strategy_turret_defense: () => import('./games/strategy_turret_defense.js'),
  table_driven_enemy_arena: () => import('./games/table_driven_enemy_arena.js'),
  third_person_full_control: () => import('./games/third_person_full_control.js'),
  topdown_full_control: () => import('./games/topdown_full_control.js'),
  touch_virtual_joystick_jump_button: () => import('./games/touch_virtual_joystick_jump_button.js'),
  tween_squash_stretch_jump: () => import('./games/tween_squash_stretch_jump.js'),
}

let stop = null

function currentId() {
  return decodeURIComponent(location.hash.replace(/^#\/?/, '')).trim()
}

function renderHub() {
  document.body.className = 'hub-body'
  document.body.innerHTML = `
    <div class="hub">
      <header>
        <h1>Wanaka Eval · 34 个游戏 Demo</h1>
        <p>同一站点内点击卡片即可进入对应评测关卡，左上角返回目录。原北京跑酷仍可从下方打开。</p>
        <p><a class="back" href="./beijing.html" style="position:static;display:inline-block">🐼 北京跑酷</a></p>
      </header>
      <div class="grid">
        ${GAMES.map((g) => `
          <a class="card" href="#/${g.id}">
            <div class="num">${g.num}</div>
            <h2>${g.title}</h2>
            <div class="tags">${g.tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div>
          </a>`).join('')}
      </div>
    </div>`
}

async function play(id) {
  document.body.className = ''
  document.body.innerHTML = ''
  const loader = loaders[id]
  if (!loader) {
    renderHub()
    return
  }
  const mod = await loader()
  stop = mod.start()
}

async function route() {
  if (stop) {
    try { stop() } catch {}
    stop = null
  }
  const id = currentId()
  if (!id) renderHub()
  else await play(id)
}

window.addEventListener('hashchange', () => { route() })
route()
