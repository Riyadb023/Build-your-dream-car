/**
 * CAR GEOMETRY
 * ============
 * Turns real millimetres into SVG path data.
 *
 * Rather than shipping a PNG per car (10 cars x 6 wheels x 8 colours x 5 aero
 * = thousands of images), the car is DRAWN from the same numbers that drive
 * the physics. Change `wheelbase` in cars.js and both the simulation and the
 * picture change together. Nothing can ever get out of sync.
 *
 * Conventions, so the numbers stay readable:
 *   *Frac  = height above the ground / total car height   (0 = road, 1 = roof)
 *   *X     = distance along the car / total car length    (0 = nose, 1 = tail)
 *   overhang is measured to the AXLE CENTRELINE, as it is on a real spec sheet.
 */

export const VIEW_W = 1000
export const VIEW_H = 420

const PROFILES = {
  sedan: {
    sillFrac: 0.175,
    noseFrac: 0.605,
    hoodFrac: 0.705,
    beltFrac: 0.725,
    tailFrac: 0.705,
    cowlX: 0.4,
    roofFrontX: 0.52,
    roofRearX: 0.745,
    glassRearX: 0.855,
    bootX: 0.955,
    roofCrown: 0.011,
  },
  coupe: {
    sillFrac: 0.17,
    noseFrac: 0.61,
    hoodFrac: 0.715,
    beltFrac: 0.735,
    tailFrac: 0.7,
    cowlX: 0.425,
    roofFrontX: 0.55,
    roofRearX: 0.715,
    glassRearX: 0.85,
    bootX: 0.965,
    roofCrown: 0.012,
  },
  hatch: {
    sillFrac: 0.185,
    noseFrac: 0.59,
    hoodFrac: 0.69,
    beltFrac: 0.715,
    tailFrac: 0.88,
    cowlX: 0.375,
    roofFrontX: 0.505,
    roofRearX: 0.795,
    glassRearX: 0.94,
    bootX: 0.99,
    roofCrown: 0.012,
  },
}

export function computeGeometry(car, opts = {}) {
  const { rideHeight = 0, wheelSizeUp = 0 } = opts
  const d = car.dims
  const profile = PROFILES[car.bodyStyle] ?? PROFILES.sedan

  // Fixed reference scale so cars stay comparable to each other on screen.
  const MARGIN_X = 70
  const scale = (VIEW_W - MARGIN_X * 2) / 4800
  const px = (mm) => mm * scale

  const bodyLen = px(d.length)
  const bodyH = px(d.height)
  const x0 = (VIEW_W - bodyLen) / 2
  const groundY = VIEW_H - 84

  // --- wheels ---------------------------------------------------------
  // Bigger rims keep the same rolling diameter in reality (lower profile
  // tyre), so the outer radius does NOT grow with sizeUp - only the rim does.
  const wheelR = px(d.wheelDia) / 2
  const frontAxleX = x0 + px(d.frontOverhang)
  const rearAxleX = frontAxleX + px(d.wheelbase)
  const axleY = groundY - wheelR

  // Lowering drops the body toward the axles, limited by the arch gap so an
  // air-ride car never sinks through its own wheels.
  const maxDrop = px(d.trackGap) * 0.95
  const drop = Math.min(px(-rideHeight), maxDrop)

  const yAt = (frac) => groundY - bodyH * frac + drop
  const xAt = (frac) => x0 + bodyLen * frac

  return {
    scale,
    px,
    yAt,
    xAt,
    groundY,
    x0,
    bodyLen,
    bodyH,
    wheelR,
    rimSizeUp: wheelSizeUp,
    frontAxleX,
    rearAxleX,
    axleY,
    drop,
    sillY: yAt(profile.sillFrac),
    noseY: yAt(profile.noseFrac),
    hoodY: yAt(profile.hoodFrac),
    beltY: yAt(profile.beltFrac),
    tailY: yAt(profile.tailFrac),
    roofY: yAt(1),
    cowlX: xAt(profile.cowlX),
    roofFrontX: xAt(profile.roofFrontX),
    roofRearX: xAt(profile.roofRearX),
    glassRearX: xAt(profile.glassRearX),
    bootX: xAt(profile.bootX),
    tailX: x0 + bodyLen,
    noseX: x0,
    profile,
    // Arch opening: comfortably larger than the tyre so it reads as a cutout.
    archR: wheelR * 1.13,
  }
}

