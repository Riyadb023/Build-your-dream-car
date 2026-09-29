import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon.jsx'
import { challenges, evaluateChallenge } from '../data/challenges.js'
import { calculateStats } from '../utils/calculateStats.js'
import { formatCompactCurrency } from '../utils/format.js'
import styles from './ChallengesPage.module.css'

/**
 * ChallengesPage
 * ==============
 * Runs every saved garage build against every challenge and shows the best
 * attempt. All the logic lives in data/challenges.js - this file only maps
 * over requirements and renders ticks, so new challenges need no code here.
 */
export default function ChallengesPage({ garage }) {
  const results = useMemo(() => {
    const scored = garage.map((b) => ({ build: b, stats: calculateStats(b) }))

    return challenges.map((challenge) => {
      let best = null
      for (const entry of scored) {
        const evaluated = evaluateChallenge(challenge, entry.stats)
        if (!best || evaluated.completion > best.evaluated.completion) {
          best = { ...entry, evaluated }
        }
      }
      return { challenge, best }
    })
  }, [garage])

  const completed = results.filter((r) => r.best?.evaluated.passed).length
  const xp = results.reduce(
    (sum, r) => sum + (r.best?.evaluated.passed ? r.challenge.xp : 0),
    0,
  )

  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <div>
          <p className="eyebrow">
            {completed} of {challenges.length} complete · {xp} XP
          </p>
          <h1>Challenges</h1>
          <p className={styles.lede}>
            Briefs with a budget and a spec to hit. Save a build in your garage and it&rsquo;s
            checked against every challenge automatically.
          </p>
        </div>
      </header>

      {!garage.length && (
        <div className={styles.hint}>
          <Icon name="info" size={15} />
          <span>
            No saved builds yet — <Link to="/">build something</Link> and save it to start
            completing these.
          </span>
        </div>
      )}

      <ul className={styles.grid}>
        {results.map(({ challenge, best }) => {
          const evaluated = best?.evaluated
          const passed = evaluated?.passed
          return (
            <li
              key={challenge.id}
              className={`${styles.card} ${passed ? styles.passed : ''}`}
            >
              <header className={styles.cardHead}>
                <span className={styles.icon} aria-hidden="true">
                  {challenge.icon}
                </span>
                <div className={styles.titles}>
                  <h2>{challenge.name}</h2>
                  <p>{challenge.tagline}</p>
                </div>
                {passed && (
                  <span className={styles.done}>
                    <Icon name="check" size={12} strokeWidth={3} />
                  </span>
                )}
              </header>

              <div className={styles.budget}>
                <span className="eyebrow">Budget</span>
                <strong className="mono">{formatCompactCurrency(challenge.budget)} DA</strong>
              </div>

              <ul className={styles.reqs}>
                <li className={evaluated?.withinBudget ? styles.ok : styles.no}>
                  <Icon name={evaluated?.withinBudget ? 'check' : 'x'} size={12} strokeWidth={2.6} />
                  <span>Within budget</span>
                  {best && (
                    <b className="mono">{formatCompactCurrency(best.stats.price)}</b>
                  )}
                </li>
                {(evaluated?.met ?? challenge.requirements).map((r) => (
                  <li key={r.id} className={r.ok ? styles.ok : styles.no}>
                    <Icon name={r.ok ? 'check' : 'x'} size={12} strokeWidth={2.6} />
                    <span>{r.label}</span>
                    {r.value != null && <b className="mono">{r.value}</b>}
                  </li>
                ))}
              </ul>

              <footer className={styles.foot}>
                {best ? (
                  <span className={styles.best}>
                    Best: <b>{best.build.name || 'Untitled'}</b>
                  </span>
                ) : (
                  <span className={styles.best}>No attempt yet</span>
                )}
                <span className={styles.xp}>+{challenge.xp} XP</span>
              </footer>

              <div
                className={styles.progress}
                style={{ '--p': `${(evaluated?.completion ?? 0) * 100}%` }}
                aria-hidden="true"
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
