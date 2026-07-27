import { useState } from 'react'
import { ATTRIBUTIONS } from '../lib/derive'

// Miss-response flow — three screens on the dark cloth surface, in strict order.
// The order itself is the safeguard: identity and competence support come BEFORE
// anything about the miss. No failure language, no color-coding, ever.

export default function MissFlow({ identity, plan, onDone, onCancel }) {
  const [step, setStep] = useState(0)
  const [attribution, setAttribution] = useState(null)
  const [planForward, setPlanForward] = useState(plan || '')

  return (
    <div className="min-h-full bg-ink cloth text-pearl flex flex-col">
      <div className="pt-6 px-6">
        <button onClick={onCancel} className="eyebrow text-pearl/40 py-2">
          Close
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center px-8 max-w-md mx-auto w-full">
        {step === 0 && (
          <div>
            <p className="eyebrow text-pearl/45 mb-8">One miss is data, not a verdict</p>
            <h1 className="font-display text-[28px] leading-[1.3]">
              You’re someone who <span className="italic">{identity}</span> — even on hard weeks.
            </h1>
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="eyebrow text-pearl/45 mb-8">What got in the way today?</p>
            <div className="flex flex-wrap gap-2.5">
              {ATTRIBUTIONS.map((a) => {
                const on = attribution === a
                return (
                  <button
                    key={a}
                    onClick={() => setAttribution(a)}
                    className={`rounded-full px-4 py-2.5 font-body text-[15px] border structural ${
                      on
                        ? 'bg-pearl text-ink border-pearl'
                        : 'border-pearl/30 text-pearl/85 hover:border-pearl/60'
                    }`}
                  >
                    {a}
                  </button>
                )
              })}
            </div>
            <p className="text-pearl/40 text-[13px] mt-6 leading-relaxed">
              This is only used to spot patterns for you — never shown as a judgment.
            </p>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="eyebrow text-pearl/45 mb-8">One thing that makes tomorrow easier</p>
            <textarea
              autoFocus
              value={planForward}
              onChange={(e) => setPlanForward(e.target.value)}
              rows={3}
              placeholder="When [cue], I will [action]"
              className="w-full bg-transparent border-b border-pearl/25 focus:border-pearl outline-none resize-none font-display text-[21px] leading-snug placeholder:text-pearl/25 pb-2 structural"
            />
          </div>
        )}
      </div>

      <div className="px-8 pb-12 max-w-md mx-auto w-full flex justify-end">
        <button
          onClick={() => {
            if (step < 2) setStep(step + 1)
            else onDone({ attribution, plan_forward: planForward.trim() || null })
          }}
          disabled={step === 1 && !attribution}
          className="bg-pearl text-ink rounded-full px-8 py-3.5 font-body text-[15px] font-medium disabled:opacity-30 structural"
        >
          {step === 2 ? 'Save the plan' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
