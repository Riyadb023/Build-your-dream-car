import { memo } from 'react'

/**
 * WHEEL
 * =====
 * Drawn from the wheel's `design` + `spokes` data, with the brake caliper
 * visible behind the spokes. Buying a Big Brake Kit and actually SEEING gold
 * six-pot calipers through the spokes is the kind of detail that makes a
 * configurator feel expensive.
 */
function Wheel({ cx, cy, r, wheel, brake, tire }) {
  const design = wheel?.design ?? 'mesh'
  const spokeCount = wheel?.spokes ?? 10
  const face = wheel?.faceColor ?? '#8a9099'
  const lip = wheel?.lipColor ?? '#6f757d'

  // Tyre sidewall gets thinner as the wheel gets bigger (real behaviour:
  // bigger rim = lower profile tyre to keep rolling diameter constant).
  const sizeUp = wheel?.sizeUp ?? 0
  const rimR = r * (0.66 + sizeUp * 0.045)
  const barrelR = rimR * 0.9
  const hubR = rimR * 0.19

  const discR = rimR * 0.82
  const caliperColor = brake?.caliperColor ?? '#4a4f57'
  const discStyle = brake?.discStyle ?? 'plain'
  const tread = tire?.tread ?? 'block'

  const spokes = []
  for (let i = 0; i < spokeCount; i += 1) {
    const angle = (i / spokeCount) * 360
    spokes.push(angle)
  }

  return (
    <g>
      {/* ---- tyre ---- */}
      <circle cx={cx} cy={cy} r={r} fill="#0e1013" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#22262b" strokeWidth={r * 0.05} />
      {/* sidewall highlight */}
      <circle
        cx={cx}
        cy={cy}
        r={r * 0.92}
        fill="none"
        stroke="#2a2f35"
        strokeWidth={r * 0.03}
        opacity="0.8"
      />
      {/* tread blocks around the visible edge (slicks skip this) */}
      {tread !== 'slick' &&
        Array.from({ length: 28 }).map((_, i) => {
          const a = (i / 28) * Math.PI * 2
          const inner = r * 0.955
          return (
            <line
              key={i}
              x1={cx + Math.cos(a) * inner}
              y1={cy + Math.sin(a) * inner}
              x2={cx + Math.cos(a) * r}
              y2={cy + Math.sin(a) * r}
              stroke="#05070a"
              strokeWidth={tread === 'sport' ? 1 : 1.6}
              opacity="0.9"
            />
          )
        })}

      {/* ---- brake disc + caliper (behind the spokes) ---- */}
      <circle cx={cx} cy={cy} r={discR} fill="#3c4147" />
      <circle cx={cx} cy={cy} r={discR} fill="none" stroke="#555b62" strokeWidth="1" />
      {discStyle === 'drilled' &&
        Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2
          return (
            <circle
              key={i}
              cx={cx + Math.cos(a) * discR * 0.72}
              cy={cy + Math.sin(a) * discR * 0.72}
              r={discR * 0.07}
              fill="#23272c"
            />
          )
        })}
      {discStyle === 'slotted' &&
        Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2
          return (
            <line
              key={i}
              x1={cx + Math.cos(a) * discR * 0.45}
              y1={cy + Math.sin(a) * discR * 0.45}
              x2={cx + Math.cos(a) * discR * 0.92}
              y2={cy + Math.sin(a) * discR * 0.92}
              stroke="#262a2f"
              strokeWidth={discR * 0.09}
              strokeLinecap="round"
            />
          )
        })}
      {/* caliper, top-rear position */}
      <path
        d={`M ${cx - discR * 0.28} ${cy - discR * 0.94}
            a ${discR} ${discR} 0 0 1 ${discR * 0.62} ${discR * 0.16}
            l ${-discR * 0.1} ${discR * 0.34}
            a ${discR * 0.8} ${discR * 0.8} 0 0 0 ${-discR * 0.48} ${-discR * 0.12} Z`}
        fill={caliperColor}
        stroke="#000"
        strokeOpacity="0.35"
        strokeWidth="0.6"
      />

      {/* ---- rim ---- */}
      <circle cx={cx} cy={cy} r={rimR} fill={lip} />
      <circle cx={cx} cy={cy} r={barrelR} fill={face} />

      {/* spokes */}
      <g>
        {design === 'mesh' &&
          spokes.map((a) => (
            <line
              key={a}
              x1={cx}
              y1={cy}
              x2={cx + Math.cos((a * Math.PI) / 180) * barrelR * 0.94}
              y2={cy + Math.sin((a * Math.PI) / 180) * barrelR * 0.94}
              stroke={lip}
              strokeWidth={barrelR * 0.075}
              opacity="0.55"
            />
          ))}

        {design === 'spoke' &&
          spokes.map((a) => {
            const rad = (a * Math.PI) / 180
            const w = barrelR * (spokeCount <= 6 ? 0.19 : 0.1)
            const tipX = cx + Math.cos(rad) * barrelR * 0.93
            const tipY = cy + Math.sin(rad) * barrelR * 0.93
            const perpX = Math.cos(rad + Math.PI / 2)
            const perpY = Math.sin(rad + Math.PI / 2)
            return (
              <path
                key={a}
                d={`M ${cx + perpX * w * 0.55} ${cy + perpY * w * 0.55}
                    L ${tipX + perpX * w} ${tipY + perpY * w}
                    L ${tipX - perpX * w} ${tipY - perpY * w}
                    L ${cx - perpX * w * 0.55} ${cy - perpY * w * 0.55} Z`}
                fill={face}
                stroke="rgba(0,0,0,.32)"
                strokeWidth="0.7"
              />
            )
          })}

        {design === 'dish' && (
          <>
            <circle cx={cx} cy={cy} r={barrelR * 0.82} fill={face} />
            {spokes.map((a) => {
              const rad = (a * Math.PI) / 180
              return (
                <line
                  key={a}
                  x1={cx + Math.cos(rad) * hubR}
                  y1={cy + Math.sin(rad) * hubR}
                  x2={cx + Math.cos(rad) * barrelR * 0.8}
                  y2={cy + Math.sin(rad) * barrelR * 0.8}
                  stroke="rgba(0,0,0,.3)"
                  strokeWidth={barrelR * 0.12}
                />
              )
            })}
            {/* deep dish lip */}
            <circle
              cx={cx}
              cy={cy}
              r={barrelR * 0.9}
              fill="none"
              stroke={lip}
              strokeWidth={barrelR * 0.2}
            />
          </>
        )}
      </g>

      {/* hub + centre cap */}
      <circle cx={cx} cy={cy} r={hubR} fill={lip} stroke="rgba(0,0,0,.4)" strokeWidth="0.8" />
      <circle cx={cx} cy={cy} r={hubR * 0.45} fill="#1b1f24" />

      {/* rim edge highlight */}
      <circle
        cx={cx}
        cy={cy}
        r={rimR}
        fill="none"
        stroke="rgba(255,255,255,.28)"
        strokeWidth="1"
      />
    </g>
  )
}

export default memo(Wheel)
