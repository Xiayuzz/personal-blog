const express = require('express');
const { body } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');
const {
  getDashboard,
  getUsers,
  updateUserStatus,
  deleteUser,
  getAllPosts,
  updatePostStatus,
  batchUpdatePosts,
  getSystemSettings,
  updateSystemSettings,
  getSystemLogs,
  getStatistics
} = require('../controllers/adminController');

const router = express.Router();

// 所有管理后台路由都需要管理员权限
router.use(auth, adminAuth);

// 仪表板
router.get('/dashboard', getDashboard);

// 用户管理
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

// 文章管理
router.get('/posts', getAllPosts);
router.put('/posts/:id/status', updatePostStatus);
router.post('/posts/batch', batchUpdatePosts);

// 系统设置
router.get('/settings', getSystemSettings);
router.put('/settings', updateSystemSettings);

// 系统日志
router.get('/logs', getSystemLogs);

// 统计数据
router.get('/statistics', getStatistics);

module.exports = router; 