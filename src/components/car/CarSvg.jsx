import { memo, useId } from 'react'
import { computeGeometry, bodyPath, glassPath, VIEW_W, VIEW_H } from '../../utils/carGeometry.js'
import Wheel from './Wheel.jsx'

/**
 * THE CAR
 * =======
 * A single <svg> generated entirely from build data. No image assets at all.
 *
 * Every visual element traces back to a real property:
 *    colour     -> paint gradient + finish (gloss/metallic/matte/pearl)
 *    suspension -> rideHeight: the body physically drops over the wheels
 *    wheels     -> spoke design, face/lip colour, diameter
 *    brakes     -> caliper colour + disc style, visible through the spokes
 *    aero       -> splitter / wing / ducktail / canards / skirts / diffuser
 *    exhaust    -> number and finish of the tips
 *
 * The wheel arches are punched out with a <mask> rather than traced into the
 * body path: masks are exact, arcs-in-a-path are fiddly and break when the
 * ride height changes.
 */
function CarSvg({
  car,
  color,
  wheel,
  suspension,
  aero,
  exhaust,
  brake,
  tire,
  className = '',
  animate = true,
}) {
  const uid = useId().replace(/:/g, '')
  if (!car) return null

  const g = computeGeometry(car, {
    rideHeight: suspension?.rideHeight ?? 0,
    wheelSizeUp: wheel?.sizeUp ?? 0,
  })

  const paint = color?.hex ?? '#c9ced6'
  const shadow = color?.shadow ?? '#8b9099'
  const highlight = color?.highlight ?? '#ffffff'
  const finish = color?.finish ?? 'gloss'
  const matte = finish === 'matte'
  const pearl = finish === 'pearl'
  const metallic = finish === 'metallic'

  const aeroParts = aero?.parts ?? []
  const id = (n) => `${uid}-${n}`

  const bodyD = bodyPath(g)
  const bodyTransition = animate
    ? { transition: 'transform 600ms cubic-bezier(.22,1,.36,1)' }
    : undefined

  const tipCount = exhaust?.tips ?? 1
  const tipFill =
    exhaust?.tipStyle === 'burnt'
      ? '#8a6a9c'
      : exhaust?.tipStyle === 'steel'
        ? '#b6bcc3'
        : '#d5dade'

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className={className}
      role="img"
      aria-label={`${car.name} in ${color?.name ?? 'default paint'} with ${
        wheel?.name ?? 'stock'
      } wheels`}
      style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={id('paint')} x1="0" y1="0" x2="0.12" y2="1">
          <stop offset="0%" stopColor={matte ? paint : highlight} stopOpacity={matte ? 1 : 0.9} />
          <stop offset="14%" stopColor={paint} />
          <stop offset="58%" stopColor={paint} />
          <stop offset="88%" stopColor={shadow} />
          <stop offset="100%" stopColor={shadow} />
        </linearGradient>

        {/* A hard specular band across the flank sells "gloss paint". */}
        <linearGradient id={id('spec')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="42%" stopColor="#fff" stopOpacity={matte ? 0.03 : metallic ? 0.2 : 0.14} />
          <stop offset="52%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>

        {pearl && (
          <linearGradient id={id('pearl')} x1="0" y1="0" x2="1" y2="0.4">
            <stop offset="0%" stopColor={highlight} stopOpacity="0.5" />
            <stop offset="40%" stopColor={paint} stopOpacity="0" />
            <stop offset="100%" stopColor={highlight} stopOpacity="0.38" />
          </linearGradient>
        )}

        <linearGradient id={id('glass')} x1="0.1" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#5b6675" />
          <stop offset="38%" stopColor="#232b34" />
          <stop offset="100%" stopColor="#10141a" />
        </linearGradient>

        <linearGradient id={id('ground')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="18%" stopColor="#000" stopOpacity="0.5" />
          <stop offset="82%" stopColor="#000" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </linearGradient>

        <radialGradient id={id('contact')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#000" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>

        {/* Punch the wheel arches out of the bodywork. */}
        <mask id={id('arch')}>
          <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="#fff" />
          <circle cx={g.frontAxleX} cy={g.axleY} r={g.archR} fill="#000" />
          <circle cx={g.rearAxleX} cy={g.axleY} r={g.archR} fill="#000" />
          {/* keep the arch cutouts from eating the sills / underside */}
          <rect
            x={g.x0}
            y={g.sillY}
            width={g.bodyLen}
            height={VIEW_H - g.sillY}
            fill="#fff"
          />
        </mask>
      </defs>

      {/* ---------- ground shadow ---------- */}
      <ellipse
        cx={VIEW_W / 2}
        cy={g.groundY + 14}
        rx={g.bodyLen * 0.52}
        ry={12}
        fill={`url(#${id('ground')})`}
      />

      {/* wheel wells: dark cavities behind the wheels so the arch openings
          read as holes in the bodywork instead of showing the page behind */}
      <circle cx={g.frontAxleX} cy={g.axleY} r={g.archR} fill="#07090b" />
      <circle cx={g.rearAxleX} cy={g.axleY} r={g.archR} fill="#07090b" />

      {/* ---------- wheels (drawn first, body masks over them) ---------- */}
      <Wheel
        cx={g.rearAxleX}
        cy={g.axleY}
        r={g.wheelR}
        wheel={wheel}
        brake={brake}
        tire={tire}
      />
      <Wheel
        cx={g.frontAxleX}
        cy={g.axleY}
        r={g.wheelR}
        wheel={wheel}
        brake={brake}
        tire={tire}
      />

      {/* ---------- body ---------- */}
      <g style={bodyTransition}>
        {aeroParts.includes('skirts') && (
          <path
            d={`M ${g.frontAxleX + g.archR * 0.92} ${g.sillY - 2}
                L ${g.rearAxleX - g.archR * 0.92} ${g.sillY - 2}
                L ${g.rearAxleX - g.archR * 0.96} ${g.sillY + 9}
                L ${g.frontAxleX + g.archR * 0.96} ${g.sillY + 9} Z`}
            fill="#14171b"
          />
        )}

        <g mask={`url(#${id('arch')})`}>
          <path
            d={bodyD}
            fill={`url(#${id('paint')})`}
            stroke="rgba(0,0,0,.5)"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <path d={bodyD} fill={`url(#${id('spec')})`} />
          {pearl && <path d={bodyD} fill={`url(#${id('pearl')})`} />}

          {/* Shoulder crease. NOTE: this must start behind the cowl - the
              bonnet is a LOWER surface than the beltline, so a crease drawn
              at beltline height across the nose floats above the bodywork. */}
          <path
            d={`M ${g.cowlX - g.bodyLen * 0.01} ${g.beltY + g.bodyH * 0.055}
                Q ${g.x0 + g.bodyLen * 0.6} ${g.beltY + g.bodyH * 0.035} ${
                  g.glassRearX + g.bodyLen * 0.06
                } ${g.beltY + g.bodyH * 0.055}`}
            fill="none"
            stroke={highlight}
            strokeOpacity={matte ? 0.08 : 0.26}
            strokeWidth="1.5"
          />
          {/* lower shadow line above the sill, flank only */}
          <path
            d={`M ${g.frontAxleX + g.archR * 0.6} ${g.sillY - g.bodyH * 0.085}
                Q ${g.x0 + g.bodyLen * 0.5} ${g.sillY - g.bodyH * 0.115} ${
                  g.rearAxleX - g.archR * 0.6
                } ${g.sillY - g.bodyH * 0.09}`}
            fill="none"
            stroke="#000"
            strokeOpacity="0.2"
            strokeWidth="3"
          />
          {/* front bumper shutline */}
          <path
            d={`M ${g.x0 + g.bodyLen * 0.088} ${g.noseY - g.bodyH * 0.035}
                Q ${g.x0 + g.bodyLen * 0.095} ${(g.noseY + g.sillY) / 2} ${
                  g.x0 + g.bodyLen * 0.075
                } ${g.sillY - g.bodyH * 0.015}`}
            fill="none"
            stroke="#000"
            strokeOpacity="0.14"
            strokeWidth="1.1"
          />
          {/* lower front intake — a slot in the bumper, not a grille panel */}
          <path
            d={`M ${g.x0 + g.bodyLen * 0.012} ${g.sillY - g.bodyH * 0.175}
                L ${g.x0 + g.bodyLen * 0.066} ${g.sillY - g.bodyH * 0.185}
                L ${g.x0 + g.bodyLen * 0.062} ${g.sillY - g.bodyH * 0.055}
                L ${g.x0 + g.bodyLen * 0.01} ${g.sillY - g.bodyH * 0.045} Z`}
            fill="#0a0c0f"
            opacity="0.42"
          />

          {/* glass */}
          <path d={glassPath(g)} fill={`url(#${id('glass')})`} />
          {/* B-pillar */}
          <rect
            x={g.roofFrontX + (g.roofRearX - g.roofFrontX) * 0.58}
            y={g.roofY + g.bodyH * 0.05}
            width={Math.max(4, g.bodyLen * 0.008)}
            height={Math.max(0, g.beltY - g.roofY - g.bodyH * 0.09)}
            fill="#0c1015"
          />

          {/* door shutline */}
          <path
            d={`M ${g.x0 + g.bodyLen * 0.53} ${g.beltY - g.bodyH * 0.03}
                L ${g.x0 + g.bodyLen * 0.535} ${g.sillY - g.bodyH * 0.02}`}
            stroke="#000"
            strokeOpacity="0.26"
            strokeWidth="1.2"
          />
          {/* handle */}
          <rect
            x={g.x0 + g.bodyLen * 0.56}
            y={g.beltY + g.bodyH * 0.03}
            width={g.bodyLen * 0.03}
            height={3.2}
            rx={1.6}
            fill="#000"
            opacity="0.36"
          />
        </g>

        {/* Arch lips: a thin darker arc around each opening. Cheap detail,
            but it's what stops the arches looking like punched holes. */}
        {[g.frontAxleX, g.rearAxleX].map((cx) => (
          <path
            key={cx}
            d={`M ${cx - g.archR} ${g.axleY}
                A ${g.archR} ${g.archR} 0 0 1 ${cx + g.archR} ${g.axleY}`}
            fill="none"
            stroke="#000"
            strokeOpacity="0.42"
            strokeWidth="2.4"
          />
        ))}

        {/* wing mirror, mounted on the door skin at the base of the A-pillar */}
        <path
          d={`M ${g.cowlX + g.bodyLen * 0.055} ${g.beltY - g.bodyH * 0.012}
              l -${g.bodyLen * 0.03} -${g.bodyH * 0.006}
              q -${g.bodyLen * 0.006} ${g.bodyH * 0.026} ${g.bodyLen * 0.004} ${g.bodyH * 0.032}
              l ${g.bodyLen * 0.028} -${g.bodyH * 0.004} Z`}
          fill={shadow}
          stroke="rgba(0,0,0,.3)"
          strokeWidth="0.6"
        />

        {/* nose shading: the bumper face turns away from the light */}
        <path
          d={`M ${g.noseX} ${g.noseY}
              Q ${g.noseX + g.bodyLen * 0.012} ${g.noseY - g.bodyH * 0.045} ${
                g.noseX + g.bodyLen * 0.07
              } ${g.noseY - g.bodyH * 0.048}
              L ${g.noseX + g.bodyLen * 0.072} ${g.sillY}
              L ${g.noseX + g.bodyLen * 0.025} ${g.sillY}
              Q ${g.noseX} ${g.sillY} ${g.noseX} ${g.noseY} Z`}
          fill="#000"
          opacity="0.07"
        />

        {/* headlight — wraps back along the wing, as on the real car */}
        <path
          d={`M ${g.x0 + g.bodyLen * 0.014} ${g.noseY - g.bodyH * 0.03}
              Q ${g.x0 + g.bodyLen * 0.05} ${g.noseY - g.bodyH * 0.055} ${
                g.x0 + g.bodyLen * 0.098
              } ${g.noseY - g.bodyH * 0.028}
              L ${g.x0 + g.bodyLen * 0.092} ${g.noseY + g.bodyH * 0.022}
              Q ${g.x0 + g.bodyLen * 0.05} ${g.noseY + g.bodyH * 0.008} ${
                g.x0 + g.bodyLen * 0.012
              } ${g.noseY + g.bodyH * 0.03} Z`}
          fill="#dfeaf6"
          opacity="0.92"
        />
        {/* taillight */}
        <path
          d={`M ${g.tailX - g.bodyLen * 0.078} ${g.tailY - g.bodyH * 0.02}
              L ${g.tailX - g.bodyLen * 0.004} ${g.tailY - g.bodyH * 0.032}
              L ${g.tailX - g.bodyLen * 0.006} ${g.tailY + g.bodyH * 0.038}
              L ${g.tailX - g.bodyLen * 0.076} ${g.tailY + g.bodyH * 0.028} Z`}
          fill="#b8262b"
          opacity="0.9"
        />

        {/* ---------- AERO ---------- */}
        {aeroParts.includes('splitter') && (
          <path
            d={`M ${g.x0 - g.bodyLen * 0.022} ${g.sillY - 1}
                L ${g.x0 + g.bodyLen * 0.15} ${g.sillY - 3}
                L ${g.x0 + g.bodyLen * 0.15} ${g.sillY + 3}
                L ${g.x0 - g.bodyLen * 0.022} ${g.sillY + 5} Z`}
            fill="#191c21"
          />
        )}
        {aeroParts.includes('canards') && (
          <>
            <path
              d={`M ${g.x0 + g.bodyLen * 0.015} ${g.noseY + g.bodyH * 0.06}
                  l ${g.bodyLen * 0.032} -${g.bodyH * 0.03} l 1.5 ${g.bodyH * 0.018}
                  l -${g.bodyLen * 0.032} ${g.bodyH * 0.03} Z`}
              fill="#191c21"
            />
            <path
              d={`M ${g.x0 + g.bodyLen * 0.015} ${g.noseY + g.bodyH * 0.115}
                  l ${g.bodyLen * 0.032} -${g.bodyH * 0.03} l 1.5 ${g.bodyH * 0.018}
                  l -${g.bodyLen * 0.032} ${g.bodyH * 0.03} Z`}
              fill="#191c21"
            />
          </>
        )}
        {aeroParts.includes('diffuser') && (
          <path
            d={`M ${g.tailX - g.bodyLen * 0.14} ${g.sillY - 2}
                L ${g.tailX + g.bodyLen * 0.008} ${g.sillY - 4}
                L ${g.tailX + g.bodyLen * 0.008} ${g.sillY + 7}
                L ${g.tailX - g.bodyLen * 0.14} ${g.sillY + 6} Z`}
            fill="#0f1216"
          />
        )}
        {aeroParts.includes('ducktail') && (
          <path
            d={`M ${g.glassRearX - g.bodyLen * 0.01} ${g.beltY + 1}
                Q ${g.bootX - g.bodyLen * 0.03} ${g.tailY - g.bodyH * 0.09} ${
                  g.tailX + 2
                } ${g.tailY - g.bodyH * 0.075}
                L ${g.tailX} ${g.tailY - g.bodyH * 0.02}
                Q ${g.bootX - g.bodyLen * 0.02} ${g.tailY - g.bodyH * 0.03} ${
                  g.glassRearX
                } ${g.beltY + g.bodyH * 0.03} Z`}
            fill={paint}
            stroke="rgba(0,0,0,.35)"
            strokeWidth="1"
          />
        )}
        {aeroParts.includes('wing') && (
          <g>
            {(() => {
              const planeY = g.beltY - g.bodyH * 0.42
              const x1 = g.tailX - g.bodyLen * 0.155
              const x2 = g.tailX + g.bodyLen * 0.04
              const upright = (ux) => (
                <path
                  key={ux}
                  d={`M ${ux} ${g.tailY - g.bodyH * 0.02}
                      l ${g.bodyLen * 0.012} -${g.bodyH * 0.02}
                      L ${ux + g.bodyLen * 0.026} ${planeY + 8}
                      l -${g.bodyLen * 0.014} 0 Z`}
                  fill="#15181d"
                />
              )
              return (
                <>
                  {upright(g.tailX - g.bodyLen * 0.1)}
                  {upright(g.tailX - g.bodyLen * 0.035)}
                  <path
                    d={`M ${x1} ${planeY + 2}
                        L ${x2} ${planeY}
                        L ${x2} ${planeY + 9}
                        L ${x1} ${planeY + 11} Z`}
                    fill="#1b1e24"
                    stroke="#333941"
                    strokeWidth="0.9"
                  />
                  <path
                    d={`M ${x1 + 2} ${planeY + 4.5} L ${x2 - 2} ${planeY + 2.5}`}
                    stroke="#4c525b"
                    strokeWidth="0.8"
                    opacity="0.75"
                  />
                </>
              )
            })()}
          </g>
        )}

        {/* ---------- EXHAUST TIPS (tucked under the rear bumper) ---------- */}
        {(() => {
          const w = Math.max(8, g.bodyLen * 0.022)
          const gap = w * 0.35
          const total = tipCount * w + (tipCount - 1) * gap
          const startX = g.tailX - g.bodyLen * 0.05 - total / 2
          const y = g.sillY - 1
          return Array.from({ length: tipCount }).map((_, i) => (
            <g key={i}>
              <rect
                x={startX + i * (w + gap)}
                y={y}
                width={w}
                height={w * 0.62}
                rx={w * 0.31}
                fill={tipFill}
                stroke="#0a0c0f"
                strokeWidth="0.8"
              />
              <ellipse
                cx={startX + i * (w + gap) + w * 0.22}
                cy={y + w * 0.31}
                rx={w * 0.14}
                ry={w * 0.2}
                fill="#07090b"
                opacity="0.85"
              />
            </g>
          ))
        })()}
      </g>

      {/* contact patches */}
      <ellipse
        cx={g.frontAxleX}
        cy={g.groundY + 3}
        rx={g.wheelR * 0.78}
        ry={4.5}
        fill={`url(#${id('contact')})`}
      />
      <ellipse
        cx={g.rearAxleX}
        cy={g.groundY + 3}
        rx={g.wheelR * 0.78}
        ry={4.5}
        fill={`url(#${id('contact')})`}
      />
    </svg>
  )
}

export default memo(CarSvg)
