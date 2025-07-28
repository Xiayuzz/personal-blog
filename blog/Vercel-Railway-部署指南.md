# Vercel + Railway 部署指南

## 🚀 快速部署步骤

### 第一步：创建 GitHub 仓库

1. **访问 GitHub**: https://github.com
2. **创建新仓库**:
   - 点击 "New repository"
   - 仓库名: `personal-blog`
   - 选择 "Public" (免费用户)
   - 不要初始化 README (我们已经有代码)
3. **复制仓库 URL**: `https://github.com/你的用户名/personal-blog.git`

### 第二步：推送代码到 GitHub

在项目目录中执行：

```bash
# 添加远程仓库
git remote add origin https://github.com/你的用户名/personal-blog.git

# 推送代码
git branch -M main
git push -u origin main
```

### 第三步：部署后端 (Railway)

1. **访问 Railway**: https://railway.app
2. **注册/登录** (使用 GitHub 账号)
3. **创建新项目**:
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择你的 `personal-blog` 仓库
4. **配置部署**:
   - 选择 `backend` 文件夹作为部署目录
   - Railway 会自动检测 Node.js 项目
5. **设置环境变量**:
   - 点击项目 → "Variables" 标签
   - 添加以下环境变量：

```env
DB_HOST=your-mysql-host
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=blog
DB_PORT=3306
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

6. **添加数据库**:
   - 点击 "New" → "Database" → "MySQL"
   - Railway 会自动创建 MySQL 数据库
   - 复制数据库连接信息到环境变量

### 第四步：部署前端 (Vercel)

1. **访问 Vercel**: https://vercel.com
2. **注册/登录** (使用 GitHub 账号)
3. **导入项目**:
   - 点击 "New Project"
   - 选择你的 `personal-blog` 仓库
   - 设置根目录为 `frontend`
4. **配置构建**:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. **设置环境变量**:
   - 点击 "Environment Variables"
   - 添加：

```env
VITE_API_BASE_URL=https://your-backend-url.railway.app
```

### 第五步：数据库初始化

1. **在 Railway 控制台执行 SQL**:
   - 点击数据库 → "Connect" → "MySQL"
   - 复制连接字符串
   - 使用 MySQL 客户端连接并执行 `setup-database.sql`

2. **或者使用 Railway CLI**:
```bash
# 安装 Railway CLI
npm install -g @railway/cli

# 登录
railway login

# 连接到项目
railway link

# 执行 SQL 脚本
railway run mysql -u root -p < setup-database.sql
```

### 第六步：测试部署

1. **访问前端**: `https://your-app.vercel.app`
2. **测试功能**:
   - 用户注册/登录
   - 文章发布
   - 点赞评论
   - 文件上传

## 🔧 详细配置

### Railway 后端配置

**railway.json** (已创建):
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node src/app.js",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Vercel 前端配置

**vercel.json** (已创建):
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

## 📊 监控和维护

### Railway 监控
- 访问 Railway 控制台查看应用状态
- 查看日志: 项目 → "Deployments" → 点击部署 → "Logs"
- 监控资源使用: 项目 → "Metrics"

### Vercel 监控
- 访问 Vercel 控制台查看部署状态
- 查看分析: 项目 → "Analytics"
- 查看函数日志: 项目 → "Functions"

## 🔍 故障排除

### 常见问题

**Q: 后端部署失败**
A: 检查环境变量和数据库连接

**Q: 前端无法连接后端**
A: 检查 CORS 配置和 API 地址

**Q: 数据库连接失败**
A: 确认数据库服务状态和连接信息

**Q: 文件上传失败**
A: 检查 uploads 目录权限

### 调试步骤

1. **检查 Railway 日志**:
   - 项目 → "Deployments" → 最新部署 → "Logs"

2. **检查 Vercel 构建日志**:
   - 项目 → "Deployments" → 最新部署 → "Build Logs"

3. **测试 API 端点**:
   ```bash
   curl https://your-backend-url.railway.app/api/health
   ```

4. **检查环境变量**:
   - Railway: 项目 → "Variables"
   - Vercel: 项目 → "Settings" → "Environment Variables"

## 💰 成本控制

### Railway 免费额度
- 每月 $5 免费额度
- 小型项目通常够用
- 超出后按使用量计费

### Vercel 免费额度
- 个人项目完全免费
- 无限部署
- 全球 CDN

## 🚀 优化建议

1. **启用缓存**:
   - Vercel 自动缓存静态资源
   - 配置 API 缓存策略

2. **图片优化**:
   - 使用 Vercel 图片优化
   - 压缩上传的图片

3. **数据库优化**:
   - 添加数据库索引
   - 定期清理无用数据

4. **监控告警**:
   - 设置 Railway 资源告警
   - 监控应用性能

## 📞 获取帮助

- **Railway 文档**: https://docs.railway.app
- **Vercel 文档**: https://vercel.com/docs
- **GitHub Issues**: 提交问题到仓库
- **社区支持**: Stack Overflow, Discord

## 🎉 部署完成

部署完成后，你将获得：
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 自动部署
- ✅ 零配置维护
- ✅ 免费额度充足

恭喜！你的个人博客已经成功部署到云端！🎊 