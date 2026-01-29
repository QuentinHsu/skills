---
name: translate-i18n-from-en
description: Sync locales (补翻) and extract hardcoded text to i18n
metadata:
  author: QuentinHsu
  version: "2026.1.29"
---

# Translate i18n from en

Two workflows for i18n. Paths and target locales are read from **project root .env** (see Configuration below) so the Skill works in any repo layout. Each workflow is a separate rule; read the corresponding rule file for full steps.

## When to apply

- **Sync / 补翻:** User asks to sync locales from en, 补翻, translate i18n to other languages, or fix en.json duplicate keys and supplement missing keys.
- **Page i18n:** User asks to i18n a page’s hardcoded text, 当前页面硬编码 i18n, or 某页面文案做国际化.

## Configuration (shared)

Read **project root .env** (the repository root, not a subfolder). Optional variables — **all paths relative to project root**:

| Variable | Default | Description |
|----------|---------|-------------|
| `I18N_LOCALES_DIR` | `web/src/i18n/locales` | Directory containing locale JSON files. |
| `I18N_SOURCE_LOCALE` | `en` | Source locale code (file: `{I18N_LOCALES_DIR}/{I18N_SOURCE_LOCALE}.json`). |
| `I18N_TARGET_LOCALES` | `fr,ja,ru,vi,zh` | Comma-separated target locale codes to supplement. |

If a variable is missing or root .env doesn't exist, use the defaults above. .env is usually not committed, so per-machine overrides stay local.

## Rule categories

| Rule | Trigger | Description |
|------|---------|-------------|
| `i18n-sync-locales` | 补翻 / sync locales / translate i18n from en | Dedup source JSON, then supplement missing keys in target locale files with translations. |
| `i18n-page-hardcoded-text` | 当前页面硬编码 i18n / 某页面文案做国际化 | Find hardcoded UI text on a page, add keys to source locale, replace with `t('...')`. |

## Quick reference

### 1. Sync source locale to others (补翻)

- **Rule file:** [rules/i18n-sync-locales.md](rules/i18n-sync-locales.md)
- **Triggers:** "按 en 补翻/同步 i18n 到其他语言", "Translate i18n from en", "Sync locales from en", "检查 en.json 重复 key 并补翻缺失的 key"
- **Steps:** Resolve config → Dedup source JSON (one-liner) → For each target locale: find missing keys, translate, merge in source key order, write.

### 2. i18n hardcoded text on a page

- **Rule file:** [rules/i18n-page-hardcoded-text.md](rules/i18n-page-hardcoded-text.md)
- **Triggers:** "当前页面硬编码 i18n", "某页面文案做国际化", "i18n this page's text", "把这一页的硬编码文案做成 i18n"
- **Steps:** Identify page → Find hardcoded UI text (JSX children, placeholder, aria-label, toast, etc.) → Add keys to source locale JSON, replace in code with `t('string')`, add `useTranslation()` if needed.

## How to use

- Match the user’s request to one of the triggers above.
- Read the corresponding rule file for full step-by-step instructions:
  - [rules/i18n-sync-locales.md](rules/i18n-sync-locales.md)
  - [rules/i18n-page-hardcoded-text.md](rules/i18n-page-hardcoded-text.md)
- Each rule file contains: when to use, config reference (this SKILL.md), and detailed steps with conventions.
