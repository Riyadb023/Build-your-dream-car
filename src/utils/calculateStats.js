import { getCar } from '../data/cars.js'
import { getEngine } from '../data/engines.js'
import { getOption } from '../data/categories.js'
import { clamp, mapRange } from './format.js'

/**
 * THE CALCULATION ENGINE
 * ======================
 * One pure function: build (ids) -> every number the UI shows.
 *
 * Nothing in here knows React exists. No component knows what's in here.
 * That separation is the whole point - you can unit-test this file with plain
 * node (see scripts/checkStats.mjs) and you can redesign the UI without
 * touching a single formula.
 *
 * The physics is real where real is cheap:
 *   - 0-100 comes from kinetic energy vs delivered power
 *   - top speed comes from the actual drag equation
 *   - everything else is a tuned game score
 *
 * Constants were calibrated against the real published figures for all ten
 * stock cars. Run `npm run test:stats` to see the error table.
 */


const AIR_DENSITY = 1.225 
const GRAVITY = 9.81
const ROLLING_RESISTANCE = 0.012
const WATTS_PER_HP = 745.7
const KMH_100_IN_MS = 100 / 3.6 


const K_BASE = 0.555 
const SHIFTS_TO_100 = 2 

/**
 * Resolve every id in the build into its full data object.
 * Returns null for `car` if the build has no car selected yet.
 */
export function resolveBuild(build) {
  const car = getCar(build.car)
  return {
    car,
    engine: getEngine(build.engine),
    stockEngine: car ? getEngine(car.stockEngine) : null,
    tune: getOption('tune', build.tune),
    transmission: getOption('transmission', build.transmission),
    drivetrain: getOption('drivetrain', build.drivetrain),
    wheels: getOption('wheels', build.wheels),
    tires: getOption('tires', build.tires),
    suspension: getOption('suspension', build.suspension),
    brakes: getOption('brakes', build.brakes),
    exhaust: getOption('exhaust', build.exhaust),
    aero: getOption('aero', build.aero),
    interior: getOption('interior', build.interior),
    color: getOption('color', build.color),
  }
}

/** Every stat, for an empty/invalid build. Keeps the UI from crashing. */
export const EMPTY_STATS = {
  valid: false,
  power: 0,
  torque: 0,
  weight: 0,
  powerToWeight: 0,
  powerPerTonne: 0,
  acceleration: null,
  topSpeed: 0,
  braking: null,
  handling: 0,
  grip: 0,
  comfort: 0,
  reliability: 0,
  sound: 0,
  drag: 0,
  downforce: 0,
  price: 0,
  scores: { power: 0, handling: 0, acceleration: 0, topSpeed: 0, comfort: 0, style: 0 },
  rating: 0,
  tractionLimited: false,
  streetLegal: true,
}

/**
 * MAIN ENTRY POINT.
 * @param {object} build - { car, engine, tune, ... } ids only
 * @returns {object} every derived number, ready to render
 */
