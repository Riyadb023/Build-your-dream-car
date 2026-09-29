import { clamp, mapRange } from './format.js'

/**
 * BUILD RATING + PERSONALITY
 * ==========================
 * Two ideas here, and they're different on purpose:
 *
 *  1. RATING is objective-ish. How good is this car, on a 0-100 scale?
 *     Deliberately punishes an unusable car: 900 hp with 12% reliability
 *     and no brakes is NOT a 95/100 build.
 *
 *  2. PERSONALITY is a *classification*, not a score. It looks at the shape
 *     of the build and names it. A Luxury Cruiser isn't worse than a Track
 *     Monster - it's a different answer to a different question.
 */

/** Weighted average -> 0-100 overall score */
export function calculateRating(stats) {
  if (!stats.valid) return { total: 0, breakdown: {} }

  const breakdown = {
    power: clamp(stats.scores.power, 0, 100),
    acceleration: clamp(stats.scores.acceleration, 0, 100),
    handling: clamp(stats.scores.handling, 0, 100),
    style: clamp(stats.scores.style, 0, 100),
    comfort: clamp(stats.scores.comfort, 0, 100),
    reliability: clamp(stats.scores.reliability, 0, 100),
  }

  // Value: performance per DA spent. Rewards a clever cheap build.
  const perf = (breakdown.power + breakdown.acceleration + breakdown.handling) / 3
  const millions = stats.price / 1_000_000
  breakdown.value = Math.round(clamp(mapRange(perf / Math.max(0.35, millions), 8, 46, 5, 100), 0, 100))

  const weights = {
    power: 0.16,
    acceleration: 0.18,
    handling: 0.2,
    style: 0.16,
    comfort: 0.08,
    reliability: 0.12,
    value: 0.1,
  }

  let total = 0
  for (const [key, weight] of Object.entries(weights)) {
    total += (breakdown[key] ?? 0) * weight
  }

  // --- Penalties: a car has to actually WORK ---------------------------
  // A build that can't be driven shouldn't score like one that can.
  if (stats.reliability < 25) total -= (25 - stats.reliability) * 0.55
  if (stats.tractionLimited) total -= 4
  if (!stats.streetLegal) total -= 2

  // Reward genuine coherence: fast AND capable of stopping/turning.
  if (breakdown.handling > 70 && breakdown.acceleration > 70) total += 3

  return {
    total: Math.round(clamp(total, 1, 100)),
    breakdown,
  }
}

/**
 * BUILD PERSONALITY
 * Each archetype scores itself against the build; highest score wins.
 * Adding a new personality = adding one object. No if-else chains.
 */
