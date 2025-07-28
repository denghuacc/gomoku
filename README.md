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

- Node.js >= 16.0.0
- pnpm >= 7.0.0 (recommended) or npm/yarn

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
