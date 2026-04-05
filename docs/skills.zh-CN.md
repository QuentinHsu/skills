# 技能文档索引

本文件仅维护技能说明与规则入口，安装与更新请查看仓库根目录 `README.md`。

统一规范：

- [`git-change-writing-conventions/README.zh-CN.md`](git-change-writing-conventions/README.zh-CN.md)

English version: [`skills.md`](skills.md)

## 技能入口

- `git-change-writing/change-pack`
  - 总览：[`skills/git-change-writing/change-pack/SKILL.md`](../skills/git-change-writing/change-pack/SKILL.md)
  - 规则：
    - [`skills/git-change-writing/change-pack/rules/change-pack.md`](../skills/git-change-writing/change-pack/rules/change-pack.md)

- `git-change-writing/commit-message`
  - 总览：[`skills/git-change-writing/commit-message/SKILL.md`](../skills/git-change-writing/commit-message/SKILL.md)
  - 规则：
    - [`skills/git-change-writing/commit-message/rules/commit-message.md`](../skills/git-change-writing/commit-message/rules/commit-message.md)

- `git-change-writing/pr-content`
  - 总览：[`skills/git-change-writing/pr-content/SKILL.md`](../skills/git-change-writing/pr-content/SKILL.md)
  - 规则：
    - [`skills/git-change-writing/pr-content/rules/pr-content.md`](../skills/git-change-writing/pr-content/rules/pr-content.md)

- `git-change-writing/branch-name`
  - 总览：[`skills/git-change-writing/branch-name/SKILL.md`](../skills/git-change-writing/branch-name/SKILL.md)
  - 规则：
    - [`skills/git-change-writing/branch-name/rules/branch-name.md`](../skills/git-change-writing/branch-name/rules/branch-name.md)

- `frontend/code-style`
  - 总览：[`skills/frontend/code-style/SKILL.md`](../skills/frontend/code-style/SKILL.md)
  - 规则：
    - [`skills/frontend/code-style/rules/ts-style.md`](../skills/frontend/code-style/rules/ts-style.md)
    - [`skills/frontend/code-style/rules/tsx-style.md`](../skills/frontend/code-style/rules/tsx-style.md)
    - [`skills/frontend/code-style/rules/dom-a11y-style.md`](../skills/frontend/code-style/rules/dom-a11y-style.md)

- `refactor/clean`
  - 总览：[`skills/refactor/clean/SKILL.md`](../skills/refactor/clean/SKILL.md)
  - 规则：
    - [`skills/refactor/clean/rules/dead-code.md`](../skills/refactor/clean/rules/dead-code.md)
    - [`skills/refactor/clean/rules/simplification.md`](../skills/refactor/clean/rules/simplification.md)
    - [`skills/refactor/clean/rules/naming-readability.md`](../skills/refactor/clean/rules/naming-readability.md)
    - [`skills/refactor/clean/rules/data-structures-performance.md`](../skills/refactor/clean/rules/data-structures-performance.md)

- `refactor/migrate`
  - 总览：[`skills/refactor/migrate/SKILL.md`](../skills/refactor/migrate/SKILL.md)
  - 规则：
    - [`skills/refactor/migrate/rules/dependency-upgrade.md`](../skills/refactor/migrate/rules/dependency-upgrade.md)
    - [`skills/refactor/migrate/rules/api-replacement.md`](../skills/refactor/migrate/rules/api-replacement.md)
    - [`skills/refactor/migrate/rules/compatibility.md`](../skills/refactor/migrate/rules/compatibility.md)

- `refactor/modernize`
  - 总览：[`skills/refactor/modernize/SKILL.md`](../skills/refactor/modernize/SKILL.md)
  - 规则：
    - [`skills/refactor/modernize/rules/language-features.md`](../skills/refactor/modernize/rules/language-features.md)
    - [`skills/refactor/modernize/rules/async-concurrency.md`](../skills/refactor/modernize/rules/async-concurrency.md)
    - [`skills/refactor/modernize/rules/idioms.md`](../skills/refactor/modernize/rules/idioms.md)

- `refactor/architecture`
  - 总览：[`skills/refactor/architecture/SKILL.md`](../skills/refactor/architecture/SKILL.md)
  - 规则：
    - [`skills/refactor/architecture/rules/module-boundaries.md`](../skills/refactor/architecture/rules/module-boundaries.md)
    - [`skills/refactor/architecture/rules/dependency-direction.md`](../skills/refactor/architecture/rules/dependency-direction.md)
    - [`skills/refactor/architecture/rules/responsibility-separation.md`](../skills/refactor/architecture/rules/responsibility-separation.md)

## 维护约定

### 通用

- `README.md` 保留安装、更新与技能文档入口链接。
- 具体说明写在对应技能文档中（`SKILL.md` / `rules/*.md`）。
- 新增技能时，只需更新本索引并补齐对应技能目录文档。

### Git Change Writing

- 对差异驱动的技能（`branch-name`、`pr-content`、`change-pack`），默认使用**当前分支对比基线分支**的 diff 口径（优先用户指定基线，否则依次回退 `main`、`master`）。
- 仅在用户明确要求时，才并入未提交改动。
- `commit-message` 维持 staged-first 设计（`git diff --cached`）。

### Frontend

- 前端技能（`code-style`）针对 TypeScript、TSX 和 DOM 标记。规则按顺序应用：先 TS，再 TSX，最后 DOM 无障碍。
- 样式规则关注可读性和正确性，不做纯格式化（空格、分号、引号）——那是 formatter 的职责。

### Refactor

- 重构技能（`clean`、`migrate`、`modernize`、`architecture`）按变更类型划分职责——单次操作不混用不同技能的关注点。每个技能都有明确的边界，定义了它改什么、不改什么。
- 所有重构技能均要求行为保持。若目标代码缺少测试覆盖，需先提醒用户风险再继续。
