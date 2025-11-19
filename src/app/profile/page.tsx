// src/app/profile/page.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { useFollow } from '@/hooks/useFollow';

async function getUserPosts(userId: string) {
  try {
    const response = await fetch(`/api/posts?author=${userId}`);
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return [];
  }
}

export default function ProfilePage() {
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    avatar: '',
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { user, isLoading: authLoading, token } = useAuth();

  // Use follow hook for the current user's stats
  const { data: followData, isLoading: followLoading } = useFollow(user?.id, token || undefined);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      // Set form data with current user info
      setFormData({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
      });

      // Load user's posts
      const loadUserPosts = async () => {
        const posts = await getUserPosts(user.id);
        setUserPosts(posts);
        setIsLoading(false);
      };

      loadUserPosts();
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    console.log('Current avatar URL:', formData.avatar);
    console.log('User avatar from auth:', user?.avatar);
  }, [formData.avatar, user?.avatar]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be less than 2MB');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Update the avatar in form data
        setFormData(prev => ({ ...prev, avatar: data.url }));
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          bio: formData.bio,
          avatar: formData.avatar,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Update the auth context with new user data
        
        alert('Profile updated successfully!');
        window.location.reload();
      } else {
        alert(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      alert('Failed to update profile');
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-6">
            {/* Avatar Section */}
            <div className="relative group">
              <div 
                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
                onClick={triggerFileInput}
              >
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt={formData.name || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-green-600">
                    {formData.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              
              {/* Upload overlay */}
              <div 
                className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={triggerFileInput}
              >
                <span className="text-white text-sm font-medium">Change</span>
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                accept="image/*"
                className="hidden"
              />

              {/* Uploading indicator */}
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="text-white text-sm">Uploading...</div>
                </div>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {formData.name || 'Anonymous User'}
              </h1>
              <p className="text-gray-600">@{formData.username || 'no-username'}</p>
              <p className="text-gray-500 mt-1">{user.email}</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
          {isEditing ? (
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          ) : (
            <p className="text-gray-600">
              {formData.bio || 'No bio yet. Share something about yourself!'}
            </p>
          )}
        </div>

        {/* Stats - UPDATED WITH FOLLOW DATA */}
        <div className="flex space-x-8 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{userPosts.length}</p>
            <p className="text-gray-600">Posts</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {followLoading ? '...' : (followData?.followersCount ?? 0)}
            </p>
            <p className="text-gray-600">Followers</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {followLoading ? '...' : (followData?.followingCount ?? 0)}
            </p>
            <p className="text-gray-600">Following</p>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleUpdateProfile} className="mt-6 space-y-4 border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Avatar Upload in Edit Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div 
                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
                    onClick={triggerFileInput}
                  >
                    {formData.avatar ? (
                      <img
                        src={formData.avatar}
                        alt={formData.name || 'User'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-bold text-green-600">
                        {formData.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
                  >
                    Change Photo
                  </button>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 2MB</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* User's Posts */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">My Posts</h2>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-gray-500">Loading posts...</div>
          </div>
        ) : userPosts.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 mb-4">You haven't created any posts yet.</p>
            <Link
              href="/editor"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Write Your First Post
            </Link>
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
                    <span className="mx-2">•</span>
                    <span className={post.published ? 'text-green-600' : 'text-yellow-600'}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
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
                  
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      Read more →
                    </Link>
                    
                    <Link
                      href={`/posts/${post.slug}/edit`}
                      className="text-gray-600 hover:text-gray-700 text-sm"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}