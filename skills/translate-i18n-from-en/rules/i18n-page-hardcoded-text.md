---
title: i18n hardcoded text on a page
impact: MEDIUM
tags: i18n, hardcoded, page, react-i18next, internationalization
---

# i18n hardcoded text on a page

For a **single page/route**, find all UI-visible hardcoded strings and replace them with i18n keys, **and ensure every used key exists in the source locale JSON**. Paths are read from **project root .env** (see Configuration in [SKILL.md](../SKILL.md)).

## When to use

- User says: "i18n the current page's hardcoded text", "internationalize this page's copy", "i18n this page's text", "make this page's hardcoded copy i18n"

## Summary of commonly missed cases

When doing page i18n, the following scenarios are most often missed; verify each item:

| Case | Issue | Resolution |
|------|-------|------------|
| **1. Column names in visibility dropdown** | After clicking "View" in the top-right of a list, column names show as `created_time`, `used_user_id`, etc. (raw column ids) | Set `meta: { label: t('Column Title') }` on each column in the table column definition (consistent with header); if the column visibility dropdown uses `meta?.label ?? column.id` for display, it depends on this meta |
| **2. Drawer/Modal not in scope** | Only the main list was scanned; "New/Edit" side sheet and delete confirmation modal were missed | Scope = main content + **all Sheet/Drawer/Modal/Dialog opened from this page**. Title, description, form fields, and buttons inside the drawer must all be scanned |
| **3. Form Label/Description in drawer** | Labels, placeholders, and FormDescription in the drawer form are still in English | All FormLabel, placeholder, and FormDescription must use `t('...')`, and **the key must exist in the source locale** |
| **4. Interpolated key not in locale** | Code has `t('Label ({{var}})', { var })` but the locale JSON has no such key | i18next falls back to the key; in non-English locales the UI still shows English. **Every key used in t() must have an entry in the source locale (and be translated to other languages)** |
| **5. Form validation copy** | zod/validation library messages are English strings; after switching language, validation messages stay in English | Use English as the message in the schema (aligned with en key), add that key to source locale; if FormMessage etc. does `t(error.message)` on the message, add translations for other languages |
| **6. Strings passed to shared components** | Literals like `entityName='...'`, `confirmText='...'`, `successTooltip='...'` passed to shared components | Change to `entityName={t('...')}` etc., and add the corresponding key in the locale |

**Core principle:** Not only replace hardcoded text with `t('...')`, but **ensure every key exists in the source locale**; missing keys show the key or English in the UI. Keys with interpolation (e.g. `Label ({{var}})`) must be explicitly added to each locale.

## Step 1: Identify scope (must be covered)

**Page** = the route's main component + **all UI that belongs to this page**:

- **Main content:** table, cards, list, filters, toolbar, pagination.
- **Overlays opened from this page:** Sheet (side drawer), Drawer, Modal, Dialog, Popover — e.g. "New xxx" drawer, edit modal, delete confirmation modal, view dropdown, filter dropdown.  
  → Any drawer/modal/dropdown opened from this page belongs to this page's scope and must be scanned together.
- **Child components:** Components under the same feature that provide UI for this page (same folder or clearly owned by this page).

Do **not** limit to "the currently open file"; scan according to **all entry points the user can see on this page**.

## Step 2: Checklist — scan hardcoded text item by item

For **main content + all overlays above**, check each item: every user-visible string must use `t(...)`, and **every key must exist in the source locale**.

| Location | Check | Example / Note |
|----------|-------|----------------|
| Main content | Title, description, empty state, buttons, table headers, filter placeholders | `title`, `description`, `placeholder`, `aria-label` |
| Toolbar | Search placeholder, filter title, reset button, **column names list after clicking "View"** | Column visibility dropdown = `meta?.label ?? column.id` → column definition needs `meta: { label: t('Column Title') }` |
| Dropdown/Popover | Filter options, row action menu, copy inside Popover | Edit/Delete/Disable, any list that appears on click |
| **Sheet/Drawer/Modal** | **Title, description, FormLabel, placeholder, FormDescription, buttons** | SheetTitle/SheetDescription; form field Label/placeholder/Description; Close, Save, Saving... |
| **Interpolated keys** | `t('Quota ({{currency}})', …)`, `t('Enter the quota amount in {{currency}}', …)` | **Must have a corresponding entry in en.json (and target locales)**; otherwise the key or English is shown |
| Form validation | zod/validation error message | Use English for schema message; add same key to source locale; if error display component calls t() on message, add translations |
| Shared component props | entityName, confirmText, successTooltip, aria-label, etc. | Replace string literals with `t('...')` and add the key |

**Common hardcoded forms:** JSX children, `placeholder`/`aria-label`/`title`/`label`, toast text, strings passed to child components.

**Skip:** Content already inside `t('...')`, variable names/key names/comments, empty strings, short code-only words (unless used as a UI label).

Deduplicate: use one key per distinct user-facing string.

## Step 3: Add keys and replace in code

1. **Resolve config:** Read project root `.env` (if present); get `I18N_LOCALES_DIR`, `I18N_SOURCE_LOCALE` (defaults: `web/src/i18n/locales`, `en`). Source file = **{I18N_LOCALES_DIR}/{I18N_SOURCE_LOCALE}.json** (relative to project root).
2. **For each unique string to internationalize:**
   - Key = English copy (consistent with existing en.json convention); keep placeholders for interpolation, e.g. `"Quota ({{currency}})": "Quota ({{currency}})"`.
   - **If the key is not yet in the source JSON's `translation`, add** `"<key>": "<value>"` (preserve JSON structure and key order).
   - In the component, replace hardcoded text with `t('key')` or `t('key', { var })`; for attributes use e.g. `placeholder={t('Search...')}`, `aria-label={t('Close')}`.
3. **Final check:** Scan all `t('...')` on this page and confirm every key used exists in en.json; add any missing keys.
4. **If component doesn't use i18n yet:** Add `import { useTranslation } from 'react-i18next'` and `const { t } = useTranslation()`.

## Conventions

- Key = English copy (aligned with en.json); use `{{var}}` for interpolation.
- JSON: Keep `{ "translation": { ... } }`, 2-space indent.
- After adding keys, you can run **i18n-sync-locales** to translate into other languages.
