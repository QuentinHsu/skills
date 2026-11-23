---
name: commit-message
description: "Generate a Conventional Commits message from the staged diff and commit by default. Use when the user wants to generate a commit message or commit staged changes, e.g. '生成 commit', '写 commit message', '/commit-message', '/commit-message zh'."
metadata:
  author: QuentinHsu
  version: "2026.11.19"
---

# Commit Message

Generate a high-quality commit message from staged changes following Conventional Commits format.

By default, generate an English commit message and commit the staged changes. An explicit language selection changes the commit message language. Only skip the commit when the user explicitly asks for a preview or a message without committing.

## Context Reuse (Step 0)

See [_shared/context-reuse.md](./_shared/context-reuse.md) for the context reuse protocol.

If `DIFF_CONTEXT` or `RAW_DIFF` is already provided, reuse it when it describes the current staged changes. Before committing, verify the staged diff rather than relying on branch or working-tree context.

## Read Staged Diff (Step 1)

Run `git diff --cached` to read staged changes.

If staged diff is empty, simply remind the user to stage files first. Keep the message short and simple without suggesting specific commands to run, then stop.

## Classify Change Type (Step 2)

Infer one Conventional Commits type (`feat`, `fix`, `perf`, `refactor`, `test`, `docs`, `chore`, `style`) by **primary user-facing value**, following [_shared/type-classification.md](./_shared/type-classification.md).

Infer optional scope from changed module/path when clear.

**Scope inference by type:**

The scope communicates **impact area** — which part of the system this commit affects. Choose the most specific meaningful unit, not the directory or file name literally.

- **`feat` / `fix` / `perf` / `refactor`**: Infer from the primary changed module, package, component, or feature area. Prefer the most specific meaningful name: `token-refresh` over `auth` when tightly scoped to one sub-area, `auth` when spanning multiple auth concerns. Look at the dominant directory or symbol prefix: `src/auth/login.ts` → `auth`, `components/SearchBox/` → `search-box`. If spanning multiple unrelated modules with no common parent, use `global`.
- **`test`**: Scope must reflect the **module or feature being tested**, never the test directory (`tests`, `__tests__`) or test level (`unit`, `e2e`). Infer from the test target, not the test file path literally: `tests/auth/test_login.py` → `auth`. If tests span multiple unrelated modules with no common parent, use `global`.
- **`docs`**: Use the documented area as scope (e.g., `api`, `setup`, `getting-started`). Use `readme` or `contributing` only when the change is structural (reorganizing sections, updating badges) rather than documenting a specific feature. If spanning multiple unrelated documented areas, use `global`.
- **`chore`**: Use the affected tool, dependency, or infrastructure area. Dependency bumps → `deps` or the package name. CI/CD → `ci`. Build tooling → `build` or the tool name. Changes spanning multiple unrelated infrastructure areas → `global`.
- **`style`**: If formatting spans multiple unrelated areas, use `global`. If targeting one area specifically, use that area's name. Otherwise, omit scope.

**Scope format:**
- Use **lowercase kebab-case** for multi-word scopes: `dark-mode`, `search-box`, `token-refresh`
- One scope per commit. For changes touching multiple unrelated areas, use `global` or pick the most impacted area.
- `global` is the reserved scope for changes spanning multiple unrelated modules with no common parent.
- For **monorepos**: prefer the package/app name as scope (e.g., `feat(web): ...`, `fix(api): ...`)

**When to use `global` as scope:**
- Changes span multiple unrelated modules with no common parent
- No single area is clearly primary and several distinct areas are affected

**When to omit scope:**
- Adding a scope would be actively misleading
- The commit type alone is self-descriptive and scope adds no meaningful information (e.g., trivial single-file whitespace fix)

## Draft Commit Message (Step 3)

Draft the commit message as structured content first, then normalize it in Step 4 before showing or committing it.

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

**`test` type subject rules:**

The subject must describe the scenarios or behaviors covered — not the activity of adding tests.

- ✅ `test(parser): cover malformed input fallback` — names the scenario and module
- ✅ `test(auth): verify token expiry edge cases` — describes what behavior is tested
- ❌ `test: add service and parsing coverage` — no scope, vague, describes activity not scenarios
- ❌ `test(auth): add login tests` — describes activity, not what behavior or edge case is verified

Scope must reflect the module or feature being tested (see Classify Change Type above). Only use `global` as scope when tests genuinely span multiple unrelated modules with no common parent.

### Body (optional)

Add exactly one blank line after Header, then use a tight bullet list format (2-4 bullets recommended).

