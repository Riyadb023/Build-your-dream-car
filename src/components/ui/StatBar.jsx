import styles from './StatBar.module.css'

/**
 * StatBar
 * =======
 * A labelled 0-100 bar. The fill width is animated by CSS transition, so
 * when the build changes the bars visibly slide - which is what makes the
 * numbers feel alive rather than just re-rendering.
 */
export default function StatBar({ label, value, tone = 'var(--accent)', suffix }) {
  const pct = Math.max(0, Math.min(100, value ?? 0))

  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <span
        className={styles.track}
        role="meter"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <span className={styles.fill} style={{ width: `${pct}%`, background: tone }} />
        {/* tick marks every 25% for a technical, instrument-like read */}
        <span className={styles.ticks} aria-hidden="true" />
      </span>
      <span className={`${styles.value} mono`}>
        {Math.round(pct)}
        {suffix}
      </span>
    </div>
  )
}
