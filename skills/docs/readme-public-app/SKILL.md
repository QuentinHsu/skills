---
name: readme-public-app
description: Generate or update README files for public-facing apps, libraries, CLI tools, API services, monorepos, internal tools, skills, and plugins. Use this skill when the user asks to write, generate, polish, or update README/project documentation, generate docs from code, or says things like '写 README', '生成项目文档', '帮我整理 README', 'write a README', 'create project docs', 'generate readme for this project'.
metadata:
  author: QuentinHsu
  version: "2026.05.04"
---

# Public App README

Generate accurate, polished README files for projects intended to be used, installed, or evaluated by other people.

The README is a product surface. Make it clear what the project does, who it is for, how to start, and where to look next. Prefer verified facts from the repository over generic documentation filler.

## Workflow

1. **Gather context.** Read manifests such as `package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`, `Package.swift`, `Makefile`, `justfile`, CI config, Docker files, `.env.example`, license files, and existing README files.
2. **Inspect behavior.** Scan entry points, exported APIs, CLI definitions, route files, UI app config, plugin manifests, `SKILL.md`, or workspace/package layout to understand what the project actually provides.
3. **Classify the project.** Choose the dominant type from the project type table. Borrow sections from secondary types only when the repository clearly supports them.
4. **Choose language output.** Follow the user's requested language first. Otherwise use the language strategy below.
5. **Draft or update.** Preserve accurate existing content and user-specific sections. Rewrite stale, duplicated, or misleading content.
6. **Verify.** Check referenced paths, commands, links, badges, env vars, and bilingual structure before finalizing.

If information is missing, either omit that section or mark it as a short factual TODO only when the user explicitly wants placeholders. Do not invent features, install methods, screenshots, compatibility claims, benchmarks, download badges, or license names.

## Project Types

| Type | Signals | Reader goal | Required sections |
| --- | --- | --- | --- |
| `library` | exported API, package registry manifest, no primary `bin` | install and use the API | title, installation, usage, API, license |
| `cli-tool` | `bin`, `--help`, arg parser, shell completion | install, run commands, configure | title, installation, quick start, commands, configuration, license |
| `app` | GUI, Electron/Tauri/Xcode/web app config, user-facing screenshots | understand, install, start using | header, requirements, quick start, features, build, license |
| `api-service` | route definitions, OpenAPI, server framework, port binding | run locally and call endpoints | title, requirements, setup, API, environment variables, deploy, license |
| `monorepo` | workspaces, `packages/`, `apps/`, Nx/Turbo/Lerna | understand packages and dev flow | title, packages, getting started, development, license |
| `internal-tool` | `private: true`, internal URLs, team workflow, VPN/env dependency | set up and operate safely | title, purpose, setup, usage, environment variables, owner |
| `skill/plugin` | `SKILL.md`, plugin manifest, host-system entry point | install extension and know when it applies | title, what it does, install, usage/triggers, structure, examples, license |

## Language Strategy

Use the user's requested language if stated.

Default choices:

| Context | Default |
| --- | --- |
| Public package, CLI, API, or app with international audience | English only |
| Project already has bilingual docs | Preserve bilingual output |
| Chinese-first public project or Chinese-speaking team | Simplified Chinese |
| Internal mixed-language team | English only |
| User requests bilingual output | `README.md` in English and `README.zh-CN.md` in Simplified Chinese |

For bilingual output:

- Put a language switcher at the top of each file:
  - `English | [简体中文](README.zh-CN.md)` in `README.md`
  - `[English](README.md) | 简体中文` in `README.zh-CN.md`
- The two files must have matching sections in the same order.
- Write the English and Chinese versions independently in their respective languages. Do not copy one version and relabel it.
- Under `中文`, use Simplified Chinese. Keep code symbols, file names, commands, and UI labels in their original form.

## Structure Rules

### Header

Use a centered header for polished public projects when a logo or badges can be verified:

```markdown
<div align="center">

<img src="path/to/logo.png" width="180" alt="Project Name logo" />

# Project Name

One concise sentence describing what the project does and who it is for.

<p>
  <img alt="License" src="https://img.shields.io/github/license/owner/repo?style=flat" />
</p>

</div>
```

