/**
 * SMOKE TEST (dev tool)
 * =====================
 * Server-renders the real page components and asserts the important text
 * actually appears. Catches crashes, undefined props and NaN leaking into
 * the UI without needing a browser.
 *
 *   node scripts/smoke.mjs      (bundled first — see package.json)
 */
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router'

import App from '../src/App.jsx'
import CarPreview from '../src/components/car/CarPreview.jsx'
import StatsPanel from '../src/components/car/StatsPanel.jsx'
import Builder from '../src/components/builder/Builder.jsx'
import { createStockBuild } from '../src/hooks/useCarBuilder.js'
import { calculateStats } from '../src/utils/calculateStats.js'
import { calculateRating, getPersonality } from '../src/utils/calculateRating.js'
import { getBuildWarnings } from '../src/utils/compatibility.js'
import { getCar } from '../src/data/cars.js'
import { cars } from '../src/data/cars.js'

const failures = []
const pass = (label) => console.log(`  PASS  ${label}`)
const fail = (label, detail) => {
  console.log(`  FAIL  ${label}  (${detail})`)
  failures.push(`${label}: ${detail}`)
}

const check = (label, cond, detail = '') => (cond ? pass(label) : fail(label, detail))

// ---- 1. the whole app renders at every route ---------------------------
console.log('\n  APP ROUTES\n')
for (const path of ['/', '/garage', '/challenges', '/nonexistent']) {
  try {
    const html = renderToStaticMarkup(
      React.createElement(StaticRouter, { location: path }, React.createElement(App)),
    )
    check(`renders ${path}`, html.length > 500, `only ${html.length} chars`)
    if (/NaN|undefined|\[object Object\]/.test(html)) {
      fail(`${path} is clean`, 'contains NaN/undefined/[object Object]')
    }
  } catch (err) {
    fail(`renders ${path}`, err.message)
  }
}

// ---- 2. a fully specced build renders correct numbers ------------------
console.log('\n  BUILDER OUTPUT\n')
const build = {
  ...createStockBuild('bmw-e46-m3'),
  engine: 'b58',
  tune: 'stage-2',
  wheels: 'te37',
  tires: 'cup2',
  suspension: 'coilovers',
  brakes: 'bbk',
  exhaust: 'titanium',
  aero: 'gt-wing',
  interior: 'buckets',
  color: 'phoenix-yellow',
}
const stats = calculateStats(build)
const rating = calculateRating(stats)
const personality = getPersonality(stats)
const warnings = getBuildWarnings(stats, build)

try {
  const html = renderToStaticMarkup(
    React.createElement(CarPreview, {
      car: getCar(build.car),
      build,
      stats,
      personality,
      resolved: stats.resolved,
    }),
  )
  // NB: the UI renders thousands separators (1,523) so compare formatted.
  const fmt = (n) => new Intl.NumberFormat('en-US').format(Math.round(n))
  check('CarPreview shows power', html.includes(fmt(stats.power)), 'power missing')
  check('CarPreview shows weight', html.includes(fmt(stats.weight)), 'weight missing')
  check('CarPreview draws an svg', html.includes('<svg'), 'no svg')
  check('CarPreview has no NaN', !/NaN/.test(html), 'NaN present')
} catch (err) {
  fail('CarPreview renders', err.message)
}

try {
  const html = renderToStaticMarkup(
    React.createElement(StatsPanel, { stats, rating, warnings }),
  )
  check('StatsPanel shows rating', html.includes(String(rating.total)), 'rating missing')
  check('StatsPanel has no NaN', !/NaN/.test(html), 'NaN present')
} catch (err) {
  fail('StatsPanel renders', err.message)
}

try {
  const html = renderToStaticMarkup(
    React.createElement(Builder, {
      build,
      stats,
      modCount: 9,
      onSelect: () => {},
      onReset: () => {},
    }),
  )
  check('Builder lists options', html.includes('S54') || html.includes('B58'), 'no engines')
  check('Builder has no NaN', !/NaN/.test(html), 'NaN present')
} catch (err) {
  fail('Builder renders', err.message)
}

// ---- 3. every car renders in stock trim without crashing ---------------
console.log('\n  ALL CARS\n')
let allOk = true
for (const car of cars) {
  try {
    const s = calculateStats(createStockBuild(car.id))
    const html = renderToStaticMarkup(
      React.createElement(CarPreview, {
        car,
        build: createStockBuild(car.id),
        stats: s,
        personality: getPersonality(s),
        resolved: s.resolved,
      }),
    )
    if (/NaN/.test(html)) {
      fail(`${car.shortName} renders clean`, 'NaN in output')
      allOk = false
    }
  } catch (err) {
    fail(`${car.shortName} renders`, err.message)
    allOk = false
  }
}
check('all 10 cars render cleanly', allOk, 'see above')

console.log('')
if (failures.length) {
  console.log(`  ${failures.length} FAILURE(S)\n`)
  process.exit(1)
}
console.log('  Smoke test passed.\n')
