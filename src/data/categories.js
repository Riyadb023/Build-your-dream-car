import { engines } from './engines.js'
import { tunes } from './tunes.js'
import { transmissions } from './transmissions.js'
import { drivetrains } from './drivetrains.js'
import { wheels } from './wheels.js'
import { tires } from './tires.js'
import { suspensions } from './suspensions.js'
import { brakes } from './brakes.js'
import { exhausts } from './exhausts.js'
import { aeroKits } from './aero.js'
import { interiors } from './interiors.js'
import { colors } from './colors.js'

/**
 * THE CATEGORY REGISTRY
 * ---------------------
 * This is the spine of the whole application.
 *
 * Every part category is described ONCE, here. The builder UI, the random
 * generator, the URL serializer, the compatibility checker and the stats
 * engine all iterate over this array instead of hardcoding category names.
 *
 * Consequence: adding an 11th category (turbo? brakes? nitrous?) means adding
 * one entry here + one data file. Zero UI changes. That is the entire lesson
 * of "DATA != UI" made concrete.
 *
 *  key      the property name inside the build object
 *  options  the array of parts
 *  group    'performance' | 'cosmetic' - drives the two-column mental model
 */
export const categories = [
  {
    key: 'engine',
    label: 'Engine',
    icon: 'engine',
    group: 'performance',
    options: engines,
    tagline: 'The heart. Everything else is a multiplier on this.',
  },
  {
    key: 'tune',
    label: 'ECU Tune',
    icon: 'chip',
    group: 'performance',
    options: tunes,
    tagline: 'Software power. Cheap, effective, and hard on reliability.',
  },
  {
    key: 'transmission',
    label: 'Transmission',
    icon: 'gearbox',
    group: 'performance',
    options: transmissions,
    tagline: 'How the power gets out, and how good it feels doing it.',
  },
  {
    key: 'drivetrain',
    label: 'Drivetrain',
    icon: 'drivetrain',
    group: 'performance',
    options: drivetrains,
    tagline: 'Which wheels get the power. Decides how much you can deploy.',
  },
  {
    key: 'suspension',
    label: 'Suspension',
    icon: 'spring',
    group: 'performance',
    options: suspensions,
    tagline: 'Handling, ride height and stance.',
  },
  {
    key: 'brakes',
    label: 'Brakes',
    icon: 'brake',
    group: 'performance',
    options: brakes,
    tagline: 'Going fast is easy. Stopping is the expensive part.',
  },
  {
    key: 'tires',
    label: 'Tires',
    icon: 'tire',
    group: 'performance',
    options: tires,
    tagline: 'The only part touching the road. Never cheap out here.',
  },
  {
    key: 'exhaust',
    label: 'Exhaust',
    icon: 'exhaust',
    group: 'performance',
    options: exhausts,
    tagline: 'A little power, a lot of character.',
  },
  {
    key: 'wheels',
    label: 'Wheels',
    icon: 'wheel',
    group: 'cosmetic',
    options: wheels,
    tagline: 'Unsprung mass and the single biggest visual change.',
  },
  {
    key: 'aero',
    label: 'Aero',
    icon: 'wing',
    group: 'cosmetic',
    options: aeroKits,
    tagline: 'Downforce always costs you drag. Always.',
  },
  {
    key: 'interior',
    label: 'Interior',
    icon: 'seat',
    group: 'cosmetic',
    options: interiors,
    tagline: 'Comfort versus kilograms.',
  },
  {
    key: 'color',
    label: 'Paint',
    icon: 'paint',
    group: 'cosmetic',
    options: colors,
    tagline: 'Zero performance effect. Maximum importance.',
  },
]

/** Fast lookup: 'engine' -> category object */
export const categoryMap = Object.fromEntries(categories.map((c) => [c.key, c]))

/** Every build-state key that holds a part id (i.e. not `car`). */
export const categoryKeys = categories.map((c) => c.key)

/** Find one option object inside a category, by id. */
export function getOption(categoryKey, optionId) {
  const category = categoryMap[categoryKey]
  if (!category) return null
  return category.options.find((o) => o.id === optionId) ?? null
}
