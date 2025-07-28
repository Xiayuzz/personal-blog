import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import apiClient from '@/lib/api'
import { Post } from '@/types'

const TagPosts = () => {
  const { slug } = useParams<{ slug: string }>()

  const { data: postsData, isLoading, error } = useQuery({
    queryKey: ['tag-posts', slug],
    queryFn: () => apiClient.getTagPosts(slug!),
    enabled: !!slug,
  })

  if (isLoading) return <div className="text-center py-8">加载中...</div>
  if (error) return <div className="text-center py-8 text-red-600">加载失败</div>

  const posts = postsData?.data || []

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">标签: {slug}</h1>
      <div className="space-y-6">
        {posts.map((post: Post) => (
          <article key={post.id} className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-2">
              <Link to={`/posts/${post.slug}`} className="hover:text-blue-600">
                {post.title}
              </Link>
            </h2>
            <p className="text-gray-600 mb-2">{post.excerpt}</p>
            <div className="text-sm text-gray-500">
              发布于 {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '未发布'}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default TagPosts 