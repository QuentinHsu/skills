# Async and Concurrency

## Core Principle

Modern concurrency primitives (async/await, structured concurrency, channels) make asynchronous code read like sequential code. Replace older patterns that scatter control flow across callbacks, event handlers, or manual promise chains.

## Callback → Promise → Async/Await

### Step 1: Callback to Promise

- Wrap callback-based APIs in a Promise (or use the language's equivalent promisify utility) when async/await is the target pattern.
- The wrapper should preserve the original error semantics: if the callback receives an error argument, the promise should reject.

### Step 2: Promise Chain to Async/Await

- Replace `.then().catch()` chains with `try { await ... } catch { ... }`.
- Flatten nested `.then` callbacks into sequential `await` statements.
- Keep `await` calls sequential when they depend on each other; use `Promise.all` / concurrent primitives when they are independent.

Prefer:

```js
const user = await fetchUser(id)
const orders = await fetchOrders(user.accountId)
return { user, orders }
```

Over:

```js
return fetchUser(id)
  .then(user =>
    fetchOrders(user.accountId)
      .then(orders => ({ user, orders }))
  )
```

### Independent Concurrent Operations

- Use `Promise.all` / `Promise.allSettled` (JS), `asyncio.gather` (Python), `errgroup` (Go), `tokio::join!` (Rust) for independent async operations.
- Do not `await` independent operations sequentially — this serializes work unnecessarily.

Prefer:

```js
const [user, config] = await Promise.all([
  fetchUser(id),
  fetchConfig()
])
```

Over:

```js
const user = await fetchUser(id)
const config = await fetchConfig()  // waits for user first — unnecessary
```

## Event Emitter → Async Iteration

- When consuming a stream of events, prefer async iterators (`for await ... of`) over manual `.on('data', callback)` patterns.
- This applies to Node.js streams, WebSocket messages, server-sent events, and similar push-based sources.

## Manual Thread/Lock Patterns → Structured Concurrency

- **Replace raw thread spawning** with structured concurrency primitives (Go goroutines + `errgroup`, Python `asyncio.TaskGroup`, Kotlin `coroutineScope`, Swift `TaskGroup`, Java virtual threads).
- **Replace manual lock management** with channels, actors, or concurrent data structures when the language provides them.
- **Prefer message passing over shared mutable state** when the language supports channels or actors (Go, Rust, Erlang/Elixir, Kotlin).

## Resource Cleanup in Async Code

- Use `try/finally`, `defer`, `using`, `async with`, or structured concurrency scopes to ensure resources are released even when async operations fail.
- When converting callback-based code that had cleanup in an `on('close')` handler, ensure the cleanup is preserved in the async equivalent.

## Error Handling in Async Code

- **Catch errors at the appropriate level.** Convert `.catch()` callbacks to `try/catch` blocks around the `await`.
- **Do not swallow errors silently.** If the callback version ignored errors, flag this as a pre-existing issue rather than preserving the behavior.
- **Handle partial failures** in concurrent operations. Prefer `Promise.allSettled` when some operations may fail independently.
- **Avoid unhandled promise rejections.** Every async call path must have error handling or be wrapped in a scope that catches.

## Decision Rules

1. **Do not convert sync code to async.** Only modernize code that is already asynchronous. Adding `async` where none existed is a feature change, not modernization.
2. **Match the project's async style.** If the project uses async/await everywhere, convert remaining callbacks. If the project intentionally uses streams/observables for specific patterns, do not flatten those to await.
3. **Parallel is not always faster.** Only parallelize operations that are truly independent and I/O-bound. CPU-bound parallel work needs thread-level concurrency, not async.
