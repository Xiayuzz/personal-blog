import { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import apiClient from '@/lib/api';
import { LikeStatus } from '@/types';
import { useAuthStore } from '@/stores/authStore';
import { useToasts } from './ToastManager';

interface LikeButtonProps {
  postId: number;
  initialLikeStatus?: LikeStatus;
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId, initialLikeStatus }) => {
  const { isAuthenticated } = useAuthStore();
  const { showSuccess, showError } = useToasts();
  const [likeStatus, setLikeStatus] = useState<LikeStatus>({ liked: false, likeCount: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialLikeStatus) {
      setLikeStatus(initialLikeStatus);
    } else {
      fetchLikeStatus();
    }
    // eslint-disable-next-line
  }, [postId]);

  const fetchLikeStatus = async () => {
    try {
      const status = await apiClient.getLikeStatus(postId);
      setLikeStatus(status);
    } catch (e) {
      // 忽略未登录等错误
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      showError('请先登录', '登录后才能点赞');
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.toggleLike(postId);
      setLikeStatus((prev) => ({
        liked: res.liked,
        likeCount: prev.likeCount + (res.liked ? 1 : -1)
      }));
      showSuccess(res.liked ? '点赞成功' : '已取消点赞');
    } catch (e: any) {
      showError('操作失败', e?.message || '请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`flex items-center px-4 py-2 rounded-full font-medium shadow transition-all duration-200 focus:outline-none
        ${likeStatus.liked ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'}
        ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'}
      `}
      onClick={handleLike}
      disabled={loading}
      aria-pressed={likeStatus.liked}
      title={likeStatus.liked ? '取消点赞' : '点赞'}
    >
      <ThumbsUp className={`w-5 h-5 mr-2 ${likeStatus.liked ? 'text-white' : 'text-blue-500'}`} />
      <span>{likeStatus.liked ? '已点赞' : '点赞'}</span>
      <span className="ml-2 font-bold">{likeStatus.likeCount}</span>
    </button>
  );
};

export default LikeButton; 