#!/bin/bash

echo "🚀 Gomoku GitHub Actions 部署设置"
echo "================================"

# 检查是否在项目根目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

echo "📋 检查必要文件..."

# 检查必要的文件是否存在
files_to_check=(
    ".github/workflows/ci-cd.yml"
    ".github/workflows/deploy.yml"
    "vercel.json"
    ".env.example"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file 存在"
    else
        echo "❌ $file 不存在"
        exit 1
    fi
done

# 检查 .env.local 是否已配置
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local 不存在，从模板创建..."
    cp .env.example .env.local
    echo "📝 请编辑 .env.local 文件并填入你的 Vercel 配置信息："
    echo "   - VERCEL_TOKEN"
    echo "   - VERCEL_ORG_ID"  
    echo "   - VERCEL_PROJECT_ID"
else
    echo "✅ .env.local 已存在"
fi

# 检查依赖
echo "📦 检查依赖安装..."
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    pnpm install
else
    echo "✅ 依赖已安装"
fi

# 运行质量检查
echo "🔍 运行代码质量检查..."

echo "  - TypeScript 类型检查..."
if ! pnpm type-check; then
    echo "❌ TypeScript 错误，请修复后再部署"
    exit 1
fi

echo "  - ESLint 检查..."  
if ! pnpm lint; then
    echo "❌ ESLint 错误，请修复后再部署"
    exit 1
fi

echo "  - 运行测试..."
if ! pnpm test run; then
    echo "❌ 测试失败，请修复后再部署"
    exit 1
fi

echo "  - 构建项目..."
if ! pnpm build; then
    echo "❌ 构建失败，请修复后再部署"
    exit 1
fi

echo "✅ 所有检查通过！"

# Git 状态检查
echo "📊 检查 Git 状态..."

if [ ! -d ".git" ]; then
    echo "❌ 这不是一个 Git 仓库，请先初始化："
    echo "   git init"
    echo "   git add ."  
    echo "   git commit -m \"Initial commit\""
    echo "   git branch -M main"
    echo "   git remote add origin <your-repo-url>"
    echo "   git push -u origin main"
    exit 1
fi

if ! git remote get-url origin &> /dev/null; then
    echo "⚠️  没有配置远程仓库，请添加："
    echo "   git remote add origin <your-repo-url>"
    echo "   git push -u origin main"
else
    echo "✅ Git 远程仓库已配置"
    echo "   远程地址: $(git remote get-url origin)"
fi

# 检查当前分支
CURRENT_BRANCH=$(git branch --show-current)
echo "   当前分支: $CURRENT_BRANCH"

if [[ "$CURRENT_BRANCH" != "main" && "$CURRENT_BRANCH" != "master" ]]; then
    echo "⚠️  你不在 main/master 分支上，部署工作流程将在 main/master 分支上触发"
fi

# 显示下一步操作
echo ""
echo "🎉 设置完成！"
echo "=============="
echo ""
echo "✅ GitHub Actions 工作流程已配置"
echo "✅ Vercel 部署配置已就绪"
echo "✅ 环境变量模板已创建"
echo "✅ 代码质量检查通过"
echo ""
echo "🔧 下一步操作："
echo ""
echo "1. 配置 GitHub Secrets："
echo "   📚 详细步骤：docs/GITHUB_SECRETS.md"
echo "   - VERCEL_TOKEN"
echo "   - VERCEL_ORG_ID"
echo "   - VERCEL_PROJECT_ID"
echo ""
echo "2. 推送代码触发部署："
echo "   git add ."
echo "   git commit -m \"Add GitHub Actions deployment\""
echo "   git push origin main"
echo ""
echo "3. 监控部署状态："
echo "   - GitHub 仓库 → Actions 标签"
echo "   - Vercel Dashboard"
echo ""
echo "📚 更多信息查看 README.md 和 docs/ 目录"
echo ""
echo "祝部署顺利！🚀"