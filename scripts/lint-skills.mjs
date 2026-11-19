#!/usr/bin/env node
/**
 * Validate skills and keep the docs index in sync.
 *
 * Checks:
 *   - every SKILL.md has frontmatter with `name`, `description`, `metadata.author`, `metadata.version`
 *   - no unknown top-level frontmatter keys
 *   - skill names are unique, kebab-case, and description length is reasonable
 *   - relative Markdown links in skills/** and docs/** and README* resolve
 *   - the generated skill list in docs/skills*.md is up to date
 *
 * Usage:
 *   node scripts/lint-skills.mjs          # check only
 *   node scripts/lint-skills.mjs --write  # regenerate docs index blocks
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const write = process.argv.includes('--write');
const errors = [];

const ALLOWED_KEYS = new Set(['name', 'description', 'metadata', 'license', 'allowed-tools', 'compatibility']);
const MAX_DESCRIPTION = 1024;
const NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const START = '<!-- skills:start -->';
const END = '<!-- skills:end -->';

function walk(dir, predicate, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, predicate, out);
    else if (predicate(full)) out.push(full);
  }
  return out;
}

const rel = (file) => relative(ROOT, file);

function parseFrontmatter(file) {
  const text = readFileSync(file, 'utf8');
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) {
    errors.push(`${rel(file)}: missing frontmatter`);
    return null;
  }
  const data = { metadata: {} };
  let inMetadata = false;
  for (const line of match[1].split('\n')) {
    const top = line.match(/^([\w-]+):\s*(.*)$/);
    const nested = line.match(/^\s+([\w-]+):\s*(.*)$/);
    if (top) {
      inMetadata = top[1] === 'metadata';
      if (!ALLOWED_KEYS.has(top[1])) errors.push(`${rel(file)}: unknown frontmatter key \`${top[1]}\``);
      if (!inMetadata) data[top[1]] = unquote(top[2]);
    } else if (nested && inMetadata) {
      data.metadata[nested[1]] = unquote(nested[2]);
    }
  }
  return data;
}

function unquote(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith('"')) return JSON.parse(trimmed);
  if (trimmed.startsWith("'")) return trimmed.slice(1, -1).replaceAll("''", "'");
  return trimmed;
}

// --- skills ---------------------------------------------------------------

const skillFiles = walk(join(ROOT, 'skills'), (file) => file.endsWith('/SKILL.md')).sort();
const skills = [];
const seenNames = new Map();

for (const file of skillFiles) {
  const fm = parseFrontmatter(file);
  if (!fm) continue;
  const where = rel(file);

  for (const key of ['name', 'description']) if (!fm[key]) errors.push(`${where}: missing \`${key}\``);
  for (const key of ['author', 'version']) if (!fm.metadata[key]) errors.push(`${where}: missing \`metadata.${key}\``);

  if (fm.name && !NAME_PATTERN.test(fm.name)) errors.push(`${where}: name \`${fm.name}\` is not kebab-case`);
  if (fm.name && seenNames.has(fm.name)) errors.push(`${where}: duplicate name \`${fm.name}\` (also in ${seenNames.get(fm.name)})`);
  if (fm.name) seenNames.set(fm.name, where);
  if (fm.description && fm.description.length > MAX_DESCRIPTION) {
    errors.push(`${where}: description is ${fm.description.length} chars (max ${MAX_DESCRIPTION})`);
  }

  const dir = dirname(file);
  const resources = walk(dir, (f) => f !== file && !f.includes('/_shared/'))
    .map((f) => relative(dir, f))
    .sort();
  skills.push({ ...fm, path: relative(join(ROOT, 'skills'), dir), file: where, resources });
}

// --- links ----------------------------------------------------------------

const markdownFiles = [
  ...walk(join(ROOT, 'skills'), (f) => f.endsWith('.md')),
  ...walk(join(ROOT, 'docs'), (f) => f.endsWith('.md')),
  ...readdirSync(ROOT).filter((f) => f.endsWith('.md')).map((f) => join(ROOT, f)),
];

for (const file of markdownFiles) {
  const text = readFileSync(file, 'utf8').replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
  for (const [, target] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    const path = decodeURIComponent(target.split('#')[0]);
    if (!existsSync(resolve(dirname(file), path))) errors.push(`${rel(file)}: broken link -> ${target}`);
  }
}

// --- docs index -----------------------------------------------------------

function renderIndex(labels) {
  const groups = Map.groupBy(skills, (skill) => skill.path.split('/')[0]);
  const lines = [];
  for (const [group, items] of [...groups].sort(([a], [b]) => a.localeCompare(b))) {
    lines.push(`### ${group}`, '');
    for (const skill of items) {
      lines.push(`- **\`${skill.name}\`** — [\`skills/${skill.path}\`](../skills/${skill.path}/SKILL.md)`);
      if (labels.description) lines.push(`  - ${skill.description}`);
      for (const resource of skill.resources) {
        lines.push(`  - ${labels.resource}: [\`${resource}\`](../skills/${skill.path}/${resource})`);
      }
    }
    lines.push('');
  }
  return lines.join('\n').trimEnd();
}

const indexDocs = [
  { file: join(ROOT, 'docs/skills.md'), labels: { description: true, resource: 'File' } },
  { file: join(ROOT, 'docs/skills.zh-CN.md'), labels: { description: false, resource: '文件' } },
];

for (const { file, labels } of indexDocs) {
  if (!existsSync(file)) {
    errors.push(`${rel(file)}: missing`);
    continue;
  }
  const text = readFileSync(file, 'utf8');
  const start = text.indexOf(START);
  const end = text.indexOf(END);
  if (start === -1 || end === -1) {
    errors.push(`${rel(file)}: missing ${START} / ${END} markers`);
    continue;
  }
  const next = `${text.slice(0, start + START.length)}\n\n${renderIndex(labels)}\n\n${text.slice(end)}`;
  if (next === text) continue;
  if (write) writeFileSync(file, next);
  else errors.push(`${rel(file)}: skill index is stale (run \`node scripts/lint-skills.mjs --write\`)`);
}

// --- report ---------------------------------------------------------------

if (errors.length > 0) {
  console.error(`Skill lint failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`Skill lint passed (${skills.length} skills).`);