Each bullet covers **one change and its reason**, helping future readers understand not just what happened but why.

**When to add a body:**
- Multiple logical steps or files changed with a coherent purpose
- The motivation, trade-off, or side effect isn't obvious from the diff alone
- A `fix` has a non-obvious root cause worth documenting
- A `perf` improvement has measurable or perceivable impact worth noting
- A `test` addition covers specific edge cases or scenarios worth naming
- A `feat` has intentional scope boundaries worth clarifying

**When to skip the body:**
- The subject alone fully describes the change and the diff is self-explanatory
- Single-line fixes, typo corrections, trivial config changes, small dependency bumps
- Adding a body would only restate the subject in more words

**Body writing rules:**
- Use bullet points (`- ` prefix), not prose paragraphs
- Keep the bullet list single-spaced: **never insert blank lines between bullet items**
- Before returning or committing the message, remove any empty line that appears between two adjacent body bullet items
- Each bullet should stay a single paragraph; do not create multi-paragraph bullets
- Order by importance — most impactful change first
- Don't repeat the subject; the body adds detail, not restatement
- Don't describe what `git diff` already shows (file renames, exact line counts, mechanical refactors)
- Focus on **decisions and effects**: what behavior changed, what edge case is now handled, what trade-off was accepted
- For `fix` type: name the symptom and root cause when non-obvious
- For `perf` type: describe the before/after experience difference or the measurable gain
- For `test` type: name the specific scenarios, edge cases, or boundary conditions covered — never restate "add X tests" or "add X coverage"; describe what behavior is now verified
- For `feat` type: clarify scope limits — what the feature does and doesn't cover

**Required spacing skeleton:**

```text
type(scope): subject

- first detail
- second detail
- third detail
```

Only the separator between Header and Body may be blank. Adjacent body bullets must stay contiguous with no empty lines between them.

### Footer (optional)

Add one blank line after Body (or after Header if Body omitted).

Use for metadata:
- Breaking changes: `BREAKING CHANGE: <description>`
- Issue references: `Closes #123` (commit fully resolves the issue), `Refs #456` (related but not resolved)

Never add any `Co-authored-by` trailer, regardless of capitalization or whether it names a person, AI, or tool. This applies to every generated message, including previews and commits.

Use `Closes` / `Fixes` / `Resolves` only when the commit fully resolves the referenced issue. Use `Refs` for related issues, partial work, or follow-up items. Never fabricate issue references — only include ones explicitly mentioned in the diff context.

Footer content must be factual and directly supported by staged diff/context.

## Normalize Final Message (Step 4)

Always run the generated message through `scripts/format_commit_message.py` before preview output or committing.

Use this pipeline:

1. Draft the full commit message in a temporary file or heredoc.
2. Run:

   ```bash
   python3 skills/git-change-writing/commit-message/scripts/format_commit_message.py <draft-file>
   ```

3. Use the script output as the only final commit message.
4. Do not hand-edit spacing after script output unless correcting content; if content changes, run the script again.

The script is the source of truth for spacing:
- one blank line between Header and Body when Body exists
- zero blank lines between adjacent `- ` body bullets
- one blank line between Body and Footer when Footer exists
- no leading or trailing blank lines

If the skill is running from an installed copy outside this repository, resolve the script relative to the loaded `SKILL.md` directory:

```bash
python3 <skill-dir>/scripts/format_commit_message.py <draft-file>
```

Never return or commit a message that bypasses this normalization step.

## Language, Command Variants, and Output Format (Step 5)

Default to one English commit message. Select another language only when the user explicitly requests it.

Recognize explicit language selection from natural language requests or slash-command style inputs such as:
- `/commit-message en`
- `/commit-message english`
- `/commit-message zh`
- `/commit-message zh-cn`
- `/commit-message cn`

Language token mapping:
- `en`, `english` → English only
- `zh`, `zh-cn`, `cn`, `中文`, `简体中文` → Simplified Chinese only
- Other unambiguous language abbreviations select the corresponding language (for example, `ja` → Japanese). If the abbreviation is unclear, ask the user which language they mean.

Write the subject and body in the selected language; `type(scope)` remains in English.

Slash-command behavior:
- `/commit-message` → generate an English commit message and commit the staged changes
- `/commit-message en` → generate an English commit message and commit the staged changes
- `/commit-message zh` → generate a Simplified Chinese commit message and commit the staged changes

Only when the user explicitly requests a preview or a message without committing, return normalized, copy-ready message text without committing. Default to English for a preview too. If the user explicitly requests a bilingual preview, follow [_shared/bilingual-output.md](./_shared/bilingual-output.md) and normalize each language separately.

