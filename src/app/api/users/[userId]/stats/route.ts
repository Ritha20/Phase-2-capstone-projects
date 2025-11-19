// src/app/api/users/[userId]/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    // Get follow stats from database
    const [followersCount, followingCount] = await Promise.all([
      // Count how many people follow this user
      prisma.follow.count({
        where: { followingId: userId },
      }),
      // Count how many people this user follows
      prisma.follow.count({
        where: { followerId: userId },
      }),
    ]);

    return NextResponse.json({
      followersCount,
      followingCount,
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}