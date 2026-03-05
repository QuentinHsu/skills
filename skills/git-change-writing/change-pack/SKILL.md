---
name: change-pack
description: Generate branch name, commit message, and PR content from one shared diff context
metadata:
  author: QuentinHsu
  version: "2026.03.02"
---

# Change Pack

Generate a complete Git writing pack (Branch Name + Commit Message + PR Content) from one shared diff context.

PR Title and PR Description should be output as separate copy-ready blocks for two different input fields.

## When to apply

- User asks: "一口气生成分支名、commit、PR 内容"
- User asks: "链式生成 git 文案", "一次分析改动生成全部"
- User asks: "generate branch + commit + PR from same diff"

## Rule categories

| Rule | Trigger | Description |
|------|---------|-------------|
| `change-pack` | chain / pack / one-shot git writing | Build one `DIFF_CONTEXT` and generate all three outputs without repeated full-diff reads |

## Quick reference

- **Rule file:** [rules/change-pack.md](rules/change-pack.md)
- **Input sources:** branch diff first (`git diff <base>...HEAD --stat`, `git log --oneline <base>..HEAD`), where `<base>` is user-specified or fallback `main`/`master`; optionally include `git diff --cached` / `git diff` when user explicitly asks to include uncommitted changes
- **Shared context:** `DIFF_CONTEXT` (single source of truth)
- **Reusable input:** normalize `RAW_DIFF` to `DIFF_CONTEXT` once, then reuse
- **Default output language:** Chinese + English
- **Language override:** if user explicitly asks for single language, output only that language
- **Bilingual formatting rule:** in bilingual mode, each section must use two independent copy-ready code blocks (`中文` and `English`)
- **PR heading rule:** PR Description headings are fixed by PR type; do not use dynamic or synonym headings
- **Output checklist rule:** must run compliance checklist before final output and regenerate failing sections

## How to use

- Match request to this skill's trigger.
- Follow [rules/change-pack.md](rules/change-pack.md) for chain workflow and output constraints.

```