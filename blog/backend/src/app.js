const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./config/database');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const categoryRoutes = require('./routes/categories');
const tagRoutes = require('./routes/tags');
const uploadRoutes = require('./routes/upload');
const adminRoutes = require('./routes/admin');
const likeRoutes = require('./routes/likes');
const userRoutes = require('./routes/users');

const app = express();

// 连接数据库
connectDB();

// 中间件
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  setHeaders: (res, filePath) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Cross-Origin-Embedder-Policy', 'unsafe-none');
  }
}));

// 添加调试路由来检查静态文件服务
app.get('/debug/uploads', (req, res) => {
  const uploadsPath = path.join(__dirname, '../uploads');
  const imagesPath = path.join(uploadsPath, 'images');
  
  try {
    const uploadsExists = require('fs').existsSync(uploadsPath);
    const imagesExists = require('fs').existsSync(imagesPath);
    const imagesFiles = imagesExists ? require('fs').readdirSync(imagesPath) : [];
    
    res.json({
      uploadsPath,
      imagesPath,
      uploadsExists,
      imagesExists,
      imagesFiles,
      staticConfig: '/uploads -> ' + path.join(__dirname, '../uploads')
    });
  } catch (error) {
    res.json({
      error: error.message,
      uploadsPath,
      imagesPath
    });
  }
});

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/users', userRoutes);

// 健康检查路由 (用于 Railway 部署)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 基础路由
app.get('/', (req, res) => {
  res.json({
    message: '个人博客API服务运行正常',
    database: 'MySQL',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      posts: '/api/posts',
      comments: '/api/comments',
      categories: '/api/categories',
      tags: '/api/tags',
      upload: '/api/upload',
      admin: '/api/admin',
      likes: '/api/likes'
    }
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器内部错误' });
});

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({ message: '接口不存在' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`API地址: http://localhost:${PORT}`);
  console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app; 