// src/components/author/AuthorFollowButton.tsx
'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useFollow } from '@/hooks/useFollow';

interface AuthorFollowButtonProps {
  authorId: string;
  authorName: string;
  size?: 'sm' | 'md';
}

export default function AuthorFollowButton({ 
  authorId, 
  authorName, 
  size = 'sm' 
}: AuthorFollowButtonProps) {
  const router = useRouter();
  const { user, token } = useAuth();
  const { data, isLoading, toggleFollow, isUpdating } = useFollow(authorId, token || undefined);

  const handleToggleFollow = useCallback(async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (user.id === authorId) {
      return; // Can't follow yourself
    }

    await toggleFollow();
  }, [router, toggleFollow, user, authorId]);

  // Don't show if not logged in, viewing own post, or still loading
  if (!user || user.id === authorId || isLoading) {
    return null;
  }

  const isFollowing = data?.isFollowing ?? false;
  const isDisabled = isUpdating || isLoading;

  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm'
  };

  return (
    <button
      onClick={handleToggleFollow}
      disabled={isDisabled}
      className={`rounded-full font-medium transition-colors ${
        isFollowing
          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300'
          : 'bg-green-600 text-white hover:bg-green-700'
      } ${sizeClasses[size]} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isFollowing ? `Unfollow ${authorName}` : `Follow ${authorName}`}
    >
      {isUpdating ? '...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}