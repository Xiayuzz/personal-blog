const express = require('express');
const router = express.Router();
const { User, Post, Like, Comment } = require('../models');

// 用户统计接口
router.get('/:id/stats', async (req, res) => {
  try {
    const userId = req.params.id;
    // 发表文章数
    const postCount = await Post.count({ where: { authorId: userId } });
    // 获得点赞数（所有该用户文章的 likeCount 总和）
    const likeCount = await Post.sum('likeCount', { where: { authorId: userId } }) || 0;
    // 收到评论数（所有该用户文章的评论数总和）
    const commentCount = await Comment.count({
      include: [{ model: Post, as: 'post', where: { authorId: userId } }]
    });
    res.json({ postCount, likeCount, commentCount });
  } catch (error) {
    res.status(500).json({ message: '获取用户统计失败', error: error.message });
  }
});

// ... 其它用户相关路由 ...

module.exports = router; 