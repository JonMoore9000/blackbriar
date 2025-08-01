import { NextRequest, NextResponse } from 'next/server';
import { generateAndSaveRoast } from '@/lib/ai-roast';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: runId } = await params;

    // Check if we should force regeneration
    const body = await request.json().catch(() => ({}));
    const forceRegenerate = body.regenerate === true;

    const roast = await generateAndSaveRoast(runId, forceRegenerate);
    
    return NextResponse.json({
      success: true,
      roast,
      message: 'Roast generated successfully'
    });
    
  } catch (error) {
    console.error('Error generating roast:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Run not found') {
        return NextResponse.json(
          { error: 'Run not found' },
          { status: 404 }
        );
      }
      
      if (error.message === 'OpenAI API key not configured') {
        return NextResponse.json(
          { error: 'AI roast service not configured' },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to generate roast' },
      { status: 500 }
    );
  }
}
