---
name: change-pack
description: Generate branch name, commit message, and PR content from one shared diff context. Use this skill whenever the user asks to generate multiple git writing artifacts at once, wants to save time by analyzing changes once, or says things like '一口气生成分支名、commit、PR 内容', '链式生成 git 文案', '一次分析改动生成全部', 'generate branch + commit + PR from same diff', 'generate everything', 'all git content from this diff', 'chain generate', or 'one-shot git writing'. This is more efficient than calling individual skills separately because it reads the diff only once and reuses the context.
metadata:
  author: QuentinHsu
  version: "2026.03.07"
---

# Change Pack

Generate a complete Git writing pack (Branch Name + Commit Message + PR Content) from one shared diff context.

**Why this skill exists:** Reading and analyzing diffs is expensive (tokens + time). This skill reads the diff once, builds a shared context, then generates all three outputs from that same context. Much more efficient than calling three separate skills.

PR Title and PR Description are output as separate copy-ready blocks because GitHub has two different input fields.

## Context Reuse (Step 0)

See [_shared/context-reuse.md](../_shared/context-reuse.md) for the context reuse protocol.

If `DIFF_CONTEXT` or `RAW_DIFF` is already provided, use it directly to save time and tokens.

## Build Shared DIFF_CONTEXT (Step 1)

See [_shared/branch-diff-gathering.md](../_shared/branch-diff-gathering.md) for branch diff collection details.

Use **branch-level diff** as primary source (compare current branch against base branch).

Build one compact `DIFF_CONTEXT` containing:
- `base_branch` and effective diff range (for traceability)
- change scope (major modules/files)
- primary intent (`feat|fix|refactor|docs|chore|test|perf`)
- key behavior changes (what + why)
- notable risks/compatibility impact
- optional issue references if explicitly provided
- domain keywords (`terms`) for naming consistency

**Why build DIFF_CONTEXT:**
- Single source of truth for all three outputs
- Avoids re-reading the same diff three times
- Ensures consistency across branch name, commit, and PR
- Keeps token usage reasonable (≤ 220 lines recommended)

**Fallback behavior:**
- If branch diff is empty, stop and ask user to confirm target base branch
- If current branch equals base but no upstream tracking, ask for explicit comparison ref
- If user explicitly asks to include uncommitted work, append working tree deltas and mark `source: mixed`

## Chain Generation from DIFF_CONTEXT (Step 2)

Use the same `DIFF_CONTEXT` as single source of truth. Do **not** re-read full diff in downstream steps.

### 2.1 Branch Name

Generate 3 candidates: one recommended + two alternatives.

Use format `<prefix>/<slug>` (e.g., `feat/user-auth`, `fix/token-race`).

Keep best candidate ≤ 48 chars preferred (hard max 63 due to filesystem limits).

### 2.2 Commit Message

Generate Conventional Commits output:
- required Header: `type(scope): subject`
- optional Body and Footer

Keep header ≤ 72 chars (Git tools truncate longer headers).

English subject starts with lowercase (Conventional Commits spec requirement).

Chinese subject written in Simplified Chinese (`type(scope)` remains in English — they are Conventional Commits keywords).

### 2.3 PR Content

Generate `Title` + `Description` in Markdown.

Type-driven sections with fixed headings (see [_shared/pr-heading-map.md](../_shared/pr-heading-map.md)).

**Why fixed headings:** Consistent headings help teams quickly scan PRs and automated tools parse descriptions reliably.

Keep claims grounded in `DIFF_CONTEXT` facts.

**Quick reference:**

**Type: feat**
- 中文: `### 概述` → `### 改动说明` → `### 使用方式`
- English: `### Summary` → `### Changes` → `### Usage`

**Type: fix**
- 中文: `### 问题描述` → `### 复现步骤`(optional) → `### 修复方式` → `### 测试说明`
- English: `### Problem` → `### Steps to Reproduce`(optional) → `### Solution` → `### Testing`

**Type: perf|refactor**
- 中文: `### 概述` → `### 改动说明` → `### 效果`(optional)
- English: `### Summary` → `### Changes` → `### Impact`(optional)

**Type: docs|chore**
- 中文: `### 概述` → `### 改动说明`
- English: `### Summary` → `### Changes`

### Output Consistency

Branch prefix, commit type, and PR title type should be semantically aligned with `intent` whenever possible. This creates a coherent story across all three artifacts.

