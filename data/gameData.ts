import { Boss, Item } from '@/types';

// Cache for parsed game data
let gameDataCache: { bosses: Boss[]; items: Item[] } | null = null;

// Load game data from API (cached)
export async function loadGameData(): Promise<{ bosses: Boss[]; items: Item[] }> {
  if (gameDataCache) {
    return gameDataCache;
  }

  try {
    const response = await fetch('/api/gamedata');
    if (!response.ok) {
      throw new Error('Failed to fetch game data');
    }

    const data = await response.json();
    gameDataCache = {
      bosses: data.bosses || [],
      items: data.items || []
    };

    return gameDataCache;
  } catch (error) {
    console.error('Failed to load game data, using fallback:', error);
    // Return fallback data if API fails
    gameDataCache = {
      bosses: FALLBACK_BOSSES,
      items: FALLBACK_ITEMS
    };
    return gameDataCache;
  }
}

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
  // Weapons
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
    id: 'flame-sword',
    name: 'Flame Sword',
    description: 'A blade wreathed in eternal fire',
    type: 'weapon',
    rarity: 'rare'
  },
  {
    id: 'soul-reaper',
    name: 'Soul Reaper',
    description: 'A legendary scythe that harvests the essence of enemies',
    type: 'weapon',
    rarity: 'legendary'
  },

  // Armor
  {
    id: 'leather-vest',
    name: 'Leather Vest',
    description: 'Basic protection against claws and fangs',
    type: 'armor',
    rarity: 'common'
  },
  {
    id: 'chain-mail',
    name: 'Chain Mail',
    description: 'Interlocked metal rings provide solid defense',
    type: 'armor',
    rarity: 'uncommon'
  },
  {
    id: 'blessed-plate',
    name: 'Blessed Plate',
    description: 'Holy armor that repels evil',
    type: 'armor',
    rarity: 'rare'
  },

  // Consumables
  {
    id: 'health-potion',
    name: 'Health Potion',
    description: 'Restores vitality when consumed',
    type: 'consumable',
    rarity: 'common'
  },
  {
    id: 'strength-elixir',
    name: 'Strength Elixir',
    description: 'Temporarily boosts physical power',
    type: 'consumable',
    rarity: 'uncommon'
  },
  {
    id: 'holy-water',
    name: 'Holy Water',
    description: 'Blessed liquid that burns the undead',
    type: 'consumable',
    rarity: 'uncommon'
  },

  // Artifacts
  {
    id: 'cursed-amulet',
    name: 'Cursed Amulet',
    description: 'Grants power at a terrible cost',
    type: 'artifact',
    rarity: 'rare'
  },
  {
    id: 'ward-stone',
    name: 'Ward Stone',
    description: 'Provides protection against dark magic',
    type: 'artifact',
    rarity: 'uncommon'
  },
  {
    id: 'void-crystal',
    name: 'Void Crystal',
    description: 'A fragment of pure nothingness',
    type: 'artifact',
    rarity: 'legendary'
  }
];

// Synchronous exports for backward compatibility (will use cached data)
export const BOSSES: Boss[] = [];
export const ITEMS: Item[] = [];

// Client-side helper functions that work with cached data
export const getBossById = async (id: string): Promise<Boss | undefined> => {
  const { bosses } = await loadGameData();
  return bosses.find(boss => boss.id === id);
};

export const getItemById = async (id: string): Promise<Item | undefined> => {
  const { items } = await loadGameData();
  return items.find(item => item.id === id);
};

export const getBossesByDifficulty = async (difficulty: Boss['difficulty']): Promise<Boss[]> => {
  const { bosses } = await loadGameData();
  return bosses.filter(boss => boss.difficulty === difficulty);
};

export const getItemsByType = async (type: Item['type']): Promise<Item[]> => {
  const { items } = await loadGameData();
  return items.filter(item => item.type === type);
};

export const getItemsByRarity = async (rarity: Item['rarity']): Promise<Item[]> => {
  const { items } = await loadGameData();
  return items.filter(item => item.rarity === rarity);
};

export const getItemsByArea = async (area: string): Promise<Item[]> => {
  const { items } = await loadGameData();
  return items.filter(item => item.area === area);
};

export const getBossesByArea = async (area: string): Promise<Boss[]> => {
  const { bosses } = await loadGameData();
  return bosses.filter(boss => boss.area === area);
};
