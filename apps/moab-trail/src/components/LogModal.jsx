import { X } from 'lucide-react'

export default function LogModal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-30 flex items-end md:items-center justify-center bg-bark/40"
      onClick={onClose}
    >
      <div
        className="w-full md:max-w-md max-h-[90vh] overflow-y-auto rounded-t-card md:rounded-card bg-cream p-4 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-display font-bold text-bark">{title}</h2>
          <button onClick={onClose} aria-label="Close">
            <X size={20} strokeWidth={1.5} className="text-muted" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
