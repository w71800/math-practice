import type { PracticeQuestion } from '../lib/parsePractice'
import { LatexAnswer } from './LatexAnswer'
import { MarkdownContent } from './MarkdownContent'

interface QuestionBlockProps {
  question: PracticeQuestion
  isOpen: boolean
  onToggle: () => void
}

export function QuestionBlock({ question, isOpen, onToggle }: QuestionBlockProps) {
  return (
    <article className="question-block" data-question-id={question.id}>
      <div className="question-body">
        <MarkdownContent markdown={question.bodyMarkdown} />
      </div>
      <footer className="question-footer">
        <button type="button" className="btn-answer" onClick={onToggle}>
          {isOpen ? '收起解答' : '解答'}
        </button>
      </footer>
      {isOpen && (
        <div className="answer-panel" role="region" aria-label="解答">
          {question.isAnswerPending ? (
            <p className="answer-pending">（答案待補）</p>
          ) : (
            <LatexAnswer latex={question.answerLatex} />
          )}
        </div>
      )}
    </article>
  )
}
