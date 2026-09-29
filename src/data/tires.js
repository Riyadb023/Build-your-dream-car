/**
 * TIRES
 * -----
 * The single most important performance part on the car, and the cheapest.
 * Tyres are where grip actually comes from.
 *
 *  grip        big swing. Drives cornering, braking AND launch.
 *  wet         wet-weather capability -> hurts an all-round/daily rating
 *  comfort     noise + harshness
 *  slip        how progressively it breaks away -> DRIFT detection
 *  treadColor  used by the SVG renderer (slicks have no visible tread)
 */

export const tires = [
  {
    id: 'budget',
    name: 'Budget Ditchfinders',
    short: 'Budget',
    grip: -1.6,
    wet: -2.5,
    comfort: -0.8,
    slip: 0.9,
    weight: -2,
    price: 30000,
    tread: 'block',
    blurb: 'Unbranded, hard as plastic. Will genuinely try to kill you in rain.',
  },
  {
    id: 'street',
    name: 'Street Touring',
    short: 'Street',
    grip: 0,
    wet: 0,
    comfort: 0,
    slip: 0.5,
    weight: 0,
    price: 70000,
    tread: 'block',
    blurb: 'Sensible all-season rubber. The baseline everything is measured against.',
  },
  {
    id: 'ps4s',
    name: 'Michelin Pilot Sport 4S',
    short: 'PS4S',
    grip: 1.9,
    wet: 1.2,
    comfort: 0.3,
    slip: 0.35,
    weight: 2,
    price: 190000,
    tread: 'sport',
    blurb: 'The genuine benchmark. Fast, quiet, brilliant in the wet. Just buy these.',
  },
  {
    id: 'cup2',
    name: 'Michelin Cup 2',
    short: 'Cup 2',
    grip: 3.2,
    wet: -1.4,
    comfort: -1.4,
    slip: 0.25,
    weight: 1,
    price: 320000,
    tread: 'sport',
    blurb: 'Road-legal trackday tyre. Needs heat, then it hangs on like nothing else.',
  },
  {
    id: 'semi-slick',
    name: 'Semi-Slick R-Compound',
    short: 'Semi-Slick',
    grip: 4.3,
    wet: -3.4,
    comfort: -2.6,
    slip: 0.15,
    weight: 0,
    price: 420000,
    tread: 'slick',
    blurb: 'Four grooves and a prayer. Enormous dry grip, terrifying in the wet.',
  },
  {
    id: 'drift',
    name: 'Drift Compound',
    short: 'Drift',
    grip: -0.9,
    wet: -1.0,
    comfort: -1.2,
    slip: 1.6,
    weight: -1,
    price: 110000,
    tread: 'block',
    blurb: 'Cheap, hard rears designed to give up smoothly and smoke beautifully.',
  },
]

export const getTire = (id) => tires.find((t) => t.id === id) ?? null
