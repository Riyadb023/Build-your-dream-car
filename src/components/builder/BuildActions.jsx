import { useState } from 'react'
import Icon from '../ui/Icon.jsx'
import { buildToQueryString } from '../../utils/buildSerializer.js'
import styles from './BuildActions.module.css'

/**
 * BuildActions
 * ============
 * Save / share / randomise / change car.
 *
 * Sharing writes the build into the URL and copies it - no backend, no
 * database, and the link works forever because the build IS the data.
 */
export default function BuildActions({
  build,
  onRandom,
  onChangeCar,
  onSave,
  justSaved,
}) {
  const [naming, setNaming] = useState(false)
  const [name, setName] = useState('')
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const url = `${window.location.origin}/?${buildToQueryString(build)}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard is blocked in some contexts — fall back to a prompt so the
      // user can still copy the link by hand rather than getting nothing.
      window.prompt('Copy your build link:', url)
    }
  }

  const submit = (e) => {
    e.preventDefault()
    onSave(name.trim() || 'Untitled build')
    setName('')
    setNaming(false)
  }

  return (
    <div className={styles.wrap}>
      {naming ? (
        <form className={styles.form} onSubmit={submit}>
          <input
            autoFocus
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name this build…"
            maxLength={40}
            aria-label="Build name"
          />
          <button type="submit" className={styles.primary}>
            <Icon name="check" size={14} />
            Save
          </button>
          <button
            type="button"
            className={styles.ghost}
            onClick={() => setNaming(false)}
            aria-label="Cancel"
          >
            <Icon name="x" size={14} />
          </button>
        </form>
      ) : (
        <div className={styles.row}>
          <button
            type="button"
            className={styles.primary}
            onClick={() => setNaming(true)}
            disabled={justSaved}
          >
            <Icon name={justSaved ? 'check' : 'save'} size={14} />
            {justSaved ? 'Saved to garage' : 'Save build'}
          </button>

          <button type="button" className={styles.ghost} onClick={share} title="Copy share link">
            <Icon name={copied ? 'check' : 'share'} size={14} />
            {copied ? 'Copied' : 'Share'}
          </button>

          <button type="button" className={styles.ghost} onClick={onRandom} title="Randomise parts">
            <Icon name="dice" size={14} />
            Random
          </button>

          <button
            type="button"
            className={styles.ghost}
            onClick={onChangeCar}
            title="Pick a different car"
          >
            <Icon name="arrowLeft" size={14} />
            Car
          </button>
        </div>
      )}
    </div>
  )
}
