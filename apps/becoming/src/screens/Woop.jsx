import { useState } from 'react'

// WOOP onboarding — Wish, Outcome, Obstacle, Plan. One question per screen,
// guided-journaling pace: generous spacing, Caslon prompts over a flyleaf field,
// no progress-bar gamification (a 1-of-4 eyebrow is enough).

const STEPS = [
  {
    key: 'wish',
    eyebrow: 'Wish · 1 of 4',
    prompt: 'Who are you becoming?',
    help: 'Finish the sentence: “I’m someone who…”. Phrase it as an identity, not a target.',
    placeholder: 'trains in the morning, even on hard weeks',
  },
  {
    key: 'outcome',
    eyebrow: 'Outcome · 2 of 4',
    prompt: 'What does becoming that person make possible?',
    help: 'The best outcome, in your own words.',
    placeholder: 'I feel steady and clear before the day starts',
  },
  {
    key: 'obstacle',
    eyebrow: 'Obstacle · 3 of 4',
    prompt: 'What inside you tends to get in the way?',
    help: 'The real internal obstacle — not the weather, but the thought.',
    placeholder: 'I tell myself I’ll do it later and then don’t',
  },
  {
    key: 'plan',
    eyebrow: 'Plan · 4 of 4',
    prompt: 'When that obstacle shows up, what will you do?',
    help: 'An implementation intention: “When [cue], I will [action].”',
    placeholder: 'When my alarm goes off, I will put my feet on the floor before thinking',
  },
]

export default function Woop({ onComplete }) {
  const [i, setI] = useState(0)
  const [vals, setVals] = useState({ wish: '', outcome: '', obstacle: '', plan: '' })
  const step = STEPS[i]
  const value = vals[step.key]
  const canNext = value.trim().length > 0
  const last = i === STEPS.length - 1

  function next() {
    if (!canNext) return
    if (last) {
      onComplete({ ...vals, identity: vals.wish.trim() })
    } else {
      setI(i + 1)
    }
  }

  return (
    <div className="min-h-full bg-flyleaf text-ink flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-8 py-12 max-w-md mx-auto w-full">
        <p className="eyebrow text-garnet mb-8">{step.eyebrow}</p>
        <h1 className="font-display text-[30px] leading-[1.2] mb-3">{step.prompt}</h1>
        <p className="text-ink/60 text-[15px] leading-relaxed mb-8">{step.help}</p>
        <textarea
          autoFocus
          value={value}
          onChange={(e) => setVals({ ...vals, [step.key]: e.target.value })}
          placeholder={step.placeholder}
          rows={3}
          className="w-full bg-transparent border-b border-ink/25 focus:border-ink outline-none resize-none font-display text-[22px] leading-snug placeholder:text-ink/25 pb-2 structural"
        />
      </div>

      <div className="px-8 pb-12 max-w-md mx-auto w-full flex items-center justify-between">
        <button
          onClick={() => setI(Math.max(0, i - 1))}
          className={`eyebrow text-ink/50 py-2 ${i === 0 ? 'invisible' : ''}`}
        >
          Back
        </button>
        <button
          onClick={next}
          disabled={!canNext}
          className="bg-garnet text-pearl rounded-full px-8 py-3.5 font-body text-[15px] font-medium disabled:opacity-30 structural"
        >
          {last ? 'Begin' : 'Next'}
        </button>
      </div>
    </div>
  )
}
