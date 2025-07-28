const express = require('express');
const { body } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryPosts
} = require('../controllers/categoryController');

const router = express.Router();

// 分类验证规则
const categoryValidation = [
  body('name')
    .isLength({ min: 1, max: 50 })
    .withMessage('分类名称长度必须在1-50个字符之间'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('分类描述不能超过500个字符'),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('颜色格式无效，请使用HEX格式（如：#FF0000）'),
  body('icon')
    .optional()
    .isLength({ max: 50 })
    .withMessage('图标名称不能超过50个字符'),
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('排序值必须是非负整数')
];

// 公开路由 - 注意：具体路径必须在通配符路径之前
router.get('/', getCategories); // 获取所有分类

// 管理员路由
router.post('/', auth, adminAuth, categoryValidation, createCategory); // 创建分类
router.put('/:id', auth, adminAuth, categoryValidation, updateCategory); // 更新分类
router.delete('/:id', auth, adminAuth, deleteCategory); // 删除分类

// 通配符路径必须在最后
router.get('/:slug', getCategory); // 获取单个分类
router.get('/:slug/posts', getCategoryPosts); // 获取分类下的文章

module.exports = router; 