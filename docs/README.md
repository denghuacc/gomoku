# 📚 项目文档目录

本目录包含 Gomoku 项目的详细技术文档和配置指南。

## 📋 文档分类

### 🚀 部署配置

- **[📋 部署指南](./deployment/DEPLOYMENT.md)** - 完整的生产环境部署说明
- **[Vercel 快速配置](./deployment/VERCEL_QUICK_SETUP.md)** - 使用脚本快速配置 Vercel 部署
- **[Vercel GitHub Secrets](./deployment/VERCEL_GITHUB_SECRETS.md)** - 手动配置 GitHub Secrets 部署
- **[Vercel 配置指南](./deployment/VERCEL_CONFIG_GUIDE.md)** - 详细的 Vercel 配置步骤
- **[GitHub Secrets 配置](./deployment/GITHUB_SECRETS.md)** - CI/CD 环境变量配置

### 🔧 开发工具配置

- **[🔧 技术开发指南](./development/TECHNICAL_GUIDE.md)** - 完整的技术架构和开发指南
- **[Husky 配置指南](./development/HUSKY_SETUP.md)** - Git hooks 和代码质量检查配置

### 📈 项目规划

- **[⚡ 优化计划](./planning/OPTIMIZATION.md)** - 功能增强和性能优化规划

### 📚 项目历史

- **[Node.js 22 升级记录](./history/NODEJS22_UPDATE.md)** - Node.js 版本升级过程记录

## 🔗 相关文档

### 项目根目录文档

- **[项目主文档 (English)](../README.md)** - 项目介绍、功能特性、快速开始
- **[项目主文档 (中文)](../README-zh.md)** - 中文版项目文档

### 开发相关

- **[Copilot 指令](../.github/copilot-instructions.md)** - GitHub Copilot 开发指导
- **[脚本文档](../scripts/README.md)** - 项目脚本使用说明

## 📁 文档结构规范

```
docs/
├── README.md                           # 📖 文档目录索引（本文档）
├── deployment/                         # 🚀 部署相关文档
│   ├── DEPLOYMENT.md                  # 生产环境部署指南
│   ├── VERCEL_QUICK_SETUP.md          # Vercel 脚本快速配置
│   ├── VERCEL_GITHUB_SECRETS.md       # Vercel GitHub Secrets 配置
│   ├── VERCEL_CONFIG_GUIDE.md         # Vercel 详细配置指南
│   └── GITHUB_SECRETS.md              # CI/CD 环境变量配置
├── development/                        # 🔧 开发配置文档
│   ├── HUSKY_SETUP.md                 # Git hooks 配置
│   └── ...                            # 其他开发工具配置
├── planning/                           # 📈 项目规划文档
│   ├── OPTIMIZATION.md                # 功能增强和性能优化计划
│   └── ...                            # 其他规划文档
└── history/                           # 📚 历史记录文档
    ├── NODEJS22_UPDATE.md             # 版本升级记录
    └── ...                            # 其他历史记录
```

## 🎯 文档贡献指南

### 命名规范

- 使用 `SCREAMING_SNAKE_CASE` 命名重要配置文档
- 使用 `kebab-case` 命名一般说明文档
- 文档标题使用 emoji 增强可读性

### 内容规范

- 每个文档都应包含目录和摘要
- 使用代码块展示配置示例
- 添加相关链接和参考资料
- 包含故障排除章节

### 更新维护

- 配置变更时及时更新相关文档
- 定期检查文档链接的有效性
- 保持文档内容与实际配置同步

---

如有疑问或建议，请在项目 [Issues](https://github.com/denghuacc/gomoku/issues) 中反馈。
