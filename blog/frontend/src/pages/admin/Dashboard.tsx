import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api'

const AdminDashboard = () => {
  const { data: dashboardData, isLoading, isError } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => apiClient.getDashboard(),
  })

  if (isLoading) return <div className="text-center py-8 text-blue-500">加载中...</div>
  if (isError) return <div className="text-center py-8 text-red-500">数据加载失败，请检查接口或权限</div>

  const stats = dashboardData?.stats;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">管理后台</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow border-l-4 border-blue-400">
          <h3 className="text-lg font-semibold text-blue-700">总用户数</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.totalUsers ?? '暂无数据'}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow border-l-4 border-green-400">
          <h3 className="text-lg font-semibold text-green-700">总文章数</h3>
          <p className="text-3xl font-bold text-green-600">{stats?.totalPosts ?? '暂无数据'}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow border-l-4 border-purple-400">
          <h3 className="text-lg font-semibold text-purple-700">总评论数</h3>
          <p className="text-3xl font-bold text-purple-600">{stats?.totalComments ?? '暂无数据'}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg shadow border-l-4 border-orange-400">
          <h3 className="text-lg font-semibold text-orange-700">今日访问</h3>
          <p className="text-3xl font-bold text-orange-600">{stats?.totalCategories ?? '暂无数据'}</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">最近活动</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b">
            <span>新用户注册</span>
            <span className="text-gray-500">刚刚</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span>新文章发布</span>
            <span className="text-gray-500">2小时前</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span>新评论</span>
            <span className="text-gray-500">5小时前</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard 