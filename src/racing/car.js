import * as THREE from 'three'
import { toon } from '../toon.js'
import { sampleTrack, angleDelta } from './track.js'

export const CAR = {
  maxSpeed: 42,        // 正常路面最高速度(单位/秒)
  maxReverse: 11,
  accel: 24,
  brakeDecel: 38,
  reverseAccel: 15,
  rollingDrag: 5,
  offTrackMaxSpeedMul: 0.45,
  offTrackDragMul: 2.4,
  turnRate: 2.5,        // 满舵转向角速度(rad/s)基准值
  driftTurnBoost: 1.55,
  lateralGrip: 7.5,     // 正常抓地力(侧滑衰减速率)
  driftGrip: 1.4,       // 漂移时抓地力(衰减更慢)
  driftSlipGain: 20,
  maxLateral: 15,
  bodyRadius: 1.5,      // 车间碰撞半径
}

// ---------- 程序化低多边形赛车模型 ----------
export function createCarMesh(bodyColor, accentColor = 0x222227) {
  const g = new THREE.Group()
  const body = toon(bodyColor)
  const accent = toon(accentColor)
  const glass = toon(0x9fd0e6, { transparent: true, opacity: 0.85 })
  const tireMat = toon(0x24242a)
  const rimMat = toon(0xd8d8dc)

  const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.5, 3.6), body)
  chassis.position.y = 0.42
  g.add(chassis)

  const nose = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 0.9), body)
  nose.position.set(0, 0.34, -1.9)
  g.add(nose)

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.5, 1.7), body)
  cabin.position.set(0, 0.86, 0.1)
  g.add(cabin)

  const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.42, 1.5), glass)
  windshield.position.set(0, 0.86, 0.12)
  windshield.scale.set(0.94, 0.9, 0.94)
  g.add(windshield)

  const spoiler = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.12, 0.4), accent)
  spoiler.position.set(0, 0.85, 1.75)
  g.add(spoiler)
  for (const s of [-1, 1]) {
    const strut = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.1), accent)
    strut.position.set(0.65 * s, 0.62, 1.75)
    g.add(strut)
  }

  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.02, 3.6), accent)
  stripe.position.set(0, 0.68, 0)
  g.add(stripe)

  // 车灯
  for (const s of [-1, 1]) {
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.16, 0.1), toon(0xfff6d8, { emissive: 0x8a7d3a }))
    head.position.set(0.62 * s, 0.42, -2.32)
    g.add(head)
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.18, 0.1), toon(0xe03131, { emissive: 0x500a0a }))
    tail.position.set(0.6 * s, 0.5, 1.82)
    g.add(tail)
  }

  // 车轮(前轮带转向轴)
  const wheelGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.32, 14)
  const rimGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.34, 8)
  function makeWheel() {
    const p = new THREE.Group()
    const tire = new THREE.Mesh(wheelGeo, tireMat)
    tire.rotation.z = Math.PI / 2
    tire.castShadow = true
    p.add(tire)
    const rim = new THREE.Mesh(rimGeo, rimMat)
    rim.rotation.z = Math.PI / 2
    p.add(rim)
    return { pivot: p, spin: tire }
  }

  const wheelPositions = {
    fl: [-1.02, 0.42, -1.35], fr: [1.02, 0.42, -1.35],
    rl: [-1.02, 0.42, 1.3], rr: [1.02, 0.42, 1.3],
  }
  const wheels = {}
  for (const key of Object.keys(wheelPositions)) {
    const [x, y, z] = wheelPositions[key]
    const steerPivot = new THREE.Group()
    steerPivot.position.set(x, y, z)
    const w = makeWheel()
    steerPivot.add(w.pivot)
    g.add(steerPivot)
    wheels[key] = { steerPivot, spin: w.spin }
  }

  g.traverse((o) => { if (o.isMesh) o.castShadow = true })
  return { group: g, wheels }
}

export function createCarState(x, z, heading) {
  return {
    pos: new THREE.Vector3(x, heightPlaceholder(), z),
    heading,
    speed: 0,
    lateralVel: 0,
    steerVisual: 0,
    onTrack: true,
    trackIndex: 0,
    trackFrac: 0,
    trackS: 0,
    lap: 0,
    lapStartTime: 0,
    bestLap: null,
    lastLapTime: null,
    visitedMid: false,
    finished: false,
    finishTime: null,
    finishRank: null,
    speedMul: 1, // 用于 AI 的橡皮筋修正
    justCrossedLine: false,
    driftFx: 0, // 漂移强度(0..1),供拖痕/粒子使用
  }
}
function heightPlaceholder() { return 0 }

