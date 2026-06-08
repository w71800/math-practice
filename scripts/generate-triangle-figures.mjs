/**
 * 產生正餘弦定理練習用三角形 SVG（輸出至 public/figures/sine-cosine-law/）
 * 執行：node scripts/generate-triangle-figures.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '../public/figures/sine-cosine-law')

const W = 280
const H = 220
const PAD = 28

/** @typedef {{ x: number, y: number }} Point */
/** @typedef {{ A?: string, B?: string, C?: string }} AngleLabels */
/** @typedef {{ a?: string, b?: string, c?: string }} SideLabels */

/** @param {Point} p */
function len(p) {
  return Math.hypot(p.x, p.y)
}

/** @param {Point} p */
function unit(p) {
  const l = len(p) || 1
  return { x: p.x / l, y: p.y / l }
}

/** @param {Point} from @param {Point} to */
function vec(from, to) {
  return { x: to.x - from.x, y: to.y - from.y }
}

/** @param {Point} vertex @param {Point} p1 @param {Point} p2 */
function inwardBisector(vertex, p1, p2) {
  const u1 = unit(vec(vertex, p1))
  const u2 = unit(vec(vertex, p2))
  return unit({ x: u1.x + u2.x, y: u1.y + u2.y })
}

/** @param {Point} vertex @param {Point} p1 @param {Point} p2 @param {number} dist */
function angleLabelPoint(vertex, p1, p2, dist) {
  const bis = inwardBisector(vertex, p1, p2)
  return { x: vertex.x + bis.x * dist, y: vertex.y + bis.y * dist }
}

/** @param {Point} vertex @param {Point} p1 @param {Point} p2 @param {Point} centroid @param {number} dist */
function vertexLabelPoint(vertex, p1, p2, centroid, dist) {
  const bis = inwardBisector(vertex, p1, p2)
  const toCenter = unit(vec(vertex, centroid))
  const dot = bis.x * toCenter.x + bis.y * toCenter.y
  const outward = dot > 0 ? { x: -bis.x, y: -bis.y } : bis
  return { x: vertex.x + outward.x * dist, y: vertex.y + outward.y * dist }
}

/** @param {Point} from @param {Point} to @param {Point} interiorRef @param {number} dist */
function sideLabelPoint(from, to, interiorRef, dist) {
  const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 }
  const edge = unit(vec(from, to))
  const normal = { x: -edge.y, y: edge.x }
  const toInterior = vec(mid, interiorRef)
  const sign = normal.x * toInterior.x + normal.y * toInterior.y >= 0 ? 1 : -1
  return { x: mid.x + normal.x * dist * sign, y: mid.y + normal.y * dist * sign }
}

/**
 * @param {Point} vertex
 * @param {Point} p1
 * @param {Point} p2
 * @param {number} r
 */
function interiorArc(vertex, p1, p2, r) {
  const a1 = Math.atan2(p1.y - vertex.y, p1.x - vertex.x)
  const a2 = Math.atan2(p2.y - vertex.y, p2.x - vertex.x)
  let diff = a2 - a1
  while (diff <= -Math.PI) diff += 2 * Math.PI
  while (diff > Math.PI) diff -= 2 * Math.PI

  const sweep = diff > 0 ? 1 : 0
  const start = {
    x: vertex.x + r * Math.cos(a1),
    y: vertex.y + r * Math.sin(a1),
  }
  const end = {
    x: vertex.x + r * Math.cos(a2),
    y: vertex.y + r * Math.sin(a2),
  }
  return `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} A ${r} ${r} 0 0 ${sweep} ${end.x.toFixed(1)} ${end.y.toFixed(1)}`
}

/**
 * @param {object} opts
 * @param {number} [opts.angleA=55]
 * @param {number} [opts.angleB=65]
 * @param {AngleLabels} [opts.angles]
 * @param {SideLabels} [opts.sides]
 * @param {string[]} [opts.highlight]
 */
