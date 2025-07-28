const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Like = sequelize.define('Like', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'posts',
      key: 'id'
    }
  }
}, {
  tableName: 'likes',
  timestamps: true,
  underscored: true, // 启用下划线转换
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'post_id']
    }
  ]
});

module.exports = Like; 