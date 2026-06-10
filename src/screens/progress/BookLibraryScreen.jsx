import { BookOpen } from '@phosphor-icons/react'
import DetailHeader from '../../components/DetailHeader'

export default function BookLibraryScreen({ state, onBack }) {
  const books = state.books || []

  return (
    <div className="screen screen--full">
      <DetailHeader title="Book library" onBack={onBack} />

      {books.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {books.map((b) => (
            <div className="card book-card" key={b.id}>
              <div className="book-cover">
                <BookOpen size={20} weight="regular" />
              </div>
              <div className="book-info">
                <div className="book-title">{b.title || 'Untitled'}</div>
                <div className="book-author">{b.author || 'Unknown author'}</div>
                <div className="book-progress">
                  <div className="task-meta">
                    {b.totalPagesRead || 0} pages read · started Day {b.startedDay}
                    {b.finishedDay ? ` · finished Day ${b.finishedDay}` : ''}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-body" style={{ color: 'var(--color-text-tertiary)' }}>No books logged yet.</p>
      )}
    </div>
  )
}
