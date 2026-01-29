---
title: Sync source locale to others (补翻 / sync locales)
impact: HIGH
tags: i18n, sync, locales, translation, 补翻
---

# Sync source locale to others (补翻 / sync locales)

Ensure the source locale JSON has no duplicate keys, then supplement missing translation keys in all target locale files. Paths and target locales are read from **project root .env** (see Configuration in [SKILL.md](../SKILL.md)).

## When to use

- User says: "按 en 补翻/同步 i18n 到其他语言", "Translate i18n from en", "Sync locales from en", "检查 en.json 重复 key 并补翻缺失的 key"

## Step 0: Resolve config

- Read **project root .env** if present. Parse `I18N_LOCALES_DIR`, `I18N_SOURCE_LOCALE`, `I18N_TARGET_LOCALES` (strip quotes/spaces). Use defaults from SKILL.md when unset.
- Source file: **{I18N_LOCALES_DIR}/{I18N_SOURCE_LOCALE}.json** (relative to project root).
- Target locales: split `I18N_TARGET_LOCALES` by comma and trim (e.g. `fr`, `ja`, `ru`, `vi`, `zh`).

## Step 1: Ensure source JSON has no duplicate keys

**Why:** JSON allows duplicate keys; parsers keep the last. Rewriting from the parsed object removes duplicate key declarations.

**How:** From **project root**, run this one-liner. It reads root `.env`, parses I18N_* vars (with defaults), then deduplicates the source file:

```bash
node -e "
const fs=require('fs');
const path=require('path');
const root=process.cwd();
const env={};
try{ fs.readFileSync(path.join(root,'.env'),'utf8').split('\n').forEach(l=>{ const m=l.match(/^I18N_(\\w+)=(.*)$/); if(m) env[m[1]]=m[2].trim().replace(/^[\"']|[\"']$/g,''); }); }catch(e){}
const dir=path.join(root,env.LOCALES_DIR||'web/src/i18n/locales');
const src=env.SOURCE_LOCALE||'en';
const f=path.join(dir,src+'.json');
const p=JSON.parse(fs.readFileSync(f,'utf8'));
fs.writeFileSync(f,JSON.stringify(p,null,2)+'\n');
console.log('Deduped',f);
"
```

Optionally inspect before/after: read the source file and confirm each key appears only once inside `translation`.

## Step 2: Supplement missing keys with translations

For each target locale `L` (from resolved `I18N_TARGET_LOCALES`):

1. **Read** source file **{I18N_LOCALES_DIR}/{I18N_SOURCE_LOCALE}.json** and **{I18N_LOCALES_DIR}/L.json** (paths relative to project root). Parse the `translation` object from each.
2. **Missing keys:** `missing = Object.keys(source.translation).filter(k => !(k in L.translation))`.
3. **Translate:** For each key in `missing`, take the source (e.g. English) value, translate to the target language. Keep keys unchanged. Preserve placeholders like `{{x}}`, `{0}`, and brand/code terms (e.g. API, JSON, gpt-4) per locale norms.
4. **Merge:** Build the new `translation` object by iterating **in source key order**: for each key, use `L.translation[key]` if present, otherwise the translated value. Same key set and order as source.
5. **Write** **{I18N_LOCALES_DIR}/L.json** as `{ "translation": <merged object> }` with 2-space indent (path relative to project root).

Use Read to load root .env and the JSON files, compute missing and merged object, then Write the updated locale file.

## Step 3: Optional verification

- Spot-check the source file for no duplicate keys inside `translation`.
- Open one updated locale file and confirm structure and a few translated strings.

## Conventions

- Do not change keys; only add missing keys and set their translated value.
- Preserve JSON: `{ "translation": { ... } }`, 2-space indent.
- Acronyms / product names / code: keep or adapt per locale; do not blindly translate.
