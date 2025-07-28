import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  User, 
  AuthResponse, 
  Post, 
  Category, 
  Tag, 
  Comment, 
  PostFormData, 
  CommentFormData,
  SearchParams,
  PaginatedResponse,
  DashboardData,
  SystemSettings,
  UploadedFile,
  ApiResponse,
  Like,
  LikeStatus
} from '@/types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // 认证相关API
  async register(data: { username: string; email: string; password: string }): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login', data);
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response = await this.client.get<{ user: User }>('/auth/profile');
    return response.data.user;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await this.client.put<{ message: string; user: User }>('/auth/profile', data);
    return response.data.user;
  }

  // 文章相关API
  async getPosts(params?: SearchParams): Promise<PaginatedResponse<Post>> {
    const response = await this.client.get<PaginatedResponse<Post>>('/posts', { params });
    return response.data;
  }

  async searchPosts(params: SearchParams): Promise<PaginatedResponse<Post>> {
    const response = await this.client.get<PaginatedResponse<Post>>('/posts/search', { params });
    return response.data;
  }

  async getPost(slug: string): Promise<Post> {
    const response = await this.client.get<Post>(`/posts/${slug}`);
    return response.data;
  }

  async getPostById(id: number): Promise<Post> {
    const response = await this.client.get<Post>(`/posts/id/${id}`);
    return response.data;
  }

  async createPost(data: PostFormData): Promise<Post> {
    const response = await this.client.post<{ message: string; post: Post }>('/posts', data);
    return response.data.post;
  }

  async updatePost(id: number, data: Partial<PostFormData>): Promise<Post> {
    const response = await this.client.put<{ message: string; post: Post }>(`/posts/${id}`, data);
    return response.data.post;
  }

  async deletePost(id: number): Promise<void> {
    await this.client.delete(`/posts/${id}`);
  }

  async getUserPosts(params?: { page?: number; limit?: number; status?: string }): Promise<PaginatedResponse<Post>> {
    const response = await this.client.get<PaginatedResponse<Post>>('/posts/user/posts', { params });
    return response.data;
  }

  // 分类相关API
  async getCategories(): Promise<Category[]> {
    const response = await this.client.get<{ categories: Category[] }>('/categories');
    return response.data.categories;
  }

  async getCategory(slug: string): Promise<Category> {
    const response = await this.client.get<{ category: Category }>(`/categories/${slug}`);
    return response.data.category;
  }

  async getCategoryPosts(slug: string, params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Post>> {
    const response = await this.client.get<PaginatedResponse<Post>>(`/categories/${slug}/posts`, { params });
    return response.data;
  }

  async createCategory(data: Partial<Category>): Promise<Category> {
    const response = await this.client.post<{ message: string; category: Category }>('/categories', data);
    return response.data.category;
  }

  async updateCategory(id: number, data: Partial<Category>): Promise<Category> {
    const response = await this.client.put<{ message: string; category: Category }>(`/categories/${id}`, data);
    return response.data.category;
  }

  async deleteCategory(id: number): Promise<void> {
    await this.client.delete(`/categories/${id}`);
  }

  // 标签相关API
  async getTags(params?: { page?: number; limit?: number; search?: string; active?: boolean }): Promise<PaginatedResponse<Tag>> {
    const response = await this.client.get<PaginatedResponse<Tag>>('/tags', { params });
    return response.data;
  }

  async getActiveTags(): Promise<Tag[]> {
    const response = await this.client.get<{ tags: Tag[] }>('/tags/active');
    return response.data.tags;
  }

  async getPopularTags(limit?: number): Promise<Tag[]> {
    const response = await this.client.get<{ tags: Tag[] }>('/tags/popular', { params: { limit } });
    return response.data.tags;
  }

  async getTag(slug: string): Promise<Tag> {
    const response = await this.client.get<{ tag: Tag }>(`/tags/${slug}`);
    return response.data.tag;
  }

  async getTagPosts(slug: string, params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Post>> {
    const response = await this.client.get<PaginatedResponse<Post>>(`/tags/${slug}/posts`, { params });
    return response.data;
  }

  async createTag(data: Partial<Tag>): Promise<Tag> {
    const response = await this.client.post<{ message: string; tag: Tag }>('/tags', data);
    return response.data.tag;
  }

  async updateTag(id: number, data: Partial<Tag>): Promise<Tag> {
    const response = await this.client.put<{ message: string; tag: Tag }>(`/tags/${id}`, data);
    return response.data.tag;
  }

  async deleteTag(id: number): Promise<void> {
    await this.client.delete(`/tags/${id}`);
  }

  async batchUpdateTags(ids: number[], action: 'activate' | 'deactivate' | 'delete'): Promise<void> {
    await this.client.post('/tags/batch', { ids, action });
  }

  // 评论相关API
  async getComments(postId: number, params?: { page?: number; limit?: number }): Promise<Comment[]> {
    const response = await this.client.get<PaginatedResponse<Comment>>(`/comments/posts/${postId}/comments`, { params });
    return response.data.data; // 只返回评论数组
  }

  async createComment(postId: number, data: CommentFormData): Promise<Comment> {
    const response = await this.client.post<Comment>(`/comments/posts/${postId}/comments`, data);
    return response.data;
  }

  async updateComment(id: number, data: Partial<CommentFormData>): Promise<Comment> {
    const response = await this.client.put<Comment>(`/comments/${id}`, data);
    return response.data;
  }

  async deleteComment(id: number): Promise<void> {
    await this.client.delete(`/comments/${id}`);
  }

  async getUserComments(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Comment>> {
    const response = await this.client.get<PaginatedResponse<Comment>>('/comments/user/comments', { params });
    return response.data;
  }

  // 点赞相关API
  async likePost(postId: number): Promise<{ message: string; liked: boolean }> {
    const response = await this.client.post<{ message: string; liked: boolean }>(`/likes/posts/${postId}/like`);
    return response.data;
  }

  async unlikePost(postId: number): Promise<{ message: string; liked: boolean }> {
    const response = await this.client.delete<{ message: string; liked: boolean }>(`/likes/posts/${postId}/like`);
    return response.data;
  }

  async toggleLike(postId: number): Promise<{ message: string; liked: boolean }> {
    const response = await this.client.post<{ message: string; liked: boolean }>(`/likes/posts/${postId}/toggle-like`);
    return response.data;
  }

  async getLikeStatus(postId: number): Promise<LikeStatus> {
    const response = await this.client.get<LikeStatus>(`/likes/posts/${postId}/like-status`);
    return response.data;
  }

  async getUserLikes(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Like>> {
    const response = await this.client.get<PaginatedResponse<Like>>('/likes/user/likes', { params });
    return response.data;
  }

  async getPendingComments(): Promise<Comment[]> {
    const response = await this.client.get<Comment[]>('/comments/admin/comments/pending');
    return response.data;
  }

  async moderateComment(id: number, status: 'approved' | 'rejected'): Promise<Comment> {
    const response = await this.client.put<Comment>(`/comments/admin/comments/${id}/moderate`, { status });
    return response.data;
  }

  // 文件上传相关API
  async uploadSingleFile(file: File): Promise<UploadedFile> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await this.client.post<UploadedFile>('/upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  async uploadMultipleFiles(files: File[]): Promise<UploadedFile[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    const response = await this.client.post<UploadedFile[]>('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  async uploadImage(file: File): Promise<UploadedFile> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await this.client.post<{ message: string; file: UploadedFile }>('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.file;
  }

  async getFiles(): Promise<UploadedFile[]> {
    const response = await this.client.get<UploadedFile[]>('/upload/files');
    return response.data;
  }

  async deleteFile(filename: string): Promise<void> {
    await this.client.delete(`/upload/files/${filename}`);
  }

  // 管理后台相关API
  async getDashboard(): Promise<DashboardData> {
    const response = await this.client.get<DashboardData>('/admin/dashboard');
    return response.data;
  }

  async getUsers(params?: { page?: number; limit?: number; search?: string; role?: string; status?: string }): Promise<PaginatedResponse<User>> {
    const response = await this.client.get<PaginatedResponse<User>>('/admin/users', { params });
    return response.data;
  }

  async updateUserStatus(id: number, data: { isActive?: boolean; role?: string }): Promise<User> {
    const response = await this.client.put<User>(`/admin/users/${id}/status`, data);
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await this.client.delete(`/admin/users/${id}`);
  }

  async getAdminPosts(params?: { page?: number; limit?: number; search?: string; status?: string; authorId?: number }): Promise<PaginatedResponse<Post>> {
    const response = await this.client.get<PaginatedResponse<Post>>('/admin/posts', { params });
    return response.data;
  }

  async updatePostStatus(id: number, status: string): Promise<Post> {
    const response = await this.client.put<Post>(`/admin/posts/${id}/status`, { status });
    return response.data;
  }

  async batchUpdatePosts(ids: number[], action: 'publish' | 'draft' | 'archive' | 'delete'): Promise<void> {
    await this.client.post('/admin/posts/batch', { ids, action });
  }

  async getSystemSettings(): Promise<SystemSettings> {
    const response = await this.client.get<SystemSettings>('/admin/settings');
    return response.data;
  }

  async updateSystemSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    const response = await this.client.put<SystemSettings>('/admin/settings', { settings });
    return response.data;
  }

  async getSystemLogs(params?: { page?: number; limit?: number; level?: string; startDate?: string; endDate?: string }): Promise<PaginatedResponse<any>> {
    const response = await this.client.get<PaginatedResponse<any>>('/admin/logs', { params });
    return response.data;
  }

  async getStatistics(period?: number): Promise<any> {
    const response = await this.client.get<any>('/admin/statistics', { params: { period } });
    return response.data;
  }

  async getUserStats(userId: number): Promise<{ postCount: number; likeCount: number; commentCount: number }> {
    const response = await this.client.get(`/users/${userId}/stats`);
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient; 