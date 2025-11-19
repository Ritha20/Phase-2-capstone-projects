// src/components/follow/FollowButton.tsx
'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useFollow } from '@/hooks/useFollow';

interface FollowButtonProps {
  targetUserId: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function FollowButton({ targetUserId, size = 'md' }: FollowButtonProps) {
  const router = useRouter();
  const { user, token } = useAuth();
  const { data, isLoading, toggleFollow, isUpdating } = useFollow(targetUserId, token || undefined);

  const handleToggleFollow = useCallback(async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (user.id === targetUserId) {
      return; // Can't follow yourself
    }

    await toggleFollow();
  }, [router, toggleFollow, user, targetUserId]);

  // Don't show follow button if:
  // - Not logged in
  // - Viewing own profile
  // - Still loading follow data
  if (!user || user.id === targetUserId || isLoading) {
    return null;
  }

  const isFollowing = data?.isFollowing ?? false;
  const isDisabled = isUpdating || isLoading;

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2 text-base'
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
    >
      {isUpdating ? (
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {isFollowing ? 'Unfollowing...' : 'Following...'}
        </span>
      ) : isFollowing ? (
        'Following'
      ) : (
        'Follow'
      )}
    </button>
  );
}