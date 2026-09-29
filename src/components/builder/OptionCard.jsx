import { memo } from 'react'
import Icon from '../ui/Icon.jsx'
import { formatCompactCurrency } from '../../utils/format.js'
import styles from './OptionCard.module.css'

/**
 * OptionCard
 * ==========
 * Renders ONE option from ANY category. It receives a plain data object and
 * a list of "effects" to display - it has no idea whether it's showing an
 * engine or a set of tyres.
 *
 * That's the payoff of the data model: one card component, twelve categories.
 */

/** Which numeric fields are worth surfacing, and how to label them. */
const EFFECT_LABELS = {
  power: { label: 'HP', good: 'up' },
  torque: { label: 'NM', good: 'up' },
  weight: { label: 'KG', good: 'down' },
  grip: { label: 'GRIP', good: 'up' },
  handling: { label: 'HANDLING', good: 'up' },
  comfort: { label: 'COMFORT', good: 'up' },
  reliability: { label: 'RELIABILITY', good: 'up' },
  style: { label: 'STYLE', good: 'up' },
  sound: { label: 'SOUND', good: 'up' },
  downforce: { label: 'DOWNFORCE', good: 'up' },
  stoppingPower: { label: 'BRAKING', good: 'up' },
  rideHeight: { label: 'MM DROP', good: 'up', invert: true },
  shiftTime: { label: 'S SHIFT', good: 'down' },
  wet: { label: 'WET', good: 'up' },
  fade: { label: 'FADE RES', good: 'up' },
  luxury: { label: 'LUXURY', good: 'up' },
}

const SKIP = new Set([
  'id', 'name', 'short', 'price', 'blurb', 'fits', 'design', 'spokes', 'faceColor',
  'lipColor', 'sizeUp', 'parts', 'hex', 'shadow', 'highlight', 'finish', 'tread',
  'caliperColor', 'discStyle', 'tipStyle', 'tips', 'legal', 'gain', 'torqueGain',
  'boostStress', 'aspiration', 'displacement', 'cylinders', 'redline', 'gears',
  'driveLoss', 'engagement', 'launch', 'tractionCap', 'driftFactor', 'swapCost',
  'dragDelta', 'slip', 'race', 'powerGain',
])

function buildEffects(option) {
  const out = []
  for (const [key, value] of Object.entries(option)) {
    if (SKIP.has(key) || typeof value !== 'number' || value === 0) continue
    const meta = EFFECT_LABELS[key]
    if (!meta) continue
    const shown = meta.invert ? -value : value
    const positive = meta.good === 'up' ? value > 0 : value < 0
    out.push({
      key,
      label: meta.label,
      text: `${shown > 0 ? '+' : ''}${Number(shown.toFixed(2))}`,
      positive,
    })
  }
  return out.slice(0, 4)
}

function OptionCard({ option, selected, disabled, reason, onSelect, isStock, priceDelta }) {
  const effects = buildEffects(option)
  const swatch = option.hex

  return (
    <button
      type="button"
      className={[
        styles.card,
        selected ? styles.selected : '',
        disabled ? styles.disabled : '',
      ].join(' ')}
      onClick={() => !disabled && onSelect(option.id)}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={`${option.name}${disabled ? ` — unavailable: ${reason}` : ''}`}
      title={disabled ? reason : option.blurb}
    >
      <span className={styles.top}>
        {swatch ? (
          <span
            className={styles.swatch}
            style={{
              background: `linear-gradient(145deg, ${option.highlight} 0%, ${swatch} 45%, ${option.shadow} 100%)`,
            }}
            aria-hidden="true"
          />
        ) : null}

        <span className={styles.headings}>
          <span className={styles.name}>{option.short ?? option.name}</span>
          {option.short && option.short !== option.name && (
            <span className={styles.fullname}>{option.name}</span>
          )}
        </span>

        <span className={styles.check} aria-hidden="true">
          {selected && <Icon name="check" size={13} strokeWidth={2.6} />}
          {disabled && !selected && <Icon name="lock" size={12} strokeWidth={1.8} />}
        </span>
      </span>

      {option.blurb && <span className={styles.blurb}>{option.blurb}</span>}

      {effects.length > 0 && (
        <span className={styles.effects}>
          {effects.map((e) => (
            <span
              key={e.key}
              className={`${styles.effect} ${e.positive ? styles.good : styles.bad}`}
            >
              <b className="mono">{e.text}</b>
              {e.label}
            </span>
          ))}
        </span>
      )}

      <span className={styles.footer}>
        {disabled ? (
          <span className={styles.reason}>{reason}</span>
        ) : (
          <>
            <span className={`${styles.price} mono`}>
              {option.price === 0 ? (isStock ? 'INCLUDED' : 'FREE') : formatCompactCurrency(option.price)}
              {option.price !== 0 && <em> DA</em>}
            </span>
            {priceDelta != null && priceDelta !== 0 && (
              <span
                className={`${styles.delta} mono ${priceDelta > 0 ? styles.up : styles.down}`}
              >
                {priceDelta > 0 ? '+' : '−'}
                {formatCompactCurrency(Math.abs(priceDelta))}
              </span>
            )}
          </>
        )}
      </span>
    </button>
  )
}

export default memo(OptionCard)
