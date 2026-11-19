# Skills

个人维护的 AI 编程助手技能库，遵循 [Agent Skills](https://agentskills.io/) 规范。

English version: [`README.md`](README.md)

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

## 技能文档

具体技能说明请查看：

- [Skills Index (English)](docs/skills.md)
- [技能文档索引（中文）](docs/skills.zh-CN.md)

## 开发

技能文件属于行为代码。新增或修改技能后执行：

```bash
node scripts/lint-skills.mjs --write  # 校验 frontmatter 和链接，并重新生成文档索引
node scripts/sync-shared.mjs          # 把 _shared/ 下的文件分发到实际引用它们的技能
```

CI 会以检查模式运行这两个脚本。

## License

MIT
