import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, User, LogOut, Settings, Home, FileText } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false); // 关闭移动端菜单
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false); // 关闭移动端菜单
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900">个人博客</span>
          </Link>

          {/* 桌面端导航 */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>首页</span>
            </Link>
            
            <Link
              to="/search"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                isActive('/search') 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>搜索</span>
            </Link>
          </nav>

          {/* 搜索框 - 桌面端 */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索文章..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </form>
          </div>

          {/* 用户菜单 */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 p-1 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover" />
                    ) : (
                      <span className="text-white font-medium text-xs sm:text-sm">
                        {user?.username?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user?.username}
                  </span>
                </button>

                {/* 下拉菜单 */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>个人资料</span>
                    </Link>
                    
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>管理后台</span>
                      </Link>
                    )}
                    
                    <Link
                      to="/my-likes"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-blue-500">👍</span>
                      <span>我的点赞</span>
                    </Link>
                    <Link
                      to="/my-comments"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-blue-500">💬</span>
                      <span>我的评论</span>
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>退出登录</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Link
                  to="/login"
                  className="btn-outline text-xs sm:text-sm py-1 sm:py-2 px-2 sm:px-4"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-xs sm:text-sm py-1 sm:py-2 px-2 sm:px-4"
                >
                  注册
                </Link>
              </div>
            )}

            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 bg-white">
            <nav className="space-y-2 mb-4">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/') 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-4 h-4" />
                <span>首页</span>
              </Link>
              
              <Link
                to="/search"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/search') 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Search className="w-4 h-4" />
                <span>搜索</span>
              </Link>
            </nav>

            {/* 移动端搜索框 */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索文章..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm text-sm"
                />
              </div>
            </form>

            {/* 移动端用户菜单 */}
            {isAuthenticated && (
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <span className="text-white font-medium text-sm">
                        {user?.username?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user?.username}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>个人资料</span>
                  </Link>
                  
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>管理后台</span>
                    </Link>
                  )}
                  
                  <Link
                    to="/my-likes"
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-blue-500">👍</span>
                    <span>我的点赞</span>
                  </Link>
                  
                  <Link
                    to="/my-comments"
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-blue-500">💬</span>
                    <span>我的评论</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors w-full text-left rounded-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>退出登录</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 