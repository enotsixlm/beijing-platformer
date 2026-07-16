import * as THREE from 'three'
import { toon } from './toon.js'
import {
  treeTextures, paperTreeGroup, buildPaperClouds, buildPaperSun, buildPaperMountains,
} from './paper.js'

let seed = 424242
const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647

// 关卡上下文:场景 + 碰撞体 + 金币 + 检查点
function ctx(scene) {
  return {
    scene,
    colliders: [],  // { min:Vector3, max:Vector3, mesh?, mover? }
    coins: [],      // { mesh, taken, phase }
    checkpoints: [],// { name, pos, radius, mesh(灯笼), ring, active }
    movers: [],     // { c(collider), mesh, cx, axis, amp, speed, phase, delta:Vector3 }
    props: [],      // 摇摆的剪纸树
  }
}

function addCollider(L, x, y, z, w, h, d) {
  const c = {
    min: new THREE.Vector3(x - w / 2, y, z - d / 2),
    max: new THREE.Vector3(x + w / 2, y + h, z + d / 2),
  }
  L.colliders.push(c)
  return c
}

// 实心盒:可站可撞
function solidBox(L, x, y, z, w, h, d, mat) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
  m.position.set(x, y + h / 2, z)
  m.castShadow = m.receiveShadow = true
  L.scene.add(m)
  const c = addCollider(L, x, y, z, w, h, d)
  c.mesh = m
  return { mesh: m, c }
}

function addCoin(L, x, y, z) {
  if (!L._coinGeo) {
    L._coinGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.09, 18)
    L._coinGeo.rotateX(Math.PI / 2)
    L._coinMat = toon(0xffc933, { emissive: 0x5c4400 })
  }
  const mesh = new THREE.Mesh(L._coinGeo, L._coinMat)
  mesh.position.set(x, y, z)
  mesh.castShadow = true
  L.scene.add(mesh)
  L.coins.push({ mesh, taken: false, phase: L.coins.length * 0.6, baseY: y })
}

function addCheckpoint(L, name, x, y, z) {
  const g = new THREE.Group()
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 2.6, 8), toon(0x4a4f57))
  pole.position.y = 1.3
  g.add(pole)
  const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.42, 10, 10), toon(0xe03131, { emissive: 0x300800 }))
  lantern.scale.y = 1.25
  lantern.position.y = 2.9
  g.add(lantern)
  const tassel = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 0.4, 6), toon(0xd4ac0d))
  tassel.position.y = 2.2
  g.add(tassel)
  // 地面光圈
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.9, 1.3, 24),
    new THREE.MeshBasicMaterial({ color: 0xffd54a, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
  )
  ring.rotation.x = -Math.PI / 2
  ring.position.y = 0.06
  g.add(ring)
  g.position.set(x, y, z)
  g.traverse((o) => { if (o.isMesh && o !== ring) o.castShadow = true })
  L.scene.add(g)
  L.checkpoints.push({ name, pos: new THREE.Vector3(x, y, z), radius: 3.2, mesh: lantern, ring, active: false })
}

// ---------- 地面:灰卡纸铺装 ----------
function buildPavement(L) {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')
  g.fillStyle = '#e0ddd4'
  g.fillRect(0, 0, 256, 256)
  for (let i = 0; i < 260; i++) {
    g.fillStyle = `rgba(90, 78, 62, ${0.03 + rand() * 0.05})`
    g.fillRect(rand() * 256, rand() * 256, 1 + rand() * 2, 1 + rand() * 2)
  }
  g.strokeStyle = '#f8f5ec'
  g.lineWidth = 10
  g.strokeRect(0, 0, 256, 256)
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(26, 26)
  tex.colorSpace = THREE.SRGBColorSpace
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), toon(0xffffff, { map: tex }))
  mesh.rotation.x = -Math.PI / 2
  mesh.position.set(0, -0.02, -140)
  mesh.receiveShadow = true
  L.scene.add(mesh)

  // 起点广场:一块暖色安全区(视觉提示,z>-28 落地不判负)
  const plaza = new THREE.Mesh(new THREE.PlaneGeometry(64, 60), toon(0xf2e3c8))
  plaza.rotation.x = -Math.PI / 2
  plaza.position.set(0, 0.0, 2)
  plaza.receiveShadow = true
  L.scene.add(plaza)
}

