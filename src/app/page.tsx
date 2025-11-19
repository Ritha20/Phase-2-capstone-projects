// src/app/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  tags: string;
  image: string;
  published: boolean;
  createdAt: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts?published=true');
        const data = await response.json();
        
        if (data.posts) {
          setPosts(data.posts);
          setFilteredPosts(data.posts);
          
          // Extract all unique tags
          const tags = data.posts.flatMap((post: Post) => 
            post.tags ? post.tags.split(',').map((tag: string) => tag.trim()) : []
          );
          const uniqueTags = Array.from(new Set(tags)).filter(tag => tag.length > 0);
          setAllTags(uniqueTags as string[]);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (selectedTag === 'all') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => 
        post.tags && post.tags.split(',').map(tag => tag.trim()).includes(selectedTag)
      );
      setFilteredPosts(filtered);
    }
  }, [selectedTag, posts]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">Loading posts...</div>
      </div>
    );
  }

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

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter by Tags</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedTag === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Posts
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedTag === tag
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Posts Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedTag === 'all' ? 'Latest Stories' : `Posts tagged: ${selectedTag}`}
          </h2>
          <span className="text-gray-500">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
          </span>
        </div>
        
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {selectedTag === 'all' 
                ? "No posts yet. Be the first to share your story!" 
                : `No posts found with tag "${selectedTag}"`}
            </p>
            {selectedTag === 'all' && (
              <Link
                href="/editor"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Write Your First Post
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
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
                  
                  {post.tags && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.split(',').slice(0, 3).map((tag: string) => (
                        <span
                          key={tag}
                          className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedTag(tag.trim());
                          }}
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}