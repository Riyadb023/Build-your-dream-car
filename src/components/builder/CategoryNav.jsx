import { categories } from '../../data/categories.js'
import { createStockBuild } from '../../hooks/useCarBuilder.js'
import Icon from '../ui/Icon.jsx'
import styles from './CategoryNav.module.css'

/**
 * CategoryNav
 * ===========
 * Horizontal scroller of the 12 categories. A dot marks any category that
 * has been changed away from the factory spec, so at a glance you can see
 * what you've actually touched.
 *
 * Note it maps over `categories` - adding a 13th category needs no edit here.
 */
export default function CategoryNav({ active, onChange, build }) {
  const stock = build.car ? createStockBuild(build.car) : {}

  return (
    <nav className={styles.nav} aria-label="Part categories">
      <ul>
        {categories.map((c) => {
          const modified = build[c.key] && build[c.key] !== stock[c.key]
          return (
            <li key={c.key}>
              <button
                type="button"
                className={`${styles.tab} ${active === c.key ? styles.active : ''}`}
                onClick={() => onChange(c.key)}
                aria-current={active === c.key ? 'true' : undefined}
              >
                <Icon name={c.icon} size={15} />
                <span>{c.label}</span>
                {modified && <i className={styles.dot} aria-label="modified" />}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
