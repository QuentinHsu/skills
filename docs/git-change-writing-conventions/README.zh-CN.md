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

- `source`：`branch` | `mixed`
- `base_branch`：对比基线分支（优先用户指定，否则依次回退 `main`、`master`）
- `range`：实际对比范围，例如 `<base>...HEAD`（可选但建议保留，便于追溯）
- `files`：变更文件列表或模块分组
- `summary`：1-3 行高层摘要
- `intent`：`feat` | `fix` | `refactor` | `docs` | `chore` | `test` | `perf`
- `highlights`：2-6 条事实要点（做了什么 + 为什么）
- `risk`：可选，行为/兼容性风险
- `breaking_change`：可选，是否破坏性变更 + 描述
- `issues`：可选，用户明确提供时才使用
- `terms`：领域关键词，用于跨产物措辞一致

### 分支 diff 基线策略（硬规则）

- 优先使用**分支级 diff**：当前分支对比基线分支。
- 基线分支解析顺序：用户指定 → `main` → `master`。
- 使用 `<base>..HEAD` 分析分支提交意图，使用 `<base>...HEAD` 分析变更范围。
- 若当前分支与解析后的基线分支相同，且本地提交领先上游，则改用上游跟踪点作为基线（如 `@{upstream}..HEAD` / `@{upstream}...HEAD`）。
- 此场景下，本地 ahead 的提交即为有效 diff 内容。
- 若不存在或未配置上游跟踪分支，需让用户明确指定对比参考（如 `origin/main`、tag 或 commit SHA）。
- 仅在用户明确要求时，才并入未提交改动（`--cached` / 工作区改动）；并标记 `source: mixed`。

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
- 优先 `git diff <base>...HEAD --stat` + 关键片段，避免超大原始 diff 倾倒。
- 避免在 branch/commit/PR 之间重复解释同一事实。

## 7）维护检查清单

修改任一 git-writing skill 后，建议检查：

1. 复用策略是否仍一致？
2. 输出 code 块结构是否仍一致？
3. 语言默认/覆盖逻辑是否仍一致？
4. 模板与示例是否仍可一键复制？
