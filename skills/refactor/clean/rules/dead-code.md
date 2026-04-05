# Dead Code Removal

## Core Principle

Code that is not executed, not referenced, or not reachable is noise. Remove it to reduce maintenance burden and cognitive load.

## What Counts As Dead Code

### Unused Declarations

- Variables, constants, functions, methods, classes, types, or interfaces that are declared but never referenced.
- Imports that are not used anywhere in the file.
- Parameters that are accepted but never read inside the function body. If removing the parameter would break callers, mark it with a language-appropriate ignore convention (e.g., prefix with `_`) instead of deleting.

### Unreachable Code

- Code after an unconditional `return`, `throw`, `break`, `continue`, `exit`, or equivalent.
- Branches guarded by conditions that are always false at the type level or by prior logic.
- `else` blocks after a guard clause that already returns or throws.

### Redundant Logic

- Assignments whose values are immediately overwritten without being read.
- Variables assigned once and used only once in the next line — inline the expression unless the name adds clarity (if it does, it belongs under naming rules, not dead code).
- Wrapper functions that do nothing beyond forwarding to another function with the same signature.
- Try/catch blocks where the catch re-throws without any additional handling.
- Null checks on values that are already guaranteed non-null by prior logic or type narrowing.

### Stale Artifacts

- Commented-out code blocks. Version control is the archive; commented code is clutter.
- TODO/FIXME/HACK comments referencing completed or abandoned work with no remaining action.
- Feature-flag branches for flags that have been permanently enabled or removed.
- Deprecated methods or compatibility shims for versions no longer supported.

## Decision Rules

1. **If removing the code changes observable behavior, it is not dead code.** Leave it alone.
2. **If the code is only used in tests**, it is not dead in the production sense — do not remove unless the tests themselves are dead.
3. **If you are unsure whether code is reachable** (e.g., reflection, dynamic dispatch, plugin systems), flag it to the user instead of deleting.
4. **Remove in stable order:** imports → local declarations → unreachable branches → redundant wrappers → stale comments. This avoids cascading confusion during review.

## Review Checklist

When scanning for dead code, check these in order:

- [ ] Unused imports
- [ ] Unused local variables and constants
- [ ] Unused function/method definitions (private first, then exported)
- [ ] Unreachable code after early returns or throws
- [ ] Redundant assignments (write-then-overwrite without read)
- [ ] Redundant null/undefined checks after narrowing
- [ ] Commented-out code blocks
- [ ] Stale TODO/FIXME/HACK comments
- [ ] Pass-through wrapper functions with no added logic
