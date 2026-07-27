import { useEffect, useState } from 'react'
import * as store from './lib/store'
import { backendName } from './lib/store'
import {
  automaticitySeries,
  currentScore,
  phase as derivePhase,
  todayLog,
} from './lib/derive'
import Woop from './screens/Woop'
import TodayView from './screens/TodayView'
import Pulse from './screens/Pulse'
import WeeklyReview from './screens/WeeklyReview'
import MissFlow from './screens/MissFlow'
import PhaseGlyph from './components/PhaseGlyph'

function NavButton({ active, onClick, label, glyph }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-1 py-2.5 structural ${active ? 'opacity-100' : 'opacity-45'}`}
    >
      {glyph}
      <span className="eyebrow text-pearl text-[10px]">{label}</span>
    </button>
  )
}

export default function App() {
  const [data, setData] = useState(null)
  const [view, setView] = useState('today') // today | progress
  const [overlay, setOverlay] = useState(null) // 'pulse' | 'miss'

  useEffect(() => {
    let alive = true
    ;(async () => {
      await store.init()
      const d = await store.load()
      if (alive) setData(d)
    })()
    return () => {
      alive = false
    }
  }, [])

  if (!data) {
    return (
      <div className="min-h-screen bg-ink cloth flex items-center justify-center">
        <p className="eyebrow text-pearl/50">Becoming…</p>
      </div>
    )
  }

  // Not onboarded yet -> WOOP.
  if (!data.woop) {
    return (
      <Woop
        onComplete={async (woop) => setData(await store.saveWoop(woop))}
      />
    )
  }

  const series = automaticitySeries(data.pulses)
  const score = currentScore(data.pulses)
  const phase = derivePhase({ logs: data.logs, pulses: data.pulses, paused: data.paused })
  const status = data.paused ? 'paused' : todayLog(data.logs)?.status || 'not-yet'

  // Overlays take the whole viewport.
  if (overlay === 'pulse') {
    return (
      <Shell backend={backendName}>
        <Pulse
          onCancel={() => setOverlay(null)}
          onDone={async (items) => {
            setData(await store.addPulse(items))
            setOverlay(null)
            setView('progress')
          }}
        />
      </Shell>
    )
  }
  if (overlay === 'miss') {
    return (
      <Shell backend={backendName}>
        <MissFlow
          identity={data.woop.identity}
          plan={data.woop.plan}
          onCancel={() => setOverlay(null)}
          onDone={async (extra) => {
            setData(await store.logToday('miss', extra))
            setOverlay(null)
          }}
        />
      </Shell>
    )
  }

  return (
    <Shell backend={backendName}>
      <div className="flex-1 overflow-y-auto">
        {view === 'today' ? (
          <TodayView
            identity={data.woop.identity}
            phase={phase}
            status={status}
            score={score}
            onComplete={async () => setData(await store.logToday('complete'))}
            onMiss={() => setOverlay('miss')}
          />
        ) : (
          <WeeklyReview series={series} score={score} phase={phase} logs={data.logs} />
        )}
      </div>

      <nav className="bg-ink cloth border-t border-pearl/10 flex items-stretch px-2 pb-[env(safe-area-inset-bottom)]">
        <NavButton
          active={view === 'today'}
          onClick={() => setView('today')}
          label="Today"
          glyph={<PhaseGlyphPearl filled={view === 'today'} />}
        />
        <button
          onClick={() => setOverlay('pulse')}
          className="flex-1 flex flex-col items-center gap-1 py-2.5 opacity-90 active:scale-95 structural"
        >
          <span className="w-6 h-6 rounded-full border-2 border-midnight bg-midnight/30 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-pearl" />
          </span>
          <span className="eyebrow text-pearl text-[10px]">Pulse</span>
        </button>
        <NavButton
          active={view === 'progress'}
          onClick={() => setView('progress')}
          label="Progress"
          glyph={<PhaseGlyph phase={phase} size={20} />}
        />
      </nav>
    </Shell>
  )
}

// Pearl outline/filled dot for the Today nav item (dark surface needs pearl, not ink).
function PhaseGlyphPearl({ filled }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
      {filled ? (
        <circle cx="10" cy="10" r="7" fill="#F4F1EA" />
      ) : (
        <circle cx="10" cy="10" r="7" fill="none" stroke="#F4F1EA" strokeWidth="1.8" />
      )}
    </svg>
  )
}

function Shell({ children, backend }) {
  return (
    <div className="min-h-screen bg-ink flex justify-center">
      <div className="w-full max-w-md min-h-screen flex flex-col bg-ink relative">
        {children}
        {backend === 'this device' && (
          <div className="absolute top-0 inset-x-0 flex justify-center pointer-events-none">
            <span className="eyebrow text-pearl/30 text-[9px] mt-1.5">
              local · add Supabase keys to sync
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