// ---------- 四坡屋顶 ----------
function hipRoof(w, d, h, topScale, color) {
  const geo = new THREE.CylinderGeometry(w * 0.5 * topScale, w * 0.5 * 1.42, h, 4)
  geo.rotateY(Math.PI / 4)
  const m = new THREE.Mesh(geo, toon(color))
  m.scale.z = d / w
  return m
}

// ---------- 天安门(可攀爬) ----------
function buildTiananmen(L) {
  const red = toon(0xb03a2e)
  const darkRed = toon(0x6e1f18)
  const white = toon(0xf5f1e8)

  // 城台 + 白玉栏杆顶(可行走,顶面 y=11)
  solidBox(L, 0, 0, -20, 44, 10, 12, red)
  solidBox(L, 0, 10, -20, 45, 1, 13, white)
  // 五个门洞(贴在南面,装饰)
  for (const [x, w, h] of [[0, 3.4, 4.6], [-8.5, 3, 4], [8.5, 3, 4], [-16.5, 2.7, 3.6], [16.5, 2.7, 3.6]]) {
    const hole = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.6), darkRed)
    hole.position.set(x, h / 2, -13.7)
    L.scene.add(hole)
  }
  // 城楼(挡路,绕两侧走)
  solidBox(L, 0, 11, -20, 30, 5.5, 8, red)
  // 重檐金顶(装饰)
  const roof1 = hipRoof(34, 11, 2.4, 0.72, 0xd4ac0d)
  roof1.position.set(0, 17.7, -20)
  roof1.castShadow = true
  const hall2 = new THREE.Mesh(new THREE.BoxGeometry(26, 2.4, 6.5), red)
  hall2.position.set(0, 20.1, -20)
  const roof2 = hipRoof(29, 9.5, 2.8, 0.28, 0xd4ac0d)
  roof2.position.set(0, 22.7, -20)
  L.scene.add(roof1, hall2, roof2)

  // 上城楼的红台阶(南面)
  const stepMat = toon(0xc94f42)
  const stepYs = [1.7, 3.4, 5.1, 6.8, 8.5, 10.2]
  stepYs.forEach((y, i) => {
    const z = -4.5 - i * 1.7
    solidBox(L, 0, 0, z, 3.2, y, 1.5, stepMat)
    addCoin(L, 0, y + 0.8, z)
  })

  // 旗杆 + 红旗(广场上)
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 14, 8), toon(0xe8e8e8))
  pole.position.set(8, 7, 8)
  pole.castShadow = true
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.2), new THREE.MeshBasicMaterial({ color: 0xe03131, side: THREE.DoubleSide }))
  flag.position.set(9.8, 12.8, 8)
  L.scene.add(pole, flag)

  addCheckpoint(L, '天安门城楼', 6, 11, -14.7)
  // 北侧下行浮台
  const padMat = toon(0xc94f42)
  solidBox(L, 0, 8.2, -31.5, 3, 0.5, 3, padMat)
  solidBox(L, 2.5, 5.8, -37, 3, 0.5, 3, padMat)
  solidBox(L, -1.5, 3.4, -42.5, 3, 0.5, 3, padMat)
  addCoin(L, 0, 10, -31.5)
  addCoin(L, 2.5, 7.6, -37)
  addCoin(L, -1.5, 5.2, -42.5)
}

