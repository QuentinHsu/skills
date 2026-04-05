# Simplification

## Core Principle

Reduce the number of concepts a reader must hold in working memory to understand a block of code. Fewer branches, fewer levels of nesting, shorter dependency chains.

## Flatten Nesting

- **Guard clause over nested else.** If a condition leads to an early exit, return/throw/continue immediately and keep the main logic at the top indentation level.
- **Maximum nesting depth: 3 levels.** If code nests deeper, extract the inner block into a named function or use guard clauses to peel off layers.
- **Invert negative conditions** when doing so removes an else block or reduces nesting.

Prefer:

```
if not valid:
    return error

# main logic at top level
```

Over:

```
if valid:
    # main logic nested
else:
    return error
```

## Simplify Conditionals

- **Collapse redundant boolean expressions.** `if x == true` → `if x`. `if x == false` → `if not x`.
- **Merge consecutive guards** on the same variable into a single compound condition when both guards lead to the same outcome.
- **Replace complex condition chains** with a named boolean variable that expresses the combined intent.
- **Replace if/else that only assigns** a variable with a conditional expression or ternary — but only when both branches are simple single expressions.
- **Replace long if/else-if chains** on the same discriminant with a lookup table (map/dict/object) or pattern match when the language supports it.
- **De Morgan's law.** Prefer the form where the reader does not have to mentally negate a compound condition. `!(a && b)` is harder to parse than `!a || !b` in some cases — choose whichever reads more naturally.

## Reduce Duplication

- **Extract repeated expressions** into a named variable at the nearest shared scope.
- **Extract repeated code blocks** (3+ lines appearing 2+ times with identical or near-identical structure) into a shared function.
- **Parameterize instead of copy.** When two blocks differ by one or two values, extract a function and pass the differing values as parameters.
- **Do not over-DRY.** If two code blocks look similar but serve different concerns and are likely to diverge, duplication is acceptable. The test: would a change in one always require the same change in the other? If not, leave them separate.

## Abstract for Reuse

When multiple code sites share the same structural pattern — not just duplicated lines — consider higher-level abstraction to enable reuse.

### Extract Shared Interface or Contract

- When 2+ implementations perform the same job with different details, extract a shared interface (or protocol / abstract base / trait) that captures the common contract.
- Callers should depend on the interface, not the concrete implementations. This allows substitution and extension without modifying call sites.

### Composition Over Inheritance

- Prefer composing small, focused behaviors (via delegation, mixins, or higher-order functions) over deep inheritance hierarchies.
- If a base class exists only to share code between two subclasses, replace it with a shared utility or injected dependency.

### Strategy and Template Patterns

- When multiple functions follow the same algorithm skeleton but differ in one or two steps, extract the skeleton and let each variant supply its own step.
- Use callbacks, strategy objects, or template methods — whichever is idiomatic in the language.

Prefer:

```
function processRecords(records, formatter):
    for record in records:
        validated = validate(record)
        output = formatter(validated)   # ← varies per caller
        save(output)
```

Over: duplicating the entire loop body in two places with a different format call in the middle.

### Generalize Function Signatures

- If a function operates on a narrow concrete type but its logic only uses a subset of fields, widen the parameter to an interface containing those fields. This unlocks reuse from other call sites without adding complexity.
- Do not over-generalize: only widen when there is a real second caller or an imminent one.

### Create Shared Utilities

- When 3+ call sites need the same operation, promote it to a shared utility module.
- A utility must be pure or near-pure (no hidden side effects), self-contained, and testable in isolation.
- Name the utility after the operation it performs, not the first caller that needed it.

### Abstraction Decision Guards

1. **Do not abstract on the first occurrence.** Wait until there are 2-3 concrete instances to inform the right abstraction boundary.
2. **The wrong abstraction is worse than duplication.** If forcing code into a shared shape requires contortions (extra flags, type switches inside the "shared" code), the abstraction is wrong — revert to duplication.
3. **Abstractions should reduce total code, not just centralize it.** If the abstraction plus its configuration is longer than the duplicated versions, it is not a win.

## Collapse Redundant Wrappers

- **Remove single-use intermediate variables** that add no descriptive value beyond what the expression already says.
- **Inline trivial helper functions** that are called exactly once and whose body is shorter or equal in complexity to the call.
- **Remove delegation chains** where function A calls function B which calls function C and all three share the same signature and do nothing else.
- **Flatten unnecessary nesting containers** — e.g., a list containing a single list, an object wrapping a single object with no added keys.

## Simplify Loops and Iterations

- **Replace manual accumulation loops** with built-in higher-order operations (map, filter, reduce, list comprehension, stream) when the language provides them and the result is shorter and clearer.
- **Extract loop body** into a named function when it exceeds ~10 lines or mixes multiple concerns.
- **Replace index-based iteration** with range-based or for-each when the index is not used.
- **Break out of a loop early** instead of using a flag variable checked after the loop.

## Simplify Error Handling

- **Remove catch blocks that only re-throw** with no wrapping, logging, or context — they add noise.
- **Consolidate identical catch blocks** for different exception types into a multi-catch or union where the language allows.
- **Hoist shared try/catch** to the caller when multiple callees need the same error handling.
- **Do not catch generic exceptions** (e.g., `Exception`, `Error`, `object`) unless at a system boundary. Catch the most specific type.

## Decision Rules

1. **Simpler means fewer concepts to hold, not fewer characters.** A longer but flatter function is simpler than a shorter deeply nested one.
2. **Stop when the next simplification would obscure intent.** If inlining a variable removes a useful name, keep the variable.
3. **Measure nesting depth, branch count, and line count.** If all three decrease or stay neutral, the refactoring is a net win.
