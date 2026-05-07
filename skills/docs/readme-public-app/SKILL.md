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
3. **Inspect user-facing language.** For apps with localization, read strings files such as `Localizable.strings`, `*.lproj`, `locales/`, `i18n/`, or UI label constants so README workflows use the actual button, menu, tab, and page names in each language.
4. **Classify the project.** Choose the dominant type from the project type table. Borrow sections from secondary types only when the repository clearly supports them.
5. **Choose language output.** Follow the user's requested language first. Otherwise use the language strategy below.
6. **Draft or update.** Preserve accurate existing content and user-specific sections. Rewrite stale, duplicated, or misleading content.
7. **Verify.** Check referenced paths, commands, links, badges, env vars, localized UI terms, and bilingual structure before finalizing.

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
- The two files must have matching section structure in the same order, but section titles should be naturally localized unless they are product names, standards, or commonly untranslated labels.
- Write the English and Chinese versions independently in their respective languages. Do not copy one version and relabel it.
- Under `中文`, use Simplified Chinese. Keep code symbols, file names, commands, config keys, and literal identifiers in their original form.
- Translate user-facing UI labels in the localized README to the app's actual localized wording when available. Examples: use `添加配置`, `设为当前`, `概览`, and `刷新` when those are the strings shown in the Simplified Chinese UI, instead of leaving English labels such as `Add Configuration`, `Set Current`, `Overview`, or `Refresh`.
- Keep technical identifiers in their original form: file paths, commands, environment variables, config keys, package names, route paths, enum cases, and literal values. For terms that are both UI labels and technical concepts, prefer the actual localized UI string in workflow steps and the original code symbol in tables or config references.
- Localize narrative terminology when it is not a code symbol. For example, in Simplified Chinese prefer `配置` or `供应商` over unexplained `profile` or `provider` unless the product UI intentionally uses the English term.

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
- When the user provides a repository URL, derive GitHub badges and Star History links from that owner/repo. If no public repository can be verified or inferred, omit repository-dependent badges and charts.
- Do not add release/download badges unless the repository location is known. It is acceptable for those badges to show no releases or downloads for a new public repository, but the owner/repo must be correct.
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

- **Style references:** when the user points to another README as a style reference, emulate its structure, density, and visual treatment only where appropriate. Do not copy unsupported claims, features, update mechanisms, badges, install channels, screenshots, or project-specific workflows from the reference.
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
- In localized READMEs, translate headings, workflow verbs, button/menu names, and ordinary product terminology into the target language when the project has matching localized strings. Do not leave English UI text in a localized workflow unless that exact English text appears in the target-language UI.
- Preserve English only for code-native content and established product names: `make run`, `~/.codex/config.toml`, `OPENAI_API_KEY`, `model_providers.agents-hub`, `SwiftPM`, `Claude Code`, `Codex`, and similar literal identifiers.
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
- Localized READMEs use localized section headings and actual localized UI labels where the project provides them, while code identifiers remain unchanged.
- Internal docs do not leak private URLs, tokens, internal hostnames, or VPN-only links into a public README.

If you cannot run a command or verify a claim, state that limitation briefly in the final response instead of presenting the claim as verified.

## Output Expectations

Write or update the README file(s) directly when the user asks for implementation. In the final response, summarize what changed and list any validation that was performed.

If the user only asks for a draft in chat, return ready-to-use Markdown and keep it grounded in the available project context.
