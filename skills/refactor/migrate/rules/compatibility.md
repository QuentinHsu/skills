# Compatibility

## Core Principle

When a dependency or runtime upgrade changes behavior — even subtly — detect the difference and decide whether to adapt the code or pin the old behavior explicitly. Never let a behavioral change slip in unnoticed.

## Behavioral Changes

### Detect Silent Changes

- **Changed defaults.** A library may change default timeout, encoding, sorting, or strictness between versions. Audit the changelog for "default is now X" entries and compare against the project's assumptions.
- **Changed return types.** A function that returned `null` may now return `undefined`, or vice versa. A function that returned a plain object may now return a class instance. Check downstream comparisons and type checks.
- **Changed error types or messages.** Catch blocks that match on error class or message string may stop matching. Audit all catch/error-handling code that interacts with the migrated dependency.
- **Changed ordering guarantees.** Maps, iteration, or query results that previously had implicit ordering may no longer guarantee it.

### Adapt or Pin

- **Adapt** when the new behavior is correct or preferable. Update the code to work with the new default.
- **Pin** the old behavior when changing it would alter user-facing behavior or break contracts. Set the option explicitly to the previous default value.
- **Document** the choice with a brief comment when the reason is not obvious.

## Type System Changes

- **Added strict null checks.** A generic type that previously accepted `null` may no longer do so. Add explicit null handling or adjust types.
- **Narrowed parameter types.** A parameter that accepted `string | number` may now accept only `string`. Update all call sites passing the removed type.
- **Widened return types.** A function that returned `string` may now return `string | null`. Add null checks at all consumer sites.
- **Removed type exports.** If a type that was previously exported is removed, define a local equivalent or switch to the recommended replacement type.

## Runtime and Language Version Changes

### Node.js / JavaScript

- Check for removed or changed built-in APIs (e.g., `Buffer` constructor, `url.parse` vs. `URL`).
- Check for changed module resolution (CJS ↔ ESM interop changes between Node versions).
- Check for changed `crypto`, `fs`, or `stream` behavior.

### Python

- Check for removed functions in new major versions (e.g., `collections.MutableMapping` moved to `collections.abc`).
- Check for changed string handling, encoding defaults, or `asyncio` API changes.
- Check for changed `typing` module features across versions.

### Go

- Check for changed module behavior, `go:embed` rules, or standard library API additions that replace third-party packages.
- Check for changed error wrapping or `context` usage conventions.

### General (Any Runtime)

- Check for stricter security defaults (TLS versions, cookie policies, CORS).
- Check for changed file system or network behavior.
- Check for removed CLI flags or environment variable names.

## Incremental Migration Strategy

When the migration surface is large and cannot be completed in one pass:

1. **Introduce an adapter layer** that wraps the new API behind the old interface.
2. **Migrate call sites incrementally** from the old direct usage to the adapter, then from the adapter to the new API directly.
3. **Track migration progress.** Keep a list of remaining old-API call sites and remove the adapter only when the count reaches zero.
4. **Set a deadline.** Adapter layers that linger become permanent tech debt. Define when the adapter will be removed.

## Decision Rules

1. **Behavioral changes need tests, not just compilation.** A project that builds successfully after a bump may still behave differently. Run the full test suite and examine output-sensitive tests carefully.
2. **When in doubt, pin the old behavior explicitly.** It is safer to opt out of a new default and revisit later than to discover a silent regression in production.
3. **Do not mix migration and feature work.** If the new version enables new capabilities, add those in a separate change after the migration is stable.
