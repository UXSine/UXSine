export function exportData(challenge) {
  const json = JSON.stringify(challenge, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const date = new Date().toISOString().split('T')[0]

  const a = document.createElement('a')
  a.href = url
  a.download = `75hard-backup-${date}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function readBackupFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        if (!data || typeof data.startDate !== 'string' || typeof data.days !== 'object') {
          throw new Error('Invalid backup file')
        }
        resolve(data)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}
