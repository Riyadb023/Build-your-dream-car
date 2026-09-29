import { useCallback, useEffect, useState } from 'react'
/**
 * useLocalStorage
 * ===============
 * useState that survives a refresh.
 *
 * Every access is wrapped in try/catch on purpose: localStorage throws in
 * private-browsing modes, when the quota is full, and when the stored JSON
 * is corrupt. A garage feature is not worth a white screen of death, so
 * every failure path falls back to the in-memory value and the app carries
 * on working - it just stops persisting.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key)
      if (!raw) return initialValue
      const parsed = JSON.parse(raw)

      if (Array.isArray(initialValue) && !Array.isArray(parsed)) return initialValue
      return parsed
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {}
  }, [key, value])

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== key || event.newValue == null) return
      try {
        setValue(JSON.parse(event.newValue))
      } catch {}
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key])

  const remove = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
    } catch {}
    setValue(initialValue)
  }, [key, initialValue])

  return [value, setValue, remove]
}
