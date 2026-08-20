import * as THREE from 'three'
import { WORLD, MAT } from './config.js'

export function createWorld() {
  const { sx, sy, sz, originX, originY, originZ } = WORLD
  const data = new Uint8Array(sx * sy * sz)
  const idx = (x, y, z) => x + sx * (z + sz * y)

  const world = {
    sx, sy, sz, originX, originY, originZ, data,
    inBounds(x, y, z) {
      return x >= 0 && y >= 0 && z >= 0 && x < sx && y < sy && z < sz
    },
    get(x, y, z) {
      if (!world.inBounds(x, y, z)) return MAT.AIR
      return data[idx(x, y, z)]
    },
    set(x, y, z, v) {
      if (!world.inBounds(x, y, z)) return false
      data[idx(x, y, z)] = v
      return true
    },
    worldToCell(wx, wy, wz) {
      return [
        Math.floor(wx - originX),
        Math.floor(wy - originY),
        Math.floor(wz - originZ),
      ]
    },
    cellToWorld(x, y, z) {
      return new THREE.Vector3(originX + x + 0.5, originY + y + 0.5, originZ + z + 0.5)
    },
    getWorld(wx, wy, wz) {
      const [x, y, z] = world.worldToCell(wx, wy, wz)
      return world.get(x, y, z)
    },
    solidWorld(wx, wy, wz) {
      return world.getWorld(wx, wy, wz) !== MAT.AIR
    },
    destructible(id) {
      return id === MAT.FLOOR || id === MAT.WALL || id === MAT.NEON
    },
  }
  return world
}

export function fillArena(world) {
  const { sx, sy, sz } = world
  for (let z = 0; z < sz; z++) {
    for (let x = 0; x < sx; x++) {
      world.set(x, 0, z, MAT.FLOOR)
      const edge = x < 2 || z < 2 || x > sx - 3 || z > sz - 3
      if (edge) {
        for (let y = 1; y <= 9; y++) world.set(x, y, z, MAT.WALL)
      }
    }
  }
  // back wall inner slab — mostly solid so small guns spark without carving
  for (let x = 7; x < sx - 7; x++) {
    for (let y = 1; y <= 11; y++) {
      world.set(x, y, 3, MAT.SOLID)
      world.set(x, y, 2, MAT.SOLID)
    }
  }
  // thick cyan frame on the back wall
  for (let x = 9; x < sx - 9; x++) {
    for (let z = 4; z <= 5; z++) {
      world.set(x, 1, z, MAT.NEON)
      world.set(x, 2, z, MAT.NEON)
      world.set(x, 9, z, MAT.NEON)
      world.set(x, 10, z, MAT.NEON)
    }
  }
  for (let y = 1; y <= 10; y++) {
    for (let z = 4; z <= 5; z++) {
      world.set(9, y, z, MAT.NEON)
      world.set(10, y, z, MAT.NEON)
      world.set(sx - 10, y, z, MAT.NEON)
      world.set(sx - 11, y, z, MAT.NEON)
    }
  }
  // destructible side bunker on the right
  for (let z = 16; z < 26; z++) {
    for (let y = 1; y <= 6; y++) {
      for (let x = sx - 8; x < sx - 4; x++) world.set(x, y, z, MAT.WALL)
    }
  }
  // low cover blocks
  for (let x = 18; x < 24; x++) {
    for (let z = 20; z < 24; z++) world.set(x, 1, z, MAT.WALL)
  }
}

function addQuad(bucket, ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, nx, ny, nz) {
  const p = bucket.positions
  const n = bucket.normals
  const u = bucket.uvs
  const verts = [
    [ax, ay, az], [bx, by, bz], [cx, cy, cz],
    [ax, ay, az], [cx, cy, cz], [dx, dy, dz],
  ]
  for (const v of verts) {
    p.push(v[0], v[1], v[2])
    n.push(nx, ny, nz)
    if (Math.abs(ny) > 0.5) u.push(v[0], v[2])
    else if (Math.abs(nx) > 0.5) u.push(v[2], v[1])
    else u.push(v[0], v[1])
  }
}

