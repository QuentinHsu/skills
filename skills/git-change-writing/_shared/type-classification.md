# Change Type Classification

Shared rules for choosing the primary change type. Use whenever a git-writing skill infers `intent`, commit `type`, branch prefix, or PR type.

## Core Principle

Classify by the **primary user-facing value**, not by how much code changed or how the change is worded.

Ask: **what is materially different for the user after this change?**

| Answer | Type |
| --- | --- |
| Something was broken, incorrect, or regressed, and is now correct | `fix` |
| Users can do something meaningfully new | `feat` |
| Same task, but faster, smoother, clearer, or with less friction | `perf` |
| Mostly internal structure; users would not notice | `refactor` |
| Only tests changed | `test` |
| Only documentation changed | `docs` |
| Tooling, dependencies, CI, repo config | `chore` |
| Formatting only, zero logic change | `style` |

## Decision Order

Apply in order and stop at the first match:

```text
broken before, correct now?   yes -> fix
new capability?               yes -> feat
same ability, better?         yes -> perf
mostly internal?              yes -> refactor
tests only?                   yes -> test
otherwise                     -> docs / chore / style
```

Before finalizing, rewrite the change as one neutral sentence without loaded verbs ("redesign", "enhance", "improve"). If the neutral sentence suggests a different type, trust it over the original wording.

- `redesign checkout` → does checkout do something new, or just feel better?
- `rewrite table rendering` → did users gain speed, correctness, or neither?

## Type Boundaries

### `feat` — new capability

New page, route, endpoint, command, public API, setting, filter, sort mode, export format, integration, permission, or workflow; data users could not access before.

Test: can the user point to a new outcome, not just a nicer way to reach an existing one?

### `perf` — same capability, better experience

Faster render/fetch/startup/response; fewer steps; smoother transitions; better loading, focus, hover, or feedback states; caching, debounce, memoization; layout, density, or visual polish of an existing page; better defaults.

Test: are users doing the same thing as before, with less friction or better perceived quality?

### `fix` — restore intended behavior

Wrong result, crash, broken state, incorrect validation, regression, race condition, edge-case failure, or a UI element that behaves unreliably.

If an interaction became smoother **because it was repaired**, choose `fix`.

### `refactor` — structural cleanup

Extract modules/hooks/helpers, rename internals, split responsibilities, invert dependencies, remove duplication — with no meaningful user-facing change.

If the restructuring is mainly a means to a noticeable speed or smoothness gain, choose `perf`.

### `test` — tests only

New or improved unit/integration/e2e tests, fixtures, mocks, or test helpers. If production code also changes, classify by the production change.

Scope is the **module under test**, never the test directory or test level:

- ✅ `test(auth): cover token refresh edge cases` (from `tests/auth/test_token.py`)
- ❌ `test(tests): ...`, `test(unit): ...`

### `docs` — documentation only

README, guides, API docs, docstrings, changelog, broken links or typos in docs. If comments change alongside code, classify by the code change.

Scope is the documented area (`docs(api)`, `docs(setup)`); use `readme` only for structural README changes.

### `chore` — tooling and maintenance

Dependency bumps (`chore(deps)`), CI/CD (`chore(ci)`), build tooling (`chore(build)`), dev tooling, `.gitignore`, repo config.

### `style` — formatting only

Formatter output, whitespace, line endings, import ordering with no semantic change. Mixed with logic → classify by the logic.

## UI / UX Changes

UI-only or UX-only improvements that add no net-new capability are `perf`.

| Change | Type |
| --- | --- |
| Visual redesign, spacing, typography, color, hierarchy of an existing page | `perf` |
| Moving an existing action somewhere more obvious; new shortcut button for an existing action | `perf` |
| Better hover/focus/loading/empty states, inline feedback, animation smoothing | `perf` |
| Changing a default (sort, layout, placement) | `perf` |
| New action, filter dimension, view mode, wizard, or settings surface with real new utility | `feat` |
| Keyboard or screen-reader access where none existed | `feat` |
| Focus order, labels, contrast, announcements for an already working flow | `perf` |
| Disabled button, modal close, focus trap, or validation that was broken | `fix` |
| Splitting a large component with no rendered difference | `refactor` |

When UI and logic both change, the dominant outcome decides: new capability wrapped in polish → `feat`; same capability with supporting logic → `perf`; repaired and slightly polished → `fix`.

## Common Misclassifications

- **Not `feat` just because** many files changed, the UI looks very different, or a new button/card exposes an existing action.
- **Not `perf` just because** the change feels positive, developers (not users) got faster, code got cleaner, or a broken flow now works (that is `fix`).
- **Not `refactor` just because** the rewrite was large, if users clearly feel faster or smoother behavior.
- **Not `fix` just because** friction was reduced in a flow that already worked correctly.

## Tie-Breakers

- `feat` vs `perf` → `perf` when the end goal was already possible, no new option/workflow was added, and the value is smoother interaction, clearer UI, or speed.
- `perf` vs `fix` → `fix` when behavior was incorrect before and polish is secondary.
- `perf` vs `refactor` → `perf` when users perceive the improvement directly.
- Bug fix plus regression test → `fix`.

## Scenario Reference

| Change | Type |
| --- | --- |
| Add CSV export to a table | `feat` |
| Reduce export flow from 4 clicks to 2 | `perf` |
| Fix CSV export returning wrong columns | `fix` |
| Split export service into smaller modules | `refactor` |
| Add dark mode toggle | `feat` |
| Improve dark mode contrast and spacing | `perf` |
| Fix unreadable text in dark mode | `fix` |
| Add unit tests for token refresh | `test` |

## Wording Contrast

The same analysis can still produce wrong text. Match the wording to the type:

| Scenario | ❌ | ✅ |
| --- | --- | --- |
| Checkout does the same job with fewer steps | `feat(checkout): redesign checkout flow` | `perf(checkout): streamline checkout feedback` |
| Users can save search presets for the first time | `perf(search): improve preset workflow` | `feat(search): support reusable saved presets` |
| Filter state was lost after navigation | `perf(filters): improve filter persistence` | `fix(filters): preserve state after navigation` |
| Render rewrite makes large tables scroll smoothly | `refactor(table): rewrite render pipeline` | `perf(table): reduce scroll jank in large datasets` |
