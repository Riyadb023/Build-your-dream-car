import Icon from '../ui/Icon.jsx'
import StatBar from '../ui/StatBar.jsx'
import { formatNumber, formatScore, formatSeconds } from '../../utils/format.js'
import styles from './StatsPanel.module.css'

/**
 * StatsPanel
 * ==========
 * The instrument cluster. Bars for the feel-based scores, hard numbers for
 * the measurable ones, plus the overall rating.
 *
 * Like CarPreview, it calculates NOTHING. It is handed `stats` and `rating`
 * and renders them.
 */
export default function StatsPanel({ stats, rating, warnings = [] }) {
  if (!stats.valid) return null

  const bars = [
    { key: 'power', label: 'Power', value: rating.breakdown.power, tone: 'var(--accent)' },
    {
      key: 'acceleration',
      label: 'Acceleration',
      value: rating.breakdown.acceleration,
      tone: 'var(--amber)',
    },
    { key: 'handling', label: 'Handling', value: rating.breakdown.handling, tone: 'var(--cyan)' },
    { key: 'style', label: 'Style', value: rating.breakdown.style, tone: 'var(--purple)' },
    { key: 'comfort', label: 'Comfort', value: rating.breakdown.comfort, tone: 'var(--green)' },
    {
      key: 'reliability',
      label: 'Reliability',
      value: rating.breakdown.reliability,
      tone: stats.reliability < 35 ? 'var(--red)' : 'var(--green)',
    },
    { key: 'value', label: 'Value', value: rating.breakdown.value, tone: 'var(--text-2)' },
  ]

  const figures = [
    { label: 'Power', value: formatNumber(stats.power), unit: 'hp' },
    { label: 'Torque', value: formatNumber(stats.torque), unit: 'Nm' },
    { label: 'Weight', value: formatNumber(stats.weight), unit: 'kg' },
    { label: 'Power / tonne', value: formatNumber(stats.powerPerTonne), unit: 'hp/t' },
    { label: '0–100 km/h', value: formatSeconds(stats.acceleration), unit: 's' },
    { label: 'Top speed', value: formatNumber(stats.topSpeed), unit: 'km/h' },
    { label: '100–0 braking', value: formatNumber(stats.braking), unit: 'm' },
    { label: 'Grip', value: formatScore(stats.grip), unit: '/10' },
    { label: 'Drag (Cd)', value: stats.drag.toFixed(3), unit: '' },
    { label: 'Reliability', value: formatNumber(stats.reliability), unit: '%' },
  ]

  return (
    <section className={styles.wrap} aria-label="Build statistics">
      <header className={styles.head}>
        <div className={styles.score}>
          <span className="eyebrow">Build rating</span>
          <div className={styles.scoreValue}>
            <strong className="mono">{rating.total}</strong>
            <em>/100</em>
          </div>
        </div>
        <div
          className={styles.ring}
          style={{ '--pct': rating.total }}
          role="img"
          aria-label={`Overall rating ${rating.total} out of 100`}
        >
          <span className="mono">{rating.total}</span>
        </div>
      </header>

      <div className={styles.bars}>
        {bars.map((b) => (
          <StatBar key={b.key} label={b.label} value={b.value} tone={b.tone} />
        ))}
      </div>

      {warnings.length > 0 && (
        <ul className={styles.warnings}>
          {warnings.map((w) => (
            <li key={w.title} className={styles[w.level]}>
              <Icon name={w.level === 'info' ? 'info' : 'warning'} size={14} />
              <div>
                <strong>{w.title}</strong>
                <p>{w.text}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <details className={styles.details}>
        <summary>
          <Icon name="sliders" size={13} />
          Full technical readout
          <Icon name="chevronDown" size={14} className={styles.caret} />
        </summary>
        <dl className={styles.figures}>
          {figures.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd className="mono">
                {f.value}
                {f.unit && <em>{f.unit}</em>}
              </dd>
            </div>
          ))}
        </dl>
      </details>
    </section>
  )
}
