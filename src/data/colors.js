/**
 * PAINT
 * -----
 * Deliberately has ZERO performance effect - it only drives the visual and a
 * small style score. Good architecture means a category is allowed to be
 * "cosmetic only" without special-casing it anywhere in the engine.
 *
 *  hex        base body colour
 *  shadow     darker tone the SVG uses for panel shading
 *  highlight  specular tone for the top edge / reflections
 *  finish     'gloss' | 'metallic' | 'matte' | 'pearl' -> changes the SVG gradient
 */

export const colors = [
  {
    id: 'alpine-white',
    name: 'Alpine White',
    hex: '#eef1f4',
    shadow: '#b9bfc7',
    highlight: '#ffffff',
    finish: 'gloss',
    style: 0.6,
    price: 0,
    blurb: 'The default. Clean, cheap, and never actually wrong.',
  },
  {
    id: 'jet-black',
    name: 'Jet Black',
    hex: '#15181c',
    shadow: '#080a0c',
    highlight: '#454b54',
    finish: 'gloss',
    style: 1.4,
    price: 40000,
    blurb: 'Menacing when clean. It is never clean.',
  },
  {
    id: 'phoenix-yellow',
    name: 'Phoenix Yellow',
    hex: '#f5c518',
    shadow: '#b98f06',
    highlight: '#ffe680',
    finish: 'metallic',
    style: 3.2,
    price: 120000,
    blurb: 'The E46 M3 colour. Loud, rare, and instantly recognisable.',
  },
  {
    id: 'estoril-blue',
    name: 'Estoril Blue',
    hex: '#1f4fa8',
    shadow: '#12336e',
    highlight: '#5a8de0',
    finish: 'metallic',
    style: 2.8,
    price: 95000,
    blurb: 'Deep metallic blue that goes purple in low sun. A proper hero colour.',
  },
  {
    id: 'imola-red',
    name: 'Imola Red',
    hex: '#b81f1f',
    shadow: '#7a1212',
    highlight: '#e85c50',
    finish: 'gloss',
    style: 2.4,
    price: 85000,
    blurb: 'Solid, saturated, slightly orange. Reads as fast from 200 metres.',
  },
  {
    id: 'brg',
    name: 'British Racing Green',
    hex: '#0f3d2e',
    shadow: '#07241b',
    highlight: '#2f7a5e',
    finish: 'metallic',
    style: 2.9,
    price: 110000,
    blurb: 'Almost black until the light hits it. Understated and expensive-looking.',
  },
  {
    id: 'nardo-grey',
    name: 'Nardo Grey',
    hex: '#8e9296',
    shadow: '#63676b',
    highlight: '#c2c6ca',
    finish: 'matte',
    style: 2.6,
    price: 150000,
    blurb: 'Flat industrial grey. Somehow made an entire generation buy grey cars.',
  },
  {
    id: 'midnight-purple',
    name: 'Midnight Purple',
    hex: '#3b1e63',
    shadow: '#22103c',
    highlight: '#7a4bbd',
    finish: 'pearl',
    style: 3.6,
    price: 260000,
    blurb: 'Multi-stage pearl that shifts green-to-purple. Costs a fortune. Worth it.',
  },
]

export const getColor = (id) => colors.find((c) => c.id === id) ?? null
