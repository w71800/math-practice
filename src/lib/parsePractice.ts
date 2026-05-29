import MarkdownIt from 'markdown-it'
import { parseFrontMatter } from './frontMatter'

export interface PracticeMeta {
  title: string
  slug: string
  description?: string
}

export interface PracticeQuestion {
  id: string
  bodyMarkdown: string
  answerLatex: string
  isAnswerPending: boolean
}

export type PracticeBlock =
  | { type: 'markdown'; content: string }
  | { type: 'question'; question: PracticeQuestion }

export interface ParsedPractice extends PracticeMeta {
  blocks: PracticeBlock[]
}

const QUESTION_RE = /:::question\s*\n([\s\S]*?)\n:::/g
const ANSWER_SPLIT_RE = /\nanswer:\s*\n/i

const BLANK_HTML =
  '<span class="blank-box" aria-hidden="true"></span>'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
})

export function isPendingAnswer(answer: string): boolean {
  const trimmed = answer.trim()
  if (!trimmed) return true
  return /^TODO$/i.test(trimmed) || trimmed.includes('TODO')
}

export function parsePracticeRaw(raw: string, sourceSlug?: string): ParsedPractice {
  const { data, content } = parseFrontMatter(raw)

  const title = String(data.title ?? '未命名練習')
  const slug = String(data.slug ?? sourceSlug ?? 'untitled')
  const description = data.description ? String(data.description) : undefined

  const blocks: PracticeBlock[] = []
  let lastIndex = 0
  let questionIndex = 0

  const contentNormalized = content.replace(/\r\n/g, '\n')
  QUESTION_RE.lastIndex = 0

  let match: RegExpExecArray | null
  while ((match = QUESTION_RE.exec(contentNormalized)) !== null) {
    const before = contentNormalized.slice(lastIndex, match.index).trim()
    if (before) {
      blocks.push({ type: 'markdown', content: before })
    }

    const inner = match[1]
    const parts = inner.split(ANSWER_SPLIT_RE)
    const bodyMarkdown = (parts[0] ?? '').trim()
    const answerLatex = (parts[1] ?? '').trim()

    questionIndex += 1
    blocks.push({
      type: 'question',
      question: {
        id: `q${questionIndex}`,
        bodyMarkdown,
        answerLatex,
        isAnswerPending: isPendingAnswer(answerLatex),
      },
    })

    lastIndex = match.index + match[0].length
  }

  const tail = contentNormalized.slice(lastIndex).trim()
  if (tail) {
    blocks.push({ type: 'markdown', content: tail })
  }

  return { title, slug, description, blocks }
}

/** 將 {{blank}} 轉為內嵌 HTML 後一次渲染，避免拆碎 table 結構 */
export function renderMarkdownToHtml(markdown: string): string {
  const withBlanks = markdown.replace(/\{\{blank\}\}/g, BLANK_HTML)
  return md.render(withBlanks)
}
