-- 个人博客数据库完整修复脚本
-- 删除现有表并重新创建所有表结构

-- 确保在正确的数据库中
USE railway;

-- 删除现有表（按依赖关系顺序）
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS post_tags;
DROP TABLE IF EXISTS post_categories;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS system_settings;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  bio TEXT,
  role ENUM('admin', 'author', 'user') DEFAULT 'user',
  is_active TINYINT(1) DEFAULT 1 COMMENT '是否激活',
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
  is_active TINYINT(1) DEFAULT 1,
  sort_order INT DEFAULT 0,
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
  post_count INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  sort_order INT DEFAULT 0,
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
  featured_image VARCHAR(255),
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  published_at DATETIME NULL,
  view_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  author_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 文章分类关联表
CREATE TABLE IF NOT EXISTS post_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT NOT NULL,
  category_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE KEY unique_post_category (post_id, category_id)
);

-- 文章标签关联表
CREATE TABLE IF NOT EXISTS post_tags (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT NOT NULL,
  tag_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE KEY unique_post_tag (post_id, tag_id)
);

-- 评论表
CREATE TABLE IF NOT EXISTS comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  content TEXT NOT NULL,
  post_id INT NOT NULL,
  author_id INT NOT NULL,
  parent_id INT NULL,
  is_active TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- 点赞表
CREATE TABLE IF NOT EXISTS likes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  post_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_post_like (user_id, post_id)
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
INSERT INTO users (username, email, password, role, is_active, created_at, updated_at) 
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
INSERT INTO categories (name, slug, description, color, icon, is_active, sort_order, created_at, updated_at) VALUES
('技术分享', 'tech', '技术相关的文章分享', '#3B82F6', 'code', 1, 1, NOW(), NOW()),
('生活感悟', 'life', '生活中的思考和感悟', '#10B981', 'heart', 1, 2, NOW(), NOW()),
('学习笔记', 'study', '学习过程中的笔记和总结', '#F59E0B', 'book', 1, 3, NOW(), NOW());

-- 插入一些默认标签
INSERT INTO tags (name, slug, description, color, icon, post_count, is_active, sort_order, created_at, updated_at) VALUES
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
CREATE INDEX idx_posts_published_at ON posts(published_at);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_categories_is_active ON categories(is_active);
CREATE INDEX idx_tags_is_active ON tags(is_active);

-- 完成提示
SELECT '数据库修复完成！所有表已重新创建并包含默认数据。' AS message; 