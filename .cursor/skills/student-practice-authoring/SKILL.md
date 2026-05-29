---
name: student-practice-authoring
description: >-
  Author and edit student practice Markdown for the 學生練習用網頁 project
  (practices/*.md). Covers front matter, :::question blocks, {{blank}} placeholders,
  LaTeX answers, and question grouping rules. Use when creating or editing practice
  files, converting worksheets to MD, filling answers, or when the user mentions
  練習題、practices、題目製作、practice markdown.
---

# 學生練習題目製作規範

本專案從 `practices/*.md` 渲染網頁：假框（不可輸入）、每題題尾「解答」按鈕（KaTeX）、首頁依 `slug` 列表。

## 檔案位置與命名

- 路徑：`practices/<檔名>.md`（可中文檔名）
- URL 由 front matter 的 **`slug`（英文）** 決定：`/practice/{slug}`
- 新增檔案後首頁自動列出，無需改程式

## Front matter（必填）

```yaml
---
title: 顯示標題（繁體中文）
slug: english-slug-only
description: 選填，首頁卡片說明
---
```

| 欄位 | 規則 |
|------|------|
| `title` | 練習頁大標 |
| `slug` | 僅小寫英文、數字、連字號；全專案唯一 |
| `description` | 一句話摘要 |

## 空格：{{blank}}

- **一律使用** `{{blank}}`，一個 token = 網頁上一個假框
- **勿用** `______`、`____`（不會自動轉換）
- 假框不可輸入，僅供學生紙上作答後對照

## 題目區塊：:::question

每個 `:::question` … `:::` = **一題** = **一顆「解答」按鈕**（在題尾）。

```markdown
:::question
題幹 Markdown…

可多行、列表、表格。
空格：{{blank}}

answer:
LaTeX 答案寫在這裡
:::
```

### answer 區塊

- 以單獨一行 `answer:` 開頭，下一行起為 LaTeX 內容，直到 `:::` 前結束
- **只寫最終值**（流程題的中間步驟不寫進 answer）
- 尚未完成：寫 `TODO` → 網頁顯示「（答案待補）」
- 多個最終值（同一題多行 sin/cos/tan）：**一題一顆按鈕**，answer 內用 `\\` 換行

```markdown
answer:
\sin 45° = \frac{\sqrt{2}}{2} \\
\cos 45° = \frac{\sqrt{2}}{2} \\
\tan 45° = 1
```

- 整表答案：整張表包在一個 `:::question` 內，answer 可用 `array`/`aligned` 或多行 `\\`
- 勿在 answer 內包 `$$`；直接寫 LaTeX 片段即可

## 切題規則（必守）

| 情境 | 做法 |
|------|------|
| 表格填空 | **整表一題**、一顆解答 |
| 同一題多個最終值 | **整組一題**、answer 多行 LaTeX |
| 流程分析題（多個中間欄 + 最後數值） | 中間欄用 `{{blank}}`，answer **僅最後數值** |
| 章節說明、口訣、步驟指引 | 一般 Markdown，**不要**包進 `:::question` |
| 小節標題 `##`、`###` | 放在 question **外**，作為閱讀結構 |

## 一般 Markdown

- 支援標題、列表、表格、`---` 分隔線
- 數學符號在題幹可用 Unicode（√3、°）或之後再改 LaTeX
- 題與題之間可用 `---` 分隔，不影響解析

## 禁止與常見錯誤

- 不要在 `:::question` 內再巢狀 `:::question`
- 不要省略 `answer:`（無 answer 區塊會導致解析異常）
- 不要一格一顆解答按鈕（規格為**一題一顆**）
- `slug` 勿用中文或空格

## 新增一份練習的檢查清單

```
- [ ] practices/xxx.md 已建立
- [ ] front matter：title、slug（英文唯一）、description
- [ ] 所有空格已改為 {{blank}}
- [ ] 每道可對答案的題目各有一個 :::question
- [ ] 每題有 answer:（TODO 或 LaTeX）
- [ ] 說明／口訣在 question 外
- [ ] npm run dev 開啟 /practice/{slug} 目視確認
```

## 參考

- 完整範例：`practices/三角函數基本練習.md`（`slug: trig-basic`）
- 更多片段： [examples.md](examples.md)
