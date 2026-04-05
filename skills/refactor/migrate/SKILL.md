---
name: refactor-migrate
description: Migrate dependencies, frameworks, or runtime versions with minimal breakage. Use this skill when upgrading libraries, switching frameworks, replacing deprecated APIs, bumping language/runtime versions, or says things like '升级依赖', '迁移到新版本', '替换废弃 API', 'upgrade to v4', 'migrate from X to Y', 'replace deprecated calls', 'bump Node/Python/Go version', 'framework migration', or 'dependency upgrade'. Also trigger when handling breaking changes from a version bump.
metadata:
  author: QuentinHsu
  version: "2026.04.05"
---

# Refactor Migrate

Upgrade dependencies, replace deprecated APIs, and adapt to new framework or runtime versions — applicable to any language or project.

Detailed rules live in:

- [rules/dependency-upgrade.md](./rules/dependency-upgrade.md)
- [rules/api-replacement.md](./rules/api-replacement.md)
- [rules/compatibility.md](./rules/compatibility.md)

## Core Principle

A migration changes external interfaces (library calls, runtime behavior) while keeping the application's observable business behavior intact. Every step must be verifiable independently.

## When To Use

Use this skill when the task involves:

- upgrading a library or framework to a new major/minor version
- replacing deprecated APIs with their recommended successors
- bumping language or runtime version (Node, Python, Go, Java, etc.)
- switching from one library to a competing alternative (e.g., Moment → date-fns, Request → fetch)
- adapting code to breaking changes introduced by an upstream update
- removing polyfills or compatibility shims that are no longer needed after a version bump

## Working Mode

1. **Inventory.** List current versions of the targets being migrated. Identify the target versions. Read changelogs and migration guides.
2. **Assess impact.** Search the codebase for all usage sites of the APIs, configs, or features that change. Quantify scope (file count, call count).
3. **Plan migration order.** Dependencies have dependencies — upgrade leaf dependencies first, then work inward. Identify which changes can be done independently.
4. **Apply dependency upgrade rules.** Update version specifiers, lock files, and configuration. See [rules/dependency-upgrade.md](./rules/dependency-upgrade.md).
5. **Apply API replacement rules.** Replace deprecated or removed calls with new equivalents. See [rules/api-replacement.md](./rules/api-replacement.md).
6. **Apply compatibility rules.** Handle behavioral changes, type changes, and edge cases across versions. See [rules/compatibility.md](./rules/compatibility.md).
7. **Verify.** Build, lint, and run existing tests. Flag any test failures caused by the migration.

## Boundaries

- Do not change business logic during migration. Separate feature work from migration work.
- Do not upgrade unrelated dependencies in the same pass — scope to what the user asked.
- Do not remove a dependency without confirming zero remaining usage.
- Do not downgrade type safety or error handling to satisfy a new API.
- Prefer incremental migration (codemods, adapter layers) over big-bang rewrites when the change surface is large.

## Default Output Expectations

- Show before/after for each API replacement.
- Note behavioral differences between old and new versions when they exist.
- Warn when a breaking change has no direct equivalent and a workaround is needed.
- When the migration is large, produce a step-by-step plan before writing code.
