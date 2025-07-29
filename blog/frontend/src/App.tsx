import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import Layout from '@/components/Layout'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import PostDetail from '@/pages/PostDetail'
import PostEditor from '@/pages/PostEditor'
import Profile from '@/pages/Profile'
import Search from '@/pages/Search'
import CategoryPosts from '@/pages/CategoryPosts'
import TagPosts from '@/pages/TagPosts'
import TestAvatar from '@/pages/TestAvatar'
import TestMobile from '@/pages/TestMobile'
import AdminDashboard from '@/pages/admin/Dashboard'
import AdminUsers from '@/pages/admin/Users'
import AdminPosts from '@/pages/admin/Posts'
import AdminSettings from '@/pages/admin/Settings'
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminRoute from '@/components/AdminRoute'
import MyLikes from '@/pages/MyLikes';
import MyComments from '@/pages/MyComments';

function App() {
  const { isAuthenticated, getProfile } = useAuthStore()

  useEffect(() => {
    // 如果用户已认证，获取用户资料
    if (isAuthenticated) {
      getProfile()
    }
  }, [isAuthenticated, getProfile])

  return (
    <Routes>
      {/* 公开路由 */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="posts/:slug" element={<PostDetail />} />
        <Route path="search" element={<Search />} />
        <Route path="categories/:slug" element={<CategoryPosts />} />
        <Route path="tags/:slug" element={<TagPosts />} />
        <Route path="test-avatar" element={<TestAvatar />} />
        <Route path="test-mobile" element={<TestMobile />} />
      </Route>

      {/* 需要认证的路由 */}
      <Route path="/" element={<Layout />}>
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="posts/new"
          element={
            <ProtectedRoute>
              <PostEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="posts/:id/edit"
          element={
            <ProtectedRoute>
              <PostEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-likes"
          element={
            <ProtectedRoute>
              <MyLikes />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-comments"
          element={
            <ProtectedRoute>
              <MyComments />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 管理后台路由 */}
      <Route path="/admin" element={<Layout />}>
        <Route
          path="dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
        <Route
          path="posts"
          element={
            <AdminRoute>
              <AdminPosts />
            </AdminRoute>
          }
        />
        <Route
          path="settings"
          element={
            <AdminRoute>
              <AdminSettings />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