// ---------- 胡同屋顶段 ----------
function buildHutong(L) {
  const wall = toon(0x9aa0a6)
  const roofMat = toon(0x5d6d7e)
  const door = toon(0xb03a2e)
  const homes = [
    // [x, z, 墙高]
    [0, -48, 3.2], [2.2, -55.5, 3.9], [-2.2, -63, 3.5],
    [0, -70.5, 4.3], [2.5, -78, 3.7], [-2.5, -85.5, 4.6], [0, -93, 4.0],
  ]
  homes.forEach(([x, z, h], i) => {
    const w = 5.8, d = 4.6
    // 房身
    solidBox(L, x, 0, z, w, h, d, wall)
    // 平缓屋顶:装饰四坡 + 顶面碰撞体(可踩)
    const roof = hipRoof(w + 1.2, d + 1.2, 0.9, 0.35, 0x5d6d7e)
    roof.material = roofMat
    roof.position.set(x, h + 0.45, z)
    roof.castShadow = true
    L.scene.add(roof)
    addCollider(L, x, h, z, w * 0.8, 0.9, d * 0.8)
    // 门
    const dr = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2, 0.15), door)
    dr.position.set(x, 1, z + d / 2 + 0.05)
    L.scene.add(dr)
    // 屋脊金币 + 跨缝金币
    addCoin(L, x, h + 1.8, z)
    if (i < homes.length - 1) {
      const [nx, nz, nh] = homes[i + 1]
      addCoin(L, (x + nx) / 2, Math.max(h, nh) + 2.2, (z + nz) / 2)
    }
  })
  addCheckpoint(L, '胡同屋脊', 0, homes[3][2] + 0.9, -70.5)

  // 两侧更多不可达的四合院,填街景
  for (let i = 0; i < 14; i++) {
    const side = i % 2 === 0 ? 1 : -1
    const x = side * (9 + rand() * 6)
    const z = -44 - rand() * 55
    const w = 5 + rand() * 3, d = 4 + rand() * 2, h = 2.6 + rand() * 1.6
    const g = new THREE.Group()
    const house = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wall)
    house.position.y = h / 2
    g.add(house)
    const roof = hipRoof(w + 1.2, d + 1.2, 1.1, 0.15, 0x5d6d7e)
    roof.material = roofMat
    roof.position.y = h + 0.55
    g.add(roof)
    g.position.set(x, 0, z)
    g.rotation.y = (rand() - 0.5) * 0.3
    g.traverse((o) => { if (o.isMesh) o.castShadow = true })
    L.scene.add(g)
  }
}

// ---------- 北海白塔(街景) ----------
function buildWhitePagoda(L) {
  const g = new THREE.Group()
  const white = toon(0xfafafa)
  const base = new THREE.Mesh(new THREE.CylinderGeometry(4, 5, 2.5, 12), white)
  base.position.y = 1.25
  g.add(base)
  const body = new THREE.Mesh(new THREE.SphereGeometry(3.6, 14, 12), white)
  body.scale.y = 1.15
  body.position.y = 6
  g.add(body)
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.6, 3.5, 10), white)
  neck.position.y = 10.5
  g.add(neck)
  const spire = new THREE.Mesh(new THREE.ConeGeometry(1.4, 4, 10), toon(0xd4ac0d))
  spire.position.y = 14
  g.add(spire)
  g.position.set(-15, 0, -72)
  g.traverse((o) => { if (o.isMesh) o.castShadow = true })
  L.scene.add(g)
}

// ---------- 灯笼桥(宫灯浮台,含移动平台) ----------
function buildLanternBridge(L) {
  const red = toon(0xe03131, { emissive: 0x5c0f00 })
  const gold = toon(0xd4ac0d)
  const steps = [
    // [x, y(台面), z, 是否移动]
    [0, 5.2, -100, false], [1.5, 6.2, -104.5, false], [-1.5, 7.0, -109, false],
    [0, 7.8, -113.5, true], [1.5, 8.6, -118, false], [-1.5, 9.4, -122.5, true],
    [0, 10.0, -127, false], [0, 10.5, -131.5, false],
  ]
  for (const [x, y, z, moving] of steps) {
    const g = new THREE.Group()
    // 宫灯:方灯身 + 金顶 + 流苏
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.6, 2.8), red)
    body.position.y = -1.0
    g.add(body)
    const cap = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.4, 3.2), gold)
    cap.position.y = -0.2 + 0.05
    g.add(cap)
    const tassel = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.16, 0.9, 6), gold)
    tassel.position.y = -2.3
    g.add(tassel)
    g.position.set(x, y, z)
    g.traverse((o) => { if (o.isMesh) o.castShadow = true })
    L.scene.add(g)
    const c = addCollider(L, x, y - 0.35, z, 3.2, 0.4, 3.2)
    if (moving) {
      L.movers.push({ c, mesh: g, cx: x, axis: 'x', amp: 3, speed: 0.9, phase: z, delta: new THREE.Vector3() })
    }
    addCoin(L, x, y + 1.2, z)
  }
}

