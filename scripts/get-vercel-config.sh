#!/bin/bash

echo "🔧 Vercel 配置获取工具"
echo "===================="

# 检查是否在项目根目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI 未安装，正在安装..."
    npm install -g vercel
    
    if [ $? -ne 0 ]; then
        echo "❌ Vercel CLI 安装失败"
        exit 1
    fi
    echo "✅ Vercel CLI 安装成功"
else
    echo "✅ Vercel CLI 已安装"
fi

echo ""
echo "🔐 请登录 Vercel..."
vercel login

if [ $? -ne 0 ]; then
    echo "❌ Vercel 登录失败"
    exit 1
fi

echo ""
echo "📋 获取项目配置..."

# 尝试链接现有项目或创建新项目
echo "请选择操作："
echo "1. 链接到现有的 Vercel 项目"
echo "2. 创建新的 Vercel 项目"
read -p "请输入选择 (1 或 2): " choice

case $choice in
    1)
        echo "🔗 链接到现有项目..."
        vercel link
        ;;
    2)
        echo "🆕 创建新项目..."
        vercel
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

if [ $? -ne 0 ]; then
    echo "❌ 项目配置失败"
    exit 1
fi

# 检查 .vercel 目录是否存在
if [ ! -d ".vercel" ]; then
    echo "❌ .vercel 目录不存在，配置可能失败"
    exit 1
fi

# 读取配置信息
if [ -f ".vercel/project.json" ]; then
    echo ""
    echo "📄 项目配置信息："
    echo "================="
    
    # 提取配置信息
    ORG_ID=$(cat .vercel/project.json | grep -o '"orgId":"[^"]*"' | cut -d'"' -f4)
    PROJECT_ID=$(cat .vercel/project.json | grep -o '"projectId":"[^"]*"' | cut -d'"' -f4)
    
    echo "Organization ID: $ORG_ID"
    echo "Project ID: $PROJECT_ID"
    
    # 获取 Vercel Token 提示
    echo ""
    echo "🔑 获取 Vercel Token："
    echo "==================="
    echo "1. 访问: https://vercel.com/account/tokens"
    echo "2. 点击 'Create Token'"
    echo "3. 输入名称: github-actions-gomoku"
    echo "4. 选择过期时间: No Expiration (推荐)"
    echo "5. 复制生成的 Token"
    
    # 更新 .env.local
    if [ -f ".env.local" ]; then
        echo ""
        echo "📝 更新 .env.local 文件..."
        
        # 备份原文件
        cp .env.local .env.local.bak
        
        # 更新或添加配置
        if grep -q "VERCEL_ORG_ID=" .env.local; then
            sed -i "s/VERCEL_ORG_ID=.*/VERCEL_ORG_ID=$ORG_ID/" .env.local
        else
            echo "VERCEL_ORG_ID=$ORG_ID" >> .env.local
        fi
        
        if grep -q "VERCEL_PROJECT_ID=" .env.local; then
            sed -i "s/VERCEL_PROJECT_ID=.*/VERCEL_PROJECT_ID=$PROJECT_ID/" .env.local
        else
            echo "VERCEL_PROJECT_ID=$PROJECT_ID" >> .env.local
        fi
        
        echo "✅ .env.local 已更新"
    else
        echo ""
        echo "📝 创建 .env.local 文件..."
        cat > .env.local << EOF
# Vercel 配置 (自动生成)
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=$ORG_ID
VERCEL_PROJECT_ID=$PROJECT_ID

# 应用配置
VITE_APP_TITLE=Gomoku Game
VITE_APP_VERSION=1.0.0
EOF
        echo "✅ .env.local 已创建"
    fi
    
    echo ""
    echo "🎉 配置获取完成！"
    echo "================"
    echo ""
    echo "📋 GitHub Secrets 配置："
    echo "----------------------"
    echo "在 GitHub 仓库设置中添加以下 Secrets："
    echo ""
    echo "Name: VERCEL_TOKEN"
    echo "Value: [从 https://vercel.com/account/tokens 获取]"
    echo ""
    echo "Name: VERCEL_ORG_ID"
    echo "Value: $ORG_ID"
    echo ""
    echo "Name: VERCEL_PROJECT_ID"  
    echo "Value: $PROJECT_ID"
    echo ""
    echo "📚 详细步骤请查看: docs/GITHUB_SECRETS.md"
    echo ""
    echo "🚀 下一步："
    echo "1. 在 .env.local 中填入你的 VERCEL_TOKEN"
    echo "2. 在 GitHub 仓库中配置 Secrets"
    echo "3. 推送代码触发自动部署"
    echo ""
    echo "✨ 配置文件已保存到 .vercel/ 目录"
    
else
    echo "❌ 未找到项目配置文件"
    exit 1
fi