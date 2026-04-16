# Git Change Writing 技能集

`skills/git-change-writing/` 技能集的设计理念和共享指南。

English version: [`README.md`](README.md)

## 概述

这个技能集帮助从代码变更生成 Git 相关的文案产物（分支名、commit 信息、PR 内容）。这些技能通过共享上下文和遵循一致的模式来高效协作。

**技能集包含：**
- `branch-name` - 从变更生成分支名
- `commit-message` - 生成符合规范的 commit 信息
- `pr-content` - 生成 PR 标题和描述
- `change-pack` - 从一个共享上下文生成以上全部

## 设计理念

### 1. 读一次，用多次

**为什么：** 读取和分析 diff 很昂贵（token + 时间）。

**怎么做：** 构建一次共享的 `DIFF_CONTEXT`，然后在所有输出中复用。`change-pack` 技能展示了这个模式，从一次 diff 分析生成分支名、commit 信息和 PR 内容。

**共享机制：** `_shared/` 目录包含可复用的参考文件：
- `context-reuse.md` - 上下文复用协议
- `branch-diff-gathering.md` - 如何收集分支级变更
- `bilingual-output.md` - 双语输出格式
- `pr-heading-map.md` - 按类型划分的 PR 章节标题
- `type-classification.md` - 选择 `feat|perf|fix|refactor|...` 的共享判定规则

### 2. 分支级 diff 优先

**为什么：** PR 是关于分支变更的，不只是暂存文件。分支级 diff 给出完整的变更全貌。

**怎么做：** 将当前分支与基线分支对比（用户指定 → `main` → `master`）。

**特殊情况：** 如果当前分支等于基线分支，但本地提交领先于上游，使用上游跟踪点作为基线。这处理了常见的工作流：你在 `main` 分支上，但领先于 `origin/main`。

### 3. 可直接复制的输出

**为什么：** 用户希望直接粘贴到 Git/GitHub，无需重新格式化。

**怎么做：**
- 每个输出都包裹在代码块中
- PR Title 和 PR Description 是独立的块（GitHub 有两个输入框）
- 双语输出为每种语言使用独立的块

### 4. 解释为什么，不只是说什么

**为什么：** 现代 LLM 理解推理比理解刚性规则更好。解释约束存在的原因帮助模型在边缘情况下做出更好的决策。

**怎么做：** 不是"必须用小写" → 而是"用小写（更容易输入，避免大小写敏感问题）"

### 5. 跨输出的语义对齐

**为什么：** 分支名、commit 类型和 PR 类型应该讲述一个连贯的故事。

**怎么做：** 从 diff 中提取领域关键词（`terms`），并在所有三个输出中复用。如果意图是 `fix`，分支前缀应该是 `fix/`，commit 类型应该是 `fix`，PR 类型应该是 `fix`。

### 6. 按用户价值分类，而不是按改动表象分类

**为什么：** 改动文件很多、界面变化很大，并不自动等于 `feat`。类型应该反映用户真正获得的主要价值。

**怎么做：** 使用 `_shared/type-classification.md` 中的共享规则。

实用偏置：
- `feat` = 用户现在能做以前做不到的新事情
- `perf` = 用户做的还是同一件事，但更顺、更快、更清晰、交互更省力
- `fix` = 原本不正确的行为被恢复为预期行为
- `refactor` = 主要是内部整理，产品层面没有明显变化

UI/UX 的关键边界：
- 仅仅优化 UI 或交互、但没有新增实际能力时，通常应归为 `perf`
- UI 改动如果带来了新的工作流、新选项或新用途，应归为 `feat`
- UI 改动如果主要是在修复错误行为，应归为 `fix`

## DIFF_CONTEXT 结构

一个紧凑、结构化的变更摘要，可以在多个输出中复用。

**推荐字段：**
- `source`: `branch` | `staged` | `mixed`
- `base_branch`: 对比基线
- `range`: 有效 diff 范围（如 `main...HEAD`）
- `files`: 变更的文件或模块
- `summary`: 1-3 行高层次说明
- `intent`: `feat|fix|refactor|docs|chore|test|perf`
- `highlights`: 2-6 条事实要点（做了什么 + 为什么）
- `risk`: 可选的兼容性/行为风险
- `breaking_change`: 可选的布尔值 + 描述
- `issues`: 可选的 issue 引用（仅在明确提供时）
- `terms`: 用于命名一致性的领域关键词

**为什么这样设计：** 足够紧凑以适应上下文（推荐 ≤ 220 行），但足够丰富以生成所有三个输出而无需重新读取 diff。

## 改动类型判定

此技能集中的所有技能在推断主要改动意图时，都应使用 `_shared/type-classification.md`。

推荐判定顺序：
1. 主要是在恢复错误/回归行为吗？→ `fix`
2. 是否增加了净新增能力、选项或工作流？→ `feat`
3. 是否保持原有能力不变，但提升了速度、顺滑度、清晰度或交互质量？→ `perf`
4. 是否主要是结构整理，且没有明显用户侧变化？→ `refactor`

示例：
- 新增一种导出格式 → `feat`
- 把已有导出流程从 4 步优化到 2 步 → `perf`
- 修复导出结果错误 → `fix`
- 仅把导出逻辑拆成更小模块且无可见变化 → `refactor`