// ---------- 天坛(三层圆台可攀爬) ----------
function buildTempleOfHeaven(L) {
  const cz = -150
  const white = toon(0xf5f1e8)
  // 三层汉白玉圆台:视觉圆柱 + 方形碰撞体(内接)
  for (const [r, top] of [[17, 1.5], [14, 3.0], [11, 4.5]]) {
    const tier = new THREE.Mesh(new THREE.CylinderGeometry(r, r + 0.8, 1.5, 24), white)
    tier.position.set(0, top - 0.75, cz)
    tier.castShadow = tier.receiveShadow = true
    L.scene.add(tier)
    const s = r * 1.6 // 方形碰撞体边长(略小于直径,减少角上悬空感)
    addCollider(L, 0, top - 1.5, cz, s, 1.5, s)
  }
  // 殿身 + 三重蓝琉璃檐(装饰,中间加挡块逼玩家绕行)
  const hall = new THREE.Mesh(new THREE.CylinderGeometry(6.5, 6.5, 4, 18), toon(0x8e2f2f))
  hall.position.set(0, 6.5, cz)
  hall.castShadow = true
  L.scene.add(hall)
  addCollider(L, 0, 4.5, cz, 11, 11, 11)
  const blue = 0x274b8f
  for (const [r, h, y] of [[9.5, 2.2, 9.2], [7.5, 2.2, 11.6], [5.5, 3.8, 14.6]]) {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(r, h, 18), toon(blue))
    cone.position.set(0, y, cz)
    cone.castShadow = true
    L.scene.add(cone)
    if (h < 3) {
      const band = new THREE.Mesh(new THREE.CylinderGeometry(r - 2.2, r - 2.2, 1.2, 18), toon(0x8e2f2f))
      band.position.set(0, y + h / 2 + 0.5, cz)
      L.scene.add(band)
    }
  }
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.8, 10, 8), toon(0xd4ac0d))
  tip.position.set(0, 17, cz)
  L.scene.add(tip)

  addCheckpoint(L, '天坛祈年殿', 0, 4.5, cz + 8.2)
  // 顶层环形一圈金币
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2
    addCoin(L, Math.cos(a) * 8, 5.6, cz + Math.sin(a) * 8)
  }
  // 下天坛后往 CBD 的过渡浮台
  const padMat = toon(0x9fb3c8)
  solidBox(L, 1.5, 5.3, -164, 3, 0.5, 3, padMat)
  solidBox(L, -1, 6.5, -167.5, 3, 0.5, 3, padMat)
  addCoin(L, 1.5, 7.1, -164)
  addCoin(L, -1, 8.3, -167.5)
}

