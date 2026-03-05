---
title: Generate Pull Request content from branch changes
impact: HIGH
tags: git, pull-request, pr, title, description, markdown
---

# Generate Pull Request content from branch changes

Generate a complete PR Title and Description based on current branch changes.

## When to use

- User asks to generate PR title/description for current work.
- User asks for a GitHub PR draft based on commits and diffs.

## Step 0: Reuse provided context first (hard rule)

- If `DIFF_CONTEXT` is already provided by user/upstream step, use it directly.
- If only `RAW_DIFF` is provided, summarize it once into `DIFF_CONTEXT`.
- Do not execute repeated full-diff reads once `DIFF_CONTEXT` is sufficient.
- Only fallback to Git reads when context is missing, stale, or clearly incomplete.

## Step 1: Gather change context (branch-level diff first)

- Use **branch-level diff** as primary source: compare current branch against a base branch.
- Resolve base branch with this priority:
  1. user-specified base branch (if provided)
  2. `main`
  3. `master`
- If none is available, ask user to provide a base branch.
- If current branch equals resolved base branch and local commits are ahead of upstream, use upstream tracking point (`@{upstream}`) as effective baseline.
- Read `git diff <effective_base>...HEAD --stat` to understand file-level scope.
- Read `git log --oneline <effective_base>..HEAD` to summarize intent across all commits in effective range.
- Read relevant diff details from `<effective_base>...HEAD` when needed for accurate summary.
- If current branch equals base branch but upstream tracking is missing, ask user to provide explicit comparison ref (e.g. `origin/main`, tag, or SHA).
- Only when user explicitly requests including uncommitted changes, additionally read `git diff --cached` / `git diff` and mark context as mixed.

## Step 2: Determine PR type

- Select one primary type based on change intent:
  - `feat`: new feature
  - `fix`: bug fix
  - `perf` / `refactor`: optimization or refactor
  - `docs` / `chore`: docs or maintenance

## Step 3: Generate title

- Format: `<type>: <brief description>`
- Keep title concise and specific.
- Do not mention branch comparison process in title.

## Step 4: Generate description by type (fixed headings)

Use `###` sections with **exact, fixed heading names** based on PR type.

**Hard rule:**

- Must use the exact heading text below; do not replace with synonyms.
- Must keep the exact order below.
- Optional sections may be omitted only when truly not applicable.

### Fixed heading map

#### Type: feat

- Chinese headings (exact):
  1. `### 概述`
  2. `### 改动说明`
  3. `### 使用方式`
- English headings (exact):
  1. `### Summary`
  2. `### Changes`
  3. `### Usage`

#### Type: fix

- Chinese headings (exact):
  1. `### 问题描述`
  2. `### 复现步骤` (optional)
  3. `### 修复方式`
  4. `### 测试说明`
- English headings (exact):
  1. `### Problem`
  2. `### Steps to Reproduce` (optional)
  3. `### Solution`
  4. `### Testing`

#### Type: perf/refactor

- Chinese headings (exact):
  1. `### 概述`
  2. `### 改动说明`
  3. `### 效果` (optional)
- English headings (exact):
  1. `### Summary`
  2. `### Changes`
  3. `### Impact` (optional)

#### Type: docs/chore

- Chinese headings (exact):
  1. `### 概述`
  2. `### 改动说明`
- English headings (exact):
  1. `### Summary`
  2. `### Changes`

## Step 5: Language and output format

- Default: output **two versions** (简体中文 + English), semantically aligned.
- If user explicitly requests single language, output only requested language.
- Use Markdown and provide copy-ready code blocks.
- `PR Title` and `PR Description` must be in **separate code blocks** because they are pasted into different input fields.
- For dual-language output, each language should include two blocks in order:
  1. `PR Title`
  2. `PR Description`
- **Hard rule:** in dual-language output, Chinese and English must each use their own independent code blocks for both `PR Title` and `PR Description`. Do not mix two languages in one code block.
- In dual-language output, language label lines (`中文` / `English`) must appear immediately above each corresponding code block.

## Step 6: Compliance checklist (must pass before output)

Before returning final content, verify all checks below:

- [ ] PR type is explicitly selected from `feat|fix|perf|refactor|docs|chore`.
- [ ] `PR Title` format is exactly `<type>: <brief description>`.
- [ ] `PR Description` headings match the fixed heading map for the selected type.
- [ ] Heading order strictly follows the fixed map.
- [ ] No heading synonym replacement is used.
- [ ] In bilingual mode, Chinese and English each use independent code blocks for `PR Title` and `PR Description`.
- [ ] Language label lines (`中文` / `English`) are immediately above corresponding code blocks.
- [ ] Claims are grounded in provided diff/context facts only.

If any item fails, regenerate until all items pass.

### Copy-ready template

PR Title

中文

```text
<type>: <brief description>
```

English

```text
<type>: <brief description>
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

### Minimal output example

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

## Conventions

- Mention base branch only as internal baseline for analysis, not in PR summary narrative.
- Keep statements grounded in actual branch diffs and commits.
- Prefer concrete change highlights over generic wording.
