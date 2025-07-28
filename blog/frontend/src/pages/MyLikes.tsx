import { useEffect, useState } from 'react';
import apiClient from '@/lib/api';
import { Like, Post } from '@/types';
import { useAuthStore } from '@/stores/authStore';
import { useToasts } from '@/components/ToastManager';
import { Link } from 'react-router-dom';

const MyLikes = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { showError } = useToasts();
  const [likes, setLikes] = useState<Like[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLikes();
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);

  const fetchLikes = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getUserLikes();
      setLikes(res.data);
    } catch (e: any) {
      showError('获取点赞列表失败', e?.message || '请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center text-blue-600">
        <div className="text-4xl mb-4">👍</div>
        <div className="text-xl font-bold mb-2">请先登录后查看你的点赞列表</div>
        <Link to="/login" className="text-blue-500 underline">去登录</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-blue-700 mb-8 flex items-center">
        <span className="mr-2">👍</span> 我的点赞列表
        <span className="ml-2 text-base text-blue-500">({likes.length})</span>
      </h1>
      {loading ? (
        <div className="text-blue-400 text-center py-8">加载中...</div>
      ) : likes.length === 0 ? (
        <div className="text-gray-400 text-center py-8">你还没有点赞任何文章~</div>
      ) : (
        <ul className="space-y-6">
          {likes.map(like => (
            <li key={like.id} className="bg-white rounded-xl shadow p-5 flex items-center gap-4 border-l-4 border-blue-200 hover:shadow-lg transition">
              <div className="flex-1">
                <Link to={`/posts/${like.post?.slug || like.postId}`} className="text-lg font-bold text-blue-700 hover:underline">
                  {like.post?.title || '文章已删除'}
                </Link>
                <div className="text-sm text-gray-500 mt-1">
                  点赞时间：{new Date(like.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-400">作者：{like.post?.author?.username || '未知'}</span>
                <span className="text-xs text-gray-400 mt-1">ID: {like.postId}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyLikes; 