// ---------- CBD 楼顶段 ----------
function buildCBD(L) {
  // 窗格贴图
  const c = document.createElement('canvas')
  c.width = 64
  c.height = 128
  const g = c.getContext('2d')
  g.fillStyle = '#ffffff'
  g.fillRect(0, 0, 64, 128)
  for (let y = 8; y < 118; y += 14) {
    for (let x = 8; x < 54; x += 13) {
      g.fillStyle = rand() < 0.3 ? '#ffe8a3' : '#3d4a5c'
      g.fillRect(x, y, 8, 9)
    }
  }
  g.strokeStyle = '#ffffff'
  g.lineWidth = 10
  g.strokeRect(0, 0, 64, 128)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  const winMat = toon(0xffffff, { map: tex })
  const roofMat = toon(0x8d99a6)
  const mats = [winMat, winMat, roofMat, roofMat, winMat, winMat]

  const towers = [
    // [x, z, 高]  逐栋升高,靠二段跳上台阶
    [0, -173, 8], [3, -181, 11], [-2, -189, 14],
    [2, -197, 17], [-3, -205, 19], [1, -213, 21], [0, -221, 23],
  ]
  towers.forEach(([x, z, h], i) => {
    const geo = new THREE.BoxGeometry(6, h, 6)
    const m = new THREE.Mesh(geo, mats)
    m.position.set(x, h / 2, z)
    m.castShadow = true
    L.scene.add(m)
    addCollider(L, x, 0, z, 6, h, 6)
    addCoin(L, x, h + 1.2, z)
    if (i === 4) addCheckpoint(L, 'CBD 楼顶', x, h, z)
  })
}

// ---------- 中国尊 + 央视大楼(街景) ----------
function buildCiticTower(L) {
  const g = new THREE.Group()
  const mat = toon(0x9fb3c8)
  const widths = [17, 14.5, 12.5, 11.5, 12, 13.5]
  let y = 0
  for (const w of widths) {
    const seg = new THREE.Mesh(new THREE.BoxGeometry(w, 13, w), mat)
    seg.position.y = y + 6.5
    g.add(seg)
    y += 13
  }
  const crown = new THREE.Mesh(new THREE.BoxGeometry(10, 3, 10), toon(0xd4ac0d))
  crown.position.y = y + 1.5
  g.add(crown)
  g.position.set(-34, 0, -210)
  g.scale.setScalar(0.7)
  g.traverse((o) => { if (o.isMesh) o.castShadow = true })
  L.scene.add(g)
}

function buildCCTV(L) {
  const g = new THREE.Group()
  const mat = toon(0x7f8fa6)
  const dark = toon(0x57606f)
  const base = new THREE.Mesh(new THREE.BoxGeometry(42, 6, 18), dark)
  base.position.y = 3
  g.add(base)
  const towerA = new THREE.Mesh(new THREE.BoxGeometry(11, 52, 13), mat)
  towerA.position.set(-14, 30, 0)
  towerA.rotation.z = 0.12
  g.add(towerA)
  const towerB = new THREE.Mesh(new THREE.BoxGeometry(11, 52, 13), mat)
  towerB.position.set(14, 30, 0)
  towerB.rotation.z = -0.12
  g.add(towerB)
  const top = new THREE.Mesh(new THREE.BoxGeometry(32, 10, 13), mat)
  top.position.set(0, 58, 0)
  g.add(top)
  const hang = new THREE.Mesh(new THREE.BoxGeometry(12, 16, 13), mat)
  hang.position.set(6, 45, 0)
  g.add(hang)
  g.position.set(38, 0, -192)
  g.rotation.y = 0.6
  g.scale.setScalar(0.7)
  g.traverse((o) => { if (o.isMesh) o.castShadow = true })
  L.scene.add(g)
}

// ---------- 云朵下降段 ----------
function buildCloudSteps(L) {
  const cloudMat = toon(0xffffff)
  const pads = [
    [0, 20, -228], [2, 17, -234], [-2, 14, -240], [0, 12, -245.5],
  ]
  for (const [x, y, z] of pads) {
    const g = new THREE.Group()
    const geo = new THREE.SphereGeometry(1, 10, 8)
    for (const [dx, dz, r] of [[-1.1, 0, 1.15], [0.2, 0.3, 1.45], [1.3, -0.2, 1.0]]) {
      const b = new THREE.Mesh(geo, cloudMat)
      b.scale.set(r, r * 0.55, r * 0.85)
      b.position.set(dx, -0.4, dz)
      b.castShadow = true
      g.add(b)
    }
    g.position.set(x, y, z)
    L.scene.add(g)
    addCollider(L, x, y - 0.45, z, 3.4, 0.45, 2.6)
    addCoin(L, x, y + 1.1, z)
  }
}

