---
title: Generate branch, commit, and PR content from one shared diff context
impact: HIGH
tags: git, branch, commit, pull-request, chain, diff, token-saving
---

# Generate branch, commit, and PR content from one shared diff context

Generate a full Git writing pack from one analysis pass to reduce repeated diff reading and token usage.

## When to use

- User wants branch name + commit message + PR content in one request.
- User asks to avoid repeated diff analysis and reuse one shared context.

## Step 0: Reuse provided context first (hard rule)

- If `DIFF_CONTEXT` is already provided by user/upstream step, use it directly.
- If only `RAW_DIFF` is provided, summarize it once into `DIFF_CONTEXT`.
- Do not execute repeated full-diff reads once `DIFF_CONTEXT` is sufficient.
- Only fallback to Git reads when context is missing, stale, or clearly incomplete.

## DIFF_CONTEXT contract (single source of truth)

`DIFF_CONTEXT` should be compact and structured for downstream reuse.

Recommended fields:

- `source`: `staged` | `unstaged` | `mixed`
- `files`: changed file list or grouped modules
- `summary`: concise high-level change statement (1-3 lines)
- `intent`: one of `feat` / `fix` / `refactor` / `docs` / `chore` / `test` / `perf`
- `highlights`: 2-6 factual bullets (what changed + why)
- `risk`: optional compatibility/behavior risks
- `breaking_change`: optional boolean + description
- `issues`: optional issue references (only when provided)
- `terms`: domain keywords from paths/symbols for naming consistency

## Step 1: Build one shared DIFF_CONTEXT

- Read `git status` to detect staged/unstaged scope.
- Read `git diff --stat` for high-level file summary.
- Prefer `git diff --cached` when staged changes exist.
- If staged diff is empty, use `git diff` fallback.
- Build one compact `DIFF_CONTEXT` containing:
  - change scope (major modules/files)
  - primary intent (`feat`/`fix`/`refactor`/`docs`/`chore`/`test`/`perf`)
  - key behavior changes (what + why)
  - notable risks/compatibility impact
  - optional issue references if explicitly provided

### Fallback behavior

- If staged and unstaged both exist, prefer staged as primary source and mark `source: mixed` only when both are intentionally included.
- If no meaningful diff exists, stop and ask user to stage or provide target files.
- If context conflicts with user-stated intent, prioritize factual diff and present one neutral alternative output.

## Step 2: Chain generation from DIFF_CONTEXT only

Use the same `DIFF_CONTEXT` as single source of truth. Do **not** re-read full diff in downstream generation steps.

### 2.1 Branch name

- Generate 3 candidates: one recommended + two alternatives.
- Use format `<prefix>/<slug>`.
- Keep best candidate <= 48 chars preferred (hard max 63).

### 2.2 Commit message

- Generate Conventional Commits output:
  - required Header: `type(scope): subject`
  - optional Body and Footer
- Keep header <= 72 chars.
- English subject starts with lowercase.

### 2.3 PR content

- Generate `Title` + `Description` in Markdown.
- Type-driven sections with fixed headings (`feat` / `fix` / `perf|refactor` / `docs|chore`).
- Keep claims grounded in `DIFF_CONTEXT` facts.

#### PR Description fixed heading map (hard rule)

- Must use exact heading text below; no synonyms.
- Must keep exact order.
- Optional sections can be omitted only when not applicable.

Type: `feat`

- 中文：`### 概述` → `### 改动说明` → `### 使用方式`
- English: `### Summary` → `### Changes` → `### Usage`

Type: `fix`

- 中文：`### 问题描述` → `### 复现步骤`(optional) → `### 修复方式` → `### 测试说明`
- English: `### Problem` → `### Steps to Reproduce`(optional) → `### Solution` → `### Testing`

Type: `perf|refactor`

- 中文：`### 概述` → `### 改动说明` → `### 效果`(optional)
- English: `### Summary` → `### Changes` → `### Impact`(optional)

Type: `docs|chore`

- 中文：`### 概述` → `### 改动说明`
- English: `### Summary` → `### Changes`

### Output consistency rules

- Branch prefix and commit type should be semantically aligned with `intent` whenever possible.
- PR title type should match commit type unless evidence suggests a better primary intent.
- Reuse terms from `DIFF_CONTEXT.terms` to avoid wording drift.

## Step 3: Language behavior

- Default output: Simplified Chinese + English.
- If user requests one language, output only requested language.
- Two-language output should stay semantically aligned.
- **Hard rule:** when output is bilingual, Chinese and English must each be wrapped in their own independent code block in every section (Branch Name / Commit Message / PR Title / PR Description). Do not mix both languages in the same code block.

## Step 4: Token-efficiency constraints

- Prefer `git diff --stat` + targeted excerpts over massive full-file dumps.
- Summarize raw diff once; downstream sections consume only `DIFF_CONTEXT`.
- Keep internal `DIFF_CONTEXT` concise (recommended <= 220 lines equivalent text).
- Avoid duplicate explanations across branch/commit/PR outputs.

## Step 5: Final output format

- Output in order:
  1. `Branch Name`
  2. `Commit Message`
  3. `PR Title`
  4. `PR Description`
- `PR Title` and `PR Description` must be in two separate code blocks for direct paste into different input fields.
- For each section, provide bilingual or single-language content based on request.
- In bilingual mode, each section must contain exactly two copy-ready code blocks:
  - one block for `中文`;
  - one block for `English`.
- In bilingual mode, each language label line (`中文` / `English`) must appear immediately above its corresponding code block.
- Keep structure ready to copy into Git/GitHub workflows.

### Copy-ready template

Use this layout for final responses:

Branch Name

中文

```text
Recommended: <prefix/slug>
Alternatives:
- <prefix/slug-2>
- <prefix/slug-3>
```

English

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

## Step 6: Minimal end-to-end example

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

Expected chained output style:

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

## Step 7: Compliance checklist (must pass before output)

Before returning final pack, verify all checks below:

- [ ] All sections are generated from one shared `DIFF_CONTEXT` without repeated full-diff reads.
- [ ] Branch prefix, commit type, and PR title type are semantically aligned with `intent`.
- [ ] PR title format is exactly `<type>: <brief description>`.
- [ ] PR description headings follow the fixed heading map for the chosen PR type.
- [ ] Heading order is preserved; no synonym replacement.
- [ ] In bilingual mode, each section (`Branch Name`, `Commit Message`, `PR Title`, `PR Description`) uses independent `中文` and `English` code blocks.
- [ ] Language label lines are immediately above corresponding code blocks.
- [ ] Statements are factual and grounded in `DIFF_CONTEXT` only.

If any item fails, regenerate only the failing section(s) until all checks pass.

## Conventions

- Do not fabricate details outside provided diff context.
- Prefer domain terms from file paths/symbols.
- Optimize for clarity and token efficiency by reusing one shared context.