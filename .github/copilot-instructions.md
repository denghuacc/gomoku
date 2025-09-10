# GitHub Copilot Instructions for Gomoku Game

## Project Overview

This is a modern Gomoku (Five in a Row) game built with React 18, TypeScript, Vite, and Tailwind CSS. The project features complete type safety, modular architecture, and rich game functionality including audio systems, game configuration, timer systems, and game review features.

## 🏗️ Architecture & Design Patterns

### Core Architecture

- **Frontend Framework**: React 18 with functional components and hooks
- **Type System**: TypeScript with strict mode enabled
- **Build Tool**: Vite 5 for fast development and optimized builds
- **Styling**: Tailwind CSS for utility-first responsive design
- **State Management**: React hooks (useState, useEffect, useCallback, useRef)
- **Custom Hooks**: Modular business logic separation

### Design Patterns

- **Custom Hooks Pattern**: Business logic extracted to reusable hooks
- **Compound Component Pattern**: Complex UI components broken into smaller parts
- **Props Interface Pattern**: Strict TypeScript interfaces for all component props
- **Configuration Pattern**: Centralized game configuration with persistence
- **Observer Pattern**: Timer and audio systems with event-driven updates

## 📁 Project Structure

```
src/
├── hooks/              # Custom business logic hooks
│   ├── useGomoku.ts    # Main game logic and state management
│   ├── useGameConfig.ts # Game configuration management
│   ├── useGameTimer.ts  # Timer system with multiple modes
│   └── useAudioSystem.ts # Audio effects management
├── components/         # React UI components
│   ├── GameBoard.tsx   # Interactive game board with canvas rendering
│   ├── GameInfo.tsx    # Game statistics and audio controls
│   ├── GameTimer.tsx   # Timer display and configuration
│   ├── GameConfig.tsx  # Game settings panel
│   ├── GameReview.tsx  # Game replay functionality
│   ├── GameTabs.tsx    # Tabbed interface for organization
│   ├── GameStatus.tsx  # Current game status display
│   └── WinModal.tsx    # Victory/defeat modal dialog
├── ai/                 # AI-related types and logic (future)
│   └── types.ts        # AI type definitions (currently empty)
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles and Tailwind imports
```

## 🔧 Core Type Definitions

### Game Types

```typescript
export type Player = 1 | 2; // 1: Black, 2: White
export type CellValue = 0 | Player; // 0: Empty
export type GameBoard = CellValue[][];
export type BoardSize = 13 | 15 | 19;

export interface Move {
  row: number;
  col: number;
  player: Player;
}

export interface GameConfig {
  boardSize: BoardSize;
  winCondition: number; // 4, 5, or 6 stones in a row
  firstPlayer: Player;
  allowUndo: boolean;
}
```

### Component Props Patterns

All components follow strict TypeScript interface patterns:

```typescript
interface ComponentProps {
  // Required props (no optionals unless truly optional)
  requiredProp: Type;
  // Event handlers with specific signatures
  onAction: (param: Type) => void | boolean;
  // Optional props marked explicitly
  optionalProp?: Type;
}
```

## 🎮 Game Logic Guidelines

### Win Condition Algorithm

- Use 4-direction checking: horizontal, vertical, diagonal, anti-diagonal
- Count consecutive stones in both directions from the placed stone
- Support configurable win conditions (4, 5, or 6 in a row)
- Efficient O(1) checking per move

### Move Validation

- Check if position is within board bounds
- Verify cell is empty before placement
- Validate game is active (not finished)
- Respect review mode restrictions

### State Management

- Use functional updates for state modifications
- Implement immutable state changes
- Maintain move history for undo functionality
- Separate review state from game state

## 🎨 UI/UX Guidelines

### Component Structure

- Functional components with TypeScript
- Use `React.FC<PropsInterface>` typing
- Implement proper event handlers with type safety
- Use Tailwind CSS classes for styling

### Responsive Design

- Mobile-first approach with responsive breakpoints
- Use `clamp()` for fluid typography
- Implement touch-friendly interfaces
- Support both mouse and touch interactions

### Visual Feedback

- Hover effects for interactive elements
- Loading states for async operations
- Visual indicators for current player
- Smooth transitions and animations

## 🔊 Audio System

### Audio Architecture

- Web Audio API for programmatic sound generation
- No external audio files dependency
- Volume control and mute functionality
- Persistent settings in localStorage

### Sound Design

- Move sound: Frequency sweep (800Hz → 400Hz)
- Win sound: C major ascending scale with chords
- All sounds generated programmatically

## ⏱️ Timer System

### Timer Modes

1. **Unlimited**: No time restrictions
2. **Total Time**: Fixed time per player
3. **Per Move**: Fixed time per move
4. **Fischer**: Increment time after each move

### Timer Features

- Independent timing for each player
- Pause/resume functionality
- Visual time warnings (red/orange/blue)
- Automatic game ending on timeout

## 📱 Review System

### Review Features

- Complete game replay with step navigation
- Auto-play functionality
- Move sequence display
- Non-destructive review (preserves game state)

## 🔧 Development Guidelines

### Code Style

- Use strict TypeScript with all compiler checks enabled
- Follow ESLint configuration rules
- Implement proper error boundaries
- Use semantic commit messages

### Performance Optimization

- Use useCallback for event handlers
- Implement proper dependency arrays in useEffect
- Minimize re-renders with React.memo when appropriate
- Efficient canvas rendering for game board

### Testing Considerations

- Write tests for game logic functions
- Test component rendering with different props
- Validate win condition algorithms
- Test timer functionality

## 🚀 Future Development

### Planned Features

1. **AI Opponent**: Implement minimax algorithm with alpha-beta pruning
2. **Local Storage**: Save/load game states and history
3. **Performance**: Canvas optimization and rendering improvements
4. **Internationalization**: Multi-language support
5. **Keyboard Controls**: Arrow key navigation and hotkeys
6. **Mobile Enhancement**: Better touch controls and responsive design

### AI Development Guidelines

When implementing AI features:

- Use the existing `ai/types.ts` file for AI-related types
- Implement difficulty levels (easy, medium, hard)
- Add AI thinking animation/indicators
- Maintain separation between AI logic and game logic
- Support both AI vs Human and AI vs AI modes

## 📋 Coding Standards

### TypeScript Best Practices

- Always define explicit return types for functions
- Use strict null checks and proper optional chaining
- Implement proper error handling with Result types
- Avoid `any` types - use proper type definitions

### React Best Practices

- Use functional components exclusively
- Implement proper cleanup in useEffect
- Use custom hooks for reusable logic
- Follow the single responsibility principle

### File Organization

- One main export per file
- Group related types and interfaces
- Use index files for barrel exports when appropriate
- Maintain consistent naming conventions

## 🛠️ Development Commands

```bash
# Development server
pnpm dev

# Type checking
pnpm type-check

# Build for production
pnpm build

# Linting
pnpm lint

# Preview production build
pnpm preview
```

## 📦 Dependencies Management

### Core Dependencies

- React 18+ for UI framework
- TypeScript 5+ for type safety
- Vite 5+ for build tooling
- Tailwind CSS 3+ for styling

### Development Philosophy

- Minimize external dependencies
- Prefer native browser APIs when possible
- Use TypeScript for all new code
- Maintain backward compatibility within major versions

---

When working on this project, always prioritize type safety, code readability, and user experience. Follow the established patterns and maintain consistency with the existing codebase architecture.
