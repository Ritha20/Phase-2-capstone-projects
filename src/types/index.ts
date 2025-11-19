// src/types/index.ts

export interface User {
  id: string;
  email: string;
  name?: string | null;
  username?: string | null;
  bio?: string | null;
  avatar?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string | null;
  slug: string;
  published: boolean;
  image?: string | null;
  tags: string[];
  authorId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  author?: User | null;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  postId: string;
  parentId?: string | null;
  author?: User | null;
}

