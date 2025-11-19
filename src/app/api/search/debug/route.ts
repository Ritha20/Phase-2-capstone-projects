// src/app/api/search/debug/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('=== SEARCH DEBUG START ===');
    
    // 1. Get ALL posts with full details
    const allPosts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        excerpt: true,
        content: true,
        tags: true,
        slug: true,
        published: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log('📊 ALL POSTS IN DATABASE:');
    allPosts.forEach(post => {
      console.log('---');
      console.log('Title:', post.title);
      console.log('Published:', post.published);
      console.log('Tags:', post.tags);
      console.log('Excerpt:', post.excerpt);
      console.log('Content preview:', post.content?.substring(0, 100));
      console.log('---');
    });

    // 2. Test specific searches
    const testQueries = ['cooking', 'Cooking', 'travel', 'rwanda', 'test'];
    
    for (const query of testQueries) {
      console.log(`\n🔍 TESTING SEARCH: "${query}"`);
      
      const results = await prisma.post.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { excerpt: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
            { tags: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: { title: true, tags: true }
      });

      console.log(`Results for "${query}":`, results.length, results);
    }

    console.log('=== SEARCH DEBUG END ===');

    return NextResponse.json({
      allPosts,
      message: 'Check terminal for detailed debug logs'
    });

  } catch (error) {
    console.error('💥 Search debug error:', error);
    return NextResponse.json({ error: 'Debug failed' }, { status: 500 });
  }
}