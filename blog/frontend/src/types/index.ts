// 用户相关类型
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  bio?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// 文章相关类型
export interface Post {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author: User;
  categories: Category[];
  tags: Tag[];
}

export interface PostFormData {
  title: string;
  content: string;
  excerpt?: string;
  status: 'draft' | 'published' | 'archived';
  categoryIds: number[];
  tagIds: number[];
}

// 分类相关类型
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

// 标签相关类型
export interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
  postCount: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// 点赞相关类型
export interface Like {
  id: number;
  userId: number;
  postId: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
  post?: Post;
}

export interface LikeStatus {
  liked: boolean;
  likeCount: number;
}

// 评论相关类型
export interface Comment {
  id: number;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  isEdited: boolean;
  editedAt?: string;
  parentId?: number;
  createdAt: string;
  updatedAt: string;
  user: User;
  post: Post;
  replies?: Comment[];
}

export interface CommentFormData {
  content: string;
  parentId?: number;
}

// 分页相关类型
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  currentPage: number;
  totalPages: number;
}

// 搜索相关类型
export interface SearchParams {
  q?: string;
  category?: string;
  tags?: string;
  author?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// 仪表板相关类型
export interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalCategories: number;
  pendingComments: number;
  draftPosts: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentUsers: User[];
  recentPosts: Post[];
}

// 系统设置相关类型
export interface SystemSettings {
  siteName: string;
  siteDescription: string;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  allowComments: boolean;
  moderateComments: boolean;
  postsPerPage: number;
  commentsPerPage: number;
  maxUploadSize: number;
  allowedFileTypes: string[];
}

// API响应相关类型
export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
}

// 文件上传相关类型
export interface UploadedFile {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  url: string;
}

// 验证错误相关类型
export interface ValidationError {
  field: string;
  message: string;
}

// Toast通知相关类型
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

// 路由配置相关类型
export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  children?: RouteConfig[];
  requireAuth?: boolean;
  requireAdmin?: boolean;
} 