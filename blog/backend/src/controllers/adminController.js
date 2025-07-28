const { User, Post, Comment, Category } = require('../models');
const { Op } = require('sequelize');

// 获取仪表板数据
const getDashboard = async (req, res) => {
  try {
    // 统计数据
    const totalUsers = await User.count();
    const totalPosts = await Post.count();
    const totalComments = await Comment.count();
    const totalCategories = await Category.count();
    
    // 最近注册的用户
    const recentUsers = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 5
    });
    
    // 最近发布的文章
    const recentPosts = await Post.findAll({
      include: [{ model: User, as: 'author', attributes: ['username'] }],
      where: { status: 'published' },
      order: [['publishedAt', 'DESC']],
      limit: 5
    });
    
    // 待审核的评论
    const pendingComments = await Comment.count({
      where: { status: 'pending' }
    });
    
    // 草稿文章
    const draftPosts = await Post.count({
      where: { status: 'draft' }
    });

    res.json({
      stats: {
        totalUsers,
        totalPosts,
        totalComments,
        totalCategories,
        pendingComments,
        draftPosts
      },
      recentUsers,
      recentPosts
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 用户管理
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role, status } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }
    if (role) {
      whereClause.role = role;
    }
    if (status !== undefined) {
      whereClause.isActive = status === 'active';
    }

    const users = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      users: users.rows,
      total: users.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(users.count / limit)
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 更新用户状态
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, role } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 不能修改自己的角色
    if (user.id === req.user.id && role && role !== user.role) {
      return res.status(400).json({ message: '不能修改自己的角色' });
    }

    await user.update({
      isActive: isActive !== undefined ? isActive : user.isActive,
      role: role || user.role
    });

    res.json({
      message: '用户状态更新成功',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 删除用户
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 不能删除自己
    if (user.id === req.user.id) {
      return res.status(400).json({ message: '不能删除自己的账户' });
    }

    // 检查用户是否有文章
    const postCount = await Post.count({ where: { authorId: id } });
    if (postCount > 0) {
      return res.status(400).json({ 
        message: `无法删除用户，该用户还有 ${postCount} 篇文章` 
      });
    }

    await user.destroy();

    res.json({ message: '用户删除成功' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 获取所有文章（管理视图）
const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status, authorId } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }
    if (status) {
      whereClause.status = status;
    }
    if (authorId) {
      whereClause.authorId = authorId;
    }

    const posts = await Post.findAndCountAll({
      where: whereClause,
      include: [{ model: User, as: 'author', attributes: ['id', 'username'] }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      posts: posts.rows,
      total: posts.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(posts.count / limit)
    });
  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 更新文章状态
const updatePostStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'published', 'archived'].includes(status)) {
      return res.status(400).json({ message: '状态值无效' });
    }

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }

    await post.update({ status });

    res.json({
      message: '文章状态更新成功',
      post: {
        id: post.id,
        title: post.title,
        status: post.status
      }
    });
  } catch (error) {
    console.error('Update post status error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 批量操作文章
const batchUpdatePosts = async (req, res) => {
  try {
    const { ids, action } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: '请选择要操作的文章' });
    }

    let updateData = {};
    switch (action) {
      case 'publish':
        updateData = { status: 'published' };
        break;
      case 'draft':
        updateData = { status: 'draft' };
        break;
      case 'archive':
        updateData = { status: 'archived' };
        break;
      case 'delete':
        await Post.destroy({ where: { id: { [Op.in]: ids } } });
        return res.json({ message: '文章批量删除成功' });
      default:
        return res.status(400).json({ message: '无效的操作' });
    }

    await Post.update(updateData, { where: { id: { [Op.in]: ids } } });

    res.json({ message: '文章批量操作成功' });
  } catch (error) {
    console.error('Batch update posts error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 获取系统设置
const getSystemSettings = async (req, res) => {
  try {
    // 这里可以从数据库或配置文件获取系统设置
    const settings = {
      siteName: '个人博客',
      siteDescription: '一个现代化的个人博客系统',
      allowRegistration: true,
      requireEmailVerification: false,
      allowComments: true,
      moderateComments: true,
      postsPerPage: 10,
      commentsPerPage: 20,
      maxUploadSize: 10 * 1024 * 1024, // 10MB
      allowedFileTypes: ['image', 'document', 'video', 'audio']
    };

    res.json({ settings });
  } catch (error) {
    console.error('Get system settings error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 更新系统设置
const updateSystemSettings = async (req, res) => {
  try {
    const { settings } = req.body;

    // 这里可以将设置保存到数据库或配置文件
    // 暂时返回成功响应
    res.json({
      message: '系统设置更新成功',
      settings
    });
  } catch (error) {
    console.error('Update system settings error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 获取系统日志
const getSystemLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, level, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    // 这里应该从日志文件或数据库获取日志
    // 暂时返回模拟数据
    const logs = [
      {
        id: 1,
        level: 'info',
        message: '系统启动成功',
        timestamp: new Date().toISOString(),
        user: 'system'
      },
      {
        id: 2,
        level: 'warn',
        message: '数据库连接延迟',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        user: 'system'
      }
    ];

    res.json({
      logs,
      total: logs.length,
      currentPage: parseInt(page),
      totalPages: 1
    });
  } catch (error) {
    console.error('Get system logs error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 获取统计数据
const getStatistics = async (req, res) => {
  try {
    const { period = '30' } = req.query; // 默认30天
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // 用户统计
    const totalUsers = await User.count();
    const newUsers = await User.count({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      }
    });

    // 文章统计
    const totalPosts = await Post.count();
    const publishedPosts = await Post.count({ where: { status: 'published' } });
    const draftPosts = await Post.count({ where: { status: 'draft' } });

    // 评论统计
    const totalComments = await Comment.count();
    const pendingComments = await Comment.count({ where: { status: 'pending' } });

    // 分类统计
    const totalCategories = await Category.count();
    const activeCategories = await Category.count({ where: { isActive: true } });

    res.json({
      period: parseInt(period),
      users: {
        total: totalUsers,
        new: newUsers
      },
      posts: {
        total: totalPosts,
        published: publishedPosts,
        draft: draftPosts
      },
      comments: {
        total: totalComments,
        pending: pendingComments
      },
      categories: {
        total: totalCategories,
        active: activeCategories
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

module.exports = {
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
}; 