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

## 部署到 GitHub Pages

本專案已含 GitHub Actions（`.github/workflows/deploy-pages.yml`），推送後會自動建置並發布。

### 第一次設定

1. 在 GitHub 建立儲存庫，將本專案 push 上去（分支 `main` 或 `master` 皆可）。
2. 儲存庫 **Settings → Pages**：
   - **Build and deployment** → Source 選 **GitHub Actions**（不要選 Deploy from a branch）。
3. 等 Actions 跑完（約 1～2 分鐘），Pages 會顯示網址。

### 網址格式

| 儲存庫類型 | 網址範例 |
|------------|----------|
| 一般專案站 | `https://<使用者>.github.io/<儲存庫名稱>/` |
| 使用者首頁站（repo 名須為 `<使用者>.github.io`） | `https://<使用者>.github.io/` |

練習直連範例（假設 repo 名為 `math-practice`）：

`https://<使用者>.github.io/math-practice/practice/trig-basic`

### 本機模擬 GitHub Pages 建置

將 `你的-repo名` 換成 GitHub 上的儲存庫名稱：

```bash
VITE_BASE_PATH=/你的-repo名/ npm run build
npm run preview
```

預覽時請開 `http://localhost:4173/你的-repo名/`（路徑需含 base）。

### 若使用 `<使用者>.github.io` 根網域站

該儲存庫的 Pages 在網域根目錄，請改 workflow 的建置環境變數為：

```yaml
VITE_BASE_PATH: /
```

並將 `vite.config.ts` 預設 base 維持 `/` 即可。
