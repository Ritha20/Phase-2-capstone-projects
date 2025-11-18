// src/app/posts/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';

async function getPost(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${slug}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <article className="bg-white rounded-lg">
        {/* Post Header */}
        <header className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-6"
          >
            ← Back to home
          </Link>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          
          <div className="flex items-center text-gray-500 mb-4">
            <div className="flex items-center">
              {post.author.avatar && (
                <img
                  src={post.author.avatar}
                  alt={post.author.name || 'Author'}
                  className="w-8 h-8 rounded-full mr-3"
                />
              )}
              <span>{post.author.name || 'Anonymous'}</span>
            </div>
            <span className="mx-2">•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>

          {post.excerpt && (
            <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
          )}

          {post.tags && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.split(',').map((tag: string) => (
                <span
                  key={tag}
                  className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}

          {post.image && (
            <div className="mb-8">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
            </div>
          )}
        </header>

        {/* Post Content */}
        <div 
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Post Footer */}
        <footer className="border-t pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-500">
              {post.author.avatar && (
                <img
                  src={post.author.avatar}
                  alt={post.author.name || 'Author'}
                  className="w-10 h-10 rounded-full mr-3"
                />
              )}
              <div>
                <p className="font-medium text-gray-900">{post.author.name || 'Anonymous'}</p>
                <p className="text-sm">Posted on {new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <Link
              href="/"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              ← Back to all posts
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}