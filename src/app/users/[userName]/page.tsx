// src/app/users/[username]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import FollowButton from '@/components/follow/FollowButton';
import { useUserProfile } from '@/hooks/useProfile';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  tags: string;
  image: string;
  published: boolean;
  createdAt: string;
}

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  
  const { data: user, isLoading: userLoading } = useUserProfile(username);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  useEffect(() => {
    if (user?.id) {
      const fetchUserPosts = async () => {
        try {
          const response = await fetch(`/api/posts?author=${user.id}&published=true`);
          const data = await response.json();
          setUserPosts(data.posts || []);
        } catch (error) {
          console.error('Error fetching user posts:', error);
        } finally {
          setIsLoadingPosts(false);
        }
      };

      fetchUserPosts();
    }
  }, [user]);

  if (userLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center">User not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-green-600">
                  {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.name || 'Anonymous User'}
              </h1>
              <p className="text-gray-600">@{user.username || 'no-username'}</p>
              <p className="text-gray-500 mt-1">{user.email}</p>
            </div>
          </div>
          
          {/* Follow Button */}
          <FollowButton targetUserId={user.id} size="lg" />
        </div>

        {/* Bio */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
          <p className="text-gray-600">
            {user.bio || 'This user hasn\'t added a bio yet.'}
          </p>
        </div>

        {/* Stats */}
        <div className="flex space-x-8 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{userPosts.length}</p>
            <p className="text-gray-600">Posts</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-gray-600">Followers</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-gray-600">Following</p>
          </div>
        </div>
      </div>

      {/* User's Posts */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Posts by {user.name || 'this user'}
        </h2>
        
        {isLoadingPosts ? (
          <div className="text-center py-8">
            <div className="text-gray-500">Loading posts...</div>
          </div>
        ) : userPosts.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">
              {user.name || 'This user'} hasn't published any posts yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {userPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <Link href={`/posts/${post.slug}`} className="hover:text-green-700">
                      {post.title}
                    </Link>
                  </h3>
                  
                  {post.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}