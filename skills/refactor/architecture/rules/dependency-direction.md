# Dependency Direction

## Core Principle

Dependencies should flow from high-level policy toward low-level detail, never the reverse. A module should depend on abstractions it defines, not on concrete implementations of its collaborators.

## Dependency Direction Rules

### Flow Downward

- **Business logic must not import infrastructure.** Domain / service modules should not directly import database drivers, HTTP clients, file system modules, or framework-specific code.
- **Higher layers depend on lower layers, not the reverse.** Controller → Service → Repository → Data source. Never invert this direction without going through an abstraction.
- **Shared utilities must not depend on feature modules.** A utility or library module should be leaf-level — it can be imported by anyone but imports nothing application-specific.

### Eliminate Circular Dependencies

Cycles between modules indicate entangled responsibilities.

**Detection:** If `A imports B` and `B imports A` (directly or transitively), there is a cycle.

**Resolution strategies:**

1. **Extract the shared concept.** Move the types or functions both modules need into a third module that both depend on.
2. **Invert the dependency.** Have one module define an interface and the other implement it. The implementor depends on the definer, not vice versa.
3. **Merge the modules.** If two modules are so intertwined that separating them creates a cycle, they are one module pretending to be two.
4. **Use events / callbacks.** Module A passes a callback to Module B instead of B importing A. This breaks the static dependency.

### Dependency Inversion

When a high-level module needs a low-level capability:

1. **Define an interface in the high-level module** that describes the capability it needs (e.g., `UserRepository`, `EmailSender`, `Logger`).
2. **Implement the interface in the low-level module** (e.g., `PostgresUserRepository`, `SmtpEmailSender`).
3. **Wire them together at the composition root** (main function, DI container, startup module) — not inside the high-level module.

This ensures the high-level module can be tested, reused, and understood without knowing anything about the infrastructure.

### Interface Segregation

- **Define interfaces from the consumer's perspective**, not the provider's. If a consumer only needs `find` and `save`, do not force it to depend on an interface that also includes `delete`, `archive`, and `export`.
- **Prefer small, role-specific interfaces** (`Reader`, `Writer`) over large catch-all interfaces (`Repository` with 12 methods).

## Managing Third-Party Dependencies

- **Wrap third-party libraries** behind an internal interface when the library is used across many modules. This isolates the blast radius of a library change.
- **Do not wrap** when the library is used in only one module or is a de-facto standard that is unlikely to change (e.g., standard library APIs).
- **Pin the wrapping to the minimum API surface the project actually uses.** The internal interface should not mirror the entire library API.

## Visualizing Dependencies

- **Draw the dependency graph** before and after refactoring. Arrows should point in one direction — from application entry point down to infrastructure.
- **Flag fan-in hotspots.** A module imported by 50% or more of the codebase is either a fundamental utility (acceptable) or a god module (needs splitting).
- **Flag fan-out hotspots.** A module that imports 10+ other modules is likely doing too much.

## Decision Rules

1. **If adding a dependency creates a cycle, the design is wrong.** Do not suppress the cycle with lazy imports or runtime requires — fix the structure.
2. **If inverting a dependency adds more complexity than the coupling it removes, keep the direct dependency.** Dependency inversion is a tool, not a religion.
3. **Composition root is the only place that should know all concrete implementations.** If concrete types leak beyond the root, the inversion is incomplete.
