# Change Type Classification

Shared classification rules for choosing the primary Git change type.

Use this file whenever a git-writing skill needs to infer `intent`, commit `type`, branch prefix, or PR type.

## Core Principle

Choose the type based on the **primary user-facing value** of the change, not on how much code changed.

Ask first: **what is materially different for the user after this change?**

- If users can do something meaningfully new, lean `feat`
- If users do the same thing but faster, smoother, clearer, or with less friction, lean `perf`
- If intended behavior was broken and is now restored, lean `fix`
- If the main change is structural/internal with no meaningful user-facing delta, lean `refactor`

## Recommended Decision Order

Apply these checks in order:

1. **Is it primarily a bug/regression correction?**
   - Yes → `fix`
2. **Does it create a net-new capability, workflow, API, option, or use case?**
   - Yes → `feat`
3. **Does it keep the same core capability but improve speed, smoothness, clarity, interaction quality, or visual/UX quality?**
   - Yes → `perf`
4. **Does it mostly reorganize code without changing user-facing behavior?**
   - Yes → `refactor`
5. **Is it primarily adding or improving tests without changing production code?**
   - Yes → `test`
6. Otherwise choose the best fit among `docs`, `chore`, `style`

## Fast Triage Questions

When the diff is ambiguous, answer these questions in order:

1. **What new thing can the user do now?**
   - If the answer is concrete and new, likely `feat`
2. **If nothing new was added, what became better?**
   - If the answer is speed, smoothness, clarity, fewer steps, or better UI/UX, likely `perf`
3. **Was something wrong before?**
   - If yes and the main value is restoring correctness, likely `fix`
4. **Would most users fail to notice any product-level change?**
   - If yes, likely `refactor`
5. **Is this purely test code with zero production changes?**
   - If yes, likely `test`

Short version:

- **new ability** → `feat`
- **same ability, better experience** → `perf`
- **broken before, correct now** → `fix`
- **mostly internal cleanup** → `refactor`
- **adding tests** → `test`

## Quick Decision Tree

Use this mini flow when you need a fast, stable classification:

1. **Was something broken, incorrect, or regressed before this change?**
   - Yes → `fix`
   - No → continue
2. **Can the user do something meaningfully new after this change?**
   - Yes → `feat`
   - No → continue
3. **Is the same task now faster, smoother, clearer, or easier?**
   - Yes → `perf`
   - No → continue
4. **Is the main value internal cleanup or restructuring?**
   - Yes → `refactor`
   - No → continue
5. **Is the main value test coverage or test quality?**
   - Yes → `test`
   - No → choose the best fit among `docs`, `chore`, `style`

Compact version:

```text
broken before?        yes -> fix
new capability?       yes -> feat
same but better?      yes -> perf
mostly internal?      yes -> refactor
adding tests?         yes -> test
otherwise             -> docs/chore/style
```

## Detailed Type Boundaries

### `feat` — New capability

Use `feat` when the change enables a user, developer, or system to do something that was not realistically possible before.

Strong `feat` signals:
- new page, screen, route, endpoint, command, or public API
- new setting, toggle, filter, sort mode, export format, or automation that adds a real new option
- new business workflow or completion path
- new data surfaced that users could not access before
- new permission, integration, or notification channel

Common wording that often implies `feat`:
- add support for
- introduce
- enable users to
- provide a new way to
- allow configuration of
- expose a new

`feat` test:

> After the change, can the user point to a new capability or outcome, not just a nicer way to reach an existing one?

If yes, prefer `feat`.

### `perf` — Same capability, better experience

Use `perf` when the core job stays the same, but the experience becomes more efficient or more polished.

Strong `perf` signals:
- faster render, fetch, search, startup, build, or response time
- reduced interaction cost for an existing flow (fewer clicks, fewer interruptions, clearer hierarchy)
- smoother animations or transitions for an existing action
- improved loading states, optimistic UI, skeletons, debounce/throttle, caching, memoization
- visual polish that improves readability, scanability, confidence, or perceived speed
- reworked layout or information density for an existing page without introducing a new capability
- interaction optimizations such as better focus handling, keyboard flow, drag experience, hover affordances, or clearer feedback

