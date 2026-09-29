/**
 * Formatting helpers.
 * Kept in one place so currency/units are consistent everywhere and can be
 * swapped (DA -> EUR) by editing a single file.
 */

const numberFormatter = new Intl.NumberFormat('en-US')

export const formatNumber = (value) => numberFormatter.format(Math.round(value ?? 0))

/** 2740000 -> "2,740,000 DA" */
export const formatCurrency = (value) => `${formatNumber(value)} DA`

/** 2740000 -> "2.74M" — for tight spaces like build cards */
export function formatCompactCurrency(value) {
  const v = Math.round(value ?? 0)
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M`
  if (Math.abs(v) >= 1_000) return `${Math.round(v / 1_000)}k`
  return String(v)
}

/** 5.132 -> "5.13" */
export const formatSeconds = (value) =>
  value == null || !Number.isFinite(value) ? '—' : value.toFixed(2)

/** 0-10 score -> "8.4" */
export const formatScore = (value) =>
  value == null || !Number.isFinite(value) ? '—' : value.toFixed(1)

/** Clamp a number into a range. Used constantly by the stats engine. */
export const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

/** Map a value from one range to another, clamped. */
export function mapRange(value, inMin, inMax, outMin, outMax) {
  if (inMax === inMin) return outMin
  const t = clamp((value - inMin) / (inMax - inMin), 0, 1)
  return outMin + t * (outMax - outMin)
}

/** "bmw-e46-m3" -> "Bmw E46 M3" (fallback labels only) */
export const titleCase = (str) =>
  String(str)
    .split(/[-_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