// ---------- 水立方(屋顶可走) ----------
function buildWaterCube(L) {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g2 = c.getContext('2d')
  g2.fillStyle = '#74c0fc'
  g2.fillRect(0, 0, 128, 128)
  g2.strokeStyle = 'rgba(255,255,255,0.65)'
  g2.lineWidth = 2
  for (let i = 0; i < 26; i++) {
    g2.beginPath()
    g2.arc(rand() * 128, rand() * 128, 6 + rand() * 12, 0, Math.PI * 2)
    g2.stroke()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(26, 11, 26),
    toon(0x9bd4ff, { map: tex, transparent: true, opacity: 0.92 })
  )
  cube.position.set(0, 5.5, -262)
  cube.castShadow = true
  L.scene.add(cube)
  addCollider(L, 0, 0, -262, 26, 11, 26)
  addCheckpoint(L, '水立方', 0, 11, -262)
  for (let i = -2; i <= 2; i++) addCoin(L, i * 2.2, 12.2, -262 - Math.abs(i))
  // 通往鸟巢的两朵云(要高过鸟巢钢环,再俯冲进碗里)
  const cloudMat = toon(0xffffff)
  for (const [x, y, z] of [[1.5, 12, -280], [0, 12.8, -288]]) {
    const g = new THREE.Group()
    const geo = new THREE.SphereGeometry(1, 10, 8)
    for (const [dx, dz, r] of [[-1.0, 0, 1.1], [0.3, 0.2, 1.4], [1.3, -0.1, 0.95]]) {
      const b = new THREE.Mesh(geo, cloudMat)
      b.scale.set(r, r * 0.55, r * 0.85)
      b.position.set(dx, -0.4, dz)
      b.castShadow = true
      g.add(b)
    }
    g.position.set(x, y, z)
    L.scene.add(g)
    addCollider(L, x, y - 0.45, z, 3.2, 0.45, 2.5)
    addCoin(L, x, y + 1.1, z)
  }
}

// ---------- 鸟巢(终点) ----------
function buildBirdsNest(L) {
  const cz = -305
  const g = new THREE.Group()
  const ringMat = toon(0xaab4bd)
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(24, 5.5, 10, 28), ringMat)
  ring1.rotation.x = Math.PI / 2
  ring1.scale.set(1, 1.25, 1)
  ring1.position.y = 7
  g.add(ring1)
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(19, 3, 8, 24), ringMat)
  ring2.rotation.x = Math.PI / 2
  ring2.position.y = 11.5
  g.add(ring2)
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(15, 17, 7, 24), toon(0xc0392b))
  bowl.position.y = 4
  g.add(bowl)
  g.position.set(0, 0, cz)
  g.scale.y = 0.8
  g.traverse((o) => { if (o.isMesh) o.castShadow = true })
  L.scene.add(g)
  // 碗顶可站(顶面 y = (4+3.5)*0.8 = 6)
  addCollider(L, 0, 0, cz, 24, 6, 24)

  // 终点旗:金色旗杆 + 五星红旗
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 6, 8), toon(0xd4ac0d))
  pole.position.set(0, 9, cz)
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.7), new THREE.MeshBasicMaterial({ color: 0xe03131, side: THREE.DoubleSide }))
  flag.position.set(1.4, 11.2, cz)
  L.scene.add(pole, flag)
  // 终点光柱
  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(2.2, 2.2, 30, 18, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xffd54a, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false })
  )
  beam.position.set(0, 21, cz)
  L.scene.add(beam)
  // 碗顶一圈金币
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    addCoin(L, Math.cos(a) * 6, 7.2, cz + Math.sin(a) * 6)
  }
  return { pos: new THREE.Vector3(0, 6, cz), radius: 3.5, flag }
}

