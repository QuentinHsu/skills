# 技能文档索引

本仓库所有技能的入口。安装与更新方式见仓库根目录的 [`README.zh-CN.md`](../README.zh-CN.md)。

English version: [`skills.md`](skills.md)

Git 文案类技能的统一规范：[`git-change-writing/README.zh-CN.md`](git-change-writing/README.zh-CN.md)

## 技能列表

下方列表由 `node scripts/lint-skills.mjs --write` 自动生成，请勿手动修改。每个技能的用途说明见对应 `SKILL.md` 的 `description`。

<!-- skills:start -->

### docs

- **`readme-public-app`** — [`skills/docs/readme-public-app`](../skills/docs/readme-public-app/SKILL.md)

### frontend

- **`frontend-code-style`** — [`skills/frontend/code-style`](../skills/frontend/code-style/SKILL.md)
  - 文件: [`rules/dom-a11y-style.md`](../skills/frontend/code-style/rules/dom-a11y-style.md)
  - 文件: [`rules/ts-style.md`](../skills/frontend/code-style/rules/ts-style.md)
  - 文件: [`rules/tsx-style.md`](../skills/frontend/code-style/rules/tsx-style.md)

### git-change-writing

- **`branch-name`** — [`skills/git-change-writing/branch-name`](../skills/git-change-writing/branch-name/SKILL.md)
- **`change-pack`** — [`skills/git-change-writing/change-pack`](../skills/git-change-writing/change-pack/SKILL.md)
- **`commit-message`** — [`skills/git-change-writing/commit-message`](../skills/git-change-writing/commit-message/SKILL.md)
  - 文件: [`scripts/format_commit_message.py`](../skills/git-change-writing/commit-message/scripts/format_commit_message.py)
- **`pr-content`** — [`skills/git-change-writing/pr-content`](../skills/git-change-writing/pr-content/SKILL.md)

### privacy

- **`data-sanitization`** — [`skills/privacy/data-sanitization`](../skills/privacy/data-sanitization/SKILL.md)

### refactor

- **`refactor-architecture`** — [`skills/refactor/architecture`](../skills/refactor/architecture/SKILL.md)
  - 文件: [`rules/dependency-direction.md`](../skills/refactor/architecture/rules/dependency-direction.md)
  - 文件: [`rules/module-boundaries.md`](../skills/refactor/architecture/rules/module-boundaries.md)
  - 文件: [`rules/responsibility-separation.md`](../skills/refactor/architecture/rules/responsibility-separation.md)
- **`refactor-clean`** — [`skills/refactor/clean`](../skills/refactor/clean/SKILL.md)
  - 文件: [`rules/data-structures-performance.md`](../skills/refactor/clean/rules/data-structures-performance.md)
  - 文件: [`rules/dead-code.md`](../skills/refactor/clean/rules/dead-code.md)
  - 文件: [`rules/naming-readability.md`](../skills/refactor/clean/rules/naming-readability.md)
  - 文件: [`rules/simplification.md`](../skills/refactor/clean/rules/simplification.md)
- **`refactor-migrate`** — [`skills/refactor/migrate`](../skills/refactor/migrate/SKILL.md)
  - 文件: [`rules/api-replacement.md`](../skills/refactor/migrate/rules/api-replacement.md)
  - 文件: [`rules/compatibility.md`](../skills/refactor/migrate/rules/compatibility.md)
  - 文件: [`rules/dependency-upgrade.md`](../skills/refactor/migrate/rules/dependency-upgrade.md)
- **`refactor-modernize`** — [`skills/refactor/modernize`](../skills/refactor/modernize/SKILL.md)
  - 文件: [`rules/async-concurrency.md`](../skills/refactor/modernize/rules/async-concurrency.md)
  - 文件: [`rules/idioms.md`](../skills/refactor/modernize/rules/idioms.md)
  - 文件: [`rules/language-features.md`](../skills/refactor/modernize/rules/language-features.md)

<!-- skills:end -->

## 设计类技能

本仓库不再维护设计类技能，请直接安装上游的 [Impeccable](https://github.com/pbakaus/impeccable)。

## 维护约定

### 通用

- 根目录 `README` 只放安装、更新说明和本索引的链接。
- 技能的具体内容写在各自目录里（`SKILL.md`、`rules/*.md`、`_shared/*.md`）。
- frontmatter 只保留 `name`、`description` 和 `metadata.{author, version}`，版本号格式为 `YYYY.MM.DD`。
- `description` 要写清楚技能做什么、什么时候用，并附几个有代表性的中英文触发语。
- 新增、重命名或修改技能后，执行 `node scripts/lint-skills.mjs --write` 和 `node scripts/sync-shared.mjs`。CI 会以检查模式跑这两个脚本。

### 共享文件

- `skills/<分组>/_shared/` 是唯一的源文件。
- `scripts/sync-shared.mjs` 只把每个 `SKILL.md` 实际引用到的文件复制进该技能的 `_shared/`，这样单独安装某个技能时链接也不会失效。不要直接修改这些副本。

### Git 文案

- 基于 diff 的技能（`branch-name`、`pr-content`、`change-pack`）默认用**当前分支对比基线分支**：优先用用户指定的基线，其次 `main`，再次 `master`。
- 只有用户明确要求时，才把未提交的改动算进来。
- `commit-message` 有意只读暂存区（`git diff --cached`）。

### 前端

- `frontend-code-style` 面向 TypeScript、TSX 和 DOM 结构，按 TS → TSX → DOM 无障碍的顺序套用规则。
- 规则关注可读性和正确性，不管空格、分号、引号这类格式问题，那些交给格式化工具。

### 隐私

- `data-sanitization` 默认把本地真实数据都当作敏感数据。凡是可能上传、分享、粘贴到外部服务或写进远程提示词的内容，都要先脱敏。

### 重构

- 重构类技能（`clean`、`migrate`、`modernize`、`architecture`）按改动类型划分，一次处理只用一个，不要混在一起。
- 所有重构都必须保持行为不变。目标代码没有测试覆盖时，先提醒用户再动手。

### 文档

- `readme-public-app` 用来生成排版精致的 README：居中标题、徽章、功能展示等。
- 默认输出中英双语；只有用户明确要求时才输出单一语言。
- 更新已有 README 时，保留其中准确的内容和用户自定义的章节。
