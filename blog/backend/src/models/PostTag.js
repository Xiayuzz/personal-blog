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
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['postId', 'tagId']
    },
    {
      fields: ['postId']
    },
    {
      fields: ['tagId']
    }
  ]
});

module.exports = PostTag; 