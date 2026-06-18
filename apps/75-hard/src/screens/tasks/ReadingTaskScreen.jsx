import { BookOpen } from '@phosphor-icons/react'
import DetailHeader from '../../components/DetailHeader'
import { READING_GOAL_PAGES } from '../../data/model'

const PAGE_STEPS = [1, 5, 10]

export default function ReadingTaskScreen({ dayLog, book, onUpdate, onUpdateBook, onBack }) {
  const reading = dayLog.tasks.reading || { bookId: book?.id || null, pagesRead: 0, currentPage: book?.totalPagesRead || 0 }
  const pagesRead = reading.pagesRead || 0
  const done = pagesRead >= READING_GOAL_PAGES

  const addPages = (n) => {
    const updated = {
      ...reading,
      bookId: book?.id || reading.bookId,
      pagesRead: Math.max(0, pagesRead + n),
      currentPage: Math.max(0, (reading.currentPage || 0) + n),
    }
    onUpdate({ reading: updated })
    onUpdateBook({ totalPagesRead: Math.max(0, (book?.totalPagesRead || 0) + n) })
  }

  return (
    <div className="screen screen--full">
      <DetailHeader title="Reading" onBack={onBack} />

      <div className="card book-card">
        <div className="book-cover">
          <BookOpen size={20} weight="regular" />
        </div>
        <div className="book-info">
          <input
            className="book-title text-input"
            style={{ border: 'none', padding: '4px 0', fontSize: 15, fontWeight: 700 }}
            value={book?.title || ''}
            placeholder="Book title"
            onChange={(e) => onUpdateBook({ title: e.target.value })}
          />
          <input
            className="book-author text-input"
            style={{ border: 'none', padding: '2px 0', fontSize: 12 }}
            value={book?.author || ''}
            placeholder="Author"
            onChange={(e) => onUpdateBook({ author: e.target.value })}
          />
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div className="text-stat">{reading.currentPage || 0}</div>
        <p className="text-caption">current page</p>
      </div>

      <div>
        <div className="section-header">Pages read today</div>
        <div className="text-stat-sm">{pagesRead} / {READING_GOAL_PAGES} pages</div>
        <div className="progress-bar" style={{ marginTop: 'var(--space-sm)' }}>
          <div className="progress-bar__fill" style={{ width: `${Math.min(100, (pagesRead / READING_GOAL_PAGES) * 100)}%` }} />
        </div>
      </div>

      <div className="chip-row" style={{ justifyContent: 'center' }}>
        {PAGE_STEPS.map((n) => (
          <button key={n} className="chip" onClick={() => addPages(n)}>+{n} page{n > 1 ? 's' : ''}</button>
        ))}
      </div>

      <button className={`btn-primary${done ? ' btn-cta' : ''}`} onClick={() => addPages(done ? -pagesRead : READING_GOAL_PAGES - pagesRead)}>
        {done ? 'Goal complete!' : 'Mark as done'}
      </button>
    </div>
  )
}
