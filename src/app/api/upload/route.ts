// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Mock upload - return a placeholder URL
    const mockImageUrl = `https://picsum.photos/800/400?random=${Date.now()}`;
    
    return NextResponse.json({ 
      success: true, 
      url: mockImageUrl 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}