Common wording that often implies `perf`:
- optimize
- streamline
- improve responsiveness
- reduce steps
- simplify interaction
- polish UI
- refine feedback
- improve readability
- make navigation smoother

`perf` test:

> Are users fundamentally doing the same thing as before, but with less friction or better perceived quality?

If yes, prefer `perf`.

### `fix` — Restore intended behavior

Use `fix` when the main purpose is correcting wrong behavior, not improving a healthy flow.

Strong `fix` signals:
- wrong result, crash, broken state, missing update, incorrect validation
- regression from previous intended behavior
- race condition, edge-case failure, or compatibility break
- UI element exists but behaves incorrectly, inconsistently, or unreliably

Common wording that often implies `fix`:
- fix broken
- resolve regression
- correct
- prevent failure
- handle edge case
- restore expected behavior
- stop crashing

If a change makes the UI smoother **because it repairs broken interaction**, prefer `fix` over `perf`.

### `refactor` — Structural cleanup

Use `refactor` when the primary change is internal code structure.

Strong `refactor` signals:
- extract modules/services/hooks/helpers
- rename internals for clarity
- invert dependencies or split responsibilities
- remove duplication without changing externally visible behavior

Common wording that often implies `refactor`:
- restructure
- reorganize
- extract
- decouple
- simplify internals
- clean up implementation

If the structural cleanup also makes the app noticeably faster or smoother and that is the main value, prefer `perf`.

### `test` — Adding or improving tests

Use `test` when the primary change is adding new tests or improving existing test coverage, without materially changing production behavior.

Strong `test` signals:
- adding unit tests, integration tests, or e2e tests for existing code
- improving test coverage for previously untested paths
- adding test fixtures, helpers, or mocks
- refactoring test-only code for clarity

If the same change also modifies production code, classify by the production change instead. Use `test` only when tests are the sole or primary change.

**Scope rule for `test`:** The scope must reflect the **module or feature under test**, not the test directory name or test level.

Infer scope from the test target, not the literal test file path:
- `tests/auth/test_token.py` → scope `auth` (the module being tested)
- `__tests__/components/SearchBox.test.tsx` → scope `search-box` (the component under test)
- `src/utils/__tests__/format.test.ts` → scope `format` or `utils`
- Tests spanning multiple unrelated modules → omit scope

Rationale: scope signals **impact area** to readers. `test(tests)` tells nothing about what was tested; `test(auth)` immediately communicates that auth behavior is now covered.

- ✅ `test(auth): cover token refresh edge cases`
- ✅ `test(search): add pagination boundary tests`
- ❌ `test(tests): add unit tests for token refresh` — `tests` is a directory label, not a meaningful impact area
- ❌ `test(unit): add token refresh tests` — test level (unit/e2e) does not describe impact area

`test` test:
> Is the primary value improved test coverage or test quality, with no meaningful production behavior change?
If yes, prefer `test`.

### `docs` — Documentation only

Use `docs` when the change is purely documentation, without code behavior changes.

Strong `docs` signals:
- README updates, API docs, inline code comments, or wiki pages
- adding or revising usage guides, setup instructions, or contribution guides
- docstring/JSDoc additions or corrections
- changelog entries, license files, or governance docs
- fixing broken links, typos, or formatting in documentation

If code comments change alongside code changes, classify by the code change.

**Scope guidance:** Use the documented area as scope. Use a generic label like `readme` or `contributing` only when the change is structural (reorganizing sections, updating badges) rather than documenting a specific feature.

- ✅ `docs(api): document pagination query parameters`
- ✅ `docs(setup): add Docker Compose instructions`
- ⚠️ `docs(readme): update project description` — acceptable for structural README changes
- ❌ `docs: update docs` — too vague

`docs` test:
> Is the sole purpose to add, update, or correct documentation without any code change?
If yes, prefer `docs`.

