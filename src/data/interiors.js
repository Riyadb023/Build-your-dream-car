/**
 * INTERIOR
 * --------
 * The classic weight-vs-comfort trade. Stripping a car is the cheapest
 * performance modification that exists, and it makes the car horrible.
 *
 *  weight   kg delta. Negative = stripped out.
 *  comfort  0-10 swing
 *  luxury   feeds the LUXURY CRUISER personality
 *  race     feeds the TRACK MONSTER personality
 */

export const interiors = [
  {
    id: 'stock',
    name: 'Factory Interior',
    short: 'Stock',
    weight: 0,
    comfort: 0,
    style: 0,
    luxury: 3,
    race: 0,
    reliability: 0,
    price: 0,
    blurb: 'Cloth seats and a cupholder. Perfectly fine, entirely forgettable.',
  },
  {
    id: 'sport-seats',
    name: 'Sport Seats',
    short: 'Sport',
    weight: -12,
    comfort: 0.4,
    style: 1.4,
    luxury: 4,
    race: 2,
    reliability: 0,
    price: 140000,
    blurb: 'Bolstered but still heated. Holds you in place without punishing you.',
  },
  {
    id: 'leather',
    name: 'Full Leather Retrim',
    short: 'Leather',
    weight: 18,
    comfort: 2.2,
    style: 2.2,
    luxury: 9,
    race: 0,
    reliability: 0,
    price: 320000,
    blurb: 'Hides, contrast stitching, and an extra 18 kg of pure smugness.',
  },
  {
    id: 'alcantara',
    name: 'Alcantara & Carbon',
    short: 'Alcantara',
    weight: -6,
    comfort: 1.4,
    style: 3.4,
    luxury: 8,
    race: 4,
    reliability: 0,
    price: 420000,
    blurb: 'Suede everywhere it matters. Looks like a homologation special inside.',
  },
  {
    id: 'buckets',
    name: 'Fixed-Back Buckets',
    short: 'Buckets',
    weight: -34,
    comfort: -2.6,
    style: 2.8,
    luxury: 1,
    race: 8,
    reliability: 0,
    price: 260000,
    blurb: 'Composite shells and harnesses. Getting in is a whole procedure.',
  },
  {
    id: 'stripped',
    name: 'Stripped + Roll Cage',
    short: 'Full Race',
    weight: -78,
    comfort: -6.5,
    style: 2.4,
    luxury: 0,
    race: 10,
    reliability: 2,
    price: 380000,
    blurb: 'Carpets gone, rear seats gone, cage welded in. It echoes in here.',
  },
]

export const getInterior = (id) => interiors.find((i) => i.id === id) ?? null
