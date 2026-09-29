/**
 * CALIBRATION HARNESS
 * ===================
 * Runs every car in the catalogue in FULLY STOCK trim and compares the
 * engine's output against the real published manufacturer figures.
 *
 * Why this exists: it is very easy to invent formulas that "look fine" and
 * quietly claim a 970 kg AE86 hits 100 km/h in 3 seconds. This harness makes
 * the physics honest, and it runs in plain node - no browser, no React,
 * because calculateStats.js has zero UI dependencies. That is the payoff of
 * keeping the calculation layer pure.
 *
 *   npm run test:stats
 */

import { cars } from '../src/data/cars.js'
import { calculateStats } from '../src/utils/calculateStats.js'

// Real-world published figures (manufacturer / contemporary road tests)
const REAL = {
  'bmw-e46-330i': { power: 231, accel: 6.5, top: 250 },
  'bmw-e46-m3': { power: 343, accel: 5.2, top: 250 },
  'bmw-e39-m5': { power: 400, accel: 5.3, top: 250 },
  'nissan-350z': { power: 287, accel: 5.8, top: 250 },
  'mazda-rx8': { power: 231, accel: 6.4, top: 235 },
  'vw-golf-gti-mk5': { power: 200, accel: 7.2, top: 235 },
  'subaru-wrx-sti': { power: 300, accel: 5.2, top: 250 },
  'audi-s4-b6': { power: 344, accel: 5.6, top: 250 },
  'mercedes-c55-amg': { power: 367, accel: 5.2, top: 250 },
  'toyota-ae86': { power: 128, accel: 8.8, top: 195 },
}

const stockBuild = (car) => ({
  car: car.id,
  engine: car.stockEngine,
  tune: 'stock',
  transmission: car.stockTransmission,
  drivetrain: car.drivetrain,
  wheels: 'oem',
  tires: 'street',
  suspension: 'stock',
  brakes: 'stock',
  exhaust: 'stock',
  aero: 'stock',
  interior: 'stock',
  color: 'alpine-white',
})

const pad = (s, n) => String(s).padEnd(n)
const padL = (s, n) => String(s).padStart(n)

console.log('\n  STOCK CALIBRATION — simulated vs real published figures\n')
console.log(
  '  ' +
    pad('CAR', 20) +
    padL('HP', 5) +
    padL('0-100', 8) +
    padL('REAL', 7) +
    padL('ERR', 8) +
    padL('TOP', 6) +
    padL('REAL', 6),
)
console.log('  ' + '-'.repeat(60))

let worstAccel = 0
let sumAbsErr = 0
let count = 0
const failures = []

for (const car of cars) {
  const s = calculateStats(stockBuild(car))
  const real = REAL[car.id]
  if (!real) continue

  const err = ((s.acceleration - real.accel) / real.accel) * 100
  worstAccel = Math.max(worstAccel, Math.abs(err))
  sumAbsErr += Math.abs(err)
  count += 1

  const flag = Math.abs(err) > 15 ? '  <-- OFF' : ''
  if (Math.abs(err) > 15) failures.push(`${car.shortName}: 0-100 off by ${err.toFixed(1)}%`)

  console.log(
    '  ' +
      pad(car.shortName, 20) +
      padL(s.power, 5) +
      padL(s.acceleration.toFixed(2) + 's', 8) +
      padL(real.accel + 's', 7) +
      padL(`${err > 0 ? '+' : ''}${err.toFixed(1)}%`, 8) +
      padL(s.topSpeed, 6) +
      padL(real.top, 6) +
      flag,
  )

  if (s.power !== real.power) {
    failures.push(`${car.shortName}: stock power ${s.power} != real ${real.power}`)
  }
}

console.log('  ' + '-'.repeat(60))
console.log(
  `  mean abs error: ${(sumAbsErr / count).toFixed(1)}%   worst: ${worstAccel.toFixed(1)}%\n`,
)

// ---- sanity checks on modified builds ----------------------------------
console.log('  SANITY CHECKS — modified builds\n')

