const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const slugify = require('slugify');

const Tag = sequelize.define('Tag', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  color: {
    type: DataTypes.STRING(7), // HEX颜色代码
    allowNull: true,
    defaultValue: '#3B82F6',
    validate: {
      is: /^#[0-9A-F]{6}$/i
    }
  },
  icon: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'tag'
  },
  postCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'postCount'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'isActive'
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'sortOrder'
  }
}, {
  tableName: 'tags',
  underscored: false, // 禁用自动下划线转换
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['slug']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['sortOrder']
    }
  ],
  hooks: {
    beforeCreate: async (tag) => {
      if (!tag.slug) {
        tag.slug = slugify(tag.name, { lower: true, strict: true });
      }
    },
    beforeUpdate: async (tag) => {
      if (tag.changed('name') && !tag.changed('slug')) {
        tag.slug = slugify(tag.name, { lower: true, strict: true });
      }
    }
  }
});

// 实例方法
Tag.prototype.updatePostCount = async function() {
  const { PostTag } = require('./index');
  const count = await PostTag.count({
    where: { tagId: this.id }
  });
  await this.update({ postCount: count });
  return count;
};

// 类方法
Tag.findBySlug = async function(slug) {
  return await this.findOne({
    where: { slug, isActive: true }
  });
};

Tag.findActive = async function() {
  return await this.findAll({
    where: { isActive: true },
    order: [['sortOrder', 'ASC'], ['name', 'ASC']]
  });
};

Tag.findPopular = async function(limit = 10) {
  return await this.findAll({
    where: { isActive: true },
    order: [['postCount', 'DESC'], ['name', 'ASC']],
    limit
  });
};

Tag.findByPost = async function(postId) {
  const { PostTag } = require('./index');
  return await this.findAll({
    include: [{
      model: PostTag,
      where: { postId },
      attributes: []
    }],
    order: [['name', 'ASC']]
  });
};

module.exports = Tag; 