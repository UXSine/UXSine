const WIDTH = 1170
const HEIGHT = 2532

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

  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT)
  gradient.addColorStop(0, '#3F9396')
  gradient.addColorStop(1, '#1F4D4F')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  ctx.textAlign = 'center'

  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.font = '800 30px "Plus Jakarta Sans"'
  ctx.letterSpacing = '12px'
  ctx.fillText('75 HARD', WIDTH / 2, 180)
  ctx.letterSpacing = '0px'

  if (dayNum) {
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.font = '600 32px "Plus Jakarta Sans"'
    ctx.fillText(`DAY ${dayNum}`, WIDTH / 2, 240)
  }

  const fontSize = quote.text.length > 110 ? 54 : quote.text.length > 70 ? 64 : 76
  ctx.fillStyle = '#FFFFFF'
  ctx.font = `italic 400 ${fontSize}px Fraunces`
  const maxWidth = WIDTH - 180
  const lines = wrapText(ctx, `“${quote.text}”`, maxWidth)
  const lineHeight = fontSize * 1.35
  const totalHeight = lines.length * lineHeight
  let y = (HEIGHT - totalHeight) / 2
  for (const line of lines) {
    ctx.fillText(line, WIDTH / 2, y)
    y += lineHeight
  }

  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.font = '600 36px "Plus Jakarta Sans"'
  ctx.fillText(`— ${quote.author}`, WIDTH / 2, y + 50)

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