/**
 * Outer body silhouette, nose -> roof -> tail -> underside.
 * Wheel arches are punched out separately with a <mask>: exact, and immune
 * to the ride height changing underneath us.
 */
export function bodyPath(g) {
  const {
    noseX, noseY, hoodY, beltY, roofY, tailY, tailX, sillY,
    cowlX, roofFrontX, roofRearX, glassRearX, bootX, bodyLen, bodyH, profile,
  } = g

  const crown = bodyH * profile.roofCrown

  return [
    // nose / front bumper face
    `M ${noseX} ${noseY}`,
    `Q ${noseX + bodyLen * 0.012} ${noseY - bodyH * 0.045} ${noseX + bodyLen * 0.07} ${
      noseY - bodyH * 0.048
    }`,
    // bonnet rising gently to the cowl
    `L ${cowlX - bodyLen * 0.03} ${hoodY}`,
    `Q ${cowlX} ${hoodY - bodyH * 0.006} ${cowlX + bodyLen * 0.005} ${hoodY - bodyH * 0.004}`,
    // windscreen
    `Q ${cowlX + bodyLen * 0.045} ${hoodY - bodyH * 0.06} ${roofFrontX} ${roofY + crown}`,
    // roof, crowned slightly in the middle
    `Q ${(roofFrontX + roofRearX) / 2} ${roofY - crown} ${roofRearX} ${roofY + crown}`,
    // Rear screen. On a hatch the tail is HIGHER than the beltline, so the
    // glass runs straight down to the tailgate - dropping to the beltline
    // first (as a saloon does) would carve a notch out of the bodywork.
    ...(tailY < beltY
      ? [
          `Q ${glassRearX - bodyLen * 0.02} ${roofY + bodyH * 0.12} ${bootX} ${tailY}`,
          `L ${tailX} ${tailY + bodyH * 0.02}`,
        ]
      : [
          `Q ${glassRearX - bodyLen * 0.03} ${roofY + bodyH * 0.08} ${glassRearX} ${beltY}`,
          `L ${bootX} ${tailY}`,
          `Q ${tailX} ${tailY} ${tailX} ${tailY + bodyH * 0.03}`,
        ]),
    `L ${tailX} ${sillY - bodyH * 0.03}`,
    `Q ${tailX} ${sillY} ${tailX - bodyLen * 0.025} ${sillY}`,
    // underside
    `L ${noseX + bodyLen * 0.025} ${sillY}`,
    // back up the front bumper
    `Q ${noseX} ${sillY} ${noseX} ${noseY}`,
    'Z',
  ].join(' ')
}

/** Greenhouse glass, inset inside the body outline. */
export function glassPath(g) {
  const { roofFrontX, roofRearX, glassRearX, roofY, beltY, cowlX, bodyLen, bodyH, profile } = g
  const crown = bodyH * profile.roofCrown
  const inset = bodyH * 0.038
  const glassBottom = beltY - bodyH * 0.022

  return [
    `M ${cowlX + bodyLen * 0.028} ${glassBottom}`,
    `Q ${cowlX + bodyLen * 0.055} ${glassBottom - bodyH * 0.05} ${
      roofFrontX + bodyLen * 0.018
    } ${roofY + crown + inset}`,
    `L ${roofRearX - bodyLen * 0.012} ${roofY + crown + inset}`,
    `Q ${glassRearX - bodyLen * 0.045} ${roofY + bodyH * 0.1} ${
      glassRearX - bodyLen * 0.032
    } ${glassBottom}`,
    'Z',
  ].join(' ')
}
