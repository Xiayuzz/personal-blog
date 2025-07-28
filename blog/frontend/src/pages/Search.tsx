import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search as SearchIcon, Filter, Calendar, Eye, User, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api';
import { Post, Category, Tag } from '@/types';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // 获取搜索参数
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const tags = searchParams.get('tags') || '';
  const page = parseInt(searchParams.get('page') || '1');

  // 同步URL参数到本地状态
  useEffect(() => {
    setSearchQuery(query);
    setSelectedCategory(category);
    setSelectedTags(tags ? tags.split(',') : []);
  }, [query, category, tags]);

  // 获取搜索结果
  const { data: searchResults, isLoading: isSearchLoading } = useQuery({
    queryKey: ['search', query, category, tags, page],
    queryFn: () => apiClient.searchPosts({ q: query, category, tags, page }),
    enabled: !!query || !!category || !!tags,
  });

  // 获取分类列表
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.getCategories(),
  });

  // 获取标签列表
  const { data: tagsData, isLoading: isTagsLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: () => apiClient.getActiveTags(),
  });

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
    params.set('page', '1'); // 重置到第一页
    setSearchParams(params);
  };

  // 处理分类筛选
  const handleCategoryChange = (categoryId: string) => {
    const newCategory = selectedCategory === categoryId ? '' : categoryId;
    setSelectedCategory(newCategory);
    const params = new URLSearchParams(searchParams);
    if (newCategory) {
      params.set('category', newCategory);
    } else {
      params.delete('category');
    }
    params.set('page', '1'); // 重置到第一页
    setSearchParams(params);
  };

  // 处理标签筛选
  const handleTagToggle = (tagId: string) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    setSelectedTags(newTags);
    const params = new URLSearchParams(searchParams);
    if (newTags.length > 0) {
      params.set('tags', newTags.join(','));
    } else {
      params.delete('tags');
    }
    params.set('page', '1'); // 重置到第一页
    setSearchParams(params);
  };

  // 清除所有筛选
  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedTags([]);
    setSearchQuery('');
    setSearchParams({});
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜索头部 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">搜索文章</h1>
          
          {/* 搜索表单 */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative max-w-2xl">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="输入关键词搜索文章..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-24 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                搜索
              </button>
            </div>
          </form>

          {/* 筛选按钮 */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Filter className="w-4 h-4" />
              <span>筛选</span>
            </button>

            {(selectedCategory || selectedTags.length > 0 || searchQuery) && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                <span>清除筛选</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* 筛选面板 */}
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 p-6 bg-white rounded-xl shadow-lg border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">筛选条件</h3>
            
            {/* 分类筛选 */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">按分类筛选</h4>
              {isCategoriesLoading ? (
                <div className="flex items-center space-x-2 text-gray-500">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>加载分类中...</span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(categories) && categories.length > 0 ? (
                    categories.map((cat: Category) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id.toString())}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          selectedCategory === cat.id.toString()
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">暂无分类</p>
                  )}
                </div>
              )}
            </div>

            {/* 标签筛选 */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">按标签筛选</h4>
              {isTagsLoading ? (
                <div className="flex items-center space-x-2 text-gray-500">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>加载标签中...</span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(tagsData) && tagsData.length > 0 ? (
                    tagsData.map((tag: Tag) => (
                      <button
                        key={tag.id}
                        onClick={() => handleTagToggle(tag.id.toString())}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          selectedTags.includes(tag.id.toString())
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">暂无标签</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 搜索结果 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {isSearchLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">搜索中...</span>
            </div>
          ) : searchResults?.data && searchResults.data.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  找到 <span className="font-semibold text-blue-600">{searchResults.total}</span> 篇文章
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {searchResults.data.map((post: Post) => (
                  <motion.article 
                    key={post.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                  >
                    <div className="p-6">
                      {/* 文章标题 */}
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                        <Link to={`/posts/${post.slug}`} className="hover:text-blue-600 transition-colors">
                          {post.title}
                        </Link>
                      </h3>

                      {/* 文章摘要 */}
                      {post.excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                      )}

                      {/* 文章元信息 */}
                      <div className="space-y-3">
                        {/* 作者和日期 */}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>{post.author?.username || '未知作者'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                        </div>

                        {/* 浏览量 */}
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Eye className="w-4 h-4" />
                          <span>{post.viewCount || 0} 次浏览</span>
                        </div>

                        {/* 分类和标签 */}
                        <div className="flex flex-wrap gap-2">
                          {post.categories?.map((category) => (
                            <span key={category.id} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {category.name}
                            </span>
                          ))}
                          {post.tags?.map((tag) => (
                            <span key={tag.id} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* 分页 */}
              {searchResults.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center space-x-2">
                    {Array.from({ length: searchResults.totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => {
                          const params = new URLSearchParams(searchParams);
                          params.set('page', pageNum.toString());
                          setSearchParams(params);
                        }}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          pageNum === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </nav>
                </div>
              )}
            </>
          ) : (query || category || tags) ? (
            <div className="text-center py-12">
              <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">未找到相关文章</h3>
              <p className="text-gray-600 mb-6">尝试调整搜索关键词或筛选条件</p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                清除筛选条件
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">开始搜索</h3>
              <p className="text-gray-600">输入关键词或使用筛选条件来查找文章</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Search; 