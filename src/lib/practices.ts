import { parsePracticeRaw, type ParsedPractice, type PracticeMeta } from './parsePractice'

const practiceModules = import.meta.glob('../../practices/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function fileToSlug(path: string): string {
  const name = path.split('/').pop() ?? path
  return name.replace(/\.md$/, '')
}

function loadAll(): ParsedPractice[] {
  return Object.entries(practiceModules).map(([path, raw]) => {
    const fallbackSlug = fileToSlug(path)
    return parsePracticeRaw(raw, fallbackSlug)
  })
}

const allPractices = loadAll()

export function getPracticeList(): PracticeMeta[] {
  return allPractices
    .map(({ title, slug, description }) => ({ title, slug, description }))
    .sort((a, b) => a.title.localeCompare(b.title, 'zh-Hant'))
}

export function getPracticeBySlug(slug: string): ParsedPractice | undefined {
  return allPractices.find((p) => p.slug === slug)
}
