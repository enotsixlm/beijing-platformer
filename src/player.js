import * as THREE from 'three'
import { toon } from './toon.js'

// ---------- 熊猫主角 ----------
export function createPandaMesh() {
  const g = new THREE.Group()
  const white = toon(0xf7f4ee)
  const black = toon(0x2b2b2e)

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.42, 14, 12), white)
  body.scale.set(1, 1.1, 0.9)
  body.position.y = 0.55
  g.add(body)

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 14, 12), white)
  head.position.y = 1.18
  g.add(head)

  // 耳朵
  for (const s of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), black)
    ear.position.set(0.22 * s, 1.46, 0)
    g.add(ear)
  }
  // 眼圈(朝 -Z 前方)
  for (const s of [-1, 1]) {
    const patch = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), black)
    patch.scale.set(1, 1.3, 0.55)
    patch.position.set(0.13 * s, 1.22, -0.28)
    g.add(patch)
  }
  // 鼻子
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), black)
  nose.position.set(0, 1.1, -0.33)
  g.add(nose)
  // 四肢
  const limbGeo = new THREE.SphereGeometry(0.13, 8, 8)
  const arms = []
  for (const s of [-1, 1]) {
    const arm = new THREE.Mesh(limbGeo, black)
    arm.position.set(0.38 * s, 0.72, 0)
    g.add(arm)
    arms.push(arm)
    const leg = new THREE.Mesh(limbGeo, black)
    leg.scale.set(1.1, 1.25, 1.1)
    leg.position.set(0.2 * s, 0.14, 0)
    g.add(leg)
  }
  // 红围巾,一点北京红
  const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.07, 8, 14), toon(0xe03131))
  scarf.rotation.x = Math.PI / 2
  scarf.position.y = 0.95
  g.add(scarf)

  g.traverse((o) => { if (o.isMesh) o.castShadow = true })
  return { group: g, arms }
}

// ---------- 平台跳跃物理 ----------
export const P = {
  runSpeed: 8,
  gravity: 26,
  jumpV: 10.4,
  doubleJumpV: 9.6,
  coyote: 0.12,
  jumpBuffer: 0.14,
  halfW: 0.32,   // 碰撞盒半宽
  height: 1.5,   // 碰撞盒高
}

export function createPlayerState(x, y, z) {
  return {
    pos: new THREE.Vector3(x, y, z),
    vx: 0, vy: 0, vz: 0,
    heading: Math.PI, // 朝 -Z
    grounded: true,
    groundC: null,     // 脚下的碰撞体(用于移动平台载运)
    sinceGround: 0,
    jumpBufferT: 0,
    canDouble: true,
    justJumped: false, // 本帧起跳(拉伸动画用)
    justLanded: false, // 本帧落地(压扁动画用)
  }
}

// input: { x, z, jumpPressed } x/z 为相机系归一化移动向量(世界系)
export function stepPlayer(p, input, dt, colliders) {
  // ---- 水平速度 ----
  const tx = input.x * P.runSpeed
  const tz = input.z * P.runSpeed
  if (p.grounded) {
    p.vx = tx
    p.vz = tz
  } else {
    const k = 1 - Math.exp(-5 * dt)
    p.vx += (tx - p.vx) * k
    p.vz += (tz - p.vz) * k
  }
  if (input.x || input.z) p.heading = Math.atan2(input.x, input.z)

  // ---- 跳跃(缓冲 + 土狼时间 + 二段跳) ----
  p.justJumped = false
  if (input.jumpPressed) p.jumpBufferT = P.jumpBuffer
  else p.jumpBufferT -= dt
  p.sinceGround = p.grounded ? 0 : p.sinceGround + dt

  if (p.jumpBufferT > 0) {
    if (p.grounded || p.sinceGround < P.coyote) {
      p.vy = P.jumpV
      p.grounded = false
      p.sinceGround = P.coyote
      p.jumpBufferT = 0
      p.canDouble = true
      p.justJumped = true
    } else if (p.canDouble) {
      p.vy = P.doubleJumpV
      p.canDouble = false
      p.jumpBufferT = 0
      p.justJumped = true
    }
  }

  // ---- 重力 + 积分 ----
  p.vy -= P.gravity * dt
  if (p.vy < -30) p.vy = -30
  p.pos.x += p.vx * dt
  p.pos.y += p.vy * dt
  p.pos.z += p.vz * dt

  const wasGrounded = p.grounded
  p.grounded = false
  p.groundC = null

  // ---- 全局地面 y=0 ----
  if (p.pos.y < 0) {
    p.pos.y = 0
    if (p.vy < 0) p.vy = 0
    p.grounded = true
  }

  // ---- AABB 碰撞(两轮消除穿插) ----
  for (let pass = 0; pass < 2; pass++) {
    for (const c of colliders) {
      const pxMin = p.pos.x - P.halfW, pxMax = p.pos.x + P.halfW
      const pyMin = p.pos.y, pyMax = p.pos.y + P.height
      const pzMin = p.pos.z - P.halfW, pzMax = p.pos.z + P.halfW
      if (pxMax <= c.min.x || pxMin >= c.max.x) continue
      if (pyMax <= c.min.y || pyMin >= c.max.y) continue
      if (pzMax <= c.min.z || pzMin >= c.max.z) continue
      // 各轴最小推出量
      const pushX = pxMax - c.min.x < c.max.x - pxMin ? c.min.x - pxMax : c.max.x - pxMin
      const pushY = pyMax - c.min.y < c.max.y - pyMin ? c.min.y - pyMax : c.max.y - pyMin
      const pushZ = pzMax - c.min.z < c.max.z - pzMin ? c.min.z - pzMax : c.max.z - pzMin
      const ax = Math.abs(pushX), ay = Math.abs(pushY), az = Math.abs(pushZ)
      if (ay <= ax && ay <= az) {
        p.pos.y += pushY
        if (pushY > 0 && p.vy <= 0) { p.grounded = true; p.groundC = c; p.vy = 0 }
        else if (pushY < 0 && p.vy > 0) p.vy = 0
      } else if (ax <= az) {
        p.pos.x += pushX
        p.vx = 0
      } else {
        p.pos.z += pushZ
        p.vz = 0
      }
    }
  }

  if (p.grounded) p.canDouble = true
  p.justLanded = p.grounded && !wasGrounded
}

// ---------- 网格同步(含挤压拉伸小动画) ----------
export function syncPandaMesh(p, mesh, now) {
  const g = mesh.group
  g.position.copy(p.pos)
  g.rotation.y = p.heading + Math.PI // 模型脸朝 -Z,heading 是运动方向

  // 跳跃拉伸 / 落地压扁
  if (p.justJumped) g.userData.squash = { t: 0, mode: 1 }
  if (p.justLanded) g.userData.squash = { t: 0, mode: -1 }
  const s = g.userData.squash
  if (s) {
    s.t += 1 / 60
    const k = Math.max(0, 1 - s.t / 0.22)
    const amt = 0.18 * k * s.mode
    g.scale.set(1 - amt * 0.6, 1 + amt, 1 - amt * 0.6)
    if (k <= 0) { g.userData.squash = null; g.scale.set(1, 1, 1) }
  }
  // 跑步摆臂
  const speed = Math.hypot(p.vx, p.vz)
  if (p.grounded && speed > 1) {
    const sw = Math.sin(now * 0.018) * 0.25
    mesh.arms[0].position.z = sw
    mesh.arms[1].position.z = -sw
  } else {
    mesh.arms[0].position.z = 0
    mesh.arms[1].position.z = 0
  }
}
