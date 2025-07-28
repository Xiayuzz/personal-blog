const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 关于我们 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">关于我们</h3>
            <p className="text-gray-300 text-sm">
              一个现代化的个人博客系统，提供完整的文章管理、评论系统和用户认证功能。
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors">
                  首页
                </a>
              </li>
              <li>
                <a href="/search" className="text-gray-300 hover:text-white transition-colors">
                  搜索
                </a>
              </li>
              <li>
                <a href="/login" className="text-gray-300 hover:text-white transition-colors">
                  登录
                </a>
              </li>
              <li>
                <a href="/register" className="text-gray-300 hover:text-white transition-colors">
                  注册
                </a>
              </li>
            </ul>
          </div>

          {/* 技术栈 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">技术栈</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-300">React 18 + TypeScript</li>
              <li className="text-gray-300">Node.js + Express</li>
              <li className="text-gray-300">MySQL + Sequelize</li>
              <li className="text-gray-300">Tailwind CSS</li>
            </ul>
          </div>

          {/* 联系信息 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">联系信息</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-300">邮箱: admin@example.com</li>
              <li className="text-gray-300">GitHub: github.com/example</li>
              <li className="text-gray-300">版本: v1.0.0</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300 text-sm">
            © 2024 个人博客系统. 保留所有权利.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 