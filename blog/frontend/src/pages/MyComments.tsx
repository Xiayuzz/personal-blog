import { useEffect, useState } from 'react';
import apiClient from '@/lib/api';
import { Comment } from '@/types';
import { useAuthStore } from '@/stores/authStore';
import { useToasts } from '@/components/ToastManager';
import { Link } from 'react-router-dom';

const MyComments = () => {
  const { isAuthenticated } = useAuthStore();
  const { showError } = useToasts();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchComments();
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getUserComments();
      setComments(res.data);
    } catch (e: any) {
      showError('获取评论列表失败', e?.message || '请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center text-blue-600">
        <div className="text-4xl mb-4">💬</div>
        <div className="text-xl font-bold mb-2">请先登录后查看你的评论列表</div>
        <Link to="/login" className="text-blue-500 underline">去登录</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-blue-700 mb-8 flex items-center">
        <span className="mr-2">💬</span> 我的评论列表
        <span className="ml-2 text-base text-blue-500">({comments.length})</span>
      </h1>
      {loading ? (
        <div className="text-blue-400 text-center py-8">加载中...</div>
      ) : comments.length === 0 ? (
        <div className="text-gray-400 text-center py-8">你还没有发表任何评论~</div>
      ) : (
        <ul className="space-y-6">
          {comments.map(comment => (
            <li key={comment.id} className="bg-white rounded-xl shadow p-5 border-l-4 border-blue-200 hover:shadow-lg transition">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                <div className="flex-1">
                  <div className="text-gray-800 mb-1">{comment.content}</div>
                  <div className="text-xs text-gray-400 mb-1">{new Date(comment.createdAt).toLocaleString()}</div>
                  <Link to={`/posts/${comment.post?.slug || comment.post?.id}`} className="text-blue-600 hover:underline text-sm">
                    查看原文：{comment.post?.title || '文章已删除'}
                  </Link>
                </div>
                <div className="flex flex-col items-end min-w-[100px]">
                  <span className="text-xs text-gray-400">状态：{comment.status === 'approved' ? '已通过' : comment.status === 'pending' ? '待审核' : '已拒绝'}</span>
                  {comment.isEdited && <span className="text-xs text-blue-400 mt-1">(已编辑)</span>}
                  <span className="text-xs text-gray-400 mt-1">ID: {comment.id}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyComments; 