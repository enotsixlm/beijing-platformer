export const GAME_TITLE = 'Turbo Kart Legends'

export const RACER_COUNT = 8
export const KART_RADIUS = 0.9
export const KMH_FACTOR = 3.6 * 1.6

export const PHASES = Object.freeze({
  COUNTDOWN: 'countdown',
  RACING: 'racing',
  FINISHED: 'finished',
})

export const SURFACE = Object.freeze({
  ROAD: 'road',
  OFFROAD: 'offroad',
  BOOST: 'boost',
  VOID: 'void',
})

export const DIFFICULTY = Object.freeze({
  EASY: 'easy',
  NORMAL: 'normal',
  HARD: 'hard',
})

/** Item definitions. `weight` arrays index by rank bucket: [front, mid, back]. */
export const ITEMS = Object.freeze({
  mushroom:        { id: 'mushroom',        name: 'Mushroom',        count: 1, weight: [3, 5, 4], color: '#ff5a5a' },
  triple_mushroom: { id: 'triple_mushroom', name: 'Triple Mushroom', count: 3, weight: [0, 2, 5], color: '#ff5a5a' },
  banana:          { id: 'banana',          name: 'Banana',          count: 1, weight: [6, 3, 0], color: '#ffd93d' },
  triple_banana:   { id: 'triple_banana',   name: 'Triple Banana',   count: 3, weight: [2, 2, 0], color: '#ffd93d' },
  green_shell:     { id: 'green_shell',     name: 'Green Shell',     count: 1, weight: [5, 4, 1], color: '#3ddc84' },
  triple_green:    { id: 'triple_green',    name: 'Triple Green',    count: 3, weight: [1, 3, 2], color: '#3ddc84' },
  red_shell:       { id: 'red_shell',       name: 'Red Shell',       count: 1, weight: [0, 4, 4], color: '#ff3b3b' },
  star:            { id: 'star',            name: 'Super Star',      count: 1, weight: [0, 0, 3], color: '#ffe066' },
  lightning:       { id: 'lightning',       name: 'Lightning',       count: 1, weight: [0, 0, 2], color: '#9ad0ff' },
  bob_omb:         { id: 'bob_omb',         name: 'Bob-omb',         count: 1, weight: [0, 1, 3], color: '#333a4a' },
  fake_box:        { id: 'fake_box',        name: 'Fake Item Box',   count: 1, weight: [3, 1, 0], color: '#c84bff' },
})

export const ITEM_IDS = Object.freeze(Object.keys(ITEMS))

/** Event catalogue. Payloads documented in ARCHITECTURE.md. */
export const EVT = Object.freeze({
  // kart
  DRIFT_START: 'drift_start',
  DRIFT_LEVEL: 'drift_level',
  DRIFT_END: 'drift_end',
  BOOST: 'boost',
  HOP: 'hop',
  LAND: 'land',
  HIT: 'hit',
  WALL_HIT: 'wall_hit',
  OFFROAD_ENTER: 'offroad_enter',
  OFFROAD_EXIT: 'offroad_exit',
  KART_BUMP: 'kart_bump',
  // race
  COUNTDOWN: 'countdown',
  RACE_START: 'race_start',
  LAP: 'lap',
  FINISH: 'finish',
  RACE_OVER: 'race_over',
  POSITION_CHANGE: 'position_change',
  RESPAWN: 'respawn',
  WRONG_WAY: 'wrong_way',
  // items
  ITEM_PICKUP: 'item_pickup',
  ITEM_ROULETTE_TICK: 'item_roulette_tick',
  ITEM_USE: 'item_use',
  ITEM_HIT: 'item_hit',
  SHELL_BOUNCE: 'shell_bounce',
  EXPLOSION: 'explosion',
  STAR_START: 'star_start',
  STAR_END: 'star_end',
  LIGHTNING: 'lightning',
  // ui
  UI_MOVE: 'ui_move',
  UI_SELECT: 'ui_select',
  UI_BACK: 'ui_back',
  UI_MUTE_TOGGLE: 'ui_mute_toggle',
  // game flow
  SCREEN: 'screen', // { name: 'title'|'select'|'race'|'results' }
  PAUSE: 'pause',   // { paused: boolean }
})
