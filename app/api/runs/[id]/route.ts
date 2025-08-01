import { NextRequest, NextResponse } from 'next/server';
import { getRunById } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const run = await getRunById(id);
    
    if (!run) {
      return NextResponse.json(
        { error: 'Run not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      run
    });
    
  } catch (error) {
    console.error('Error fetching run:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
