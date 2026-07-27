import { useState } from 'react'

// SRBAI pulse — the input control IS the design problem. Four compact rows, a
// 5-point horizontal tap-scale each (not a slider — too slow for the budget).
// Selecting a row auto-advances; the whole thing is four taps, no scrolling.
//
// NOTE: item wording is placeholder-in-the-right-shape. Confirm against the
// validated SRBAI instrument before v1 ship (see DESIGN_SYSTEM.md open items).

const ITEMS = [
  'I do it automatically',
  'I do it without having to consciously remember',
  'I do it without thinking',
  'I start doing it before I realize I’m doing it',
]

export default function Pulse({ onDone, onCancel }) {
  const [answers, setAnswers] = useState([null, null, null, null])
  const answered = answers.filter((a) => a != null).length
  const complete = answered === ITEMS.length

  function pick(row, val) {
    const next = [...answers]
    next[row] = val
    setAnswers(next)
  }

  return (
    <div className="min-h-full bg-paper text-ink flex flex-col">
      <div className="pt-6 px-6 flex items-center justify-between">
        <button onClick={onCancel} className="eyebrow text-ink/40 py-2">
          Close
        </button>
        {/* speed bar — four answers, no more */}
        <div className="flex gap-1.5">
          {answers.map((a, i) => (
            <span
              key={i}
              className={`h-1.5 w-6 rounded-full structural ${a != null ? 'bg-midnight' : 'bg-ink/15'}`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 max-w-md mx-auto w-full">
        <p className="eyebrow text-midnight mb-2">Pulse · SRBAI</p>
        <h1 className="font-display text-[22px] leading-snug mb-8">
          How automatic does it feel right now?
        </h1>

        <div className="space-y-6">
          {ITEMS.map((item, row) => (
            <div key={row}>
              <p className="font-body text-[15px] text-ink/85 mb-2.5">{item}</p>
              <div className="flex items-center justify-between gap-2">
                {[1, 2, 3, 4, 5].map((val) => {
                  const on = answers[row] === val
                  return (
                    <button
                      key={val}
                      onClick={() => pick(row, val)}
                      aria-label={`${item}: ${val} of 5`}
                      className={`flex-1 h-11 rounded-control border structural ${
                        on
                          ? 'bg-ink border-ink'
                          : 'bg-transparent border-ink/20 hover:border-ink/45'
                      }`}
                    >
                      <span
                        className={`block w-2 h-2 rounded-full mx-auto ${on ? 'bg-paper' : 'bg-ink/25'}`}
                      />
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between eyebrow text-ink/40 mt-3 px-1">
          <span>not at all</span>
          <span>completely</span>
        </div>
      </div>

      <div className="px-6 pb-12 max-w-md mx-auto w-full">
        <button
          onClick={() => onDone(answers)}
          disabled={!complete}
          className="w-full bg-midnight text-pearl rounded-full py-3.5 font-body text-[15px] font-medium disabled:opacity-30 structural"
        >
          Record pulse
        </button>
      </div>
    </div>
  )
}
