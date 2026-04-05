# Idioms

## Core Principle

Every language community converges on conventions that signal "this code was written by someone who knows the language." Idiomatic code is easier to read, review, and maintain because it matches what other developers in the ecosystem expect.

## Iteration

- **Use for-of / for-in / range-based for** instead of C-style index loops when the index is not needed.
- **Use `.forEach` / `.map` / `.filter` only when the result is used.** Do not use `.map` for side effects — use a `for` loop.
- **Use `.entries()` when both index and value are needed** instead of manual counter variables.
- **Use generators / yield** for lazy sequence production instead of building a full array then returning it.
- **Use language-native comprehensions** (Python list/dict/set comprehensions, Rust `.iter().map().collect()`, Kotlin `.map {}`) instead of imperative accumulation when the result is a transformed collection.

## Data Construction

- **Use object/array spread** instead of `Object.assign` or manual copy loops (JS/TS).
- **Use builder patterns or named constructors** instead of long positional argument lists (Go struct literals, Kotlin `data class copy`, Rust struct update syntax).
- **Use data classes / records / structs** instead of plain maps/dicts for structured data with known fields.
- **Use enums** for fixed sets of related constants instead of magic strings or numbers.

## Functional Patterns

- **Use pure functions** where possible — same input, same output, no side effects.
- **Use function composition / pipe** when chaining multiple transformations, if the language supports it (Elixir `|>`, F# `|>`, Rust `.iter()` chains, JS pipeline proposal with helper).
- **Prefer map/filter/reduce over imperative loops** for data transformation — but only when the result is clearer. A complex `.reduce` is worse than a clear `for` loop.
- **Use closures to capture context** instead of passing extra arguments through multiple layers when the language supports it naturally.

## Error and Null Handling

- **Use Option/Result/Maybe types** instead of returning `null`/`nil`/`None` from functions that may fail (Rust, Swift, Kotlin, Scala, Haskell).
- **Use guard clauses** instead of wrapping entire function bodies in null checks.
- **Use early return for error paths** — keep the happy path at the lowest indentation level.
- **Replace sentinel values** (e.g., `-1` for "not found", `""` for "missing") with proper optional types or dedicated "not found" returns.

## String and Template Handling

- **Use template literals / f-strings / string interpolation** instead of concatenation.
- **Use tagged templates or format functions** for complex string building (SQL, HTML, log messages) instead of manual escaping and concatenation.
- **Use multi-line string syntax** (template literals, triple quotes, raw strings) instead of concatenating line-by-line.

## Class and Module Organization

- **Use modules / namespaces / packages** instead of class-as-namespace with only static methods.
- **Use standalone functions** instead of utility classes with no state (Java/C# excepted where the language requires a class wrapper).
- **Use computed/derived properties** instead of manual getter methods that just return a field.
- **Use constructors / factory functions** that validate inputs instead of allowing invalid construction followed by `.init()` or `.validate()` calls.

## Testing Idioms

- **Use language-native test assertions** instead of raw `if` + `throw`.
- **Use table-driven / parameterized tests** for multiple input/output pairs instead of copy-pasting test cases.
- **Use test fixtures / setup-teardown hooks** instead of duplicating setup code in every test.

## Decision Rules

1. **Follow the community, not personal preference.** If the language community convention (official style guide, standard library usage, linter defaults) conflicts with personal taste, use the community convention.
2. **Do not idiom-ify code that crosses language boundaries** (e.g., FFI, generated code, wire format structs). These need to match the external contract, not look idiomatic.
3. **When two idiomatic options exist, choose the one used more frequently in the current codebase** for consistency.
