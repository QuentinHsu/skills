---
name: branch-name
description: "Suggest Git branch names from the current changes against a base branch. Use when the user wants to name, create, or rename a branch based on their work, e.g. '生成分支名', '给这个分支起个名字', 'suggest a branch name', 'name this branch'."
metadata:
  author: QuentinHsu
  version: "2026.11.19"
---

# Branch Name

Generate clean, team-friendly Git branch names based on current code changes.

## Context Reuse (Step 0)

See [_shared/context-reuse.md](./_shared/context-reuse.md) for the context reuse protocol.

If `DIFF_CONTEXT` or `RAW_DIFF` is already provided, use it directly to save time and tokens.

## Gather Change Context (Step 1)

See [_shared/branch-diff-gathering.md](./_shared/branch-diff-gathering.md) for branch diff collection details.

Use **branch-level diff** as primary source (compare current branch against base branch). This gives you the full picture of what's changing.

Optionally read commit history to improve intent inference across multiple commits.

## Infer Intent and Type (Step 2)

Classify by primary user-facing value following [_shared/type-classification.md](./_shared/type-classification.md), then map to the branch intent:
- `feature` (new capability)
- `bugfix` (defect fix)
- `performance` (same capability, better experience / UI / interaction)
- `refactor` (internal restructuring)
- `docs` (documentation)
- `chore` (maintenance/tooling)
- `test` (tests only)


Extract 2-5 keywords from modified modules, entities, or behavior. These keywords will form the branch name slug.

## Build Naming Candidates (Step 3)

Use slash style prefix by default: `<prefix>/<slug>`

**Prefix mapping:**
- `feature` → `feat`
- `bugfix` → `fix`
- `performance` → `perf`
- `refactor` → `refactor`
- `docs` → `docs`
- `chore` → `chore`
- `test` → `test`

**Slug guidelines:**
- lowercase only (easier to type, avoids case-sensitivity issues)
- words separated by `-` (standard Git convention)
- keep 2-6 words when possible (balance between clarity and brevity)
- avoid vague words like `update`, `misc`, `changes` (not descriptive)
- avoid issue IDs unless user requests them (IDs are better in commits/PRs)

**Why these guidelines:**
- Lowercase avoids confusion on case-sensitive filesystems
- Hyphens are the Git community standard (not underscores or camelCase)
- Descriptive slugs help teammates understand branches at a glance
- Short names are easier to type and fit better in Git UIs

## Validate and Rank (Step 4)

Output 3 candidates by default, ordered from best to acceptable.

**Validation:**
- ≤ 48 characters preferred (hard max 63 due to filesystem limits)
- no spaces, no underscores, no trailing slash
- reflects actual diff intent

If intent is ambiguous, include one neutral fallback like `chore/<area>-cleanup`.

## Output Format (Step 5)

Branch names are always English tokens — output **English only** (no bilingual output needed).

**Output structure:**
- `Recommended` label above the best branch name
- `Alternative 1` and `Alternative 2` labels above the two additional candidates
- optional one-line rationale per candidate
- Wrap each branch name candidate in its own `text` code block for direct copying
- Output exactly three branch name code blocks by default
- Keep labels outside code blocks so copying a block copies only the branch name

## Example Output

Recommended

```text
fix/auth-token-refresh-race
```

Alternative 1

```text
fix/auth-refresh-lock
```

Alternative 2

```text
refactor/auth-token-renewal-flow
```

## Conventions

- Do not fabricate intent beyond actual changes
- Prefer domain terms already present in file paths/symbol names (maintains consistency with codebase)
- Keep names readable for both humans and CI tooling
