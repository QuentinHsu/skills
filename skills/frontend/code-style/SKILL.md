---
name: code-style
description: Apply frontend code style rules for TypeScript, TSX, DOM structure, and accessibility. Use this skill when creating, refactoring, reviewing, or standardizing frontend code, especially when the user asks for cleaner TS/TSX, better typing, stricter JSX structure, or accessible HTML and DOM markup. Trigger on requests like '写个前端 code style', '规范一下 TS/TSX 写法', 'avoid nested ternary', 'review this component style', 'add accessibility rules', or 'standardize DOM a11y attributes'.
metadata:
  author: QuentinHsu
  version: "2026.03.20"
---

# Code Style

Apply a readability-first frontend code style guide for TypeScript, TSX, and DOM accessibility.

Detailed rules live in:

- [rules/ts-style.md](./rules/ts-style.md)
- [rules/tsx-style.md](./rules/tsx-style.md)
- [rules/dom-a11y-style.md](./rules/dom-a11y-style.md)

## When To Use

Use this skill when the task involves:

- writing or refactoring TypeScript frontend code
- writing or refactoring React TSX components
- reviewing JSX and DOM markup quality
- enforcing accessibility-related code rules in HTML or TSX
- defining or standardizing frontend code conventions

## Working Mode

1. Apply the TypeScript rules first.
2. Apply the TSX structure rules for component rendering.
3. Apply the DOM accessibility rules for rendered HTML and interactive elements.
4. Keep the scope on code style and markup quality, not project architecture or framework-specific folder conventions.

## Default Output Expectations

- Produce code that follows the style guide.
- Preserve behavior while reducing ambiguity in control flow, types, and markup.
- When reviewing, call out concrete rule violations with direct rewrites.
- When the user asks for a convention document, summarize the rules as enforceable code-writing guidance.
