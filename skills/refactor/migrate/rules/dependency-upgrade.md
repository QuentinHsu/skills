# Dependency Upgrade

## Core Principle

Update version specifiers and configurations correctly, completely, and in the right order so the project builds and passes tests after each step.

## Version Specifiers

- **Update the version in the manifest file** (package.json, pyproject.toml, go.mod, Cargo.toml, build.gradle, Gemfile, etc.) to the target version.
- **Regenerate or update the lock file** after changing the manifest. Do not hand-edit lock files.
- **Respect version range conventions** of the ecosystem. If the project uses exact pins, pin exactly. If it uses caret/tilde ranges, update the range to include the target.
- **Check peer dependency requirements.** A major upgrade in one package may require compatible upgrades in its peers.

## Upgrade Order

1. **Leaf dependencies first.** Upgrade packages that have no dependents in the project before packages that are widely imported.
2. **One major version at a time** when possible. Jumping multiple majors in one step compounds breaking changes and makes debugging harder.
3. **Group tightly coupled packages.** Some ecosystems have package families that must be upgraded together (e.g., `@angular/*`, `react` + `react-dom`, `eslint` + plugins). Upgrade them as a unit.
4. **Separate dependency upgrades from code changes.** Commit the version bump and lock file update first, then commit the code adaptations. This makes rollback cleaner.

## Configuration Changes

- **Check for renamed or removed configuration keys.** New major versions often rename config fields, CLI flags, or environment variables.
- **Update configuration files** (webpack.config, tsconfig, babel.config, pytest.ini, etc.) to match the new version's schema.
- **Remove configuration for features that are now default.** If the new version enables a behavior by default that was previously opt-in, remove the explicit opt-in.

## Post-Upgrade Verification

- Run `install` / `restore` to confirm dependency resolution succeeds.
- Run the build to catch compile-time errors.
- Run the full test suite.
- Check for deprecation warnings in build or test output — they signal the next round of work.

## Decision Rules

1. **If the changelog says "breaking", read the full entry.** Do not assume the break does not affect this project.
2. **If a dependency has been abandoned**, consider whether migrating to its maintained fork or alternative is part of this upgrade scope. Flag to the user if it is not.
3. **Do not widen version ranges to "accept anything".** Ranges like `*` or `>=0` defeat the purpose of version management.
