# API Replacement

## Core Principle

Replace every usage of a deprecated or removed API with its recommended successor, preserving the original call's behavior and error semantics.

## Replacement Workflow

### 1. Identify All Usage Sites

- Search the entire codebase (including tests, scripts, and configuration) for the old API.
- Include re-exports, type references, and dynamic/string-based references (e.g., reflection, string-based dispatch).
- Count total usages to gauge scope before starting replacement.

### 2. Map Old API to New API

- Consult the library's migration guide or changelog for the recommended replacement.
- Document the mapping: `oldFunction(args)` → `newFunction(transformedArgs)`.
- Note parameter order changes, renamed options, changed defaults, and return type differences.

### 3. Replace Mechanically

- Apply the same transformation pattern at every call site. Consistency matters — do not mix old and new API in the same codebase unless you are using an incremental migration strategy.
- When the new API has a different signature, update arguments at each call site rather than building a wrapper that makes the new API look like the old one (wrappers become their own tech debt).
- If a codemod or automated migration tool exists for this change, prefer it over manual replacement for large-scale changes.

### 4. Handle Behavioral Differences

- If the new API has different default behavior (e.g., strict mode, different encoding, changed error types), explicitly set the old default at each call site to avoid silent behavior changes.
- If the new API returns a different type (e.g., Promise instead of callback, different collection type), update all downstream consumers.
- If the new API throws different errors or has different failure modes, update corresponding catch blocks and error handling.

## Common Replacement Patterns

### Renamed Function / Method

```
# Old
result = lib.oldName(x, y)

# New
result = lib.newName(x, y)
```

### Changed Options / Config Object

```
# Old
client = createClient({ timeout: 5000 })

# New — option renamed
client = createClient({ requestTimeout: 5000 })
```

### Callback → Promise / Async

```
# Old
fetchData(params, (err, data) => { ... })

# New
const data = await fetchData(params)
```

### Split or Merged API

- When one old function is split into two new ones, determine which new function covers each call site's concern.
- When two old functions are merged into one, consolidate call sites and remove the unused import.

## Decision Rules

1. **Replace, do not wrap.** Adapter wrappers that make the new API look like the old one create perpetual tech debt. Use them only as a temporary bridge during incremental migration, with a tracked removal date.
2. **If no direct replacement exists**, implement the equivalent behavior inline and leave a comment linking to the upstream discussion or issue.
3. **Replace in tests too.** Tests using deprecated APIs will break eventually and provide a false sense of coverage in the meantime.
4. **Verify replacement parity.** After replacing, confirm the new call produces the same outputs for the same inputs, especially at edge cases (null, empty, error paths).
