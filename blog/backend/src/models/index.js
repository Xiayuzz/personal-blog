const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');
const Category = require('./Category');
const PostCategory = require('./PostCategory');
const Tag = require('./Tag');
const PostTag = require('./PostTag');
const Like = require('./Like');

// 用户和文章的关系 (一对多)
User.hasMany(Post, { as: 'authoredPosts', foreignKey: 'authorId' });
Post.belongsTo(User, { as: 'author', foreignKey: 'authorId', onDelete: 'CASCADE' });

// 用户和评论的关系 (一对多)
User.hasMany(Comment, { as: 'comments', foreignKey: 'userId' });
Comment.belongsTo(User, { as: 'user', foreignKey: 'userId', onDelete: 'CASCADE' });

// 文章和评论的关系 (一对多)
Post.hasMany(Comment, { as: 'comments', foreignKey: 'postId' });
Comment.belongsTo(Post, { as: 'post', foreignKey: 'postId', onDelete: 'CASCADE' });

// 评论自关联 (嵌套评论)
Comment.hasMany(Comment, { as: 'replies', foreignKey: 'parentId' });
Comment.belongsTo(Comment, { as: 'parent', foreignKey: 'parentId', onDelete: 'CASCADE' });

// 用户和点赞的关系 (多对多)
User.belongsToMany(Post, { 
  through: Like, 
  as: 'likedPosts',
  foreignKey: 'userId',
  otherKey: 'postId'
});
Post.belongsToMany(User, { 
  through: Like, 
  as: 'likedByUsers',
  foreignKey: 'postId',
  otherKey: 'userId'
});

// Like模型的直接关联
Like.belongsTo(User, { as: 'user', foreignKey: 'userId' });
Like.belongsTo(Post, { as: 'post', foreignKey: 'postId' });
User.hasMany(Like, { as: 'likes', foreignKey: 'userId' });
Post.hasMany(Like, { as: 'likes', foreignKey: 'postId' });

// 文章和分类的多对多关系
Post.belongsToMany(Category, { 
  through: PostCategory, 
  as: 'categories',
  foreignKey: 'postId',
  otherKey: 'categoryId'
});
Category.belongsToMany(Post, { 
  through: PostCategory, 
  as: 'categoryPosts',
  foreignKey: 'categoryId',
  otherKey: 'postId'
});

// 文章和标签的多对多关系
Post.belongsToMany(Tag, { 
  through: PostTag, 
  as: 'tags',
  foreignKey: 'postId',
  otherKey: 'tagId'
});
Tag.belongsToMany(Post, { 
  through: PostTag, 
  as: 'taggedPosts',
  foreignKey: 'tagId',
  otherKey: 'postId'
});

module.exports = {
  User,
  Post,
  Comment,
  Category,
  PostCategory,
  Tag,
  PostTag,
  Like
}; 