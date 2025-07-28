import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import apiClient from '@/lib/api'
import { Post } from '@/types'

const CategoryPosts = () => {
  const { slug } = useParams<{ slug: string }>()

  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => apiClient.getCategory(slug!),
    enabled: !!slug,
  })

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['category-posts', slug],
    queryFn: () => apiClient.getCategoryPosts(slug!),
    enabled: !!slug,
  })

  if (categoryLoading || postsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!categoryData) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">分类不存在</h2>
        <p className="text-gray-600">请检查分类链接是否正确</p>
      </div>
    )
  }

  const posts = postsData?.data || []

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          分类: {categoryData.name}
        </h1>
        {categoryData.description && (
          <p className="text-gray-600">{categoryData.description}</p>
        )}
        <div className="mt-4 text-sm text-gray-500">
          共 {postsData?.total || 0} 篇文章
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">该分类下暂无文章</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post: Post) => (
            <article key={post.id} className="card">
              <div className="card-content">
                <h3 className="card-title text-lg mb-2">
                  <Link 
                    to={`/posts/${post.slug}`}
                    className="hover:text-primary-600 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h3>
                {post.excerpt && (
                  <p className="card-description mb-4">{post.excerpt}</p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>{post.author.username}</span>
                    <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                    <span>👁️ {post.viewCount}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoryPosts 