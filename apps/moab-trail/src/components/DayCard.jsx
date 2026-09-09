import { useState } from 'react'
import { AlertCircle, Apple, Check, ChevronDown, ChevronUp, Droplets } from 'lucide-react'
import WorkoutTypeTag from './WorkoutTypeTag'
import KneeCallout from './KneeCallout'
import LogModal from './LogModal'
import WorkoutLogForm from './WorkoutLogForm'
import { formatDate, getDateForWeekDay } from '../utils/dates'

function StrengthList({ exercises }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-widest text-sage"
      >
        Strength exercises
        {open ? <ChevronUp size={14} strokeWidth={1.5} /> : <ChevronDown size={14} strokeWidth={1.5} />}
      </button>
      {open && (
        <ul className="mt-2 space-y-1.5 list-disc list-inside text-sm text-muted">
          {exercises.map((ex) => (
            <li key={ex}>{ex}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

function TipsSection({ education }) {
  const [open, setOpen] = useState(false)
  if (!education) return null
  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-widest text-sandstone"
      >
        Tips for today
        {open ? <ChevronUp size={14} strokeWidth={1.5} /> : <ChevronDown size={14} strokeWidth={1.5} />}
      </button>
      {open && (
        <div className="mt-2 space-y-2">
          <div className="flex gap-2 text-sm text-muted leading-relaxed">
            <AlertCircle size={15} strokeWidth={1.5} className="mt-0.5 shrink-0 text-crimson" />
            <p>{education.injury}</p>
          </div>
          <div className="flex gap-2 text-sm text-muted leading-relaxed">
            <Apple size={15} strokeWidth={1.5} className="mt-0.5 shrink-0 text-sage" />
            <p>{education.fuel}</p>
          </div>
          <div className="flex gap-2 text-sm text-muted leading-relaxed">
            <Droplets size={15} strokeWidth={1.5} className="mt-0.5 shrink-0 text-sky" />
            <p>{education.hydration}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function DayCard({ weekNumber, day, log, onSaveLog }) {
  const [modalOpen, setModalOpen] = useState(false)
  const completed = !!log?.completed
  const dateLabel = formatDate(getDateForWeekDay(weekNumber, day.dayName))

  function handleSave(formData) {
    onSaveLog({
      weekNumber,
      dayName: day.dayName,
      date: getDateForWeekDay(weekNumber, day.dayName),
      ...formData,
    })
    setModalOpen(false)
  }

  return (
    <div className={`card p-4 ${completed ? 'bg-cream/70' : ''}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <p className="label-caption">
            {day.dayName} · {dateLabel}
          </p>
          <h3 className="text-base font-display font-medium text-bark mt-0.5">{day.title}</h3>
        </div>
        <WorkoutTypeTag workoutType={day.workoutType} />
      </div>

      <p className="text-sm text-muted leading-relaxed">{day.description}</p>

      {day.strengthExercises && <StrengthList exercises={day.strengthExercises} />}

      <TipsSection education={day.education} />

      {day.workoutType !== 'Rest' && (
        <button
          onClick={() => setModalOpen(true)}
          className={`mt-3 inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-display font-bold uppercase tracking-widest transition-colors ${
            completed ? 'bg-sage/15 text-sage' : 'bg-canyon text-white hover:bg-crimson'
          }`}
        >
          <Check size={14} strokeWidth={2.5} />
          {completed ? 'Completed — edit' : 'Mark Complete'}
        </button>
      )}

      {log && (
        <div className="mt-3 pt-3 border-t border-border space-y-2">
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <p className="label-caption">Miles</p>
              <p className="text-bark font-display font-bold">{log.actualMiles}</p>
            </div>
            <div>
              <p className="label-caption">Effort</p>
              <p className="text-bark font-display font-bold">{log.perceivedEffort}/5</p>
            </div>
            <div>
              <p className="label-caption">Knee</p>
              <p className="text-bark font-display font-bold">{log.kneeFeeling}/5</p>
            </div>
          </div>
          {log.trailName && (
            <p className="text-sm text-muted">
              <span className="text-bark">Trail:</span> {log.trailName}
            </p>
          )}
          {log.notes && <p className="text-sm text-muted italic">"{log.notes}"</p>}
          {log.photoDataUrl && (
            <img src={log.photoDataUrl} alt="Progress" className="w-full rounded-card object-cover max-h-56 mt-1" />
          )}
          <KneeCallout kneeFeeling={log.kneeFeeling} />
        </div>
      )}

      {modalOpen && (
        <LogModal title={day.title} onClose={() => setModalOpen(false)}>
          <WorkoutLogForm planDay={day} initialLog={log} onSave={handleSave} onCancel={() => setModalOpen(false)} />
        </LogModal>
      )}
    </div>
  )
}
