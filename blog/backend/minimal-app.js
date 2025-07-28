const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 基本中间件
app.use(cors());
app.use(express.json());

// 健康检查端点
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Minimal app is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Health check passed',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API health check passed',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Minimal app started on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
});

module.exports = app; 