
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Calendar, Eye, User, ArrowRight, Plus, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api';
import { Post } from '@/types';
import { useAuthStore } from '@/stores/authStore';

const Home = () => {
  const { isAuthenticated } = useAuthStore();

  const { data: postsData, isLoading } = useQuery({
    queryKey: ['posts', { status: 'published', limit: 10 }],
    queryFn: () => apiClient.getPosts({ status: 'published', limit: 10 }),
  });

  const posts = postsData?.data || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">加载中...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 头部区域 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            欢迎来到我的博客
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            分享技术见解、生活感悟和有趣的故事
          </p>
          
          {isAuthenticated && (
            <Link
              to="/posts/new"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-lg"
            >
              <Plus className="w-5 h-5" />
              <span>写文章</span>
            </Link>
          )}
        </motion.div>

        {/* 最新文章 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-blue-600" />
              最新文章
            </h2>
            <Link
              to="/search"
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <span>查看全部</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无文章</h3>
              <p className="text-gray-600">还没有发布任何文章</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post: Post, index: number) => (
                <motion.article 
                  key={post.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 group"
                >
                  <div className="p-6">
                    {/* 文章标题 */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      <Link to={`/posts/${post.slug}`}>
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

                    {/* 阅读更多按钮 */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Link
                        to={`/posts/${post.slug}`}
                        className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors group-hover:translate-x-1"
                      >
                        <span>阅读全文</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </motion.div>

        {/* 特色区域 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-8 mb-12"
        >
          {/* 关于我 */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">关于我</h3>
            <p className="text-gray-600 mb-4">
              热爱技术，喜欢分享。在这里记录学习心得、技术探索和生活感悟。
            </p>
            <Link
              to="/profile"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <span>了解更多</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 联系方式 */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">联系我</h3>
            <p className="text-gray-600 mb-4">
              有任何问题或建议，欢迎通过以下方式联系我。
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p> Email: 17665739176@163.com</p>
              <p> GitHub: github.com/Xiayuzz</p>
            </div>
          </div>
        </motion.div>

        {/* 订阅区域 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-md p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">订阅更新</h3>
          <p className="text-gray-600 mb-6">
            订阅我的博客，获取最新文章和更新通知
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="email"
                placeholder="输入您的邮箱地址"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-r-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                订阅
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home; 
