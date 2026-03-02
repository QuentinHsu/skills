# git-change-writing 统一规范

本文件定义 `skills/git-change-writing/` 下各技能共享的复用约定。

English version: [`README.md`](README.md)

## 适用范围

适用于：

- `branch-name`
- `commit-message`
- `pr-content`
- `change-pack`

新增或修改相关 skill/rule 时，建议按本清单逐项自检。

## 1）上下文复用（硬规则）

- 若用户或上游步骤已提供 `DIFF_CONTEXT`，优先直接复用。
- 若仅有 `RAW_DIFF`，先归一摘要一次生成 `DIFF_CONTEXT`。
- 一旦 `DIFF_CONTEXT` 足够，禁止重复读取全量 diff。
- 仅在上下文缺失、过期或明显不完整时，才回退到 Git 读取。

## 2）DIFF_CONTEXT 建议字段

- `source`：`staged` | `unstaged` | `mixed`
- `files`：变更文件列表或模块分组
- `summary`：1-3 行高层摘要
- `intent`：`feat` | `fix` | `refactor` | `docs` | `chore` | `test` | `perf`
- `highlights`：2-6 条事实要点（做了什么 + 为什么）
- `risk`：可选，行为/兼容性风险
- `breaking_change`：可选，是否破坏性变更 + 描述
- `issues`：可选，用户明确提供时才使用
- `terms`：领域关键词，用于跨产物措辞一致

## 3）可复制输出规范

- 最终产物都应是可直接复制粘贴的格式。
- 若目标平台是多个输入框，必须拆为多个独立 code 块。

### PR 专项要求

- `PR Title` 与 `PR Description` 必须是两个独立 code 块。
- 原因：最终分别粘贴到两个不同输入框。

## 4）语言行为

- 默认：简体中文 + English。
- 用户指定单语时，仅输出指定语言。
- 双语内容需语义对齐，不得相互冲突。

## 5）跨技能一致性

- `SKILL.md` 的 Quick reference 应注明可复用上下文行为。
- 规则文件的 `Step 0` 应使用一致口径描述上下文复用。
- 模板与示例要贴合真实粘贴流程。

## 6）Token 优化清单

- 一次摘要，多处复用。
- 优先 `diff --stat` + 关键片段，避免超大原始 diff 倾倒。
- 避免在 branch/commit/PR 之间重复解释同一事实。

## 7）维护检查清单

修改任一 git-writing skill 后，建议检查：

1. 复用策略是否仍一致？
2. 输出 code 块结构是否仍一致？
3. 语言默认/覆盖逻辑是否仍一致？
4. 模板与示例是否仍可一键复制？
