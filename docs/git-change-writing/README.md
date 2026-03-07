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
4. **Shared references** - Do changes need to propagate to `_shared/` files?

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
