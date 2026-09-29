import { cars } from '../../data/cars.js'
import { getEngine } from '../../data/engines.js'
import CarSvg from '../car/CarSvg.jsx'
import Icon from '../ui/Icon.jsx'
import { getColor } from '../../data/colors.js'
import { getOption } from '../../data/categories.js'
import { formatCompactCurrency } from '../../utils/format.js'
import styles from './CarSelect.module.css'

/**
 * CarSelect
 * =========
 * Step one. Every card draws the actual car with the same SVG renderer the
 * builder uses, so what you pick is what you get.
 */
const FLAGS = { DE: '🇩🇪', JP: '🇯🇵' }

export default function CarSelect({ onSelect, onRandom }) {
  const stockColor = getColor('alpine-white')
  const oem = getOption('wheels', 'oem')
  const stockSusp = getOption('suspension', 'stock')
  const stockTire = getOption('tires', 'street')

  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <p className="eyebrow">Step 01 — Choose your platform</p>
        <h1>
          Every great build starts
          <br />
          with the <span>right chassis</span>.
        </h1>
        <p className={styles.lede}>
          Ten cars, each with real dimensions, weights and drag figures. Pick one and every
          part you bolt on is simulated against it.
        </p>
        <button type="button" className={styles.random} onClick={onRandom}>
          <Icon name="dice" size={16} />
          Surprise me
        </button>
      </header>

      <ul className={styles.grid}>
        {cars.map((car) => {
          const engine = getEngine(car.stockEngine)
          return (
            <li key={car.id}>
              <button type="button" className={styles.card} onClick={() => onSelect(car.id)}>
                <div className={styles.art}>
                  <CarSvg
                    car={car}
                    color={stockColor}
                    wheel={oem}
                    suspension={stockSusp}
                    tire={stockTire}
                    animate={false}
                  />
                </div>

                <div className={styles.info}>
                  <div className={styles.nameRow}>
                    <h3>{car.shortName}</h3>
                    <span className={styles.flag} aria-hidden="true">
                      {FLAGS[car.country] ?? ''}
                    </span>
                  </div>
                  <p className={styles.full}>
                    {car.brand} · {car.year}
                  </p>

                  <p className={styles.blurb}>{car.blurb}</p>

                  <dl className={styles.specs}>
                    <div>
                      <dt>Power</dt>
                      <dd className="mono">{engine?.power ?? '—'} hp</dd>
                    </div>
                    <div>
                      <dt>Weight</dt>
                      <dd className="mono">{car.weight} kg</dd>
                    </div>
                    <div>
                      <dt>Layout</dt>
                      <dd className="mono">{car.drivetrain.toUpperCase()}</dd>
                    </div>
                  </dl>

                  <div className={styles.foot}>
                    <span className="mono">{formatCompactCurrency(car.price)} DA</span>
                    <span className={styles.go}>
                      Build <Icon name="arrowRight" size={13} />
                    </span>
                  </div>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
