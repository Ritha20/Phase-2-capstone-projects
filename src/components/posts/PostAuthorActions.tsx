// src/componnets/posts/postAuthorActions.tsx

'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

interface PostAuthorActionsProps {
  authorId?: string | null;
  slug: string;
}

export default function PostAuthorActions({ authorId, slug }: PostAuthorActionsProps) {
  const { user } = useAuth();

  if (!user || !authorId || user.id !== authorId) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href={`/posts/${slug}/edit`}
        className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
      >
        Edit Post
      </Link>
    </div>
  );
}


