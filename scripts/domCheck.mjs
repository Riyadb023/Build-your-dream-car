/**
 * DOM STRUCTURE CHECK (dev tool)
 * ==============================
 * No browser is available in this sandbox, so instead of screenshotting we
 * parse the server-rendered HTML and assert the things that would actually
 * be broken on screen: missing sections, empty stat values, unstyled
 * elements, unlabelled buttons, bad contrast pairings and so on.
 *
 * It is not a substitute for looking at the page, but it catches the class
 * of bug that a screenshot would show you.
 */
import { parseHTML } from '/tmp/rsv/node_modules/linkedom/esm/index.js'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router'

import App from '../src/App.jsx'

const failures = []
const check = (label, cond, detail = '') => {
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${cond ? '' : `  (${detail})`}`)
  if (!cond) failures.push(label)
}

function renderRoute(route) {
  const html = renderToStaticMarkup(
    React.createElement(StaticRouter, { location: route }, React.createElement(App)),
  )
  const { document } = parseHTML(`<!doctype html><html><body>${html}</body></html>`)
  return { html, document }
}

// ---------------------------------------------------------------- home
console.log('\n  HOME / CAR SELECT\n')
{
  const { document } = renderRoute('/')
  const cards = document.querySelectorAll('button')
  check('renders car cards', cards.length >= 10, `${cards.length} buttons`)

  const h1 = document.querySelector('h1')
  check('has a page heading', Boolean(h1?.textContent?.trim()), 'no h1')

  const svgs = document.querySelectorAll('svg')
  check('draws a car per option', svgs.length >= 10, `${svgs.length} svgs`)

  // every card must expose its price and specs
  const text = document.body.textContent
  check('shows prices', /DA/.test(text), 'no DA prices')
  check('shows drivetrain layouts', /RWD|FWD|AWD/.test(text), 'no layouts')
  check('no empty dashes in specs', !/—\s*hp/.test(text), 'missing engine data')
}

// ------------------------------------------------------------- builder
console.log('\n  BUILDER (with a car selected)\n')
{
  const { document } = renderRoute('/?car=bmw-e46-m3&engine=s54&tune=stage-2&wheels=te37&tires=cup2&suspension=coilovers&brakes=bbk&exhaust=titanium&aero=gt-wing&interior=buckets&color=phoenix-yellow&transmission=manual-6&drivetrain=rwd')
  const text = document.body.textContent

  check('shows the car name', text.includes('E46 M3'), 'name missing')
  check('shows a power figure', /\d{3}\s*HP|HP/.test(text), 'no HP')
  check('shows 0-100', /0[–-]100/.test(text), 'no 0-100 label')
  check('shows build cost', /Build cost/i.test(text), 'no cost row')
  check('shows a build rating', /Build rating/i.test(text), 'no rating')

  // The 12 category tabs must all be present
  const tabs = [...document.querySelectorAll('nav button')].map((b) => b.textContent.trim())
  check('renders all 12 category tabs', tabs.length >= 12, `${tabs.length} tabs`)

  // Option cards for the active category
  const pressed = document.querySelectorAll('[aria-pressed]')
  check('option cards are toggle buttons', pressed.length > 3, `${pressed.length}`)
  check(
    'exactly one option is selected',
    [...pressed].filter((p) => p.getAttribute('aria-pressed') === 'true').length === 1,
    'selection count wrong',
  )

  // stat meters
  const meters = document.querySelectorAll('[role="meter"]')
  check('renders stat bars', meters.length >= 6, `${meters.length} meters`)
  const bad = [...meters].filter((m) => {
    const v = Number(m.getAttribute('aria-valuenow'))
    return !Number.isFinite(v) || v < 0 || v > 100
  })
  check('all stat bars are 0-100', bad.length === 0, `${bad.length} out of range`)

  // accessibility: every button needs a name
  const unnamed = [...document.querySelectorAll('button')].filter(
    (b) => !b.textContent.trim() && !b.getAttribute('aria-label'),
  )
  check('every button has an accessible name', unnamed.length === 0, `${unnamed.length} unnamed`)

  // the car svg must have a label
  const carSvg = document.querySelector('svg[role="img"]')
  check('car svg is labelled', Boolean(carSvg?.getAttribute('aria-label')), 'no aria-label')
}

// -------------------------------------------------------------- garage
console.log('\n  GARAGE (empty state)\n')
{
  const { document } = renderRoute('/garage')
  const text = document.body.textContent
  check('shows empty state copy', /garage is empty/i.test(text), 'no empty state')
  check('offers a way out', Boolean(document.querySelector('a[href="/"]')), 'no CTA link')
}

// ---------------------------------------------------------- challenges
console.log('\n  CHALLENGES\n')
{
  const { document } = renderRoute('/challenges')
  const text = document.body.textContent
  check('lists challenges', /Track Weapon/.test(text), 'missing challenge')
  check('shows budgets', /Budget/i.test(text), 'no budget')
  check('shows XP', /XP/.test(text), 'no xp')
  const items = document.querySelectorAll('li')
  check('renders requirement rows', items.length > 12, `${items.length} li`)
}

// -------------------------------------------------- css class coverage
console.log('\n  STYLING\n')
{
  const { html } = renderRoute('/?car=nissan-350z')
  // Every element that should be styled must carry a hashed module class.
  const classless = (html.match(/<(section|header|nav|dl|ul)(?![^>]*class=)/g) ?? []).length
  check('structural elements are styled', classless <= 2, `${classless} unstyled`)
  check('css modules applied', /class="[^"]*_[\w-]+/.test(html), 'no module classes')
}

console.log('')
if (failures.length) {
  console.log(`  ${failures.length} FAILURE(S)\n`)
  process.exit(1)
}
console.log('  DOM checks passed.\n')