Use a plain heading for internal tools, minimal libraries, or projects without verified visual assets:

```markdown
# Project Name

One concise sentence describing what the project does and who it is for.
```

Badge rules:

- Use only badges backed by real project data.
- Prefer license, package version, supported platform/runtime, CI status, or release version.
- Avoid vanity badges unless the existing README already uses them or the user requests them.

### Sections By Type

Use this as the default order. Skip optional sections when unsupported by the repository.

| Type | Section order |
| --- | --- |
| `library` | Installation -> Usage -> API -> Configuration -> Requirements -> Build from source -> License |
| `cli-tool` | Installation -> Quick Start -> Commands -> Configuration -> Examples -> Build from source -> License |
| `app` | Requirements -> Quick Start -> Features -> Screenshots -> Build locally -> Star History -> License |
| `api-service` | Requirements -> Setup -> API -> Environment Variables -> Deploy -> License |
| `monorepo` | Packages -> Getting Started -> Development -> Architecture -> License |
| `internal-tool` | Purpose -> Setup -> Usage -> Environment Variables -> Deploy -> Troubleshooting -> Owner |
| `skill/plugin` | What It Does -> Install -> Usage / When It Triggers -> File Format / Structure -> Examples -> License |

### Section Content

- **Installation / Setup:** derive commands from manifests, lockfiles, Docker files, or existing docs.
- **Quick Start:** give the shortest path from clean checkout or installation to a working result, usually 3-6 numbered steps.
- **Usage:** show real commands, imports, API calls, UI flows, or workflows from the codebase.
- **API / Commands:** document public entry points, flags, options, request/response shapes, and exported functions that can be verified.
- **Configuration:** include env vars, config files, defaults, and required/optional status when available.
- **Features:** describe actual user-facing capabilities. For apps, use one `###` subsection per major workflow.
- **Packages:** include each package/app path and its role in a compact table.
- **Build / Development:** include install, run, test, lint, typecheck, build, and release commands only when present.
- **License:** link to the actual license file when it exists; otherwise state that no license file was found.

## Writing Rules

- Be factual, concise, and developer-oriented.
- Lead with what the project does, then how to use it.
- Keep paragraphs to 1-3 sentences.
- Use `##` for major sections and `###` for subsections.
- Use fenced code blocks with language hints such as `sh`, `ts`, `json`, `text`, or `yaml`.
- Use inline code for commands, file paths, environment variables, package names, flags, and UI labels.
- Use tables for structured reference data with 2-5 columns.
- Use numbered lists for ordered workflows and bullets for unordered facts.
- Keep terminology aligned with actual code, UI labels, package names, and repository paths.
- Do not use emojis in headings or body text unless the existing project style clearly requires them.
- Avoid hype such as "revolutionary", "blazing fast", "seamless", "powerful", or "beautiful" unless the repository proves the claim with a specific fact.
- Do not include public-facing badges, star history, contributing guidance, or marketing language for `internal-tool` projects unless the user explicitly asks.

## Update Rules

When updating an existing README:

- Preserve accurate setup instructions, links, and custom project-specific sections.
- Keep the user's preferred section order when it is coherent.
- Remove stale commands, broken links, duplicated sections, and unsupported claims.
- Keep migration notes, compatibility warnings, security notes, and troubleshooting entries when still relevant.
- Preserve local style choices unless they reduce accuracy or readability.

## Validation

Before finalizing, verify:

- Referenced files, folders, screenshots, logos, docs, and license links exist.
- Install, run, build, test, and lint commands are defined by the repository or clearly standard for the stack.
- Package names, binary names, import paths, route paths, environment variables, and UI labels match source files.
- Badge URLs point to real owners, repos, packages, or workflows.
- Relative links resolve from the README location.
- Bilingual READMEs have the same section structure and valid language switcher links.
- Internal docs do not leak private URLs, tokens, internal hostnames, or VPN-only links into a public README.

If you cannot run a command or verify a claim, state that limitation briefly in the final response instead of presenting the claim as verified.

## Output Expectations

Write or update the README file(s) directly when the user asks for implementation. In the final response, summarize what changed and list any validation that was performed.

If the user only asks for a draft in chat, return ready-to-use Markdown and keep it grounded in the available project context.
