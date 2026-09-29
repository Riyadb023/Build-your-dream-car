/**
 * ECU / TUNE
 * ----------
 * A tune is a MULTIPLIER, not a flat number, and it differs by aspiration.
 * Remapping a turbo car is transformative (+22%); remapping an NA engine
 * gets you almost nothing (+3%) and every car person knows it.
 *
 *  gain.turbo / gain.na   power multiplier applied on top of engine power
 *  reliability            flat hit to the reliability score
 *  boostStress            extra reliability damage scaled by how much power
 *                         you're making (see calculateStats) - big power on
 *                         a big tune is how engines actually die.
 */

export const tunes = [
  {
    id: 'stock',
    name: 'Factory ECU',
    short: 'Stock',
    gain: { na: 1.0, turbo: 1.0, supercharged: 1.0 },
    torqueGain: 1.0,
    reliability: 0,
    boostStress: 0,
    weight: 0,
    price: 0,
    blurb: 'Untouched. Whatever the factory signed off on.',
  },
  {
    id: 'stage-1',
    name: 'Stage 1 Remap',
    short: 'Stage 1',
    gain: { na: 1.03, turbo: 1.22, supercharged: 1.14 },
    torqueGain: 1.24,
    reliability: -4,
    boostStress: 0.5,
    weight: 0,
    price: 60000,
    blurb: 'Software only. On a turbo car this is the single best value modification.',
  },
  {
    id: 'stage-2',
    name: 'Stage 2 (bolt-ons + map)',
    short: 'Stage 2',
    gain: { na: 1.07, turbo: 1.38, supercharged: 1.24 },
    torqueGain: 1.4,
    reliability: -11,
    boostStress: 1.0,
    weight: -4,
    price: 180000,
    blurb: 'Intake, intercooler, downpipe and a proper map. Needs supporting mods.',
  },
  {
    id: 'stage-3',
    name: 'Stage 3 (built + big turbo)',
    short: 'Stage 3',
    gain: { na: 1.12, turbo: 1.62, supercharged: 1.4 },
    torqueGain: 1.7,
    reliability: -24,
    boostStress: 1.8,
    weight: 12,
    price: 520000,
    blurb: 'Forged internals, larger turbo, standalone ECU. No longer a daily.',
  },
  {
    id: 'full-race',
    name: 'Motorsport Calibration',
    short: 'Full Race',
    gain: { na: 1.18, turbo: 1.85, supercharged: 1.55 },
    torqueGain: 1.95,
    reliability: -38,
    boostStress: 2.6,
    weight: 8,
    price: 950000,
    blurb: 'Built for one thing: a timing sheet. Rebuild interval measured in hours.',
  },
]

export const getTune = (id) => tunes.find((t) => t.id === id) ?? null
