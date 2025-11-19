// src/hooks/usePosts.ts

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import type { Post } from '@/types';

interface UsePostsParams {
  tag?: string | null;
  authorId?: string;
  published?: boolean;
  includeDrafts?: boolean;
}

interface PostsResponse {
  posts: Post[];
  nextCursor?: string | null;
}

export function usePosts(params?: UsePostsParams, token?: string | null) {
  return useQuery({
    queryKey: ['posts', params, token ?? 'anon'],
    queryFn: async () => {
      const search = new URLSearchParams();
      if (typeof params?.published === 'boolean') {
        search.set('published', String(params.published));
      }

      if (params?.tag) {
        search.set('tag', params.tag);
      }

      if (params?.authorId) {
        search.set('author', params.authorId);
      }

      if (params?.includeDrafts) {
        search.set('includeDrafts', 'true');
      }

      const queryString = search.toString();
      const url = queryString ? `/api/posts?${queryString}` : '/api/posts';

      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const data = await apiFetch<PostsResponse>(url, { headers });
      return data.posts;
    },
  });
}

