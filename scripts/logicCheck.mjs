/**
 * LOGIC / INTERACTION CHECK (dev tool)
 * ====================================
 * Exercises the behaviour behind the clicks: selecting a car, swapping
 * parts, randomising, sharing via URL and restoring from it.
 *
 * These are the bugs a render test can't see - wrong state transitions,
 * illegal combinations, and share links that don't survive a round trip.
 */
import { createStockBuild } from '../src/hooks/useCarBuilder.js'
import { categories, getOption } from '../src/data/categories.js'
import { cars } from '../src/data/cars.js'
import { calculateStats } from '../src/utils/calculateStats.js'
import { calculateRating, getPersonality } from '../src/utils/calculateRating.js'
import { isCompatible } from '../src/utils/compatibility.js'
import { buildToQueryString, paramsToBuild } from '../src/utils/buildSerializer.js'
import { challenges, evaluateChallenge } from '../src/data/challenges.js'

const failures = []
const check = (label, cond, detail = '') => {
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${cond ? '' : `  (${detail})`}`)
  if (!cond) failures.push(label)
}

// ---------------------------------------------------------------- stock
console.log('\n  BUILD STATE\n')
{
  const build = createStockBuild('bmw-e46-m3')
  check('stock build fills every category', categories.every((c) => build[c.key]), 'holes')
  check('stock build is internally compatible',
    categories.every((c) => isCompatible(getOption(c.key, build[c.key]), build).ok),
    'illegal default')

  // Selecting a part must change ONLY that part.
  const next = { ...build, wheels: 'te37' }
  const changed = categories.filter((c) => next[c.key] !== build[c.key])
  check('selecting a part changes one key', changed.length === 1, `${changed.length} changed`)

  // Every car's factory defaults must be legal.
  const bad = cars.filter((car) => {
    const b = createStockBuild(car.id)
    return categories.some((c) => !isCompatible(getOption(c.key, b[c.key]), b).ok)
  })
  check('all 10 cars have legal factory specs', bad.length === 0,
    bad.map((c) => c.shortName).join(', '))
}

// ------------------------------------------------------------ randomise
console.log('\n  RANDOMISER\n')
{
  // Mirror of the hook's randomize(): drivetrain first (it constrains which
  // engines are legal), then everything else, then a validity sweep.
  const randomBuild = (carId) => {
    const next = createStockBuild(carId)
    const pick = (key) => {
      const category = categories.find((c) => c.key === key)
      const legal = category.options.filter((o) => isCompatible(o, next).ok)
      if (legal.length) next[key] = legal[Math.floor(Math.random() * legal.length)].id
    }
    pick('drivetrain')
    for (const category of categories) if (category.key !== 'drivetrain') pick(category.key)
    const stock = createStockBuild(carId)
    for (const c of categories) {
      if (!isCompatible(getOption(c.key, next[c.key]), next).ok) next[c.key] = stock[c.key]
    }
    return next
  }

  let illegal = 0
  const offenders = new Set()
  for (let i = 0; i < 400; i += 1) {
    const car = cars[i % cars.length]
    const b = randomBuild(car.id)
    for (const c of categories) {
      if (!isCompatible(getOption(c.key, b[c.key]), b).ok) {
        illegal += 1
        offenders.add(`${c.key}:${b[c.key]} on ${car.shortName} (${b.drivetrain})`)
      }
    }
  }
  check('random builds are always legal', illegal === 0,
    `${illegal} illegal — e.g. ${[...offenders].slice(0, 3).join(' | ')}`)
}

// ------------------------------------------------------------ share URL
console.log('\n  SHARE LINKS\n')
{
  const original = {
    ...createStockBuild('subaru-wrx-sti'),
    engine: 'ls3',
    tune: 'stage-3',
    wheels: 'magnesium-race',
    color: 'midnight-purple',
    name: 'Test Build',
  }
  const restored = paramsToBuild(buildToQueryString(original))
  const keys = [...categories.map((c) => c.key), 'car', 'name']
  const mismatched = keys.filter((k) => original[k] !== restored[k])
  check('build survives a URL round trip', mismatched.length === 0, mismatched.join(', '))

  check('stats match after round trip',
    calculateStats(original).power === calculateStats(restored).power, 'power differs')

  // Untrusted input must never crash or leak through.
  const junk = paramsToBuild('car=banana&engine=<script>&tune=99&wheels=te37')
  check('rejects an unknown car', junk.car === undefined, `got ${junk.car}`)
  check('rejects an unknown engine', junk.engine === undefined, `got ${junk.engine}`)
  check('keeps the valid parts', junk.wheels === 'te37', 'dropped a good value')
  check('empty query is safe', Object.keys(paramsToBuild('')).length === 0, 'not empty')
}

// ---------------------------------------------------------- personality
console.log('\n  BUILD PERSONALITY\n')
{
  const track = calculateStats({
    ...createStockBuild('bmw-e46-m3'),
    tune: 'stage-2', suspension: 'track', tires: 'semi-slick',
    aero: 'full-kit', interior: 'stripped', brakes: 'carbon-ceramic',
  })
  check('track build reads as Track Monster',
    getPersonality(track).id === 'track-monster', getPersonality(track).name)

  const cruiser = calculateStats({
    ...createStockBuild('mercedes-c55-amg'),
    interior: 'leather', suspension: 'air', transmission: 'auto-8', tires: 'ps4s',
  })
  check('luxury build reads as Luxury Cruiser',
    getPersonality(cruiser).id === 'luxury-cruiser', getPersonality(cruiser).name)

  const sleeper = calculateStats({
    ...createStockBuild('bmw-e39-m5'),
    engine: 'ls3', tune: 'stage-2', wheels: 'oem', aero: 'stock',
    color: 'nardo-grey', exhaust: 'stock', suspension: 'stock',
  })
  check('quiet fast build reads as Sleeper',
    getPersonality(sleeper).id === 'sleeper', getPersonality(sleeper).name)

  const drift = calculateStats({
    ...createStockBuild('nissan-350z'),
    engine: '2jz-gte', tune: 'stage-2', drivetrain: 'rwd',
    tires: 'drift', transmission: 'manual-6', aero: 'stock',
  })
  check('drift build reads as Drift Machine',
    getPersonality(drift).id === 'drift-machine', getPersonality(drift).name)
}

// ------------------------------------------------------------- ratings
console.log('\n  RATINGS\n')
{
  const sensible = calculateStats({
    ...createStockBuild('bmw-e46-m3'),
    tune: 'stage-1', suspension: 'coilovers', tires: 'ps4s',
    brakes: 'slotted', wheels: 'te37', exhaust: 'performance',
  })
  const grenade = calculateStats({
    ...createStockBuild('bmw-e46-m3'),
    engine: 'rb26dett', tune: 'full-race', tires: 'budget', brakes: 'stock',
  })
  const a = calculateRating(sensible).total
  const b = calculateRating(grenade).total
  check('a coherent build outscores an unusable one', a > b, `${a} vs ${b}`)
  check('ratings stay within 1-100',
    [a, b].every((n) => n >= 1 && n <= 100), `${a}, ${b}`)

  // Ratings must be deterministic — same build, same score, every time.
  check('rating is deterministic',
    calculateRating(calculateStats(createStockBuild('mazda-rx8'))).total ===
      calculateRating(calculateStats(createStockBuild('mazda-rx8'))).total,
    'non-deterministic')
}

// ---------------------------------------------------------- challenges
console.log('\n  CHALLENGES\n')
{
  /**
   * Random sampling is the WRONG tool here: it says "no random build passed",
   * which conflates "impossible" with "unlikely". A challenge is meant to be
   * hard to stumble into and reachable if you think.
   *
   * So we search deliberately instead - hill-climbing with random restarts,
   * scoring requirements first and price second. That answers the two
   * questions that actually matter:
   *
   *   1. is there ANY build that meets the specs?          (is it possible?)
   *   2. does the cheapest such build fit inside the budget? (is it fair?)
   */
  const legalize = (b) => {
    const stock = createStockBuild(b.car)
    for (const c of categories) {
      if (!isCompatible(getOption(c.key, b[c.key]), b).ok) b[c.key] = stock[c.key]
    }
    return b
  }

  // Requirements dominate; among builds that pass, prefer the cheapest.
  const fitness = (challenge, stats) =>
    challenge.requirements.filter((r) => r.test(stats)).length * 1e9 - stats.price

  const cheapestPassing = (challenge) => {
    let best = null
    for (const car of cars) {
      for (let restart = 0; restart < 12; restart += 1) {
        let build = createStockBuild(car.id)
        if (restart > 0) {
          for (const c of categories) {
            const legal = c.options.filter((o) => isCompatible(o, build).ok)
            build[c.key] = legal[Math.floor(Math.random() * legal.length)].id
          }
          build = legalize(build)
        }
        for (let step = 0; step < 40; step += 1) {
          let improved = false
          for (const c of categories) {
            for (const option of c.options) {
              if (!isCompatible(option, build).ok) continue
              const candidate = legalize({ ...build, [c.key]: option.id })
              if (
                fitness(challenge, calculateStats(candidate)) >
                fitness(challenge, calculateStats(build)) + 1e-9
              ) {
                build = candidate
                improved = true
              }
            }
          }
          if (!improved) break
        }
        const stats = calculateStats(build)
        if (challenge.requirements.every((r) => r.test(stats))) {
          if (!best || stats.price < best.price) best = { price: stats.price, car, stats }
        }
      }
    }
    return best
  }

  for (const challenge of challenges) {
    const best = cheapestPassing(challenge)
    if (!best) {
      check(`"${challenge.name}" is satisfiable`, false, 'no build meets the specs at any price')
      continue
    }
    check(`"${challenge.name}" is satisfiable`, true)

    const headroom = (challenge.budget - best.price) / best.price
    check(
      `"${challenge.name}" fits its budget`,
      best.price <= challenge.budget,
      `cheapest pass is ${(best.price / 1e6).toFixed(2)}M but budget is ` +
        `${(challenge.budget / 1e6).toFixed(2)}M`,
    )
    // A budget with too much slack stops being a constraint at all.
    check(
      `"${challenge.name}" budget is still a constraint`,
      headroom <= 0.75,
      `${Math.round(headroom * 100)}% headroom - budget is decorative`,
    )
  }

  // A stock car should not accidentally complete a hard challenge.
  const stock = calculateStats(createStockBuild('bmw-e46-330i'))
  const freebies = challenges.filter((c) => evaluateChallenge(c, stock).passed)
  check('a stock 330i completes no challenges', freebies.length === 0,
    freebies.map((c) => c.name).join(', '))
}

console.log('')
if (failures.length) {
  console.log(`  ${failures.length} FAILURE(S)\n`)
  process.exit(1)
}
console.log('  Logic checks passed.\n')
