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

## 维护约定

- `README.md` 保留安装、更新与技能文档入口链接。
- 具体说明写在对应技能文档中（`SKILL.md` / `rules/*.md`）。
- 对差异驱动的 git-writing 技能（`branch-name`、`pr-content`、`change-pack`），默认使用**当前分支对比基线分支**的 diff 口径（优先用户指定基线，否则依次回退 `main`、`master`）。
- 仅在用户明确要求时，才并入未提交改动。
- `commit-message` 维持 staged-first 设计（`git diff --cached`）。
- 新增技能时，只需更新本索引并补齐对应技能目录文档。
