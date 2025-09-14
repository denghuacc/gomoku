# Vercel 配置参数获取指南

## ⚠️ 系统要求

- **Node.js**: >= 22.0.0 (Vercel 最新要求)
- **pnpm**: >= 8.0.0
- **Git**: 用于版本控制

## 📋 需要获取的参数

- `VERCEL_TOKEN`: Vercel API 访问令牌
- `VERCEL_ORG_ID`: Vercel 组织/团队 ID
- `VERCEL_PROJECT_ID`: Vercel 项目 ID

## 🔑 1. 获取 VERCEL_TOKEN

### 步骤：

1. 访问 [Vercel Tokens 页面](https://vercel.com/account/tokens)
2. 点击 **"Create Token"** 按钮
3. 填写 Token 信息：
   - **Name**: `gomoku-ci-cd` (或其他描述性名称)
   - **Scope**: 选择需要的权限范围
   - **Expiration**: 建议选择较长时间或 "No Expiration"
4. 点击 **"Create"** 生成 Token
5. **立即复制生成的 Token**（只显示一次！）

### ⚠️ 重要提醒：

- Token 只在创建时显示一次，请立即复制保存
- 不要在代码中硬编码 Token，使用环境变量

## 🏢 2. 获取 VERCEL_ORG_ID

### 方法一：通过 Vercel CLI

```bash
# 安装 Vercel CLI（如果未安装）
npm install -g vercel

# 登录并查看组织信息
vercel login
vercel whoami --debug
```

### 方法二：通过 Dashboard

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 如果您属于多个团队，选择目标团队
3. 进入团队设置页面
4. 在 **General** 标签页中找到 **"Team ID"**
5. 如果是个人账户，ORG_ID 通常与用户名相同

### 方法三：通过 URL

- 个人账户：通常是您的用户名
- 团队账户：在团队设置页面的 URL 中可以看到

## 📁 3. 获取 VERCEL_PROJECT_ID

### 方法一：创建新项目（推荐）

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **"Add New..."** > **"Project"**
3. 选择 **"Import Git Repository"**
4. 找到您的 GitHub 仓库 `denghuacc/gomoku`
5. 配置项目设置：
   ```
   Framework Preset: Vite
   Build Command: pnpm build
   Output Directory: dist
   Install Command: pnpm install
   Root Directory: ./
   ```
6. 点击 **"Deploy"** 开始部署
7. 部署完成后，进入项目设置页面
8. 在 **"General"** 标签页中找到 **"Project ID"**

### 方法二：通过 Vercel CLI

```bash
# 在项目目录中运行
cd /path/to/your/gomoku/project

# 链接项目到 Vercel
vercel link

# 查看项目信息
vercel ls

# 查看环境变量（会显示项目 ID）
vercel env ls
```

### 方法三：通过现有项目

如果项目已经存在：

1. 在 Vercel Dashboard 中找到项目
2. 进入项目设置
3. 在 "General" 页面查看 "Project ID"

## 🔧 4. 快速获取脚本

运行以下脚本来辅助获取信息：

```bash
./scripts/get-vercel-info.sh
```

## 📝 5. 配置环境变量

获取到所有参数后，更新您的 `.env.local` 文件：

```bash
# Vercel Token - 从 https://vercel.com/account/tokens 获取
VERCEL_TOKEN=vercel_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Vercel Organization ID - 您的用户名或团队 ID
VERCEL_ORG_ID=your_username_or_team_id

# Vercel Project ID - 从项目设置中获取
VERCEL_PROJECT_ID=prj_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 🔐 6. 配置 GitHub Secrets

获取配置后，还需要在 GitHub 仓库中配置 Secrets：

1. 访问 GitHub 仓库: `https://github.com/denghuacc/gomoku`
2. 进入 **Settings** > **Secrets and variables** > **Actions**
3. 添加以下 Repository secrets：
   - `VERCEL_TOKEN`: 您的 Vercel Token
   - `VERCEL_ORG_ID`: 您的组织 ID
   - `VERCEL_PROJECT_ID`: 您的项目 ID

## ❓ 常见问题

### Q: 找不到 Team ID？

A: 如果是个人账户，Team ID 通常就是您的用户名。

### Q: Token 权限不足？

A: 确保 Token 有足够的权限，建议创建时选择 "Full Account" 权限。

### Q: CLI 命令失败？

A: 确保已经登录 Vercel CLI: `vercel login`

## 🎯 下一步

获取所有参数后：

1. 更新 `.env.local` 文件
2. 配置 GitHub Secrets
3. 测试 CI/CD 流程：推送代码触发自动部署
