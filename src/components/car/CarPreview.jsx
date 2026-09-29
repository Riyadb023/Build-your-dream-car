import CarSvg from './CarSvg.jsx'
import Icon from '../ui/Icon.jsx'
import AnimatedNumber from '../ui/AnimatedNumber.jsx'
import { formatNumber, formatCurrency } from '../../utils/format.js'
import styles from './CarPreview.module.css'

/**
 * CarPreview
 * ==========
 * The hero. Shows the car and the four headline numbers.
 *
 * It receives already-calculated stats and does no maths itself - the
 * component's only job is presentation. Swap the formula layer out entirely
 * and this file doesn't change.
 */
export default function CarPreview({ car, stats, personality, resolved }) {
  if (!car) return null

  // Each headline number animates from its previous value - see AnimatedNumber.
  const headline = [
    { key: 'power', label: 'Power', value: stats.power, unit: 'HP', decimals: 0 },
    { key: 'weight', label: 'Weight', value: stats.weight, unit: 'KG', decimals: 0 },
    { key: 'accel', label: '0-100', value: stats.acceleration, unit: 'S', decimals: 2 },
    { key: 'top', label: 'Top Speed', value: stats.topSpeed, unit: 'KM/H', decimals: 0 },
  ]

  return (
    <section className={styles.wrap} aria-label="Car preview">
      <div className={styles.head}>
        <div>
          <p className="eyebrow">{car.brand}</p>
          <h2 className={styles.title}>{car.shortName}</h2>
        </div>

        {personality && (
          <div
            className={styles.badge}
            style={{ '--tone': personality.accent }}
            title={personality.blurb}
          >
            <span aria-hidden="true">{personality.icon}</span>
            {personality.name}
          </div>
        )}
      </div>

      <div className={styles.stage}>
        {/* studio floor */}
        <div className={styles.floor} aria-hidden="true" />
        <div className={styles.grid} aria-hidden="true" />

        <CarSvg
          car={car}
          color={resolved.color}
          wheel={resolved.wheels}
          suspension={resolved.suspension}
          aero={resolved.aero}
          exhaust={resolved.exhaust}
          brake={resolved.brakes}
          tire={resolved.tires}
          className={styles.car}
        />

        {resolved.suspension?.rideHeight ? (
          <div className={styles.ride} aria-hidden="true">
            <Icon name="spring" size={12} />
            {resolved.suspension.rideHeight} mm
          </div>
        ) : null}
      </div>

      <dl className={styles.stats}>
        {headline.map((h) => (
          <div key={h.key} className={styles.stat}>
            <dt>{h.label}</dt>
            <dd>
              <span className="mono">
                <AnimatedNumber
                  value={h.value}
                  decimals={h.decimals}
                  format={h.decimals === 0 ? formatNumber : undefined}
                />
              </span>
              <em>{h.unit}</em>
            </dd>
          </div>
        ))}
      </dl>

      <div className={styles.priceRow}>
        <span className="eyebrow">Build cost</span>
        <strong className="mono">
          <AnimatedNumber value={stats.price} format={formatCurrency} />
        </strong>
      </div>
    </section>
  )
}
