import { useCallback, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MarkdownContent } from '../components/MarkdownContent'
import { QuestionBlock } from '../components/QuestionBlock'
import { getPracticeBySlug } from '../lib/practices'

export function PracticePage() {
  const { slug } = useParams<{ slug: string }>()
  const practice = slug ? getPracticeBySlug(slug) : undefined

  const questionIds = useMemo(
    () =>
      practice?.blocks
        .filter((b) => b.type === 'question')
        .map((b) => (b.type === 'question' ? b.question.id : '')) ?? [],
    [practice],
  )

  const [openMap, setOpenMap] = useState<Record<string, boolean>>({})
  const [allOpen, setAllOpen] = useState(false)

  const toggleQuestion = useCallback((id: string) => {
    setOpenMap((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      return next
    })
    setAllOpen(false)
  }, [])

  const handleToggleAll = useCallback(() => {
    setAllOpen((prevAll) => {
      const nextAll = !prevAll
      if (nextAll) {
        const next: Record<string, boolean> = {}
        for (const id of questionIds) next[id] = true
        setOpenMap(next)
      } else {
        setOpenMap({})
      }
      return nextAll
    })
  }, [questionIds])

  if (!practice) {
    return (
      <div className="page practice-page">
        <p className="empty-state">找不到此練習（slug: {slug}）</p>
        <Link to="/" className="back-link">
          ← 返回練習列表
        </Link>
      </div>
    )
  }

  const anyOpen = questionIds.some((id) => openMap[id])

  return (
    <div className="page practice-page">
      <header className="practice-toolbar">
        <Link to="/" className="back-link">
          ← 練習列表
        </Link>
        {questionIds.length > 0 && (
          <button type="button" className="btn-toggle-all" onClick={handleToggleAll}>
            {allOpen || anyOpen ? '全部收起解答' : '全部顯示解答'}
          </button>
        )}
      </header>

      <header className="practice-title-block">
        <h1>{practice.title}</h1>
        {practice.description ? <p className="practice-desc">{practice.description}</p> : null}
      </header>

      <div className="practice-content">
        {practice.blocks.map((block, index) => {
          if (block.type === 'markdown') {
            return (
              <section key={`md-${index}`} className="markdown-section">
                <MarkdownContent markdown={block.content} />
              </section>
            )
          }

          const { question } = block
          return (
            <QuestionBlock
              key={question.id}
              question={question}
              isOpen={Boolean(openMap[question.id])}
              onToggle={() => toggleQuestion(question.id)}
            />
          )
        })}
      </div>
    </div>
  )
}
