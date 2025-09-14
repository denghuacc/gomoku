# 🔧 技术开发指南

本文档包含 Gomoku 项目的详细技术信息、开发指南和项目架构说明。

## 📁 项目结构

```
gomoku/
├── src/
│   ├── components/          # React 组件
│   │   ├── AIConfig.tsx    # AI 配置组件
│   │   ├── GameBoard.tsx   # 游戏棋盘组件
│   │   ├── GameConfig.tsx  # 游戏配置组件
│   │   ├── GameInfo.tsx    # 游戏信息面板
│   │   ├── GameReview.tsx  # 游戏回放组件
│   │   ├── GameStatus.tsx  # 游戏状态显示
│   │   ├── GameTabs.tsx    # 游戏标签页组件
│   │   ├── GameTimer.tsx   # 游戏计时器组件
│   │   └── WinModal.tsx    # 胜利弹窗组件
│   ├── hooks/              # 自定义 Hook
│   │   ├── useAIConfig.ts  # AI 配置 Hook
│   │   ├── useAudioSystem.ts # 音效系统 Hook
│   │   ├── useGameConfig.ts # 游戏配置 Hook
│   │   ├── useGameTimer.ts # 计时器 Hook
│   │   └── useGomoku.ts    # 游戏逻辑 Hook
│   ├── ai/                 # AI 相关
│   │   ├── engine.ts       # AI 引擎
│   │   └── types.ts        # AI 类型定义
│   ├── utils/              # 工具函数
│   │   ├── checkWin.ts     # 胜负判断逻辑
│   │   ├── formatTime.ts   # 时间格式化
│   │   └── GameBoardUtils.ts # 棋盘工具函数
│   ├── App.tsx             # 主应用组件
│   ├── main.tsx           # 应用入口
│   └── index.css          # 全局样式
├── public/                 # 静态资源
├── docs/                   # 项目文档
│   ├── deployment/         # 部署相关文档
│   ├── development/        # 开发相关文档
│   ├── planning/           # 计划和优化文档
│   └── history/            # 历史记录文档
├── coverage/               # 测试覆盖率报告
├── dist/                   # 构建输出
├── .github/workflows/      # GitHub Actions 工作流
├── tsconfig.json          # TypeScript 配置
├── vite.config.ts         # Vite 配置
├── vitest.config.ts       # Vitest 测试配置
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

// 游戏棋盘类型和棋盘大小
export type GameBoard = CellValue[][];
export type BoardSize = 13 | 15 | 19;

// 移动记录
export interface Move {
  row: number;
  col: number;
  player: Player;
}

// 游戏配置
export interface GameConfig {
  boardSize: BoardSize;
  winCondition: number; // 4, 5, 或 6 子连线
  firstPlayer: Player;
  allowUndo: boolean;
}

// AI 配置
export interface AIConfig {
  enabled: boolean;
  difficulty: "easy" | "medium" | "hard";
  isAIFirst: boolean;
}

// 计时器配置
export interface TimerConfig {
  mode: "unlimited" | "total" | "per-move" | "fischer";
  timeLimit: number;
  increment?: number; // Fischer 模式的增时
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
  boardSize: BoardSize;
  lastMove?: Move;
  isReviewMode?: boolean;
}

interface GameTimerProps {
  config: TimerConfig;
  currentPlayer: Player;
  gameActive: boolean;
  onTimeUp: (player: Player) => void;
  onConfigChange: (config: TimerConfig) => void;
}
```

## 🔧 开发说明

### 可用脚本

```bash
# 开发服务器
pnpm dev

# TypeScript 类型检查
pnpm type-check

# 代码检查和自动修复
pnpm lint
pnpm lint:fix

# 运行测试
pnpm test
pnpm test:ui        # 带界面的测试运行器
pnpm test:coverage  # 生成测试覆盖率报告

# 构建项目
pnpm build

# 预览构建
pnpm preview
```

### 代码规范

