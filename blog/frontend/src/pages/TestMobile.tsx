import { useAuthStore } from '@/stores/authStore';
import { Link } from 'react-router-dom';
import { User, Eye, ThumbsUp, MessageCircle, FileText, Home } from 'lucide-react';

const TestMobile = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
        {/* 头部 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            移动端测试页面
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            测试移动端显示效果和权限控制
          </p>
        </div>

        {/* 权限状态 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" />
            当前状态
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base text-gray-600">登录状态:</span>
              <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                isAuthenticated 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {isAuthenticated ? '已登录' : '未登录'}
              </span>
            </div>
            {isAuthenticated && user && (
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base text-gray-600">用户名:</span>
                <span className="text-sm sm:text-base font-medium text-gray-900">
                  {user.username}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base text-gray-600">权限:</span>
              <span className="text-sm sm:text-base font-medium text-gray-900">
                {isAuthenticated ? '可以点赞和评论' : '只能查看文章'}
              </span>
            </div>
          </div>
        </div>

        {/* 功能测试 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {/* 查看文章 */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <div className="flex items-center mb-3">
              <Eye className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">查看文章</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              所有用户都可以查看文章内容
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-green-600">✅ 可用</span>
              <Link 
                to="/"
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-700"
              >
                测试 →
              </Link>
            </div>
          </div>

          {/* 点赞功能 */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <div className="flex items-center mb-3">
              <ThumbsUp className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-purple-600" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">点赞功能</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              只有登录用户才能点赞
            </p>
            <div className="flex items-center justify-between">
              <span className={`text-xs sm:text-sm ${
                isAuthenticated ? 'text-green-600' : 'text-red-600'
              }`}>
                {isAuthenticated ? '✅ 可用' : '❌ 需要登录'}
              </span>
              <Link 
                to="/"
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-700"
              >
                测试 →
              </Link>
            </div>
          </div>

          {/* 评论功能 */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <div className="flex items-center mb-3">
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-green-600" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">评论功能</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              只有登录用户才能评论
            </p>
            <div className="flex items-center justify-between">
              <span className={`text-xs sm:text-sm ${
                isAuthenticated ? 'text-green-600' : 'text-red-600'
              }`}>
                {isAuthenticated ? '✅ 可用' : '❌ 需要登录'}
              </span>
              <Link 
                to="/"
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-700"
              >
                测试 →
              </Link>
            </div>
          </div>
        </div>

        {/* 移动端显示测试 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" />
            移动端显示测试
          </h2>
          
          <div className="space-y-4">
            {/* 响应式文本 */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                响应式文本大小
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                这段文字在小屏幕上会显示为14px，在大屏幕上会显示为16px
              </p>
            </div>

            {/* 响应式按钮 */}
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                响应式按钮
              </h3>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button className="btn-primary text-xs sm:text-sm py-2 px-3 sm:py-2 sm:px-4">
                  小按钮
                </button>
                <button className="btn-outline text-xs sm:text-sm py-2 px-3 sm:py-2 sm:px-4">
                  中按钮
                </button>
                <button className="btn-secondary text-xs sm:text-sm py-2 px-3 sm:py-2 sm:px-4">
                  大按钮
                </button>
              </div>
            </div>

            {/* 响应式间距 */}
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                响应式间距
              </h3>
              <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                <div className="bg-gray-100 p-2 sm:p-3 lg:p-4 rounded">
                  <p className="text-xs sm:text-sm text-gray-600">
                    这个div的间距会根据屏幕大小调整
                  </p>
                </div>
                <div className="bg-gray-100 p-2 sm:p-3 lg:p-4 rounded">
                  <p className="text-xs sm:text-sm text-gray-600">
                    移动端: 8px, 平板: 12px, 桌面: 16px
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 返回按钮 */}
        <div className="text-center">
          <Link 
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestMobile; 