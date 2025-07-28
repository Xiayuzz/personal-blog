# 个人博客系统

一个现代化、响应式的个人博客网站，具有美观的UI设计和良好的用户体验。

## ✨ 特性

- 🎨 **现代设计**: 采用简约现代的设计风格，突出内容本身
- 📱 **响应式**: 移动端优先的响应式设计，支持各种设备
- ⚡ **高性能**: 优化的加载速度和流畅的交互体验
- 🔐 **安全可靠**: 完善的用户认证和权限管理系统
- 📝 **内容管理**: 强大的文章发布和管理功能
- 💬 **互动功能**: 评论系统、点赞、分享等社交功能
- 🔍 **搜索优化**: 内置搜索功能和SEO优化
- 🌙 **深色模式**: 支持深色/浅色主题切换
- ♿ **无障碍**: 符合WCAG标准的可访问性设计

## 🛠️ 技术栈

### 前端
- **React 18** - 现代化的前端框架
- **TypeScript** - 类型安全的JavaScript
- **Tailwind CSS** - 实用优先的CSS框架
- **Framer Motion** - 流畅的动画库
- **Zustand** - 轻量级状态管理
- **React Router** - 客户端路由
- **React Query** - 数据获取和缓存

### 后端
- **Node.js** - JavaScript运行时
- **Express.js** - Web应用框架
- **MongoDB** - NoSQL数据库
- **Mongoose** - MongoDB对象建模
- **JWT** - 用户认证
- **Multer** - 文件上传
- **Cloudinary** - 云存储服务

## 📁 项目结构

```
personal-blog/
├── frontend/                 # 前端项目
│   ├── public/              # 静态资源
│   ├── src/
│   │   ├── components/      # 可复用组件
│   │   ├── pages/          # 页面组件
│   │   ├── hooks/          # 自定义钩子
│   │   ├── utils/          # 工具函数
│   │   ├── types/          # TypeScript类型
│   │   ├── styles/         # 样式文件
│   │   ├── api/            # API接口
│   │   └── store/          # 状态管理
│   ├── package.json
│   └── tailwind.config.js
├── backend/                 # 后端项目
│   ├── src/
│   │   ├── controllers/    # 控制器
│   │   ├── models/         # 数据模型
│   │   ├── routes/         # 路由
│   │   ├── middleware/     # 中间件
│   │   ├── utils/          # 工具函数
│   │   └── config/         # 配置文件
│   ├── package.json
│   └── .env
├── docs/                   # 项目文档
└── README.md
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0
- MongoDB >= 4.4

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd personal-blog
```

2. **安装依赖**
```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
npm install
```

3. **配置环境变量**
```bash
# 复制环境变量模板
cp backend/.env.example backend/.env

# 编辑环境变量
# 配置数据库连接、JWT密钥等
```

4. **启动开发服务器**
```bash
# 启动后端服务器
cd backend
npm run dev

# 启动前端开发服务器
cd frontend
npm start
```

5. **访问应用**
- 前端: http://localhost:3000
- 后端API: http://localhost:5000

## 📚 文档

- [开发文档](./个人博客开发文档.md) - 详细的项目开发指南
- [UI设计指南](./UI设计指南.md) - 设计规范和组件指南
- [项目初始化脚本](./项目初始化脚本.md) - 快速搭建项目环境

## 🎯 功能特性

### 用户系统
- ✅ 用户注册/登录
- ✅ 个人资料管理
- ✅ 权限控制
- ✅ 密码重置

### 文章管理
- ✅ 文章发布/编辑/删除
- ✅ 文章分类和标签
- ✅ 草稿保存
- ✅ 文章预览
- ✅ Markdown支持

### 内容展示
- ✅ 文章列表页面
- ✅ 文章详情页面
- ✅ 分类和标签页面
- ✅ 搜索功能
- ✅ 分页功能

### 交互功能
- ✅ 评论系统
- ✅ 点赞功能
- ✅ 分享功能
- ✅ 用户关注

### 管理功能
- ✅ 后台管理面板
- ✅ 数据统计
- ✅ 内容审核
- ✅ 用户管理

### 扩展功能
- ✅ SEO优化
- ✅ 性能优化
- ✅ 深色模式
- ✅ 多语言支持
- ✅ 无障碍访问

## 🔧 开发指南

### 代码规范

我们使用以下工具确保代码质量：

- **ESLint** - JavaScript代码检查
- **Prettier** - 代码格式化
- **TypeScript** - 类型检查
- **Husky** - Git钩子

### 提交规范

我们遵循[Conventional Commits](https://www.conventionalcommits.org/)规范：

```bash
feat: 添加新功能
fix: 修复bug
docs: 更新文档
style: 代码格式调整
refactor: 代码重构
test: 添加测试
chore: 构建过程或辅助工具的变动
```

### 分支策略

- `main` - 主分支，用于生产环境
- `develop` - 开发分支，用于集成测试
- `feature/*` - 功能分支，用于新功能开发
- `hotfix/*` - 热修复分支，用于紧急修复

## 🧪 测试

### 运行测试

```bash
# 前端测试
cd frontend
npm test

# 后端测试
cd backend
npm test
```

### 测试覆盖率

```bash
# 生成测试覆盖率报告
npm run test:coverage
```

## 📦 部署

### 生产环境部署

1. **构建前端**
```bash
cd frontend
npm run build
```

2. **部署后端**
```bash
cd backend
npm run build
npm start
```

### 部署平台

- **前端**: Vercel, Netlify, GitHub Pages
- **后端**: Railway, Render, Heroku
- **数据库**: MongoDB Atlas
- **CDN**: Cloudinary

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 贡献类型

- 🐛 Bug修复
- ✨ 新功能
- 📝 文档更新
- 🎨 UI/UX改进
- ⚡ 性能优化
- 🔧 代码重构

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！

## 📞 联系我们

- 项目主页: [GitHub Repository]
- 问题反馈: [Issues]
- 邮箱: [your-email@example.com]

---

⭐ 如果这个项目对你有帮助，请给我们一个星标！ 