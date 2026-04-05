# Module Boundaries

## Core Principle

A module should have a single reason to exist and a clear, minimal public API. If you cannot describe what a module does in one sentence without using "and," it owns too many concerns.

## When to Split

- **God module.** One module that every other module imports from. Split by domain concern.
- **Feature envy.** Module A's functions mostly access data owned by Module B. Move the logic to where the data lives.
- **Divergent change.** Multiple unrelated reasons cause the same module to change. Separate the concerns into distinct modules.
- **Shotgun surgery.** A single feature change requires touching many modules. Consolidate the scattered pieces into one cohesive module.

## When to Merge

- **Tiny modules with tight coupling.** If two modules always change together and neither is used independently, merge them into one.
- **Excessive indirection.** If Module A is a thin wrapper that only calls Module B, and no other module uses A's interface, inline A into B or remove it.
- **One-to-one mapping.** A module containing a single function or type that is only used by one other module. Merge into the consumer unless it is a deliberate API boundary.

## How to Split

### 1. Identify Cohesive Groups

- Group functions, types, and constants by the data they operate on or the concern they serve.
- Each group should have high internal cohesion (its parts are tightly related) and low external coupling (it does not need much from other groups).

### 2. Define the Public API

- Expose only what other modules need. Everything else is internal.
- The public API should be stable — internal changes should not ripple through consumers.
- Prefer exporting types, functions, and constants over exporting mutable state.

### 3. Move Code

- Move one file / one function / one type at a time.
- Update all imports after each move.
- Run the build after each move to catch breakage immediately.
- Do not rename during the move step — rename in a separate commit.

### 4. Handle Shared Types

- If two modules need the same type, decide ownership:
  - **Option A:** The type lives in the module that creates instances of it.
  - **Option B:** The type lives in a shared `types` / `models` module that both depend on — but only when neither module owns the concept on its own.
- Do not create a shared module prematurely. Wait until there are 2+ consumers.

## Folder / Package Structure

- **Mirror module boundaries in the file system.** Each module gets its own directory or package.
- **Keep the nesting depth shallow.** 2-3 levels of directory nesting is enough for most projects. Deep nesting hides structure.
- **Name directories after the domain concept**, not the technical layer. `orders/` is better than `services/` when the directory contains only order-related code.
- **Co-locate tests with source** when the ecosystem convention supports it. Otherwise, mirror the source tree in the test tree.

## Decision Rules

1. **Split for cohesion, not for size.** A 500-line module with one clear job is better than five 100-line modules that each need the other four.
2. **If a split creates more coupling than it removes, undo it.** The goal is fewer dependencies, not more files.
3. **New modules must be justified by a real consumer boundary.** Do not split "for future flexibility."
