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

- `frontend/code-style`
  - Overview: [`skills/frontend/code-style/SKILL.md`](../skills/frontend/code-style/SKILL.md)
  - Rules:
    - [`skills/frontend/code-style/rules/ts-style.md`](../skills/frontend/code-style/rules/ts-style.md)
    - [`skills/frontend/code-style/rules/tsx-style.md`](../skills/frontend/code-style/rules/tsx-style.md)
    - [`skills/frontend/code-style/rules/dom-a11y-style.md`](../skills/frontend/code-style/rules/dom-a11y-style.md)

- `refactor/clean`
  - Overview: [`skills/refactor/clean/SKILL.md`](../skills/refactor/clean/SKILL.md)
  - Rules:
    - [`skills/refactor/clean/rules/dead-code.md`](../skills/refactor/clean/rules/dead-code.md)
    - [`skills/refactor/clean/rules/simplification.md`](../skills/refactor/clean/rules/simplification.md)
    - [`skills/refactor/clean/rules/naming-readability.md`](../skills/refactor/clean/rules/naming-readability.md)
    - [`skills/refactor/clean/rules/data-structures-performance.md`](../skills/refactor/clean/rules/data-structures-performance.md)

- `refactor/migrate`
  - Overview: [`skills/refactor/migrate/SKILL.md`](../skills/refactor/migrate/SKILL.md)
  - Rules:
    - [`skills/refactor/migrate/rules/dependency-upgrade.md`](../skills/refactor/migrate/rules/dependency-upgrade.md)
    - [`skills/refactor/migrate/rules/api-replacement.md`](../skills/refactor/migrate/rules/api-replacement.md)
    - [`skills/refactor/migrate/rules/compatibility.md`](../skills/refactor/migrate/rules/compatibility.md)

- `refactor/modernize`
  - Overview: [`skills/refactor/modernize/SKILL.md`](../skills/refactor/modernize/SKILL.md)
  - Rules:
    - [`skills/refactor/modernize/rules/language-features.md`](../skills/refactor/modernize/rules/language-features.md)
    - [`skills/refactor/modernize/rules/async-concurrency.md`](../skills/refactor/modernize/rules/async-concurrency.md)
    - [`skills/refactor/modernize/rules/idioms.md`](../skills/refactor/modernize/rules/idioms.md)

- `refactor/architecture`
  - Overview: [`skills/refactor/architecture/SKILL.md`](../skills/refactor/architecture/SKILL.md)
  - Rules:
    - [`skills/refactor/architecture/rules/module-boundaries.md`](../skills/refactor/architecture/rules/module-boundaries.md)
    - [`skills/refactor/architecture/rules/dependency-direction.md`](../skills/refactor/architecture/rules/dependency-direction.md)
    - [`skills/refactor/architecture/rules/responsibility-separation.md`](../skills/refactor/architecture/rules/responsibility-separation.md)

## Maintenance Conventions

### General

- `README.md` keeps install/update guidance and skill doc entry links.
- Skill details belong to each skill document (`SKILL.md` / `rules/*.md`).
- When adding new skills, update this index and the related skill directory docs.

### Git Change Writing

- For diff-driven skills (`branch-name`, `pr-content`, `change-pack`), default diff scope is **current branch vs base branch** (user-specified base preferred; fallback `main` then `master`).
- Include uncommitted changes only when explicitly requested.
- `commit-message` remains staged-first by design (`git diff --cached`).

### Frontend

- Frontend skills (`frontend-code-style`) target TypeScript, TSX, and DOM markup. Apply rules in order: TS first, then TSX, then DOM accessibility.
- Style rules focus on readability and correctness, not formatting (whitespace, semicolons, quotes) — that is a formatter’s job.

### Refactor

- Refactor skills (`clean`, `migrate`, `modernize`, `architecture`) are scoped by change type — do not mix concerns across skills in a single pass. Each skill has explicit boundaries defining what it changes and what it must not touch.
- All refactor skills require behavior preservation. If the target code lacks test coverage, warn the user before proceeding.
