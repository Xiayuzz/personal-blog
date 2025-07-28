# 个人博客系统

一个现代化、响应式的全栈个人博客网站，支持 **MySQL** 数据库，前后端分离，支持云端部署（Railway+Vercel）。

---

## ✨ 特性

- 🎨 现代简约设计，响应式布局
- 🔐 完善的用户认证和权限管理
- 📝 文章发布、编辑、分类、标签、评论、点赞
- 💬 评论系统（支持多级回复、审核）
- ⚡ 高性能，前后端分离，API接口清晰
- 🌙 深色/浅色主题切换
- 🚀 云端一键部署（Railway+Vercel）

---

## 🛠️ 技术栈

### 前端
- **React 18** + **Vite** + **TypeScript**
- **Tailwind CSS**（UI）
- **Zustand**（状态管理）
- **React Query**（数据请求）
- **React Router**（路由）
- **Axios**（API请求）

### 后端
- **Node.js** + **Express.js**
- **MySQL**（关系型数据库，推荐 Railway 云数据库）
- **Sequelize**（ORM，自动同步表结构）
- **JWT**（用户认证）
- **Multer**（文件上传）
- **dotenv**（环境变量管理）

---

## 📁 项目结构

```
personal-blog/
├── frontend/                 # 前端项目
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── types/
│   │   ├── api/
│   │   └── store/
│   ├── package.json
│   └── tailwind.config.js
├── backend/                  # 后端项目
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── config/
│   ├── package.json
│   └── .env
├── fix-database.sql          # MySQL数据库一键修复脚本
└── README.md
```

---

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0
- MySQL >= 5.7（推荐8.0+，支持utf8mb4）
- 推荐使用 Railway 云数据库

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd personal-blog
   ```

2. **安装依赖**
   ```bash
   # 前端
   cd frontend
   npm install

   # 后端
   cd ../backend
   npm install
   ```

3. **配置数据库和环境变量**
   - 参考 `backend/.env.example`，配置 MySQL 连接、JWT 密钥等
   - 推荐用 Railway 创建 MySQL 实例，获取连接信息
   - 本地开发可用 Navicat/DBeaver 连接数据库

4. **初始化数据库表结构**
   - 用 Navicat/DBeaver 连接你的 MySQL，执行 `fix-database.sql`，一键创建所有表和默认数据

5. **启动开发服务器**
   ```bash
   # 后端
   cd backend
   npm run dev

   # 前端
   cd ../frontend
   npm run dev
   ```

6. **访问应用**
   - 前端: http://localhost:3000
   - 后端API: http://localhost:5000

---

## 🧩 主要功能

- 用户注册/登录/登出
- 个人资料管理
- 文章发布/编辑/删除
- 分类、标签管理
- 评论、点赞、审核
- 后台管理（用户、文章、评论、系统设置）
- 搜索、分页、SEO优化
- 深色/浅色主题切换

---

## 🗄️ 数据库说明

- **数据库类型**：MySQL
- **表结构**：详见 `fix-database.sql`
- **字段命名**：全部为下划线风格（如 `user_id`、`created_at`）
- **支持云端部署**：Railway、PlanetScale、阿里云RDS等

---

## 🏗️ 云端部署

### 后端（Railway）

1. Railway 新建 Node.js 项目，连接 MySQL 插件
2. 配置环境变量（数据库连接、JWT密钥等）
3. 部署后端代码

### 前端（Vercel）

1. Vercel 新建 React/Vite 项目
2. 配置环境变量 `VITE_API_BASE_URL` 指向 Railway 后端 API
3. 部署前端代码

---

## 📝 常见问题

- **注册/登录报错**：请确保数据库表结构和字段与 `fix-database.sql` 完全一致
- **CORS 跨域问题**：后端 `.env` 配置 `CORS_ORIGIN`，前端 `.env` 配置 API 地址
- **表缺字段/类型不符**：重新执行 `fix-database.sql`，重启后端服务
- **管理员初始账号**：用户名 `xiayuzz`，邮箱 `admin@xiayuzz.com`，密码 `123456`

---

## 🤝 贡献指南

欢迎 PR、Issue、建议！

---

## 📄 许可证

MIT License

---

如需详细开发文档、接口文档、UI设计规范等，请联系项目维护者或查阅源码注释。

---

**如果本项目对你有帮助，请点个 Star！** 