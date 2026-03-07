# Context Reuse Protocol

**Priority order:**

1. If `DIFF_CONTEXT` is already provided by upstream, use it directly
2. If only `RAW_DIFF` is provided, summarize it once into `DIFF_CONTEXT`
3. Only read from Git when context is missing, stale, or clearly incomplete

**Why:** Avoid repeated full-diff reads to save tokens and time.

## DIFF_CONTEXT Structure

Recommended fields:

- `source`: `branch` | `staged` | `mixed`
- `base_branch`: comparison baseline branch
- `range`: effective diff range, e.g. `<base>...HEAD` (optional but recommended)
- `files`: changed file list or grouped modules
- `summary`: concise high-level change statement (1-3 lines)
- `intent`: one of `feat` / `fix` / `refactor` / `docs` / `chore` / `test` / `perf`
- `highlights`: 2-6 factual bullets (what changed + why)
- `risk`: optional compatibility/behavior risks
- `breaking_change`: optional boolean + description
- `issues`: optional issue references (only when explicitly provided)
- `terms`: domain keywords from paths/symbols for naming consistency

## Usage Guidelines

- At workflow start, check if `DIFF_CONTEXT` or `RAW_DIFF` is already available
- If available, skip Git command execution and use provided context directly
- If reading from Git is needed, build `DIFF_CONTEXT` immediately for downstream reuse
- Keep `DIFF_CONTEXT` compact (recommended ≤ 220 lines equivalent text)
