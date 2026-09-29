import { NavLink, Link } from 'react-router-dom'
import Icon from '../ui/Icon.jsx'
import styles from './Header.module.css'

export default function Header({ garageCount = 0 }) {
  const links = [
    { to: '/', label: 'Build', icon: 'wheel', end: true },
    { to: '/garage', label: 'Garage', icon: 'garage', badge: garageCount },
    { to: '/challenges', label: 'Challenges', icon: 'trophy' },
  ]

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand}>
        <span className={styles.mark} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none">
            <path
              d="M2 14h20M4 14l2-5h12l2 5M6.5 17.5a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2zM17.5 17.5a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className={styles.wordmark}>
          Dream Car <b>Builder</b>
        </span>
      </Link>

      <nav className={styles.nav} aria-label="Main">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            <Icon name={l.icon} size={15} />
            <span>{l.label}</span>
            {l.badge > 0 && <i className={styles.badge}>{l.badge}</i>}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