- 使用 TypeScript 严格模式，零容忍编译错误
- 遵循 ESLint 配置规范，保持代码质量
- 使用函数式组件和 React Hooks
- 使用 useCallback 和 useMemo 优化性能
- 实现完整的单元测试覆盖率

### 核心架构

#### 状态管理模式

- **游戏逻辑**: `useGomoku` Hook 管理核心游戏状态
- **配置管理**: `useGameConfig` Hook 处理游戏设置
- **AI 系统**: `useAIConfig` Hook 管理 AI 对战设置
- **计时器**: `useGameTimer` Hook 实现多种计时模式
- **音效系统**: `useAudioSystem` Hook 管理游戏音效

#### 胜负判断算法

```typescript
// 高效的四方向连子检测
const directions = [
  [0, 1], // 水平
  [1, 0], // 垂直
  [1, 1], // 对角线
  [1, -1], // 反对角线
];

// O(1) 复杂度的胜负检测
function checkWin(
  board: GameBoard,
  row: number,
  col: number,
  player: Player
): boolean {
  for (const [dx, dy] of directions) {
    let count = 1;
    count += countDirection(board, row, col, dx, dy, player);
    count += countDirection(board, row, col, -dx, -dy, player);
    if (count >= WIN_CONDITION) return true;
  }
  return false;
}
```

#### 计时器系统

支持四种计时模式：

1. **无限时**: 不限制思考时间
2. **总时间**: 每位玩家有固定的总思考时间
3. **每步限时**: 每次落子都有固定时间限制
4. **Fischer 计时**: 每次落子后增加一定时间（国际象棋规则）

## 🎨 界面架构

### 核心功能亮点

- **多种棋盘尺寸**: 13×13、15×15、19×19 可选
- **灵活胜利条件**: 4 子、5 子、6 子连线可配置
- **完整计时系统**: 4 种计时模式适应不同对局需求
- **游戏回放**: 完整的游戏录制和步进回放功能
- **音效系统**: Web Audio API 实现的程序化音效
- **AI 对战**: 多难度级别的 AI 对手（开发中）

### 设计系统

- **现代化设计**: 使用 Tailwind CSS 构建的现代界面
- **多标签布局**: 游戏、配置、回放功能分离，界面简洁
- **响应式设计**: 完美适配桌面和移动设备
- **动画效果**: 平滑的过渡动画和悬停效果
- **可视化反馈**: 实时的棋子预览和移动指示
- **无障碍设计**: 键盘导航和屏幕阅读器支持
- **主题适配**: 支持系统主题自动切换

## 🚀 部署与 CI/CD

详细的部署配置和 GitHub Actions 自动化流程请参考：

- **[GitHub Actions 部署指南](./deployment/DEPLOYMENT.md)** - 完整的 CI/CD 配置
- **[Vercel 配置指南](./deployment/)** - Vercel 平台部署说明
- **[环境变量配置](./deployment/GITHUB_SECRETS.md)** - 部署环境变量设置

## 🧪 测试策略

### 测试框架

- **Vitest**: 快速的单元测试框架
- **React Testing Library**: 组件测试
- **@testing-library/jest-dom**: DOM 匹配器

### 测试覆盖率

- 核心游戏逻辑: 100% 覆盖率
- React 组件: 完整的渲染和交互测试
- 工具函数: 边界条件和错误处理测试

### 运行测试

```bash
# 运行所有测试
pnpm test

# 监听模式
pnpm test:watch

# 覆盖率报告
pnpm test:coverage

# 测试 UI 界面
pnpm test:ui
```

## 📚 相关文档

- **[部署指南](./deployment/)** - 生产环境部署配置
- **[开发工具配置](./development/)** - Git hooks 和开发环境设置
- **[项目优化计划](./planning/OPTIMIZATION.md)** - 功能增强和性能优化
- **[版本升级记录](./history/)** - 技术栈升级和迁移记录

---

更多技术问题请参考项目 [Issues](https://github.com/denghuacc/gomoku/issues) 或查阅对应的专项文档。
