// src/hooks/useProfile.ts

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import type { User } from '@/types';

interface ProfileCounts {
  posts: number;
  followers: number;
  following: number;
}

interface ProfileResponse {
  user: User & { _count?: ProfileCounts };
}

export function useOwnProfile(token: string | null) {
  return useQuery({
    queryKey: ['profile', 'me'],
    enabled: Boolean(token),
    queryFn: async () => {
      if (!token) throw new Error('Missing auth token');
      const data = await apiFetch<ProfileResponse>('/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.user;
    },
  });
}

export function useUserProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['profile', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      if (!userId) throw new Error('Missing user id');
      const data = await apiFetch<ProfileResponse>(`/api/users/${userId}/profile`);
      return data.user;
    },
  });
}

