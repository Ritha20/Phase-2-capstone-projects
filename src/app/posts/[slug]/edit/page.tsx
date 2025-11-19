// src/app/posts/[slug]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import MarkdownEditor from '@/components/editor/MarkdownEditor';

async function getPost(slug: string) {    
  const response = await fetch(`/api/posts/${slug}`);
  if (!response.ok) {
    throw new Error('Post not found');
  }            
  const data = await response.json();
  return data.post;
}

export default function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [error, setError] = useState('');

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Await the params first
    const loadParamsAndPost = async () => {
      const { slug } = await params;
      
      if (!user) {
        router.push('/login');
        return;
      }

      // Load post data
      try {
        console.log('📝 Loading post for editing:', slug);
        const post = await getPost(slug);
        
        console.log('📝 Post data loaded:', post);
        
        // Check if user is the author
        if (post.author.id !== user.id) {
          router.push('/');
          return;
        }

        // Pre-fill the form with existing data
        setTitle(post.title);
        setContent(post.content);
        setExcerpt(post.excerpt || '');
        setTags(post.tags || '');
        setImage(post.image || '');
        setIsPublished(post.published);
        
        console.log('✅ Form pre-filled with:', {
          title: post.title,
          contentLength: post.content.length,
          excerpt: post.excerpt,
          tags: post.tags
        });
        
        setIsLoadingPost(false);
      } catch (error) {
        console.error('❌ Error loading post:', error);
        setError('Post not found');
        setIsLoadingPost(false);
      }
    };

    loadParamsAndPost();
  }, [params, user, router]);

  useEffect(() => {
    console.log('📝 Edit form data:', {
      title,
      contentLength: content.length,
      excerpt,
      tags,
      image,
      isPublished
    });
  }, [title, content, excerpt, tags, image, isPublished]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      setIsLoading(false);
      return;
    }

    try {
      const { slug } = await params;
      const response = await fetch(`/api/posts/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag).join(','),
          image,
          published: isPublished,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/posts/${slug}`);
      } else {
        setError(data.error || 'Failed to update post');
      }
    } catch (error) {
      setError('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      const { slug } = await params;
      const response = await fetch(`/api/posts/${slug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (response.ok) {
        router.push('/');
      } else {
        setError('Failed to delete post');
      }
    } catch (error) {
      setError('Something went wrong');
    }
  };

  if (!user) {
    return null;
  }

  if (isLoadingPost) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center">Loading post...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Post</h1>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Delete Post
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your post title..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-medium"
            required
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
            Excerpt (Optional)
          </label>
          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief description of your post..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="rwanda, culture, travel, food..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image URL (Optional)
          </label>
          <input
            type="text"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {image && (
            <div className="mt-2">
              <img src={image} alt="Preview" className="w-32 h-32 object-cover rounded" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <MarkdownEditor
            value={content}
            onChange={setContent}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center pt-6 border-t">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="publish"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="publish" className="ml-2 block text-sm text-gray-900">
              Publish post
            </label>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !title.trim() || !content.trim()}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Update Post'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}