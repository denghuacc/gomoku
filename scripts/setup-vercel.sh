#!/bin/bash

# Vercel 配置获取脚本
# 用于获取 GitHub Actions 所需的 Vercel secrets

echo "🚀 Vercel 部署配置助手"
echo "===================="
echo ""

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI 未安装，正在安装..."
    npm install -g vercel@latest
    if [ $? -ne 0 ]; then
        echo "❌ 安装失败，请手动安装: npm install -g vercel@latest"
        exit 1
    fi
    echo "✅ Vercel CLI 安装成功"
    echo ""
fi

echo "📋 获取 Vercel 配置信息的步骤："
echo ""
echo "1️⃣  首先，登录到 Vercel:"
echo "   vercel login"
echo ""
echo "2️⃣  然后，在项目根目录运行:"
echo "   vercel link"
echo ""
echo "3️⃣  获取项目配置信息:"
echo "   vercel env ls"
echo ""
echo "4️⃣  获取组织和项目 ID (在 .vercel/project.json 中)"
echo ""

# 检查是否已经登录
echo "🔍 检查 Vercel 登录状态..."
if vercel whoami &> /dev/null; then
    echo "✅ 已登录到 Vercel"
    echo "当前用户: $(vercel whoami)"
    echo ""
else
    echo "❌ 未登录到 Vercel"
    echo "请先运行: vercel login"
    echo ""
    read -p "是否现在登录？(y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        vercel login
    else
        echo "请手动登录后重新运行此脚本"
        exit 1
    fi
fi

# 检查是否已经链接项目
if [ -f ".vercel/project.json" ]; then
    echo "✅ 项目已链接到 Vercel"
    echo ""
    echo "📄 项目配置信息:"
    cat .vercel/project.json
    echo ""
    
    # 提取配置信息
    ORG_ID=$(jq -r '.orgId' .vercel/project.json 2>/dev/null)
    PROJECT_ID=$(jq -r '.projectId' .vercel/project.json 2>/dev/null)
    
    echo "🔑 GitHub Secrets 配置信息:"
    echo "=========================="
    echo ""
    echo "VERCEL_ORG_ID:     $ORG_ID"
    echo "VERCEL_PROJECT_ID: $PROJECT_ID"
    echo ""
    echo "⚠️  还需要配置 VERCEL_TOKEN:"
    echo "   1. 访问: https://vercel.com/account/tokens"
    echo "   2. 创建新的 API Token"
    echo "   3. 复制 token 值"
    echo ""
    
else
    echo "❌ 项目未链接到 Vercel"
    echo ""
    read -p "是否现在链接项目？(y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "正在链接项目到 Vercel..."
        vercel link
        
        if [ -f ".vercel/project.json" ]; then
            echo "✅ 项目链接成功！"
            echo ""
            echo "📄 项目配置信息:"
            cat .vercel/project.json
            echo ""
        else
            echo "❌ 项目链接失败"
            exit 1
        fi
    else
        echo "请手动链接项目: vercel link"
        exit 1
    fi
fi

echo ""
echo "📝 配置 GitHub Secrets 的步骤:"
echo "============================="
echo ""
echo "1. 访问 GitHub 仓库设置:"
echo "   https://github.com/denghuacc/gomoku/settings/secrets/actions"
echo ""
echo "2. 点击 'New repository secret' 添加以下 secrets:"
echo ""
echo "   名称: VERCEL_TOKEN"
echo "   值: [从 https://vercel.com/account/tokens 获取的 token]"
echo ""
echo "   名称: VERCEL_ORG_ID"
echo "   值: $ORG_ID"
echo ""
echo "   名称: VERCEL_PROJECT_ID"
echo "   值: $PROJECT_ID"
echo ""
echo "3. 添加完成后，推送代码即可触发自动部署！"
echo ""
echo "🎉 配置完成！"