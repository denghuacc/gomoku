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

- Node.js >= 16.0.0
- pnpm >= 7.0.0 (推荐) 或 npm/yarn

### 安装依赖

```bash
# 克隆项目
git clone [your-repo-url]
cd gomoku

# 安装依赖
pnpm install
# 或者使用 npm
npm install
```

### 开发模式

```bash
# 启动开发服务器
pnpm dev

# 浏览器访问 http://localhost:3000
```

### 构建部署

```bash
# TypeScript 类型检查
pnpm type-check

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

## 📁 项目结构

```
gomoku/
├── src/
│   ├── components/          # React 组件
│   │   ├── GameBoard.tsx   # 游戏棋盘组件
│   │   ├── GameInfo.tsx    # 游戏信息面板
│   │   ├── GameRules.tsx   # 游戏规则说明
│   │   ├── GameStatus.tsx  # 游戏状态显示
│   │   └── WinModal.tsx    # 胜利弹窗组件
│   ├── hooks/
│   │   └── useGomoku.ts    # 游戏逻辑 Hook
│   ├── App.tsx             # 主应用组件
│   ├── main.tsx           # 应用入口
│   └── index.css          # 全局样式
├── public/                 # 静态资源
├── dist/                   # 构建输出
├── tsconfig.json          # TypeScript 配置
├── vite.config.ts         # Vite 配置
├── tailwind.config.js     # Tailwind CSS 配置
└── package.json           # 项目配置
```

## 🎯 TypeScript 特性

### 核心类型定义

```typescript
// 玩家类型
export type Player = 1 | 2; // 1: 黑棋, 2: 白棋

// 棋盘单元格值
export type CellValue = 0 | Player; // 0: 空位

// 游戏棋盘
export type GameBoard = CellValue[][];

// 移动记录
export interface Move {
  row: number;
  col: number;
  player: Player;
}

// Hook 返回值类型
export interface UseGomokuReturn {
  gameBoard: GameBoard;
  currentPlayer: Player;
  gameActive: boolean;
  moveHistory: Move[];
  gameTime: number;
  winner: Player | null;
  makeMove: (row: number, col: number) => boolean;
  undoMove: () => void;
  resetGame: () => void;
  BOARD_SIZE: number;
}
```

### 组件 Props 类型

所有组件都有严格的 Props 类型定义，确保类型安全：

```typescript
interface GameBoardProps {
  gameBoard: GameBoard;
  onMove: (row: number, col: number) => boolean;
  currentPlayer: Player;
  gameActive: boolean;
  BOARD_SIZE: number;
}
```

## 🎮 游戏规则

1. **轮流落子**: 黑棋和白棋轮流在棋盘交叉点放置棋子
2. **胜利条件**: 率先在横、竖、或斜方向形成五子连线的一方获胜
3. **平局条件**: 棋盘填满且无人获胜则为平局
4. **操作方式**: 点击棋盘交叉点进行落子
5. **悔棋功能**: 可以撤销上一步操作（游戏进行中）

## 🔧 开发说明

### 可用脚本

```bash
# 开发服务器
pnpm dev

# TypeScript 类型检查
pnpm type-check

# 代码检查
pnpm lint

# 构建项目
pnpm build

# 预览构建
pnpm preview
```

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 配置规范
- 组件使用函数式编程
- Hook 使用 useCallback 优化性能

### 游戏逻辑

核心游戏逻辑在 `useGomoku.ts` 中实现：

- **状态管理**: 使用 React useState 管理游戏状态
- **胜利检测**: 高效的四方向连子检测算法
- **移动历史**: 完整的移动记录用于悔棋功能
- **计时器**: 使用 useRef 管理游戏计时

## 🎨 界面特色

- **现代化设计**: 使用 Tailwind CSS 构建的现代界面
- **动画效果**: 平滑的 hover 和 transition 动画
- **响应式布局**: 适配不同屏幕尺寸
- **可视化反馈**: 鼠标悬停棋子预览效果
- **状态指示**: 清晰的游戏状态和回合显示

## 📝 更新日志

### v1.0.0 (2025-07-27)

- ✨ 完成从 JavaScript 到 TypeScript 的完整重构
- 🔒 添加完整的类型定义和类型安全
- 🎨 优化组件结构和代码组织
- 🚀 改进构建配置和开发体验
- 📚 添加详细的文档说明

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👨‍💻 作者

- **项目作者** - 基于 React + TypeScript 构建
- **技术栈** - React 18, TypeScript, Vite, Tailwind CSS

---

**享受游戏乐趣！** 🎮✨
