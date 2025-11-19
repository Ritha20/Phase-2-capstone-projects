// src/components/posts/PostLikeButton.tsx 
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface PostLikeButtonProps {
  slug: string;
}

export default function PostLikeButton({ slug }: PostLikeButtonProps) {
  const router = useRouter();
  const { user, token } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Load like data when component mounts
  useEffect(() => {
    const loadLikeData = async () => {
      try {
        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`/api/posts/${slug}/like`, {
          headers
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsLiked(data.userLiked);
          setLikeCount(data.likeCount);
        }
      } catch (error) {
        console.error('Error loading like data:', error);
      }
    };

    loadLikeData();
  }, [slug, token]);

  const handleLike = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/posts/${slug}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.liked);
        setLikeCount(data.likeCount);
      } else {
        alert('Failed to like post');
      }
    } catch (error) {
      console.error('Like error:', error);
      alert('Error liking post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={isLoading || !user}
      className={`flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition ${
        isLiked
          ? 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100'
          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
      } ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
      aria-pressed={isLiked}
    >
      <svg
        className={`h-5 w-5 ${isLiked ? 'fill-rose-600' : ''}`}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
    </button>
  );
}