export function stepCar(car, input, dt, track, totalLaps) {
  const info = sampleTrack(track, car.pos.x, car.pos.z)
  car.onTrack = info.onTrack

  const offMul = car.onTrack ? 1 : CAR.offTrackDragMul
  const maxFwd = CAR.maxSpeed * (car.onTrack ? 1 : CAR.offTrackMaxSpeedMul) * car.speedMul

  const throttle = input.throttle
  if (throttle > 0.02) {
    car.speed += CAR.accel * throttle * dt
  } else if (throttle < -0.02) {
    if (car.speed > 0.4) car.speed -= CAR.brakeDecel * -throttle * dt
    else car.speed -= CAR.reverseAccel * -throttle * dt
  } else {
    const dragDir = Math.sign(car.speed)
    car.speed -= dragDir * CAR.rollingDrag * offMul * dt
    if (Math.sign(car.speed) !== dragDir) car.speed = 0
  }
  if (car.onTrack === false) car.speed -= Math.sign(car.speed) * CAR.rollingDrag * 0.6 * dt
  car.speed = THREE.MathUtils.clamp(car.speed, -CAR.maxReverse, maxFwd)

  const speedFrac = THREE.MathUtils.clamp(Math.abs(car.speed) / 7, 0, 1)
  const dirSign = car.speed < -0.05 ? -1 : 1
  const drifting = input.handbrake && Math.abs(car.speed) > 3
  const turnMul = drifting ? CAR.driftTurnBoost : 1
  const turnRate = CAR.turnRate * input.steer * dirSign * speedFrac * turnMul
  car.heading += turnRate * dt

  if (drifting) {
    car.lateralVel += input.steer * CAR.driftSlipGain * dt
    car.lateralVel = THREE.MathUtils.clamp(car.lateralVel, -CAR.maxLateral, CAR.maxLateral)
    car.driftFx = Math.min(1, car.driftFx + dt * 3)
  } else {
    const grip = CAR.lateralGrip
    car.lateralVel -= car.lateralVel * Math.min(1, grip * dt)
    car.driftFx = Math.max(0, car.driftFx - dt * 2)
  }

  const fx = Math.sin(car.heading), fz = Math.cos(car.heading)
  const rx = Math.cos(car.heading), rz = -Math.sin(car.heading)
  car.pos.x += (fx * car.speed + rx * car.lateralVel) * dt
  car.pos.z += (fz * car.speed + rz * car.lateralVel) * dt

  const info2 = sampleTrack(track, car.pos.x, car.pos.z)
  car.trackIndex = info2.index
  const prevFrac = car.trackFrac
  car.trackFrac = info2.frac
  car.trackS = info2.s
  car.onTrack = info2.onTrack
  const targetY = info2.point.y + 0.02
  car.pos.y += (targetY - car.pos.y) * Math.min(1, 10 * dt)

  if (car.trackFrac > 0.4 && car.trackFrac < 0.6) car.visitedMid = true

  car.justCrossedLine = false
  if (!car.finished && prevFrac > 0.75 && car.trackFrac < 0.25 && car.visitedMid) {
    car.lap += 1
    car.visitedMid = false
    car.justCrossedLine = true
    if (car.lapStartTime) {
      const lapTime = performance.now() - car.lapStartTime
      car.lastLapTime = lapTime
      if (car.bestLap === null || lapTime < car.bestLap) car.bestLap = lapTime
    }
    car.lapStartTime = performance.now()
    if (car.lap >= totalLaps) {
      car.finished = true
      car.finishTime = performance.now()
    }
  } else if (prevFrac < 0.25 && car.trackFrac > 0.75) {
    // 倒退穿过终点线:清除本圈中点标记,防止取巧
    car.visitedMid = false
  }

  car.distance = car.lap * track.length + car.trackS
}

export function syncCarMesh(car, mesh, dt) {
  const g = mesh.group
  g.position.copy(car.pos)
  g.rotation.y = car.heading

  const targetSteer = THREE.MathUtils.clamp(car.lateralVel / 8, -0.5, 0.5)
  car.steerVisual += (targetSteer - car.steerVisual) * Math.min(1, 10 * dt)
  mesh.wheels.fl.steerPivot.rotation.y = car.steerVisual
  mesh.wheels.fr.steerPivot.rotation.y = car.steerVisual

  // 车身随速度略微俯仰/侧倾,增加动感
  g.rotation.z = THREE.MathUtils.clamp(-car.lateralVel * 0.015, -0.22, 0.22)
  g.rotation.x = THREE.MathUtils.clamp(-car.speed * 0.003, -0.06, 0.06)

  const wheelSpin = (car.speed * dt) / 0.42
  for (const key of Object.keys(mesh.wheels)) {
    mesh.wheels[key].spin.rotation.x += wheelSpin
  }
}

export { angleDelta }
