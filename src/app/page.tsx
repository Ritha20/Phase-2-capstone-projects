// src/app/page.tsx
import Link from 'next/link';

async function getPosts() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts?published=true`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return data.posts || [];
  } catch (error) {    
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          Welcome to <span className="text-green-800">Ikaze</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Discover and share stories about the vibrant culture, food, travel, and daily life in Rwanda.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Link
              href="/signup"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Stories</h2>
        
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No posts yet. Be the first to share your story!</p>
            <Link
              href="/editor"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Write Your First Post
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                {post.image && (
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>{post.author.name || 'Anonymous'}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <Link href={`/posts/${post.slug}`} className="hover:text-green-700">
                      {post.title}
                    </Link>
                  </h3>
                  
                  {post.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      Read more →
                    </Link>
                    
                    {post.tags && (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.split(',').slice(0, 2).map((tag: string) => (
                          <span
                            key={tag}
                            className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}