function greedy(world, matId) {
  const { sx, sy, sz, originX, originY, originZ } = world
  const dims = [sx, sy, sz]
  const bucket = { positions: [], normals: [], uvs: [] }
  const get = (x, y, z) => world.get(x, y, z)

  for (let d = 0; d < 3; d++) {
    const u = (d + 1) % 3
    const v = (d + 2) % 3
    const x = [0, 0, 0]
    const q = [0, 0, 0]
    q[d] = 1
    const mask = new Int8Array(dims[u] * dims[v])

    for (x[d] = -1; x[d] < dims[d];) {
      let n = 0
      for (x[v] = 0; x[v] < dims[v]; ++x[v]) {
        for (x[u] = 0; x[u] < dims[u]; ++x[u]) {
          const aPos = [x[0], x[1], x[2]]
          const bPos = [x[0] + q[0], x[1] + q[1], x[2] + q[2]]
          const a = (x[d] >= 0) ? get(aPos[0], aPos[1], aPos[2]) : MAT.AIR
          const b = (x[d] < dims[d] - 1) ? get(bPos[0], bPos[1], bPos[2]) : MAT.AIR
          const aOn = a === matId
          const bOn = b === matId
          mask[n++] = aOn === bOn ? 0 : (aOn ? 1 : -1)
        }
      }
      ++x[d]

      n = 0
      for (let j = 0; j < dims[v]; j++) {
        for (let i = 0; i < dims[u];) {
          const c = mask[n]
          if (c) {
            let w = 1
            while (i + w < dims[u] && mask[n + w] === c) w++
            let h = 1
            outer: for (; j + h < dims[v]; h++) {
              for (let k = 0; k < w; k++) {
                if (mask[n + k + h * dims[u]] !== c) break outer
              }
            }
            x[u] = i
            x[v] = j
            const du = [0, 0, 0]; du[u] = w
            const dv = [0, 0, 0]; dv[v] = h
            const ox = originX, oy = originY, oz = originZ
            const px = ox + x[0], py = oy + x[1], pz = oz + x[2]
            const sign = c > 0 ? 1 : -1
            const nx = q[0] * sign, ny = q[1] * sign, nz = q[2] * sign
            // winding so normal faces outward
            let a, b, cc, dd
            if (sign > 0) {
              a = [px, py, pz]
              b = [px + du[0], py + du[1], pz + du[2]]
              cc = [px + du[0] + dv[0], py + du[1] + dv[1], pz + du[2] + dv[2]]
              dd = [px + dv[0], py + dv[1], pz + dv[2]]
            } else {
              a = [px, py, pz]
              dd = [px + du[0], py + du[1], pz + du[2]]
              cc = [px + du[0] + dv[0], py + du[1] + dv[1], pz + du[2] + dv[2]]
              b = [px + dv[0], py + dv[1], pz + dv[2]]
            }
            addQuad(bucket,
              a[0], a[1], a[2], b[0], b[1], b[2], cc[0], cc[1], cc[2], dd[0], dd[1], dd[2],
              nx, ny, nz)
            for (let dj = 0; dj < h; dj++) {
              for (let di = 0; di < w; di++) mask[n + di + dj * dims[u]] = 0
            }
            i += w
            n += w
          } else {
            i++
            n++
          }
        }
      }
    }
  }
  return bucket
}

const FLOOR_VERT = `
varying vec3 vWorld;
varying vec3 vNormal;
#include <common>
#include <fog_pars_vertex>
void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  vec4 mvPosition = viewMatrix * w;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`

const FLOOR_FRAG = `
uniform vec3 uColor;
uniform vec3 uLine;
uniform float uCell;
varying vec3 vWorld;
varying vec3 vNormal;
#include <common>
#include <fog_pars_fragment>
void main() {
  vec3 n = normalize(vNormal);
  vec3 col = uColor * (0.42 + 0.58 * max(n.y, 0.0));
  if (n.y > 0.35) {
    vec2 p = vWorld.xz;
    vec2 g = abs(fract(p - 0.5) - 0.5);
    float line = 1.0 - smoothstep(0.0, 0.032, min(g.x, g.y));
    vec2 g4 = abs(fract(p / 4.0 - 0.5) - 0.5);
    float major = 1.0 - smoothstep(0.0, 0.012, min(g4.x, g4.y));
    col += uLine * (line * 0.85 + major * 0.35);
    col += vec3(0.02, 0.06, 0.07);
  }
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}
`

function makeFloorMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      {
        uColor: { value: new THREE.Color(0x051e24) },
        uLine: { value: new THREE.Color(0x2ee8ff) },
        uCell: { value: 1 },
      },
    ]),
    vertexShader: FLOOR_VERT,
    fragmentShader: FLOOR_FRAG,
    fog: true,
  })
}

