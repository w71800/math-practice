# 練習 Markdown 範例

## 最小可運作檔案

```markdown
---
title: 範例練習
slug: sample-quiz
description: 示範格式
---

# 單元一

:::question
(1) $2 + 3 =$ {{blank}}

answer:
5
:::

---

# 提示（無解答按鈕）

記得驗算。
```

## 分數式多假框、單一最終 answer

```markdown
:::question
sin30° = {{blank}} / {{blank}} = {{blank}}

answer:
\sin 30° = \frac{1}{2}
:::
```

中間假框供學生寫分子分母過程；網頁只揭最終式。

## 一題三函數

```markdown
:::question
sin60° = {{blank}}

cos60° = {{blank}}

tan60° = {{blank}}

answer:
\sin 60° = \frac{\sqrt{3}}{2} \\
\cos 60° = \frac{1}{2} \\
\tan 60° = \sqrt{3}
:::
```

## 整表一題

```markdown
:::question
| θ   | sinθ | cosθ |
|-----|------|------|
| 30° | {{blank}} | {{blank}} |
| 45° | {{blank}} | {{blank}} |

answer:
\begin{array}{c|cc}
\theta & \sin\theta & \cos\theta \\
\hline
30° & \frac{1}{2} & \frac{\sqrt{3}}{2} \\
45° & \frac{\sqrt{2}}{2} & \frac{\sqrt{2}}{2}
\end{array}
:::
```

## 流程題（只揭最終數值）

```markdown
## (1) cos150°

:::question
相關銳角：{{blank}}

象限：{{blank}}

定義：{{blank}}

正負：{{blank}}

cos150° = {{blank}}

answer:
-\frac{\sqrt{3}}{2}
:::
```

## 挑戰題多小題合併

```markdown
:::question
(1) sin(-210°) = {{blank}}
(2) cos510° = {{blank}}
(3) tan(-225°) = {{blank}}

answer:
TODO
:::
```

## 待補答案

```markdown
answer:
TODO
```

顯示「（答案待補）」；補齊時刪除 `TODO` 改為 LaTeX。
