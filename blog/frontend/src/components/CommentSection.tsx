import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Comment, CommentFormData } from '@/types';
import { useAuthStore } from '@/stores/authStore';
import { useToasts } from './ToastManager';

interface CommentSectionProps {
  postId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { user, isAuthenticated } = useAuthStore();
  const { showSuccess, showError } = useToasts();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(0);

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [postId, refreshFlag]);

  const fetchComments = async () => {
    try {
      const comments = await apiClient.getComments(postId);
      setComments(Array.isArray(comments) ? comments : []);
    } catch (e) {
      setComments([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showError('请先登录', '登录后才能评论');
      return;
    }
    if (!content.trim()) {
      showError('评论内容不能为空');
      return;
    }
    setLoading(true);
    try {
      const data: CommentFormData = { content };
      if (replyTo) data.parentId = replyTo.id;
      await apiClient.createComment(postId, data);
      setContent('');
      setReplyTo(null);
      setRefreshFlag(f => f + 1);
      showSuccess('评论发布成功');
    } catch (e: any) {
      showError('评论失败', e?.message || '请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (comment: Comment) => {
    setReplyTo(comment);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
  };

  // 递归渲染评论
  const renderComments = (comments: Comment[], parentId?: number | null, level = 0) => {
    return comments
      .filter(c => c.parentId === parentId)
      .map(comment => (
        <div key={comment.id} className={`mb-4 ml-${level * 6}`}>
          <div className="flex items-start gap-3">
            <img src={comment.user.avatar ? comment.user.avatar : '/default-avatar.png'} alt="avatar" className="w-8 h-8 rounded-full border border-blue-200" />
            <div className="flex-1 bg-blue-50 rounded-xl px-4 py-2 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-blue-700">{comment.user.username}</span>
                <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</span>
                {comment.isEdited && <span className="text-xs text-blue-400 ml-2">(已编辑)</span>}
              </div>
              <div className="text-gray-800 leading-relaxed">{comment.content}</div>
              <div className="mt-2 flex gap-2">
                {isAuthenticated && (
                  <button
                    className="text-xs text-blue-500 hover:underline"
                    onClick={() => handleReply(comment)}
                  >
                    回复
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* 渲染子评论 */}
          {renderComments(comments, comment.id, level + 1)}
        </div>
      ));
  };

  return (
    <section className="mt-10 bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center">
        <span className="mr-2">💬</span> 评论区
        <span className="ml-2 text-base text-blue-500">({Array.isArray(comments) ? comments.length : 0})</span>
      </h2>
      <form onSubmit={handleSubmit} className="mb-8">
        {replyTo && (
          <div className="mb-2 text-sm text-blue-600">
            回复 <span className="font-bold">{replyTo.user.username}</span>
            <button type="button" className="ml-2 text-xs text-gray-400 hover:underline" onClick={handleCancelReply}>取消回复</button>
          </div>
        )}
        <textarea
          className="w-full min-h-[80px] rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 p-3 text-gray-800 resize-none transition"
          placeholder={isAuthenticated ? '畅所欲言，文明发言~' : '请先登录后评论'}
          value={content}
          onChange={e => setContent(e.target.value)}
          disabled={loading}
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow hover:scale-105 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? '发布中...' : replyTo ? '回复' : '发表评论'}
          </button>
        </div>
      </form>
      <div>
        {Array.isArray(comments) && comments.length === 0 ? (
          <div className="text-gray-400 text-center py-8">还没有评论，快来抢沙发吧~</div>
        ) : (
          renderComments(comments, null)
        )}
      </div>
    </section>
  );
};

export default CommentSection; 