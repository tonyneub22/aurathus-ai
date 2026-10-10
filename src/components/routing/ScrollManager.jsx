import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import { scrollToHash } from '../../lib/scrollToHash'

/**
 * Router navigations don't scroll by themselves. A link with a hash goes to
 * that section (smoothly on the same page, instantly when arriving from
 * another page); any other new page starts at the top.
 */
export default function ScrollManager() {
  const { pathname, hash, key } = useLocation()
  const previousPath = useRef(null)

  useEffect(() => {
    const samePage = previousPath.current === pathname
    const firstRender = previousPath.current === null
    previousPath.current = pathname
    if (hash) scrollToHash(hash, samePage ? 'auto' : 'instant')
    else if (!firstRender && !samePage) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash, key])

  return null
}
