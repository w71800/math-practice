---
name: student-practice-figures
description: >-
  Create and embed practice figures for the 學生練習用網頁 project via :::figure
  blocks, SVG files in public/figures/, and scripts/generate-triangle-figures.mjs.
  Use when adding diagrams to practices/*.md, generating triangle SVGs, or when
  the user mentions 圖形、figure、SVG、三角形圖、幾何圖.
---

# 學生練習圖形製作規範

練習 Markdown 以 `:::figure` 嵌入圖形；渲染由 `FigureBlock` 統一處理。  
題目文字規範見 [student-practice-authoring](../student-practice-authoring/SKILL.md)。

## 架構（雙軌制）

| 來源 | 適用 | 撰題方式 |
|------|------|----------|
| `source=file` | 參數化產圖、GeoGebra/Inkscape 匯出 | `path:` 指向 `public/figures/` |
| `source=svg` | 一次性複雜圖、需微調 | 區塊內直接寫 `<svg>…</svg>` |
| `source=geometry`（未實作） | 未來 DSL 自動排版 | 預留擴充 |

簡單三角形 → 跑產圖腳本；複雜多邊形／組合圖 → 外部工具匯出 SVG。

## Markdown：`:::figure`

放在題幹文字之前（`## 練習 N` 之後、`:::question` 之前）。  
可與一般 Markdown、`:::question` 交錯出現。

### 外部 SVG 檔（常用）

```markdown
:::figure source=file
path: figures/sine-cosine-law/q01.svg
alt: △ABC，已知 A=30°、B=60°、a=6
:::
```

- `path`：相對 **`public/`** 根目錄，**勿** 加前導 `/`
- `alt`：無障礙說明；建議保留完整題意（含變數名），圖上可只標數值

### 內嵌 SVG（複雜圖）

```markdown
:::figure source=svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 220" role="img">
  …
</svg>
:::
```

## 圖上標註規則（必守）

| 元素 | 圖上顯示 | 題幹負責 |
|------|----------|----------|
| 頂點 | `A`、`B`、`C` | 說明哪個角／邊對應哪個量 |
| 角度 | 僅數值，如 `30°`、`120°` | `∠A`、`角 B` 等語意 |
| 邊長 | 僅數值，如 `6`、`6√2` | `a`、`b`、`c` 對應關係 |

**禁止**在圖上寫 `a = 6`、`B = 45°`；`alt` 文字可保留變數以利閱讀。

### 三角形約定

- 頂點 **A** 在左下、**B** 在右下、**C** 在上方（腳本固定）
- 邊 **a** = BC（對角 A）、**b** = AC、**c** = AB

## 參數化三角形：產圖腳本

腳本：`scripts/generate-triangle-figures.mjs`  
輸出：`public/figures/<練習-slug>/qNN.svg`

```bash
node scripts/generate-triangle-figures.mjs
```

修改腳本底部 `figures` 陣列後執行，會覆寫對應 SVG。

### 每筆設定格式

```javascript
{
  file: 'q01.svg',
  alt: '△ABC，已知 A=30°、B=60°、a=6',  // 僅供 alt，不畫進圖
  spec: {
    angleA: 30,   // 控制三角形形狀（∠A 視覺大小，非必須等於標註值）
    angleB: 60,
    angles: { A: '30°', B: '60°' },  // 有鍵才畫弧線＋角度數值
    sides: { a: '6' },               // 有鍵才標邊長數值
    highlight: [],                   // 可選：'A'|'B'|'C'|'a'|'b'|'c' 橘色強調
  },
}
```

### `angleA` / `angleB` 選值提示

- 控制**外觀比例**，只需讓三角形看起來合理；不必與題目數值完全一致
- 鈍角題（如 B=120°）：取 `angleB` 偏大（例 55–70）讓圖形較扁
- 直角題：常用 `angleA: 30, angleB: 60` 或 `angleA: 45, angleB: 45`
- 標註與形狀不符時，優先保證**標註正確**、形狀「像三角形」即可

## 新增一份練習的圖形流程

1. 建立目錄 `public/figures/<slug>/`
2. 在腳本新增 `figures` 條目（或複製腳本為 `generate-<slug>-figures.mjs` 並改 `OUT_DIR`）
3. 執行 `node scripts/…` 產生 SVG
4. 在 `practices/*.md` 各題加入 `:::figure source=file`
5. `npm run dev` → `/practice/<slug>` 目視確認標籤不重疊

## 複雜圖形（非三角形）

1. GeoGebra / Inkscape 等匯出 SVG → 存入 `public/figures/<slug>/`
2. Markdown 用 `source=file` 引用
3. 圖上同樣**只標數值**；變數對應寫在題幹
4. 若 SVG 過大，可精簡路徑或改 `viewBox` 配合 `.practice-figure` 自適應寬度

## 程式位置（修改渲染時）

| 檔案 | 職責 |
|------|------|
| `src/lib/parseFigure.ts` | 解析 `:::figure` |
| `src/lib/parsePractice.ts` | 與 `:::question` 交錯解析 |
| `src/components/FigureBlock.tsx` | 渲染 file / svg |
| `src/styles/index.css` | `.practice-figure` 版面 |

## 檢查清單

```
- [ ] SVG 在 public/figures/<slug>/，path 不含前導 /
- [ ] 每題 :::figure 在題幹前，含 alt
- [ ] 圖上角度／邊長僅數值；頂點為 A/B/C
- [ ] 改腳本後已重新 node scripts/… 產圖
- [ ] 瀏覽器確認標籤不壓線、不跑出 viewBox
```

## 參考

- 完整範例：`practices/正弦餘弦定理基本練習.md` + `public/figures/sine-cosine-law/`
- 更多片段：[examples.md](examples.md)
