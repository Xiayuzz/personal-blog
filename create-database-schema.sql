-- 个人博客数据库建表脚本
-- 数据库名: blog
-- 字符集: utf8mb4
-- 排序规则: utf8mb4_unicode_ci

-- 创建数据库
CREATE DATABASE IF NOT EXISTS blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE blog;

-- 用户表
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255) NULL,
  bio TEXT NULL,
  role ENUM('admin', 'author', 'user') DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 分类表
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  description TEXT NULL,
  color VARCHAR(7) DEFAULT '#3B82F6',
  icon VARCHAR(50) NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 标签表
CREATE TABLE tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  description TEXT NULL,
  color VARCHAR(7) DEFAULT '#6B7280',
  icon VARCHAR(50) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 文章表
CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content LONGTEXT NOT NULL,
  excerpt TEXT NULL,
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
CREATE TABLE post_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  category_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE KEY unique_post_category (post_id, category_id)
);

-- 文章标签关联表
CREATE TABLE post_tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  tag_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE KEY unique_post_tag (post_id, tag_id)
);

-- 评论表
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  author_name VARCHAR(100) NOT NULL,
  author_email VARCHAR(100) NOT NULL,
  author_website VARCHAR(255) NULL,
  post_id INT NOT NULL,
  parent_id INT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- 文件上传表
CREATE TABLE uploads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size INT NOT NULL,
  path VARCHAR(500) NOT NULL,
  url VARCHAR(500) NOT NULL,
  uploader_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 系统设置表
CREATE TABLE settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  key_name VARCHAR(100) NOT NULL UNIQUE,
  value TEXT NULL,
  description TEXT NULL,
  type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 通知表
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  user_id INT NULL,
  related_type VARCHAR(50) NULL,
  related_id INT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_uploads_uploader_id ON uploads(uploader_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- 创建全文搜索索引
CREATE FULLTEXT INDEX idx_posts_search ON posts(title, content, excerpt);
CREATE FULLTEXT INDEX idx_comments_search ON comments(content);

-- 插入默认设置
INSERT INTO settings (key_name, value, description, type) VALUES
('site_name', '个人博客', '网站名称', 'string'),
('site_description', '分享技术与生活的个人博客', '网站描述', 'string'),
('site_keywords', '技术,博客,编程,生活', '网站关键词', 'string'),
('posts_per_page', '10', '每页显示文章数量', 'number'),
('allow_comments', 'true', '是否允许评论', 'boolean'),
('comment_moderation', 'true', '评论是否需要审核', 'boolean'),
('default_category', '1', '默认分类ID', 'number');

-- 创建默认分类
INSERT INTO categories (name, slug, description, color, icon, sort_order) VALUES
('技术', 'tech', '技术相关文章', '#3B82F6', 'code', 1),
('生活', 'life', '生活感悟', '#10B981', 'heart', 2),
('随笔', 'essay', '随笔杂谈', '#F59E0B', 'pen-tool', 3),
('教程', 'tutorial', '教程指南', '#8B5CF6', 'book-open', 4);

-- 创建默认标签
INSERT INTO tags (name, slug, description, color) VALUES
('JavaScript', 'javascript', 'JavaScript相关', '#F7DF1E'),
('React', 'react', 'React框架', '#61DAFB'),
('Node.js', 'nodejs', 'Node.js相关', '#339933'),
('Python', 'python', 'Python编程', '#3776AB'),
('数据库', 'database', '数据库相关', '#4479A1'),
('前端', 'frontend', '前端开发', '#FF6B6B'),
('后端', 'backend', '后端开发', '#4ECDC4'),
('算法', 'algorithm', '算法与数据结构', '#45B7D1');

-- 创建管理员用户（密码: 123456）
INSERT INTO users (username, email, password, role, created_at, updated_at) VALUES
('admin', 'admin@blog.com', '$2b$12$B3zNHPKtO/EtgHnkWQeZReMtB80KuNqIFrliF0a3DHwkMK/uj4Y5O', 'admin', NOW(), NOW());

-- 显示创建结果
SELECT 'Database schema created successfully!' as message;
SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'blog'; 