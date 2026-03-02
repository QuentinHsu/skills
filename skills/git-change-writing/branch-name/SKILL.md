---
name: branch-name
description: Generate Git branch names from staged or branch changes
metadata:
  author: QuentinHsu
  version: "2026.03.02"
---

# Branch Name

Generate clean, team-friendly Git branch names based on current code changes.

## When to apply

- User asks: "生成分支名", "根据改动起一个 branch 名"
- User asks: "suggest branch name from diff", "name this branch based on changes"

## Rule categories

| Rule | Trigger | Description |
|------|---------|-------------|
| `branch-name` | 分支名 / branch name / diff-based naming | Analyze current changes and output candidate branch names |

## Quick reference

- **Rule file:** [rules/branch-name.md](rules/branch-name.md)
- **Input sources:** `git status`, `git diff --stat`, `git diff --cached` (prefer staged), optional commit context
- **Reusable context:** prefer upstream `DIFF_CONTEXT` / `RAW_DIFF` when provided
- **Default output language:** Chinese + English
- **Language override:** if user explicitly asks for single language, output only that language
- **Bilingual formatting rule:** in bilingual mode, `中文` and `English` outputs must be wrapped in independent copy-ready code blocks

## How to use

- Match request to this skill's trigger.
- Follow [rules/branch-name.md](rules/branch-name.md) for exact workflow and naming constraints.
