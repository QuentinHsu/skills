# Skills

个人维护的 AI 编程助手技能库，遵循 [Agent Skills](https://agentskills.io/) 规范，可通过 [skills CLI](https://www.npmjs.com/package/skills) 安装到 Cursor、Claude Code、OpenCode 等支持技能的应用中。

## 安装

```bash
pnpx skills add Quentinhsu/skills
```

或使用 npm：

```bash
npx skills add Quentinhsu/skills
```

安装时会提示选择要安装到的 Agent（如 Cursor、Claude Code 等）以及安装范围（当前项目或全局）。也可指定 Agent：

```bash
pnpx skills add Quentinhsu/skills -a cursor
```

## 更新

已安装过本仓库时，再次执行相同的安装命令即可拉取最新技能与规则：

```bash
pnpx skills add Quentinhsu/skills
```

或指定 Agent（如 `-a cursor`）与安装范围，与首次安装时一致。完成后本地技能会更新为仓库当前版本。

## 可用技能

### translate-i18n-from-en

i18n 相关两个工作流：按英文源语言补翻/同步多语言，以及把页面硬编码文案提取为 i18n。

**适用场景：**

- **补翻 / 同步：** 用户说「按 en 补翻」「sync locales from en」「translate i18n to other languages」或要检查 en.json 重复 key 并补全缺失翻译。
- **页面 i18n：** 用户说「当前页面硬编码 i18n」「某页面文案做国际化」「i18n this page's text」。

**配置：** 通过项目根目录 `.env` 中的 `I18N_LOCALES_DIR`、`I18N_SOURCE_LOCALE`、`I18N_TARGET_LOCALES` 等变量配置路径与目标语言，详见技能内说明。

## 使用

安装后，Agent 会在检测到相关任务时自动使用对应技能，无需额外配置。

## 技能结构

每个技能目录包含：

- `SKILL.md` — 技能说明与 YAML frontmatter（name、description）
- `rules/` — 具体规则与步骤（本仓库中为 Markdown 规则文件）

## License

MIT
