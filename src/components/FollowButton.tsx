// src/components/FollowButton.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

interface FollowButtonProps {
  userId: string;
  userName: string;
}

export default function FollowButton({ userId, userName }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, token } = useAuth();

  // Don't show button if:
  // - User not logged in
  // - User is trying to follow themselves
  if (!user || user.id === userId) {
    return null;
  }

  const handleFollow = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.isFollowing);
        alert(`You ${data.action} ${userName}`);
      } else {
        alert('Failed to follow user');
      }
    } catch (error) {
      console.error('Follow error:', error);
      alert('Error following user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={isLoading}
      className={`px-4 py-2 text-sm rounded-full font-medium transition-colors ${
        isFollowing 
          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
          : 'bg-green-600 text-white hover:bg-green-700'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? '...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}