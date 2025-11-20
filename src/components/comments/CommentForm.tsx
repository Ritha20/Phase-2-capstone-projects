// src/components/comments/CommentForm.tsx
'use client';

import { useState } from 'react';

interface CommentFormProps {
  onSubmit: (content: string, parentId?: string) => void;
  isSubmitting: boolean;
  placeholder?: string;
  parentId?: string;
  onCancel?: () => void;
}

export default function CommentForm({ 
  onSubmit, 
  isSubmitting, 
  placeholder = "What are your thoughts?",
  parentId,
  onCancel 
}: CommentFormProps) {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !isSubmitting) {
      onSubmit(content.trim(), parentId);
      setContent('');
      if (onCancel) onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="mb-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent resize-none"
          required
        />
      </div>
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
}