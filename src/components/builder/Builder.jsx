import { useMemo, useState } from 'react'
import { categories, categoryMap } from '../../data/categories.js'
import { isCompatible } from '../../utils/compatibility.js'
import { calculateStats } from '../../utils/calculateStats.js'
import CategoryNav from './CategoryNav.jsx'
import OptionCard from './OptionCard.jsx'
import Icon from '../ui/Icon.jsx'
import styles from './Builder.module.css'

/**
 * Builder
 * =======
 * The control surface: pick a category, pick a part.
 *
 * The interesting bit is `previewDelta`. For every option we run the WHOLE
 * stats engine again on a hypothetical build to work out what that part
 * would do to your power / weight / price before you commit to it. That's
 * only affordable because calculateStats is a cheap pure function - which is
 * exactly why keeping it pure was worth the discipline.
 */
export default function Builder({ build, stats, onSelect, onReset, modCount }) {
  const [active, setActive] = useState('engine')
  const category = categoryMap[active] ?? categories[0]

  // What each option would cost, relative to what's currently fitted.
  const currentPrice = stats.price ?? 0

  const optionMeta = useMemo(() => {
    return category.options.map((option) => {
      const compat = isCompatible(option, build)
      let delta = null
      if (compat.ok && build[category.key] !== option.id) {
        const hypothetical = { ...build, [category.key]: option.id }
        delta = calculateStats(hypothetical).price - currentPrice
      }
      return { option, compat, delta }
    })
  }, [category, build, currentPrice])

  const selectedOption = category.options.find((o) => o.id === build[category.key])

  return (
    <section className={styles.wrap} aria-label="Build configurator">
      <header className={styles.head}>
        <div>
          <div className={styles.titleRow}>
            <h2>Configure</h2>
            <span className={styles.count}>
              {modCount} {modCount === 1 ? 'mod' : 'mods'}
            </span>
          </div>
          <p className={styles.sub}>{category.tagline}</p>
        </div>

        <button type="button" className={styles.reset} onClick={onReset} title="Back to factory spec">
          <Icon name="reset" size={14} />
          Reset
        </button>
      </header>

      <CategoryNav active={active} onChange={setActive} build={build} />

      <div className={styles.body}>
        <div className={styles.catHead}>
          <h3>
            <Icon name={category.icon} size={15} />
            {category.label}
          </h3>
          {selectedOption && (
            <span className={styles.current}>
              {selectedOption.short ?? selectedOption.name}
            </span>
          )}
        </div>

        <div className={styles.grid} role="radiogroup" aria-label={`${category.label} options`}>
          {optionMeta.map(({ option, compat, delta }) => (
            <OptionCard
              key={option.id}
              option={option}
              selected={build[category.key] === option.id}
              disabled={!compat.ok}
              reason={compat.reason}
              priceDelta={delta}
              isStock={option.price === 0}
              onSelect={(id) => onSelect(category.key, id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
