import { promises as fs } from 'fs';
import path from 'path';
import { Boss, Item } from '@/types';

// Parse wiki table format to extract game data
export class GameDataParser {
  private static parseStats(statString: string): { hp?: number; atk?: number; def?: number; spd?: number } {
    const stats: { hp?: number; atk?: number; def?: number; spd?: number } = {};
    
    // Extract HP
    const hpMatch = statString.match(/(\d+)\s*Health/i);
    if (hpMatch) stats.hp = parseInt(hpMatch[1]);
    
    // Extract Attack
    const atkMatch = statString.match(/(\d+)\s*Attack/i);
    if (atkMatch) stats.atk = parseInt(atkMatch[1]);
    
    // Extract Armor (Defense)
    const defMatch = statString.match(/(\d+)\s*Armor/i);
    if (defMatch) stats.def = parseInt(defMatch[1]);
    
    // Extract Speed
    const spdMatch = statString.match(/(\d+)\s*speed/i);
    if (spdMatch) stats.spd = parseInt(spdMatch[1]);
    
    return stats;
  }

  private static parseItemStats(statString: string): { hp?: number; atk?: number; def?: number; spd?: number } {
    const stats: { hp?: number; atk?: number; def?: number; spd?: number } = {};
    
    // Parse format like "[[File:Icon attack.png]] 4<br>[[File:Icon speed.png]] -2"
    const hpMatch = statString.match(/Icon health\.png.*?(\-?\d+)/);
    if (hpMatch) stats.hp = parseInt(hpMatch[1]);
    
    const atkMatch = statString.match(/Icon attack\.png.*?(\-?\d+)/);
    if (atkMatch) stats.atk = parseInt(atkMatch[1]);
    
    const defMatch = statString.match(/Icon armor\.png.*?(\-?\d+)/);
    if (defMatch) stats.def = parseInt(defMatch[1]);
    
    const spdMatch = statString.match(/Icon speed\.png.*?(\-?\d+)/);
    if (spdMatch) stats.spd = parseInt(spdMatch[1]);
    
    return stats;
  }

  private static parseRarity(rarityString: string): Item['rarity'] {
    const lower = rarityString.toLowerCase();
    if (lower.includes('mythic')) return 'legendary';
    if (lower.includes('heroic')) return 'heroic';
    if (lower.includes('rare')) return 'rare';
    if (lower.includes('uncommon')) return 'uncommon';
    if (lower.includes('common')) return 'common';
    return 'common';
  }

  private static parseDifficulty(week: string): Boss['difficulty'] {
    const weekNum = parseInt(week);
    if (weekNum === 1) return 'easy';
    if (weekNum === 2) return 'medium';
    if (weekNum === 3) return 'hard';
    return 'nightmare';
  }

  private static cleanName(name: string): string {
    // Remove wiki markup, file references, and leading pipes
    return name
      .replace(/\[\[File:.*?\]\]/g, '')
      .replace(/\[\[.*?\|(.*?)\]\]/g, '$1')
      .replace(/\[\[(.*?)\]\]/g, '$1')
      .replace(/^\|+\s*/, '') // Remove leading pipes and whitespace
      .replace(/\s*\|+$/, '') // Remove trailing pipes and whitespace
      .trim();
  }

