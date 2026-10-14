import { site } from './site'
import { services } from './services'

/**
 * Every visible string in the site's config, flattened to "path: text". The
 * copy guard (copy.test.js) compares this with the approved snapshot, so a
 * redesign can't silently reword anything. Functions are called with a sample
 * so their wording is covered too; URLs and paths are left out (not copy).
 */
export function collectCopy() {
  const out = []
  const skip = /^(\/|https?:|mailto:|#)|\.(svg|png|webp|avif|gltf|bin)$/
  const walk = (value, path) => {
    if (typeof value === 'string') {
      if (!skip.test(value)) out.push(`${path}: ${value}`)
    } else if (typeof value === 'function') {
      walk(value({ slug: 'sample', name: 'Sample' }) ?? '', path)
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => walk(v, `${path}[${i}]`))
    } else if (value && typeof value === 'object') {
      for (const [k, v] of Object.entries(value)) walk(v, path ? `${path}.${k}` : k)
    }
  }
  walk(site, 'site')
  walk(services, 'services')
  return out
}
