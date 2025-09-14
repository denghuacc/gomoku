# 🚀 Vercel 配置获取指南

## 快速开始

### Windows/Linux/Mac 用户

```bash
chmod +x scripts/quick-vercel-setup.sh
./scripts/quick-vercel-setup.sh
```

## 📋 手动配置步骤

### 1. 安装 Vercel CLI

```bash
npm install -g vercel
```

### 2. 登录 Vercel

```bash
vercel login
```

### 3. 链接项目

在项目根目录运行：

```bash
vercel link
```

选择：

- ? Set up "C:\Users\alan\my\games\gomoku"? [Y/n] → **Y**
- ? Which scope should contain your project? → 选择你的账户
- ? Found project "your-username/gomoku". Link to it? [Y/n] → **Y** (如果存在)
- ? What's your project's name? → **gomoku** (或其他名称)
- ? In which directory is your code located? → **./**

### 4. 获取配置信息

查看生成的配置文件：

```bash
cat .vercel/project.json
```

输出示例：

```json
{
  "orgId": "team_xxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxx"
}
```

### 5. 获取 Vercel Token

1. 访问：https://vercel.com/account/tokens
2. 点击 "Create Token"
3. 名称：`github-actions-gomoku`
4. 过期时间：No Expiration
5. 复制生成的 Token

### 6. 配置 GitHub Secrets

在 GitHub 仓库设置中添加：

1. 进入仓库 → Settings → Secrets and variables → Actions
2. 点击 "New repository secret"
3. 添加以下 3 个 secrets：

| Name                | Value                        |
| ------------------- | ---------------------------- |
| `VERCEL_TOKEN`      | 从步骤 5 获取的 Token        |
| `VERCEL_ORG_ID`     | 从 project.json 的 orgId     |
| `VERCEL_PROJECT_ID` | 从 project.json 的 projectId |

### 7. 触发部署

```bash
git add .
git commit -m "Add Vercel deployment"
git push origin main
```

## 🔍 验证部署

1. **GitHub Actions**: 仓库 → Actions 标签查看工作流程
2. **Vercel Dashboard**: 登录 vercel.com 查看部署状态
3. **访问网站**: 部署成功后会显示 URL

## 🐛 常见问题

### 问题 1: ESLint 错误

**现象**: 部署时 ESLint 报错
**解决**: 已配置允许警告，主要错误已修复

### 问题 2: Vercel CLI 登录失败

**解决**:

```bash
vercel logout
vercel login
```

### 问题 3: 项目链接失败

**解决**:

```bash
rm -rf .vercel
vercel link
```

### 问题 4: Token 权限不足

**解决**: 确保 Token 有部署权限，重新生成 Token

## 📞 获取帮助

- **Vercel 文档**: https://vercel.com/docs
- **GitHub Actions 文档**: https://docs.github.com/en/actions
- **项目问题**: 在 GitHub Issues 中报告
