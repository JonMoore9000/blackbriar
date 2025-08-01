import { NextRequest, NextResponse } from 'next/server';
import { GameRun, RunSubmissionForm, RunFilters, RunSortOption } from '@/types';
import { saveRun, getRuns, generateId } from '@/lib/storage';
import { validateRunSubmission } from '@/lib/utils';
import { getBossById } from '@/lib/serverGameData';
import { generateRoast } from '@/lib/ai-roast';

export async function POST(request: NextRequest) {
  try {
    const body: RunSubmissionForm = await request.json();
    
    // Validate the submission
    const errors = validateRunSubmission(body);
    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }
    
    // Verify boss exists
    const boss = await getBossById(body.boss);
    if (!boss) {
      return NextResponse.json(
        { error: 'Invalid boss selected' },
        { status: 400 }
      );
    }
    
    // Create the run object
    const run: GameRun = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      playerName: body.playerName || undefined,
      boss: body.boss,
      items: body.items,
      hp: body.hp,
      atk: body.atk,
      def: body.def,
      spd: body.spd,
      outcome: body.outcome,
      deathReason: body.outcome === 'defeat' ? body.deathReason : undefined,
      notes: body.notes || undefined,
      commentCount: 0,
      shareCount: 0
    };
    
    // Save the run first
    await saveRun(run);

    // Try to generate AI roast (don't fail if this fails)
    try {
      const roast = await generateRoast(run);
      run.aiRoast = roast;

      // Update the run with the roast
      const { updateRunRoast } = await import('@/lib/storage');
      await updateRunRoast(run.id, roast);
    } catch (error) {
      console.log('Failed to generate AI roast, continuing without it:', error);
      // Continue without roast - not a critical failure
    }

    return NextResponse.json({
      success: true,
      id: run.id,
      message: 'Run submitted successfully',
      hasRoast: !!run.aiRoast
    });
    
  } catch (error) {
    console.error('Error submitting run:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const boss = searchParams.get('boss') || undefined;
    const outcome = searchParams.get('outcome') as 'victory' | 'defeat' | undefined;
    const sortBy = (searchParams.get('sort') as RunSortOption) || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Build filters
    const filters: RunFilters = {};
    if (boss) filters.boss = boss;
    if (outcome) filters.outcome = outcome;
    
    // Get runs
    const result = await getRuns(filters, sortBy, page, limit);
    
    return NextResponse.json({
      success: true,
      ...result,
      page,
      limit
    });
    
  } catch (error) {
    console.error('Error fetching runs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
