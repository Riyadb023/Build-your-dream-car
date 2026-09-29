/**
 * DRIVETRAIN
 * ----------
 *  launch      how much of your power you can actually deploy off the line.
 *              AWD ~0.98, RWD ~0.82, FWD ~0.68 (it just spins the fronts).
 *  tractionCap roughly how many hp this layout can put down before it's
 *              wasting them in wheelspin. Feeds a soft penalty, not a wall.
 *  driftFactor used to detect a DRIFT MACHINE build personality.
 *
 * Converting a car's drivetrain is EXPENSIVE and heavy - that's the tradeoff.
 */

export const drivetrains = [
  {
    id: 'fwd',
    name: 'Front-Wheel Drive',
    short: 'FWD',
    launch: 0.68,
    tractionCap: 300,
    handling: -0.6,
    driftFactor: 0.0,
    weight: 0,
    swapCost: 0,
    reliability: 4,
    blurb: 'Cheap, safe, and torque-steers itself into the next lane past 300 hp.',
  },
  {
    id: 'rwd',
    name: 'Rear-Wheel Drive',
    short: 'RWD',
    launch: 0.82,
    tractionCap: 420,
    handling: 0.4,
    driftFactor: 1.0,
    weight: 40,
    swapCost: 380000,
    reliability: 0,
    blurb: 'Steer with the throttle. The layout every purist asks for.',
  },
  {
    id: 'awd',
    name: 'All-Wheel Drive',
    short: 'AWD',
    launch: 0.98,
    tractionCap: 900,
    handling: 0.2,
    driftFactor: 0.25,
    weight: 85,
    swapCost: 640000,
    reliability: -5,
    blurb: 'Everything hooks up, always. Heavy, complex, unbeatable in the wet.',
  },
]

export const getDrivetrain = (id) => drivetrains.find((d) => d.id === id) ?? null
