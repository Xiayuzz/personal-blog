import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/hooks/useToast'
import apiClient from '@/lib/api'

interface Comment {
  id: number
  content: string
  createdAt: string
  updatedAt: string
  post: {
    id: number
    title: string
    slug: string
  }
}

const MyComments = () => {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const { } = useAuthStore()
  const { showSuccess, showError } = useToast()

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    try {
      const response = await apiClient.getUserComments()
      setComments(response.data || [])
    } catch (error) {
      console.error('获取评论失败:', error)
      showError('获取评论失败', '请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (commentId: number) => {
    try {
      await apiClient.deleteComment(commentId)
      setComments(prev => prev.filter(comment => comment.id !== commentId))
      showSuccess('评论删除成功')
    } catch (error) {
      console.error('删除评论失败:', error)
      showError('删除评论失败', '请稍后重试')
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">我的评论</h1>
        <p className="text-gray-600">查看和管理您发表的所有评论</p>
      </div>

      {comments.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">还没有评论</h3>
          <p className="text-gray-500">您还没有发表过任何评论</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      评论于文章：{comment.post.title}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{comment.content}</p>
                  <div className="flex items-center space-x-4">
                    <a
                      href={`/posts/${comment.post.slug}`}
                      className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      查看文章
                    </a>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-sm text-red-600 hover:text-red-700 transition-colors flex items-center space-x-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>删除</span>
                    </button>
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

export default MyComments 