function buildTriangleSvg({
  angleA = 55,
  angleB = 65,
  angles = {},
  sides = {},
  highlight = [],
}) {
  const ax = PAD + 20
  const ay = H - PAD
  const bx = W - PAD - 20
  const by = ay

  const radA = (angleA * Math.PI) / 180
  const radB = (angleB * Math.PI) / 180

  const dxA = -Math.cos(radA)
  const dyA = -Math.sin(radA)
  const dxB = -Math.cos(radB)
  const dyB = Math.sin(radB)

  const cross = dxA * dyB - dyA * dxB
  const tA = ((bx - ax) * dyB - (by - ay) * dxB) / cross
  const cx = ax + tA * dxA
  const cy = ay + tA * dyA

  /** @type {Point} */
  let A = { x: ax, y: ay }
  /** @type {Point} */
  let B = { x: bx, y: by }
  /** @type {Point} */
  let C = { x: cx, y: cy }

  const pts = [A, B, C]
  const minX = Math.min(...pts.map((p) => p.x))
  const maxX = Math.max(...pts.map((p) => p.x))
  const minY = Math.min(...pts.map((p) => p.y))
  const maxY = Math.max(...pts.map((p) => p.y))
  const spanX = maxX - minX || 1
  const spanY = maxY - minY || 1
  const innerW = W - PAD * 2
  const innerH = H - PAD * 2
  const scale = Math.min(innerW / spanX, innerH / spanY)
  const offsetX = PAD + (innerW - spanX * scale) / 2 - minX * scale
  const offsetY = PAD + (innerH - spanY * scale) / 2 - minY * scale
  const fit = (/** @type {Point} */ p) => ({
    x: p.x * scale + offsetX,
    y: p.y * scale + offsetY,
  })
  A = fit(A)
  B = fit(B)
  C = fit(C)

  const centroid = {
    x: (A.x + B.x + C.x) / 3,
    y: (A.y + B.y + C.y) / 3,
  }

  const arcR = 16
  const hl = (key) => (highlight.includes(key) ? ' figure-highlight' : '')

  const label = (/** @type {Point} */ p, text, anchor = 'middle', cls = '') =>
    text
      ? `<text x="${p.x.toFixed(1)}" y="${p.y.toFixed(1)}" text-anchor="${anchor}" dominant-baseline="middle" class="label${cls}">${escapeXml(text)}</text>`
      : ''

  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img">`,
    '<style>',
    '.tri{fill:none;stroke:#1a1a1a;stroke-width:2;stroke-linejoin:round}',
    '.arc{fill:none;stroke:#666;stroke-width:1.2}',
    '.label{font:13px system-ui,sans-serif;fill:#1a1a1a}',
    '.vertex{font:14px system-ui,sans-serif;font-weight:600;fill:#1a1a1a}',
    '.figure-highlight{font-weight:700;fill:#b45309}',
    '</style>',
    `<polygon class="tri" points="${A.x.toFixed(1)},${A.y.toFixed(1)} ${B.x.toFixed(1)},${B.y.toFixed(1)} ${C.x.toFixed(1)},${C.y.toFixed(1)}"/>`,
  ]

  if (angles.A) {
    parts.push(`<path class="arc" d="${interiorArc(A, B, C, arcR)}"/>`)
    parts.push(label(angleLabelPoint(A, B, C, 30), angles.A, 'middle', hl('A')))
  }
  if (angles.B) {
    parts.push(`<path class="arc" d="${interiorArc(B, C, A, arcR)}"/>`)
    parts.push(label(angleLabelPoint(B, C, A, 30), angles.B, 'middle', hl('B')))
  }
  if (angles.C) {
    parts.push(`<path class="arc" d="${interiorArc(C, A, B, arcR)}"/>`)
    parts.push(label(angleLabelPoint(C, A, B, 30), angles.C, 'middle', hl('C')))
  }

  const vA = vertexLabelPoint(A, B, C, centroid, 18)
  const vB = vertexLabelPoint(B, C, A, centroid, 18)
  const vC = vertexLabelPoint(C, A, B, centroid, 18)
  parts.push(label(vA, 'A', 'middle', ' vertex'))
  parts.push(label(vB, 'B', 'middle', ' vertex'))
  parts.push(label(vC, 'C', 'middle', ' vertex'))

  if (sides.a) {
    parts.push(label(sideLabelPoint(B, C, A, 18), sides.a, 'middle', hl('a')))
  }
  if (sides.b) {
    parts.push(label(sideLabelPoint(A, C, B, 18), sides.b, 'middle', hl('b')))
  }
  if (sides.c) {
    parts.push(label(sideLabelPoint(A, B, C, 18), sides.c, 'middle', hl('c')))
  }

  parts.push('</svg>')
  return parts.join('\n')
}