## Commit Execution (Step 6)

Unless the user explicitly requests a preview or a message without committing, attempt the commit by default. No execution flag is needed.

Execution rules:

1. Read staged diff and draft the commit message in exactly one target language.
2. Write the draft message to a temporary file.
3. Run `scripts/format_commit_message.py` and write its output to the final commit message file.
4. Use the normalized file with `git commit -F <final-message-file>`.
5. Preserve normalized header/body/footer formatting exactly, including blank lines and trailers.
6. Never pass the draft message directly to `git commit`.
7. Prefer a full-message commit input path that safely supports multiline content, instead of collapsing everything into a single-line header.
8. Do not ask an extra "should I commit now" question when the user invokes the skill.
9. Keep the final commit message clean and content-derived; do not append attribution or co-author trailers.
10. Never commit messages containing AI, provider, or tool attribution.

If staged diff is empty, stop with the same short reminder defined in Step 1.

For commit footer safety:
- allow only clean, diff-supported commit content in the final message
- do not add `Co-authored-by` trailers, regardless of capitalization or identity
- never add assistant, model, vendor, or tool attribution to the committed message

### Signed Commit and GPG Confirmation

Support signed commits as part of the normal workflow:

- If the user explicitly requests signing, or the Git/repository configuration already requires signing (for example `commit.gpgsign=true`), perform a signed commit.
- Allow Git, GPG, pinentry, or the operating system to surface the normal signing confirmation flow, including fingerprint confirmation dialogs when available.
- Do not suppress, bypass, or fake the user's signing approval step.
- If the signing flow requests a secret (passphrase, PIN, hardware-token approval, etc.), the user must complete that step directly in the terminal or OS dialog; do not collect secrets through chat.
- If signing is requested/configured but the commit fails because signing is unavailable or rejected, report the failure briefly and do not claim success.

### Execution Output

After a commit attempt, return a concise execution summary containing:
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

### Test addition (Header + Body)

中文

```text
test(auth): 补充令牌刷新边界测试

- 覆盖令牌过期前并发刷新场景。
- 新增刷新失败后重试上限的测试用例。
- 验证不同环境下的令牌 TTL 兼容性。
```

English

```text
test(auth): cover token refresh boundary cases

- add test for concurrent refresh before token expiry.
- cover retry limit after refresh failure.
- verify token TTL compatibility across environments.
```

### Performance improvement (Header + Body)

中文

```text
perf(table): 大数据集下减少滚动卡顿

- 对可见行采用虚拟化渲染，将 DOM 节点数从 O(n) 降到 O(1)。
- 表格快速滚动时感官延迟明显降低，万行以上场景改善尤为突出。
```

English

```text
perf(table): reduce scroll jank in large datasets

- virtualize visible rows to bring DOM node count from O(n) down to O(1).
- perceived latency drops noticeably during fast scrolling, especially above 10k rows.
```

### Dependency update (Header only)

中文

```text
chore(deps): 升级 lodash 至 4.17.21
```

English

```text
chore(deps): bump lodash to 4.17.21
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

## Commit Execution Examples

### Default commit in English

Request:

```text
/commit-message
```

Expected behavior:
- read staged diff
- generate one English Conventional Commit message
- commit staged changes with that exact message
- allow GPG / fingerprint authorization confirmation to appear if signing is requested or configured
- return a short success summary instead of bilingual preview blocks

### Commit in Simplified Chinese

Request:

```text
/commit-message zh
```

Expected behavior:
- read staged diff
- generate one Simplified Chinese Conventional Commit message
- commit staged changes with that exact message
- preserve multiline body/footer formatting
- return a short success or failure summary

## Modern Conventions (Recommended)

- For breaking changes, use bang marker in header (`type(scope)!:`) plus `BREAKING CHANGE:` in footer
- Footer references should use standardized tokens such as `Closes #123` and `Refs #456`
- Keep Body lines readable (soft wrap around 72-100 chars recommended)
- Avoid noisy wording; prioritize machine-parseable and review-friendly phrasing

## Conventions

- Do not fabricate changes not present in staged diff
- Keep terminology consistent with actual code symbols and file paths
- Keep body concise but informative for future review
- For Header + Body output, allow exactly one blank line between sections and zero blank lines between adjacent bullets
- Execute exactly one commit against the staged changes only, unless the user explicitly requests a preview
- Commit only the clean generated git message; do not append AI or tool attribution trailers
- Never claim a commit succeeded unless Git actually reports success