const ARCHETYPES = [
  {
    id: 'track-monster',
    name: 'Track Monster',
    icon: '🏁',
    accent: '#ff5c33',
    blurb: 'Stripped, stiff and aero-laden. Built to hunt lap times, miserable on the way there.',
    score: (s, p) =>
      s.handling * 8 +
      (p.aero?.downforce ?? 0) * 3.4 +
      (p.interior?.race ?? 0) * 3.2 +
      (p.tires?.grip ?? 0) * 5 +
      (p.brakes?.fade ?? 0) * 3.4 -
      s.comfort * 3.6,
  },
  {
    id: 'drift-machine',
    name: 'Drift Machine',
    icon: '💨',
    accent: '#c77dff',
    blurb: 'Rear-drive, loose rubber and angle. Points are for style, not lap times.',
    score: (s, p) =>
      (p.drivetrain?.driftFactor ?? 0) * 26 +
      (p.tires?.slip ?? 0) * 24 +
      s.power * 0.045 +
      (p.suspension?.handling ?? 0) * 2.6 -
      (p.aero?.downforce ?? 0) * 2.2,
  },
  {
    id: 'sleeper',
    name: 'Sleeper',
    icon: '🤫',
    accent: '#7dd3fc',
    blurb: 'Looks like your neighbour\u2019s car. Isn\u2019t. The best kind of fast.',
    score: (s, p) => {
      // NB the parentheses: `a ?? 0 > -35` parses as `a ?? (0 > -35)`, which
      // is always truthy and silently broke this check.
      const nearStockRide = (p.suspension?.rideHeight ?? 0) > -35
      const looksStock =
        (p.wheels?.id === 'oem' ? 22 : 0) +
        (p.aero?.id === 'stock' ? 22 : 0) +
        (nearStockRide ? 12 : 0) +
        (['alpine-white', 'jet-black', 'nardo-grey'].includes(p.color?.id) ? 10 : 0)

      // A sleeper is defined by the GAP between how it looks and how it goes.
      // Scoring the surprise itself is what separates it from a fast car that
      // merely happens to be comfortable (which is a Grand Tourer).
      const anonymity = looksStock / 66 // 0..1
      const surprise = Math.max(0, s.power - 300) * 0.16 * anonymity

      // Specialist rubber gives the game away: nobody fits drift compound or
      // semi-slicks to a car they want to look ordinary.
      const giveaway =
        ((p.tires?.slip ?? 0) >= 0.9 ? 22 : 0) + ((p.tires?.grip ?? 0) >= 3 ? 16 : 0)

      return looksStock + surprise - giveaway - (p.exhaust?.sound ?? 0) * 3.5
    },
  },
  {
    id: 'luxury-cruiser',
    name: 'Luxury Cruiser',
    icon: '🥂',
    accent: '#d4b03a',
    blurb: 'Effortless pace, quiet cabin, nothing to prove. Crosses countries without breaking a sweat.',
    score: (s, p) =>
      s.comfort * 8.5 +
      (p.interior?.luxury ?? 0) * 3.4 +
      (p.transmission?.comfort ?? 0) * 5 +
      s.reliability * 0.24 -
      Math.max(0, 6 - s.comfort) * 6,
  },
  {
    id: 'show-car',
    name: 'Show Car',
    icon: '✨',
    accent: '#f472b6',
    blurb: 'Built for the stand, the camera and the crowd. Function is a rumour.',
    score: (s, p) =>
      s.style * 8.6 +
      Math.abs(p.suspension?.rideHeight ?? 0) * 0.18 +
      (p.wheels?.style ?? 0) * 4.4 +
      (p.color?.style ?? 0) * 4.2 +
      (p.suspension?.id === 'air' ? 20 : 0) -
      s.handling * 2.4,
  },
  {
    id: 'street-build',
    name: 'Street Build',
    icon: '🌆',
    accent: '#4ade80',
    blurb: 'The all-rounder. Quick enough, comfortable enough, and you can drive it every day.',
    // Rewards balance: high MINIMUM across the board, not one spike.
    score: (s) => {
      const balance = Math.min(s.handling, s.comfort, s.power / 55, s.reliability / 11)
      return balance * 14 + (s.streetLegal ? 8 : -10)
    },
  },
  {
    id: 'dragster',
    name: 'Straight-Line Weapon',
    icon: '🚀',
    accent: '#fb923c',
    blurb: 'All of the power, none of the corners. Lives for the quarter mile.',
    score: (s, p) =>
      s.power * 0.085 +
      (p.drivetrain?.launch ?? 0) * 26 +
      Math.max(0, 6.5 - (s.acceleration ?? 9)) * 12 -
      s.handling * 2.6 -
      (p.aero?.downforce ?? 0) * 1.6,
  },
]

export function getPersonality(stats) {
  if (!stats.valid || !stats.resolved) return null
  const p = stats.resolved

  const ranked = ARCHETYPES.map((a) => ({ ...a, value: a.score(stats, p) })).sort(
    (x, y) => y.value - x.value,
  )

  return { ...ranked[0], runnerUp: ranked[1] }
}

export { ARCHETYPES }
