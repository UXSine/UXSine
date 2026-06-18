const WIDTH = 1170
const HEIGHT = 2532

const SCENES = [
  {
    name: 'dawn',
    sky: ['#FCE9C8', '#F3AE93', '#3F9396'],
    sun: { cx: 0.5, cy: 0.27, r: 130, inner: 'rgba(255,247,225,0.95)', outer: 'rgba(255,180,120,0)' },
    hills: ['rgba(63,147,150,0.55)', 'rgba(38,99,101,0.75)', '#1F4D4F'],
    stars: 0,
  },
  {
    name: 'ocean',
    sky: ['#D7EFEC', '#7FC2C2', '#1F4D4F'],
    sun: { cx: 0.5, cy: 0.24, r: 110, inner: 'rgba(255,255,255,0.9)', outer: 'rgba(255,255,255,0)' },
    hills: ['rgba(127,194,194,0.45)', 'rgba(47,120,122,0.7)', '#16393B'],
    stars: 0,
  },
  {
    name: 'dusk',
    sky: ['#3A4A6B', '#2C5C5E', '#102A2B'],
    sun: { cx: 0.5, cy: 0.2, r: 90, inner: 'rgba(245,245,235,0.85)', outer: 'rgba(245,245,235,0)' },
    hills: ['rgba(46,79,98,0.6)', 'rgba(26,52,66,0.8)', '#0B1F22'],
    stars: 90,
  },
]

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ')
  const lines = []
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (line && ctx.measureText(test).width > maxWidth) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

function drawSky(ctx, colors) {
  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT)
  gradient.addColorStop(0, colors[0])
  gradient.addColorStop(0.5, colors[1])
  gradient.addColorStop(1, colors[2])
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
}

function drawGlow(ctx, sun) {
  const x = WIDTH * sun.cx
  const y = HEIGHT * sun.cy
  const grad = ctx.createRadialGradient(x, y, 0, x, y, sun.r * 4)
  grad.addColorStop(0, sun.inner)
  grad.addColorStop(0.25, sun.inner)
  grad.addColorStop(1, sun.outer)
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(x, y, sun.r * 4, 0, Math.PI * 2)
  ctx.fill()
}

function drawStars(ctx, count) {
  for (let i = 0; i < count; i++) {
    const x = Math.random() * WIDTH
    const y = Math.random() * HEIGHT * 0.5
    const r = Math.random() * 2.4 + 0.4
    ctx.fillStyle = `rgba(255,255,255,${0.25 + Math.random() * 0.55})`
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawHillLayer(ctx, baseY, amplitude, color, phase) {
  ctx.beginPath()
  ctx.moveTo(0, HEIGHT)
  ctx.lineTo(0, baseY)
  for (let x = 0; x <= WIDTH; x += 30) {
    const y =
      baseY +
      Math.sin((x / WIDTH) * Math.PI * 2 + phase) * amplitude +
      Math.sin((x / WIDTH) * Math.PI * 5 + phase * 2) * (amplitude * 0.35)
    ctx.lineTo(x, y)
  }
  ctx.lineTo(WIDTH, HEIGHT)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
}

function drawScene(ctx, scene) {
  drawSky(ctx, scene.sky)
  if (scene.stars) drawStars(ctx, scene.stars)
  drawGlow(ctx, scene.sun)
  drawHillLayer(ctx, HEIGHT * 0.66, 60, scene.hills[0], 0.6)
  drawHillLayer(ctx, HEIGHT * 0.76, 50, scene.hills[1], 2.2)
  drawHillLayer(ctx, HEIGHT * 0.88, 40, scene.hills[2], 4.1)

  // gentle scrim so the quote stays legible over the imagery
  const scrim = ctx.createLinearGradient(0, 0, 0, HEIGHT)
  scrim.addColorStop(0, 'rgba(10,20,25,0.18)')
  scrim.addColorStop(0.45, 'rgba(10,20,25,0.12)')
  scrim.addColorStop(1, 'rgba(5,15,18,0.5)')
  ctx.fillStyle = scrim
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
}

export async function generateQuoteWallpaper(quote, dayNum) {
  await Promise.all([
    document.fonts.load('italic 400 72px Fraunces'),
    document.fonts.load('800 28px "Plus Jakarta Sans"'),
    document.fonts.load('600 36px "Plus Jakarta Sans"'),
  ])
  await document.fonts.ready

  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const ctx = canvas.getContext('2d')

  const scene = SCENES[((dayNum || 1) - 1 + SCENES.length) % SCENES.length]
  drawScene(ctx, scene)

  ctx.textAlign = 'center'

  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.font = '800 30px "Plus Jakarta Sans"'
  ctx.letterSpacing = '12px'
  ctx.fillText('75 HARD', WIDTH / 2, 180)
  ctx.letterSpacing = '0px'

  if (dayNum) {
    ctx.fillStyle = 'rgba(255,255,255,0.45)'
    ctx.font = '600 32px "Plus Jakarta Sans"'
    ctx.fillText(`DAY ${dayNum}`, WIDTH / 2, 240)
  }

  const fontSize = quote.text.length > 110 ? 54 : quote.text.length > 70 ? 64 : 76
  ctx.fillStyle = '#FFFFFF'
  ctx.font = `italic 400 ${fontSize}px Fraunces`
  ctx.shadowColor = 'rgba(0,0,0,0.25)'
  ctx.shadowBlur = 24
  const maxWidth = WIDTH - 180
  const lines = wrapText(ctx, `“${quote.text}”`, maxWidth)
  const lineHeight = fontSize * 1.35
  const totalHeight = lines.length * lineHeight
  let y = HEIGHT * 0.4 - totalHeight / 2
  for (const line of lines) {
    ctx.fillText(line, WIDTH / 2, y)
    y += lineHeight
  }

  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.font = '600 36px "Plus Jakarta Sans"'
  ctx.shadowBlur = 16
  ctx.fillText(`— ${quote.author}`, WIDTH / 2, y + 50)
  ctx.shadowBlur = 0

  return new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/png')
  })
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
