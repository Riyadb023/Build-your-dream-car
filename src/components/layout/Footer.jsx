import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        Dream Car Builder — a simulation, not a workshop manual. Figures are modelled from
        real published data and calibrated to within ~7%.
      </p>
      <p className="mono">React · Vite · zero image assets</p>
    </footer>
  )
}
