const express = require('express');
const router = express.Router();
const { auth, optionalAuth } = require('../middleware/auth');
const {
  createComment,
  getPostComments,
  updateComment,
  deleteComment,
  getUserComments
} = require('../controllers/commentController');

// 获取文章评论列表（公开接口）
router.get('/posts/:postId/comments', optionalAuth, getPostComments);

// 创建评论
router.post('/posts/:postId/comments', auth, createComment);

// 更新评论
router.put('/comments/:commentId', auth, updateComment);

// 删除评论
router.delete('/comments/:commentId', auth, deleteComment);

// 获取用户的评论列表
router.get('/user/comments', auth, getUserComments);

module.exports = router; 