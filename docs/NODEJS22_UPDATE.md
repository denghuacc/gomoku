# Node.js 22 版本更新说明

## 📋 更新内容

为了满足 Vercel 平台的最新要求，我们已将项目的 Node.js 版本要求更新为 22.0.0 或更高版本。

## 🔄 已更新的文件

### 1. GitHub Actions 工作流

- **`.github/workflows/deploy.yml`**: 部署工作流
  - Node.js 版本: `18` → `22`
- **`.github/workflows/ci-cd.yml`**: CI/CD 工作流
  - Node.js 版本: `"18"` → `"22"`

### 2. Vercel 配置

- **`vercel.json`**:
  - 添加了 `functions.runtime: "nodejs22.x"`
  - 添加了 `builds.config.nodejs: "22"`

### 3. 项目配置

- **`package.json`**:
  - 添加了 `engines` 字段指定 Node.js >= 22.0.0
  - 添加了 pnpm >= 8.0.0 要求
- **`.nvmrc`**:
  - 新建文件，指定 Node.js 版本为 22

### 4. 文档更新

- **`README.md`**:
  - 环境要求: Node.js >= 16.0.0 → >= 22.0.0
  - pnpm: >= 7.0.0 → >= 8.0.0
- **`README-zh.md`**:
  - 同样更新了环境要求
- **`docs/VERCEL_CONFIG_GUIDE.md`**:
  - 添加了系统要求部分
- **`DEPLOYMENT.md`**:
  - 添加了系统要求部分

## 🎯 影响说明

### ✅ 优势

1. **兼容性**: 符合 Vercel 最新平台要求
2. **性能**: Node.js 22 提供更好的性能和安全性
3. **稳定性**: 减少版本兼容性问题
4. **未来保障**: 确保长期支持

### ⚠️ 注意事项

1. **本地开发**: 需要升级本地 Node.js 版本到 22+
2. **CI/CD**: GitHub Actions 将自动使用 Node.js 22
3. **依赖包**: 所有依赖包都兼容 Node.js 22
4. **向下兼容**: 项目代码保持向下兼容

## 🔧 开发者行动项

### 本地开发环境更新

```bash
# 使用 nvm 更新 Node.js 版本
nvm install 22
nvm use 22

# 或者直接从官网下载安装 Node.js 22+
# https://nodejs.org/

# 验证版本
node --version  # 应显示 v22.x.x
```

### 重新安装依赖

```bash
# 清理缓存
pnpm store prune

# 重新安装依赖
pnpm install
```

### 验证环境

```bash
# 运行测试
pnpm test

# 类型检查
pnpm type-check

# 代码检查
pnpm lint

# 构建项目
pnpm build
```

## 🚀 部署验证

更新后，建议进行以下验证：

1. **本地构建**: 确保 `pnpm build` 成功
2. **GitHub Actions**: 检查 CI/CD 工作流是否正常运行
3. **Vercel 部署**: 验证自动部署是否成功
4. **应用功能**: 确保部署后的应用功能正常

## 📞 支持

如果在升级过程中遇到任何问题，请：

1. 检查 Node.js 版本: `node --version`
2. 清理依赖缓存: `pnpm store prune`
3. 重新安装依赖: `pnpm install`
4. 查看错误日志并提交 Issue

---

**更新时间**: 2025-09-14  
**影响范围**: 开发环境、CI/CD、部署配置  
**向下兼容**: ✅ 是
