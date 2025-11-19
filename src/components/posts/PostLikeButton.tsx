// src/components/posts/PostLikeButton.tsx - UPDATED:
'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface PostLikeButtonProps {
  slug: string;
}

export default function PostLikeButton({ slug }: PostLikeButtonProps) {
  const router = useRouter();
  const { user, token } = useAuth();

  const handleLike = useCallback(async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Simple like implementation - you can connect to your API later
    console.log('Liked post:', slug);
    alert('Like functionality - connect to your API');
  }, [router, user, slug]);

  return (
    <button
      type="button"
      onClick={handleLike}
      className="flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
    >
      <svg
        className="h-5 w-5"
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
      <span>Like</span>
    </button>
  );
}