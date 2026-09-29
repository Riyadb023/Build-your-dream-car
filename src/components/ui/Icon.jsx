/**
 * ICONS
 * =====
 * Inline SVG paths keyed by name. No icon library, no font, no network
 * request - and they inherit currentColor so they always match their text.
 */
const PATHS = {
  engine:
    'M4 9h2V7h4v2h3l3-3v3h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2v3l-3-3h-3v2H6v-2H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2z',
  chip: 'M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2M6 6h12v12H6z M10 10h4v4h-4z',
  gearbox: 'M6 4v16M12 4v16M18 4v16M6 4h12M6 12h12M4 4h4M10 4h4M16 4h4',
  drivetrain: 'M5 12h14M7 8v8M17 8v8M3 12a2 2 0 1 0 4 0 2 2 0 1 0-4 0M17 12a2 2 0 1 0 4 0 2 2 0 1 0-4 0',
  spring: 'M6 3h12M6 21h12M7 5l10 3-10 3 10 3-10 3',
  brake:
    'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 3v5M21 12h-5M12 21v-5M3 12h5',
  tire: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 3v5M18.5 7.5 15 10M21 12h-5M18.5 16.5 15 14M12 21v-5M5.5 16.5 9 14M3 12h5M5.5 7.5 9 10',
  exhaust: 'M3 14h9a3 3 0 0 1 3 3v1H3zM15 16h6M6 10c0-2 2-2 2-4M10 10c0-2 2-2 2-4',
  wheel: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 3v6M20.7 16.5 15 13.5M3.3 16.5 9 13.5',
  wing: 'M3 8h18M5 8v3M19 8v3M7 14h10M4 11h16',
  seat: 'M7 4h6a2 2 0 0 1 2 2v8H7zM5 14h12a2 2 0 0 1 2 2v4H7a2 2 0 0 1-2-2z',
  paint:
    'M12 3a9 9 0 0 0 0 18c1 0 1.5-.7 1.5-1.5 0-.4-.2-.8-.4-1-.3-.3-.4-.6-.4-1 0-.8.7-1.5 1.5-1.5H16a5 5 0 0 0 5-5c0-4.4-4-8-9-8zM7.5 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM12 8.5A1.5 1.5 0 1 0 12 5a1.5 1.5 0 0 0 0 3.5zM16.5 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
  garage: 'M3 21V9l9-6 9 6v12M7 21v-7h10v7M7 17h10',
  trophy: 'M8 4h8v5a4 4 0 1 1-8 0zM8 6H5v2a3 3 0 0 0 3 3M16 6h3v2a3 3 0 0 1-3 3M10 17h4v3h-4zM8 20h8',
  dice: 'M5 5h14v14H5zM9 9h.01M15 9h.01M9 15h.01M15 15h.01M12 12h.01',
  reset: 'M3 12a9 9 0 1 0 3-6.7M3 4v5h5',
  share: 'M14 5l6 7-6 7M20 12H8a4 4 0 0 0-4 4v3',
  save: 'M5 3h11l3 3v15H5zM8 3v6h8V3M8 14h8v7H8z',
  check: 'M4 12.5 9.5 18 20 6.5',
  x: 'M6 6l12 12M18 6L6 18',
  chevron: 'M9 6l6 6-6 6',
  chevronDown: 'M6 9l6 6 6-6',
  arrowRight: 'M4 12h16M14 6l6 6-6 6',
  arrowLeft: 'M20 12H4M10 18l-6-6 6-6',
  warning: 'M12 3 2 20h20zM12 9v5M12 17h.01',
  info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v6M12 7.5h.01',
  lock: 'M6 11h12v10H6zM9 11V7a3 3 0 0 1 6 0v4',
  trash: 'M4 6h16M9 6V4h6v2M6 6l1 15h10l1-15M10 10v7M14 10v7',
  copy: 'M9 9h11v11H9zM5 15V4h11',
  speed: 'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM12 12l4-4M12 12v.01',
  weight: 'M6 8h12l2 12H4zM9 8a3 3 0 1 1 6 0',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7z',
  gauge: 'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM12 12l5-3M8 12h.01M12 8v.01M16 12h.01',
  road: 'M6 21 9 3M18 21 15 3M12 5v3M12 11v3M12 17v3',
  filter: 'M3 5h18l-7 8v6l-4 2v-8z',
  sliders: 'M4 6h16M4 12h16M4 18h16M9 4v4M15 10v4M7 16v4',
  plus: 'M12 5v14M5 12h14',
  star: 'm12 3 2.7 5.9 6.3.7-4.7 4.3 1.3 6.1L12 17l-5.6 3 1.3-6.1L3 9.6l6.3-.7z',
}

export default function Icon({ name, size = 18, strokeWidth = 1.6, className = '', ...rest }) {
  const d = PATHS[name]
  if (!d) return null
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={d} />
    </svg>
  )
}
