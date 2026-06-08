# 圖形 Markdown 範例

## 三角形（外部檔，最常見）

```markdown
## 練習 1

:::figure source=file
path: figures/sine-cosine-law/q01.svg
alt: △ABC，已知 A=30°、B=60°、a=6
:::

在 △ABC 中，已知 $A = 30°$，$B = 60°$，$a = 6$。求 $b$。

:::question
$b =$ {{blank}}

answer:
b = 6\sqrt{3}
:::
```

## 僅標部分已知量

題幹寫「已知 a=4、A=30°、b=4√3」，圖上只標出這三個數值：

```javascript
spec: {
  angleA: 30,
  angleB: 60,
  angles: { A: '30°' },
  sides: { a: '4', b: '4√3' },
}
```

## 僅邊長、不標角（SSS）

```javascript
spec: {
  angleA: 37,
  angleB: 53,
  sides: { a: '3', b: '4', c: '5' },
}
```

## 強調待求量（可選）

```javascript
spec: {
  angleA: 30,
  angleB: 60,
  angles: { A: '30°', B: '60°' },
  sides: { a: '6' },
  highlight: ['b'],  // 橘色（若題幹標「求 b」）
}
```

## 內嵌 SVG（不規則圖）

```markdown
:::figure source=svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 220" role="img">
  <polygon fill="none" stroke="#1a1a1a" stroke-width="2"
    points="40,180 120,40 240,180 200,180"/>
  <text x="35" y="195" font-size="14">A</text>
  <text x="115" y="32" font-size="14">B</text>
  <text x="245" y="195" font-size="14">C</text>
  <text x="248" y="195" font-size="14">D</text>
</svg>
:::
```

## 新練習專用產圖腳本

複製 `scripts/generate-triangle-figures.mjs` 為 `scripts/generate-my-slug-figures.mjs`：

```javascript
const OUT_DIR = join(__dirname, '../public/figures/my-slug')

const figures = [
  { file: 'q01.svg', alt: '…', spec: { … } },
]
```

```bash
node scripts/generate-my-slug-figures.mjs
```

## 產圖腳本 spec 對照（正餘弦練習）

| 檔案 | angles | sides |
|------|--------|-------|
| q01.svg | A=30°, B=60° | a=6 |
| q02.svg | B=45°, C=60° | b=6√2 |
| q05.svg | A=30°, C=90° | c=10 |
| q07.svg | — | a=3, b=4, c=5 |
| q09.svg | B=120° | a=3, c=5 |

完整列表見 `scripts/generate-triangle-figures.mjs` 底部 `figures` 陣列。
