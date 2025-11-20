export interface User {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  slug: string;
  published: boolean;
  image: string | null;
  tags: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  author?: User | null;
  _count?: {
    likes: number;
    comments: number;
  };
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  postId: string;
  parentId: string | null;
  author?: User | null;
}

export interface Like {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface PostsResponse {
  posts: Post[];
}

export interface PostResponse {
  post: Post;
}

export interface CommentsResponse {
  comments: Comment[];
}

export interface CommentResponse {
  comment: Comment;
}

export interface LikeResponse {
  likeCount: number;
  userLiked: boolean;
}

export interface FollowResponse {
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
}