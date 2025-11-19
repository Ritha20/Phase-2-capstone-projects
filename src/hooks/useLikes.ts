// src/hooks/useLikes.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';

interface LikeResponse {
  likeCount: number;
  userLiked: boolean;
}

interface ToggleResponse {
  likeCount: number;
  liked: boolean;
}

export function usePostLikes(slug: string | undefined, token?: string | null) {
  const queryClient = useQueryClient();
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : undefined;

  const query = useQuery({
    queryKey: ['likes', slug],
    enabled: Boolean(slug),
    queryFn: async () => {
      if (!slug) {
        throw new Error('Missing slug');
      }

      const data = await apiFetch<LikeResponse>(`/api/posts/${slug}/like`, {
        headers: authHeaders,
      });
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!slug) throw new Error('Missing slug');
      const data = await apiFetch<ToggleResponse>(`/api/posts/${slug}/like`, {
        method: 'POST',
        headers: authHeaders,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likes', slug] });
    },
  });

  return { 
    ...query, 
    toggleLike: mutation.mutateAsync, 
    isToggling: mutation.isPending 
  };
}