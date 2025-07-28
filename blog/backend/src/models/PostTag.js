const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PostTag = sequelize.define('PostTag', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'posts',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  tagId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tags',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'post_tags',
  timestamps: true,
  underscored: true, // 启用下划线转换
  indexes: [
    {
      unique: true,
      fields: ['post_id', 'tag_id']
    },
    {
      fields: ['post_id']
    },
    {
      fields: ['tag_id']
    }
  ]
});

module.exports = PostTag; 