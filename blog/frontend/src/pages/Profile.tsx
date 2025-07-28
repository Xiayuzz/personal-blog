import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { apiClient } from '../lib/api';
import { Edit3, Save, X, Camera } from 'lucide-react';
import { useToasts } from '../components/ToastManager';
import Avatar from '../components/Avatar';
import AvatarUploadModal from '@/components/AvatarUploadModal';

const Profile = () => {
  const { user, updateProfile, isLoading } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const { showSuccess, showError } = useToasts()
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
  })
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [stats, setStats] = useState<{ postCount: number; likeCount: number; commentCount: number } | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setStatsLoading(true);
      apiClient.getUserStats(user.id)
        .then(setStats)
        .catch(() => setStats(null))
        .finally(() => setStatsLoading(false));
    }
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile(formData)
      setIsEditing(false)
      showSuccess('保存成功', '个人资料已更新')
    } catch (error: any) {
      showError('保存失败', error.response?.data?.message || '更新个人资料失败')
    }
  }



  const handleEditClick = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      bio: user?.bio || '',
    })
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">请先登录</p>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* 头部背景 */}
          <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
            
            {/* 头像区域 */}
            <div className="absolute -bottom-16 left-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
                  <Avatar 
                    src={user.avatar}
                    alt="头像"
                    username={user.username}
                    className="w-full h-full"
                  />
                </div>
                
                {/* 上传按钮 */}
                <button
                  onClick={() => setAvatarModalOpen(true)}
                  disabled={isUploading}
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                  title="上传头像"
                >
                  {isUploading ? (
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Camera className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                
                <AvatarUploadModal
                  open={avatarModalOpen}
                  onClose={() => setAvatarModalOpen(false)}
                  onUpload={async (file) => {
                    setIsUploading(true);
                    try {
                      const response = await apiClient.uploadImage(file);
                      await updateProfile({ avatar: response.url });
                      showSuccess('上传成功', '头像已更新');
                    } catch (error: any) {
                      showError('上传失败', error.response?.data?.message || '头像上传失败');
                    } finally {
                      setIsUploading(false);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="pt-20 px-8 pb-8">
            {/* 用户基本信息 */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.username}</h1>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'admin' ? '管理员' : '普通用户'}
                  </span>
                  <span className="ml-3 text-sm text-gray-500">
                    注册于 {(() => {
                      if (!user.createdAt) return '未知时间';
                      try {
                        const date = new Date(user.createdAt);
                        if (isNaN(date.getTime())) return '未知时间';
                        return date.toLocaleDateString('zh-CN');
                      } catch (error) {
                        console.error('日期解析错误:', error);
                        return '未知时间';
                      }
                    })()}
                  </span>
                </div>
              </div>
              
              {/* 编辑按钮 */}
              {!isEditing && (
                <button
                  onClick={handleEditClick}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>编辑资料</span>
                </button>
              )}
            </div>

            {/* 个人简介 */}
            {user.bio && !isEditing && (
              <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">个人简介</h3>
                <p className="text-gray-700 leading-relaxed">{user.bio}</p>
              </div>
            )}

            {/* 编辑表单 */}
            {isEditing && (
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">编辑个人资料</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                        用户名
                      </label>
                      <input
                        type="text"
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        邮箱
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                      个人简介
                    </label>
                    <textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      rows={4}
                      placeholder="介绍一下自己..."
                    />
                  </div>
                  
                  <div className="flex space-x-4">
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isLoading ? '保存中...' : '保存'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex items-center space-x-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <X className="w-4 h-4" />
                      <span>取消</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 统计信息 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                <div className="text-2xl font-bold">{statsLoading ? '...' : stats?.postCount ?? '暂无数据'}</div>
                <div className="text-blue-100">发布文章</div>
              </div>
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6 rounded-xl">
                <div className="text-2xl font-bold">{statsLoading ? '...' : stats?.likeCount ?? '暂无数据'}</div>
                <div className="text-indigo-100">获得点赞</div>
              </div>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-xl">
                <div className="text-2xl font-bold">{statsLoading ? '...' : stats?.commentCount ?? '暂无数据'}</div>
                <div className="text-blue-100">收到评论</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast通知 */}
      {/* ToastManager toasts={toasts} onClose={removeToast} /> */}
    </>
  )
}

export default Profile 