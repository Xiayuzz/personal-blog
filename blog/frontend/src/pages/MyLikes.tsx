import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, ExternalLink } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/hooks/useToast'
import apiClient from '@/lib/api'
import { Like } from '@/types'

const MyLikes = () => {
  const [likes, setLikes] = useState<Like[]>([])
  const [loading, setLoading] = useState(true)
  const { } = useAuthStore()
  const { showError } = useToast()

  useEffect(() => {
    fetchLikes()
  }, [])

  const fetchLikes = async () => {
    try {
      const response = await apiClient.getUserLikes()
      setLikes(response.data || [])
    } catch (error) {
      console.error('获取点赞失败:', error)
      showError('获取点赞失败', '请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">我的点赞</h1>
        <p className="text-gray-600">查看您点赞过的所有文章</p>
      </div>

      {likes.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">还没有点赞</h3>
          <p className="text-gray-500">您还没有点赞过任何文章</p>
        </div>
      ) : (
        <div className="space-y-4">
          {likes.map((like) => (
            <motion.div
              key={like.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {like.post?.title || '未知文章'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(like.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <a
                      href={`/posts/${like.post?.slug || '#'}`}
                      className="text-sm text-blue-600 hover:text-blue-700 transition-colors flex items-center space-x-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>查看文章</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyLikes 