// src/components/comments/CommentList.tsx
'use client';

import { useState } from 'react';
import CommentItem from './CommentItem';
import type { Comment } from '@/types';

interface CommentListProps {
  comments: Comment[];
  onReply: (content: string, parentId: string) => void;
  currentUser: any;
  isSubmittingReply: boolean;
}

export default function CommentList({ 
  comments, 
  onReply, 
  currentUser,
  isSubmittingReply 
}: CommentListProps) {
  // Group comments by parent (simple flat comments for now)
  const topLevelComments = comments.filter(comment => !comment.parentId);

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No comments yet. Be the first to share your thoughts!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {topLevelComments.map(comment => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onReply={onReply}
          currentUser={currentUser}
          isSubmittingReply={isSubmittingReply}
          allComments={comments}
        />
      ))}
    </div>
  );
}