// ---------- 背景楼群 + 剪纸树 ----------
function buildBackdrop(L) {
  const c = document.createElement('canvas')
  c.width = 64
  c.height = 128
  const g = c.getContext('2d')
  g.fillStyle = '#ffffff'
  g.fillRect(0, 0, 64, 128)
  for (let y = 8; y < 118; y += 14) {
    for (let x = 8; x < 54; x += 13) {
      g.fillStyle = rand() < 0.3 ? '#ffe8a3' : '#3d4a5c'
      g.fillRect(x, y, 8, 9)
    }
  }
  g.strokeStyle = '#ffffff'
  g.lineWidth = 10
  g.strokeRect(0, 0, 64, 128)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  const winMat = toon(0xffffff, { map: tex })
  const roofMat = toon(0x8d99a6)
  const geo = new THREE.BoxGeometry(1, 1, 1)
  const mats = [winMat, winMat, roofMat, roofMat, winMat, winMat]

  const spots = []
  let tries = 0
  while (spots.length < 60 && tries++ < 6000) {
    const x = (rand() - 0.5) * 560
    const z = -140 + (rand() - 0.5) * 560
    if (Math.abs(x) < 42 && z > -340 && z < 50) continue // 让开跑酷走廊
    spots.push([x, z])
  }
  const inst = new THREE.InstancedMesh(geo, mats, spots.length)
  inst.castShadow = true
  const cols = [new THREE.Color(0xf2e9dc), new THREE.Color(0xdde3ea), new THREE.Color(0xe8d3c3), new THREE.Color(0xcfe0d8), new THREE.Color(0xf5f5f5)]
  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  spots.forEach(([x, z], i) => {
    const w = 9 + rand() * 10
    const h = 10 + rand() * 24
    const d = 9 + rand() * 10
    m.compose(new THREE.Vector3(x, h / 2, z), q, new THREE.Vector3(w, h, d))
    inst.setMatrixAt(i, m)
    inst.setColorAt(i, cols[i % cols.length])
  })
  L.scene.add(inst)

  // 走廊两侧的剪纸树
  const texs = treeTextures()
  for (let i = 0; i < 24; i++) {
    const side = i % 2 === 0 ? 1 : -1
    const x = side * (14 + rand() * 22)
    const z = 30 - rand() * 330
    const tree = paperTreeGroup(texs[Math.floor(rand() * texs.length)], 0.8 + rand() * 0.7)
    tree.position.set(x, 0, z)
    L.scene.add(tree)
    L.props.push(tree)
  }
}

// ---------- 入口 ----------
export function buildLevel(scene) {
  const L = ctx(scene)
  buildPavement(L)
  addCheckpoint(L, '天安门广场', 0, 0, 14)
  buildTiananmen(L)
  buildHutong(L)
  buildWhitePagoda(L)
  buildLanternBridge(L)
  buildTempleOfHeaven(L)
  buildCBD(L)
  buildCiticTower(L)
  buildCCTV(L)
  buildCloudSteps(L)
  buildWaterCube(L)
  const goal = buildBirdsNest(L)
  buildBackdrop(L)
  buildPaperMountains(scene)
  buildPaperSun(scene)
  const clouds = buildPaperClouds(scene)

  return {
    colliders: L.colliders,
    coins: L.coins,
    checkpoints: L.checkpoints,
    movers: L.movers,
    props: L.props,
    clouds,
    goal,
    startZ: 14,
    endZ: -305,
    safeGroundZ: -28, // 此线以北落地(y≈0)判失败,回检查点
  }
}

export function updateMovers(movers, t) {
  for (const mv of movers) {
    const off = Math.sin(t * mv.speed + mv.phase) * mv.amp
    const cur = mv.c.min.x + (mv.c.max.x - mv.c.min.x) / 2
    const nx = mv.cx + off
    const dx = nx - cur
    mv.c.min.x += dx
    mv.c.max.x += dx
    mv.mesh.position.x = nx
    mv.delta.set(dx, 0, 0)
  }
}
