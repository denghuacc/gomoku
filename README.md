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

- Node.js >= 22.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Clone the project
git clone [your-repo-url]
cd gomoku

# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev

# Visit http://localhost:3000 in your browser
```

### Build & Deploy

```bash
# Build for production
pnpm build

# Preview build
pnpm preview
```

## 🎮 Game Rules

1. **Alternating Moves**: Black and white players take turns placing stones on board intersections
2. **Win Condition**: The first player to form five stones in a row (horizontally, vertically, or diagonally) wins
3. **Draw Condition**: Game ends in a draw when the board is full with no winner
4. **Controls**: Click on board intersections to place stones
5. **Undo Function**: Can undo the last move (during active game)

## 🤝 Contributing

Issues and Pull Requests are welcome!

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📚 Documentation

For detailed technical documentation, deployment guides, and development information:

- **[📖 Complete Documentation](./docs/README.md)** - Technical documentation index
- **[🚀 Deployment Guide](./docs/deployment/)** - Production deployment instructions
- **[🔧 Development Guide](./docs/development/)** - Development setup and guidelines

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

- **Project Author** - Built with React + TypeScript
- **Tech Stack** - React 18, TypeScript, Vite, Tailwind CSS

---

**Enjoy the game!** 🎮✨
