// Server-side game data functions that can use fs
import { Boss, Item } from '@/types';
import { GameDataParser } from './gameDataParser';

// Cache for parsed game data
let gameDataCache: { bosses: Boss[]; items: Item[] } | null = null;

// Fallback data in case file parsing fails
const FALLBACK_BOSSES: Boss[] = [
  {
    id: 'shadow-lurker',
    name: 'Shadow Lurker',
    description: 'A writhing mass of darkness that feeds on fear',
    difficulty: 'easy'
  },
  {
    id: 'bone-collector',
    name: 'Bone Collector',
    description: 'An ancient skeleton that hoards the remains of the fallen',
    difficulty: 'medium'
  },
  {
    id: 'crimson-wraith',
    name: 'Crimson Wraith',
    description: 'A vengeful spirit dripping with blood',
    difficulty: 'hard'
  },
  {
    id: 'the-devourer',
    name: 'The Devourer',
    description: 'An eldritch horror that consumes reality itself',
    difficulty: 'nightmare'
  }
];

const FALLBACK_ITEMS: Item[] = [
  {
    id: 'rusty-blade',
    name: 'Rusty Blade',
    description: 'A corroded sword that has seen better days',
    type: 'weapon',
    rarity: 'common'
  },
  {
    id: 'silver-dagger',
    name: 'Silver Dagger',
    description: 'Blessed silver that cuts through darkness',
    type: 'weapon',
    rarity: 'uncommon'
  },
  {
    id: 'soul-reaper',
    name: 'Soul Reaper',
    description: 'A legendary scythe that harvests the essence of enemies',
    type: 'weapon',
    rarity: 'legendary'
  }
];

// Clear cache (useful for development)
export function clearGameDataCache(): void {
  gameDataCache = null;
}

// Load game data from files (server-side only)
export async function loadServerGameData(): Promise<{ bosses: Boss[]; items: Item[] }> {
  if (gameDataCache) {
    return gameDataCache;
  }
  
  try {
    gameDataCache = await GameDataParser.loadAllGameData();
    return gameDataCache;
  } catch (error) {
    console.error('Failed to load game data, using fallback:', error);
    // Return fallback data if parsing fails
    gameDataCache = {
      bosses: FALLBACK_BOSSES,
      items: FALLBACK_ITEMS
    };
    return gameDataCache;
  }
}

// Server-side helper functions
export async function getBossById(id: string): Promise<Boss | undefined> {
  const { bosses } = await loadServerGameData();
  return bosses.find(boss => boss.id === id);
}

export async function getItemById(id: string): Promise<Item | undefined> {
  const { items } = await loadServerGameData();
  return items.find(item => item.id === id);
}

export async function getBossesByDifficulty(difficulty: Boss['difficulty']): Promise<Boss[]> {
  const { bosses } = await loadServerGameData();
  return bosses.filter(boss => boss.difficulty === difficulty);
}

export async function getItemsByType(type: Item['type']): Promise<Item[]> {
  const { items } = await loadServerGameData();
  return items.filter(item => item.type === type);
}

export async function getItemsByRarity(rarity: Item['rarity']): Promise<Item[]> {
  const { items } = await loadServerGameData();
  return items.filter(item => item.rarity === rarity);
}

export async function getItemsByArea(area: string): Promise<Item[]> {
  const { items } = await loadServerGameData();
  return items.filter(item => item.area === area);
}

export async function getBossesByArea(area: string): Promise<Boss[]> {
  const { bosses } = await loadServerGameData();
  return bosses.filter(boss => boss.area === area);
}
