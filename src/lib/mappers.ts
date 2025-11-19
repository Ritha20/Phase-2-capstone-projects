// src/lib/mappers.ts

import type { Database } from '@/types/database';

type UserRow = Database['public']['Tables']['users']['Row'];
type PostRow = Database['public']['Tables']['posts']['Row'] & {
  author?: UserRow | null;
};
type CommentRow = Database['public']['Tables']['comments']['Row'] & {
  author?: UserRow | null;
};

export function mapUser(row: UserRow | null | undefined) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    username: row.username,
    bio: row.bio,
    avatar: row.avatar,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapPost(row: PostRow) {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    excerpt: row.excerpt,
    slug: row.slug,
    published: row.published,
    image: row.image,
    tags: row.tags ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
    authorId: row.author_id,
    author: mapUser(row.author ?? undefined),
  };
}

export function mapComment(row: CommentRow) {
  return {
    id: row.id,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    authorId: row.author_id,
    postId: row.post_id,
    parentId: row.parent_id,
    author: mapUser(row.author ?? undefined),
  };
}

