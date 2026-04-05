# TSX Style Guide

Apply all rules in [ts-style.md](./ts-style.md) first.

This document only adds TSX-specific conventions for component structure and JSX rendering.

For DOM accessibility rules, also apply [dom-a11y-style.md](./dom-a11y-style.md).

## TSX Non-Negotiables

- Do not use nested ternary expressions in JSX.
- Do not place multi-step business logic directly inside JSX.
- Do not use inline IIFEs in JSX.
- Do not encode component modes with multiple boolean props when a single discriminant prop can represent the mode.

## Conditional Rendering

- Keep branches flat and JSX shallow.
- Use ternaries only when both branches are single JSX expressions and the full ternary fits on one line.
- If there are 3 or more mutually exclusive UI states, use early returns, a named render variable, a render helper, or a discriminated union status model.
- Extract complex conditional rendering before the `return` block.

Allowed:

```tsx
return isLoading ? <Spinner /> : <Content />;
```

Not allowed:

```tsx
return isLoading ? (
  <Spinner />
) : hasError ? (
  <ErrorState />
) : (
  <Content />
);
```

Preferred rewrite:

```tsx
if (isLoading) {
  return <Spinner />;
}

if (hasError) {
  return <ErrorState />;
}

return <Content />;
```

## Component Design

- Keep non-render declarations above the `return` block and keep the `return` block focused on markup.
- Extract a subcomponent when one `return` block contains repeated markup or multiple distinct UI sections.

## Props and Component API

- Keep prop APIs explicit. Each prop should map to one responsibility.
- Prefer explicit props over catch-all bags.
- Pass only the fields a child reads instead of the full object whenever possible.
- Destructure props in the function parameter only when the component uses up to five props and does not rename them.
- If a component uses more than five props or renames props, accept `props` and destructure inside the function body.
- Do not combine booleans to represent mutually exclusive modes. Prefer a variant union.

Prefer:

```tsx
type ButtonProps =
  | { variant: "link"; href: string; onClick?: never }
  | { variant: "button"; onClick: () => void; href?: never };
```

Over:

```tsx
type ButtonProps = {
  isLink?: boolean;
  href?: string;
  onClick?: () => void;
};
```

## JSX Structure

- Keep JSX declarative. Compute data before `return`.
- Avoid large anonymous functions inside JSX props.
- Extract complex expressions into named variables before the return block.
- Prefer semantic HTML elements over generic wrappers.
- Use fragments only when adding a DOM wrapper would change semantics or layout.
- Use `condition && <Node />` only for a single optional node without an `else` branch. Use a ternary or early return when an alternative branch exists.
- Use stable keys for lists. Do not use array index as key when order can change.

Prefer:

```tsx
const emptyState = items.length === 0;
const content = emptyState ? <EmptyState /> : <ItemList items={items} />;

return <section>{content}</section>;
```

Over:

```tsx
return (
  <section>
    {items.length === 0 ? <EmptyState /> : <ItemList items={items} />}
  </section>
);
```

## Event Handlers

- Inline handlers may contain a single call expression. Otherwise, extract a named function.
- If a handler contains branching, async work, or multiple statements, extract it to a named function.
- Keep handler names specific: `handleSubmit`, `handleRetry`, `handleItemSelect`.

Prefer:

```tsx
function handleRetry(): void {
  void refetch();
}

return <button onClick={handleRetry}>Retry</button>;
```

Over:

```tsx
return <button onClick={() => void refetch()}>Retry</button>;
```

## Review Checklist

When reviewing TSX, flag these first:

- nested ternaries
- complex logic embedded in JSX
- repeated markup or multiple distinct UI sections packed into one `return` block
- unstable list keys
- boolean prop combinations that should be a variant union

## Decision Rule

After applying the TypeScript rules, choose the TSX structure with fewer conditional branches inside JSX and fewer indirections between state and markup.
