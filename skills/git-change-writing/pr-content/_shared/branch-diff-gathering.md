# Branch Diff Gathering

Collect branch-level change context.

## Basic Principle

**Prefer branch-level diff**: compare current branch against a base branch.

## Base Branch Resolution Priority

1. User-specified base branch (e.g., `--base release/2026Q1` or explicit in request text)
2. `main`
3. `master`

If neither `main` nor `master` exists and no base is provided, ask user to specify base branch.

## Special Cases

### Current Branch Equals Base Branch

If current branch equals resolved base branch and local commits are ahead of upstream:
- Use upstream tracking point as effective baseline (e.g., `@{upstream}`)
- Treat local ahead commits as effective diff content
- Compute range: `git diff @{upstream}...HEAD`

If current branch equals base branch but no upstream tracking exists:
- Ask user to provide explicit comparison ref (e.g., `origin/main`, tag, or SHA)

### Including Uncommitted Changes

Only when user explicitly requests to include uncommitted work:
- Additionally read `git diff --cached` and/or `git diff`
- Append working tree deltas as additive context
- Mark `source: mixed`

## Collection Steps

1. **File-level summary**
   ```bash
   git diff <effective_base>...HEAD --stat
   ```

2. **Commit history intent**
   ```bash
   git log --oneline <effective_base>..HEAD
   ```

3. **Relevant diff details** (as needed)
   - Read relevant diff details from `<effective_base>...HEAD`
   - Prefer `--stat` + targeted excerpts over massive full-file dumps

## Failure Handling

- If branch diff is empty (`<base>...HEAD` has no changes), stop and ask user to confirm target base branch
- If context conflicts with user-stated intent, prioritize factual diff and present one neutral alternative output

## Effective Baseline Computation

```
effective_base =
  if current_branch == base_branch and has_upstream:
    @{upstream}
  else if current_branch == base_branch and no_upstream:
    ask_user_for_explicit_ref
  else:
    base_branch
```

## Notes

- Compute branch diff from merge-base: `git diff <base>...HEAD` (equivalent to diffing from merge-base to `HEAD`)
- Mention base branch only as internal baseline for analysis, not in PR summary narrative
- Keep statements grounded in actual branch diffs and commits
