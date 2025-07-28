#!/bin/bash

# Vercel + Railway 快速部署脚本
# 使用方法: ./deploy-vercel-railway.sh

set -e

echo "🚀 开始 Vercel + Railway 部署..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查 Git 状态
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ 错误: 请在项目根目录运行此脚本${NC}"
    exit 1
fi

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  警告: 有未提交的更改${NC}"
    git status --short
    read -p "是否继续部署? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "${BLUE}📋 部署检查清单:${NC}"
echo "1. ✅ 项目代码已准备"
echo "2. ✅ 配置文件已创建"
echo "3. ✅ 数据库脚本已准备"

echo ""
echo -e "${GREEN}🎯 下一步操作:${NC}"
echo ""
echo "1. 创建 GitHub 仓库:"
echo "   - 访问 https://github.com"
echo "   - 创建新仓库: personal-blog"
echo "   - 复制仓库 URL"
echo ""
echo "2. 推送代码到 GitHub:"
echo "   git remote add origin https://github.com/你的用户名/personal-blog.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. 部署后端 (Railway):"
echo "   - 访问 https://railway.app"
echo "   - 连接 GitHub 仓库"
echo "   - 选择 backend 文件夹"
echo "   - 设置环境变量 (见下方)"
echo ""
echo "4. 部署前端 (Vercel):"
echo "   - 访问 https://vercel.com"
echo "   - 连接 GitHub 仓库"
echo "   - 设置根目录为 frontend"
echo "   - 设置环境变量 (见下方)"
echo ""

echo -e "${BLUE}🔧 Railway 环境变量:${NC}"
cat << 'EOF'
DB_HOST=your-mysql-host
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=blog
DB_PORT=3306
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-frontend-domain.vercel.app
EOF

echo ""
echo -e "${BLUE}🔧 Vercel 环境变量:${NC}"
cat << 'EOF'
VITE_API_BASE_URL=https://your-backend-url.railway.app
EOF

echo ""
echo -e "${YELLOW}📝 重要提醒:${NC}"
echo "- 请将上述环境变量中的占位符替换为实际值"
echo "- Railway 会自动提供数据库连接信息"
echo "- 部署完成后需要初始化数据库"
echo "- 详细步骤请查看: Vercel-Railway-部署指南.md"

echo ""
echo -e "${GREEN}🎉 准备完成!${NC}"
echo "现在可以按照上述步骤进行部署了。"
echo ""
echo "💡 提示:"
echo "- 如果遇到问题，请查看部署指南"
echo "- 可以随时运行此脚本重新查看步骤"
echo "- 部署完成后记得测试所有功能" 