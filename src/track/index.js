// Module 1 — Tracks. See ARCHITECTURE.md ("Module 1 — src/track/").
//
// Files:
//   spline.js      TrackSpline: closed centripetal Catmull-Rom + dense sample table + fast getSurfaceAt,
//                  roundedLoop() layout helper (waypoints with corner radii → smooth control points)
//   roadbuilder.js ribbon strips (road / curbs / off-road / skirt / walls), start gate, boost pads,
//                  item-box rows, start grid, pillars, vertex-coloured ground
//   scenery.js     instanced prop geometries, scatter/alongWall placement, animated shader materials,
//                  sky / mountains / clouds / city / sea / lava pools, grandstands, billboards, hazards
//   textures.js    procedural CanvasTextures (Node-safe: falls back to 1×1 DataTexture headless)
//   base.js        Track class (queries, lights, minimap, update, dispose)
//   sunshine.js / lava.js / neon.js   the three themed tracks
import { buildSunshine } from './sunshine.js'
import { buildLava } from './lava.js'
import { buildNeon } from './neon.js'

export const TRACKS = [
  { id: 'sunshine', name: 'Sunshine Speedway', laps: 3, difficulty: 1, blurb: 'Palm-lined beach straights, a hilltop hairpin and a lighthouse loop. Watch out for beach balls!', accent: '#ffb703' },
  { id: 'lava', name: 'Magma Fortress', laps: 3, difficulty: 2, blurb: 'A volcanic castle circuit: cross the lava bridge under the crushers and dodge the rolling boulders.', accent: '#ff6a1a' },
  { id: 'neon', name: 'Neon Skyline', laps: 3, difficulty: 3, blurb: 'A rain-slick skyway through a neon night city. Traffic drones and spinning rotor gates await.', accent: '#37f5ff' },
]

const BUILDERS = { sunshine: buildSunshine, lava: buildLava, neon: buildNeon }

/** Headless-friendly list of track definitions. */
export function getTrackList() {
  return TRACKS
}

/**
 * Build a Track instance for the given id (see ARCHITECTURE.md for the Track interface).
 * @param {string} id one of TRACKS[].id
 */
export function createTrack(id) {
  const def = TRACKS.find((t) => t.id === id)
  const build = BUILDERS[id]
  if (!def || !build) throw new Error(`[track] unknown track id "${id}"`)
  return build(def)
}
