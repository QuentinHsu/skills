# Git Change Writing Skills

Design principles and shared guidelines for the `skills/git-change-writing/` skill set.

中文版本：[`README.zh-CN.md`](README.zh-CN.md)

## Overview

This skill set helps generate Git-related writing artifacts (branch names, commit messages, PR content) from code changes. The skills are designed to work together efficiently by sharing context and following consistent patterns.

**Skills in this set:**
- `branch-name` - Generate branch names from changes
- `commit-message` - Generate conventional commit messages
- `pr-content` - Generate PR title and description
- `change-pack` - Generate all three from one shared context

## Design Principles

### 1. Read Once, Use Many Times

**Why:** Reading and analyzing diffs is expensive (tokens + time).

**How:** Build a shared `DIFF_CONTEXT` once, then reuse it across all outputs. The `change-pack` skill demonstrates this pattern by generating branch name, commit message, and PR content from a single diff analysis.

**Shared mechanism:** The `_shared/` directory contains reusable reference files:
- `context-reuse.md` - Context reuse protocol
- `branch-diff-gathering.md` - How to collect branch-level changes
- `bilingual-output.md` - Bilingual output formatting
- `pr-heading-map.md` - Type-specific PR section headings
- `type-classification.md` - Shared rules for choosing `feat|perf|fix|refactor|...`

### 2. Branch-Level Diff First

**Why:** PRs are about branch changes, not just staged files. Branch-level diff gives the full picture of what's changing.

**How:** Compare current branch against a base branch (user-specified → `main` → `master`).

**Special case:** If current branch equals base branch but has local commits ahead of upstream, use the upstream tracking point as baseline. This handles the common workflow where you're on `main` but ahead of `origin/main`.

### 3. Copy-Ready Outputs

**Why:** Users want to paste directly into Git/GitHub without reformatting.

**How:**
- Every output is wrapped in a code block
- PR Title and PR Description are separate blocks (GitHub has two input fields)
- Bilingual outputs use independent blocks for each language

### 4. Explain Why, Not Just What

**Why:** Modern LLMs understand reasoning better than rigid rules. Explaining why constraints exist helps the model make better decisions in edge cases.

**How:** Instead of "Must use lowercase" → "Use lowercase (easier to type, avoids case-sensitivity issues)"

### 5. Semantic Alignment Across Outputs

**Why:** Branch name, commit type, and PR type should tell a coherent story.

**How:** Extract domain keywords (`terms`) from the diff and reuse them across all three outputs. If the intent is `fix`, the branch prefix should be `fix/`, commit type should be `fix`, and PR type should be `fix`.

### 6. Classify by User Value, Not Surface Area

**Why:** A large diff or visible UI change does not automatically mean `feat`. The type should reflect the main value delivered to the user.

**How:** Use the shared rules in `_shared/type-classification.md`.

Practical bias:
- `feat` = users can do something meaningfully new
- `perf` = users do the same thing with less friction, better speed, or better UI/UX
- `fix` = something incorrect is restored to intended behavior
- `refactor` = mainly internal cleanup with no meaningful product-level change

Important UI/UX boundary:
- A UI-only or interaction-only improvement that does **not** add a new capability should usually be classified as `perf`
- A UI change that unlocks a new workflow, option, or use case should be classified as `feat`
- A UI change that primarily repairs broken behavior should be classified as `fix`

## DIFF_CONTEXT Structure

A compact, structured summary of changes that can be reused across multiple outputs.

**Recommended fields:**
- `source`: `branch` | `staged` | `mixed`
- `base_branch`: comparison baseline
- `range`: effective diff range (e.g., `main...HEAD`)
- `files`: changed files or modules
- `summary`: 1-3 line high-level statement
- `intent`: `feat|fix|refactor|docs|chore|test|perf`
- `highlights`: 2-6 factual bullets (what + why)
- `risk`: optional compatibility/behavior risks
- `breaking_change`: optional boolean + description
- `issues`: optional issue references (only when explicitly provided)
- `terms`: domain keywords for naming consistency

**Why this structure:** Compact enough to fit in context (≤ 220 lines recommended), but rich enough to generate all three outputs without re-reading the diff.

## Change Type Classification

All skills in this set should use `_shared/type-classification.md` when inferring primary change intent.

Recommended decision order:
1. Is it mainly restoring broken behavior? → `fix`
2. Does it add a net-new capability, option, or workflow? → `feat`
3. Does it keep the same capability but improve speed, smoothness, clarity, or interaction quality? → `perf`
4. Is it mainly structural cleanup without meaningful user-facing change? → `refactor`

