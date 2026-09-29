import { useEffect, useState } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)

/**
 * AnimatedNumber
 * ==============
 * Counts from the previous value to the new one instead of snapping.
 *
 * Small detail, big effect: when you swap an engine and watch 231 climb to
 * 374, the app feels like an instrument rather than a table of numbers.
 *
 * The displayed number is genuine render state, so it lives in useState. The
 * "adjust state while rendering" pattern below is React's documented way to
 * react to a changed prop without an extra effect pass:
 * https://react.dev/reference/react/useState#storing-information-from-previous-renders
 */
export default function AnimatedNumber({ value, duration = 480, decimals = 0, format }) {
  const target = Number(value)
  const animatable = Number.isFinite(target)

  const [display, setDisplay] = useState(target)
  const [animation, setAnimation] = useState(null)

  // If the target changed, decide what to do *during* render rather than in
  // an effect - that avoids painting one frame with the stale number.
  if (animation?.to !== target) {
    const from = Number.isFinite(display) ? display : target
    // Cases that need no animation are settled immediately, so the effect
    // below only ever has to run the requestAnimationFrame loop.
    if (!animatable || from === target || prefersReducedMotion()) {
      setAnimation({ from: target, to: target, animate: false })
      setDisplay(target)
    } else {
      setAnimation({ from, to: target, animate: true })
    }
  }

  useEffect(() => {
    if (!animation?.animate) return undefined

    const { from, to } = animation
    let frame = 0
    const start = performance.now()

    const step = (now) => {
      const t = Math.min(1, (now - start) / duration)
      // ease-out cubic: quick, then settling - like a needle finding its mark
      const eased = 1 - (1 - t) ** 3
      setDisplay(from + (to - from) * eased)
      if (t < 1) frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [animation, duration])

  if (!animatable) return <>{value}</>

  return <>{format ? format(display) : display.toFixed(decimals)}</>
}
