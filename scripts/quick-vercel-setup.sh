#!/bin/bash

echo "🔧 快速获取 Vercel 配置"
echo "======================"

# 检查 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 安装 Vercel CLI..."
    npm install -g vercel
fi

echo "🔐 登录 Vercel..."
vercel login

echo "🔗 链接项目..."
vercel link

# 检查配置文件
if [ -f ".vercel/project.json" ]; then
    echo ""
    echo "✅ 配置获取成功！"
    echo "=================="
    
    # 读取配置
    ORG_ID=$(cat .vercel/project.json | grep -o '"orgId":"[^"]*"' | cut -d'"' -f4)
    PROJECT_ID=$(cat .vercel/project.json | grep -o '"projectId":"[^"]*"' | cut -d'"' -f4)
    
    echo "📋 Vercel 配置信息："
    echo "Organization ID: $ORG_ID"
    echo "Project ID: $PROJECT_ID"
    
    # 更新 .env.local
    echo ""
    echo "📝 更新 .env.local..."
    if [ -f ".env.local" ]; then
        # 备份并更新
        cp .env.local .env.local.bak
        sed -i "s/VERCEL_ORG_ID=.*/VERCEL_ORG_ID=$ORG_ID/" .env.local
        sed -i "s/VERCEL_PROJECT_ID=.*/VERCEL_PROJECT_ID=$PROJECT_ID/" .env.local
    else
        # 创建新文件
        cat > .env.local << EOF
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=$ORG_ID
VERCEL_PROJECT_ID=$PROJECT_ID
VITE_APP_TITLE=Gomoku Game
VITE_APP_VERSION=1.0.0
EOF
    fi
    
    echo "✅ .env.local 已更新"
    echo ""
    echo "🚀 GitHub Secrets 配置："
    echo "----------------------"
    echo "请在 GitHub 仓库设置中添加以下 Secrets："
    echo ""
    echo "VERCEL_TOKEN: [从 https://vercel.com/account/tokens 获取]"
    echo "VERCEL_ORG_ID: $ORG_ID" 
    echo "VERCEL_PROJECT_ID: $PROJECT_ID"
    echo ""
    echo "🔗 Token 获取链接: https://vercel.com/account/tokens"
    echo "📚 详细指南: docs/GITHUB_SECRETS.md"
    
else
    echo "❌ 配置获取失败"
    exit 1
fi