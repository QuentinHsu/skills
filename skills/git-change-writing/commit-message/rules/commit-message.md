---
title: Generate commit message from staged diff
impact: HIGH
tags: git, commit, conventional-commits, staged, changelog
---

# Generate commit message from staged diff

Generate a clear, conventional commit message based on staged changes.

## When to use

- User asks to generate commit message from staged changes.
- User asks to write a Conventional Commits message for current staged diff.

## Step 0: Reuse provided context first (hard rule)

- If `DIFF_CONTEXT` is already provided by user/upstream step, use it directly.
- If only `RAW_DIFF` is provided, summarize it once into `DIFF_CONTEXT`.
- Do not execute repeated full-diff reads once `DIFF_CONTEXT` is sufficient.
- Only fallback to staged Git reads when context is missing, stale, or clearly incomplete.

## Step 1: Read staged diff

- Run `git diff --cached` to read staged changes.
- If staged diff is empty, tell user to stage files first (e.g., `git add <file>`), then stop.

## Step 2: Classify change type

- Infer the most suitable Conventional Commits type:
  - `feat`, `fix`, `refactor`, `docs`, `style`, `chore`, `perf`, `test`
- Infer optional scope from changed module/path when clear.

## Step 3: Draft subject and body

- Commit message **must** follow three sections:
  - **Header (required)**
  - **Body (optional)**
  - **Footer (optional)**

### Header (required)

- Format: `type(scope): subject`
- Constraints:
  - Entire header length <= 72 characters
  - Use imperative mood in subject (e.g., add/fix/update, not added/fixed/updated)
  - For **English** subject text, the first character of the first word **must be lowercase**
    - ✅ `fix(auth): handle token refresh race`
    - ❌ `fix(auth): Handle token refresh race`
  - No trailing period

### Body (optional)

- If present, add one blank line after Header.
- Prefer list format for readability (recommended 2-4 bullet points).
- Each bullet should focus on one key point and cover both **what changed** and **why it changed**.
- Keep each bullet concise and specific, including implementation highlights and impact scope.

### Footer (optional)

- If present, add one blank line after Body (or after Header when Body is omitted).
- Use it for metadata such as:
  - Breaking changes: `BREAKING CHANGE: <description>`
  - Issue references: `Closes #123`, `Refs #456`
  - Co-authors/trailers when needed
- Footer content must be factual and directly supported by the staged diff/context.

## Step 4: Format output language

- Default: output **two versions**
  - 简体中文
  - English
- If user explicitly requests single language, output only requested language.
- Each commit message code block **must** have a plain-text language label on the line immediately above it:
  - `中文` for Simplified Chinese output
  - `English` for English output

## Step 5: Final output format

- Final output may contain plain-text language labels (`中文` / `English`) plus commit message code blocks.
- Do not add any other explanatory prose in final output.
- For dual-language output: provide two independent code blocks.
- For dual-language output: each code block must be preceded by its corresponding language label line.
- **Hard rule:** never mix Chinese and English commit message contents in the same code block.
- Each code block must contain exactly one complete commit message:
  - Header is required
  - Body is optional
  - Footer is optional

## Step 6: Bilingual templates (ready to copy)

Use these templates as references. Keep facts aligned with staged diff.

### Template A: Header only

中文

```text
fix(auth): 修复 token 刷新竞态
```

English

```text
fix(auth): handle token refresh race
```

### Template B: Header + Body

中文

```text
feat(search): 支持结果按更新时间排序

- 新增更新时间排序参数，支持按最近变更优先返回结果。
- 将默认策略从纯相关度改为混合排序，以平衡相关性与时效性。
- 在热门查询场景下更快暴露新内容，提升信息新鲜度。
```

English

```text
feat(search): support sorting results by updated time

- add an updated-time sorting option to prioritize recently changed content.
- switch default ranking from pure relevance to a hybrid strategy for better balance.
- surface fresh content faster in high-traffic queries to improve recency.
```

### Template C: Header + Body + Footer

中文

```text
refactor(api): 重构用户资料更新流程

- 将资料校验与持久化逻辑拆分为独立步骤，降低控制器复杂度。
- 统一错误映射策略，避免不同入口返回不一致状态码。
- 提升模块可测试性，便于后续演进与回归验证。

BREAKING CHANGE: 用户资料更新接口从 PUT /profile 改为 PATCH /users/{id}/profile
Closes #123

```


English

```text
refactor(api): split user profile update pipeline

- separate validation from persistence to reduce controller complexity.
- unify error mapping so different entry points return consistent status codes.
- improve testability to support safer future iterations.

BREAKING CHANGE: profile update endpoint changes from PUT /profile to PATCH /users/{id}/profile
Closes #123
```

## Step 7: Modern conventions (recommended)

- For breaking changes, prefer Header with bang marker and Footer together:
  - Header: `type(scope)!: subject`
  - Footer: `BREAKING CHANGE: <description>`
- Footer trailers should use standardized tokens when possible:
  - `Closes #123`, `Refs #456`, `Co-authored-by: Name <email>`
- Keep Body lines readable (recommended soft wrap around 72-100 chars).
- Avoid noisy wording; prioritize machine-parseable and review-friendly phrasing.

## Conventions

- Do not fabricate changes not present in staged diff.
- Keep terminology consistent with actual code symbols and file paths.
- Keep body concise but informative for future review.
