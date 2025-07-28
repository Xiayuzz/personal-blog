const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  likePost,
  unlikePost,
  toggleLike,
  getLikeStatus,
  getUserLikes
} = require('../controllers/likeController');

// 点赞文章
router.post('/posts/:postId/like', auth, likePost);

// 取消点赞
router.delete('/posts/:postId/like', auth, unlikePost);

// 切换点赞状态
router.post('/posts/:postId/toggle-like', auth, toggleLike);

// 获取点赞状态
router.get('/posts/:postId/like-status', auth, getLikeStatus);

// 获取用户的点赞列表
router.get('/user/likes', auth, getUserLikes);

module.exports = router; 