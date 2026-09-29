import { useCallback, useMemo, useState } from 'react'
import { categories, categoryKeys, categoryMap, getOption } from '../data/categories.js'
import { cars, getCar } from '../data/cars.js'
import { calculateStats } from '../utils/calculateStats.js'
import { calculateRating, getPersonality } from '../utils/calculateRating.js'
import { getBuildWarnings, isCompatible } from '../utils/compatibility.js'

/**
 * useCarBuilder
 * =============
 * THE central piece of state in the app, and deliberately the ONLY one.
 *
 * The build holds ids and nothing else:
 *   { car: 'bmw-e46-m3', engine: 's54', wheels: 'te37', ... }
 *
 * Every number the UI shows - power, weight, 0-100, price, rating,
 * personality, warnings - is DERIVED from that with useMemo. Nothing is
 * duplicated into extra useState, so nothing can ever disagree with
 * anything else. Change one id, the entire app recomputes.
 *
 * That's the single most important idea in the whole project:
 *   store the source of truth, derive everything else.
 */

/** A build with a car selected but every part at its factory default. */
export function createStockBuild(carId) {
  const car = getCar(carId)
  if (!car) return { car: null }
  return {
    car: car.id,
    engine: car.stockEngine,
    tune: 'stock',
    transmission: car.stockTransmission,
    drivetrain: car.drivetrain,
    wheels: 'oem',
    tires: 'street',
    suspension: 'stock',
    brakes: 'stock',
    exhaust: 'stock',
    aero: 'stock',
    interior: 'stock',
    color: 'alpine-white',
  }
}

export const EMPTY_BUILD = { car: null }

export function useCarBuilder(initialBuild = EMPTY_BUILD) {
  const [build, setBuild] = useState(initialBuild)

  /**
   * Pick a base car. This RESETS the parts to that car's factory spec,
   * because a build is only meaningful relative to its chassis - carrying
   * an S54 over to a Golf would be nonsense.
   */
  const selectCar = useCallback((carId) => {
    setBuild(createStockBuild(carId))
  }, [])

  /** Select one part. The classic immutable update. */
  const selectOption = useCallback((categoryKey, optionId) => {
    setBuild((prev) => ({ ...prev, [categoryKey]: optionId }))
  }, [])

  const resetBuild = useCallback(() => {
    setBuild((prev) => (prev.car ? createStockBuild(prev.car) : EMPTY_BUILD))
  }, [])

  const clearCar = useCallback(() => setBuild(EMPTY_BUILD), [])

  const loadBuild = useCallback((next) => {
    setBuild(next?.car ? { ...createStockBuild(next.car), ...next } : EMPTY_BUILD)
  }, [])

  const renameBuild = useCallback((name) => {
    setBuild((prev) => ({ ...prev, name }))
  }, [])

  /**
   * Random, but only ever produces a build that actually fits together.
   *
   * Order matters: some engines only fit certain LAYOUTS, so the drivetrain
   * has to be decided before the engine is chosen. Picking categories in
   * declaration order let the randomiser choose an RB26 and then switch the
   * car to FWD underneath it. Deciding the constraining categories first,
   * then re-validating at the end, fixes it.
   */
  const randomize = useCallback((carId) => {
    const car = carId ? getCar(carId) : cars[Math.floor(Math.random() * cars.length)]
    const next = createStockBuild(car.id)

    const pick = (key) => {
      const category = categoryMap[key]
      const legal = category.options.filter((o) => isCompatible(o, next).ok)
      if (legal.length) next[key] = legal[Math.floor(Math.random() * legal.length)].id
    }

    pick('drivetrain')

    for (const category of categories) {
      if (category.key !== 'drivetrain') pick(category.key)
    }

    const stock = createStockBuild(car.id)
    for (const category of categories) {
      if (!isCompatible(getOption(category.key, next[category.key]), next).ok) {
        next[category.key] = stock[category.key]
      }
    }

    setBuild(next)
  }, [])

  const stats = useMemo(() => calculateStats(build), [build])
  const rating = useMemo(() => calculateRating(stats), [stats])
  const personality = useMemo(() => getPersonality(stats), [stats])
  const warnings = useMemo(() => getBuildWarnings(stats), [stats])

  /** How much of the build has been changed away from factory spec. */
  const modCount = useMemo(() => {
    if (!build.car) return 0
    const stock = createStockBuild(build.car)
    return categoryKeys.filter((k) => build[k] && build[k] !== stock[k]).length
  }, [build])

  return {
    build,
    setBuild,
    selectCar,
    selectOption,
    resetBuild,
    clearCar,
    loadBuild,
    renameBuild,
    randomize,
    stats,
    rating,
    personality,
    warnings,
    modCount,
    car: getCar(build.car),
  }
}
