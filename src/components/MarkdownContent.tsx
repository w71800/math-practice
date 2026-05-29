import { renderMarkdownToHtml } from '../lib/parsePractice'

interface MarkdownContentProps {
  markdown: string
}

export function MarkdownContent({ markdown }: MarkdownContentProps) {
  const html = renderMarkdownToHtml(markdown)

  return (
    <div
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
