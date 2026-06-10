import { useRef, useState } from 'react'
import { exportData, readBackupFile } from '../utils/backup'

export default function BackupCard({ challenge, onImport }) {
  const fileInputRef = useRef(null)
  const [error, setError] = useState('')

  const handleExport = () => {
    exportData(challenge)
  }

  const handleImportClick = () => {
    setError('')
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const data = await readBackupFile(file)
      const ok = window.confirm(
        'Importing will replace your current progress with this backup. Continue?'
      )
      if (ok) onImport(data)
    } catch {
      setError("That file doesn't look like a valid 75 Hard backup.")
    } finally {
      e.target.value = ''
    }
  }

  return (
    <section className="backup-card">
      <h2 className="card-title serif">Backup your data</h2>
      <p className="backup-sub">
        Your progress is saved on this device only. Export a backup file
        regularly so you don't lose it.
      </p>
      <div className="backup-actions">
        <button className="btn-pill-outline" onClick={handleExport}>
          Export Data
        </button>
        <button className="btn-pill-outline" onClick={handleImportClick}>
          Import Data
        </button>
      </div>
      {error && <p className="backup-error">{error}</p>}
      <input
        type="file"
        accept="application/json"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </section>
  )
}