const check = (label, cond, detail) => {
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${cond ? '' : `  (${detail})`}`)
  if (!cond) failures.push(`${label}: ${detail}`)
}

const base = stockBuild(cars.find((c) => c.id === 'bmw-e46-330i'))

// A Stage 1 remap must do almost nothing on an NA engine...
const naTuned = calculateStats({ ...base, tune: 'stage-1' })
const naStock = calculateStats(base)
check(
  'Stage 1 on NA engine gains <5%',
  naTuned.power / naStock.power < 1.05,
  `gained ${(((naTuned.power / naStock.power) - 1) * 100).toFixed(1)}%`,
)

// ...but should transform a turbo car.
const gti = stockBuild(cars.find((c) => c.id === 'vw-golf-gti-mk5'))
const gtiTuned = calculateStats({ ...gti, tune: 'stage-2' })
check(
  'Stage 2 on turbo engine gains >30%',
  gtiTuned.power / calculateStats(gti).power > 1.3,
  'turbo tune too weak',
)

// A big wing must REDUCE top speed.
const wingless = calculateStats({ ...base, engine: 'ls3', tune: 'stage-2' })
const winged = calculateStats({ ...base, engine: 'ls3', tune: 'stage-2', aero: 'full-kit' })
check('Full aero kit lowers top speed', winged.topSpeed < wingless.topSpeed,
  `${winged.topSpeed} vs ${wingless.topSpeed}`)

// ...and must IMPROVE handling.
check('Full aero kit raises handling', winged.handling > wingless.handling,
  `${winged.handling.toFixed(2)} vs ${wingless.handling.toFixed(2)}`)

// Semi-slicks must beat budget tyres by a wide margin on handling.
const budget = calculateStats({ ...base, tires: 'budget' })
const slicks = calculateStats({ ...base, tires: 'semi-slick' })
check('Semi-slicks out-handle budget tyres', slicks.handling - budget.handling > 2,
  `${slicks.handling.toFixed(2)} vs ${budget.handling.toFixed(2)}`)

// Stripping the interior must make the car lighter and quicker.
const stripped = calculateStats({ ...base, interior: 'stripped' })
check('Stripping interior reduces weight', stripped.weight < naStock.weight,
  `${stripped.weight} vs ${naStock.weight}`)
check('Stripping interior improves 0-100', stripped.acceleration < naStock.acceleration, 'no gain')

// A monster build must be traction limited on RWD.
const monster = calculateStats({
  ...base, engine: 'rb26dett', tune: 'full-race', tires: 'street', drivetrain: 'rwd',
})
check('700hp+ RWD on street tyres is traction limited', monster.tractionLimited,
  `${monster.power}hp not flagged`)

// AWD must launch better than RWD, all else equal.
const rwdLaunch = calculateStats({ ...base, engine: 'ls3', drivetrain: 'rwd' })
const awdLaunch = calculateStats({ ...base, engine: 'ls3', drivetrain: 'awd' })
check('AWD launches quicker than RWD at high power',
  awdLaunch.acceleration < rwdLaunch.acceleration,
  `${awdLaunch.acceleration.toFixed(2)} vs ${rwdLaunch.acceleration.toFixed(2)}`)

// Reliability must collapse on a maxed-out tune.
check('Full race tune wrecks reliability', monster.reliability < 35,
  `reliability ${monster.reliability.toFixed(0)}`)

// Price must always be positive and include the car.
check('Price includes base car', monster.price > cars[0].price, 'price too low')

// No NaNs anywhere, ever.
const allFinite = Object.entries(monster)
  .filter(([, v]) => typeof v === 'number')
  .every(([, v]) => Number.isFinite(v))
check('No NaN/Infinity in output', allFinite, 'found non-finite number')

console.log('')
if (failures.length) {
  console.log(`  ${failures.length} PROBLEM(S):`)
  failures.forEach((f) => console.log(`    - ${f}`))
  process.exit(1)
} else {
  console.log('  All checks passed.\n')
}
