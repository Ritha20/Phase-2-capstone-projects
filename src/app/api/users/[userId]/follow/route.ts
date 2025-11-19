// src/app/api/users/[userId]/follow/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const authHeader = request.headers.get('authorization');
    
    let currentUserId: string | null = null;

    // Get current user from token if provided
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = verifyToken(token);
        currentUserId = decoded.userId;
      } catch (error) {
        // Token invalid, but we still return public data
      }
    }

    // Get follow stats
    const [followersCount, followingCount, isFollowing] = await Promise.all([
      // Followers count
      prisma.follow.count({
        where: { followingId: userId },
      }),
      // Following count
      prisma.follow.count({
        where: { followerId: userId },
      }),
      // Check if current user is following this user
      currentUserId ? prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: userId,
          },
        },
      }) : Promise.resolve(null),
    ]);

    return NextResponse.json({
      isFollowing: !!isFollowing,
      followersCount,
      followingCount,
    });
  } catch (error) {
    console.error('Get follow status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: targetUserId } = await params;
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const currentUserId = decoded.userId;

    // Can't follow yourself
    if (currentUserId === targetUserId) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      );
    }

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      },
    });

    let action: 'followed' | 'unfollowed';

    if (existingFollow) {
      // Unfollow: Remove the follow
      await prisma.follow.delete({
        where: {
          id: existingFollow.id,
        },
      });
      action = 'unfollowed';
    } else {
      // Follow: Create new follow
      await prisma.follow.create({
        data: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      });
      action = 'followed';
    }

    // Get updated counts
    const [followersCount, followingCount] = await Promise.all([
      prisma.follow.count({
        where: { followingId: targetUserId },
      }),
      prisma.follow.count({
        where: { followerId: targetUserId },
      }),
    ]);

    return NextResponse.json({
      action,
      isFollowing: action === 'followed',
      followersCount,
      followingCount,
    });
  } catch (error) {
    console.error('Toggle follow error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}