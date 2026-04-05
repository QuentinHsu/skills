---
name: refactor-clean
description: Perform clean refactoring on any codebase — remove dead code, simplify logic, improve naming, extract abstractions, and reduce complexity without changing behavior. Use this skill when the user asks to clean up code, refactor for readability, reduce complexity, remove unused code, simplify conditionals, flatten nesting, rename for clarity, or says things like '重构一下这段代码', '清理无用代码', '简化逻辑', 'clean up this code', 'refactor for readability', 'reduce complexity', 'remove dead code', 'simplify this function', 'flatten nesting', or 'make this easier to read'. Also trigger when reviewing code quality or performing tech debt cleanup.
metadata:
  author: QuentinHsu
  version: "2026.04.05"
---

# Code Refactor Clean

Behavior-preserving refactoring to improve readability, reduce complexity, and remove waste — applicable to any language or project.

Detailed rules live in:

- [rules/dead-code.md](./rules/dead-code.md)
- [rules/simplification.md](./rules/simplification.md)
- [rules/naming-readability.md](./rules/naming-readability.md)
- [rules/data-structures-performance.md](./rules/data-structures-performance.md)

## Core Principle

Every refactoring must preserve observable behavior. If there are no tests covering the code being changed, flag the risk before proceeding.

## When To Use

Use this skill when the task involves:

- cleaning up or refactoring existing code in any language
- removing dead, unused, or unreachable code
- simplifying overly complex logic or deeply nested structures
- improving names to better express intent
- extracting repeated or entangled logic into focused units
- abstracting similar implementations into reusable patterns
- improving data structure or algorithm choices for performance
- reducing cognitive load without changing what the code does
- tech debt cleanup or code review quality improvements

## Working Mode

1. **Identify scope.** Determine what code region the user wants refactored. If unspecified, analyze the current file or selection.
2. **Assess risk.** Check for test coverage. If the refactoring target lacks tests, warn the user and suggest adding characterization tests first.
3. **Apply dead code rules.** Remove unreachable paths, unused declarations, redundant assignments, and stale comments. See [rules/dead-code.md](./rules/dead-code.md).
4. **Apply simplification rules.** Flatten nesting, simplify conditionals, collapse redundant wrappers, and reduce control-flow complexity. See [rules/simplification.md](./rules/simplification.md).
5. **Apply naming and readability rules.** Rename unclear identifiers, extract explanatory variables, and restructure for scanability. See [rules/naming-readability.md](./rules/naming-readability.md).
6. **Apply data structure and performance rules.** Replace inefficient collection usage, eliminate redundant computation, and choose structures that fit the access pattern. See [rules/data-structures-performance.md](./rules/data-structures-performance.md).
7. **Verify.** After refactoring, confirm that the behavior is unchanged. Run existing tests if available.

## Boundaries

- Do not change public API signatures or observable behavior.
- Do not introduce new dependencies or frameworks.
- Do not refactor test code unless the user explicitly asks.
- Do not add features, logging, or error handling that did not exist before.
- Do not reformat code purely for style (whitespace, semicolons, quotes) — that is a formatter's job.
- Keep each refactoring step small and reviewable. Prefer multiple small changes over one large rewrite.

## Default Output Expectations

- Produce code that is demonstrably simpler or clearer, with no behavior change.
- When reviewing, call out specific problems with concrete rewrites.
- When the scope is large, prioritize high-impact changes: dead code removal first, then simplification, then naming, then performance.
- Explain each change briefly if the refactoring intent is not obvious.
