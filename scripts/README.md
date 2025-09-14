# 脚本目录说明

本目录包含项目的各种自动化脚本，用于简化开发和部署流程。

## 📜 可用脚本

### 🚀 部署相关

- **`setup-deployment.sh`** - 完整的部署环境设置

  ```bash
  ./scripts/setup-deployment.sh
  ```

- **`quick-vercel-setup.sh`** - 快速 Vercel 项目设置
  ```bash
  ./scripts/quick-vercel-setup.sh
  ```

### 🔧 配置相关

- **`get-vercel-config.sh`** - 获取 Vercel 项目配置信息

  ```bash
  ./scripts/get-vercel-config.sh
  ```

- **`get-vercel-info.sh`** - 获取 Vercel 账户和项目信息
  ```bash
  ./scripts/get-vercel-info.sh
  ```

### ⚙️ GitHub Actions

- **`setup-github-actions.sh`** - 设置 GitHub Actions 工作流
  ```bash
  ./scripts/setup-github-actions.sh
  ```

## 📋 使用前提

1. **权限**: 所有脚本都有执行权限
2. **依赖**: 确保已安装必要的工具
   - Node.js >= 22.0.0
   - pnpm >= 8.0.0
   - Git
   - Vercel CLI (脚本会自动安装)

## 🔍 脚本功能说明

### setup-deployment.sh

- 检查系统环境
- 安装 Vercel CLI
- 配置 GitHub Secrets
- 设置部署工作流

### quick-vercel-setup.sh

- 快速创建/链接 Vercel 项目
- 自动配置基本设置
- 获取项目配置参数

### get-vercel-config.sh

- 获取当前项目的 Vercel 配置
- 显示项目 ID、组织 ID 等信息
- 输出环境变量格式

### get-vercel-info.sh

- 显示当前登录用户信息
- 列出可用的项目
- 提供手动获取配置的指导

### setup-github-actions.sh

- 验证 GitHub Actions 配置
- 检查必要的 Secrets
- 设置工作流权限

## 🚨 注意事项

1. **执行目录**: 在项目根目录执行脚本
2. **网络要求**: 需要稳定的网络连接
3. **权限要求**: 需要 Vercel 和 GitHub 的相应权限
4. **环境变量**: 某些脚本需要预先配置环境变量

## 🆘 故障排除

如果脚本执行失败：

1. 检查执行权限：`ls -la scripts/`
2. 检查网络连接
3. 验证必要工具是否安装
4. 查看脚本输出的错误信息

---

**维护**: 定期更新脚本以适应平台变化  
**兼容性**: 支持 Linux、macOS 和 Windows (WSL/Git Bash)  
**版本**: 适用于 Node.js 22+ 和 Vercel 最新版本
