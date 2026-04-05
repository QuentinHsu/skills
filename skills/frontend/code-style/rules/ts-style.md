# TypeScript Style Guide

## Core Principle

Optimize for readability, type safety, and long-term maintainability over terseness.

If a shorter expression adds nesting, merges multiple decisions, or hides the data shape, do not use it.

## Non-Negotiables

- Do not use `any`.
- Do not use non-null assertions (`!`) unless the value was checked in the same branch or created in the same expression.
- Do not stack multiple control-flow tricks in one expression.
- Prefer explicit names over compressed cleverness.
- Prefer modeling invalid states out of the type system instead of checking them repeatedly at runtime.
- Do not use assertions to skip proper typing when the type can be modeled or narrowed directly.

## Control Flow

- Prefer guard clauses over deep `if / else` nesting.
- Keep branches flat.
- Use ternaries only when both branches are single expressions and the full ternary fits on one line.
- If a branch contains another branch, extract a variable, helper, or separate function.

Prefer:

```ts
if (!user) {
  return null;
}

return formatUser(user);
```

Over:

```ts
if (user) {
  return formatUser(user);
} else {
  return null;
}
```

## Types

- Prefer `type` for unions and local data shapes.
- Use `interface` when extension or declaration merging is part of the design.
- Add explicit return types when a function returns a union, an object literal, a promise, or a widened literal type.
- Use inference for local primitives and direct expressions.
- Prefer discriminated unions over optional-property soup for stateful variants.
- At untyped boundaries, use `unknown` first, then narrow safely.
- Prefer `satisfies` for config objects when you want validation without widening.
- Prefer `as const` for literal maps and fixed option collections.
- Prefer `readonly` data shapes when mutation is not intended.
- Use generics only when a type parameter is reused, constrained, or propagated to the return type.
- Complete the type model instead of leaving gaps that force downstream guessing.

Prefer:

```ts
type RequestState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: User[] }
  | { status: "error"; message: string };
```

Over:

```ts
type RequestState = {
  loading?: boolean;
  data?: User[];
  error?: string;
};
```

## Expressions and Operators

- Prefer `??` over `||` when `0`, `false`, or empty string are valid values.
- Prefer optional chaining only when it truly represents an optional boundary.
- Avoid more than two chained null-safe accesses in one expression. Split the path with a named variable.
- Prefer explicit comparisons when truthiness is ambiguous.

Prefer:

```ts
const pageSize = input.pageSize ?? 20;
```

Over:

```ts
const pageSize = input.pageSize || 20;
```

## Functions

- Keep functions focused on one job.
- Name functions by intent, not by internal mechanics.
- Prefer small pure helpers over duplicated inline transformations.
- Avoid more than three positional parameters. Replace trailing parameters with a named object.

## Naming

- Name variables by intent, not by implementation detail.
- Prefer domain words over generic names like `data`, `item`, and `value` when a better name exists.
- Use nouns for data, verbs for actions, and adjective or boolean prefixes for flags.
- Name booleans with `is`, `has`, `can`, or `should` when possible.

## Comments

- Write comments for intent, business rules, or tradeoffs that are not visible from the code shape alone.
- Do not comment what the syntax already says.
- If code needs many explanatory comments, simplify the code first.

## Modern Defaults

- Prefer `const` by default.
- Prefer immutable updates.
- Prefer direct control flow and explicit data shapes over abstractions that hide branching or types.
- Optimize for teammate comprehension on first read.

## Review Checklist

When reviewing TypeScript, flag these first:

- `any`, unsafe assertions, and non-null assertions
- types that allow impossible states
- missing or vague types where the code shape is knowable
- deeply nested branching
- ambiguous truthiness checks
- generics that add complexity without safety
- repeated inline transformations that should be helpers

## Decision Rule

When two implementations are both correct, choose the one with fewer branches, fewer assertions, and fewer widened types.
