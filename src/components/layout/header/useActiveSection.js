import { useEffect, useState } from 'react'

/**
 * The nav href (/#id) whose section holds the middle of the screen, on the
 * home page only (other pages have none of these sections). Feeds aria-current.
 */
export default function useActiveSection(hrefs, enabled) {
  const [current, setCurrent] = useState(null)

  useEffect(() => {
    if (!enabled || !('IntersectionObserver' in window)) return undefined
    const targets = hrefs.map((h) => document.getElementById(h.split('#')[1])).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(`/#${e.target.id}`)
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [hrefs, enabled])

  return enabled ? current : null
}
