import { useRef } from 'react'
import { Camera } from '@phosphor-icons/react'
import DetailHeader from '../../components/DetailHeader'

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function PhotoTaskScreen({ dayLog, onUpdate, onBack }) {
  const photo = dayLog.tasks.photo || { taken: false, frontUri: null, sideUri: null, notes: '' }
  const frontRef = useRef(null)
  const sideRef = useRef(null)

  const update = (patch) => onUpdate({ photo: { ...photo, ...patch } })

  const handleFile = async (slot, file) => {
    if (!file) return
    const uri = await readAsDataURL(file)
    update({ [slot]: uri, taken: true })
  }

  return (
    <div className="screen screen--full">
      <DetailHeader title="Progress photo" onBack={onBack} />

      <div className="photo-slots">
        <div className="photo-slot" onClick={() => frontRef.current?.click()}>
          {photo.frontUri ? (
            <img src={photo.frontUri} alt="Front progress" />
          ) : (
            <>
              <Camera size={28} weight="regular" />
              <span className="photo-slot__label">Front</span>
            </>
          )}
          <input
            ref={frontRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleFile('frontUri', e.target.files?.[0])}
          />
        </div>
        <div className="photo-slot" onClick={() => sideRef.current?.click()}>
          {photo.sideUri ? (
            <img src={photo.sideUri} alt="Side progress" />
          ) : (
            <>
              <Camera size={28} weight="regular" />
              <span className="photo-slot__label">Side</span>
            </>
          )}
          <input
            ref={sideRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleFile('sideUri', e.target.files?.[0])}
          />
        </div>
      </div>

      <div>
        <div className="section-header">Notes</div>
        <textarea
          className="text-input"
          rows={3}
          placeholder="How are you feeling about your progress?"
          value={photo.notes || ''}
          onChange={(e) => update({ notes: e.target.value })}
        />
      </div>

      <button className={`btn-primary${photo.taken ? ' btn-cta' : ''}`} onClick={() => update({ taken: !photo.taken })}>
        {photo.taken ? 'Goal complete!' : "I took today's photo"}
      </button>
    </div>
  )
}
