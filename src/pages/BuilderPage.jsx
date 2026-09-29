import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Builder from '../components/builder/Builder.jsx'
import CarSelect from '../components/builder/CarSelect.jsx'
import CarPreview from '../components/car/CarPreview.jsx'
import StatsPanel from '../components/car/StatsPanel.jsx'
import BuildActions from '../components/builder/BuildActions.jsx'
import { useCarBuilder } from '../hooks/useCarBuilder.js'
import { buildToQueryString, paramsToBuild } from '../utils/buildSerializer.js'
import styles from './BuilderPage.module.css'

const DRAFT_KEY = 'dcb:draft:v1'

/**
 * BuilderPage
 * ===========
 * Owns the build state and hands slices of it to the presentational
 * components. Also keeps the URL in sync so any build is shareable -
 * the URL IS the save format, no backend required.
 */
export default function BuilderPage({ onSave, garage }) {
  const location = useLocation()
  const navigate = useNavigate()

  // Where the initial build comes from, in priority order:
  //   1. the URL   (someone shared a link with you)
  //   2. sessionStorage (you clicked through to the garage and came back)
  //   3. nothing   (show the car picker)
  //
  // useState's lazy initialiser - not useRef - is the right tool here: it
  // runs exactly once and the value is legal to read during render.
  const [initialBuild] = useState(() => {
    const fromUrl = paramsToBuild(location.search)
    if (fromUrl.car) return fromUrl
    try {
      const cached = window.sessionStorage.getItem(DRAFT_KEY)
      if (cached) {
        const parsed = JSON.parse(cached)
        if (parsed?.car) return parsed
      }
    } catch {
      /* sessionStorage unavailable - fall through to the picker */
    }
    return { car: null }
  })
  const builder = useCarBuilder(initialBuild)

  const { build, stats, rating, personality, warnings, modCount } = builder
  const [justSaved, setJustSaved] = useState(false)

  // Remember the work-in-progress build for this tab.
  useEffect(() => {
    try {
      if (build.car) window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(build))
      else window.sessionStorage.removeItem(DRAFT_KEY)
    } catch {
      /* not worth breaking the app over */
    }
  }, [build])

  // Keep the address bar in step with the build (replace, not push, so the
  // back button doesn't have to walk through every single click).
  useEffect(() => {
    if (!build.car) return
    const qs = buildToQueryString(build)
    if (qs !== location.search.replace(/^\?/, '')) {
      navigate({ pathname: '/', search: `?${qs}` }, { replace: true })
    }
  }, [build, navigate, location.search])

  const handleSave = useCallback(
    (name) => {
      onSave({ ...build, name })
      setJustSaved(true)
      setTimeout(() => setJustSaved(false), 2200)
    },
    [build, onSave],
  )

  if (!build.car) {
    return <CarSelect onSelect={builder.selectCar} onRandom={() => builder.randomize()} />
  }

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <CarPreview
          car={builder.car}
          stats={stats}
          personality={personality}
          resolved={stats.resolved}
        />

        <BuildActions
          build={build}
          stats={stats}
          rating={rating}
          onRandom={() => builder.randomize(build.car)}
          onChangeCar={builder.clearCar}
          onSave={handleSave}
          justSaved={justSaved}
          garageCount={garage.length}
        />

        <StatsPanel stats={stats} rating={rating} warnings={warnings} />
      </div>

      <div className={styles.right}>
        <Builder
          build={build}
          stats={stats}
          modCount={modCount}
          onSelect={builder.selectOption}
          onReset={builder.resetBuild}
        />
      </div>
    </div>
  )
}
