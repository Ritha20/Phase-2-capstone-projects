// src/app/api/posts/[slug]/like/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

// GET - Get like count and user's like status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const authHeader = request.headers.get('authorization');
    
    let userId: string | null = null;

    // Try to get user ID from token if provided
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = verifyToken(token);
        userId = decoded.userId;
      } catch (error) {
        // Token is invalid, but we still return public like count
      }
    }

    // Find the post
    const post = await prisma.post.findUnique({
      where: { slug: slug },
      include: {
        likes: true,
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check if current user liked this post
    let userLiked = false;
    if (userId) {
      const userLike = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId: userId,
            postId: post.id,
          },
        },
      });
      userLiked = !!userLike;
    }

    return NextResponse.json({
      likeCount: post._count.likes,
      userLiked,
    });
  } catch (error) {
    console.error('Get likes error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Toggle like (like/unlike)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
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

    // Find the post
    const post = await prisma.post.findUnique({
      where: { slug: slug },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check if user already liked this post
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: decoded.userId,
          postId: post.id,
        },
      },
    });

    let likeCount;
    
    if (existingLike) {
      // Unlike: Remove the like
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      
      // Get updated like count
      const updatedPost = await prisma.post.findUnique({
        where: { id: post.id },
        include: {
          _count: {
            select: {
              likes: true,
            },
          },
        },
      });
      
      likeCount = updatedPost?._count.likes || 0;
      
      return NextResponse.json({
        likeCount,
        liked: false,
      });
    } else {
      // Like: Add a new like
      await prisma.like.create({
        data: {
          userId: decoded.userId,
          postId: post.id,
        },
      });
      
      // Get updated like count
      const updatedPost = await prisma.post.findUnique({
        where: { id: post.id },
        include: {
          _count: {
            select: {
              likes: true,
            },
          },
        },
      });
      
      likeCount = updatedPost?._count.likes || 0;
      
      return NextResponse.json({
        likeCount,
        liked: true,
      });
    }
  } catch (error) {
    console.error('Toggle like error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}