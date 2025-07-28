# 个人博客系统

一个功能完整的个人博客系统，支持文章发布、用户管理、点赞评论、文件上传等功能。

## 🚀 功能特性

- ✨ 现代化的蓝色主题 UI
- 📝 文章发布和管理
- 👥 用户注册和登录
- ❤️ 点赞和评论系统
- 🏷️ 分类和标签管理
- 🔍 文章搜索和筛选
- 📁 文件上传和头像管理
- 📱 响应式设计
- 🔒 JWT 身份验证
- 🎨 头像裁剪功能

## 🛠️ 技术栈

### 后端
- **Node.js** + **Express.js**
- **MySQL** + **Sequelize ORM**
- **JWT** 身份验证
- **Multer** 文件上传
- **CORS** 跨域处理

### 前端
- **React** + **TypeScript**
- **Vite** 构建工具
- **Tailwind CSS** 样式框架
- **Zustand** 状态管理
- **React Query** 数据获取
- **Framer Motion** 动画效果

## 📦 快速开始

### 本地开发

1. **克隆项目**
```bash
git clone <your-repo-url>
cd personal-blog
```

2. **安装依赖**
```bash
# 后端
cd backend
npm install

# 前端
cd ../frontend
npm install
```

3. **配置环境变量**
```bash
# 复制环境变量模板
cp backend/env.example backend/.env

# 编辑 .env 文件，配置数据库连接等信息
```

4. **启动开发服务器**
```bash
# 后端 (端口 3000)
cd backend
npm run dev

# 前端 (端口 3001)
cd frontend
npm run dev
```

5. **访问应用**
- 前端: http://localhost:3001
- 后端 API: http://localhost:3000

## 🚀 部署方案

### 方案一：Vercel + Railway (推荐)

**适合人群**: 个人博客、小项目、快速部署

**优点**: 
- 免费额度充足
- 自动部署
- 零配置
- 全球 CDN

**部署步骤**:
1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 部署前端
3. 在 [Railway](https://railway.app) 部署后端
4. 配置环境变量和数据库

### 方案二：传统云服务器

**适合人群**: 需要完全控制、中型项目

**优点**:
- 完全控制
- 成本可控
- 可定制化

**部署步骤**:
1. 购买云服务器 (阿里云/腾讯云)
2. 安装 Node.js, MySQL, Nginx
3. 使用 PM2 管理进程
4. 配置域名和 SSL

### 方案三：Docker 容器化

**适合人群**: 需要环境一致性、团队协作

**优点**:
- 环境一致
- 易于扩展
- 版本控制

**部署步骤**:
```bash
# 构建和启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 📋 部署脚本

使用提供的部署脚本快速部署：

```bash
# 查看部署选项
./deploy.sh

# Vercel + Railway 部署
./deploy.sh vercel

# 传统服务器部署
./deploy.sh server

# Docker 部署
./deploy.sh docker
```

## 🔧 配置说明

### 环境变量

后端环境变量 (`backend/.env`):
```env
# 数据库配置
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=blog

# JWT 配置
JWT_SECRET=your-super-secret-jwt-key

# 服务器配置
PORT=3000
NODE_ENV=production
```

前端环境变量 (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:3000
```

### 数据库配置

项目使用 MySQL 数据库，需要创建以下表：
- `users` - 用户表
- `posts` - 文章表
- `categories` - 分类表
- `tags` - 标签表
- `comments` - 评论表
- `likes` - 点赞表

详细表结构请参考 `backend/init.sql`

## 📁 项目结构

```
personal-blog/
├── backend/                 # 后端代码
│   ├── src/
│   │   ├── controllers/    # 控制器
│   │   ├── models/         # 数据模型
│   │   ├── routes/         # 路由
│   │   ├── middleware/     # 中间件
│   │   └── app.js         # 应用入口
│   ├── uploads/           # 上传文件
│   └── package.json
├── frontend/               # 前端代码
│   ├── src/
│   │   ├── components/    # 组件
│   │   ├── pages/         # 页面
│   │   ├── lib/           # 工具库
│   │   └── App.tsx        # 应用入口
│   └── package.json
├── docker-compose.yml      # Docker 配置
├── deploy.sh              # 部署脚本
└── 部署指南.md            # 详细部署指南
```

## 🔍 API 文档

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/profile` - 获取用户信息

### 文章相关
- `GET /api/posts` - 获取文章列表
- `POST /api/posts` - 创建文章
- `GET /api/posts/:slug` - 获取文章详情
- `PUT /api/posts/:id` - 更新文章
- `DELETE /api/posts/:id` - 删除文章

### 点赞评论
- `POST /api/likes/toggle` - 切换点赞状态
- `GET /api/likes/user` - 获取用户点赞列表
- `POST /api/comments` - 创建评论
- `GET /api/comments/:postId` - 获取文章评论

## 🐛 常见问题

### Q: 数据库连接失败
A: 检查环境变量配置和数据库服务状态

### Q: 文件上传失败
A: 确保 uploads 目录存在且有写入权限

### Q: 前端路由 404
A: 配置 Nginx 或 Vercel 重写规则

### Q: CORS 错误
A: 检查后端 CORS 配置和前端 API 地址

## 📈 性能优化

- 启用 Nginx 缓存
- 配置 CDN
- 数据库索引优化
- 图片压缩
- 代码分割

## 🔒 安全考虑

- 使用 HTTPS
- 设置安全头
- 输入验证
- SQL 注入防护
- XSS 防护

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如有问题，请查看：
- [部署指南.md](./部署指南.md)
- [常见问题](#常见问题)
- 提交 Issue 