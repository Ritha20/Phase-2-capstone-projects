// src/components/comments/CommentsSection.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { useComments, useCreateComment } from '@/hooks/useComments';

interface CommentsSectionProps {
  slug: string;
}

export default function CommentsSection({ slug }: CommentsSectionProps) {
  const { user, token } = useAuth();
  const { data: comments, isLoading, error } = useComments(slug);
  const createComment = useCreateComment(slug, token);

  const handleAddComment = async (content: string, parentId?: string) => {
    await createComment.mutateAsync({ content, parentId });
  };

  if (isLoading) {
    return (
      <div className="mt-12">
        <div className="text-center">Loading comments...</div>
      </div>
    );
  }

  return (
    <div className="mt-12 border-t text-black pt-8">
      <h3 className="text-2xl font-bold text-black mb-6">
        Discussion ({comments?.length || 0})
      </h3>

      {/* Comment Form */}
      {user ? (
        <CommentForm 
          onSubmit={handleAddComment}
          isSubmitting={createComment.isPending}
          placeholder="What are your thoughts?"
        />
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 text-center mb-6">
          <p className="text-gray-600 mb-2">
            Please sign in to join the conversation.
          </p>
        </div>
      )}

      {/* Comments List */}
      <CommentList 
        comments={comments || []}
        onReply={handleAddComment}
        currentUser={user}
        isSubmittingReply={createComment.isPending}
      />
    </div>
  );
}