import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Calendar, User, Eye, Clock, Tag, FolderOpen, ArrowLeft, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import apiClient from '@/lib/api'
import { Post } from '@/types'
import LikeButton from '@/components/LikeButton';
import CommentSection from '@/components/CommentSection';

const PostDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const [readingProgress, setReadingProgress] = useState(0)

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => {
      if (!slug) {
        throw new Error('文章链接无效')
      }
      return apiClient.getPost(slug)
    },
    enabled: !!slug,
  })

  // 阅读进度条
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setReadingProgress(Math.min(progress, 100))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 如果slug不存在，直接显示错误
  if (!slug) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"
      >
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">文章链接无效</h2>
            <p className="text-gray-600 mb-6">请检查文章链接是否正确</p>
            <Link 
              to="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首页
            </Link>
          </div>
        </div>
      </motion.div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-lg font-medium text-gray-700">正在加载文章...</div>
          </div>
        </motion.div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"
      >
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📄</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">文章不存在</h2>
            <p className="text-gray-600 mb-6">
              {error ? '文章可能已被删除或链接已失效' : '请检查文章链接是否正确'}
            </p>
            <div className="space-y-3">
              <Link 
                to="/"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回首页
              </Link>
              <br />
              <Link 
                to="/posts/new"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FileText className="w-4 h-4 mr-2" />
                创建新文章
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 阅读进度条 */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
          style={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link 
            to="/"
            className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Link>
        </motion.div>

        {/* 文章主体 */}
        <motion.article 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* 文章头部 */}
          <div className="relative overflow-hidden">
            {/* 背景装饰 */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-5"></div>
            
            <div className="relative p-8 md:p-12">
              {/* 分类标签 */}
              {post.categories && post.categories.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-6"
                >
                  {post.categories.map((category, index) => (
                    <span
                      key={category.id}
                      className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full mr-2 mb-2"
                      style={{ 
                        backgroundColor: category.color + '20', 
                        color: category.color,
                        border: `1px solid ${category.color}30`
                      }}
                    >
                      <FolderOpen className="w-3 h-3 mr-1" />
                      {category.name}
                    </span>
                  ))}
                </motion.div>
              )}

              {/* 文章标题 */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
              >
                {post.title}
              </motion.h1>

              {/* 文章元信息 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8"
              >
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-medium">{post.author?.username || '未知作者'}</span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-green-600" />
                  <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                </div>
                
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2 text-purple-600" />
                  <span>{post.viewCount || 0} 次阅读</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-orange-600" />
                  <span>约 {Math.ceil((post.content?.length || 0) / 500)} 分钟阅读</span>
                </div>
              </motion.div>

              {/* 文章摘要 */}
              {post.excerpt && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-8 p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500"
                >
                  <p className="text-lg text-gray-700 leading-relaxed italic">
                    "{post.excerpt}"
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {/* 文章内容 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="px-8 md:px-12 pb-8"
          >
            <div className="prose prose-lg max-w-none">
              <div 
                className="leading-relaxed text-gray-800 prose-headings:text-gray-900 prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-strong:font-semibold prose-em:text-gray-700 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:rounded-r-lg prose-code:bg-gray-100 prose-code:text-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-img:rounded-lg prose-img:shadow-md prose-hr:border-gray-300 prose-hr:my-8"
                dangerouslySetInnerHTML={{ __html: post.content }} 
              />
            </div>
          </motion.div>

          {/* 文章底部 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="px-8 md:px-12 pb-8 pt-8 border-t border-gray-100"
          >
            {/* 标签 */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-blue-600" />
                  标签
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full border border-blue-200 hover:from-blue-200 hover:to-indigo-200 transition-all duration-200 cursor-pointer"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 文章统计 */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Eye className="w-4 h-4 mr-2 text-purple-600" />
                  <span>{post.viewCount || 0} 次阅读</span>
                </div>
                <LikeButton postId={post.id} />
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-2xl mr-1">💬</span>
                  <span>{post.commentCount || 0} 条评论</span>
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                最后更新: {formatDate(post.updatedAt)}
              </div>
            </div>
          </motion.div>
        </motion.article>

        {/* 相关文章推荐 */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">相关推荐</h3>
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-4">📚</div>
            <p>更多精彩内容正在准备中...</p>
          </div>
        </motion.div>
        <CommentSection postId={post.id} />
      </div>
    </div>
  )
}

export default PostDetail 