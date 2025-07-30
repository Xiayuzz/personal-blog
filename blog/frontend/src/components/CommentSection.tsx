import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Send, Trash2, Edit, Reply } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/hooks/useToast'
import apiClient from '@/lib/api'

interface Comment {
  id: number
  content: string
  createdAt: string
  updatedAt: string
  user: {
    id: number
    username: string
    avatar?: string
  }
  replies?: Comment[]
}

interface CommentSectionProps {
  postId: number
}

const CommentSection = ({ postId }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [editingComment, setEditingComment] = useState<number | null>(null)
  const [editContent, setEditContent] = useState('')
  const { user, isAuthenticated } = useAuthStore()
  const { showSuccess, showError } = useToast()

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      const response = await apiClient.getComments(postId)
      setComments(response || [])
    } catch (error) {
      console.error('获取评论失败:', error)
      showError('获取评论失败', '请稍后重试')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      await apiClient.createComment(postId, { content: newComment })
      setNewComment('')
      fetchComments()
      showSuccess('评论发布成功')
    } catch (error) {
      console.error('发布评论失败:', error)
      showError('发布评论失败', '请稍后重试')
    }
  }

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim() || !replyTo) return

    try {
      await apiClient.createComment(postId, { content: replyContent, parentId: replyTo })
      setReplyContent('')
      setReplyTo(null)
      fetchComments()
      showSuccess('回复发布成功')
    } catch (error) {
      console.error('发布回复失败:', error)
      showError('发布回复失败', '请稍后重试')
    }
  }

  const handleEdit = async (commentId: number) => {
    if (!editContent.trim()) return

    try {
      await apiClient.updateComment(commentId, { content: editContent })
      setEditingComment(null)
      setEditContent('')
      fetchComments()
      showSuccess('评论更新成功')
    } catch (error) {
      console.error('更新评论失败:', error)
      showError('更新评论失败', '请稍后重试')
    }
  }

  const handleDelete = async (commentId: number) => {
    try {
      await apiClient.deleteComment(commentId)
      fetchComments()
      showSuccess('评论删除成功')
    } catch (error) {
      console.error('删除评论失败:', error)
      showError('删除评论失败', '请稍后重试')
    }
  }

  const canEditComment = (comment: Comment) => {
    return isAuthenticated && user && comment.user.id === user.id
  }

  const canDeleteComment = (comment: Comment) => {
    return isAuthenticated && user && (comment.user.id === user.id || user.role === 'admin')
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

  const renderComment = (comment: Comment, isReply = false) => (
    <motion.div
      key={comment.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-sm border p-4 ${isReply ? 'ml-8' : ''}`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <img
            src={comment.user.avatar || '/default-avatar.png'}
            alt={comment.user.username}
            className="w-8 h-8 rounded-full"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">
                {comment.user.username}
              </span>
              <span className="text-xs text-gray-500">
                {formatDate(comment.createdAt)}
              </span>
            </div>
            {canEditComment(comment) && (
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => {
                    setEditingComment(comment.id)
                    setEditContent(comment.content)
                  }}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                {canDeleteComment(comment) && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
          
          {editingComment === comment.id ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
              <div className="flex items-center space-x-2 mt-2">
                <button
                  onClick={() => handleEdit(comment.id)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  保存
                </button>
                <button
                  onClick={() => {
                    setEditingComment(null)
                    setEditContent('')
                  }}
                  className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-400 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-gray-700">{comment.content}</p>
          )}

          {!isReply && isAuthenticated && (
            <button
              onClick={() => setReplyTo(comment.id)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700 transition-colors flex items-center space-x-1"
            >
              <Reply className="w-3 h-3" />
              <span>回复</span>
            </button>
          )}

          {replyTo === comment.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3"
            >
              <form onSubmit={handleReply} className="space-y-2">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="写下你的回复..."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                />
                <div className="flex items-center space-x-2">
                  <button
                    type="submit"
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    回复
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReplyTo(null)
                      setReplyContent('')
                    }}
                    className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    取消
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map((reply) => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <MessageCircle className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          评论 ({comments.length})
        </h3>
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="写下你的评论..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
          />
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>发表评论</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-600">请登录后发表评论</p>
        </div>
      )}

      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => renderComment(comment))
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">还没有评论，快来发表第一条评论吧！</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CommentSection 