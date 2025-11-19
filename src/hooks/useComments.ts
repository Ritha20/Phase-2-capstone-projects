// src/hooks/usecomments.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import type { Comment } from '@/types';

interface CommentsResponse {
  comments: Comment[];
}

interface CommentPayload {
  content: string;
  parentId?: string | null;
}

export function useComments(slug: string | undefined) {
  return useQuery({
    queryKey: ['comments', slug],
    enabled: Boolean(slug),
    queryFn: async () => {
      if (!slug) throw new Error('Missing slug');
      const data = await apiFetch<CommentsResponse>(`/api/posts/${slug}/comments`);
      return data.comments;
    },
  });
}

export function useCreateComment(slug: string | undefined, token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CommentPayload) => {
      if (!slug) throw new Error('Missing slug');
      const data = await apiFetch<{ comment: Comment }>(
        `/api/posts/${slug}/comments`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
      return data.comment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', slug] });
    },
  });
}

