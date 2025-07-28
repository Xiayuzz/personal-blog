# 项目结构说明

## 📁 目录结构

```
personal-blog/
├── backend/                 # 后端代码
│   ├── src/                # 源代码
│   │   ├── controllers/    # 控制器
│   │   ├── models/         # 数据模型
│   │   ├── routes/         # 路由
│   │   ├── middleware/     # 中间件
│   │   └── app.js         # 应用入口
│   ├── uploads/           # 上传文件目录
│   ├── package.json       # 依赖配置
│   ├── railway.json       # Railway 部署配置
│   ├── Dockerfile         # Docker 配置
│   ├── init.sql           # 数据库初始化脚本
│   └── env.example        # 环境变量模板
├── frontend/               # 前端代码
│   ├── src/               # 源代码
│   │   ├── components/    # 组件
│   │   ├── pages/         # 页面
│   │   ├── lib/           # 工具库
│   │   └── App.tsx        # 应用入口
│   ├── package.json       # 依赖配置
│   ├── vercel.json        # Vercel 部署配置
│   ├── Dockerfile         # Docker 配置
│   └── nginx.conf         # Nginx 配置
├── README.md              # 项目说明
├── Vercel-Railway-部署指南.md  # 部署指南
├── deploy-vercel-railway.sh  # 部署脚本
├── setup-database.sql     # 数据库初始化脚本
├── docker-compose.yml     # Docker Compose 配置
└── .gitignore            # Git 忽略文件
```

## 🚀 部署文件说明

### 后端部署文件
- `railway.json` - Railway 平台部署配置
- `Dockerfile` - Docker 容器化配置
- `init.sql` - 数据库表结构初始化
- `env.example` - 环境变量模板

### 前端部署文件
- `vercel.json` - Vercel 平台部署配置
- `Dockerfile` - Docker 容器化配置
- `nginx.conf` - Nginx 服务器配置

### 部署指南
- `Vercel-Railway-部署指南.md` - 详细部署步骤
- `deploy-vercel-railway.sh` - 快速部署脚本
- `setup-database.sql` - 数据库初始化脚本

## 🎯 核心功能

### 后端功能
- ✅ 用户认证 (JWT)
- ✅ 文章管理 (CRUD)
- ✅ 分类标签管理
- ✅ 点赞评论系统
- ✅ 文件上传
- ✅ 搜索筛选

### 前端功能
- ✅ 响应式设计
- ✅ 现代化 UI (蓝色主题)
- ✅ 用户注册/登录
- ✅ 文章发布/编辑
- ✅ 点赞评论
- ✅ 头像上传/裁剪
- ✅ 搜索和筛选

## 🛠️ 技术栈

### 后端
- Node.js + Express.js
- MySQL + Sequelize ORM
- JWT 身份验证
- Multer 文件上传
- CORS 跨域处理

### 前端
- React + TypeScript
- Vite 构建工具
- Tailwind CSS 样式
- Zustand 状态管理
- React Query 数据获取
- Framer Motion 动画

## 📦 部署方案

### 推荐方案：Vercel + Railway
- **前端**: Vercel (免费，自动部署)
- **后端**: Railway (免费额度，简单配置)
- **数据库**: Railway MySQL 或外部服务

### 备选方案
- **传统服务器**: 阿里云/腾讯云
- **Docker 容器化**: 环境一致性
- **Kubernetes**: 大规模部署

## 🔧 快速开始

1. **克隆项目**
```bash
git clone https://github.com/你的用户名/personal-blog.git
cd personal-blog
```

2. **安装依赖**
```bash
# 后端
cd backend && npm install

# 前端
cd ../frontend && npm install
```

3. **配置环境变量**
```bash
# 复制环境变量模板
cp backend/env.example backend/.env
# 编辑 .env 文件
```

4. **启动开发服务器**
```bash
# 后端 (端口 3000)
cd backend && npm run dev

# 前端 (端口 3001)
cd ../frontend && npm run dev
```

## 🚀 部署步骤

1. **推送代码到 GitHub**
2. **部署后端 (Railway)**
3. **部署前端 (Vercel)**
4. **初始化数据库**
5. **测试功能**

详细步骤请查看 `Vercel-Railway-部署指南.md` 