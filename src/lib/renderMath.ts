import katex from 'katex'

const PROTECT_TOKEN_PREFIX = '%%MATHPROT'

type ProtectedSegment = {
  token: string
  content: string
}

function protectPattern(
  text: string,
  pattern: RegExp,
  segments: ProtectedSegment[],
): string {
  return text.replace(pattern, (match) => {
    const token = `${PROTECT_TOKEN_PREFIX}${segments.length}%%`
    segments.push({ token, content: match })
    return token
  })
}

function restoreProtected(text: string, segments: ProtectedSegment[]): string {
  let result = text
  for (const { token, content } of segments) {
    result = result.replaceAll(token, content)
  }
  return result
}

function renderKatex(tex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(tex.trim(), {
      displayMode,
      throwOnError: false,
    })
  } catch {
    const delimiter = displayMode ? '$$' : '$'
    return `<span class="latex-error">${delimiter}${tex}${delimiter}</span>`
  }
}

/** 將 Markdown 字串中的 $...$、$$...$$ 轉為 KaTeX HTML（需在 markdown-it 之前呼叫） */
export function renderMathInMarkdown(markdown: string): string {
  const protectedSegments: ProtectedSegment[] = []
  let text = markdown

  text = protectPattern(text, /```[\s\S]*?```/g, protectedSegments)
  text = protectPattern(text, /`[^`\n]+`/g, protectedSegments)

  text = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex: string) =>
    renderKatex(tex, true),
  )

  text = text.replace(
    /(?<!\$)\$(?!\$)((?:\\.|[^$\\\n])+?)\$(?!\$)/g,
    (_, tex: string) => renderKatex(tex, false),
  )

  return restoreProtected(text, protectedSegments)
}
