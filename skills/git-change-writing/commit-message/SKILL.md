---
name: commit-message
description: Generate conventional commit messages from staged git diff. Use this skill whenever the user asks to generate a commit message, write commit text, create a conventional commit, or says things like '生成 commit', '写 commit message', '根据暂存区生成提交说明', 'generate commit message from staged diff', 'write a conventional commit', 'what should my commit say', 'help me commit this', '/commit-message en auto', '/commit-message zh auto', '直接用生成的 commit message 提交暂存区', or 'generate and auto commit staged changes'. Also trigger when you see requests to follow Conventional Commits format or when the user has staged changes and asks about committing.
metadata:
  author: QuentinHsu
  version: "2026.05.21"
---

# Commit Message

Generate a high-quality commit message from staged changes following Conventional Commits format.

When the user explicitly requests execution mode (for example `/commit-message en auto`), generate the final commit message in the requested language and use it to commit the staged changes automatically.

## Context Reuse (Step 0)

See [_shared/context-reuse.md](../_shared/context-reuse.md) for the context reuse protocol.

If `DIFF_CONTEXT` or `RAW_DIFF` is already provided, use it directly to save time and tokens.

## Read Staged Diff (Step 1)

Run `git diff --cached` to read staged changes.

If staged diff is empty, simply remind the user to stage files first. Keep the message short and simple without suggesting specific commands to run, then stop.

## Classify Change Type (Step 2)

See [_shared/type-classification.md](../_shared/type-classification.md) for the detailed classification rules.

Infer the most suitable Conventional Commits type:
- `feat`, `fix`, `refactor`, `docs`, `style`, `chore`, `perf`, `test`

Choose type by **primary user-facing value**.

Important boundary:
- Use `feat` for **net-new capability or workflow**
- Use `perf` when the same core capability remains but the experience becomes faster, smoother, clearer, or easier
- For pure UI/UX/interaction optimization without a materially new use case, prefer `perf` over `feat`
- If the interaction was actually broken and is now corrected, prefer `fix`

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

## Language, Command Variants, and Output Format (Step 4)

See [_shared/bilingual-output.md](../_shared/bilingual-output.md) for bilingual output rules.

Default: output both 简体中文 and English versions.

If user explicitly requests single language, output only that language.

Recognize explicit language selection from natural language requests or slash-command style inputs such as:
- `/commit-message en`
- `/commit-message english`
- `/commit-message zh`
- `/commit-message zh-cn`
- `/commit-message cn`

Language token mapping:
- `en`, `english` → English only
- `zh`, `zh-cn`, `cn`, `中文`, `简体中文` → Simplified Chinese only

If no language is explicitly requested:
- preview mode: output both 简体中文 and English versions
- `auto` mode: resolve one final commit language before execution; prefer English by default unless the user clearly asks for Chinese

Each language gets independent code block with language label above it.

Chinese version: subject and body written in Simplified Chinese (`type(scope)` remains in English — they are Conventional Commits keywords).
English version: subject and body written in English.

Slash-command execution hint:
- `/commit-message en auto` → generate English commit message and auto-commit staged changes
- `/commit-message zh auto` → generate Simplified Chinese commit message and auto-commit staged changes

If `auto` is not present, stay in preview mode and only output copy-ready commit message text.

## Auto Commit Execution (Step 5)

If the request explicitly includes `auto` (for example `/commit-message en auto`) or clearly asks you to commit immediately, switch from preview mode to execution mode.

Execution rules:

1. Read staged diff and draft the final commit message in exactly one target language.
2. Use that exact message content to commit the staged changes automatically.
3. Preserve header/body/footer formatting exactly, including blank lines and trailers.
4. Prefer a full-message commit input path that safely supports multiline content (for example a commit message file or another equivalent full-text mechanism), instead of collapsing everything into a single-line header.
5. Do not ask an extra "should I commit now" question when the user has already chosen `auto`.
6. Keep the final auto-commit message clean and content-derived: do not append attribution or co-author trailers that were not explicitly requested and factually justified.
7. In particular, never auto-commit messages containing AI/provider attribution lines such as `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>` or similar generated identity markers.

If staged diff is empty, stop with the same short reminder defined in Step 1.

For `auto` mode footer safety:
- allow only clean, diff-supported commit content in the final message
- do not inject `Co-authored-by` / `Co-Authored-By` trailers unless the user explicitly asked for a legitimate human co-author and the trailer is factually justified
- never add assistant, model, vendor, or tool attribution to the committed message

### Signed Commit and GPG Confirmation

When execution mode is enabled, support signed commits as part of the normal workflow:

- If the user explicitly requests signing, or the Git/repository configuration already requires signing (for example `commit.gpgsign=true`), perform a signed commit.
- Allow Git, GPG, pinentry, or the operating system to surface the normal signing confirmation flow, including fingerprint confirmation dialogs when available.
- Do not suppress, bypass, or fake the user's signing approval step.
- If the signing flow requests a secret (passphrase, PIN, hardware-token approval, etc.), the user must complete that step directly in the terminal or OS dialog; do not collect secrets through chat.
- If signing is requested/configured but the commit fails because signing is unavailable or rejected, report the failure briefly and do not claim success.

### Execution Output

In `auto` mode, do not return bilingual preview blocks as the primary result.

Instead, return a concise execution summary containing:
- whether the commit succeeded
- the resolved commit language
- the created commit hash and committed header when available
- whether signing/GPG confirmation was invoked when relevant

If commit execution fails, return a short failure summary plus the key reason.

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

## Auto Mode Examples

### Auto commit in English

Request:

```text
/commit-message en auto
```

Expected behavior:
- read staged diff
- generate one English Conventional Commit message
- commit staged changes with that exact message
- allow GPG / fingerprint authorization confirmation to appear if signing is requested or configured
- return a short success summary instead of bilingual preview blocks

### Auto commit in Simplified Chinese

Request:

```text
/commit-message zh auto
```

Expected behavior:
- read staged diff
- generate one Simplified Chinese Conventional Commit message
- commit staged changes with that exact message
- preserve multiline body/footer formatting
- return a short success or failure summary

## Modern Conventions (Recommended)

- For breaking changes, use bang marker in header (`type(scope)!:`) plus `BREAKING CHANGE:` in footer
- Footer trailers should use standardized tokens: `Closes #123`, `Refs #456`, `Co-authored-by: Name <email>`
- Keep Body lines readable (soft wrap around 72-100 chars recommended)
- Avoid noisy wording; prioritize machine-parseable and review-friendly phrasing

## Conventions

- Do not fabricate changes not present in staged diff
- Keep terminology consistent with actual code symbols and file paths
- Keep body concise but informative for future review
- In `auto` mode, execute exactly one commit against the staged changes only
- In `auto` mode, commit only the clean generated git message; do not append AI or tool attribution trailers
- Never claim a commit succeeded unless Git actually reports success
