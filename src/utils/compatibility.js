import { getCar } from '../data/cars.js'

/**
 * COMPATIBILITY RULES
 * ===================
 * "Not every modification should be compatible with every car."
 *
 * Rather than scatter `if (car === 'e46' && engine === 'k20')` through the UI,
 * every engine declares what it fits and ONE function interprets that.
 *
 * A `fits` object supports:
 *    { all: true }                    -> universal
 *    { cars: ['bmw-e46-m3'] }         -> specific cars
 *    { platforms: ['bmw-e46'] }       -> whole chassis families
 *    { drivetrains: ['rwd','awd'] }   -> layout requirement
 * Rules are OR'd together: matching any one of them is enough.
 */
export function isCompatible(option, build) {
  const rule = option?.fits
  if (!rule) return { ok: true }
  if (rule.all) return { ok: true }

  const car = getCar(build.car)
  if (!car) return { ok: true }

  if (rule.cars?.includes(car.id)) return { ok: true }
  if (rule.platforms?.includes(car.platform)) return { ok: true }
  if (rule.drivetrains?.includes(build.drivetrain ?? car.drivetrain)) return { ok: true }

  // Build a human-readable reason instead of just "incompatible".
  const reasons = []
  if (rule.platforms?.length) reasons.push(`${rule.platforms.join(' / ')} chassis`)
  if (rule.cars?.length) reasons.push('specific chassis only')
  if (rule.drivetrains?.length) reasons.push(`${rule.drivetrains.join('/').toUpperCase()} layouts`)

  return {
    ok: false,
    reason: reasons.length ? `Requires ${reasons.join(' or ')}` : "Doesn't fit this chassis",
  }
}

/** Filter a list of options down to the ones that fit the current build. */
export const compatibleOptions = (options, build) =>
  options.filter((o) => isCompatible(o, build).ok)

/**
 * Cross-category warnings. These do NOT block the user - they're advice.
 * Letting someone build something stupid (and telling them why it's stupid)
 * is far more interesting than preventing it.
 */
export function getBuildWarnings(stats) {
  const warnings = []
  if (!stats.valid) return warnings
  const p = stats.resolved

  if (stats.tractionLimited) {
    warnings.push({
      level: 'warn',
      title: 'Traction limited',
      text: `${stats.power} hp through ${p.drivetrain?.short ?? 'this layout'} on ${
        p.tires?.short ?? 'these tyres'
      } is more than the contact patch can take. Stickier tyres or AWD would cut your 0-100.`,
    })
  }

  if (stats.reliability < 30) {
    warnings.push({
      level: 'danger',
      title: 'Grenade waiting to happen',
      text: `${Math.round(stats.reliability)}% reliability. This build is a trailer queen — plan for a rebuild, not a road trip.`,
    })
  }

  if (stats.power > 380 && (p.brakes?.stoppingPower ?? 0) < 1) {
    warnings.push({
      level: 'warn',
      title: 'All go, no stop',
      text: `${stats.power} hp on factory brakes. Pads and fluid are the cheapest upgrade on the page.`,
    })
  }

  if ((p.tires?.grip ?? 0) < 0 && stats.power > 280) {
    warnings.push({
      level: 'warn',
      title: 'Tyres are the weak link',
      text: 'Budget rubber undoes everything else you just paid for. Tyres first, always.',
    })
  }

  if (!stats.streetLegal) {
    warnings.push({
      level: 'info',
      title: 'Not road legal',
      text: 'A straight pipe with no cat will fail inspection and annoy every neighbour you have.',
    })
  }

  if ((p.aero?.downforce ?? 0) > 5 && stats.topSpeed < 240) {
    warnings.push({
      level: 'info',
      title: 'Draggy',
      text: 'That much wing costs real top speed. Worth it on track, pointless on a straight road.',
    })
  }

  if (stats.drivetrainChanged) {
    warnings.push({
      level: 'info',
      title: 'Drivetrain conversion',
      text: `Converting to ${p.drivetrain?.short} means custom mounts, driveshafts and a lot of fabrication. Priced in, but it hurts reliability.`,
    })
  }

  return warnings
}
