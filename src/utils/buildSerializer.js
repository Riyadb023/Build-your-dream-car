import { categoryKeys, categoryMap } from '../data/categories.js'
import { cars } from '../data/cars.js'

/**
 * BUILD <-> URL
 * =============
 * Turns a build object into a shareable query string and back again.
 *
 * Validating on the way IN is the important part: a URL is untrusted input.
 * Someone can hand-edit ?engine=banana and the app must not explode - it just
 * drops the unknown value and carries on.
 */

export function buildToParams(build) {
  const params = new URLSearchParams()
  if (build.car) params.set('car', build.car)
  for (const key of categoryKeys) {
    if (build[key]) params.set(key, build[key])
  }
  if (build.name) params.set('name', build.name)
  return params
}

export const buildToQueryString = (build) => buildToParams(build).toString()

/** Parse a query string back into a build, discarding anything invalid. */
export function paramsToBuild(search) {
  const params = new URLSearchParams(search)
  const build = {}

  const carId = params.get('car')
  if (carId && cars.some((c) => c.id === carId)) build.car = carId

  for (const key of categoryKeys) {
    const value = params.get(key)
    if (!value) continue
    if (categoryMap[key].options.some((o) => o.id === value)) {
      build[key] = value
    }
  }

  const name = params.get('name')
  if (name) build.name = name.slice(0, 60)

  return build
}

/** Is there actually a build encoded in this URL? */
export const hasBuildParams = (search) => Boolean(paramsToBuild(search).car)

export function buildShareUrl(build, origin = window.location.origin) {
  return `${origin}/builder?${buildToQueryString(build)}`
}
