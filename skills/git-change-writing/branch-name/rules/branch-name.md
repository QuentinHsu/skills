---
title: Generate branch name from code changes
impact: HIGH
tags: git, branch, naming, diff, workflow
---

# Generate branch name from code changes

Generate concise, meaningful branch names from current changes.

## When to use

- User asks for branch name suggestions based on current work.
- User asks to rename or create branch with a name derived from diff/intent.

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
- Read `git diff <effective_base>...HEAD --stat` for file-level summary.
- Optionally read `git log --oneline <effective_base>..HEAD` to improve intent inference across multiple commits.
- If current branch equals base branch but upstream tracking is missing, ask user to provide explicit comparison ref (e.g. `origin/main`, tag, or SHA).
- Only when user explicitly requests including uncommitted changes, additionally read `git diff --cached` / `git diff` and mark context as mixed.

## Step 2: Infer intent and type

- Determine primary intent from changes:
  - `feature` (new capability)
  - `bugfix` (defect fix)
  - `refactor` (internal restructuring)
  - `docs` (documentation)
  - `chore` (maintenance/tooling)
  - `test` (tests only)
- Extract 2-5 keywords from modified modules, entities, or behavior.

## Step 3: Build naming candidates

- Use slash style prefix by default: `<prefix>/<slug>`
- Prefix mapping:
  - `feature` -> `feat`
  - `bugfix` -> `fix`
  - `refactor` -> `refactor`
  - `docs` -> `docs`
  - `chore` -> `chore`
  - `test` -> `test`
- Slug rules:
  - lowercase only
  - words separated by `-`
  - keep 2-6 words when possible
  - avoid vague words: `update`, `misc`, `changes`
  - avoid issue IDs unless user requests them

## Step 4: Validate and rank

- Output 3 candidates by default, ordered from best to acceptable.
- Validate each candidate:
  - <= 48 characters preferred (hard max 63)
  - no spaces, no underscores, no trailing slash
  - reflects actual diff intent
- If intent is ambiguous, include one neutral fallback:
  - `chore/<area>-cleanup`

## Step 5: Output format

- Default: output **two versions**
  - 简体中文
  - English
- If user requests single language, output only requested language.
- **Hard rule:** in dual-language output, Chinese and English must be placed in two independent code blocks. Do not mix two languages in one code block.
- In dual-language output, add plain-text language label lines (`中文` / `English`) immediately above each corresponding code block.
- Output should include:
  - `Recommended:` one best branch name
  - `Alternatives:` two additional candidates
  - optional one-line rationale per candidate

## Example output (reference)

中文

```text
Recommended: fix/auth-token-refresh-race
Alternatives:
- fix/auth-refresh-lock
- refactor/auth-token-renewal-flow
```

English

```text
Recommended: fix/auth-token-refresh-race
Alternatives:
- fix/auth-refresh-lock
- refactor/auth-token-renewal-flow
```

## Conventions

- Do not fabricate intent beyond actual changes.
- Prefer domain terms already present in file paths/symbol names.
- Keep names readable for both humans and CI tooling.
