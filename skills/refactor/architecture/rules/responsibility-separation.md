# Responsibility Separation

## Core Principle

Each module, class, or function should own exactly one concern. When a unit mixes multiple responsibilities, changes to one concern risk breaking the other.

## Concern Categories

### I/O vs. Logic

- **Separate data fetching from data processing.** A function that fetches records from a database and then transforms them is doing two jobs.
- **Push I/O to the edges.** Business logic functions should receive data as arguments and return results. The caller handles reading input and writing output.
- **The "functional core, imperative shell" pattern:** pure logic in the center (easy to test, easy to reason about), I/O operations in the outer shell (thin, hard to get wrong).

Prefer:

```
# Shell — handles I/O
raw_data = database.fetch(query)
result = transform(raw_data)   # ← pure function
database.save(result)

# Core — pure logic
def transform(data):
    return [process(item) for item in data]
```

Over:

```
def fetch_and_transform(query, database):
    raw_data = database.fetch(query)
    result = [process(item) for item in raw_data]
    database.save(result)
    return result
```

### Orchestration vs. Execution

- **Orchestrators decide what to do.** They call other functions in the right order, pass data between steps, and handle the overall workflow.
- **Executors do one thing.** They perform a single computation, side effect, or transformation.
- **Do not mix decisions and work in the same function.** An orchestrator should contain `if` statements and function calls. An executor should contain computation but not branching over unrelated concerns.

### Presentation vs. Domain

- **Format for display in the presentation layer**, not in domain logic. Domain functions return clean data structures; presentation code converts them to strings, HTML, JSON responses, etc.
- **Validation belongs at the boundary.** Validate inputs when they enter the system (controller, API handler, CLI parser). Domain logic should assume valid data.

### Configuration vs. Behavior

- **Externalize values that vary by environment** (URLs, credentials, feature flags, thresholds) into configuration. Do not hardcode them in business logic.
- **Do not embed behavior in configuration.** Config should be declarative data (key-value, YAML, env vars). If config contains `if/else` logic or code strings, it has crossed the line.

## Detecting Mixed Responsibilities

### Signals

- **A function has too many parameters** from different domains (e.g., `user`, `httpRequest`, `database`, `logger` all in one function).
- **A change in how data is stored requires changing how data is processed.** These are two concerns entangled in one place.
- **A class has methods that never use the same fields.** The class is probably merging two groups of related behavior.
- **A module name needs "and" or "manager".** `UserAndOrderService`, `DataManager` — these names signal mixed responsibilities.

### Resolution

1. **Identify the concerns.** List each distinct responsibility the unit handles.
2. **Pick the primary concern** — the one the unit should own.
3. **Extract secondary concerns** into their own functions, classes, or modules.
4. **Connect them through parameters, return values, or injected dependencies** — not by sharing internal state.

## Layered Architecture Audit

When reviewing or establishing layers:

| Layer | Owns | Depends On | Must Not Import |
|-------|------|------------|-----------------|
| **Presentation** (controller, view, CLI) | Input parsing, output formatting, routing | Domain, Application | Infrastructure directly |
| **Application** (service, use case, orchestrator) | Workflow orchestration, transaction scope | Domain | Infrastructure directly |
| **Domain** (entity, value object, domain service) | Business rules, invariants | Nothing (or shared types) | Application, Infrastructure, Presentation |
| **Infrastructure** (database, HTTP client, file system) | External system access | Domain interfaces (via DI) | Application, Presentation |

- **Cross-layer calls must go top-down or through interfaces.** Never call upward directly.
- **Domain is the innermost layer** — it must not depend on anything outside itself.

## Decision Rules

1. **If extracting a responsibility creates more ceremony than clarity, defer it.** A 20-line function with two small concerns is fine. A 200-line function with two concerns is not.
2. **Name each new unit after its single responsibility.** If you cannot name it without "and" or "manager", keep splitting.
3. **Do not separate for symmetry.** Separate only when a concrete pain (testing difficulty, change coupling, readability) justifies it.
