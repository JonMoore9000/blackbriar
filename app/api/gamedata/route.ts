import { NextRequest, NextResponse } from 'next/server';
import { loadServerGameData, clearGameDataCache } from '@/lib/serverGameData';

export async function GET(request: NextRequest) {
  try {
    // Check if we should clear cache
    const { searchParams } = new URL(request.url);
    if (searchParams.get('clearCache') === 'true') {
      clearGameDataCache();
    }

    const gameData = await loadServerGameData();

    return NextResponse.json({
      success: true,
      bosses: gameData.bosses,
      items: gameData.items,
      stats: {
        bossCount: gameData.bosses.length,
        itemCount: gameData.items.length,
        areas: [...new Set([
          ...gameData.bosses.map(b => b.area).filter(Boolean),
          ...gameData.items.map(i => i.area).filter(Boolean)
        ])]
      }
    });

  } catch (error) {
    console.error('Error loading game data:', error);
    return NextResponse.json(
      { error: 'Failed to load game data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
