#!/usr/bin/env node
/**
 * Distribute shared guidance into each skill so single-skill installs keep
 * working relative links.
 *
 * Source of truth: `skills/<group>/_shared/*.md`.
 * Each sibling skill (`skills/<group>/<skill>/SKILL.md`) receives only the
 * shared files it references (transitively), in `skills/<group>/<skill>/_shared/`.
 *
 * Usage:
 *   node scripts/sync-shared.mjs          # write copies
 *   node scripts/sync-shared.mjs --check  # fail if copies are missing, stale, or unused
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SKILLS_DIR = join(ROOT, 'skills');
const SHARED = '_shared';
const REF_PATTERN = /_shared\/([\w.-]+\.md)/g;
const check = process.argv.includes('--check');

const subdirs = (dir) =>
  readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(dir, entry.name));

const refsIn = (text) => new Set([...text.matchAll(REF_PATTERN)].map((match) => match[1]));

function collectGroups(dir) {
  const groups = [];
  for (const child of subdirs(dir)) {
    if (existsSync(join(child, SHARED)) && !existsSync(join(child, 'SKILL.md'))) groups.push(child);
    else groups.push(...collectGroups(child));
  }
  return groups;
}

function resolveRefs(sourceDir, seeds) {
  const needed = new Set();
  const queue = [...seeds];
  while (queue.length > 0) {
    const name = queue.pop();
    if (needed.has(name)) continue;
    const file = join(sourceDir, name);
    if (!existsSync(file)) throw new Error(`Missing shared file: ${relative(ROOT, file)}`);
    needed.add(name);
    queue.push(...refsIn(readFileSync(file, 'utf8')));
  }
  return needed;
}

const problems = [];

for (const group of collectGroups(SKILLS_DIR)) {
  const sourceDir = join(group, SHARED);

  for (const skillDir of subdirs(group)) {
    const skillFile = join(skillDir, 'SKILL.md');
    if (!existsSync(skillFile)) continue;

    const targetDir = join(skillDir, SHARED);
    const needed = resolveRefs(sourceDir, refsIn(readFileSync(skillFile, 'utf8')));
    const present = existsSync(targetDir) ? readdirSync(targetDir) : [];

    for (const name of needed) {
      const expected = readFileSync(join(sourceDir, name), 'utf8');
      const target = join(targetDir, name);
      if (existsSync(target) && readFileSync(target, 'utf8') === expected) continue;
      if (check) problems.push(`stale or missing: ${relative(ROOT, target)}`);
      else {
        mkdirSync(targetDir, { recursive: true });
        writeFileSync(target, expected);
      }
    }

    for (const name of present.filter((name) => !needed.has(name))) {
      const target = join(targetDir, name);
      if (check) problems.push(`unused: ${relative(ROOT, target)}`);
      else rmSync(target);
    }

    if (!check && needed.size === 0 && existsSync(targetDir)) rmSync(targetDir, { recursive: true });
  }
}

if (problems.length > 0) {
  console.error(`Shared files out of sync (run \`node scripts/sync-shared.mjs\`):\n- ${problems.join('\n- ')}`);
  process.exit(1);
}

console.log(check ? 'Shared files are in sync.' : 'Shared files synced.');
