---
name: refactor-architecture
description: Restructure module boundaries, dependency directions, and responsibility assignments to improve system organization. Use this skill when splitting monoliths, extracting modules, reorganizing layers, inverting dependencies, separating concerns, or says things like '重新划分模块', '拆分这个大模块', '调整分层架构', '解耦这些模块', 'split this module', 'extract a service layer', 'reorganize project structure', 'invert dependency', 'separate concerns', 'decouple these components', 'introduce hexagonal architecture', or 'restructure the codebase'. Also trigger when reducing circular dependencies or introducing architectural boundaries.
metadata:
  author: QuentinHsu
  version: "2026.04.05"
---

# Refactor Architecture

Restructure module boundaries, dependency directions, and responsibility assignments — applicable to any language or project.

Detailed rules live in:

- [rules/module-boundaries.md](./rules/module-boundaries.md)
- [rules/dependency-direction.md](./rules/dependency-direction.md)
- [rules/responsibility-separation.md](./rules/responsibility-separation.md)

## Core Principle

Architectural refactoring changes where code lives and how modules relate — not what the code does. The system's external behavior stays the same; internal organization improves.

## When To Use

Use this skill when the task involves:

- splitting a large module, class, or service into smaller focused units
- merging closely coupled micro-modules that should be one cohesive unit
- reorganizing folder/package structure to reflect logical boundaries
- eliminating circular dependencies between modules
- introducing or enforcing layered architecture (controller → service → repository)
- inverting a dependency so high-level policy does not depend on low-level detail
- extracting shared code into a dedicated library, package, or module
- separating I/O, state management, and business logic into distinct layers

## Working Mode

1. **Map current architecture.** Identify modules, their public APIs, and the dependency graph. Note any cycles, god modules, or scattered responsibilities.
2. **Define target boundaries.** Agree with the user on the desired module structure. Each module should have a clear, single reason to exist.
3. **Apply module boundary rules.** Split, merge, or reorganize modules. See [rules/module-boundaries.md](./rules/module-boundaries.md).
4. **Apply dependency direction rules.** Eliminate cycles, invert dependencies, and enforce flow direction. See [rules/dependency-direction.md](./rules/dependency-direction.md).
5. **Apply responsibility separation rules.** Ensure each module owns one concern and exposes a minimal public surface. See [rules/responsibility-separation.md](./rules/responsibility-separation.md).
6. **Migrate incrementally.** Move code in small steps. After each step, the project must build and tests must pass.
7. **Verify.** Run the full test suite. Check that no module exposes more than it should. Confirm the dependency graph matches the target design.

## Boundaries

- Do not change business logic during an architectural refactoring.
- Do not rename public APIs consumed by external callers without coordination.
- Do not introduce new frameworks or paradigms — reorganize within the existing tech stack.
- Do not optimize for hypothetical future requirements. Restructure for current pain points.
- Keep each move (file, class, function) as a discrete reviewable change when possible.

## Default Output Expectations

- Provide a before/after module diagram or file tree when the change is structural.
- Explain the rationale for each boundary decision.
- Warn when a move would break external consumers (published packages, API contracts, database migrations).
- When the refactoring is large, produce a phased migration plan before making changes.
