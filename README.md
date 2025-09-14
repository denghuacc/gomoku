# 🎯 Gomoku Game

A modern Gomoku (Five in a Row) game built with React + TypeScript + Vite, featuring complete game logic, beautiful UI interface, and strong type safety.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)

English | [中文](./README-zh.md)

## ✨ Features

- 🎮 **Classic Gomoku Game** - Support for black and white player battles
- 🎨 **Beautiful UI Interface** - Modern design with Tailwind CSS
- 🖱️ **Intuitive Controls** - Mouse hover preview + click to place stones
- ⏱️ **Real-time Timer** - Game time and move counter
- 🔄 **Undo Function** - Support for undoing the last move
- 🏆 **Win Detection** - Automatic detection of five-in-a-row and draws
- 🎉 **Victory Modal** - Elegant game-over notifications
- 📱 **Responsive Design** - Support for desktop and mobile devices
- 🔒 **TypeScript** - Complete type safety guarantee

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome 6
- **Package Manager**: pnpm
- **Code Quality**: ESLint + TypeScript Compiler

## 🚀 Quick Start

### Requirements

- Node.js >= 22.0.0 (required for Vercel deployment)
- pnpm >= 8.0.0 (recommended) or npm/yarn

### Installation

```bash
# Clone the project
git clone [your-repo-url]
cd gomoku

# Install dependencies
pnpm install
# or use npm
npm install
```

### Development

```bash
# Start development server
pnpm dev

# Visit http://localhost:3000 in your browser
```

### Build & Deploy

```bash
# TypeScript type checking
pnpm type-check

# Build for production
pnpm build

# Preview build
pnpm preview
```

## 🚀 GitHub Actions 自动部署

本项目使用 GitHub Actions 自动部署到 Vercel，支持持续集成和持续部署 (CI/CD)。

### 自动部署流程

1. **持续集成 (CI)**：每次代码推送都会触发
   - TypeScript 类型检查
   - ESLint 代码规范检查
   - 单元测试
   - 构建验证

2. **自动部署 (CD)**：
   - **生产部署**：推送到 `main` 或 `master` 分支自动部署到生产环境
   - **预览部署**：Pull Request 自动生成预览环境

### 🔧 配置步骤

#### 1. 设置本地环境变量

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

填入你的 Vercel 配置信息：

```bash
# .env.local
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=your_org_id_here
VERCEL_PROJECT_ID=your_project_id_here
```

#### 2. 配置 GitHub Secrets

在 GitHub 仓库中配置以下 Secrets（仓库设置 → Secrets and variables → Actions）：

| Secret 名称         | 获取方式                                             |
| ------------------- | ---------------------------------------------------- |
| `VERCEL_TOKEN`      | [Vercel 账户设置](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID`     | Vercel 团队设置中获取                                |
| `VERCEL_PROJECT_ID` | Vercel 项目设置中获取                                |

📋 **详细配置指南**: 查看 [GitHub Secrets 配置文档](./docs/GITHUB_SECRETS.md)

#### 3. 部署

推送代码到主分支即可触发自动部署：

```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

### 📊 部署状态监控

- **GitHub Actions**: 仓库 → Actions 标签查看工作流程状态
- **Vercel Dashboard**: [vercel.com](https://vercel.com) 查看部署详情
- **部署预览**: PR 中会自动显示预览链接

### 🔧 本地开发与测试

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 类型检查
pnpm type-check

# 代码规范检查
pnpm lint

# 运行测试
pnpm test

# 构建生产版本
pnpm build
```

## 📁 Project Structure

```
gomoku/
├── src/
│   ├── components/          # React components
│   │   ├── GameBoard.tsx   # Game board component
│   │   ├── GameInfo.tsx    # Game information panel
│   │   ├── GameRules.tsx   # Game rules description
│   │   ├── GameStatus.tsx  # Game status display
│   │   └── WinModal.tsx    # Victory modal component
│   ├── hooks/
│   │   └── useGomoku.ts    # Game logic hook
│   ├── App.tsx             # Main app component
│   ├── main.tsx           # Application entry
│   └── index.css          # Global styles
├── public/                 # Static assets
├── dist/                   # Build output
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Project configuration
```

## 🎯 TypeScript Features

### Core Type Definitions

```typescript
// Player type
export type Player = 1 | 2; // 1: Black, 2: White

// Board cell value
export type CellValue = 0 | Player; // 0: Empty

// Game board
export type GameBoard = CellValue[][];

// Move record
export interface Move {
  row: number;
  col: number;
  player: Player;
}

// Hook return type
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

### Component Props Types

All components have strict Props type definitions to ensure type safety:

```typescript
interface GameBoardProps {
  gameBoard: GameBoard;
  onMove: (row: number, col: number) => boolean;
  currentPlayer: Player;
  gameActive: boolean;
  BOARD_SIZE: number;
}
```

## 🎮 Game Rules

1. **Alternating Moves**: Black and white players take turns placing stones on board intersections
2. **Win Condition**: The first player to form five stones in a row (horizontally, vertically, or diagonally) wins
3. **Draw Condition**: Game ends in a draw when the board is full with no winner
4. **Controls**: Click on board intersections to place stones
5. **Undo Function**: Can undo the last move (during active game)

## 🔧 Development

### Available Scripts

```bash
# Development server
pnpm dev

# TypeScript type checking
pnpm type-check

# Code linting
pnpm lint

# Build project
pnpm build

# Preview build
pnpm preview
```

### Code Standards

- Use TypeScript strict mode
- Follow ESLint configuration rules
- Use functional components
- Optimize performance with useCallback hooks

### Game Logic

Core game logic implemented in `useGomoku.ts`:

- **State Management**: Use React useState for game state management
- **Win Detection**: Efficient four-direction connection detection algorithm
- **Move History**: Complete move records for undo functionality
- **Timer**: Use useRef for game timing management

## 🎨 UI Features

- **Modern Design**: Modern interface built with Tailwind CSS
- **Animations**: Smooth hover and transition animations
- **Responsive Layout**: Adapted for different screen sizes
- **Visual Feedback**: Mouse hover stone preview effects
- **Status Indicators**: Clear game status and turn displays

## 📝 Changelog

### v1.0.0 (2025-07-27)

- ✨ Complete refactoring from JavaScript to TypeScript
- 🔒 Added complete type definitions and type safety
- 🎨 Optimized component structure and code organization
- 🚀 Improved build configuration and development experience
- 📚 Added detailed documentation

## 🤝 Contributing

Issues and Pull Requests are welcome!

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

- **Project Author** - Built with React + TypeScript
- **Tech Stack** - React 18, TypeScript, Vite, Tailwind CSS

---

**Enjoy the game!** 🎮✨
