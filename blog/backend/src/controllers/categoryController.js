const { Category, Post } = require('../models');
const { validationResult } = require('express-validator');
const slugify = require('slugify');
const { Op } = require('sequelize'); // Added Op import

// 获取所有分类
const getCategories = async (req, res) => {
  try {
    const { includeInactive = false } = req.query;
    
    const whereClause = {};
    if (!includeInactive) {
      whereClause.isActive = true;
    }

    const categories = await Category.findAll({
      where: whereClause,
      order: [['sortOrder', 'ASC'], ['name', 'ASC']]
    });

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 获取单个分类
const getCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const category = await Category.findBySlug(slug);
    if (!category) {
      return res.status(404).json({ message: '分类不存在' });
    }

    res.json({ category });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 创建分类
const createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: '输入验证失败',
        errors: errors.array()
      });
    }

    const { name, description, color, icon, sortOrder } = req.body;
    
    // 生成slug
    const slug = slugify(name, { lower: true, strict: true });
    
    // 检查slug是否已存在
    const existingCategory = await Category.findOne({ where: { slug } });
    if (existingCategory) {
      return res.status(400).json({ message: '分类名称已存在' });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      color,
      icon,
      sortOrder: sortOrder || 0
    });

    res.status(201).json({
      message: '分类创建成功',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 更新分类
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color, icon, sortOrder, isActive } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: '分类不存在' });
    }

    // 如果名称改变，生成新的slug
    let slug = category.slug;
    if (name && name !== category.name) {
      slug = slugify(name, { lower: true, strict: true });
      
      // 检查新slug是否已存在
      const existingCategory = await Category.findOne({ 
        where: { slug, id: { [Op.ne]: id } }
      });
      if (existingCategory) {
        return res.status(400).json({ message: '分类名称已存在' });
      }
    }

    await category.update({
      name: name || category.name,
      slug,
      description: description !== undefined ? description : category.description,
      color: color || category.color,
      icon: icon || category.icon,
      sortOrder: sortOrder !== undefined ? sortOrder : category.sortOrder,
      isActive: isActive !== undefined ? isActive : category.isActive
    });

    res.json({
      message: '分类更新成功',
      category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 删除分类
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: '分类不存在' });
    }

    // 检查是否有文章使用此分类
    const postCount = await Post.count({
      include: [{
        model: Category,
        as: 'categories',
        where: { id }
      }]
    });

    if (postCount > 0) {
      return res.status(400).json({ 
        message: `无法删除分类，还有 ${postCount} 篇文章使用此分类` 
      });
    }

    await category.destroy();

    res.json({ message: '分类删除成功' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 获取分类下的文章
const getCategoryPosts = async (req, res) => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const category = await Category.findBySlug(slug);
    if (!category) {
      return res.status(404).json({ message: '分类不存在' });
    }

    const posts = await Post.findAndCountAll({
      include: [{
        model: Category,
        as: 'categories',
        where: { id: category.id }
      }],
      where: { status: 'published' },
      order: [['publishedAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      category,
      posts: posts.rows,
      total: posts.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(posts.count / limit)
    });
  } catch (error) {
    console.error('Get category posts error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryPosts
}; 