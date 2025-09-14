# 🎯 五子棋游戏 (Gomoku Game)

一个基于 React + TypeScript + Vite 构建的现代化五子棋游戏，支持完整的游戏逻辑、精美的 UI 界面和强类型安全。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)

[English](./README.md) | 中文

## ✨ 功能特性

- 🎮 **经典五子棋游戏** - 支持黑白双方对战
- 🎨 **精美 UI 界面** - 使用 Tailwind CSS 设计的现代化界面
- 🖱️ **直观操作** - 鼠标悬停预览 + 点击落子
- ⏱️ **实时计时** - 游戏时间和步数统计
- 🔄 **悔棋功能** - 支持撤销上一步操作
- 🏆 **胜利检测** - 自动检测五子连线和平局
- 🎉 **胜利弹窗** - 优雅的游戏结束提示
- 📱 **响应式设计** - 支持桌面和移动设备
- 🔒 **TypeScript** - 完整的类型安全保障

## 🛠️ 技术栈

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome 6
- **Package Manager**: pnpm
- **Code Quality**: ESLint + TypeScript Compiler

## 🚀 快速开始

### 环境要求

- Node.js >= 22.0.0
- pnpm >= 8.0.0

### 安装依赖

```bash
# 克隆项目
git clone [your-repo-url]
cd gomoku

# 安装依赖
pnpm install
```

### 开发模式

```bash
# 启动开发服务器
pnpm dev

# 浏览器访问 http://localhost:3000
```

### 构建部署

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

## 🎮 游戏规则

1. **轮流落子**: 黑棋和白棋轮流在棋盘交叉点放置棋子
2. **胜利条件**: 率先在横、竖、或斜方向形成五子连线的一方获胜
3. **平局条件**: 棋盘填满且无人获胜则为平局
4. **操作方式**: 点击棋盘交叉点进行落子
5. **悔棋功能**: 可以撤销上一步操作（游戏进行中）

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📚 项目文档

查看详细的技术文档、部署指南和开发信息：

- **[📖 完整文档](./docs/README.md)** - 技术文档索引
- **[🚀 部署指南](./docs/deployment/)** - 生产环境部署说明
- **[🔧 开发指南](./docs/development/)** - 开发环境配置和指南

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👨‍💻 作者

- **项目作者** - 基于 React + TypeScript 构建
- **技术栈** - React 18, TypeScript, Vite, Tailwind CSS

---

**享受游戏乐趣！** 🎮✨