export function calculateStats(build) {
  const p = resolveBuild(build)
  if (!p.car) return { ...EMPTY_STATS }

  const { car } = p


  
  const engine = p.engine ?? p.stockEngine
  if (!engine) return { ...EMPTY_STATS }

  const aspiration = engine.aspiration ?? 'na'
  const tuneGain = p.tune?.gain?.[aspiration] ?? 1
  const exhaustGain = p.exhaust?.powerGain ?? 1

  const power = Math.round(engine.power * tuneGain * exhaustGain)
  const torque = Math.round(engine.torque * (p.tune?.torqueGain ?? 1) * exhaustGain)

  
  

  const engineDelta = p.engine && p.stockEngine ? p.engine.weight - p.stockEngine.weight : 0

  
  const drivetrainChanged = p.drivetrain && p.drivetrain.id !== car.drivetrain
  const baseDrivetrainWeight = getOption('drivetrain', car.drivetrain)?.weight ?? 0
  const drivetrainDelta = drivetrainChanged
    ? (p.drivetrain?.weight ?? 0) - baseDrivetrainWeight
    : 0

  const partWeights =
    (p.transmission?.weight ?? 0) +
    (p.wheels?.weight ?? 0) +
    (p.tires?.weight ?? 0) +
    (p.suspension?.weight ?? 0) +
    (p.brakes?.weight ?? 0) +
    (p.exhaust?.weight ?? 0) +
    (p.aero?.weight ?? 0) +
    (p.interior?.weight ?? 0) +
    (p.tune?.weight ?? 0)

  const weight = Math.max(600, Math.round(car.weight + engineDelta + drivetrainDelta + partWeights))

  
  
  const grip = clamp(
    1.5 +
      car.chassis.grip * 0.6 +
      (p.tires?.grip ?? 0) * 1.1 +
      (p.wheels?.grip ?? 0) * 0.5 +
      (p.suspension?.grip ?? 0) * 0.6,
    0.5,
    10,
  )

  
  
  
  

  const drivetrain = p.drivetrain ?? getOption('drivetrain', car.drivetrain)
  const transmission = p.transmission ?? getOption('transmission', car.stockTransmission)

  const kineticEnergy = 0.5 * weight * KMH_100_IN_MS ** 2
  const powerWatts = power * WATTS_PER_HP

  
  const tractionIndex = (drivetrain?.launch ?? 0.8) * (0.72 + 0.056 * grip)
  
  const demand = power / weight 
  const tractionBalance = tractionIndex * 0.3 - demand

  
  
  
  
  const tractionFactor = clamp(
    1 + tractionBalance * (tractionBalance < 0 ? 1.5 : 0.3),
    0.55,
    1.08,
  )

  
  
  
  const powerbandFactor = mapRange((power / weight) * 1000, 120, 320, 0.92, 1.08)

  const kEff = K_BASE * tractionFactor * powerbandFactor

  const shiftLoss = SHIFTS_TO_100 * (transmission?.shiftTime ?? 0.4)
  const acceleration = kineticEnergy / (kEff * powerWatts) + shiftLoss

  const tractionLimited = tractionBalance < -0.02

  
  
  
  
  
  
  const cd = car.drag + (p.aero?.dragDelta ?? 0)
  const cdA = cd * car.frontalArea
  const wheelPower = powerWatts * (1 - (transmission?.driveLoss ?? 0.15))
  const rollingForce = ROLLING_RESISTANCE * weight * GRAVITY

  let v = 60 
  for (let i = 0; i < 40; i += 1) {
    const available = wheelPower - rollingForce * v
    if (available <= 0) {
      v = Math.max(10, v * 0.7)
      continue
    }
    v = Math.cbrt((2 * available) / (AIR_DENSITY * cdA))
  }
  const aeroLimitedSpeed = v * 3.6

  
  const gearCap = 165 + (transmission?.gears ?? 6) * 22 + (power / weight) * 165

  
  
  
  const limiterActive = (!p.tune || p.tune.id === 'stock') && car.speedLimiter != null
  const rawTopSpeed = Math.min(aeroLimitedSpeed, gearCap)
  const topSpeed = Math.round(
    limiterActive ? Math.min(rawTopSpeed, car.speedLimiter) : rawTopSpeed,
  )

  
  
  
  const brakingG = clamp(
    0.72 + grip * 0.055 + (p.brakes?.stoppingPower ?? 0) * 0.035 - (weight - 1400) / 14000,
    0.6,
    1.55,
  )
  const braking = KMH_100_IN_MS ** 2 / (2 * brakingG * GRAVITY)

  
  
  
  const downforce = p.aero?.downforce ?? 0
  const weightPenalty = (weight - 1350) / 240
  const handling = clamp(
    1.9 +
      car.chassis.handling * 0.52 +
      (p.suspension?.handling ?? 0) * 0.85 +
      (grip - 5) * 0.46 +
      (p.brakes?.handling ?? 0) * 0.6 +
      (p.wheels?.handling ?? 0) * 0.55 +
      (drivetrain?.handling ?? 0) +
      downforce * 0.22 -
      weightPenalty,
    0.5,
    10,
  )

  
  
  
  const comfort = clamp(
    car.chassis.comfort +
      (p.interior?.comfort ?? 0) +
      (p.suspension?.comfort ?? 0) +
      (p.exhaust?.comfort ?? 0) +
      (p.tires?.comfort ?? 0) +
      (transmission?.comfort ?? 0),
    0.2,
    10,
  )

  
  
  
  
  
  const powerRatio = power / Math.max(80, engine.power)
  const stress = (p.tune?.boostStress ?? 0) * Math.max(0, powerRatio - 1) * 42

  const reliability = clamp(
    car.reliability +
      (engine.reliability ?? 0) +
      (p.tune?.reliability ?? 0) +
      (p.transmission?.reliability ?? 0) +
      (p.suspension?.reliability ?? 0) +
      (p.exhaust?.reliability ?? 0) +
      (p.interior?.reliability ?? 0) +
      (drivetrainChanged ? -8 : 0) +
      (drivetrain?.reliability ?? 0) -
      stress,
    3,
    99,
  )

  
  
  
  const sound = clamp((engine.sound ?? 5) + (p.exhaust?.sound ?? 0), 1, 10)

  const styleScore = clamp(
    car.chassis.style * 0.5 +
      (p.wheels?.style ?? 0) * 0.62 +
      (p.aero?.style ?? 0) * 0.55 +
      (p.interior?.style ?? 0) * 0.4 +
      (p.color?.style ?? 0) * 0.55 +
      (p.suspension?.rideHeight ?? 0) / -55 +
      sound * 0.16,
    0.5,
    10,
  )

  
  
  
  const price =
    car.price +
    (p.engine?.price ?? 0) +
    (p.tune?.price ?? 0) +
    (p.transmission?.price ?? 0) +
    (drivetrainChanged ? (p.drivetrain?.swapCost ?? 0) : 0) +
    (p.wheels?.price ?? 0) +
    (p.tires?.price ?? 0) +
    (p.suspension?.price ?? 0) +
    (p.brakes?.price ?? 0) +
    (p.exhaust?.price ?? 0) +
    (p.aero?.price ?? 0) +
    (p.interior?.price ?? 0) +
    (p.color?.price ?? 0)

  
  
  
  const powerPerTonne = (power / weight) * 1000
  const scores = {
    power: Math.round(mapRange(powerPerTonne, 90, 480, 5, 100)),
    acceleration: Math.round(mapRange(acceleration, 9.5, 2.6, 5, 100)),
    topSpeed: Math.round(mapRange(topSpeed, 170, 330, 5, 100)),
    handling: Math.round(handling * 10),
    comfort: Math.round(comfort * 10),
    style: Math.round(styleScore * 10),
    grip: Math.round(grip * 10),
    reliability: Math.round(reliability),
    braking: Math.round(mapRange(braking, 48, 28, 5, 100)),
  }

  return {
    valid: true,
    power,
    torque,
    weight,
    powerToWeight: power / weight,
    powerPerTonne,
    acceleration,
    topSpeed,
    braking,
    handling,
    grip,
    comfort,
    reliability,
    sound,
    style: styleScore,
    drag: cd,
    downforce,
    price,
    scores,
    tractionLimited,
    drivetrainChanged,
    streetLegal: p.exhaust?.legal !== false,
    aspiration,
    engineName: engine.name,
    resolved: p,
  }
}