### `chore` — Tooling, dependencies, maintenance

Use `chore` for changes that don't affect production code behavior.

Strong `chore` signals:
- dependency version bumps (npm, pip, cargo, gems, etc.)
- CI/CD pipeline changes (.github/workflows, Jenkins, GitLab CI, etc.)
- build tooling configuration (webpack, vite, esbuild, tsconfig, etc.)
- dev tooling setup (.editorconfig, lint-staged, husky, pre-commit hooks, etc.)
- .gitignore updates, dev script changes, repo-level configuration

**Scope guidance:**
- Dependency bumps → `deps` or the package name: `chore(deps): bump lodash to 4.17.21`
- CI/CD → `ci`: `chore(ci): add bundle size check to PR workflow`
- Build tooling → `build` or the tool name: `chore(build): migrate webpack to vite`
- No clear sub-area → omit scope

`chore` test:
> Does this change affect developer workflow, tooling, or dependencies without altering production behavior?
If yes, prefer `chore`.

### `style` — Formatting only

Use `style` for changes that only affect code formatting (whitespace, semicolons, line breaks, indentation), with zero logic change.

Strong `style` signals:
- applying formatter rules (Prettier, Black, gofmt, rustfmt, etc.)
- fixing lint warnings that are purely stylistic
- normalizing whitespace or line endings
- reordering imports without semantic change

If formatting changes are mixed with logic changes, classify by the logic change. Use `style` only when formatting is the sole change.

`style` test:
> Does the diff consist entirely of formatting changes with zero behavioral difference?
If yes, prefer `style`.

## UI / UX Specific Guidance

This repository treats many **UI-only or UX-only improvements** as `perf` when they do **not** add a net-new capability.

### Prefer `perf` for UI/UX changes like:

- visual redesign of an existing page without new workflow capability
- spacing, typography, color, hierarchy, or density improvements
- moving an existing action to a more obvious place
- reducing clicks for an existing task
- better hover/focus/pressed/disabled/loading states
- animation smoothing, transition refinement, scroll behavior improvement
- better empty states, inline feedback, status messaging, or confirmation cues
- interaction polish for forms, dialogs, drawers, tabs, tables, or search

### Prefer `feat` for UI changes like:

- adding a brand-new action users could not take before
- adding a new filter/sort/view mode that changes what users can access
- adding a new onboarding step, assistant, wizard, or configuration path
- exposing a previously unavailable workflow in the UI
- adding a brand-new panel, dashboard section, report, or settings surface with new utility

### Prefer `fix` for UI changes like:

- making a disabled button clickable again when it should have worked
- restoring missing validation or error feedback that previously failed to show
- correcting focus trap, modal close behavior, or form submission logic that was broken
- fixing layout breakage that prevented normal use on a supported viewport

### Prefer `refactor` for UI changes like:

- splitting a giant component into smaller components without changing product behavior
- moving styling logic to shared helpers without changing the rendered experience in a meaningful way
- reorganizing state management solely for maintainability

## Borderline Cases

### New button, same underlying capability

If a new button only exposes an action that users could already complete elsewhere, usually choose `perf`.

Examples:
- add a shortcut button to an existing settings action → `perf`
- surface an existing retry action inline instead of inside a menu → `perf`

### New entry point with meaningful new utility

If the new UI surface unlocks a new use case, choose `feat`.

Examples:
- add a new bulk-edit toolbar for multi-item editing where no such flow existed → `feat`
- add a new saved-filter panel users can create and reuse → `feat`

### UI + logic both changed

Choose based on the dominant outcome:

- new business capability wrapped in UI polish → `feat`
- same business capability with better interaction and some supporting logic → `perf`
- broken interaction repaired and slightly polished → `fix`

### Existing flow exposed in a better way

If the user could already complete the task, and the change mainly makes discovery or execution easier, prefer `perf`.

Examples:
- add inline pagination controls instead of hiding them in a dropdown → `perf`
- surface existing advanced settings in the main panel instead of a secondary modal → `perf`

### New option vs better default

