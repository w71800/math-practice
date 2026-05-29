import { parse as parseYaml } from 'yaml'

const FRONT_MATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

export function parseFrontMatter(raw: string): {
  data: Record<string, unknown>
  content: string
} {
  const normalized = raw.replace(/\r\n/g, '\n')
  const match = normalized.match(FRONT_MATTER_RE)

  if (!match) {
    return { data: {}, content: normalized }
  }

  const yamlText = match[1]
  const content = normalized.slice(match[0].length)

  try {
    const parsed = parseYaml(yamlText)
    const data =
      parsed && typeof parsed === 'object' && !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>)
        : {}
    return { data, content }
  } catch {
    return { data: {}, content: normalized }
  }
}
