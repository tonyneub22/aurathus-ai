/**
 * Procedurally paints a dark marble disc with faint gold veins onto a 2D
 * canvas. Deterministic (seeded), so every visitor sees the same stone.
 * Returns the canvas; the caller wraps it in a three.js CanvasTexture.
 */

function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

export function paintMarbleDisc({
  size = 1024,
  seed = 7331,
  gold = '214,180,120',
  goldHot = '243,217,164',
  canvas = document.createElement('canvas'),
} = {}) {
  canvas.width = size
  canvas.height = size
  const g = canvas.getContext('2d')
  const c = size / 2
  const r = size * 0.5

  g.clearRect(0, 0, size, size)
  g.save()
  g.beginPath()
  g.arc(c, c, r, 0, Math.PI * 2)
  g.clip()

  // Stone body: lit from upper-left, falling to near-black at the rim.
  const body = g.createRadialGradient(c - r * 0.3, c - r * 0.35, r * 0.1, c, c, r)
  body.addColorStop(0, '#1c1814')
  body.addColorStop(0.55, '#0e0c0a')
  body.addColorStop(1, '#070605')
  g.fillStyle = body
  g.fillRect(0, 0, size, size)

  // Veins: branching random walks with a soft glow.
  const rnd = seeded(seed)
  g.lineCap = 'round'
  g.shadowColor = `rgba(${goldHot},0.5)`
  g.shadowBlur = size * 0.006
  const step = size * 0.003
  for (let i = 0; i < 30; i++) {
    const a = rnd() * Math.PI * 2
    const d = r * (0.5 + rnd() * 0.5)
    let x = c + Math.cos(a) * d
    let y = c + Math.sin(a) * d
    let ang = a + Math.PI + (rnd() - 0.5) * 1.2
    const len = 40 + rnd() * 140
    g.beginPath()
    g.moveTo(x, y)
    for (let s = 0; s < len; s++) {
      ang += (rnd() - 0.5) * 0.9
      x += Math.cos(ang) * step
      y += Math.sin(ang) * step
      g.lineTo(x, y)
      if (rnd() < 0.06) {
        let bx = x
        let by = y
        let bang = ang + (rnd() - 0.5) * 2
        for (let t = 0; t < 22; t++) {
          bang += (rnd() - 0.5) * 0.9
          bx += Math.cos(bang) * step * 0.8
          by += Math.sin(bang) * step * 0.8
          g.lineTo(bx, by)
        }
        g.moveTo(x, y)
      }
    }
    g.strokeStyle = `rgba(${gold},${(0.08 + rnd() * 0.24).toFixed(3)})`
    g.lineWidth = size * 0.0006 * (1 + rnd() * 1.4)
    g.stroke()
  }

  // Bright rim where the ring light meets the stone.
  g.shadowBlur = 0
  const rim = g.createRadialGradient(c, c, r * 0.84, c, c, r)
  rim.addColorStop(0, `rgba(${gold},0)`)
  rim.addColorStop(1, `rgba(${goldHot},0.38)`)
  g.fillStyle = rim
  g.fillRect(0, 0, size, size)
  g.restore()

  return canvas
}
