/**
 * True when the browser can create a WebGL context. Checked once before the
 * hero mounts, so a machine without WebGL never tries to load three.js.
 */
export function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}
