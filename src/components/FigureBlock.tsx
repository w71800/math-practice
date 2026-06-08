import type { PracticeFigure } from '../lib/parseFigure'

interface FigureBlockProps {
  figure: PracticeFigure
}

function resolvePublicUrl(path: string): string {
  const base = import.meta.env.BASE_URL
  const normalized = path.replace(/^\//, '')
  return `${base}${normalized}`
}

export function FigureBlock({ figure }: FigureBlockProps) {
  const alt = figure.alt ?? '圖形'

  if (figure.source === 'file' && figure.path) {
    return (
      <figure className="practice-figure" data-figure-id={figure.id}>
        <img
          className="figure-img"
          src={resolvePublicUrl(figure.path)}
          alt={alt}
          loading="lazy"
          decoding="async"
        />
      </figure>
    )
  }

  if (figure.source === 'svg' && figure.svg) {
    return (
      <figure className="practice-figure" data-figure-id={figure.id}>
        <div
          className="figure-svg"
          role="img"
          aria-label={alt}
          dangerouslySetInnerHTML={{ __html: figure.svg }}
        />
      </figure>
    )
  }

  return (
    <figure className="practice-figure practice-figure--error" data-figure-id={figure.id}>
      <p className="figure-error">（圖形無法顯示：缺少 path 或 SVG 內容）</p>
    </figure>
  )
}