export function createVoxelView(scene) {
  const mats = {
    [MAT.FLOOR]: makeFloorMaterial(),
    [MAT.WALL]: new THREE.MeshLambertMaterial({ color: 0x14181e }),
    [MAT.SOLID]: new THREE.MeshLambertMaterial({ color: 0x0c1014 }),
    [MAT.NEON]: new THREE.MeshBasicMaterial({ color: 0x2ee8ff }),
  }

  const group = new THREE.Group()
  scene.add(group)
  const meshes = {}

  function rebuild(world) {
    for (const id of Object.keys(mats)) {
      const bucket = greedy(world, Number(id))
      let mesh = meshes[id]
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.Float32BufferAttribute(bucket.positions, 3))
      geo.setAttribute('normal', new THREE.Float32BufferAttribute(bucket.normals, 3))
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(bucket.uvs, 2))
      if (!mesh) {
        mesh = new THREE.Mesh(geo, mats[id])
        mesh.receiveShadow = true
        mesh.castShadow = Number(id) !== MAT.FLOOR
        group.add(mesh)
        meshes[id] = mesh
      } else {
        mesh.geometry.dispose()
        mesh.geometry = geo
      }
    }
  }

  return { group, rebuild, mats }
}

export function rayVoxel(world, origin, dir, maxDist = 80) {
  const d = dir.clone().normalize()
  let t = 0
  let x = Math.floor(origin.x - world.originX)
  let y = Math.floor(origin.y - world.originY)
  let z = Math.floor(origin.z - world.originZ)
  const stepX = d.x > 0 ? 1 : (d.x < 0 ? -1 : 0)
  const stepY = d.y > 0 ? 1 : (d.y < 0 ? -1 : 0)
  const stepZ = d.z > 0 ? 1 : (d.z < 0 ? -1 : 0)
  const tDeltaX = stepX !== 0 ? Math.abs(1 / d.x) : Infinity
  const tDeltaY = stepY !== 0 ? Math.abs(1 / d.y) : Infinity
  const tDeltaZ = stepZ !== 0 ? Math.abs(1 / d.z) : Infinity
  const frac = (v, o, step) => {
    const f = v - o
    if (step > 0) return 1 - (f - Math.floor(f))
    if (step < 0) return f - Math.floor(f)
    return Infinity
  }
  let tMaxX = tDeltaX * frac(origin.x, world.originX, stepX)
  let tMaxY = tDeltaY * frac(origin.y, world.originY, stepY)
  let tMaxZ = tDeltaZ * frac(origin.z, world.originZ, stepZ)
  let lastAxis = 0

  while (t <= maxDist) {
    const id = world.get(x, y, z)
    if (id !== MAT.AIR) {
      const n = new THREE.Vector3()
      n.setComponent(lastAxis, - (lastAxis === 0 ? stepX : lastAxis === 1 ? stepY : stepZ))
      const point = origin.clone().addScaledVector(d, t)
      return { x, y, z, id, t, point, normal: n }
    }
    if (tMaxX < tMaxY) {
      if (tMaxX < tMaxZ) {
        x += stepX; t = tMaxX; tMaxX += tDeltaX; lastAxis = 0
      } else {
        z += stepZ; t = tMaxZ; tMaxZ += tDeltaZ; lastAxis = 2
      }
    } else if (tMaxY < tMaxZ) {
      y += stepY; t = tMaxY; tMaxY += tDeltaY; lastAxis = 1
    } else {
      z += stepZ; t = tMaxZ; tMaxZ += tDeltaZ; lastAxis = 2
    }
    if (!world.inBounds(x, y, z) && t > 1) break
  }
  return null
}

export function carveSphere(world, cx, cy, cz, radius) {
  const r = radius
  const minX = Math.floor(cx - r), maxX = Math.floor(cx + r)
  const minY = Math.floor(cy - r), maxY = Math.floor(cy + r)
  const minZ = Math.floor(cz - r), maxZ = Math.floor(cz + r)
  const removed = []
  for (let y = minY; y <= maxY; y++) {
    for (let z = minZ; z <= maxZ; z++) {
      for (let x = minX; x <= maxX; x++) {
        const id = world.get(x, y, z)
        if (!world.destructible(id)) continue
        const dx = x + 0.5 - cx, dy = y + 0.5 - cy, dz = z + 0.5 - cz
        if (dx * dx + dy * dy + dz * dz <= r * r) {
          world.set(x, y, z, MAT.AIR)
          removed.push({ x, y, z, id })
        }
      }
    }
  }
  return removed
}
