//src/hooks/useFollows.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';

interface FollowResponse {
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
}

export function useFollow(targetUserId: string | undefined, token?: string | null) {
  const queryClient = useQueryClient();
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : undefined;

  const query = useQuery({
    queryKey: ['follow', targetUserId],
    enabled: Boolean(targetUserId),
    queryFn: async () => {
      if (!targetUserId) throw new Error('Missing user id');
      const data = await apiFetch<FollowResponse>(`/api/users/${targetUserId}/follow`, {
        headers: authHeaders,
      });
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!targetUserId) throw new Error('Missing user id');
      const data = await apiFetch<FollowResponse>(`/api/users/${targetUserId}/follow`, {
        method: 'POST',
        headers: authHeaders,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow', targetUserId] });
    },
  });

  return {
    ...query,
    toggleFollow: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
}

