import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api'
import type { FormEvent } from 'react'

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: '',
    siteDescription: '',
    allowRegistration: true,
    allowComments: true,
    postsPerPage: 10,
  })

  const { data: currentSettings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => apiClient.getSystemSettings(),
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // TODO: 实现设置保存逻辑
    console.log('保存设置:', settings)
  }

  if (isLoading) return <div className="text-center py-8">加载中...</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">系统设置</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">基本设置</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">网站名称</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                className="w-full p-3 border rounded-lg"
                placeholder="输入网站名称"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">网站描述</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                className="w-full p-3 border rounded-lg"
                rows={3}
                placeholder="输入网站描述"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">功能设置</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowRegistration"
                checked={settings.allowRegistration}
                onChange={(e) => setSettings({...settings, allowRegistration: e.target.checked})}
                className="mr-3"
              />
              <label htmlFor="allowRegistration" className="text-sm font-medium">
                允许用户注册
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowComments"
                checked={settings.allowComments}
                onChange={(e) => setSettings({...settings, allowComments: e.target.checked})}
                className="mr-3"
              />
              <label htmlFor="allowComments" className="text-sm font-medium">
                允许评论
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">每页显示文章数</label>
              <input
                type="number"
                value={settings.postsPerPage}
                onChange={(e) => setSettings({...settings, postsPerPage: parseInt(e.target.value)})}
                className="w-full p-3 border rounded-lg"
                min="1"
                max="50"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            保存设置
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            重置
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminSettings 