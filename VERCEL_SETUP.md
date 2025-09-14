# Vercel 自动部署配置指南

## 📋 配置信息

从 `.vercel/project.json` 文件中获取到的配置信息：

```json
{
  "projectId": "prj_vzhD2fVgXcDbr2v2qYkonlNl15Ba",
  "orgId": "team_WeI2Q9kzedmdtjvCZsNLEqII",
  "projectName": "gomoku"
}
```

## 🔑 需要配置的 GitHub Secrets

在 GitHub 仓库中需要配置以下 3 个 secrets：

### 1. VERCEL_ORG_ID

```
team_WeI2Q9kzedmdtjvCZsNLEqII
```

### 2. VERCEL_PROJECT_ID

```
prj_vzhD2fVgXcDbr2v2qYkonlNl15Ba
```

### 3. VERCEL_TOKEN

需要从 Vercel 控制台获取：

1. 访问：https://vercel.com/account/tokens
2. 点击 "Create Token"
3. 输入 token 名称（如：github-actions-gomoku）
4. 选择过期时间（建议选择 No Expiration）
5. 复制生成的 token

## 🚀 配置步骤

### 步骤 1：访问 GitHub 仓库设置

访问：https://github.com/denghuacc/gomoku/settings/secrets/actions

### 步骤 2：添加 Secrets

点击 "New repository secret" 按钮，添加以下三个 secrets：

1. **VERCEL_TOKEN**
   - Name: `VERCEL_TOKEN`
   - Secret: `[从 Vercel 获取的 API Token]`

2. **VERCEL_ORG_ID**
   - Name: `VERCEL_ORG_ID`
   - Secret: `team_WeI2Q9kzedmdtjvCZsNLEqII`

3. **VERCEL_PROJECT_ID**
   - Name: `VERCEL_PROJECT_ID`
   - Secret: `prj_vzhD2fVgXcDbr2v2qYkonlNl15Ba`

### 步骤 3：验证配置

添加完成后，推送代码到 `master` 分支即可触发自动部署：

```bash
git add .
git commit -m "feat: enable Vercel auto-deployment"
git push origin master
```

## 📈 部署流程

配置完成后，部署流程如下：

- **推送到 master 分支** → 自动部署到生产环境
- **创建 Pull Request** → 自动部署到预览环境
- **每次部署前** → 自动运行类型检查、代码检查、测试

## 🔗 相关链接

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel API Tokens](https://vercel.com/account/tokens)
- [GitHub Actions](https://github.com/denghuacc/gomoku/actions)
- [部署历史](https://vercel.com/alan-dengs-projects/gomoku/deployments)

## ⚠️ 注意事项

1. **Token 安全**: VERCEL_TOKEN 是敏感信息，不要在代码中暴露
2. **权限范围**: Token 应该只有项目部署权限
3. **定期更新**: 建议定期轮换 API Token
4. **监控部署**: 关注 GitHub Actions 和 Vercel 的部署日志

配置完成后，你的 Gomoku 项目将实现：

- ✅ 自动化测试
- ✅ 代码质量检查
- ✅ 自动部署到 Vercel
- ✅ 预览环境支持
