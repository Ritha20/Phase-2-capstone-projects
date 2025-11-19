// src/app/debug/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const allPosts = await prisma.post.findMany();
    console.log('All posts in database:', allPosts.map(p => ({ id: p.id, slug: p.slug, published: p.published })));
    
    return NextResponse.json({ 
      posts: allPosts.map(p => ({ id: p.id, slug: p.slug, published: p.published }))
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: 'Debug failed' }, { status: 500 });
  }
}