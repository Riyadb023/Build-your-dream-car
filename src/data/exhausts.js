/**
 * EXHAUST
 * -------
 *  powerGain   MULTIPLIER (not flat hp). A straight pipe on a 600 hp engine
 *              is worth more than on a 120 hp engine - percentages model that.
 *  sound       0-10, feeds the character/style score
 *  legal       false -> flagged in the UI, hurts the "daily" ratings
 *  tips        how many exhaust tips the SVG renderer draws
 */

export const exhausts = [
  {
    id: 'stock',
    name: 'Factory Exhaust',
    short: 'Stock',
    powerGain: 1.0,
    weight: 0,
    sound: 0,
    comfort: 0,
    reliability: 2,
    legal: true,
    tips: 1,
    tipStyle: 'chrome',
    price: 0,
    blurb: 'Quiet, heavy, restrictive. Exactly what the regulators wanted.',
  },
  {
    id: 'cat-back',
    name: 'Cat-Back System',
    short: 'Cat-Back',
    powerGain: 1.015,
    weight: -8,
    sound: 2.2,
    comfort: -0.3,
    reliability: 0,
    legal: true,
    tips: 2,
    tipStyle: 'chrome',
    price: 90000,
    blurb: 'Everything after the cat. Keeps it legal, adds a proper voice.',
  },
  {
    id: 'performance',
    name: 'Full Performance System',
    short: 'Performance',
    powerGain: 1.04,
    weight: -14,
    sound: 3.6,
    comfort: -1.0,
    reliability: -1,
    legal: true,
    tips: 2,
    tipStyle: 'steel',
    price: 210000,
    blurb: 'Headers, high-flow cat, mandrel bends. Real gains on a tuned engine.',
  },
  {
    id: 'titanium',
    name: 'Titanium Race System',
    short: 'Titanium',
    powerGain: 1.055,
    weight: -22,
    sound: 4.4,
    comfort: -1.8,
    reliability: -2,
    legal: true,
    tips: 3,
    tipStyle: 'burnt',
    price: 480000,
    blurb: 'Burnt titanium tips and almost no mass. Expensive jewellery that works.',
  },
  {
    id: 'straight-pipe',
    name: 'Straight Pipe',
    short: 'Straight Pipe',
    powerGain: 1.045,
    weight: -26,
    sound: 5.0,
    comfort: -4.0,
    reliability: -5,
    legal: false,
    tips: 1,
    tipStyle: 'steel',
    price: 60000,
    blurb: 'No cat, no muffler, no friends. Deafening and definitely not road legal.',
  },
]

export const getExhaust = (id) => exhausts.find((e) => e.id === id) ?? null
