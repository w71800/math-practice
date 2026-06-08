export type FigureSource = 'svg' | 'file'

export interface PracticeFigure {
  id: string
  source: FigureSource
  /** source=svg：內嵌 SVG 字串 */
  svg?: string
  /** source=file：相對 public/ 的路徑，如 figures/foo.svg */
  path?: string
  alt?: string
}

const KEY_VALUE_RE = /^([A-Za-z][\w-]*)\s*:\s*(.+)$/

/** 解析 :::figure source=file 開頭標籤上的屬性 */
export function parseFigureAttrs(attrString: string): Record<string, string> {
  const attrs: Record<string, string> = {}
  const tokens = attrString.trim().split(/\s+/)
  for (const token of tokens) {
    const eq = token.indexOf('=')
    if (eq > 0) {
      attrs[token.slice(0, eq)] = token.slice(eq + 1)
    }
  }
  return attrs
}

function parseKeyValueBody(body: string): Record<string, string> {
  const result: Record<string, string> = {}
  for (const line of body.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue
    const match = KEY_VALUE_RE.exec(trimmed)
    if (match) {
      result[match[1]] = match[2].trim()
    }
  }
  return result
}

function inferSource(
  attrs: Record<string, string>,
  body: string,
): FigureSource {
  if (attrs.source === 'file' || attrs.source === 'svg') {
    return attrs.source
  }
  const trimmed = body.trim()
  if (trimmed.startsWith('<svg') || trimmed.startsWith('<?xml')) {
    return 'svg'
  }
  if (/^path\s*:/m.test(trimmed)) {
    return 'file'
  }
  return 'svg'
}

export function parseFigureContent(
  attrString: string,
  inner: string,
): Omit<PracticeFigure, 'id'> {
  const attrs = parseFigureAttrs(attrString)
  const body = inner.trim()
  const source = inferSource(attrs, body)

  if (source === 'file') {
    const kv = parseKeyValueBody(body)
    const path = kv.path ?? attrs.path
    if (!path) {
      throw new Error(':::figure source=file 需要 path:')
    }
    return { source: 'file', path, alt: kv.alt ?? attrs.alt }
  }

  if (body.startsWith('<svg') || body.startsWith('<?xml')) {
    return { source: 'svg', svg: body, alt: attrs.alt }
  }

  const kv = parseKeyValueBody(body)
  if (kv.path) {
    return { source: 'file', path: kv.path, alt: kv.alt ?? attrs.alt }
  }

  return { source: 'svg', svg: body, alt: kv.alt ?? attrs.alt }
}
