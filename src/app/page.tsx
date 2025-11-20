// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// import {post,User} from "@types"
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
  _count?: {
    likes: number;
    comments: number;
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
          
          
          const tags = data.posts.flatMap((post: Post) => {
            if (!post.tags) return [];
            return post.tags.split(',').map((tag: string) => tag.trim()).filter(tag => tag.length > 0);
          });
          
          const uniqueTags = Array.from(new Set(tags));
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
      const filtered = posts.filter(post => {
        if (!post.tags) return false;
        const postTags = post.tags.split(',').map(tag => tag.trim());
        return postTags.includes(selectedTag);
      });
      setFilteredPosts(filtered);
    }
  }, [selectedTag, posts]);

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag.trim());
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto sm:px-4 lg:px-6 py-20">
      {/* Hero Section */}
      
<section className="mb-16">
  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-30 items-center">
      {/* Left Side - Text Content */}
      <div className="space-y-6">
        <h1 className="text-4xl font-serif tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          Welcome To <span className="text-green-800 font-mono">Ikaze</span>
        </h1>
        <p className=" text-gray-600 md:text-xl max-w-2xl font-">
          Discover and share stories about the vibrant culture, food, travel, and daily life in Rwanda. 
          Join our community of passionate storytellers and explorers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-8 transition-colors"
          >
            Start 
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-8 transition-colors"
          >
            Learn More
          </Link>
        </div>
        
        {/* Stats */}
        <div className="flex space-x-8 pt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">100+</div>
            <div className="text-sm text-gray-600">Stories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">50+</div>
            <div className="text-sm text-gray-600">Writers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">1K+</div>
            <div className="text-sm text-gray-600">Readers</div>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="relative group">
  <div className="w-full h-72 lg:h-[500px] rounded-2xl overflow-hidden shadow-xl">
    <img
      src="Rwanda.jpg"
      alt="Rwanda Culture and Lifestyle"
      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
    />
  </div>
        
      </div>
    </div>
  </div>
</section>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <section className="mb-8 px-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 ">Filter by Tags</h2>
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
                  {/* Added like count to post metadata */}
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    
                    <span className="mx-2 ml-auto"></span>
                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                      </svg>
                      {post._count?.likes || 0}
                    </span>
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
                        <button
                          key={tag}
                          onClick={() => handleTagClick(tag)}
                          className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded hover:bg-green-200 transition-colors"
                        >
                          {tag.trim()}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Read more →
                  </Link>
                  <div className="py-7 text-black">
                  <span className="">Author: </span>
                    <span>{post.author.name || 'Anonymous'}</span>
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