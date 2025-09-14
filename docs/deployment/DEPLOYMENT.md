# 🚀 部署指南

> 五子棋游戏项目的完整部署指南，涵盖系统要求、环境配置和生产环境部署流程。

## 📋 目录

- [系统要求](#系统要求)
- [部署前检查清单](#部署前检查清单)
- [Vercel 部署](#vercel-部署)
- [环境变量](#环境变量)
- [故障排除](#故障排除)

---

## ⚙️ 系统要求

- **Node.js**: >= 22.0.0 (Vercel 要求)
- **pnpm**: >= 8.0.0
- **Git**: 最新版本
- **GitHub 账户**: 用于代码仓库托管
- **Vercel 账户**: 用于部署平台

## 📋 部署前检查清单

### 1. 代码质量

- [ ] 所有测试通过: `pnpm test`
- [ ] TypeScript 编译成功: `pnpm type-check`
- [ ] ESLint 检查通过: `pnpm lint`
- [ ] 构建成功: `pnpm build`

### 2. 仓库配置

- [ ] 代码已提交到 Git
- [ ] 已推送到 GitHub 仓库
- [ ] 仓库为公开状态或 Vercel 有访问权限

### 3. Vercel 项目配置

- [ ] 已创建 Vercel 账户
- [ ] 已从 GitHub 导入项目
- [ ] 构建设置配置正确

### 4. GitHub Secrets 配置

- [ ] `VERCEL_TOKEN` 已添加到仓库 secrets
- [ ] `VERCEL_ORG_ID` 已添加到仓库 secrets
- [ ] `VERCEL_PROJECT_ID` 已添加到仓库 secrets
- [ ] (可选) `CODECOV_TOKEN` 用于覆盖率报告

## 🚀 部署步骤

### 方式一：自动部署 (推荐)

1. **推送到主分支**:

   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

2. **监控部署状态**:
   - 检查 GitHub Actions 标签页查看工作流状态
   - 检查 Vercel 仪表板查看部署进度

### 方式二：手动部署

1. **安装 Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **登录并部署**:
   ```bash
   vercel login
   vercel --prod
   ```

## 🔧 配置文件

### vercel.json

```json
{
  "version": 2,
  "name": "gomoku-react",
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install"
}
```

### .vercelignore

需要从部署中排除的关键文件：

- `node_modules/`
- `coverage/`
- `test/`
- 开发配置文件

## 🐛 故障排除

### 构建失败

**问题**: TypeScript 编译错误
**解决方案**:

```bash
pnpm type-check
# 部署前修复所有 TypeScript 错误
```

**问题**: 缺少依赖
**解决方案**:

```bash
pnpm install
# 确保 pnpm-lock.yaml 已提交
```

**问题**: 构建超时
**解决方案**:

- 检查代码中的无限循环
- 优化大型依赖
- 增加 Vercel 超时限制 (Pro 计划)

### 部署问题

**问题**: 刷新页面出现 404 错误
**解决方案**: 确保 `vercel.json` 有正确的路由配置：

```json
"routes": [
  { "src": "/(.*)", "dest": "/index.html" }
]
```

**问题**: 静态资源无法加载
**解决方案**: 检查 `vercel.json` 中的资源路径和缓存头

**问题**: 环境变量不生效
**解决方案**:

1. 在 Vercel 仪表板中添加变量
2. 客户端变量需要以 `VITE_` 为前缀
3. 添加变量后重新部署

### GitHub Actions 问题

**问题**: 工作流认证错误失败
**解决方案**:

1. 验证 GitHub secrets 设置正确
2. 检查 Vercel token 权限
3. 确保仓库有正确的访问权限

**问题**: CI 中测试失败但本地通过
**解决方案**:

1. 检查 Node.js 版本一致性
2. 清除缓存并重新安装依赖
3. 检查环境特定问题

### 性能问题

**问题**: 加载时间过长
**解决方案**:

1. 在 `vercel.json` 中启用压缩
2. 使用 `vite-bundle-analyzer` 优化包大小
3. 实现代码分割
4. 配置适当的缓存头

**问题**: 包体积过大
**解决方案**:

1. 使用以下命令分析包: `pnpm build && npx vite-bundle-analyzer dist`
2. 移除未使用的依赖
3. 实现动态导入
4. 使用 tree shaking

## 📊 监控

### 性能监控

- 使用 Vercel Analytics 获取性能洞察
- 监控核心网页指标
- 为部署失败设置警报

### 错误跟踪

- 考虑集成 Sentry 进行错误跟踪
- 在 Vercel 仪表板中监控构建日志
- 检查 GitHub Actions 日志排查 CI 问题

### 健康检查

```bash
# 本地测试部署
pnpm build && pnpm preview

# 检查常见问题
pnpm lint
pnpm type-check
pnpm test
```

## 🔒 安全考虑

### 内容安全策略

在 `vercel.json` 中配置 CSP 头：

```json
"headers": [
  {
    "source": "/(.*)",
    "headers": [
      {
        "key": "Content-Security-Policy",
        "value": "default-src 'self'; script-src 'self' 'unsafe-inline'"
      }
    ]
  }
]
```

### 环境变量

- 永远不要将敏感 token 提交到 Git
- 使用 Vercel 环境变量存储密钥
- 公共变量需要以 `VITE_` 为前缀

## 📈 优化建议

### 构建优化

- 使用 `pnpm` 获得更快、更高效的构建
- 启用 Vercel 边缘网络
- 配置适当的缓存策略

### 代码优化

- 为组件实现懒加载
- 对昂贵的组件使用 React.memo
- 使用 useCallback/useMemo 优化重新渲染

### 资源优化

- 使用下一代格式优化图片
- 尽可能使用 SVG 图标
- 配置 Vercel 的图片优化

## 📞 技术支持

如果遇到问题：

1. 查看 [Vercel 文档](https://vercel.com/docs)
2. 查阅 [GitHub Actions 文档](https://docs.github.com/en/actions)
3. 检查 GitHub 上的项目问题
4. 通过 Vercel 仪表板联系技术支持

---

**部署完成后，享受您的五子棋游戏！** 🎮✨
