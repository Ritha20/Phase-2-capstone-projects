// src/types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password: string;
          name: string | null;
          username: string | null;
          bio: string | null;
          avatar: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password: string;
          name?: string | null;
          username?: string | null;
          bio?: string | null;
          avatar?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          password?: string;
          name?: string | null;
          username?: string | null;
          bio?: string | null;
          avatar?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          title: string;
          content: string;
          excerpt: string | null;
          slug: string;
          published: boolean;
          image: string | null;
          tags: string[];
          author_id: string;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          excerpt?: string | null;
          slug: string;
          published?: boolean;
          image?: string | null;
          tags?: string[];
          author_id: string;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          title?: string;
          content?: string;
          excerpt?: string | null;
          slug?: string;
          published?: boolean;
          image?: string | null;
          tags?: string[];
          author_id?: string;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      comments: {
        Row: {
          id: string;
          content: string;
          author_id: string;
          post_id: string;
          parent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          content: string;
          author_id: string;
          post_id: string;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          author_id?: string;
          post_id?: string;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      likes: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          post_id?: string;
          created_at?: string;
        };
      };
      follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          follower_id: string;
          following_id: string;
          created_at?: string;
        };
        Update: {
          follower_id?: string;
          following_id?: string;
          created_at?: string;
        };
      };
    };
  };
};

