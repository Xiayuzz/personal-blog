const express = require('express');
const { body } = require('express-validator');
const { auth, optionalAuth, authorAuth } = require('../middleware/auth');
const {
  getAllPosts,
  searchPosts,
  getPostBySlug,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getUserPosts
} = require('../controllers/postController');

const router = express.Router();

// 公开路由 - 注意：具体路径必须在通配符路径之前
router.get('/', getAllPosts);
router.get('/search', searchPosts);
router.get('/id/:id', auth, getPostById); // 根据ID获取文章（需要认证）
router.get('/user/posts', auth, getUserPosts); // 用户文章路由

// 需要认证的路由
router.post('/', auth, [
  body('title').notEmpty().withMessage('标题不能为空')
    .isLength({ min: 1, max: 200 }).withMessage('标题长度必须在1-200字符之间'),
  body('content').notEmpty().withMessage('内容不能为空'),
  body('excerpt').optional().isLength({ max: 500 }).withMessage('摘要长度不能超过500字符'),
  body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('状态值无效'),
  body('categoryIds').optional().isArray().withMessage('分类ID必须是数组'),
  body('tagIds').optional().isArray().withMessage('标签ID必须是数组')
], createPost);

router.put('/:id', auth, authorAuth, [
  body('title').optional().isLength({ min: 1, max: 200 }).withMessage('标题长度必须在1-200字符之间'),
  body('content').optional().notEmpty().withMessage('内容不能为空'),
  body('excerpt').optional().isLength({ max: 500 }).withMessage('摘要长度不能超过500字符'),
  body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('状态值无效'),
  body('categoryIds').optional().isArray().withMessage('分类ID必须是数组'),
  body('tagIds').optional().isArray().withMessage('标签ID必须是数组')
], updatePost);

router.delete('/:id', auth, authorAuth, deletePost);

// 通配符路径必须在最后
router.get('/:slug', optionalAuth, getPostBySlug); // 使用可选认证

module.exports = router; 