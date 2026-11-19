---
name: pr-content
description: Generate GitHub Pull Request title and description from branch changes. Use this skill whenever the user asks to create PR content, draft a pull request, write PR description, or says things like '生成 PR 内容', '写 PR 描述', '帮我整理 PR 标题和正文', 'generate PR content', 'write PR title and description', 'draft pull request description', 'what should my PR say', or 'help me write this PR'. Also trigger when you see requests for PR templates, PR summaries, or when the user is preparing to open a pull request.
metadata:
  author: QuentinHsu
  version: "2026.03.07"
---

# PR Content

Generate ready-to-paste Pull Request content (Title + Description) based on branch changes.

Title and Description are output as separate copy-ready blocks because GitHub has two different input fields.

## Context Reuse (Step 0)

See [_shared/context-reuse.md](./_shared/context-reuse.md) for the context reuse protocol.

If `DIFF_CONTEXT` or `RAW_DIFF` is already provided, use it directly to save time and tokens.

## Gather Change Context (Step 1)

See [_shared/branch-diff-gathering.md](./_shared/branch-diff-gathering.md) for branch diff collection details.

Use **branch-level diff** as primary source (compare current branch against base branch). This gives you the full picture of what's changing in the PR.

## Determine PR Type (Step 2)

Select one primary type (`feat`, `fix`, `perf`, `refactor`, `test`, `docs`, `chore`, `style`) by the dominant user-facing outcome, following [_shared/type-classification.md](./_shared/type-classification.md).

The type drives the PR description structure (different types need different sections).

## Generate Title (Step 3)

Format: `type(scope): subject`

Use the same scope inference rules as `commit-message`: choose the most specific meaningful impact area, use lowercase kebab-case for multi-word scopes, use `global` only when changes span unrelated areas, and omit scope only when adding one would be misleading.

Keep title concise and specific. Focus on what changed, not how you analyzed it.

Title rules:
- keep the same type as the PR description section map
- keep the subject short enough for GitHub lists and notifications
- English subject starts with lowercase, matching Conventional Commits
- Chinese subject is written in Simplified Chinese while `type(scope)` remains in English

## Generate Description by Type (Step 4)

See [_shared/pr-heading-map.md](./_shared/pr-heading-map.md) for the complete heading map.

**Why fixed headings matter:**
- Consistent headings help teams quickly scan PRs and find relevant sections
- Automated tools and scripts often parse PR descriptions by heading text
- Team members know exactly where to look for specific information (e.g., "where's the testing info?")

Use the exact heading text from the map (no synonyms) and keep the exact order. This consistency is what makes the headings useful.

**Quick reference:**

**Type: feat**
- 中文: `### 概述` → `### 改动说明` → `### 使用方式`
- English: `### Summary` → `### Changes` → `### Usage`

**Type: fix**
- 中文: `### 问题描述` → `### 复现步骤`(optional) → `### 修复方式` → `### 测试说明`
- English: `### Problem` → `### Steps to Reproduce`(optional) → `### Solution` → `### Testing`

**Type: perf/refactor**
- 中文: `### 概述` → `### 改动说明` → `### 效果`(optional)
- English: `### Summary` → `### Changes` → `### Impact`(optional)

**Type: docs/chore**
- 中文: `### 概述` → `### 改动说明`
- English: `### Summary` → `### Changes`

## Language and Output Format (Step 5)

See [_shared/bilingual-output.md](./_shared/bilingual-output.md) for bilingual output rules.

Default: output both 简体中文 and English versions (semantically aligned, not word-for-word translation).

Each language version must be independently written in its respective language — not one version copied and relabeled.

If user explicitly requests single language, output only that language.

**Output structure:**
- `PR Title` and `PR Description` in **separate code blocks** (they go into different GitHub input fields)
- For bilingual output, each language gets its own independent code blocks
- Language label (`中文` / `English`) appears immediately above each code block

## Before Finalizing (Step 6)

Quick verification:
- Type is clear and matches the actual changes
- PR Title follows `type(scope): subject` and uses a meaningful scope when one is clear
- Headings follow the type-specific map (see _shared/pr-heading-map.md)
- In bilingual mode, each language has its own code blocks
- All claims are grounded in the actual diff

If something doesn't look right, adjust and regenerate.

## Output Template

PR Title

中文

```text
<type(scope): subject>
```

English

```text
<type(scope): subject>
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

## Example

PR Title

中文

```text
fix(auth): 防止认证 token 刷新竞态
```

English

```text
fix(auth): prevent auth token refresh race
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

- Mention base branch only as internal baseline for analysis, not in PR summary narrative
- Keep statements grounded in actual branch diffs and commits
- Prefer concrete change highlights over generic wording