function escapeXml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** @type {Array<{ file: string, alt: string, spec: Parameters<typeof buildTriangleSvg>[0] }>} */
const figures = [
  {
    file: 'q01.svg',
    alt: '△ABC，已知 A=30°、B=60°、a=6',
    spec: { angleA: 30, angleB: 60, angles: { A: '30°', B: '60°' }, sides: { a: '6' } },
  },
  {
    file: 'q02.svg',
    alt: '△ABC，已知 B=45°、C=60°、b=6√2',
    spec: { angleA: 75, angleB: 45, angles: { B: '45°', C: '60°' }, sides: { b: '6√2' } },
  },
  {
    file: 'q03.svg',
    alt: '△ABC，已知 a=6、A=45°、c=6√2',
    spec: { angleA: 45, angleB: 45, angles: { A: '45°' }, sides: { a: '6', c: '6√2' } },
  },
  {
    file: 'q04.svg',
    alt: '△ABC，已知 a=4、A=30°、b=4√3',
    spec: { angleA: 30, angleB: 60, angles: { A: '30°' }, sides: { a: '4', b: '4√3' } },
  },
  {
    file: 'q05.svg',
    alt: '△ABC，已知 A=30°、C=90°、c=10',
    spec: { angleA: 30, angleB: 60, angles: { A: '30°', C: '90°' }, sides: { c: '10' } },
  },
  {
    file: 'q06.svg',
    alt: '△ABC，已知 a=2、b=2、c=2√3',
    spec: { angleA: 30, angleB: 30, sides: { a: '2', b: '2', c: '2√3' } },
  },
  {
    file: 'q07.svg',
    alt: '△ABC，已知 a=3、b=4、c=5',
    spec: { angleA: 37, angleB: 53, sides: { a: '3', b: '4', c: '5' } },
  },
  {
    file: 'q08.svg',
    alt: '△ABC，已知 a=5、b=5、C=60°',
    spec: { angleA: 60, angleB: 60, angles: { C: '60°' }, sides: { a: '5', b: '5' } },
  },
  {
    file: 'q09.svg',
    alt: '△ABC，已知 a=3、B=120°、c=5',
    spec: { angleA: 25, angleB: 55, angles: { B: '120°' }, sides: { a: '3', c: '5' } },
  },
  {
    file: 'q10.svg',
    alt: '△ABC，已知 a=6√2、b=6、C=45°',
    spec: { angleA: 60, angleB: 75, angles: { C: '45°' }, sides: { a: '6√2', b: '6' } },
  },
  {
    file: 'q11.svg',
    alt: '△ABC，已知 A=30°、b=6、c=6√3',
    spec: { angleA: 30, angleB: 30, angles: { A: '30°' }, sides: { b: '6', c: '6√3' } },
  },
  {
    file: 'q12.svg',
    alt: '△ABC，已知 a=4、A=45°、c=4√2',
    spec: { angleA: 45, angleB: 45, angles: { A: '45°' }, sides: { a: '4', c: '4√2' } },
  },
  {
    file: 'q13.svg',
    alt: '△ABC，已知 a=8、A=60°、b=4√3',
    spec: { angleA: 60, angleB: 60, angles: { A: '60°' }, sides: { a: '8', b: '4√3' } },
  },
]

await mkdir(OUT_DIR, { recursive: true })
for (const { file, spec } of figures) {
  const svg = buildTriangleSvg(spec)
  await writeFile(join(OUT_DIR, file), svg, 'utf8')
  console.log('wrote', file)
}

console.log(`完成：${figures.length} 個 SVG → ${OUT_DIR}`)