- adding a new selectable mode/option/filter that did not exist → `feat`
- changing the default sort, layout, spacing, copy, or placement for better usage → `perf`

### Accessibility-focused work

Use the dominant outcome:

- adding keyboard support or screen-reader support where the interaction was previously unavailable to those users → usually `feat` if it creates meaningful new access, otherwise `fix` if it restores expected supported accessibility behavior
- improving focus order, labels, contrast, or announcements for an already working flow → usually `perf`

### Backend or infrastructure work with user-visible impact

- same feature, much faster page load or query time → `perf`
- new API capability or new backend-powered workflow → `feat`
- broken API behavior now corrected → `fix`
- internal service split with no external change → `refactor`

## Common Misclassification Corrections

### Do not choose `feat` just because:

- a lot of files changed
- the UI looks very different
- a new button, menu item, or card was added for an existing action
- some new supporting logic was required to improve an existing flow

### Do not choose `perf` just because:

- the change feels positive
- the implementation got faster for developers but not for users
- code is cleaner or more maintainable without a noticeable experience gain
- a broken flow now works correctly

### Do not choose `refactor` just because:

- the work involved a large internal rewrite
- performance or interaction clearly improved in a noticeable way
- users will perceive the product as significantly faster or smoother

### Do not choose `fix` just because:

- the change reduces friction in a flow that already worked correctly
- validation, loading, or interaction got nicer but was not actually broken before

## Misleading Wording Hints

Do not classify based on high-level wording alone. Many diff summaries contain verbs that sound like one type but often belong to another.

### Words that often over-trigger `feat`

These words can sound like "new feature" even when the change is really polish or restructuring:

- redesign
- revamp
- enhance UI
- improve experience
- add button
- add entry point

How to correct:
- if the user could already complete the same task before, lean `perf`
- if the new surface only exposes an existing action, lean `perf`
- if the visible redesign mainly supports a new workflow or option, then `feat` may still be correct

### Words that often over-trigger `perf`

These words can sound like optimization even when the change is actually `feat` or `fix`:

- improve
- optimize
- streamline
- simplify
- enhance
- make faster

How to correct:
- if the change adds a genuinely new option, workflow, or access path, lean `feat`
- if the previous behavior was wrong or unstable, lean `fix`
- if no meaningful user-perceived gain exists, it may be `refactor`, not `perf`

### Words that often over-trigger `refactor`

These words can sound internal even when users clearly feel the difference:

- rewrite
- rework
- rebuild
- replace architecture
- migrate rendering
- restructure pipeline

How to correct:
- if the main user-visible outcome is lower latency, smoother interaction, or clearer behavior, lean `perf`
- if the main outcome is restored correctness, lean `fix`
- only choose `refactor` when the structural cleanup itself is the main value

### Words that often over-trigger `fix`

These words can sound like bug repair even when the flow was already correct and only became nicer:

- improve validation
- fix UX friction
- correct layout hierarchy
- resolve awkward flow

How to correct:
- if the previous flow was valid but clumsy, lean `perf`
- if the issue was taste, clarity, or convenience rather than correctness, lean `perf`
- only choose `fix` when intended behavior was actually broken or regressed

## Phrase-to-Intent Sanity Check

Before finalizing the type, rewrite the change in one short sentence without loaded verbs:

- Instead of `redesign checkout`, ask: `does checkout do something new, or just feel better?`
- Instead of `improve search presets`, ask: `were presets new, or just easier to use?`
- Instead of `rewrite table rendering`, ask: `did users mainly gain speed, correctness, or neither?`

If the neutral rewrite changes the apparent type, trust the neutral rewrite over the original phrasing.

## Counterexamples for Tricky Cases

Use these pairs to correct instinctive but wrong labeling.

### Looks like `feat`, but is actually `perf`

- adding a prominent top-level button for an action that already existed elsewhere
- redesigning a page so the same workflow is easier to scan and complete
- moving filters from a collapsible panel into the main toolbar for faster access
- adding loading skeletons and inline success feedback to an existing form flow
- reordering existing controls to reduce user effort without changing capability

