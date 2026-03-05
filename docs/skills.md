# Skills Index

This document only maintains skill entry points and rule links. For installation and updates, see root `README.md`.

Shared conventions:

- [`git-change-writing-conventions/README.md`](git-change-writing-conventions/README.md)

中文版本：[`skills.zh-CN.md`](skills.zh-CN.md)

## Skills

- `git-change-writing/change-pack`
  - Overview: [`skills/git-change-writing/change-pack/SKILL.md`](../skills/git-change-writing/change-pack/SKILL.md)
  - Rules:
    - [`skills/git-change-writing/change-pack/rules/change-pack.md`](../skills/git-change-writing/change-pack/rules/change-pack.md)

- `git-change-writing/commit-message`
  - Overview: [`skills/git-change-writing/commit-message/SKILL.md`](../skills/git-change-writing/commit-message/SKILL.md)
  - Rules:
    - [`skills/git-change-writing/commit-message/rules/commit-message.md`](../skills/git-change-writing/commit-message/rules/commit-message.md)

- `git-change-writing/pr-content`
  - Overview: [`skills/git-change-writing/pr-content/SKILL.md`](../skills/git-change-writing/pr-content/SKILL.md)
  - Rules:
    - [`skills/git-change-writing/pr-content/rules/pr-content.md`](../skills/git-change-writing/pr-content/rules/pr-content.md)

- `git-change-writing/branch-name`
  - Overview: [`skills/git-change-writing/branch-name/SKILL.md`](../skills/git-change-writing/branch-name/SKILL.md)
  - Rules:
    - [`skills/git-change-writing/branch-name/rules/branch-name.md`](../skills/git-change-writing/branch-name/rules/branch-name.md)

## Maintenance Conventions

- `README.md` keeps install/update guidance and skill doc entry links.
- Skill details belong to each skill document (`SKILL.md` / `rules/*.md`).
- For diff-driven git-writing skills (`branch-name`, `pr-content`, `change-pack`), default diff scope is **current branch vs base branch** (user-specified base preferred; fallback `main` then `master`).
- Include uncommitted changes only when explicitly requested.
- `commit-message` remains staged-first by design (`git diff --cached`).
- When adding new skills, update this index and the related skill directory docs.
