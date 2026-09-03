import { angleDelta } from './track.js'

// 简单的路点追随 AI:朝赛道前方一定弧长外的采样点转向,
// 并根据转向幅度控制油门/刹车/漂移,营造有起伏感的赛道 AI。
export function createAiDriver(personality = {}) {
  return {
    aggression: personality.aggression ?? 0.9 + Math.random() * 0.2,
    lookAhead: personality.lookAhead ?? 16 + Math.random() * 6,
    noisePhase: Math.random() * Math.PI * 2,
  }
}

export function aiInput(car, track, driver, now) {
  const n = track.samples.length
  const wobble = Math.sin(now * 0.0006 + driver.noisePhase) * 2.5
  const lookAheadDist = driver.lookAhead + Math.min(20, Math.abs(car.speed) * 0.55) + wobble
  const steps = Math.max(1, Math.round(lookAheadDist / track.avgSpacing))
  const targetIdx = (car.trackIndex + steps) % n
  const target = track.samples[targetIdx].p

  const desiredHeading = Math.atan2(target.x - car.pos.x, target.z - car.pos.z)
  const err = angleDelta(car.heading, desiredHeading)

  const steer = Math.max(-1, Math.min(1, err * 1.6))
  const sharp = Math.abs(err)
  let throttle = driver.aggression
  if (sharp > 0.75) throttle = 0.15
  else if (sharp > 0.4) throttle = 0.55 * driver.aggression
  if (car.onTrack === false) throttle = Math.min(throttle, 0.6)

  const handbrake = sharp > 1.05 && car.speed > 14

  return { throttle, steer, handbrake }
}
