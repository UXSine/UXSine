import { AlertTriangle } from 'lucide-react'

export default function KneeCallout({ kneeFeeling }) {
  if (kneeFeeling < 4) return null

  return (
    <div className="flex items-start gap-2.5 rounded-card border border-crimson/30 bg-crimson/10 px-3.5 py-3">
      <AlertTriangle size={18} strokeWidth={1.5} className="text-crimson mt-0.5 shrink-0" />
      <p className="text-sm text-bark">
        Heads up — a knee feeling of {kneeFeeling} is worth paying attention to. Consider an easy day tomorrow and
        check in with a physio if it persists.
      </p>
    </div>
  )
}