需要特别记住的反例：
- 给已有动作新增一个更显眼的按钮，通常是 `perf`，不是 `feat`
- 大规模内部重写如果用户明显感受到更快更顺，仍可能是 `perf`，不是 `refactor`
- 一个更顺滑的交互如果本质是在修复错误行为，通常是 `fix`，不是 `perf`

### 快速决策树

当类型拿不准时，优先走这个简化流程：

1. 这次改动之前是否存在错误、异常或回归？→ `fix`
2. 如果没有，是否增加了净新增能力、选项或工作流？→ `feat`
3. 如果没有，是否让同一件事变得更快、更顺、更清晰、更省力？→ `perf`
4. 如果没有，主要价值是否只是内部整理或重构？→ `refactor`

这个决策树故意保持简洁，目的是在边界场景里提供稳定偏置，尤其是避免把 UI/UX 优化过度标成 `feat`。

### 输出对照示例

这些示例用于把“判对类型”进一步落实为“写对 commit/PR 文案”。

**示例：同样能力，但体验更好**

错误：

```text
feat(checkout): redesign checkout flow
```

更好：

```text
perf(checkout): streamline checkout flow feedback
```

原因：checkout 能力原本就存在，主要价值是降低操作摩擦。

**示例：新增可复用工作流**

错误：

```text
perf(search): improve preset workflow
```

更好：

```text
feat(search): support reusable saved presets
```

原因：可复用的 saved preset 是新增能力，不只是优化。

**示例：恢复错误行为**

错误：

```text
perf(filters): improve filter persistence
```

更好：

```text
fix(filters): preserve state after navigation
```

原因：主要价值是恢复正确性，而不是体验润色。

**示例：深层重写但用户明显感知更快**

错误：

```text
refactor(table): rewrite render pipeline
```

更好：

```text
perf(table): reduce scroll jank in large datasets
```

原因：用户真正感知到的是性能改善，而不是内部结构更整洁。

### 容易误导的措辞提示

要小心那些“听起来像某种类型”，但实际上不足以直接决定类型的词。

- `redesign`、`revamp`、`add button`、`enhance UI` **不**自动等于 `feat`
- `improve`、`optimize`、`streamline` **不**自动等于 `perf`
- `rewrite`、`rework`、`replace architecture` **不**自动等于 `refactor`
- `fix UX`、`correct flow`、`improve validation` **不**自动等于 `fix`

推荐纠偏方式：
- 先忽略这些带强烈倾向的动词
- 用更中性的句子重述改动
- 再按用户结果分类：是新增能力、体验变好、恢复正确性，还是仅仅内部整理

例如：
- `redesign checkout` → 先问 checkout 是新增能力，还是只是更好用了
- `rewrite rendering pipeline` → 先问用户主要得到的是更快、更正确，还是其实没什么可见变化

## 语言行为

**默认：** 输出简体中文和 English 两个版本（语义对齐，不是逐字翻译）。

**覆盖：** 如果用户明确要求单一语言，仅输出该语言。

**为什么默认双语：** 许多团队在混合语言环境中工作。提供两个版本省去了用户再次询问的麻烦。

**格式：** 每种语言都有自己的代码块，语言标签（`中文` 或 `English`）紧接在上方。

## Token 效率指南

- 优先使用 `git diff --stat` + 目标摘录，而不是完整文件转储
- 将原始 diff 摘要一次到 `DIFF_CONTEXT`，然后复用
- 保持 `DIFF_CONTEXT` 简洁（推荐 ≤ 220 行）
- 避免在 branch/commit/PR 输出之间重复解释

**为什么：** 这些技能可能每天被使用数百次。Token 效率直接影响成本和速度。

## 维护指南

修改此技能集中的任何技能时，请验证：

1. **上下文复用一致性** - Step 0 是否仍遵循相同模式？
2. **输出结构一致性** - 代码块是否仍可直接复制？
3. **语言行为一致性** - 双语输出是否仍以相同方式工作？
4. **类型判定一致性** - `branch-name`、`commit-message`、`pr-content`、`change-pack` 是否仍使用一致的意图判定逻辑？
5. **共享引用** - 变更是否需要传播到 `_shared/` 文件？

**为什么要做这些检查：** 这些技能被设计为协同工作。不一致会造成混乱并降低技能集的价值。

## 示例

### 单独使用技能

```bash
# 仅生成分支名
用户："给这个分支起个名字"
→ 使用 branch-name 技能

# 仅生成 commit 信息
用户："生成 commit message"
→ 使用 commit-message 技能

# 仅生成 PR 内容
用户："写个 PR 描述"
→ 使用 pr-content 技能
```

### 链式生成（最高效）

```bash
# 从一次 diff 分析生成全部三个
用户："一口气生成分支名、commit、PR"
→ 使用 change-pack 技能
→ 读取 diff 一次，生成所有三个输出
→ 相比分别调用三个技能节省约 60% token
```

## 相关文档

- [技能索引](../skills.md) - 所有可用技能概览
- [技能索引（中文）](../skills.zh-CN.md) - 所有技能概览
