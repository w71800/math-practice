import katex from 'katex'
import { useMemo } from 'react'

interface LatexAnswerProps {
  latex: string
}

function toKatexInput(latex: string): string {
  const trimmed = latex.trim()
  if (trimmed.includes('\\begin{')) return trimmed
  if (trimmed.includes('\\\\')) {
    return `\\begin{aligned}${trimmed}\\end{aligned}`
  }
  return trimmed
}

export function LatexAnswer({ latex }: LatexAnswerProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(toKatexInput(latex), {
        throwOnError: false,
        displayMode: true,
      })
    } catch {
      return `<span class="latex-error">${latex}</span>`
    }
  }, [latex])

  return (
    <div
      className="latex-answer"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
