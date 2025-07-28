const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Post = require('./Post');
const Category = require('./Category');

const PostCategory = sequelize.define('PostCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
}, {
  tableName: 'post_categories',
  timestamps: true
});

// 关联关系在 index.js 中统一管理

module.exports = PostCategory; 