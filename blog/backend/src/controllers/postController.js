const { Post, User, Category, Tag, PostCategory, PostTag } = require('../models');
const { Op } = require('sequelize');
const slugify = require('slugify');
const { sequelize } = require('../config/database');

// 获取所有文章
const getAllPosts = async (req, res) => {
  try {
    console.log('Starting getAllPosts...');
    
    const { 
      page = 1, 
      limit = 10, 
      search, 
      category, 
      tags, 
      author, 
      status = 'published',
      startDate,
      endDate,
      sortBy = 'published_at',
      sortOrder = 'DESC'
    } = req.query;
    
    console.log('Query parameters:', { page, limit, status, sortBy, sortOrder });
    
    const offset = (page - 1) * limit;

    // 构建查询条件
    let whereClause = '';
    const conditions = [];
    
    // 状态筛选
    if (status) {
      conditions.push(`status = '${status}'`);
    }

    // 搜索功能
    if (search) {
      conditions.push(`(title LIKE '%${search}%' OR content LIKE '%${search}%' OR excerpt LIKE '%${search}%')`);
    }

    if (conditions.length > 0) {
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    console.log('Where clause:', whereClause);

    // 排序字段映射（驼峰转下划线）
    const sortFieldMap = {
      'publishedAt': 'published_at',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at',
      'viewCount': 'view_count',
      'likeCount': 'like_count',
      'commentCount': 'comment_count',
      'authorId': 'author_id'
    };
    
    const sortField = sortFieldMap[sortBy] || sortBy;

    console.log('Executing raw SQL query...');
    
    // 获取总数
    const countQuery = `SELECT COUNT(*) as count FROM posts ${whereClause}`;
    console.log('Count query:', countQuery);
    const [countResult] = await sequelize.query(countQuery);
    const total = countResult[0].count;
    
    // 获取文章列表
    const postsQuery = `
      SELECT p.id, p.title, p.slug, p.content, p.excerpt, p.status, 
             p.published_at, p.view_count, p.like_count, p.comment_count, 
             p.author_id, p.created_at, p.updated_at,
             u.username as author_username, u.avatar as author_avatar
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      ${whereClause}
      ORDER BY p.${sortField} ${sortOrder.toUpperCase()}
      LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
    `;
    console.log('Posts query:', postsQuery);
    const [posts] = await sequelize.query(postsQuery);

    console.log('Query completed. Found posts:', total);

    // 获取文章的分类和标签信息
    const formattedPosts = await Promise.all(posts.map(async (post) => {
      // 获取文章分类
      const [categories] = await sequelize.query(`
        SELECT c.id, c.name, c.slug, c.color, c.icon
        FROM categories c
        INNER JOIN post_categories pc ON c.id = pc.category_id
        WHERE pc.post_id = ?
      `, { replacements: [post.id] });

      // 获取文章标签
      const [tags] = await sequelize.query(`
        SELECT t.id, t.name, t.slug, t.color, t.icon
        FROM tags t
        INNER JOIN post_tags pt ON t.id = pt.tag_id
        WHERE pt.post_id = ?
      `, { replacements: [post.id] });

      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        status: post.status,
        publishedAt: post.published_at,
        viewCount: post.view_count,
        likeCount: post.like_count,
        commentCount: post.comment_count,
        authorId: post.author_id,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        author: {
          id: post.author_id,
          username: post.author_username,
          avatar: post.author_avatar
        },
        categories: categories || [],
        tags: tags || []
      };
    }));

    res.json({
      data: formattedPosts,
      total: total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get all posts error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: '服务器内部错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 高级搜索
const searchPosts = async (req, res) => {
  try {
    console.log('=== 搜索文章开始 ===');
    console.log('请求参数:', req.query);
    
    const { 
      q, // 搜索关键词
      category,
      tags,
      author,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = 'relevance',
      sortOrder = 'DESC'
    } = req.query;

    console.log('解析后的参数:', {
      q, category, tags, author, startDate, endDate, page, limit, sortBy, sortOrder
    });

    const offset = (page - 1) * limit;

    // 构建基础查询
    let baseQuery = `
      SELECT DISTINCT p.id, p.title, p.slug, p.content, p.excerpt, p.status, 
             p.published_at, p.view_count, p.like_count, p.comment_count, 
             p.author_id, p.created_at, p.updated_at,
             u.username as author_username, u.avatar as author_avatar
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
    `;

    const whereConditions = ['p.status = "published"'];
    const joinConditions = [];

    // 全文搜索
    if (q) {
      whereConditions.push(`(p.title LIKE '%${q}%' OR p.content LIKE '%${q}%' OR p.excerpt LIKE '%${q}%')`);
    }

    // 分类筛选
    if (category) {
      joinConditions.push(`
        INNER JOIN post_categories pc ON p.id = pc.post_id
        INNER JOIN categories c ON pc.category_id = c.id
      `);
      
      if (!isNaN(category)) {
        // 按ID筛选
        whereConditions.push(`c.id = ${parseInt(category)}`);
      } else {
        // 按slug筛选
        whereConditions.push(`c.slug = '${category}'`);
      }
    }

    // 标签筛选
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      const isNumeric = tagArray.every(tag => !isNaN(tag));
      
      if (isNumeric) {
        // 按ID筛选
        joinConditions.push(`
          INNER JOIN post_tags pt ON p.id = pt.post_id
          INNER JOIN tags t ON pt.tag_id = t.id
        `);
        const tagIds = tagArray.map(id => parseInt(id)).join(',');
        whereConditions.push(`t.id IN (${tagIds})`);
      } else {
        // 按slug筛选
        joinConditions.push(`
          INNER JOIN post_tags pt ON p.id = pt.post_id
          INNER JOIN tags t ON pt.tag_id = t.id
        `);
        const tagSlugs = tagArray.map(slug => `'${slug}'`).join(',');
        whereConditions.push(`t.slug IN (${tagSlugs})`);
      }
    }

    // 作者筛选
    if (author) {
      whereConditions.push(`u.username LIKE '%${author}%'`);
    }

    // 日期范围筛选
    if (startDate || endDate) {
      if (startDate) {
        whereConditions.push(`p.published_at >= '${startDate}'`);
      }
      if (endDate) {
        whereConditions.push(`p.published_at <= '${endDate}'`);
      }
    }

    // 构建完整的WHERE子句
    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // 排序
    let orderClause = 'ORDER BY ';
    if (sortBy === 'relevance' && q) {
      orderClause += `CASE WHEN p.title LIKE '%${q}%' THEN 1 ELSE 0 END DESC, `;
    }
    orderClause += `p.published_at ${sortOrder.toUpperCase()}`;

    // 构建完整查询
    const fullQuery = baseQuery + joinConditions.join(' ') + ' ' + whereClause + ' ' + orderClause + ` LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
    
    console.log('完整查询SQL:', fullQuery);

    // 执行查询
    const [posts] = await sequelize.query(fullQuery);

    // 获取总数
    const countQuery = `
      SELECT COUNT(DISTINCT p.id) as count
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      ${joinConditions.join(' ')}
      ${whereClause}
    `;
    console.log('计数查询SQL:', countQuery);
    const [countResult] = await sequelize.query(countQuery);
    const total = countResult[0].count;

    console.log('查询完成，找到文章数量:', total);

    // 为每篇文章获取分类和标签
    const formattedPosts = await Promise.all(posts.map(async (post) => {
      // 获取文章分类
      const [categories] = await sequelize.query(`
        SELECT c.id, c.name, c.slug, c.color, c.icon
        FROM categories c
        INNER JOIN post_categories pc ON c.id = pc.category_id
        WHERE pc.post_id = ?
      `, { replacements: [post.id] });

      // 获取文章标签
      const [tags] = await sequelize.query(`
        SELECT t.id, t.name, t.slug, t.color, t.icon
        FROM tags t
        INNER JOIN post_tags pt ON t.id = pt.tag_id
        WHERE pt.post_id = ?
      `, { replacements: [post.id] });

      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        status: post.status,
        publishedAt: post.published_at,
        viewCount: post.view_count,
        likeCount: post.like_count,
        commentCount: post.comment_count,
        authorId: post.author_id,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        author: {
          id: post.author_id,
          username: post.author_username,
          avatar: post.author_avatar
        },
        categories: categories || [],
        tags: tags || []
      };
    }));

    console.log('数据格式化完成，返回文章数量:', formattedPosts.length);

    res.json({
      data: formattedPosts,
      total: total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('搜索文章错误:', error);
    console.error('错误堆栈:', error.stack);
    res.status(500).json({ 
      message: '服务器内部错误',
      error: process.env.NODE_ENV === 'development' ? error.message : '未知错误'
    });
  }
};

// 获取单篇文章
const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    console.log('获取文章，slug:', slug);

    // 构建查询条件
    const whereClause = { slug };
    
    // 如果用户已登录，可以获取自己的草稿文章
    if (req.user) {
      // 用户可以获取自己的所有文章，或者已发布的文章
      whereClause[Op.or] = [
        { status: 'published' },
        { authorId: req.user.id }
      ];
    } else {
      // 未登录用户只能获取已发布的文章
      whereClause.status = 'published';
    }

    const post = await Post.findOne({
      where: whereClause,
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] },
        { model: Category, as: 'categories', attributes: ['id', 'name', 'slug', 'color', 'icon'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug', 'color', 'icon'] }
      ]
    });

    if (!post) {
      console.log('文章不存在，slug:', slug);
      return res.status(404).json({ message: '文章不存在' });
    }

    console.log('找到文章，ID:', post.id, '状态:', post.status);

    // 只有已发布的文章才增加阅读量
    if (post.status === 'published') {
      await post.increment('viewCount');
    }

    // 格式化返回数据
    const formattedPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      status: post.status,
      publishedAt: post.publishedAt,
      viewCount: post.viewCount,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      authorId: post.authorId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: post.author ? {
        id: post.author.id,
        username: post.author.username,
        avatar: post.author.avatar
      } : null,
      categories: post.categories || [],
      tags: post.tags || []
    };

    res.json(formattedPost);
  } catch (error) {
    console.error('Get post by slug error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 根据ID获取文章（用于编辑）
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] },
        { model: Category, as: 'categories', attributes: ['id', 'name', 'slug', 'color', 'icon'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug', 'color', 'icon'] }
      ]
    });

    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }

    // 检查权限（只有作者或管理员可以编辑）
    if (post.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: '没有权限访问此文章' });
    }

    // 格式化返回数据
    const formattedPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      status: post.status,
      publishedAt: post.publishedAt,
      viewCount: post.viewCount,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      authorId: post.authorId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: post.author ? {
        id: post.author.id,
        username: post.author.username,
        avatar: post.author.avatar
      } : null,
      categories: post.categories || [],
      tags: post.tags || []
    };

    res.json(formattedPost);
  } catch (error) {
    console.error('Get post by id error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 创建文章
const createPost = async (req, res) => {
  try {
    const { title, content, excerpt, status = 'draft', categoryIds = [], tagIds = [] } = req.body;
    const authorId = req.user.id;

    // 生成slug
    let slug = slugify(title, { lower: true, strict: true });
    
    // 如果slug为空或只包含特殊字符，使用时间戳
    if (!slug || slug.trim() === '') {
      slug = 'post-' + Date.now();
    }
    
    // 如果slug超过200字符，截取前200字符
    if (slug.length > 200) {
      slug = slug.substring(0, 200);
    }

    // 检查slug是否已存在，如果存在则添加时间戳
    let finalSlug = slug;
    let counter = 1;
    while (true) {
      const existingPost = await Post.findOne({ where: { slug: finalSlug } });
      if (!existingPost) {
        break;
      }
      finalSlug = `${slug}-${Date.now()}-${counter}`;
      counter++;
    }

    console.log('创建文章，生成的slug:', finalSlug);

    const post = await Post.create({
      title,
      content,
      excerpt,
      slug: finalSlug,
      status,
      authorId,
      publishedAt: status === 'published' ? new Date() : null
    });

    // 关联分类
    if (categoryIds.length > 0) {
      await post.setCategories(categoryIds);
    }

    // 关联标签
    if (tagIds.length > 0) {
      await post.setTags(tagIds);
    }

    // 重新获取文章（包含关联数据）
    const createdPost = await Post.findByPk(post.id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] },
        { model: Category, as: 'categories', attributes: ['id', 'name', 'slug', 'color', 'icon'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug', 'color', 'icon'] }
      ]
    });

    console.log('文章创建完成，ID:', createdPost.id, 'Slug:', createdPost.slug);

    // 格式化返回数据
    const formattedPost = {
      id: createdPost.id,
      title: createdPost.title,
      slug: createdPost.slug,
      content: createdPost.content,
      excerpt: createdPost.excerpt,
      status: createdPost.status,
      publishedAt: createdPost.publishedAt,
      viewCount: createdPost.viewCount,
      likeCount: createdPost.likeCount,
      commentCount: createdPost.commentCount,
      authorId: createdPost.authorId,
      createdAt: createdPost.createdAt,
      updatedAt: createdPost.updatedAt,
      author: createdPost.author ? {
        id: createdPost.author.id,
        username: createdPost.author.username,
        avatar: createdPost.author.avatar
      } : null,
      categories: createdPost.categories || [],
      tags: createdPost.tags || []
    };

    res.status(201).json({
      message: '文章创建成功',
      post: formattedPost
    });
  } catch (error) {
    console.error('Create post error:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: '数据验证失败', 
        errors: error.errors.map(e => e.message) 
      });
    }
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 更新文章
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, status, categoryIds, tagIds } = req.body;

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }

    // 检查权限
    if (post.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: '没有权限修改此文章' });
    }

    // 更新文章
    const updateData = {
      title: title || post.title,
      content: content || post.content,
      excerpt: excerpt !== undefined ? excerpt : post.excerpt,
      status: status || post.status
    };

    // 如果更新标题，检查slug是否重复
    if (title && title !== post.title) {
      let slug = slugify(title, { lower: true, strict: true });
      
      // 如果slug超过200字符，截取前200字符
      if (slug.length > 200) {
        slug = slug.substring(0, 200);
      }
      
      // 确保slug不为空
      if (!slug) {
        slug = 'post-' + Date.now();
      }
      
      const existingPost = await Post.findOne({ where: { slug, id: { [Op.ne]: id } } });
      if (existingPost) {
        return res.status(400).json({ message: '文章标题已存在，请修改标题' });
      }
      
      // 更新slug
      updateData.slug = slug;
    }

    // 如果状态变为发布，设置发布时间
    if (status === 'published' && post.status !== 'published') {
      updateData.publishedAt = new Date();
    }

    await post.update(updateData);

    // 更新分类关联
    if (categoryIds !== undefined) {
      await post.setCategories(categoryIds);
    }

    // 更新标签关联
    if (tagIds !== undefined) {
      await post.setTags(tagIds);
    }

    // 重新获取文章（包含关联数据）
    const updatedPost = await Post.findByPk(id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] },
        { model: Category, as: 'categories', attributes: ['id', 'name', 'slug', 'color', 'icon'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug', 'color', 'icon'] }
      ]
    });

    // 格式化返回数据
    const formattedPost = {
      id: updatedPost.id,
      title: updatedPost.title,
      slug: updatedPost.slug,
      content: updatedPost.content,
      excerpt: updatedPost.excerpt,
      status: updatedPost.status,
      publishedAt: updatedPost.publishedAt,
      viewCount: updatedPost.viewCount,
      likeCount: updatedPost.likeCount,
      commentCount: updatedPost.commentCount,
      authorId: updatedPost.authorId,
      createdAt: updatedPost.createdAt,
      updatedAt: updatedPost.updatedAt,
      author: updatedPost.author ? {
        id: updatedPost.author.id,
        username: updatedPost.author.username,
        avatar: updatedPost.author.avatar
      } : null,
      categories: updatedPost.categories || [],
      tags: updatedPost.tags || []
    };

    res.json({
      message: '文章更新成功',
      post: formattedPost
    });
  } catch (error) {
    console.error('Update post error:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: '数据验证失败', 
        errors: error.errors.map(e => e.message) 
      });
    }
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 删除文章
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }

    // 检查权限
    if (post.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: '没有权限删除此文章' });
    }

    await post.destroy();

    res.json({ message: '文章删除成功' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 获取用户文章
const getUserPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    const userId = req.user.id;

    const whereClause = { authorId: userId };
    if (status) {
      whereClause.status = status;
    }

    const posts = await Post.findAndCountAll({
      where: whereClause,
      include: [
        { model: Category, as: 'categories', attributes: ['id', 'name', 'slug', 'color'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug', 'color'] }
      ],
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
    console.error('Get user posts error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

module.exports = {
  getAllPosts,
  searchPosts,
  getPostBySlug,
  getPostById, // Added getPostById to exports
  createPost,
  updatePost,
  deletePost,
  getUserPosts
}; 