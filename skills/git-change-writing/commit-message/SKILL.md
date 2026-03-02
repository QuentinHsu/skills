---
name: commit-message
description: Generate conventional commit messages from staged git diff
metadata:
  author: QuentinHsu
  version: "2026.03.02"
---

# Commit Message

Generate a high-quality commit message from staged changes.

## When to apply

- User asks: "生成 commit 信息", "写 commit message", "根据暂存区生成提交说明"
- User asks: "generate commit message from staged diff", "write a conventional commit"

## Rule categories

| Rule | Trigger | Description |
|------|---------|-------------|
| `commit-message` | commit 信息 / commit message / staged diff | Analyze `git diff --cached` and produce Conventional Commits output |

## Quick reference

- **Rule file:** [rules/commit-message.md](rules/commit-message.md)
- **Input source:** staged changes (`git diff --cached`)
- **Reusable context:** prefer upstream `DIFF_CONTEXT` / `RAW_DIFF` when provided
- **Default output language:** Chinese + English
- **Language override:** if user explicitly asks for single language, output only that language
- **Bilingual formatting rule:** in bilingual mode, `中文` and `English` outputs must be in independent copy-ready code blocks

## How to use

- Match request to this skill's trigger.
- Follow [rules/commit-message.md](rules/commit-message.md) for exact workflow and format constraints.
