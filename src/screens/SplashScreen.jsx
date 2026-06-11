import { useEffect } from 'react'

const SPLASH_QUOTE = {
  text: 'Day one, or one day. You decide.',
  author: 'Anonymous',
}

const SPLASH_DURATION = 3000

export default function SplashScreen({ onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, SPLASH_DURATION)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div className="screen--splash">
      <div className="splash-mark">75 HARD</div>
      <div className="quote-block splash-quote">
        <p className="quote-block__text">{SPLASH_QUOTE.text}</p>
        <p className="quote-block__attribution">{SPLASH_QUOTE.author}</p>
      </div>
    </div>
  )
}
