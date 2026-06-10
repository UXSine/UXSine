import { ArrowLeft } from '@phosphor-icons/react'

export default function DetailHeader({ title, onBack }) {
  return (
    <div className="detail-screen-header">
      <button className="btn-icon" onClick={onBack} aria-label="Back">
        <ArrowLeft size={20} weight="regular" />
      </button>
      <h1 className="detail-screen-title">{title}</h1>
    </div>
  )
}
