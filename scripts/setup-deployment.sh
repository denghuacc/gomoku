#!/bin/bash

# Gomoku Deployment Setup Script
# This script helps you set up the deployment environment

echo "🎯 Gomoku Deployment Setup"
echo "=========================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if required tools are installed
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version is too old. Please install Node.js 18 or higher."
    exit 1
fi

echo "✅ Node.js $(node -v) is installed"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
fi

echo "✅ pnpm $(pnpm -v) is installed"

# Check git
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git."
    exit 1
fi

echo "✅ Git is installed"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Run quality checks
echo "🔍 Running quality checks..."

echo "  - Type checking..."
if ! pnpm type-check; then
    echo "❌ TypeScript errors found. Please fix them before deploying."
    exit 1
fi

echo "  - Linting..."
if ! pnpm lint; then
    echo "❌ ESLint errors found. Please fix them before deploying."
    exit 1
fi

echo "  - Testing..."
if ! pnpm test run; then
    echo "❌ Tests failed. Please fix them before deploying."
    exit 1
fi

echo "  - Building..."
if ! pnpm build; then
    echo "❌ Build failed. Please fix build errors before deploying."
    exit 1
fi

echo "✅ All quality checks passed!"

# Check if Vercel CLI is installed
echo "🚀 Checking Vercel setup..."

if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI is not installed."
    read -p "Would you like to install it? (y/N): " install_vercel
    if [[ $install_vercel =~ ^[Yy]$ ]]; then
        npm install -g vercel
        echo "✅ Vercel CLI installed"
    else
        echo "ℹ️  You can install it later with: npm install -g vercel"
    fi
else
    echo "✅ Vercel CLI is installed"
fi

# Git repository check
echo "📊 Checking Git repository..."

if [ ! -d ".git" ]; then
    echo "❌ This is not a Git repository. Please initialize Git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m \"Initial commit\""
    echo "   git branch -M main"
    echo "   git remote add origin <your-repo-url>"
    echo "   git push -u origin main"
    exit 1
fi

# Check if we have a remote
if ! git remote get-url origin &> /dev/null; then
    echo "⚠️  No remote origin found."
    echo "ℹ️  Please add your GitHub repository:"
    echo "   git remote add origin <your-repo-url>"
    echo "   git push -u origin main"
else
    echo "✅ Git remote origin is configured"
    echo "   Remote: $(git remote get-url origin)"
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "   Current branch: $CURRENT_BRANCH"

if [[ "$CURRENT_BRANCH" != "main" && "$CURRENT_BRANCH" != "master" ]]; then
    echo "⚠️  You're not on main/master branch. The CI/CD will deploy from main/master."
fi

# Summary and next steps
echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "✅ Dependencies installed"
echo "✅ Quality checks passed"
echo "✅ Build successful"
echo ""
echo "🚀 Next Steps for Deployment:"
echo ""
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m \"Add CI/CD pipeline\""
echo "   git push origin main"
echo ""
echo "2. Set up Vercel project:"
echo "   - Go to https://vercel.com"
echo "   - Import your GitHub repository"
echo "   - Configure build settings (should auto-detect)"
echo ""
echo "3. Configure GitHub secrets:"
echo "   - Go to your repo → Settings → Secrets and variables → Actions"
echo "   - Add VERCEL_TOKEN, VERCEL_ORG_ID, and VERCEL_PROJECT_ID"
echo ""
echo "4. For manual deployment (optional):"
echo "   vercel login"
echo "   vercel --prod"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "Happy deploying! 🚀"