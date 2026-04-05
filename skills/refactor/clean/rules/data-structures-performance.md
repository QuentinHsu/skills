# Data Structures and Performance

## Core Principle

Choose the data structure and algorithm that naturally fits the access pattern. Often the clearest code is also the fastest code — a better structure eliminates accidental complexity and unnecessary work simultaneously.

Performance refactoring is still behavior-preserving. The code must produce the same results; only the resource cost changes.

## Choose the Right Collection

### Lookup by Key → Use a Map / Dictionary / Hash Table

- When code scans a list to find an element by a property, build a map keyed by that property instead.
- This turns O(n) search per lookup into O(1) amortized.

Prefer:

```
userById = { u.id: u for u in users }
target = userById[targetId]
```

Over:

```
for u in users:
    if u.id == targetId:
        target = u
        break
```

### Membership Testing → Use a Set

- When code checks whether a value exists in a collection, use a set (or hash set) rather than a list.
- `x in set` is O(1); `x in list` is O(n).

### Sorted Access or Range Queries → Use a Sorted Structure

- When code frequently needs min, max, range, or ordered iteration, choose a sorted collection (tree map, sorted set, priority queue / heap).
- Do not sort a list repeatedly inside a loop when a single sorted structure would maintain order.

### FIFO / LIFO → Use a Queue / Stack

- When code uses a list but only appends and pops from one or both ends, replace with a deque, queue, or stack for O(1) operations and clearer intent.

## Eliminate Redundant Work

### Replace Nested Loops with Hash-Based Joins

- When two collections are matched by a shared key via nested loops (O(n×m)), index one collection into a map first, then iterate the other with O(1) lookups (O(n+m)).

Prefer:

```
orderMap = groupBy(orders, o => o.customerId)
for customer in customers:
    customerOrders = orderMap[customer.id]
```

Over:

```
for customer in customers:
    for order in orders:
        if order.customerId == customer.id:
            ...
```

### Cache / Memoize Expensive Computations

- When the same pure computation is called with the same inputs multiple times, cache the result.
- Use language-provided memoization decorators or a simple map cache.
- Only memoize pure functions — functions with side effects must not be cached.

### Avoid Repeated Computation in Loops

- Hoist invariant computations out of the loop body.
- Precompute derived values before the loop instead of recomputing them on each iteration.

Prefer:

```
threshold = config.baseRate * multiplier
for item in items:
    if item.value > threshold:
        ...
```

Over:

```
for item in items:
    if item.value > config.baseRate * multiplier:
        ...
```

### Batch Operations

- When code performs N individual operations (queries, API calls, file writes) inside a loop, consolidate into a single batch operation when the API supports it.
- Prefer `INSERT INTO ... VALUES (batch)` over N individual inserts.
- Prefer `fetchAll(ids)` over N calls to `fetch(id)`.

## Optimize String and Collection Building

### String Concatenation in Loops → Join / Builder

- When building a string incrementally inside a loop, use a join operation on a list or a string builder instead of repeated `+` / `concat`.
- In many languages repeated concatenation is O(n²) due to reallocation; join is O(n).

### Pre-Size Collections When Length Is Known

- When the final size of a list or map is known upfront, allocate with that capacity to avoid repeated resizing.

## Simplify Algorithmic Complexity

### Replace Linear Search on Sorted Data → Binary Search

- When data is already sorted (or can be sorted once), use binary search (O(log n)) instead of linear scan (O(n)) for lookups.

### Early Termination

- Break out of loops as soon as the answer is found instead of scanning remaining elements.
- Use short-circuit evaluation in conditions: place cheap checks before expensive ones.

### Lazy Evaluation

- When not all results are needed (e.g., first match, top-K, paginated results), use lazy iteration (generators, streams, iterators) to avoid computing the full result set.

## Decision Rules

1. **Profile before optimizing.** Do not guess at bottlenecks. If the user reports a performance problem, identify the hot path first.
2. **Correctness over speed.** Never sacrifice correct behavior for performance. If an optimization changes edge-case behavior, it is a bug.
3. **Clarity is the tiebreaker.** When two approaches have the same complexity, choose the one that is easier to read.
4. **Do not optimize cold paths.** Code that runs once at startup or handles rare error cases does not need to be fast — it needs to be clear.
5. **Document non-obvious complexity choices.** When using a less intuitive structure for performance reasons (e.g., a bitset instead of a set), add a brief comment explaining the tradeoff.
6. **Avoid premature generalization.** Do not add caching, pooling, or complex data structures "just in case." Add them when measurement shows a need.
