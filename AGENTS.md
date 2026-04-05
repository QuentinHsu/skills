# AGENTS

## Repository intent

This repository stores **agent skills as executable behavior definitions**.
Files under `skills/**/SKILL.md` and their shared rule files are part of shipped capability, not passive reference docs.
Treat these Markdown files as **behavior code**: changes to prompts, rules, decision logic, examples that constrain output, or invocation guidance should be classified by behavior impact, not by file extension.

## Commit type guidance

When changes modify skill behavior, output constraints, invocation rules, decision logic, reusable rules, or examples that shape delivered behavior, classify them like code changes:

- prefer `feat` for new or expanded skill capability
- prefer `fix` for correcting incorrect skill behavior or output
- prefer `refactor` for structural rewrites without behavior change
- prefer `perf` only when the change clearly improves execution efficiency, token usage, or latency
- use `test` for evaluation or verification artifacts that validate skill behavior
- use `docs` only for repository-facing explanatory content that does not change delivered skill behavior
- reserve `docs` for repository-facing explanatory content such as `README*` and `docs/**`

## Bilingual output rule

For bilingual output requirements:

- content under `中文` must be written in Simplified Chinese
- content under `English` must be written in English
- the two versions must be composed independently in their respective languages
- do not copy one version and merely relabel it as the other language

## Scope note for git-change-writing skills

In `skills/git-change-writing/**`, changes to prompts, rules, examples, or shared output constraints usually affect delivered skill behavior. Do not default to `docs` just because the file extension is `.md`; classify them by behavior impact first.
