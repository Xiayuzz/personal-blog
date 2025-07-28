const { Like, Post, User } = require('../models');
const { Op } = require('sequelize');

// 点赞文章
const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    // 检查文章是否存在
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }

    // 检查是否已经点赞
    const existingLike = await Like.findOne({
      where: { userId, postId }
    });

    if (existingLike) {
      return res.status(400).json({ message: '您已经点赞过这篇文章了' });
    }

    // 创建点赞
    await Like.create({ userId, postId });

    // 更新文章的点赞数
    await post.increment('likeCount');

    res.status(201).json({ 
      message: '点赞成功',
      liked: true
    });

  } catch (error) {
    console.error('点赞失败:', error);
    res.status(500).json({ message: '点赞失败' });
  }
};

// 取消点赞
const unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    // 检查文章是否存在
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }

    // 查找并删除点赞
    const like = await Like.findOne({
      where: { userId, postId }
    });

    if (!like) {
      return res.status(400).json({ message: '您还没有点赞过这篇文章' });
    }

    await like.destroy();

    // 更新文章的点赞数
    await post.decrement('likeCount');

    res.json({ 
      message: '取消点赞成功',
      liked: false
    });

  } catch (error) {
    console.error('取消点赞失败:', error);
    res.status(500).json({ message: '取消点赞失败' });
  }
};

// 切换点赞状态
const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    // 检查文章是否存在
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }

    // 检查是否已经点赞
    const existingLike = await Like.findOne({
      where: { userId, postId }
    });

    if (existingLike) {
      // 取消点赞
      await existingLike.destroy();
      await post.decrement('likeCount');
      
      res.json({ 
        message: '取消点赞成功',
        liked: false
      });
    } else {
      // 添加点赞
      await Like.create({ userId, postId });
      await post.increment('likeCount');
      
      res.json({ 
        message: '点赞成功',
        liked: true
      });
    }

  } catch (error) {
    console.error('切换点赞状态失败:', error);
    res.status(500).json({ message: '操作失败' });
  }
};

// 获取文章的点赞状态
const getLikeStatus = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const like = await Like.findOne({
      where: { userId, postId }
    });

    res.json({ 
      liked: !!like,
      likeCount: await Like.count({ where: { postId } })
    });

  } catch (error) {
    console.error('获取点赞状态失败:', error);
    res.status(500).json({ message: '获取点赞状态失败' });
  }
};

// 获取用户的点赞列表
const getUserLikes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    console.log('获取用户点赞列表，用户ID:', userId);

    // 使用原始SQL查询避免关联问题
    const { sequelize } = require('../config/database');
    
    // 获取总数
    const [countResult] = await sequelize.query(`
      SELECT COUNT(*) as count FROM likes WHERE user_id = ?
    `, { replacements: [userId] });
    
    const total = countResult[0].count;
    console.log('找到点赞记录数量:', total);

    if (total > 0) {
      // 获取点赞列表
      const [likes] = await sequelize.query(`
        SELECT 
          l.id,
          l.user_id,
          l.post_id,
          l.created_at,
          l.updated_at,
          p.title as post_title,
          p.slug as post_slug,
          p.excerpt as post_excerpt,
          p.status as post_status,
          u.username as author_username,
          u.avatar as author_avatar
        FROM likes l
        LEFT JOIN posts p ON l.post_id = p.id
        LEFT JOIN users u ON p.author_id = u.id
        WHERE l.user_id = ?
        ORDER BY l.created_at DESC
        LIMIT ? OFFSET ?
      `, { 
        replacements: [userId, parseInt(limit), parseInt(offset)] 
      });

      // 格式化数据
      const formattedLikes = likes.map(like => ({
        id: like.id,
        userId: like.user_id,
        postId: like.post_id,
        createdAt: like.created_at,
        updatedAt: like.updated_at,
        post: {
          id: like.post_id,
          title: like.post_title,
          slug: like.post_slug,
          excerpt: like.post_excerpt,
          status: like.post_status,
          author: {
            username: like.author_username,
            avatar: like.author_avatar
          }
        }
      }));

      res.json({
        data: formattedLikes,
        total: total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit)
      });
    } else {
      // 没有数据时返回空数组
      res.json({
        data: [],
        total: 0,
        page: parseInt(page),
        totalPages: 0
      });
    }

  } catch (error) {
    console.error('获取用户点赞列表失败:', error);
    console.error('错误堆栈:', error.stack);
    res.status(500).json({ 
      message: '获取点赞列表失败',
      error: error.message 
    });
  }
};

module.exports = {
  likePost,
  unlikePost,
  toggleLike,
  getLikeStatus,
  getUserLikes
}; 