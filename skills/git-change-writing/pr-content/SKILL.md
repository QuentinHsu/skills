---
name: pr-content
description: Generate GitHub Pull Request title and description from branch changes
metadata:
  author: QuentinHsu
  version: "2026.03.02"
---

# PR Content

Generate ready-to-paste Pull Request content (Title + Description) based on branch changes.

Title and Description should be output as separate copy-ready blocks for two different input fields.

## When to apply

- User asks: "生成 PR 内容", "写 PR 描述", "帮我整理 PR 标题和正文"
- User asks: "generate PR content", "write PR title and description", "draft pull request description"

## Rule categories

| Rule | Trigger | Description |
|------|---------|-------------|
| `pr-content` | PR 内容 / PR description / pull request draft | Summarize branch changes and produce structured Title + Description |

## Quick reference

- **Rule file:** [rules/pr-content.md](rules/pr-content.md)
- **Input sources:** branch diff first (`git diff <base>...HEAD --stat`, `git log --oneline <base>..HEAD`, plus relevant diff details), where `<base>` is user-specified or fallback `main`/`master`; optionally include `git diff --cached` / `git diff` only when user explicitly asks to include uncommitted changes
- **Reusable context:** prefer upstream `DIFF_CONTEXT` / `RAW_DIFF` when provided
- **Default output language:** Chinese + English
- **Language override:** if user explicitly asks for single language, output only that language
- **Bilingual formatting rule:** in bilingual mode, each language (`中文` / `English`) must use independent copy-ready code blocks for `PR Title` and `PR Description`
- **Section heading rule:** PR Description section headings are fixed by PR type; do not use dynamic or synonym headings
- **Output checklist rule:** must run compliance checklist before final output and regenerate failing sections

## How to use

- Match request to this skill's trigger.
- Follow [rules/pr-content.md](rules/pr-content.md) for type-specific structure and output format.
