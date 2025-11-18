import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

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

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { slug },
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

    if (existingLike) {
      // Unlike the post
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      // Like the post
      await prisma.like.create({
        data: {
          userId: decoded.userId,
          postId: post.id,
        },
      });
    }

    // Get updated like count
    const likeCount = await prisma.like.count({
      where: { postId: post.id },
    });

    return NextResponse.json({ 
      liked: !existingLike,
      likeCount 
    });
  } catch (error) {
    console.error('Like error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Check if user is authenticated to see if they liked the post
    const authHeader = request.headers.get('authorization');
    let userLiked = false;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = verifyToken(token);
        
        const post = await prisma.post.findUnique({
          where: { slug },
        });

        if (post) {
          const existingLike = await prisma.like.findUnique({
            where: {
              userId_postId: {
                userId: decoded.userId,
                postId: post.id,
              },
            },
          });
          userLiked = !!existingLike;
        }
      } catch (error) {
        // Token invalid, user not logged in
      }
    }

    // Get like count
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { likes: true },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      likeCount: post._count.likes,
      userLiked 
    });
  } catch (error) {
    console.error('Get likes error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}