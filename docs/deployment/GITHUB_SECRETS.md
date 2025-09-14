# GitHub Secrets 配置指南

## 📋 需要配置的 Secrets

在 GitHub 仓库中需要配置以下 Secrets 变量以启用自动部署：

### 必需的 Vercel Secrets

| Secret 名称         | 描述            | 获取方式        |
| ------------------- | --------------- | --------------- |
| `VERCEL_TOKEN`      | Vercel 访问令牌 | Vercel 账户设置 |
| `VERCEL_ORG_ID`     | Vercel 组织 ID  | Vercel 项目设置 |
| `VERCEL_PROJECT_ID` | Vercel 项目 ID  | Vercel 项目设置 |

### 可选的 Secrets

| Secret 名称     | 描述             | 用途           |
| --------------- | ---------------- | -------------- |
| `CODECOV_TOKEN` | Codecov 访问令牌 | 代码覆盖率报告 |

## 🔧 获取 Vercel 配置信息

### 1. 获取 Vercel Token

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击右上角头像 → **Settings**
3. 在左侧菜单选择 **Tokens**
4. 点击 **Create Token**
5. 输入 Token 名称（例如：`github-actions-gomoku`）
6. 选择过期时间（建议 No Expiration）
7. 复制生成的 Token

### 2. 获取 Organization ID

1. 在 Vercel Dashboard 中
2. 点击右上角头像 → **Settings**
3. 在左侧菜单选择 **General**
4. 找到 **Your ID** 部分，复制 ID 值

### 3. 获取 Project ID

#### 方法一：通过 Vercel Dashboard

1. 进入你的项目
2. 点击 **Settings** 标签
3. 在 **General** 部分找到 **Project ID**
4. 复制 Project ID

#### 方法二：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 在项目目录中运行
vercel link

# 查看项目信息
cat .vercel/project.json
```

`.vercel/project.json` 文件内容示例：

```json
{
  "orgId": "your-org-id",
  "projectId": "your-project-id"
}
```

## ⚙️ 在 GitHub 中配置 Secrets

### 步骤：

1. **进入仓库设置**
   - 打开你的 GitHub 仓库
   - 点击 **Settings** 标签

2. **找到 Secrets 配置**
   - 在左侧菜单中选择 **Secrets and variables**
   - 点击 **Actions**

3. **添加 Repository Secrets**

   点击 **New repository secret** 按钮，依次添加以下 secrets：

   **VERCEL_TOKEN**

   ```
   Name: VERCEL_TOKEN
   Secret: 你的_vercel_token_值
   ```

   **VERCEL_ORG_ID**

   ```
   Name: VERCEL_ORG_ID
   Secret: 你的_组织_id_值
   ```

   **VERCEL_PROJECT_ID**

   ```
   Name: VERCEL_PROJECT_ID
   Secret: 你的_项目_id_值
   ```

## 🔍 验证配置

### 1. 检查 Secrets 是否正确

在仓库的 **Settings** → **Secrets and variables** → **Actions** 中，你应该看到：

- ✅ VERCEL_TOKEN
- ✅ VERCEL_ORG_ID
- ✅ VERCEL_PROJECT_ID

### 2. 测试部署

1. **推送代码到主分支**：

   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

2. **查看 GitHub Actions**：
   - 进入仓库的 **Actions** 标签
   - 查看 "Deploy to Vercel" 工作流程
   - 确认所有步骤都成功执行

3. **验证部署结果**：
   - 检查 Vercel Dashboard 中的部署状态
   - 访问部署的 URL 确认应用正常工作

## 🐛 故障排除

### 常见错误及解决方案

**错误：`Error: No token specified`**

- 检查 `VERCEL_TOKEN` 是否正确设置
- 确认 Token 没有过期

**错误：`Error: Project not found`**

- 检查 `VERCEL_PROJECT_ID` 是否正确
- 确认项目在 Vercel 中存在

**错误：`Error: Forbidden`**

- 检查 `VERCEL_ORG_ID` 是否正确
- 确认 Token 有足够的权限

**错误：`Error: Build failed`**

- 检查本地构建是否成功：`pnpm build`
- 查看 GitHub Actions 日志中的具体错误信息

### 调试步骤

1. **本地验证**：

   ```bash
   # 检查环境变量
   vercel env ls

   # 本地构建测试
   pnpm build

   # 本地部署测试
   vercel --prod
   ```

2. **查看日志**：
   - GitHub Actions 工作流程日志
   - Vercel 部署日志
   - 浏览器控制台错误

## 🔒 安全最佳实践

1. **定期轮换 Tokens**
   - 建议每 6-12 个月更换一次 Vercel Token
   - 更新后记得在 GitHub Secrets 中同步更新

2. **权限最小化**
   - Vercel Token 只授予必要的权限
   - 不要在代码中硬编码任何敏感信息

3. **监控使用情况**
   - 定期检查 Vercel Dashboard 中的部署活动
   - 监控 GitHub Actions 的运行情况

## 📞 支持

如果遇到问题：

1. 检查 [Vercel 文档](https://vercel.com/docs)
2. 查看 [GitHub Actions 文档](https://docs.github.com/en/actions)
3. 在项目 Issues 中报告问题