  private static createId(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '') // Remove leading/trailing dashes
      .trim();
  }

  private static getBossImageUrl(name: string): string {
    // Map boss names to their sprite files
    const nameToSprite: { [key: string]: string } = {
      'bearserker': 'bear',
      'brittlebark beast': 'beast',
      'stormcloud druid': 'druid',
      'frostbite': 'frostbite',
      'fungal experiment': 'fungal',
      'ironshell snail': 'gastropod',
      'ironstone golem': 'golem',
      'granite griffin': 'griffin',
      'razortusk hog': 'hog',
      'goldwing monarch': 'monarch',
      'black knight': 'knight',
      'leshen': 'leshen',
      'liferoot experiment': 'liferoot_experiment',
      'bloodmoon werewolf': 'werewolf',
      'redwood treant': 'treant',
      'mountain troll': 'troll',
      'gentle giant': 'stag',
      'hot head': 'slime',
      'woodland abomination': 'spirit'
    };

    const lowerName = name.toLowerCase();
    const spriteKey = nameToSprite[lowerName];

    if (spriteKey) {
      return `/gamedata/bossArt/Bosssprite_${spriteKey}.png`;
    }

    // Fallback: try to find a direct match
    return `/gamedata/bossArt/${name}.png`;
  }

  static async parseBossesFromFile(filePath: string, area: string): Promise<Boss[]> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const bosses: Boss[] = [];
      
      // Find the bosses section
      const bossSection = content.split('== Bosses ==')[1];
      if (!bossSection) return bosses;
      
      // Split into table rows
      const rows = bossSection.split('|-').slice(1); // Skip header

      for (const row of rows) {
        // Split by | but handle || as well
        const cells = row.split(/\|\|?/).map(cell => cell.trim()).filter(cell => cell.length > 0);
        if (cells.length < 6) continue;

        const name = this.cleanName(cells[0]);
        if (!name) continue;
        
        const hp = parseInt(cells[1]) || 10;
        const atk = parseInt(cells[2]) || 1;
        const def = parseInt(cells[3]) || 0;
        const spd = parseInt(cells[4]) || 1;
        const trait = cells[5]?.replace(/\n.*$/, '').trim() || '';
        const week = cells[6] || '1';
        
        const boss: Boss = {
          id: this.createId(name),
          name: name,
          description: trait,
          difficulty: this.parseDifficulty(week),
          area: area,
          stats: { hp, atk, def, spd },
          imageUrl: this.getBossImageUrl(name)
        };
        
        bosses.push(boss);
      }
      
      return bosses;
    } catch (error) {
      console.error(`Error parsing bosses from ${filePath}:`, error);
      return [];
    }
  }

  static async parseItemsFromFile(filePath: string, area: string): Promise<Item[]> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const items: Item[] = [];
      
      // Parse weapons section
      const weaponSection = content.split('== Weapons ==')[1]?.split('== Items ==')[0];
      if (weaponSection) {
        const weaponRows = weaponSection.split('|-').slice(1);
        
        for (const row of weaponRows) {
          const cells = row.split(/\|\|?/).map(cell => cell.trim()).filter(cell => cell.length > 0);
          if (cells.length < 3) continue;
          
          const name = this.cleanName(cells[0]);
          if (!name) continue;
          
          const rarity = this.parseRarity(cells[1]);
          const stats = this.parseItemStats(cells[2]);
          const effect = cells[3]?.trim() || '';
          
          const item: Item = {
            id: this.createId(name),
            name: name,
            description: effect,
            type: 'weapon',
            rarity: rarity,
            area: area,
            stats: stats
          };
          
          items.push(item);
        }
      }
      
      // Parse items section
      const itemSection = content.split('== Items ==')[1]?.split('=== Jewelry ===')[0];
      if (itemSection) {
        const itemRows = itemSection.split('|-').slice(1);
        
        for (const row of itemRows) {
          const cells = row.split(/\|\|?/).map(cell => cell.trim()).filter(cell => cell.length > 0);
          if (cells.length < 3) continue;
          
          const name = this.cleanName(cells[0]);
          if (!name) continue;
          
          const rarity = this.parseRarity(cells[1]);
          const stats = this.parseItemStats(cells[2]);
          const effect = cells[3]?.trim() || '';
          
          const item: Item = {
            id: this.createId(name),
            name: name,
            description: effect,
            type: 'armor', // Most items are armor/equipment
            rarity: rarity,
            area: area,
            stats: stats
          };
          
          items.push(item);
        }
      }
      
      // Parse jewelry section
      const jewelrySection = content.split('=== Jewelry ===')[1]?.split('=== Food ===')[0];
      if (jewelrySection) {
        const jewelryRows = jewelrySection.split('|-').slice(1);
        
        for (const row of jewelryRows) {
          const cells = row.split(/\|\|?/).map(cell => cell.trim()).filter(cell => cell.length > 0);
          if (cells.length < 3) continue;
          
          const name = this.cleanName(cells[0]);
          if (!name) continue;
          
          const rarity = this.parseRarity(cells[1]);
          const effect = cells[2]?.trim() || '';
          
          const item: Item = {
            id: this.createId(name),
            name: name,
            description: effect,
            type: 'artifact',
            rarity: rarity,
            area: area
          };
          
          items.push(item);
        }
      }
      
      // Parse food section
      const foodSection = content.split('=== Food ===')[1];
      if (foodSection) {
        const foodRows = foodSection.split('|-').slice(1);
        
        for (const row of foodRows) {
          const cells = row.split(/\|\|?/).map(cell => cell.trim()).filter(cell => cell.length > 0);
          if (cells.length < 3) continue;
          
          const name = this.cleanName(cells[0]);
          if (!name) continue;
          
          const rarity = this.parseRarity(cells[1]);
          const effect = cells[2]?.trim() || '';
          
          const item: Item = {
            id: this.createId(name),
            name: name,
            description: effect,
            type: 'consumable',
            rarity: rarity,
            area: area
          };
          
          items.push(item);
        }
      }
      
      return items;
    } catch (error) {
      console.error(`Error parsing items from ${filePath}:`, error);
      return [];
    }
  }

  static async loadAllGameData(): Promise<{ bosses: Boss[]; items: Item[] }> {
    const gameDataDir = path.join(process.cwd(), 'gamedata');
    
    const [
      woodlandBosses,
      swamplandBosses,
      woodlandItems,
      swamplandItems
    ] = await Promise.all([
      this.parseBossesFromFile(path.join(gameDataDir, 'woodlandEnemies.txt'), 'woodland'),
      this.parseBossesFromFile(path.join(gameDataDir, 'swamplandEnemies.txt'), 'swampland'),
      this.parseItemsFromFile(path.join(gameDataDir, 'woodlandItems.txt'), 'woodland'),
      this.parseItemsFromFile(path.join(gameDataDir, 'swamplandItems.txt'), 'swampland')
    ]);
    
    return {
      bosses: [...woodlandBosses, ...swamplandBosses],
      items: [...woodlandItems, ...swamplandItems]
    };
  }
}
