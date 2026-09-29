/**
 * VISUAL PROOF HARNESS (dev tool, not shipped)
 * ============================================
 * Server-renders the car SVG to a PNG so the geometry can be inspected
 * without a browser. Uses react-dom/server + @resvg/resvg-js.
 *
 *   node scripts/renderCar.mjs <outfile.png> [carId] [colorId] [wheelId] ...
 */
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import CarSvg from '../src/components/car/CarSvg.jsx'
import { getCar } from '../src/data/cars.js'
import { getOption } from '../src/data/categories.js'

// @resvg/resvg-js is an optional native dependency - it isn't needed to run
// the app, only to dump a PNG of the car from the command line.
// Resolve from the project root: this file is bundled to CJS before running,
// where `import.meta.url` is not available.
const require = createRequire(path.join(process.cwd(), 'noop.js'))
let Resvg
try {
  ;({ Resvg } = require('@resvg/resvg-js'))
} catch {
  console.error(
    'This script needs the optional renderer:\n\n  npm i -D @resvg/resvg-js\n',
  )
  process.exit(1)
}

const [, , out = '/tmp/car.png', carId = 'bmw-e46-m3', colorId = 'phoenix-yellow',
  wheelId = 'te37', suspId = 'coilovers', aeroId = 'gt-wing', exhId = 'titanium',
  brakeId = 'bbk', tireId = 'cup2'] = process.argv

const props = {
  car: getCar(carId),
  color: getOption('color', colorId),
  wheel: getOption('wheels', wheelId),
  suspension: getOption('suspension', suspId),
  aero: getOption('aero', aeroId),
  exhaust: getOption('exhaust', exhId),
  brake: getOption('brakes', brakeId),
  tire: getOption('tires', tireId),
  animate: false,
}

let svg = renderToStaticMarkup(React.createElement(CarSvg, props))
svg = svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ')

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  background: '#0d1014',
})
fs.writeFileSync(out, resvg.render().asPng())
console.log('wrote', out)
