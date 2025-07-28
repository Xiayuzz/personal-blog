const { Comment, Post, User } = require('../models');
const { Op } = require('sequelize');

// 创建评论
const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, parentId } = req.body;
    const userId = req.user.id;

    // 检查文章是否存在
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }

    // 验证评论内容
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: '评论内容不能为空' });
    }

    if (content.length > 1000) {
      return res.status(400).json({ message: '评论内容不能超过1000字符' });
    }

    // 如果是回复评论，检查父评论是否存在
    if (parentId) {
      const parentComment = await Comment.findByPk(parentId);
      if (!parentComment || parentComment.postId !== parseInt(postId)) {
        return res.status(400).json({ message: '父评论不存在' });
      }
    }

    // 创建评论
    const comment = await Comment.create({
      content: content.trim(),
      userId,
      postId: parseInt(postId),
      parentId: parentId || null,
      status: 'approved' // 默认审核通过
    });

    // 更新文章的评论数
    await post.increment('commentCount');

    // 获取完整的评论信息
    const fullComment = await Comment.findByPk(comment.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'avatar'] }
      ]
    });

    res.status(201).json({
      message: '评论发布成功',
      comment: fullComment
    });

  } catch (error) {
    console.error('创建评论失败:', error);
    res.status(500).json({ message: '评论发布失败' });
  }
};

// 获取文章评论列表
const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // 检查文章是否存在
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }

    // 获取顶级评论（不包括回复）
    const comments = await Comment.findAndCountAll({
      where: {
        postId: parseInt(postId),
        parentId: null,
        status: 'approved'
      },
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'avatar'] },
        {
          model: Comment,
          as: 'replies',
          where: { status: 'approved' },
          required: false,
          include: [{ model: User, as: 'user', attributes: ['id', 'username', 'avatar'] }],
          order: [['createdAt', 'ASC']]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      data: comments.rows,
      total: comments.count,
      page: parseInt(page),
      totalPages: Math.ceil(comments.count / limit)
    });

  } catch (error) {
    console.error('获取评论列表失败:', error);
    res.status(500).json({ message: '获取评论失败' });
  }
};

// 更新评论
const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    // 查找评论
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: '评论不存在' });
    }

    // 检查权限（只能编辑自己的评论）
    if (comment.userId !== userId) {
      return res.status(403).json({ message: '您没有权限编辑此评论' });
    }

    // 验证评论内容
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: '评论内容不能为空' });
    }

    if (content.length > 1000) {
      return res.status(400).json({ message: '评论内容不能超过1000字符' });
    }

    // 更新评论
    await comment.update({
      content: content.trim(),
      isEdited: true,
      editedAt: new Date()
    });

    // 获取更新后的完整评论信息
    const updatedComment = await Comment.findByPk(commentId, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'avatar'] }
      ]
    });

    res.json({
      message: '评论更新成功',
      comment: updatedComment
    });

  } catch (error) {
    console.error('更新评论失败:', error);
    res.status(500).json({ message: '更新评论失败' });
  }
};

// 删除评论
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    // 查找评论
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: '评论不存在' });
    }

    // 检查权限（只能删除自己的评论）
    if (comment.userId !== userId) {
      return res.status(403).json({ message: '您没有权限删除此评论' });
    }

    // 删除评论及其回复
    await Comment.destroy({
      where: {
        [Op.or]: [
          { id: commentId },
          { parentId: commentId }
        ]
      }
    });

    // 更新文章的评论数
    const post = await Post.findByPk(comment.postId);
    if (post) {
      const commentCount = await Comment.count({
        where: { postId: comment.postId }
      });
      await post.update({ commentCount });
    }

    res.json({ message: '评论删除成功' });

  } catch (error) {
    console.error('删除评论失败:', error);
    res.status(500).json({ message: '删除评论失败' });
  }
};

// 获取用户的评论列表
const getUserComments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const comments = await Comment.findAndCountAll({
      where: { userId },
      include: [
        { model: Post, as: 'post', attributes: ['id', 'title', 'slug'] },
        { model: User, as: 'user', attributes: ['id', 'username', 'avatar'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      data: comments.rows,
      total: comments.count,
      page: parseInt(page),
      totalPages: Math.ceil(comments.count / limit)
    });

  } catch (error) {
    console.error('获取用户评论列表失败:', error);
    res.status(500).json({ message: '获取评论列表失败' });
  }
};

module.exports = {
  createComment,
  getPostComments,
  updateComment,
  deleteComment,
  getUserComments
}; 