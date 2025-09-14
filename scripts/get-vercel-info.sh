#!/bin/bash

echo "============================================="
echo "       Vercel 配置信息获取指南"
echo "============================================="
echo ""
echo "1. 获取 VERCEL_TOKEN:"
echo "   访问: https://vercel.com/account/tokens"
echo "   点击 'Create Token' 创建新的访问令牌"
echo ""
echo "2. 获取 VERCEL_ORG_ID:"
echo "   方法1: 运行 'vercel whoami --debug'"
echo "   方法2: 在 Vercel Dashboard 的团队设置中查看"
echo ""
echo "3. 获取 VERCEL_PROJECT_ID:"
echo "   方法1: 在 Vercel Dashboard 中导入项目后查看项目设置"
echo "   方法2: 运行 'vercel link' 然后 'vercel env ls'"
echo ""
echo "============================================="
echo "正在尝试通过 CLI 获取信息..."
echo "============================================="
echo ""

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI 未安装，正在安装..."
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo "安装失败，请手动安装: npm install -g vercel"
        exit 1
    fi
fi

echo "当前登录用户信息:"
vercel whoami --debug

echo ""
echo "如果您已经链接了项目，以下是项目信息:"
vercel ls

echo ""
echo "============================================="
echo "请按照上述链接手动获取配置信息"
echo "============================================="
echo ""
echo "手动获取步骤:"
echo "1. Token: https://vercel.com/account/tokens"
echo "2. Org ID: https://vercel.com/dashboard (团队设置)"
echo "3. Project ID: 导入项目后在项目设置中查看"