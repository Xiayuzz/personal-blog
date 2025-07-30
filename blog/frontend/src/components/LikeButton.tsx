import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, HeartOff } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/hooks/useToast'
import apiClient from '@/lib/api'

interface LikeButtonProps {
  postId: number
  initialLiked?: boolean
  initialLikeCount?: number
  onLikeChange?: (liked: boolean, count: number) => void
}

const LikeButton = ({ postId, initialLiked = false, initialLikeCount = 0, onLikeChange }: LikeButtonProps) => {
  const [liked, setLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const { showSuccess, showError } = useToast()

  useEffect(() => {
    setLiked(initialLiked)
    setLikeCount(initialLikeCount)
  }, [initialLiked, initialLikeCount])

  const handleLike = async () => {
    if (!isAuthenticated) {
      showError('请先登录', '登录后才能点赞')
      return
    }

    setIsLoading(true)
    try {
      if (liked) {
        await apiClient.unlikePost(postId)
        setLiked(false)
        setLikeCount(prev => Math.max(0, prev - 1))
        onLikeChange?.(false, likeCount - 1)
        showSuccess('取消点赞成功')
      } else {
        await apiClient.likePost(postId)
        setLiked(true)
        setLikeCount(prev => prev + 1)
        onLikeChange?.(true, likeCount + 1)
        showSuccess('点赞成功')
      }
    } catch (error) {
      console.error('点赞操作失败:', error)
      showError('操作失败', '请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.button
      onClick={handleLike}
      disabled={isLoading}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        liked
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {liked ? (
        <Heart className="w-5 h-5 fill-current" />
      ) : (
        <HeartOff className="w-5 h-5" />
      )}
      <span className="font-medium">
        {liked ? '已点赞' : '点赞'} ({likeCount})
      </span>
    </motion.button>
  )
}

export default LikeButton 