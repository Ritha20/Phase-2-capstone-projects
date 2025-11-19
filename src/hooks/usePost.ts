// src/hooks/usePost.ts

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import type { Post } from '@/types';

interface PostResponse {
  post: Post;
}

export function usePost(slug: string | undefined, initialData?: Post) {
  return useQuery({
    queryKey: ['post', slug],
    enabled: Boolean(slug),
    initialData,
    initialDataUpdatedAt: initialData ? Date.now() : undefined,
    queryFn: async () => {
      if (!slug) {
        throw new Error('Missing slug');
      }
      const data = await apiFetch<PostResponse>(`/api/posts/${slug}`);
      return data.post;
    },
  });
}

