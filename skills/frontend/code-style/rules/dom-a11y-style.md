# DOM Accessibility Style Guide

Apply these rules to HTML, JSX, and TSX DOM markup.

## Non-Negotiables

- Use native semantic elements before adding ARIA roles or custom interaction wrappers.
- Every interactive element must have an accessible name.
- Do not rely on `title` alone to provide the accessible name of an interactive control.
- Decorative content must be hidden from assistive technology.
- Stateful UI must expose its current state through native attributes or ARIA state.

## Accessible Names

- Buttons and links must have visible text, `aria-label`, or `aria-labelledby`.
- Icon-only buttons and links must provide `aria-label` or `aria-labelledby`.
- Form controls must be associated with a visible `<label>` or an equivalent accessible name.
- Images must use `alt`. Decorative images must use `alt=""`.
- Use `title` only as supplementary information, not as the only label.

Prefer:

```tsx
<button aria-label="Close dialog">
  <CloseIcon aria-hidden="true" />
</button>
```

Over:

```tsx
<button title="Close">
  <CloseIcon />
</button>
```

## Semantic Elements

- Use `button` for actions.
- Use `a` for navigation.
- Use `label` for form control labels.
- Use headings in order to preserve document structure.
- Use lists for repeated list content instead of generic wrapper stacks.

## Interactive Behavior

- If a non-native element is used as an interactive control, provide keyboard support and the required ARIA role.
- Do not attach click handlers to non-interactive elements when a native interactive element can be used instead.
- Disabled state must use native `disabled` where available.
- Expanded, selected, pressed, current, invalid, and busy states must be exposed when the UI communicates those states visually.

## Visibility and Decorative Content

- Mark decorative icons and repeated ornamentation with `aria-hidden="true"` when they should not be announced.
- Do not hide meaningful text or controls from assistive technology.
- When helper text or error text explains a control, connect it with `aria-describedby`.

## Review Checklist

When reviewing DOM accessibility, flag these first:

- interactive elements without an accessible name
- controls labeled only with `title`
- click handlers on non-interactive elements
- images without `alt`
- missing `label`, `aria-label`, or `aria-labelledby` on form controls
- visible state changes with no matching native or ARIA state
- decorative icons announced to assistive technology

## Decision Rule

Choose the markup that exposes the most meaning through native HTML first, then add ARIA only for the pieces native HTML cannot express.
