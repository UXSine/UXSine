import { useRef, useState } from 'react'
import { Camera, Check, X } from 'lucide-react'
import KneeCallout from './KneeCallout'

function compressPhoto(file) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const MAX = 900
      const scale = Math.min(1, MAX / Math.max(img.width, img.height))
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.72))
    }
    img.src = url
  })
}

const EFFORT_LABELS = ['Easy', 'Comfortable', 'Moderate', 'Hard', 'All-out']
const KNEE_LABELS = ['Great', 'Good', 'OK', 'Sore', 'Ouch']

function ScaleField({ label, value, onChange, scaleLabels }) {
  return (
    <div>
      <p className="label-caption mb-2">{label}</p>
      <div className="grid grid-cols-5 gap-1.5">
        {scaleLabels.map((scaleLabel, i) => {
          const n = i + 1
          const active = value === n
          return (
            <button
              type="button"
              key={n}
              onClick={() => onChange(n)}
              className={`flex flex-col items-center gap-1 rounded-card border py-2 transition-colors ${
                active ? 'border-canyon bg-canyon/10' : 'border-border bg-card'
              }`}
            >
              <span className={`text-sm font-display font-bold ${active ? 'text-canyon' : 'text-bark'}`}>{n}</span>
              <span className="text-[10px] text-muted leading-none text-center">{scaleLabel}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function WorkoutLogForm({ planDay, initialLog, onSave, onCancel, submitLabel = 'Save' }) {
  const [completed, setCompleted] = useState(initialLog?.completed ?? true)
  const [actualMiles, setActualMiles] = useState(initialLog?.actualMiles ?? planDay?.miles ?? 0)
  const [actualMinutes, setActualMinutes] = useState(initialLog?.actualMinutes ?? '')
  const [perceivedEffort, setPerceivedEffort] = useState(initialLog?.perceivedEffort ?? 3)
  const [kneeFeeling, setKneeFeeling] = useState(initialLog?.kneeFeeling ?? 1)
  const [notes, setNotes] = useState(initialLog?.notes ?? '')
  const [trailName, setTrailName] = useState(initialLog?.trailName ?? '')
  const [photoDataUrl, setPhotoDataUrl] = useState(initialLog?.photoDataUrl ?? null)
  const fileInputRef = useRef(null)

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const compressed = await compressPhoto(file)
    setPhotoDataUrl(compressed)
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSave({
      completed,
      actualMiles: Number(actualMiles) || 0,
      actualMinutes: Number(actualMinutes) || 0,
      perceivedEffort,
      kneeFeeling,
      notes,
      trailName,
      photoDataUrl,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <button
        type="button"
        onClick={() => setCompleted((c) => !c)}
        className="flex items-center gap-2.5 w-full"
      >
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
            completed ? 'bg-sage border-sage' : 'border-border bg-card'
          }`}
        >
          {completed && <Check size={14} strokeWidth={2.5} className="text-white" />}
        </span>
        <span className="text-sm font-body text-bark">Completed</span>
      </button>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="label-caption block mb-1.5">Actual miles</span>
          <input
            type="number"
            step="0.1"
            min="0"
            value={actualMiles}
            onChange={(e) => setActualMiles(e.target.value)}
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-bark focus:outline-none focus:border-canyon"
          />
        </label>
        <label className="block">
          <span className="label-caption block mb-1.5">Time on feet (min)</span>
          <input
            type="number"
            step="1"
            min="0"
            value={actualMinutes}
            onChange={(e) => setActualMinutes(e.target.value)}
            placeholder="0"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-bark focus:outline-none focus:border-canyon"
          />
        </label>
      </div>

      <ScaleField label="Perceived effort" value={perceivedEffort} onChange={setPerceivedEffort} scaleLabels={EFFORT_LABELS} />
      <ScaleField label="Knee feeling" value={kneeFeeling} onChange={setKneeFeeling} scaleLabels={KNEE_LABELS} />

      <KneeCallout kneeFeeling={kneeFeeling} />

      <label className="block">
        <span className="label-caption block mb-1.5">Trail name (if different from plan)</span>
        <input
          type="text"
          value={trailName}
          onChange={(e) => setTrailName(e.target.value)}
          placeholder={planDay?.title || ''}
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-bark focus:outline-none focus:border-canyon"
        />
      </label>

      <label className="block">
        <span className="label-caption block mb-1.5">Notes</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="How did it feel?"
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-bark focus:outline-none focus:border-canyon resize-none"
        />
      </label>

      <div>
        <p className="label-caption mb-2">Progress photo</p>
        {photoDataUrl ? (
          <div className="relative">
            <img src={photoDataUrl} alt="Progress" className="w-full rounded-card object-cover max-h-56" />
            <button
              type="button"
              onClick={() => setPhotoDataUrl(null)}
              className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-bark/70 text-cream"
            >
              <X size={14} strokeWidth={2} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-card border border-dashed border-border py-4 text-sm text-muted hover:border-canyon hover:text-canyon transition-colors"
          >
            <Camera size={16} strokeWidth={1.5} />
            Add a photo
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoChange}
          className="hidden"
        />
      </div>

      <div className="flex gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-md border border-border bg-card py-2.5 text-xs font-display font-bold uppercase tracking-widest text-muted"
          >
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary flex-1">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
