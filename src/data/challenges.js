/**
 * CHALLENGES
 * ==========
 * A challenge is a budget plus a list of requirements. Each requirement
 * carries its own `test` function and a `format` for displaying progress.
 *
 * Writing them as data (rather than a big validate() with if-statements)
 * means the UI can render ANY challenge generically: it just walks the
 * requirements, runs each test, and shows a tick or a cross. Adding a new
 * challenge is adding an object - no component changes.
 *
 * ON THE BUDGETS
 * --------------
 * These are not guesses. scripts/logicCheck.mjs searches for the cheapest
 * build that satisfies each requirement list, and every budget here sits
 * roughly 30% above that number. That margin is the whole design:
 *
 *   too low  -> the challenge is mathematically impossible (two of these
 *               originally were, by less than 5%, which is exactly the kind
 *               of bug you cannot see by reading the code)
 *   too high -> the budget stops being a constraint and the challenge
 *               collapses into "meet the specs", which is no fun
 *
 * If you retune prices or physics, re-run the harness: it fails the build
 * if any challenge becomes unreachable.
 */

export const challenges = [
  {
    id: 'budget-sprint',
    name: 'The Budget Sprint',
    icon: '💰',
    tagline: 'Cheap and genuinely quick. Pick your battles.',
    budget: 2_100_000,
    xp: 200,
    requirements: [
      {
        id: 'accel',
        label: '0–100 under 5.5s',
        test: (s) => s.acceleration <= 5.5,
        progress: (s) => `${s.acceleration?.toFixed(2) ?? '—'}s`,
      },
      {
        id: 'reliable',
        label: 'Reliability 60% or better',
        test: (s) => s.reliability >= 60,
        progress: (s) => `${Math.round(s.reliability)}%`,
      },
    ],
  },
  {
    id: 'track-weapon',
    name: 'Track Weapon',
    icon: '🏁',
    tagline: 'A car that can do twenty laps without cooking itself.',
    budget: 2_900_000,
    xp: 350,
    requirements: [
      {
        id: 'power',
        label: 'Over 350 hp',
        test: (s) => s.power > 350,
        progress: (s) => `${s.power} hp`,
      },
      {
        id: 'handling',
        label: 'Handling 8.0 or better',
        test: (s) => s.handling >= 8,
        progress: (s) => s.handling.toFixed(1),
      },
      {
        id: 'weight',
        label: 'Under 1,450 kg',
        test: (s) => s.weight < 1450,
        progress: (s) => `${s.weight} kg`,
      },
      {
        id: 'brakes',
        label: 'Serious brakes fitted',
        test: (s) => (s.resolved?.brakes?.stoppingPower ?? 0) >= 2.6,
        progress: (s) => s.resolved?.brakes?.short ?? '—',
      },
    ],
  },
  {
    id: 'sleeper',
    name: 'The Sleeper',
    icon: '🤫',
    tagline: 'Devastating pace. Absolutely nothing to look at.',
    budget: 2_400_000,
    xp: 400,
    requirements: [
      {
        id: 'power',
        label: 'At least 420 hp',
        test: (s) => s.power >= 420,
        progress: (s) => `${s.power} hp`,
      },
      {
        id: 'wheels',
        label: 'Factory wheels only',
        test: (s) => s.resolved?.wheels?.id === 'oem',
        progress: (s) => s.resolved?.wheels?.short ?? '—',
      },
      {
        id: 'aero',
        label: 'No visible aero',
        test: (s) => s.resolved?.aero?.id === 'stock',
        progress: (s) => s.resolved?.aero?.short ?? '—',
      },
      {
        id: 'quiet',
        label: 'Discreet paint',
        test: (s) => ['alpine-white', 'jet-black', 'nardo-grey'].includes(s.resolved?.color?.id),
        progress: (s) => s.resolved?.color?.name ?? '—',
      },
    ],
  },
  {
    id: 'drift-missile',
    name: 'Drift Missile',
    icon: '💨',
    tagline: 'Rear drive, loose rubber, and enough power to hold the angle.',
    budget: 2_400_000,
    xp: 300,
    requirements: [
      {
        id: 'rwd',
        label: 'Rear-wheel drive',
        test: (s) => s.resolved?.drivetrain?.id === 'rwd',
        progress: (s) => s.resolved?.drivetrain?.short ?? '—',
      },
      {
        id: 'power',
        label: 'Over 380 hp',
        test: (s) => s.power > 380,
        progress: (s) => `${s.power} hp`,
      },
      {
        id: 'tires',
        label: 'Tyres that let go on purpose',
        test: (s) => (s.resolved?.tires?.slip ?? 0) >= 0.9,
        progress: (s) => s.resolved?.tires?.short ?? '—',
      },
      {
        id: 'manual',
        label: 'Manual or sequential gearbox',
        test: (s) => (s.resolved?.transmission?.engagement ?? 0) >= 8,
        progress: (s) => s.resolved?.transmission?.short ?? '—',
      },
    ],
  },
  {
    id: 'grand-tourer',
    name: 'The Grand Tourer',
    icon: '🥂',
    tagline: 'Fast, quiet and civilised enough to cross a continent.',
    budget: 2_700_000,
    xp: 320,
    requirements: [
      {
        id: 'comfort',
        label: 'Comfort 7.0 or better',
        test: (s) => s.comfort >= 7,
        progress: (s) => s.comfort.toFixed(1),
      },
      {
        id: 'top',
        label: 'Top speed over 270 km/h',
        test: (s) => s.topSpeed > 270,
        progress: (s) => `${s.topSpeed} km/h`,
      },
      {
        id: 'reliable',
        label: 'Reliability 65% or better',
        test: (s) => s.reliability >= 65,
        progress: (s) => `${Math.round(s.reliability)}%`,
      },
      {
        id: 'legal',
        label: 'Road legal',
        test: (s) => s.streetLegal,
        progress: (s) => (s.streetLegal ? 'Legal' : 'Illegal'),
      },
    ],
  },
  {
    id: 'giant-killer',
    name: 'Giant Killer',
    icon: '🔥',
    tagline: 'Under two million. Over 300 hp per tonne. Go.',
    budget: 2_700_000,
    xp: 450,
    requirements: [
      {
        id: 'ptw',
        label: 'Over 300 hp per tonne',
        test: (s) => s.powerPerTonne > 300,
        progress: (s) => `${Math.round(s.powerPerTonne)} hp/t`,
      },
      {
        id: 'handling',
        label: 'Handling 7.5 or better',
        test: (s) => s.handling >= 7.5,
        progress: (s) => s.handling.toFixed(1),
      },
      {
        id: 'usable',
        label: 'Not a grenade (reliability 45%+)',
        test: (s) => s.reliability >= 45,
        progress: (s) => `${Math.round(s.reliability)}%`,
      },
    ],
  },
]

/** Evaluate a challenge against a set of stats. Pure, testable, no UI. */
export function evaluateChallenge(challenge, stats) {
  if (!stats?.valid) {
    return { met: [], passed: false, withinBudget: false, completion: 0 }
  }
  const met = challenge.requirements.map((r) => ({
    ...r,
    ok: Boolean(r.test(stats)),
    value: r.progress(stats),
  }))
  const withinBudget = stats.price <= challenge.budget
  const passed = withinBudget && met.every((m) => m.ok)
  const completion =
    (met.filter((m) => m.ok).length + (withinBudget ? 1 : 0)) / (met.length + 1)

  return { met, passed, withinBudget, completion }
}
