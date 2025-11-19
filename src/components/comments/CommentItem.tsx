// src/components/comments/CommentItem.tsx
'use client';

import { useState } from 'react';
import CommentForm from './CommentForm';
import type { Comment } from '@/types';

interface CommentItemProps {
  comment: Comment;
  onReply: (content: string, parentId: string) => void;
  currentUser: any;
  isSubmittingReply: boolean;
  allComments: Comment[];
}

export default function CommentItem({ 
  comment, 
  onReply, 
  currentUser,
  isSubmittingReply,
  allComments 
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  
  // Find replies to this comment
  const replies = allComments.filter(c => c.parentId === comment.id);

  const handleReply = (content: string) => {
    onReply(content, comment.id);
    setShowReplyForm(false);
  };

  return (
    <div className="border-b border-gray-200 pb-6 last:border-b-0">
      {/* Main Comment */}
      <div className="flex space-x-3">
        {comment.author?.avatar && (
          <img
            src={comment.author.avatar}
            alt={comment.author.name || 'User'}
            className="w-8 h-8 rounded-full"
          />
        )}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-semibold text-gray-900">
              {comment.author?.name || 'Anonymous'}
            </span>
            <span className="text-gray-500 text-sm">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
          
          {/* Reply Button */}
          {currentUser && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="mt-2 text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Reply
            </button>
          )}
        </div>
      </div>

      {/* Reply Form */}
      {showReplyForm && currentUser && (
        <div className="ml-11 mt-4">
          <CommentForm
            onSubmit={handleReply}
            isSubmitting={isSubmittingReply}
            placeholder="Write your reply..."
            parentId={comment.id}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}

      {/* Replies */}
      {replies.length > 0 && (
        <div className="ml-11 mt-4 space-y-4 border-l-2 border-gray-100 pl-4">
          {replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              currentUser={currentUser}
              isSubmittingReply={isSubmittingReply}
              allComments={allComments}
            />
          ))}
        </div>
      )}
    </div>
  );
}