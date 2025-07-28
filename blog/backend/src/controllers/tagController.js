const { Tag, Post, PostTag } = require('../models');
const { Op } = require('sequelize');

// 获取所有标签
const getAllTags = async (req, res) => {
  try {
    const { page = 1, limit = 50, search, active } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    if (active !== undefined) {
      whereClause.isActive = active === 'true';
    }

    const tags = await Tag.findAndCountAll({
      where: whereClause,
      order: [['sortOrder', 'ASC'], ['name', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      tags: tags.rows,
      total: tags.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(tags.count / limit)
    });
  } catch (error) {
    console.error('Get all tags error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 获取活跃标签
const getActiveTags = async (req, res) => {
  try {
    const tags = await Tag.findActive();
    res.json({ tags });
  } catch (error) {
    console.error('Get active tags error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 获取热门标签
const getPopularTags = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const tags = await Tag.findPopular(parseInt(limit));
    res.json({ tags });
  } catch (error) {
    console.error('Get popular tags error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 根据slug获取标签
const getTagBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const tag = await Tag.findBySlug(slug);
    
    if (!tag) {
      return res.status(404).json({ message: '标签不存在' });
    }

    res.json({ tag });
  } catch (error) {
    console.error('Get tag by slug error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 获取标签下的文章
const getTagPosts = async (req, res) => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const tag = await Tag.findBySlug(slug);
    if (!tag) {
      return res.status(404).json({ message: '标签不存在' });
    }

    const posts = await Post.findAndCountAll({
      include: [
        { model: Tag, as: 'tags', where: { id: tag.id }, attributes: [] },
        { model: require('./User'), as: 'author', attributes: ['id', 'username'] }
      ],
      where: { status: 'published' },
      order: [['publishedAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      tag,
      posts: posts.rows,
      total: posts.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(posts.count / limit)
    });
  } catch (error) {
    console.error('Get tag posts error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 创建标签
const createTag = async (req, res) => {
  try {
    const { name, description, color, icon, sortOrder } = req.body;

    // 检查标签名是否已存在
    const existingTag = await Tag.findOne({ where: { name } });
    if (existingTag) {
      return res.status(400).json({ message: '标签名已存在' });
    }

    const tag = await Tag.create({
      name,
      description,
      color,
      icon,
      sortOrder: sortOrder || 0
    });

    res.status(201).json({
      message: '标签创建成功',
      tag
    });
  } catch (error) {
    console.error('Create tag error:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: '数据验证失败', 
        errors: error.errors.map(e => e.message) 
      });
    }
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 更新标签
const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color, icon, sortOrder, isActive } = req.body;

    const tag = await Tag.findByPk(id);
    if (!tag) {
      return res.status(404).json({ message: '标签不存在' });
    }

    // 如果更新名称，检查是否与其他标签重复
    if (name && name !== tag.name) {
      const existingTag = await Tag.findOne({ where: { name } });
      if (existingTag) {
        return res.status(400).json({ message: '标签名已存在' });
      }
    }

    await tag.update({
      name: name || tag.name,
      description: description !== undefined ? description : tag.description,
      color: color || tag.color,
      icon: icon || tag.icon,
      sortOrder: sortOrder !== undefined ? sortOrder : tag.sortOrder,
      isActive: isActive !== undefined ? isActive : tag.isActive
    });

    res.json({
      message: '标签更新成功',
      tag
    });
  } catch (error) {
    console.error('Update tag error:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: '数据验证失败', 
        errors: error.errors.map(e => e.message) 
      });
    }
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 删除标签
const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await Tag.findByPk(id);
    if (!tag) {
      return res.status(404).json({ message: '标签不存在' });
    }

    // 检查标签是否有关联的文章
    const postCount = await PostTag.count({ where: { tagId: id } });
    if (postCount > 0) {
      return res.status(400).json({ 
        message: `无法删除标签，该标签还有 ${postCount} 篇文章` 
      });
    }

    await tag.destroy();

    res.json({ message: '标签删除成功' });
  } catch (error) {
    console.error('Delete tag error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 批量更新标签状态
const batchUpdateTags = async (req, res) => {
  try {
    const { ids, action } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: '请选择要操作的标签' });
    }

    let updateData = {};
    switch (action) {
      case 'activate':
        updateData = { isActive: true };
        break;
      case 'deactivate':
        updateData = { isActive: false };
        break;
      case 'delete':
        // 检查是否有文章关联
        const postCount = await PostTag.count({
          where: { tagId: { [Op.in]: ids } }
        });
        if (postCount > 0) {
          return res.status(400).json({ 
            message: `无法删除标签，还有 ${postCount} 个文章关联` 
          });
        }
        await Tag.destroy({ where: { id: { [Op.in]: ids } } });
        return res.json({ message: '标签批量删除成功' });
      default:
        return res.status(400).json({ message: '无效的操作' });
    }

    await Tag.update(updateData, { where: { id: { [Op.in]: ids } } });

    res.json({ message: '标签批量操作成功' });
  } catch (error) {
    console.error('Batch update tags error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 更新标签文章计数
const updateTagPostCount = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tag = await Tag.findByPk(id);
    if (!tag) {
      return res.status(404).json({ message: '标签不存在' });
    }

    const count = await tag.updatePostCount();

    res.json({
      message: '标签文章计数更新成功',
      postCount: count
    });
  } catch (error) {
    console.error('Update tag post count error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 更新所有标签的文章计数
const updateAllTagPostCounts = async (req, res) => {
  try {
    const tags = await Tag.findAll();
    const results = [];

    for (const tag of tags) {
      const count = await tag.updatePostCount();
      results.push({ id: tag.id, name: tag.name, postCount: count });
    }

    res.json({
      message: '所有标签文章计数更新成功',
      results
    });
  } catch (error) {
    console.error('Update all tag post counts error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

module.exports = {
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
}; 