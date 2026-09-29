# 🏎️ Dream Car Builder

Pick a chassis, build it part by part, and watch the car — and the numbers — change with
every decision.

No backend. No database. No 3D engine. No image assets at all: every car on screen is
SVG generated from the same data that drives the simulation.

```
npm install
npm run dev
```

---

## What it does

- **10 base cars** with real dimensions, kerb weights, drag coefficients and chassis ratings
- **12 part categories** — engine, ECU tune, transmission, drivetrain, suspension, brakes,
  tyres, exhaust, wheels, aero, interior, paint
- **A physics-based simulation**, not a lookup table (see below)
- **The car redraws itself** as you build: it visibly drops on coilovers, the wheels change
  design, gold calipers appear behind the spokes, wings and splitters bolt on, paint reacts
  to its finish
- **Build personality** — the app reads the shape of your build and names it: Track Monster,
  Sleeper, Drift Machine, Luxury Cruiser…
- **A garage** saved to `localStorage`, and **shareable builds** encoded in the URL
- **Six challenges** with budgets and spec requirements, checked automatically against
  everything in your garage

---

## The simulation

The numbers are grounded in real physics wherever real physics is cheap.

**0–100 km/h** comes from energy, not a fudge factor:

```
t = ½mv² / (k · P) + shift losses
```

`k` — how much of peak power you actually get to use — falls as you exceed what the tyres
and drivetrain can put down. That's why 600 hp through a RWD car on budget tyres is *not*
twice as quick as 300 hp.

**Top speed** solves the actual drag equation iteratively:

```
P_wheels = ½ρ·Cd·A·v³ + C_rr·m·g·v
```

Which means aero has a genuine cost. Fit the full aero kit and your cornering improves while
your top speed drops — because `Cd` went up. That trade-off is real, and it's the reason a
big wing isn't simply "better".

### Is it accurate?

`npm run test:stats` runs all ten cars in stock trim against their published figures:

```
CAR                    HP   0-100   REAL     ERR   TOP  REAL
------------------------------------------------------------
E46 330i              231   6.94s   6.5s   +6.7%   250   250
E46 M3                343   5.05s   5.2s   -2.9%   250   250
E39 M5                400   4.96s   5.3s   -6.4%   250   250
350Z                  287   5.80s   5.8s   -0.1%   250   250
RX-8                  231   6.41s   6.4s   +0.2%   235   235
Golf GTI              200   7.08s   7.2s   -1.7%   231   235
WRX STI               300   5.41s   5.2s   +4.0%   250   250
S4 B6                 344   5.24s   5.6s   -6.5%   250   250
C55 AMG               367   5.29s   5.2s   +1.7%   250   250
AE86                  128   8.21s   8.8s   -6.7%   201   195
------------------------------------------------------------
mean abs error: 3.7%   worst: 6.7%
```

Every car lands within 7% of reality, and the harness also asserts behaviour that *should*
be true: a remap transforms a turbo car but does almost nothing to an NA one, stripping the
interior makes the car quicker, AWD launches harder than RWD, a maxed-out tune wrecks
reliability, and no formula ever emits `NaN`.

### Are the challenges fair?

Harder question, and the interesting one. A challenge can fail in two directions: it can be
**impossible** (no build meets the specs within the budget) or **pointless** (the budget is so
generous it isn't a constraint). Neither is visible by reading the code.

So `npm run test:logic` searches for the cheapest build that satisfies each challenge —
hill-climbing with random restarts across all ten cars — and asserts it exists, fits the
budget, and doesn't leave more than 75% headroom. Every budget in `challenges.js` was
derived from that number rather than guessed.

It was worth doing. Two challenges turned out to be **mathematically impossible**, by less
than 5%: the cheapest build that could hit the targets cost more than the budget allowed.
Nobody would ever have completed them.

---

## Architecture

The idea the whole project is built around:

> **Store the source of truth. Derive everything else.**

The entire build is twelve ids:

```js
{ car: 'bmw-e46-m3', engine: 'b58', tune: 'stage-2', wheels: 'te37', … }
```

Power, weight, 0–100, top speed, handling, comfort, reliability, price, rating, personality
and every warning are computed from that with `useMemo`. Nothing is duplicated into extra
state, so nothing can ever fall out of sync.

```
        build (ids only)
               │
      ┌────────┴────────┐
      ▼                 ▼
 calculateStats     CarSvg
      │                 │
      ▼                 ▼
   numbers          the picture
```

### Data ≠ UI

Every part category is declared once in `src/data/categories.js`. The builder UI, the random
generator, the URL serializer and the compatibility checker all iterate over that registry
instead of hardcoding category names.

Adding a 13th category — turbos, nitrous, whatever — means adding **one entry and one data
file**. No component changes. One `<OptionCard>` renders engines, tyres and paint alike.

Compatibility works the same way. Engines declare what they fit:

```js
fits: { platforms: ['bmw-e46', 'bmw-e39'] }   // chassis family
fits: { drivetrains: ['rwd', 'awd'] }         // layout requirement
fits: { all: true }                           // the LS3, obviously
```

…and a single function interprets it, instead of `if` statements scattered through the UI.

### The car is drawn, not photographed

`src/utils/carGeometry.js` turns millimetres into SVG paths. The body profile, wheelbase,
overhangs and wheel diameter all come from the same `cars.js` entry the physics reads, so the
picture can never disagree with the simulation. Lowering the ride height moves the body over
the axles; wheel arches are punched out with a mask so the tyres sit *inside* the bodywork.

Ten cars × six wheels × eight colours × five aero kits would be thousands of PNGs. It's
about 12 KB of vector maths instead — and it's sharp at any size.

---

## Project layout

```
src/
├── data/            cars, engines, tunes, wheels, tyres … + the category registry
├── utils/           calculateStats · calculateRating · compatibility · geometry
├── hooks/           useCarBuilder (the one piece of state) · useLocalStorage
├── components/
│   ├── car/         CarSvg · Wheel · CarPreview · StatsPanel
│   ├── builder/     Builder · CategoryNav · OptionCard · CarSelect · BuildActions
│   ├── layout/      Header · Footer · ErrorBoundary
│   └── ui/          Icon · StatBar · AnimatedNumber
└── pages/           BuilderPage · GaragePage · ChallengesPage
```

Calculation files import nothing from React. Components calculate nothing. That separation
is what lets the test harnesses run the real formulas and the real components in plain Node,
with no browser.

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Production build (~104 KB gzipped, zero images) |
| `npm test` | Lint + all three harnesses |
| `npm run test:stats` | Physics calibration against real published figures |
| `npm run test:logic` | Build state, share links, personalities, challenge solvability |
| `npm run test:render` | Server-renders every route and car, fails on `NaN` |
| `npm run test:dom` | Asserts page structure, stat ranges and accessible names |
| `npm run car:png` | Dumps a PNG of any build (needs `npm i -D @resvg/resvg-js`) |

---

## Deliberately not used

Redux, Zustand, Firebase, a backend, a database, Three.js, a component library, an icon
package, or a single `.png`. React state, plain JavaScript and CSS were enough — and the
architecture is arranged so a backend could be added later without rewriting the front end.