Reason: the user is still accomplishing the same outcome; the value is smoother execution, not new utility.

### Looks like `perf`, but is actually `feat`

- adding a brand-new filter dimension users never had before
- adding keyboard shortcuts for an operation that previously had no keyboard-accessible path at all
- introducing a new bulk action workflow where only single-item actions existed before
- exposing a new settings surface that unlocks real configuration users could not do before
- adding a new export destination or integration, even if the UI change looks small

Reason: the change introduces a new option, path, or capability, not just a nicer experience.

### Looks like `perf`, but is actually `fix`

- making form validation messages appear again after they stopped rendering
- smoothing a modal interaction that was actually broken because focus trap or close behavior failed
- improving retry UX for an action that previously failed to recover correctly
- refining table interaction where sorting state was being lost incorrectly
- improving responsiveness of a control that had been intermittently unusable due to a bug

Reason: the primary value is restoring intended behavior; polish is secondary.

### Looks like `refactor`, but is actually `perf`

- replacing a data-loading architecture and the visible result is a much faster screen
- restructuring rendering logic primarily to reduce jank or input latency
- rewriting state handling mainly to remove user-visible flicker or lag

Reason: even if the implementation changed deeply, the dominant outcome is a user-perceived experience improvement.

### Looks like `perf`, but is actually `refactor`

- extracting hooks, helpers, or services with no meaningful UX or runtime change
- reorganizing component boundaries for maintainability only
- renaming internal abstractions and cleaning dead paths without a visible product gain

Reason: cleaner internals alone are not `perf` unless users actually feel the improvement.

## Scenario Matrix

Use these examples as a biasing reference in borderline cases.

| Change description | Preferred type | Why |
| --- | --- | --- |
| Add CSV export to an existing table | `feat` | new user capability |
| Reduce export flow from 4 clicks to 2 | `perf` | same capability, lower interaction cost |
| Fix CSV export returning wrong columns | `fix` | restores correctness |
| Rewrite export service into smaller modules | `refactor` | structural change only |
| Add a new saved-search feature | `feat` | new reusable workflow |
| Reorder existing search filters for faster use | `perf` | same search capability, better usability |
| Fix search filter state not persisting | `fix` | broken behavior corrected |
| Extract search state into a hook | `refactor` | internal cleanup |
| Add dark mode toggle | `feat` | new option users can select |
| Improve dark mode contrast and spacing | `perf` | existing capability polished |
| Fix dark mode text becoming unreadable | `fix` | broken display corrected |
| Move theme logic into a shared provider | `refactor` | mostly internal structure |
| Add keyboard shortcut for a previously mouse-only action | `feat` | meaningful new access path/capability |
| Improve shortcut discoverability in tooltips | `perf` | same capability, clearer experience |
| Fix shortcut not triggering reliably | `fix` | restores intended behavior |
| Extract shortcut bindings into utility modules | `refactor` | internal organization |
| Add bulk select actions where no bulk flow existed | `feat` | new workflow |
| Make existing bulk select panel faster and clearer | `perf` | same workflow, better experience |
| Fix bulk select count being wrong | `fix` | correctness issue |
| Split bulk action code paths into separate services | `refactor` | internal change |
| Add unit tests for auth token refresh | `test` | test coverage for existing code |
| Add e2e tests for checkout flow | `test` | test coverage, no production change |
| Fix auth bug and add a regression test | `fix` | primary value is the bug fix, not the test addition |
| Add integration tests for API pagination | `test` | test coverage for existing feature |

## Commit Message and PR Writing Bias

When uncertain between `feat` and `perf`, prefer `perf` if all of the following are true:

- the same end goal was already possible before
- no new user option/capability/workflow was introduced
- the main value is smoother interaction, clearer UI, better feedback, or faster performance

When uncertain between `perf` and `fix`, prefer `fix` if all of the following are true:

- something behaved incorrectly before
- the change restores expected behavior
- any polish is secondary to the correction

