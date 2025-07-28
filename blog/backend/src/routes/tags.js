const express = require('express');
const { body } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');
const {
  getAllTags,
  getActiveTags,
  getPopularTags,
  getTagBySlug,
  getTagPosts,
  createTag,
  updateTag,
  deleteTag,
  batchUpdateTags,
  updateTagPostCount,
  updateAllTagPostCounts
} = require('../controllers/tagController');

const router = express.Router();

// 公开路由 - 注意：具体路径必须在通配符路径之前
router.get('/', getAllTags);
router.get('/active', getActiveTags);
router.get('/popular', getPopularTags);

// 需要认证的路由
router.post('/', auth, [
  body('name').notEmpty().withMessage('标签名不能为空')
    .isLength({ min: 1, max: 100 }).withMessage('标签名长度必须在1-100字符之间'),
  body('description').optional().isLength({ max: 500 }).withMessage('描述长度不能超过500字符'),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('颜色格式无效'),
  body('icon').optional().isLength({ max: 50 }).withMessage('图标名称长度不能超过50字符'),
  body('sortOrder').optional().isInt({ min: 0 }).withMessage('排序值必须是非负整数')
], createTag);

// 管理员路由
router.post('/batch', auth, adminAuth, [
  body('ids').isArray().withMessage('ID列表必须是数组'),
  body('action').isIn(['activate', 'deactivate', 'delete']).withMessage('无效的操作类型')
], batchUpdateTags);

router.put('/post-counts/update-all', auth, adminAuth, updateAllTagPostCounts);

// 具体路径必须在通配符路径之前
router.put('/:id', auth, [
  body('name').optional().isLength({ min: 1, max: 100 }).withMessage('标签名长度必须在1-100字符之间'),
  body('description').optional().isLength({ max: 500 }).withMessage('描述长度不能超过500字符'),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('颜色格式无效'),
  body('icon').optional().isLength({ max: 50 }).withMessage('图标名称长度不能超过50字符'),
  body('sortOrder').optional().isInt({ min: 0 }).withMessage('排序值必须是非负整数'),
  body('isActive').optional().isBoolean().withMessage('激活状态必须是布尔值')
], updateTag);

router.delete('/:id', auth, deleteTag);
router.put('/:id/post-count', auth, adminAuth, updateTagPostCount);

// 通配符路径必须在最后
router.get('/:slug', getTagBySlug);
router.get('/:slug/posts', getTagPosts);

module.exports = router; 