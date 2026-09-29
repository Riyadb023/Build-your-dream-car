/**
 * BRAKES
 * ------
 * Brakes don't make you fast in a straight line, so beginners skip them.
 * Here they feed HANDLING and are required by the track-focused challenges.
 *
 *  stoppingPower  contributes to handling + the 100-0 figure
 *  fade           resistance to repeated hard stops (track relevance)
 *  caliperColor   drawn by the SVG renderer behind the wheel spokes
 */

export const brakes = [
  {
    id: 'stock',
    name: 'Factory Brakes',
    short: 'Stock',
    stoppingPower: 0,
    fade: 0,
    handling: 0,
    weight: 0,
    comfort: 0,
    price: 0,
    caliperColor: '#4a4f57',
    discStyle: 'plain',
    blurb: 'Adequate once. Adequate twice. Boiling by the third corner.',
  },
  {
    id: 'performance-pads',
    name: 'Performance Pads & Fluid',
    short: 'Pads',
    stoppingPower: 1.2,
    fade: 2.0,
    handling: 0.4,
    weight: 0,
    comfort: -0.4,
    price: 45000,
    caliperColor: '#4a4f57',
    discStyle: 'plain',
    blurb: 'The best value on this entire page. Costs nothing, saves your life.',
  },
  {
    id: 'slotted',
    name: 'Slotted Discs + 4-Pot',
    short: '4-Pot',
    stoppingPower: 2.6,
    fade: 3.4,
    handling: 1.0,
    weight: -4,
    comfort: -0.6,
    price: 180000,
    caliperColor: '#b4322c',
    discStyle: 'slotted',
    blurb: 'Four-piston calipers and slotted discs. Confidence you can feel.',
  },
  {
    id: 'bbk',
    name: 'Big Brake Kit (6-Pot)',
    short: 'BBK',
    stoppingPower: 3.8,
    fade: 4.6,
    handling: 1.6,
    weight: -8,
    comfort: -0.8,
    price: 340000,
    caliperColor: '#c8a02a',
    discStyle: 'drilled',
    blurb: 'Six pistons per corner. Fills the wheel beautifully. Stops like an anchor.',
  },
  {
    id: 'carbon-ceramic',
    name: 'Carbon Ceramic',
    short: 'Carbon',
    stoppingPower: 4.6,
    fade: 6.0,
    handling: 2.2,
    weight: -18,
    comfort: -1.2,
    price: 820000,
    caliperColor: '#d4b03a',
    discStyle: 'drilled',
    blurb: 'Enormous, gold-calipered, and costs more than the RX-8. Never fades.',
  },
]

export const getBrake = (id) => brakes.find((b) => b.id === id) ?? null
