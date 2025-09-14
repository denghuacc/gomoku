# 🔧 Husky 配置说明

## 概述

本项目配置了 Husky 来确保代码质量，在每次提交时自动运行检查。

## 🛠️ 已配置的钩子

### Pre-commit 钩子

在每次提交前自动运行：

1. **Lint-staged**: 只检查暂存区的文件
   - ESLint 检查和自动修复
   - Prettier 代码格式化

2. **TypeScript 类型检查**: 确保没有类型错误

### Commit-msg 钩子

检查提交信息格式，要求使用约定式提交格式：

- `feat: 新功能`
- `fix: 修复bug`
- `docs: 文档更新`
- `style: 样式更新`
- `refactor: 重构代码`
- `test: 测试相关`
- `chore: 构建配置等`

## 📝 提交信息示例

✅ **正确的提交信息**:

```
feat: 添加棋盘坐标显示功能
fix: 修复AI算法中的内存泄漏
docs: 更新部署文档
style: 调整游戏界面样式
refactor: 重构游戏逻辑钩子
test: 添加游戏规则测试用例
chore: 更新依赖版本
```

❌ **错误的提交信息**:

```
添加新功能
fix bug
update
修改了一些东西
WIP
```

## 🚀 常用命令

### 手动运行检查

```bash
# 检查代码规范
pnpm lint

# 修复代码规范问题
pnpm lint:fix

# 格式化代码
pnpm format

# 检查代码格式
pnpm format:check

# TypeScript 类型检查
pnpm type-check
```

### 跳过钩子（不推荐）

如果确实需要跳过钩子（例如紧急修复）：

```bash
# 跳过 pre-commit 钩子
git commit --no-verify -m "fix: emergency fix"

# 跳过所有钩子
git commit --no-verify --no-edit
```

## 🔧 配置文件

- **`.husky/pre-commit`**: Pre-commit 钩子脚本
- **`.husky/commit-msg`**: Commit 信息检查脚本
- **`.prettierrc`**: Prettier 配置
- **`.prettierignore`**: Prettier 忽略文件
- **`.eslintrc.cjs`**: ESLint 配置
- **`package.json`**: lint-staged 配置

## 🐛 故障排除

### 1. 钩子无法执行

```bash
# 确保钩子有执行权限
chmod +x .husky/pre-commit .husky/commit-msg

# 重新初始化 Husky
pnpm prepare
```

### 2. ESLint 错误太多

```bash
# 手动修复可修复的问题
pnpm lint:fix

# 查看具体错误
pnpm lint
```

### 3. 类型检查失败

```bash
# 运行类型检查查看详细错误
pnpm type-check
```

### 4. 提交信息格式错误

确保提交信息遵循约定式提交格式：

```
<type>: <description>

type: feat, fix, docs, style, refactor, test, chore
description: 简洁明了的描述（建议中文）
```

## 📋 开发工作流

1. **编写代码**
2. **添加到暂存区**: `git add .`
3. **提交代码**: `git commit -m "feat: 添加新功能"`
   - 自动运行 ESLint 检查和修复
   - 自动运行 Prettier 格式化
   - 自动运行 TypeScript 类型检查
   - 检查提交信息格式
4. **推送代码**: `git push`

## 🎯 最佳实践

1. **频繁提交**: 小而频繁的提交比大的提交更好
2. **清晰的提交信息**: 让其他开发者容易理解改动
3. **修复后再提交**: 不要跳过钩子提交有问题的代码
4. **保持代码整洁**: 定期运行 `pnpm lint:fix` 和 `pnpm format`

## ⚡ 性能优化

- **lint-staged** 只检查暂存区文件，避免检查整个项目
- **缓存**: ESLint 和 TypeScript 都启用了缓存
- **并行执行**: 多个检查可以并行运行

## 🔗 相关链接

- [Husky 文档](https://typicode.github.io/husky/)
- [lint-staged 文档](https://github.com/okonet/lint-staged)
- [约定式提交](https://www.conventionalcommits.org/)
- [ESLint 文档](https://eslint.org/)
- [Prettier 文档](https://prettier.io/)
