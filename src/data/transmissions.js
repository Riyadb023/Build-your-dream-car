/**
 * TRANSMISSIONS
 * -------------
 *  shiftTime   seconds lost per gearchange. Directly slows 0-100.
 *  gears       more gears = better use of the powerband = higher top speed
 *  driveLoss   fraction of crank power that never reaches the tarmac
 *  engagement  "driver's car" feeling. Feeds the STYLE/character score.
 */

export const transmissions = [
  {
    id: 'manual-5',
    name: '5-Speed Manual',
    short: '5MT',
    gears: 5,
    shiftTime: 0.42,
    driveLoss: 0.14,
    engagement: 8.0,
    weight: 0,
    comfort: -0.5,
    reliability: 4,
    price: 0,
    blurb: 'Three pedals, one less ratio. Runs out of gear early.',
  },
  {
    id: 'manual-6',
    name: '6-Speed Manual',
    short: '6MT',
    gears: 6,
    shiftTime: 0.4,
    driveLoss: 0.14,
    engagement: 9.0,
    weight: 6,
    comfort: -0.4,
    reliability: 3,
    price: 120000,
    blurb: 'The enthusiast default. Nothing else scores as well on feel.',
  },
  {
    id: 'auto-5',
    name: '5-Speed Automatic',
    short: '5AT',
    gears: 5,
    shiftTime: 0.55,
    driveLoss: 0.19,
    engagement: 2.5,
    weight: 28,
    comfort: 1.6,
    reliability: 1,
    price: 90000,
    blurb: 'A torque converter and a shrug. Comfortable, slow, unbreakable.',
  },
  {
    id: 'auto-8',
    name: '8-Speed Automatic',
    short: '8AT',
    gears: 8,
    shiftTime: 0.22,
    driveLoss: 0.15,
    engagement: 5.0,
    weight: 34,
    comfort: 2.0,
    reliability: 0,
    price: 340000,
    blurb: 'Modern torque-converter auto. Faster than you, and it knows it.',
  },
  {
    id: 'dsg-6',
    name: '6-Speed DSG / DCT',
    short: 'DCT',
    gears: 6,
    shiftTime: 0.09,
    driveLoss: 0.16,
    engagement: 6.5,
    weight: 22,
    comfort: 1.0,
    reliability: -6,
    price: 420000,
    blurb: 'Two clutches, brutal upshifts. The quickest way to launch this list.',
  },
  {
    id: 'sequential',
    name: 'Sequential Dogbox',
    short: 'SEQ',
    gears: 6,
    shiftTime: 0.05,
    driveLoss: 0.11,
    engagement: 9.6,
    weight: -8,
    comfort: -4.0,
    reliability: -14,
    price: 780000,
    blurb: 'Flat-shift, no clutch, deafening. Wonderful. Not for traffic.',
  },
]

export const getTransmission = (id) => transmissions.find((t) => t.id === id) ?? null
