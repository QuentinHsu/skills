# PR Description Heading Map

Fixed heading map for PR descriptions.

## Hard Rules

- **Must** use exact heading text below; no synonym replacement
- **Must** keep exact order below
- Optional sections may be omitted only when truly not applicable

## Fixed Headings by Type

### Type: feat

**Chinese headings (exact):**
1. `### 概述`
2. `### 改动说明`
3. `### 使用方式`

**English headings (exact):**
1. `### Summary`
2. `### Changes`
3. `### Usage`

---

### Type: fix

**Chinese headings (exact):**
1. `### 问题描述`
2. `### 复现步骤` (optional)
3. `### 修复方式`
4. `### 测试说明`

**English headings (exact):**
1. `### Problem`
2. `### Steps to Reproduce` (optional)
3. `### Solution`
4. `### Testing`

---

### Type: perf / refactor

**Chinese headings (exact):**
1. `### 概述`
2. `### 改动说明`
3. `### 效果` (optional)

**English headings (exact):**
1. `### Summary`
2. `### Changes`
3. `### Impact` (optional)

---

### Type: docs / chore

**Chinese headings (exact):**
1. `### 概述`
2. `### 改动说明`

**English headings (exact):**
1. `### Summary`
2. `### Changes`

---

## Usage Guidelines

1. Select heading set based on PR type
2. Use headings in listed order
3. Do not replace "概述" with "总结", do not replace "改动说明" with "变更"
4. Do not replace "使用方式" with "如何使用"
5. Keep heading Markdown level as `###` (level 3)

## Examples

### Correct ✅ (feat type)

```markdown
### 概述
- 新增用户认证功能

### 改动说明
- 实现 JWT token 生成和验证
- 添加登录和注册接口

### 使用方式
- POST /api/auth/login 进行登录
```

### Wrong ❌ (feat type)

```markdown
### 总结  ← Wrong: should be "概述"
- 新增用户认证功能

### 变更内容  ← Wrong: should be "改动说明"
- 实现 JWT token 生成和验证

### 如何使用  ← Wrong: should be "使用方式"
- POST /api/auth/login 进行登录
```
