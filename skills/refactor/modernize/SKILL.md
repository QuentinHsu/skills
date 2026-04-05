---
name: refactor-modernize
description: Modernize code by replacing legacy patterns with current language features and idiomatic conventions. Use this skill when rewriting old-style code to use modern syntax, adopting new language features, replacing callbacks with async/await, using pattern matching instead of switch, applying modern iteration, or says things like '用现代写法重写', '替换旧语法', '用 async/await 重写回调', 'modernize this code', 'use modern syntax', 'replace legacy patterns', 'convert to async/await', 'use destructuring', 'apply modern idioms', or 'rewrite with current best practices'. Also trigger when adopting new edition features (Rust editions, Python 3.10+ features, ES2024, etc.).
metadata:
  author: QuentinHsu
  version: "2026.04.05"
---

# Refactor Modernize

Replace legacy patterns and outdated idioms with current language features and conventions — applicable to any language or project.

Detailed rules live in:

- [rules/language-features.md](./rules/language-features.md)
- [rules/async-concurrency.md](./rules/async-concurrency.md)
- [rules/idioms.md](./rules/idioms.md)

## Core Principle

Modernization replaces how code expresses its intent, not what it does. The observable behavior stays the same; the implementation moves to current best practice.

## When To Use

Use this skill when the task involves:

- replacing callbacks, event emitters, or manual promise chains with async/await
- replacing verbose loops with modern iteration (for-of, iterators, comprehensions, streams)
- adopting destructuring, pattern matching, optional chaining, or nullish coalescing
- converting var to let/const, or equivalent scope-tightening in other languages
- replacing class-heavy OOP with simpler functional or data-oriented patterns when the language supports it
- adopting new standard library APIs that replace third-party utilities (e.g., `structuredClone`, `Object.groupBy`, `Array.at`)
- applying new edition or version features (Rust editions, Python 3.10+ match, Go generics, C# records)
- replacing hand-rolled utilities with language built-ins

## Working Mode

1. **Identify baseline.** Determine the project's target language version / runtime version from config files (tsconfig, pyproject, go.mod, Cargo.toml, etc.).
2. **Scan for legacy patterns.** Look for patterns that have a modern equivalent in the target version.
3. **Apply language feature rules.** Replace syntax-level legacy patterns. See [rules/language-features.md](./rules/language-features.md).
4. **Apply async and concurrency rules.** Modernize asynchronous code and concurrency primitives. See [rules/async-concurrency.md](./rules/async-concurrency.md).
5. **Apply idiom rules.** Replace outdated conventions with current idiomatic patterns. See [rules/idioms.md](./rules/idioms.md).
6. **Verify.** Run tests. Modern syntax should produce identical behavior — any test failure signals a semantic mismatch, not just a style issue.

## Boundaries

- Only use features available in the project's declared target version. Do not silently raise the version requirement.
- Do not modernize solely for aesthetics — there should be a readability, safety, or maintainability gain.
- Do not mix modernization with feature work or bug fixes.
- Do not modernize generated code, vendored code, or code the project does not own.
- Do not force a paradigm shift (e.g., OOP → FP) unless the user explicitly asks. Modernize within the existing paradigm.

## Default Output Expectations

- Show before/after for each pattern replacement.
- Name the language feature being adopted (e.g., "ES2022 `Array.at()`", "Python 3.10 structural pattern matching").
- Warn when a modernization depends on a version higher than the project currently targets.
- When multiple patterns exist, prioritize by impact: async modernization first, then type safety, then syntactic sugar.
