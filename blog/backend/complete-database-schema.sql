-- 个人博客完整数据库架构脚本

-- 创建数据库 (如果不存在)
CREATE DATABASE IF NOT EXISTS railway CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE railway;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  bio TEXT,
  role ENUM('admin', 'author', 'user') DEFAULT 'user',
  isActive TINYINT(1) DEFAULT 1 COMMENT '是否激活',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7) COMMENT 'HEX颜色代码',
  icon VARCHAR(50),
  isActive TINYINT(1) DEFAULT 1,
  sortOrder INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 标签表
CREATE TABLE IF NOT EXISTS tags (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6' COMMENT 'HEX颜色代码',
  icon VARCHAR(50) DEFAULT 'tag',
  postCount INT DEFAULT 0,
  isActive TINYINT(1) DEFAULT 1,
  sortOrder INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 文章表
CREATE TABLE IF NOT EXISTS posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featuredImage VARCHAR(255),
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  publishedAt DATETIME NULL,
  viewCount INT DEFAULT 0,
  likeCount INT DEFAULT 0,
  commentCount INT DEFAULT 0,
  authorId INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE
);

-- 文章分类关联表
CREATE TABLE IF NOT EXISTS post_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  postId INT NOT NULL,
  categoryId INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE KEY unique_post_category (postId, categoryId)
);

-- 文章标签关联表
CREATE TABLE IF NOT EXISTS post_tags (
  id INT PRIMARY KEY AUTO_INCREMENT,
  postId INT NOT NULL,
  tagId INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE KEY unique_post_tag (postId, tagId)
);

-- 评论表
CREATE TABLE IF NOT EXISTS comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  content TEXT NOT NULL,
  postId INT NOT NULL,
  authorId INT NOT NULL,
  parentId INT NULL,
  isActive TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parentId) REFERENCES comments(id) ON DELETE CASCADE
);

-- 点赞表
CREATE TABLE IF NOT EXISTS likes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  postId INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_post_like (userId, postId)
);

-- 系统设置表
CREATE TABLE IF NOT EXISTS system_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  key_name VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入默认管理员账户
INSERT INTO users (username, email, password, role, isActive, created_at, updated_at) 
VALUES (
    'xiayuzz', 
    'admin@xiayuzz.com', 
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- 密码: 123456
    'admin', 
    1, 
    NOW(), 
    NOW()
);

-- 插入一些默认分类
INSERT INTO categories (name, slug, description, color, icon, isActive, sortOrder, created_at, updated_at) VALUES
('技术分享', 'tech', '技术相关的文章分享', '#3B82F6', 'code', 1, 1, NOW(), NOW()),
('生活感悟', 'life', '生活中的思考和感悟', '#10B981', 'heart', 1, 2, NOW(), NOW()),
('学习笔记', 'study', '学习过程中的笔记和总结', '#F59E0B', 'book', 1, 3, NOW(), NOW());

-- 插入一些默认标签
INSERT INTO tags (name, slug, description, color, icon, postCount, isActive, sortOrder, created_at, updated_at) VALUES
('JavaScript', 'javascript', 'JavaScript相关技术', '#F7DF1E', 'code', 0, 1, 1, NOW(), NOW()),
('React', 'react', 'React框架相关', '#61DAFB', 'code', 0, 1, 2, NOW(), NOW()),
('Node.js', 'nodejs', 'Node.js后端开发', '#339933', 'server', 0, 1, 3, NOW(), NOW()),
('数据库', 'database', '数据库相关技术', '#FF6B6B', 'database', 0, 1, 4, NOW(), NOW());

-- 插入默认系统设置
INSERT INTO system_settings (key_name, value, description, created_at, updated_at) VALUES
('site_name', '个人博客', '网站名称', NOW(), NOW()),
('site_description', '分享技术见解、生活感悟和有趣的故事', '网站描述', NOW(), NOW()),
('posts_per_page', '10', '每页显示文章数量', NOW(), NOW()),
('allow_registration', 'true', '是否允许用户注册', NOW(), NOW()),
('allow_comments', 'true', '是否允许评论', NOW(), NOW());

-- 创建索引
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(publishedAt);
CREATE INDEX idx_posts_author_id ON posts(authorId);
CREATE INDEX idx_comments_post_id ON comments(postId);
CREATE INDEX idx_comments_author_id ON comments(authorId);
CREATE INDEX idx_likes_user_id ON likes(userId);
CREATE INDEX idx_likes_post_id ON likes(postId);
CREATE INDEX idx_categories_is_active ON categories(isActive);
CREATE INDEX idx_tags_is_active ON tags(isActive); 