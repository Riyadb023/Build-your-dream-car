/**
 * AERODYNAMICS
 * ------------
 * The genuine trade-off in the whole app: downforce ALWAYS costs you drag,
 * and drag is what caps your top speed. A big wing makes you faster in the
 * corners and slower down the straight. That's real, and it makes the
 * top-speed number interesting instead of just "more power = more speed".
 *
 *  dragDelta   added to the car's Cd
 *  downforce   arbitrary 0-10 units -> boosts high-speed handling
 *  parts       which pieces the SVG renderer should draw
 */

export const aeroKits = [
  {
    id: 'stock',
    name: 'Factory Bodywork',
    short: 'Stock',
    dragDelta: 0,
    downforce: 0,
    weight: 0,
    style: 0,
    price: 0,
    parts: [],
    blurb: 'Standard bumpers. Slippery enough, invisible to the police.',
  },
  {
    id: 'lip',
    name: 'Front Lip Splitter',
    short: 'Front Lip',
    dragDelta: 0.004,
    downforce: 1.2,
    weight: 4,
    style: 1.6,
    price: 70000,
    parts: ['splitter'],
    blurb: 'Cleans up the front end and scrapes on every single driveway.',
  },
  {
    id: 'ducktail',
    name: 'Ducktail Spoiler',
    short: 'Ducktail',
    dragDelta: 0.006,
    downforce: 1.6,
    weight: 3,
    style: 2.2,
    price: 95000,
    parts: ['ducktail'],
    blurb: 'Subtle lip on the bootlid. Tasteful, timeless, does a little something.',
  },
  {
    id: 'gt-wing',
    name: 'Carbon GT Wing',
    short: 'GT Wing',
    dragDelta: 0.035,
    downforce: 5.4,
    weight: 9,
    style: 2.6,
    price: 240000,
    parts: ['wing'],
    blurb: 'Swan-neck carbon wing. Genuine downforce, genuine top-speed penalty.',
  },
  {
    id: 'full-kit',
    name: 'Full Aero Package',
    short: 'Full Kit',
    dragDelta: 0.048,
    downforce: 8.2,
    weight: 22,
    style: 3.4,
    price: 520000,
    parts: ['splitter', 'wing', 'canards', 'skirts', 'diffuser'],
    blurb: 'Splitter, canards, skirts, diffuser and wing. A time-attack car now.',
  },
]

export const getAero = (id) => aeroKits.find((a) => a.id === id) ?? null
