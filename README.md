# 學生練習用網頁

從 `practices/*.md` 渲染練習題：假框填空、每題「解答」按鈕（LaTeX）、首頁列表。

## 開發

```bash
npm install
npm run dev
```

## 建置

```bash
npm run build
npm run preview
```

## 題目製作規範

Cursor Agent 技能：`.cursor/skills/student-practice-authoring/`（撰寫或修改 `practices/*.md` 時可 @ 此 skill）。

## 練習 Markdown 格式

見 `practices/` 內範例。每份檔案需有 front matter：

```yaml
---
title: 標題
slug: english-slug
description: 選填說明
---
```

題目區塊：

```markdown
:::question
題幹，空格用 {{blank}}

answer:
\frac{1}{2}
:::
```

答案填 `TODO` 時，畫面顯示「（答案待補）」。

## 連結

- 首頁：`/`
- 練習：`/practice/trig-basic`