When uncertain between `perf` and `refactor`, prefer `perf` if all of the following are true:

- users will feel the improvement directly
- the experience is measurably or perceptibly better
- the structural cleanup is mainly a means to that end

## Output Contrast Examples

Use these examples to avoid producing the right analysis but the wrong Git text.

### Same capability, better UX → prefer `perf`, not `feat`

Scenario: checkout flow still does the same job, but now uses fewer steps and clearer feedback.

Wrong commit:

```text
feat(checkout): redesign checkout flow
```

Better commit:

```text
perf(checkout): streamline checkout flow feedback
```

Wrong PR title:

```text
feat: redesign checkout flow
```

Better PR title:

```text
perf: streamline checkout flow interactions
```

Why: no net-new checkout capability was introduced; the main value is smoother execution.

### New option or workflow → prefer `feat`, not `perf`

Scenario: users can now save and reuse search presets for the first time.

Wrong commit:

```text
perf(search): improve preset workflow
```

Better commit:

```text
feat(search): support reusable saved presets
```

Wrong PR title:

```text
perf: improve search preset flow
```

Better PR title:

```text
feat: add reusable saved search presets
```

Why: this adds a new reusable workflow, not just polish.

### Broken behavior repaired → prefer `fix`, not `perf`

Scenario: filter state was resetting incorrectly after navigation, and now it is preserved.

Wrong commit:

```text
perf(filters): improve filter persistence
```

Better commit:

```text
fix(filters): preserve state after navigation
```

Wrong PR title:

```text
perf: improve filter persistence behavior
```

Better PR title:

```text
fix: preserve filter state after navigation
```

Why: the main value is restored correctness.

### Internal cleanup with visible speed gain → prefer `perf`, not `refactor`

Scenario: rendering internals were rewritten and users now see much faster table scrolling.

Wrong commit:

```text
refactor(table): rewrite render pipeline
```

Better commit:

```text
perf(table): reduce scroll jank in large datasets
```

Wrong PR title:

```text
refactor: rewrite table rendering pipeline
```

Better PR title:

```text
perf: reduce table scroll jank for large datasets
```

Why: the dominant user-facing value is performance, not internal purity.

## Quick Comparison Table

| Situation | Preferred type |
| --- | --- |
| Added a new export format | `feat` |
| Restyled export dialog and reduced clicks | `perf` |
| Fixed export dialog not opening | `fix` |
| Split export code into smaller modules only | `refactor` |
| Added a new filter users never had before | `feat` |
| Reordered existing filters for faster use | `perf` |
| Fixed existing filter returning wrong results | `fix` |
| Reimplemented filter internals without visible change | `refactor` |
| Added unit tests for auth module | `test` |
| Updated API documentation for pagination | `docs` |
| Upgraded a CI dependency in GitHub Actions | `chore` |
| Applied Prettier formatting across the project | `style` |

## Tie-Breakers

When multiple labels seem plausible, use these tie-breakers:

1. **User outcome beats implementation detail**
2. **Net-new capability beats polish** → prefer `feat` over `perf`
3. **Correctness beats polish** → prefer `fix` over `perf`
4. **Noticeable experience gain beats internal cleanup** → prefer `perf` over `refactor`
5. **A better entry point to an existing action is usually polish, not a new feature** → prefer `perf`
6. **A newly accessible path that unlocks a previously impossible outcome is usually capability** → prefer `feat`

## Output Guidance for Git Writing Skills

When summarizing rationale internally, use concise language such as:

- `feat`: `adds a new bulk edit workflow`
- `perf`: `improves the existing checkout flow with fewer steps and clearer feedback`
- `fix`: `restores correct pagination state after filter changes`
- `refactor`: `reorganizes data fetching without changing behavior`
- `test`: `covers token refresh edge cases`
- `docs`: `documents pagination query parameters`
- `chore`: `bumps lodash to 4.17.21`
- `style`: `applies consistent semicolon formatting`

If the change is mixed, choose one primary type and mention secondary aspects in bullets/body rather than inventing a hybrid label.