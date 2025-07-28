import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Save, ArrowLeft, FileText, Tag, Grid3X3, Globe, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api';
import { PostFormData } from '@/types';

const PostEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft', // 默认为草稿状态
    categoryIds: [],
    tagIds: []
  });

  // 如果是编辑模式，获取文章数据
  const { data: existingPost, isLoading: isLoadingPost } = useQuery({
    queryKey: ['post', id],
    queryFn: () => apiClient.getPostById(parseInt(id!)),
    enabled: isEditing && !!id,
  });

  // 获取分类列表
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.getCategories(),
  });

  // 获取标签列表
  const { data: tags } = useQuery({
    queryKey: ['tags'],
    queryFn: () => apiClient.getActiveTags(),
  });

  // 保存文章
  const createPostMutation = useMutation({
    mutationFn: (data: PostFormData) => apiClient.createPost(data),
    onSuccess: async (post) => {
      console.log('文章创建成功:', post);
      // 添加延迟确保文章完全保存
      setTimeout(() => {
        navigate(`/posts/${post.slug}`);
      }, 500);
    },
    onError: (error: any) => {
      console.error('创建文章失败:', error);
      alert(error.response?.data?.message || '保存失败');
    }
  });

  // 更新文章
  const updatePostMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PostFormData> }) => 
      apiClient.updatePost(parseInt(id), data),
    onSuccess: async (post) => {
      console.log('文章更新成功:', post);
      // 添加延迟确保文章完全保存
      setTimeout(() => {
        navigate(`/posts/${post.slug}`);
      }, 500);
    },
    onError: (error: any) => {
      console.error('更新文章失败:', error);
      alert(error.response?.data?.message || '保存失败');
    }
  });

  // 当获取到现有文章数据时，填充表单
  if (existingPost && !formData.title) {
    setFormData({
      title: existingPost.title,
      content: existingPost.content,
      excerpt: existingPost.excerpt || '',
      status: existingPost.status,
      categoryIds: existingPost.categories?.map(c => c.id) || [],
      tagIds: existingPost.tags?.map(t => t.id) || []
    });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('请输入文章标题');
      return;
    }
    
    if (!formData.content.trim()) {
      alert('请输入文章内容');
      return;
    }

    if (isEditing) {
      updatePostMutation.mutate({ id, data: formData });
    } else {
      createPostMutation.mutate(formData);
    }
  };

  const handleInputChange = (field: keyof PostFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryChange = (categoryId: number) => {
    const newCategoryIds = formData.categoryIds.includes(categoryId)
      ? formData.categoryIds.filter(id => id !== categoryId)
      : [...formData.categoryIds, categoryId];
    handleInputChange('categoryIds', newCategoryIds);
  };

  const handleTagChange = (tagId: number) => {
    const newTagIds = formData.tagIds.includes(tagId)
      ? formData.tagIds.filter(id => id !== tagId)
      : [...formData.tagIds, tagId];
    handleInputChange('tagIds', newTagIds);
  };

  if (isLoadingPost) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">加载中...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 头部 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>返回</span>
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? '编辑文章' : '创建文章'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditing ? '修改您的文章内容' : '开始创作您的新文章'}
          </p>
        </motion.div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 主要内容区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧：文章内容 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 标题 */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <FileText className="w-4 h-4 inline mr-2" />
                  文章标题 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="输入一个吸引人的标题..."
                  required
                />
              </motion.div>

              {/* 摘要 */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  文章摘要
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="简要描述文章内容（可选）"
                  rows={3}
                />
              </motion.div>

              {/* 内容 */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  文章内容 *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="开始写作您的文章..."
                  rows={20}
                  required
                />
              </motion.div>
            </div>

            {/* 右侧：设置面板 */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* 发布状态 */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  发布状态
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="published"
                      checked={formData.status === 'published'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">立即发布</span>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={formData.status === 'draft'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-2">
                      <EyeOff className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">保存为草稿</span>
                    </div>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {formData.status === 'published' 
                    ? '文章将立即发布并显示在首页' 
                    : '草稿文章仅您可见，不会显示在首页'
                  }
                </p>
              </div>

              {/* 分类选择 */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Grid3X3 className="w-4 h-4 inline mr-2" />
                  选择分类
                </label>
                <div className="space-y-2">
                  {categories?.map((category) => (
                    <label key={category.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.categoryIds.includes(category.id)}
                        onChange={() => handleCategoryChange(category.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 标签选择 */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Tag className="w-4 h-4 inline mr-2" />
                  选择标签
                </label>
                <div className="space-y-2">
                  {tags?.map((tag) => (
                    <label key={tag.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.tagIds.includes(tag.id)}
                        onChange={() => handleTagChange(tag.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{tag.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 保存按钮 */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={createPostMutation.isPending || updatePostMutation.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    <span>
                      {createPostMutation.isPending || updatePostMutation.isPending 
                        ? '保存中...' 
                        : formData.status === 'published' ? '发布文章' : '保存草稿'
                      }
                    </span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all duration-200"
                  >
                    取消
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostEditor; 