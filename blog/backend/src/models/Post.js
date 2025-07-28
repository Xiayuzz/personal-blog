const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      len: [1, 200]
    }
  },
  slug: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: true,
    validate: {
      len: [1, 200]
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  featuredImage: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft',
    allowNull: false
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  likeCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  commentCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'posts',
  timestamps: true,
  underscored: true, // 启用下划线转换
  hooks: {
    beforeCreate: (post) => {
      if (post.status === 'published' && !post.publishedAt) {
        post.publishedAt = new Date();
      }
    },
    beforeUpdate: (post) => {
      if (post.changed('status') && post.status === 'published' && !post.publishedAt) {
        post.publishedAt = new Date();
      }
    }
  }
});

// 关联关系在 index.js 中统一管理

// 类方法
Post.findBySlug = function(slug) {
  return this.findOne({
    where: { slug }
  });
};

Post.findPublished = function(options = {}) {
  return this.findAll({
    where: { status: 'published' },
    order: [['publishedAt', 'DESC']],
    ...options
  });
};

module.exports = Post; 