Reuse terms from `DIFF_CONTEXT.terms` to avoid wording drift between outputs.

## Language Behavior (Step 3)

See [_shared/bilingual-output.md](../_shared/bilingual-output.md) for bilingual output rules.

Default: Simplified Chinese + English (semantically aligned, not word-for-word translation).

If user requests one language, output only requested language.

When bilingual, Chinese and English must each be wrapped in independent code blocks in every section.

Each language version must be written entirely in its respective language — not one version copied and relabeled.

## Token-Efficiency Constraints (Step 4)

- Prefer `git diff --stat` + targeted excerpts over massive full-file dumps
- Summarize raw diff once; downstream sections consume only `DIFF_CONTEXT`
- Keep internal `DIFF_CONTEXT` concise (recommended ≤ 220 lines equivalent text)
- Avoid duplicate explanations across branch/commit/PR outputs

## Final Output Format (Step 5)

Output in order:
1. `Branch Name`
2. `Commit Message`
3. `PR Title`
4. `PR Description`

`PR Title` and `PR Description` are in two separate code blocks for direct paste into different GitHub input fields.

For each section, provide bilingual or single-language content based on request.

**Exception:** Branch Name is always English only (no bilingual output needed — branch names are English tokens).

In bilingual mode, each section (except Branch Name) contains exactly two copy-ready code blocks (one for `中文`, one for `English`).

Language label line (`中文` / `English`) appears immediately above its corresponding code block.

## Copy-Ready Template

Branch Name

```text
Recommended: <prefix/slug>
Alternatives:
- <prefix/slug-2>
- <prefix/slug-3>
```

Commit Message

中文

```text
<type(scope): subject>

- <what + why>
- <what + why>
```

English

```text
<type(scope): subject>

- <what + why>
- <what + why>
```

PR Title

中文

```text
<type: brief description>
```

English

```text
<type: brief description>
```

PR Description

中文

```text
### <fixed-section-heading>
- <fact>
```

English

```text
### <fixed-section-heading>
- <fact>
```

## Example (End-to-End)

Input (context provided once):

```text
DIFF_CONTEXT
- source: staged
- files: src/auth/token.ts, src/auth/refresh.ts, tests/auth/refresh.test.ts
- intent: fix
- highlights:
  - serialize token refresh requests to prevent concurrent overwrite
  - add retry guard for 401 edge case
  - add regression tests for refresh race
- terms: auth, token, refresh, race
```

Expected chained output:

Branch Name

中文

```text
Recommended: fix/auth-token-refresh-race
Alternatives:
- fix/auth-refresh-lock
- test/auth-refresh-race-coverage
```

English

```text
Recommended: fix/auth-token-refresh-race
Alternatives:
- fix/auth-refresh-lock
- test/auth-refresh-race-coverage
```

Commit Message

中文

```text
fix(auth): 修复 token 刷新竞态

- 串行化 refresh 请求，避免并发覆盖有效 token。
- 为 401 重试边界场景补充回归测试。
```

English

```text
fix(auth): handle token refresh race

- serialize refresh requests to avoid concurrent token overwrite.
- add regression tests to lock behavior for 401 retry edge cases.
```

PR Title

中文

```text
fix: 防止认证 token 刷新竞态
```

English

```text
fix: prevent auth token refresh race
```

PR Description

中文

```text
### 问题描述
- 并发 refresh 请求可能覆盖有效 token。

### 修复方式
- 串行化 refresh 流程，并为 401 边界场景增加重试保护。

### 测试说明
- 增加 refresh 竞态场景的回归测试。
```

English

```text
### Problem
- concurrent refresh requests could overwrite valid tokens.

### Solution
- serialize refresh flow and add retry guard for 401 edge cases.

### Testing
- add regression tests for refresh race scenarios.
```

## Before Finalizing (Step 6)

Quick verification:
- All sections generated from one shared `DIFF_CONTEXT` (no repeated full-diff reads)
- Branch prefix, commit type, and PR title type are semantically aligned with `intent`
- PR description headings follow the type-specific map (see _shared/pr-heading-map.md)
- In bilingual mode, each section uses independent code blocks for each language
- Statements are factual and grounded in `DIFF_CONTEXT` only

If something doesn't look right, adjust and regenerate only the failing section(s).

## Conventions

- Do not fabricate details outside provided diff context
- Prefer domain terms from file paths/symbols (maintains consistency with codebase)
- Optimize for clarity and token efficiency by reusing one shared context
