---
name: commit-message
description: Generate conventional commit messages from staged git diff. Use this skill whenever the user asks to generate a commit message, write commit text, create a conventional commit, or says things like '生成 commit', '写 commit message', '根据暂存区生成提交说明', 'generate commit message from staged diff', 'write a conventional commit', 'what should my commit say', 'help me commit this'. Also trigger when you see requests to follow Conventional Commits format or when the user has staged changes and asks about committing.
metadata:
  author: QuentinHsu
  version: "2026.03.07"
---

# Commit Message

Generate a high-quality commit message from staged changes following Conventional Commits format.

## Context Reuse (Step 0)

See [_shared/context-reuse.md](../_shared/context-reuse.md) for the context reuse protocol.

If `DIFF_CONTEXT` or `RAW_DIFF` is already provided, use it directly to save time and tokens.

## Read Staged Diff (Step 1)

Run `git diff --cached` to read staged changes.

If staged diff is empty, tell user to stage files first (e.g., `git add <file>`), then stop.

## Classify Change Type (Step 2)

Infer the most suitable Conventional Commits type:
- `feat`, `fix`, `refactor`, `docs`, `style`, `chore`, `perf`, `test`

Infer optional scope from changed module/path when clear.

## Draft Commit Message (Step 3)

Commit message structure:

### Header (required)

Format: `type(scope): subject`

**Why these constraints matter:**
- **≤ 72 characters**: Git tools truncate longer headers in logs and UIs
- **Imperative mood** (add/fix/update): Matches Git's own convention ("Merge branch X")
- **English subject starts lowercase**: Conventional Commits specification requirement
- **No trailing period**: Standard convention for commit subjects

Examples:
- ✅ `fix(auth): handle token refresh race`
- ❌ `fix(auth): Handle token refresh race` (uppercase)
- ❌ `fix(auth): handled token refresh race` (past tense)

### Body (optional)

Add one blank line after Header, then use list format (2-4 bullet points recommended).

Each bullet should cover **what changed** and **why**. This helps future maintainers understand the reasoning behind the change.

Keep concise and specific, include implementation highlights and impact scope.

### Footer (optional)

Add one blank line after Body (or after Header if Body omitted).

Use for metadata:
- Breaking changes: `BREAKING CHANGE: <description>`
- Issue references: `Closes #123`, `Refs #456`
- Co-authors/trailers when needed

Footer content should be factual and directly supported by staged diff/context.

## Language and Output Format (Step 4)

See [_shared/bilingual-output.md](../_shared/bilingual-output.md) for bilingual output rules.

Default: output both 简体中文 and English versions.

If user explicitly requests single language, output only that language.

Each language gets independent code block with language label above it.

## Examples

### Simple fix (Header only)

中文

```text
fix(auth): 修复 token 刷新竞态
```

English

```text
fix(auth): handle token refresh race
```

### Feature with context (Header + Body)

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

### Breaking change (Header + Body + Footer)

中文

```text
refactor(api)!: 重构用户资料更新流程

- 将资料校验与持久化逻辑拆分为独立步骤，降低控制器复杂度。
- 统一错误映射策略，避免不同入口返回不一致状态码。
- 提升模块可测试性，便于后续演进与回归验证。

BREAKING CHANGE: 用户资料更新接口从 PUT /profile 改为 PATCH /users/{id}/profile
Closes #123
```

English

```text
refactor(api)!: split user profile update pipeline

- separate validation from persistence to reduce controller complexity.
- unify error mapping so different entry points return consistent status codes.
- improve testability to support safer future iterations.

BREAKING CHANGE: profile update endpoint changes from PUT /profile to PATCH /users/{id}/profile
Closes #123
```

## Modern Conventions (Recommended)

- For breaking changes, use bang marker in header (`type(scope)!:`) plus `BREAKING CHANGE:` in footer
- Footer trailers should use standardized tokens: `Closes #123`, `Refs #456`, `Co-authored-by: Name <email>`
- Keep Body lines readable (soft wrap around 72-100 chars recommended)
- Avoid noisy wording; prioritize machine-parseable and review-friendly phrasing

## Conventions

- Do not fabricate changes not present in staged diff
- Keep terminology consistent with actual code symbols and file paths
- Keep body concise but informative for future review
