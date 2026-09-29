/**
 * SUSPENSION
 * ----------
 *  handling    the headline stat
 *  comfort     nearly always the price you pay for handling
 *  rideHeight  millimetres of drop -> the SVG renderer LOWERS the car.
 *              This is the most visible single change in the whole app.
 *  adjustable  feeds the "Show Car" / stance detection
 */

export const suspensions = [
  {
    id: 'stock',
    name: 'Factory Suspension',
    short: 'Stock',
    handling: 0,
    comfort: 0,
    grip: 0,
    rideHeight: 0,
    weight: 0,
    reliability: 3,
    price: 0,
    blurb: 'Soft, tall, and designed by people who care about your spine.',
  },
  {
    id: 'sport-springs',
    name: 'Sport Springs',
    short: 'Springs',
    handling: 1.1,
    comfort: -0.9,
    grip: 0.3,
    rideHeight: -30,
    weight: -4,
    reliability: 0,
    price: 70000,
    blurb: 'Lowering springs on stock dampers. Cheap, effective, slightly crashy.',
  },
  {
    id: 'coilovers',
    name: 'Adjustable Coilovers',
    short: 'Coilovers',
    handling: 2.4,
    comfort: -2.0,
    grip: 0.8,
    rideHeight: -55,
    weight: -8,
    reliability: -2,
    price: 210000,
    blurb: 'Height, damping and corner balance all adjustable. The real upgrade.',
  },
  {
    id: 'track',
    name: 'Motorsport Track Setup',
    short: 'Track',
    handling: 3.6,
    comfort: -4.2,
    grip: 1.4,
    rideHeight: -75,
    weight: -14,
    reliability: -6,
    price: 480000,
    blurb: 'Spherical bearings, brutal spring rates. Transmits every pebble to you.',
  },
  {
    id: 'air',
    name: 'Air Suspension',
    short: 'Air Ride',
    handling: 0.3,
    comfort: 2.4,
    grip: -0.2,
    rideHeight: -90,
    weight: 42,
    reliability: -9,
    price: 560000,
    blurb: 'Lays frame at a show, rides like a limo on the way home. Heavy.',
  },
]

export const getSuspension = (id) => suspensions.find((s) => s.id === id) ?? null
