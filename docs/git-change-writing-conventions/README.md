# Git Change Writing Conventions

This document defines reusable conventions for all skills under `skills/git-change-writing/`.

中文版本：[`README.zh-CN.md`](README.zh-CN.md)

## Scope

Applies to:

- `branch-name`
- `commit-message`
- `pr-content`
- `change-pack`

Use this as a checklist when creating or updating any related skill/rule.

## 1) Shared context reuse (hard rule)

- Prefer `DIFF_CONTEXT` when provided by user or upstream step.
- If only `RAW_DIFF` exists, summarize it once into `DIFF_CONTEXT`.
- Do not repeatedly read full diffs when `DIFF_CONTEXT` is sufficient.
- Only fallback to Git reads when context is missing, stale, or clearly incomplete.

## 2) DIFF_CONTEXT contract

Recommended fields:

- `source`: `staged` | `unstaged` | `mixed`
- `files`: changed files or grouped modules
- `summary`: 1-3 lines
- `intent`: `feat` | `fix` | `refactor` | `docs` | `chore` | `test` | `perf`
- `highlights`: 2-6 factual bullets (what + why)
- `risk`: optional behavior/compatibility risk
- `breaking_change`: optional flag + description
- `issues`: optional references when explicitly provided
- `terms`: domain keywords for wording consistency

## 3) Output copyability rules

- Every final artifact should be copy-ready.
- If outputs map to different target input fields, they must be split into separate code blocks.

### PR-specific requirement

- `PR Title` and `PR Description` must always be separate code blocks.
- Reason: they are pasted into two different input fields.

## 4) Language behavior

- Default: Simplified Chinese + English.
- If user asks for one language, output only that language.
- Dual-language outputs should stay semantically aligned.

## 5) Consistency across skills

- `SKILL.md` Quick reference should mention reusable context behavior.
- Rule `Step 0` should use consistent wording for context reuse.
- Templates and examples should match real copy/paste workflow.

## 6) Token-efficiency checklist

- Summarize once, reuse many times.
- Prefer `diff --stat` + targeted details over large raw dumps.
- Avoid duplicate explanation across branch/commit/PR outputs.

## 7) Maintenance checklist

When modifying one git-writing skill, verify all relevant siblings:

1. Reuse policy still consistent?
2. Output block structure still consistent?
3. Language defaults/override still consistent?
4. Templates/examples still copy-ready?