Examples:
- Add a new export format → `feat`
- Reduce an existing export flow from 4 clicks to 2 → `perf`
- Fix export returning wrong data → `fix`
- Split export logic into smaller modules with no visible change → `refactor`

Counterexamples to keep in mind:
- A new button for an already existing action is usually `perf`, not `feat`
- A major internal rewrite with visibly faster UX may still be `perf`, not `refactor`
- A smoother interaction that mainly repairs broken behavior is usually `fix`, not `perf`

### Quick Decision Tree

Use this compact flow when the type is ambiguous:

1. Was something broken or regressed before? → `fix`
2. If not, does the change add a net-new capability, option, or workflow? → `feat`
3. If not, does it make the same task faster, smoother, clearer, or easier? → `perf`
4. If not, is the main value internal cleanup or restructuring? → `refactor`

This decision tree is intentionally simple. It is meant to bias the model toward stable choices in borderline cases, especially where UI/UX work is easy to over-label as `feat`.

### Output Contrast Examples

These examples help translate the classification into better commit/PR wording.

**Example: same capability, better UX**

Wrong:

```text
feat(checkout): redesign checkout flow
```

Better:

```text
perf(checkout): streamline checkout flow feedback
```

Why: the checkout capability already existed; the value is reduced friction.

**Example: new reusable workflow**

Wrong:

```text
perf(search): improve preset workflow
```

Better:

```text
feat(search): support reusable saved presets
```

Why: reusable saved presets are a new user capability.

**Example: broken behavior restored**

Wrong:

```text
perf(filters): improve filter persistence
```

Better:

```text
fix(filters): preserve state after navigation
```

Why: the main value is correctness, not polish.

**Example: deep rewrite with user-visible speed gain**

Wrong:

```text
refactor(table): rewrite render pipeline
```

Better:

```text
perf(table): reduce scroll jank in large datasets
```

Why: users primarily feel the performance improvement.

### Misleading Wording Hints

Be careful with words that sound like a type label but often are not sufficient on their own.

- `redesign`, `revamp`, `add button`, `enhance UI` do **not** automatically mean `feat`
- `improve`, `optimize`, `streamline` do **not** automatically mean `perf`
- `rewrite`, `rework`, `replace architecture` do **not** automatically mean `refactor`
- `fix UX`, `correct flow`, `improve validation` do **not** automatically mean `fix`

Preferred correction:
- ignore the loaded verb first
- restate the change in neutral language
- classify based on user outcome: new capability, better experience, restored correctness, or internal cleanup

Example:
- `redesign checkout` → ask whether checkout does something new or just feels better
- `rewrite rendering pipeline` → ask whether users mainly gain speed, correctness, or no visible change

## Language Behavior

**Default:** Output both Simplified Chinese and English versions (semantically aligned, not word-for-word translation).

**Override:** If user explicitly requests single language, output only that language.

**Why bilingual by default:** Many teams work in mixed-language environments. Providing both versions saves the user from having to ask twice.

**Format:** Each language gets its own code block with a language label (`中文` or `English`) immediately above it.

## Token Efficiency Guidelines

- Prefer `git diff --stat` + targeted excerpts over full file dumps
- Summarize raw diff once into `DIFF_CONTEXT`, then reuse
- Keep `DIFF_CONTEXT` concise (≤ 220 lines recommended)
- Avoid duplicate explanations across branch/commit/PR outputs

**Why:** These skills may be used hundreds of times per day. Token efficiency directly impacts cost and speed.

## Maintenance Guidelines

When modifying any skill in this set, verify:

1. **Context reuse consistency** - Does Step 0 still follow the same pattern?
2. **Output structure consistency** - Are code blocks still copy-ready?
3. **Language behavior consistency** - Does bilingual output still work the same way?
4. **Type classification consistency** - Do `branch-name`, `commit-message`, `pr-content`, and `change-pack` still classify intent using the same logic?
5. **Shared references** - Do changes need to propagate to `_shared/` files?

**Why these checks:** The skills are designed to work together. Inconsistencies create confusion and reduce the value of the skill set.

## Examples

### Individual Skills

```bash
# Generate branch name only
User: "给这个分支起个名字"
→ Uses branch-name skill

# Generate commit message only
User: "生成 commit message"
→ Uses commit-message skill

# Generate PR content only
User: "写个 PR 描述"
→ Uses pr-content skill
```

### Chained Generation (Most Efficient)

```bash
# Generate all three from one diff analysis
User: "一口气生成分支名、commit、PR"
→ Uses change-pack skill
→ Reads diff once, generates all three outputs
→ Saves ~60% tokens compared to calling three skills separately
```

## Related Documentation

- [Skills Index](../skills.md) - Overview of all available skills
- [Skills Index (中文)](../skills.zh-CN.md) - 所有技能概览
