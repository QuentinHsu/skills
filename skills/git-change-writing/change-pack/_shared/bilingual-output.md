# Bilingual Output Rules

Bilingual output format specification.

## Default Behavior

**Default output:** Both Simplified Chinese + English versions

**Single language:** If user explicitly requests single language, output only requested language

## Format Requirements

### Hard Rules

- Each language uses independent code block
- Add language label (`中文` or `English`) immediately above each code block
- **Never** mix two languages in the same code block
- Content under `中文` label **must** be written in Simplified Chinese
- Content under `English` label **must** be written in English
- The two versions must be independently composed in their respective languages — not one version copied and relabeled

### Semantic Alignment

- Bilingual outputs should stay semantically aligned
- Not word-for-word translation, but expressing the same technical meaning
- Use idiomatic expressions for each language

## Output Templates

### Single Content Block (e.g., branch name, commit message)

```
中文

\`\`\`text
<Chinese content>
\`\`\`

English

\`\`\`text
<English content>
\`\`\`
```

### Multiple Content Blocks (e.g., PR Title + Description)

```
PR Title

中文

\`\`\`text
<Chinese title>
\`\`\`

English

\`\`\`text
<English title>
\`\`\`

PR Description

中文

\`\`\`text
<Chinese description>
\`\`\`

English

\`\`\`text
<English description>
\`\`\`
```

## Examples

### Correct ✅

```
中文

\`\`\`text
feat(auth): 添加 JWT 认证支持
\`\`\`

English

\`\`\`text
feat(auth): add JWT authentication support
\`\`\`
```

### Wrong ❌

```
\`\`\`text
中文: feat(auth): 添加 JWT 认证支持
English: feat(auth): add JWT authentication support
\`\`\`
```

## Notes

- Language label lines must be plain text, not inside code blocks
- Code block type usually uses `text`, unless specific format needed (e.g., `markdown`)
- In final output, do not add other explanatory text, only keep language labels and code blocks
