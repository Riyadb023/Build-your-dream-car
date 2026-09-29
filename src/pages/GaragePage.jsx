import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import CarSvg from '../components/car/CarSvg.jsx'
import Icon from '../components/ui/Icon.jsx'
import { getCar } from '../data/cars.js'
import { calculateStats } from '../utils/calculateStats.js'
import { calculateRating, getPersonality } from '../utils/calculateRating.js'
import { buildToQueryString } from '../utils/buildSerializer.js'
import { formatCompactCurrency, formatNumber, formatSeconds } from '../utils/format.js'
import styles from './GaragePage.module.css'

/**
 * GaragePage
 * ==========
 * Saved builds from localStorage. Each card re-runs the stats engine on the
 * stored ids rather than storing computed numbers - so if the formulas are
 * ever tuned, every saved build updates itself. Storing derived data would
 * have frozen old builds with stale numbers forever.
 */
export default function GaragePage({ garage, onDelete, onRename }) {
  const [editing, setEditing] = useState(null)
  const [draft, setDraft] = useState('')

  const enriched = useMemo(
    () =>
      garage.map((b) => {
        const stats = calculateStats(b)
        return {
          build: b,
          car: getCar(b.car),
          stats,
          rating: calculateRating(stats),
          personality: getPersonality(stats),
        }
      }),
    [garage],
  )

  if (!garage.length) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>
          <Icon name="garage" size={30} />
        </div>
        <h1>Your garage is empty</h1>
        <p>
          Builds you save are stored in this browser — no account, no server. Build something
          and hit save.
        </p>
        <Link to="/" className={styles.cta}>
          <Icon name="wheel" size={15} />
          Start building
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <div>
          <p className="eyebrow">Saved locally · {garage.length} builds</p>
          <h1>My Garage</h1>
        </div>
      </header>

      <ul className={styles.grid}>
        {enriched.map(({ build, car, stats, rating, personality }) => {
          if (!car) return null
          const r = stats.resolved
          return (
            <li key={build.id} className={styles.card}>
              <div className={styles.art}>
                <CarSvg
                  car={car}
                  color={r.color}
                  wheel={r.wheels}
                  suspension={r.suspension}
                  aero={r.aero}
                  exhaust={r.exhaust}
                  brake={r.brakes}
                  tire={r.tires}
                  animate={false}
                />
                <span className={styles.score} title="Build rating">
                  <b className="mono">{rating.total}</b>
                </span>
              </div>

              <div className={styles.info}>
                {editing === build.id ? (
                  <form
                    className={styles.renameRow}
                    onSubmit={(e) => {
                      e.preventDefault()
                      onRename(build.id, draft.trim() || build.name)
                      setEditing(null)
                    }}
                  >
                    <input
                      autoFocus
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      maxLength={40}
                      aria-label="Rename build"
                    />
                    <button type="submit" aria-label="Save name">
                      <Icon name="check" size={13} />
                    </button>
                  </form>
                ) : (
                  <div className={styles.nameRow}>
                    <h2>{build.name || 'Untitled build'}</h2>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(build.id)
                        setDraft(build.name ?? '')
                      }}
                      aria-label={`Rename ${build.name}`}
                      className={styles.iconBtn}
                    >
                      <Icon name="sliders" size={12} />
                    </button>
                  </div>
                )}

                <p className={styles.sub}>
                  {car.shortName}
                  {personality && (
                    <span style={{ color: personality.accent }}> · {personality.name}</span>
                  )}
                </p>

                <dl className={styles.specs}>
                  <div>
                    <dt>Power</dt>
                    <dd className="mono">{formatNumber(stats.power)} hp</dd>
                  </div>
                  <div>
                    <dt>Weight</dt>
                    <dd className="mono">{formatNumber(stats.weight)} kg</dd>
                  </div>
                  <div>
                    <dt>0–100</dt>
                    <dd className="mono">{formatSeconds(stats.acceleration)}s</dd>
                  </div>
                  <div>
                    <dt>Cost</dt>
                    <dd className="mono">{formatCompactCurrency(stats.price)}</dd>
                  </div>
                </dl>

                <div className={styles.actions}>
                  <Link to={`/?${buildToQueryString(build)}`} className={styles.open}>
                    Open <Icon name="arrowRight" size={12} />
                  </Link>
                  <button
                    type="button"
                    className={styles.del}
                    onClick={() => onDelete(build.id)}
                    aria-label={`Delete ${build.name}`}
                  >
                    <Icon name="trash" size={13} />
                  </button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
