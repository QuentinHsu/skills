# Language Features

## Core Principle

Use the most expressive feature the target version provides. Newer features exist because the old way had friction — less boilerplate, fewer bugs, clearer intent.

## Variable Declarations and Scoping

- **Replace function-scoped variables with block-scoped ones.** `var` → `let` / `const` (JS/TS). Equivalent in other languages: prefer the narrowest scope available.
- **Prefer immutable bindings by default.** `const` (JS/TS), `val` (Kotlin), `let` (Rust/Swift), `final` (Java/Dart). Use mutable only when reassignment is needed.
- **Hoist declarations to their narrowest scope.** A variable used only inside a branch should be declared inside that branch.

## Destructuring and Pattern Matching

- **Destructure objects and arrays** at the assignment or parameter level when accessing 2+ properties.
- **Use pattern matching / `match` / `when`** instead of switch or if-else chains on a discriminant, when available (Python 3.10+, Rust, Kotlin, C# 8+, Ruby, Elixir).
- **Use rest/spread syntax** to collect or merge collections instead of manual iteration or `Object.assign` / `Array.prototype.concat`.

Prefer:

```js
const { name, age } = user
const [first, ...rest] = items
```

Over:

```js
const name = user.name
const age = user.age
const first = items[0]
const rest = items.slice(1)
```

## Optional and Null-Safe Access

- **Use optional chaining** (`?.`) instead of manual null checks for property access chains.
- **Use nullish coalescing** (`??`) instead of `||` when `0`, `false`, or `""` are valid values.
- **Use optional types / Option / Maybe** instead of sentinel values (`-1`, `""`, `null`) when the language has them (Rust `Option`, Swift `Optional`, Kotlin `?`).

## Modern Collection and String Operations

- **Replace utility-library functions with built-in equivalents** when the target version provides them:
  - `_.cloneDeep` → `structuredClone`
  - `_.groupBy` → `Object.groupBy` / `Map.groupBy`
  - `_.flatten` → `Array.flat()`
  - `lodash.get` → optional chaining
  - `moment` → `Intl.DateTimeFormat` / `Temporal` (when available)
- **Use `.at()` for index-from-end access** instead of `arr[arr.length - 1]`.
- **Use template literals / f-strings / string interpolation** instead of concatenation.
- **Use `.includes()` instead of `.indexOf() !== -1`**.

## Type Features

- **Use `satisfies`** (TypeScript 4.9+) for validating object shapes without widening.
- **Use `as const`** for literal tuples and fixed option maps.
- **Use type predicates / narrowing** instead of raw casts.
- **Use records / data classes / case classes** instead of manual `equals`/`hashCode`/`toString` boilerplate (Java 16+, Kotlin, Scala, C# 9+, Python `@dataclass`).
- **Use sealed types / exhaustive matching** to model closed variant sets.

## Error Handling

- **Use `Error` cause chaining** (`new Error(msg, { cause })` in JS, exception chaining in Python/Java/Rust) instead of discarding the original error.
- **Use `using` / `with` / `defer` / RAII** for resource management instead of manual try/finally.

## Declaration Syntax

- **Use arrow functions / lambda syntax** for inline callbacks and small functions (JS/TS, Kotlin, Swift, Rust closures).
- **Use shorthand property names** when variable name matches key name.
- **Use computed property names** instead of post-assignment mutation.
- **Use class fields / property initializers** instead of constructor-only assignments when the language supports them.

## Decision Rules

1. **Check the target version first.** Do not use a feature the project cannot use. When in doubt, check the config (tsconfig `target`, pyproject `requires-python`, `go.mod` go directive).
2. **Each replacement should be one-to-one.** If "modernizing" a pattern requires three new concepts, it is not simpler — leave it.
3. **Do not replace working utility-library calls with built-ins if the built-in has different edge-case behavior.** Verify parity first.
