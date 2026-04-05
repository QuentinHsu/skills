# Naming and Readability

## Core Principle

A reader should understand what code does without reading its implementation. Names carry intent; structure carries flow.

## Naming

### General Rules

- **Name things for what they represent, not how they are computed.** `remainingRetries` over `count`. `isEligible` over `flag2`.
- **Use domain terms.** If the codebase or business domain has a name for a concept, use it instead of inventing a synonym.
- **Avoid abbreviations** unless universally understood in the domain (`id`, `url`, `http`, `db`, `config` are fine; `mgr`, `svc`, `proc`, `val`, `btn` are not).
- **Avoid generic names.** `data`, `info`, `item`, `value`, `result`, `temp`, `obj`, `thing` — these say nothing about intent. Qualify them: `userData`, `paymentResult`, `tempFilePath`.
- **Boolean names should read as a yes/no question.** `isVisible`, `hasPermission`, `canRetry`, `shouldRefresh`. Avoid `visible` as a boolean name when it could be confused with a CSS value or enum.
- **Function names should describe the action and its target.** `fetchUserProfile`, `calculateTax`, `validateEmail`. Avoid noise-word prefixes: `doProcess`, `handleStuff`, `performAction`.
- **Avoid names that differ only by number or case.** `item1`/`item2`, `User`/`user` in the same scope. Each name should be distinguishable at a glance.

### Scope-Proportional Length

- **Short-lived loop variables** in tiny scopes (≤5 lines) may use short names: `i`, `j`, `x`. Beyond that, use descriptive names.
- **Function-scoped variables** should use 1-3 word names that describe their content.
- **Module-level or exported symbols** should use precise, unambiguous names — even if longer.

### Rename Signals

Rename when any of these apply:

- The name requires a comment to explain what it holds.
- The name does not match what the variable actually contains after a code change.
- Two variables in the same scope could be confused with each other.
- A reader would need to look at the assignment to understand the purpose.

## Readability Structure

### Extract Explanatory Variables

- When a condition or expression is complex (3+ terms, nested calls, or chained operations), extract it into a named variable that states the intent.

Prefer:

```
isWeekendDiscount = dayOfWeek in (SATURDAY, SUNDAY) and cart.total > minAmount
if isWeekendDiscount:
```

Over:

```
if dayOfWeek in (SATURDAY, SUNDAY) and cart.total > minAmount:
```

### Extract Explanatory Functions

- When a block of code (5+ lines) performs a coherent sub-task inside a larger function, extract it into a named function — even if called only once — when the name communicates intent better than reading the lines.
- The extracted function should have a name that makes the caller's code read like a summary of the algorithm.

### Ordering Within a File

- **Public/exported API at the top**, internal helpers below. Readers start from the entry points.
- **Group related declarations** together. Do not interleave unrelated functions.
- **Define functions before their first use** when the language allows, to support top-down reading.

### Comments

- **Do not add comments that restate what the code already says.** `i++ // increment i` is noise.
- **Add comments only for why, not what.** Explain non-obvious business rules, workarounds, or constraints that the code alone cannot convey.
- **Remove comments that no longer match the code.** A wrong comment is worse than no comment.

## Decision Rules

1. **If a name needs a comment, the name is wrong.** Rename first.
2. **If an expression needs a comment, extract a named variable or function.** Let the name be the comment.
3. **If the reader must scroll back to remember what a variable holds, the name is too vague.** Rename it.
4. **Do not rename for style alone.** Rename only when the current name is misleading, ambiguous, or significantly harder to understand.
