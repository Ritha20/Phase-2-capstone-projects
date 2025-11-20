// src/app/posts/[slug]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import FollowButton from '@/components/FollowButton';
import PostLikeButton from '@/components/posts/PostLikeButton';

async function getPost(slug: string) {
  try {
    console.log('🔍 Fetching post from API:', slug);
    const response = await fetch(`/api/posts/${slug}`, {
      cache: 'no-store',
    });
    
    console.log('📡 API response status:', response.status);
    
    if (!response.ok) {
      console.log('❌ API response not OK:', response.status);
      return null;
    }
    
    const data = await response.json();
    console.log('✅ API response data:', data);
    return data.post;
  } catch (error) {
    console.error('💥 Error fetching post:', error);
    return null;
  }
}

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [slug, setSlug] = useState<string>('');
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Properly unwrap the params Promise
    const unwrapParams = async () => {
      const resolvedParams = await params;
      console.log('📝 Resolved params:', resolvedParams);
      setSlug(resolvedParams.slug);
    };
    
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    const loadPost = async () => {
      console.log('🚀 Loading post with slug:', slug);
      const postData = await getPost(slug);
      console.log('📦 Post data received:', postData);
      
      if (!postData) {
        console.log('❌ No post data, but continuing for debugging');
        // Set some dummy data so we can see the page
        setPost({ 
          title: 'DEBUG POST - Post not found', 
          content: 'This post could not be loaded', 
          author: { id: 'debug', name: 'Debug Author' },
          slug: slug,
          createdAt: new Date().toISOString()
        });
        setIsLoading(false);
        return;
      }
      
      console.log('🎉 Post loaded successfully:', postData.title);
      setPost(postData);
      setIsLoading(false);
    };

    loadPost();
  }, [slug, router]);

  useEffect(() => {
    console.log('=== DEBUG POST PAGE ===');
    console.log('Current user:', user);
    console.log('Post data:', post);
    if (post) {
      console.log('Post author ID:', post.author?.id);
      console.log('User ID:', user?.id);
      console.log('Can edit?', user && user.id === post.author?.id);
    }
    console.log('=== END DEBUG ===');
  }, [user, post]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Post not found</div>
      </div>
    );
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

        {/* Edit Post Button - Only shows for post author */}
        {user && user.id === post.author.id && (
          <div className="mb-6 flex space-x-4">
            <Link
              href={`/posts/${post.slug}/edit`}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Edit Post
            </Link>
          </div>
        )}

        {/* LIKE BUTTON - Shows for all logged-in users */}
        <div className="mb-6">
          <PostLikeButton slug={post.slug} />
        </div>

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
            
            <div className="flex items-center space-x-4">
              {/* FOLLOW BUTTON ADDED HERE */}
              <FollowButton 
                userId={post.author.id} 
                userName={post.author.name || 'this author'} 
              />
              
              <Link
                href="/"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                ← Back to all posts
              </Link>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}