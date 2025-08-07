import { Item } from '@/types';

interface ItemListProps {
  items: (Item | undefined)[];
}

const rarityColors = {
  common: 'text-gray-400 border-gray-600',
  uncommon: 'text-green-400 border-green-600',
  rare: 'text-blue-400 border-blue-600',
  heroic: 'text-orange-400 border-orange-600',
  legendary: 'text-purple-400 border-purple-600'
};

const typeIcons = {
  weapon: '⚔️',
  armor: '🛡️',
  consumable: '🧪',
  artifact: '💎'
};

export default function ItemList({ items }: ItemListProps) {
  const validItems = items.filter((item): item is Item => item !== undefined);
  
  if (validItems.length === 0) {
    return (
      <div className="text-center text-gray-400 py-4">
        <p>No items used</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2 flex flex-wrap gap-3">
      {validItems.map((item) => (
        <div 
          key={item.id} 
          className={`run-items border rounded-lg p-3 bg-gray-800/50 ${
            rarityColors[item.rarity || 'common']
          }`}
        >
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">
              {typeIcons[item.type || 'weapon']}
            </span>
            <span className="font-semibold text-sm">{item.name}</span>
          </div>

          {/* Stats Display */}
          {item.stats && Object.keys(item.stats).length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {item.stats.hp && (
                <span className="text-xs px-1.5 py-0.5 bg-red-900/50 text-red-300 rounded">
                  {item.stats.hp > 0 ? '+' : ''}{item.stats.hp} HP
                </span>
              )}
              {item.stats.atk && (
                <span className="text-xs px-1.5 py-0.5 bg-orange-900/50 text-orange-300 rounded">
                  {item.stats.atk > 0 ? '+' : ''}{item.stats.atk} ATK
                </span>
              )}
              {item.stats.def && (
                <span className="text-xs px-1.5 py-0.5 bg-blue-900/50 text-blue-300 rounded">
                  {item.stats.def > 0 ? '+' : ''}{item.stats.def} DEF
                </span>
              )}
              {item.stats.spd && (
                <span className="text-xs px-1.5 py-0.5 bg-green-900/50 text-green-300 rounded">
                  {item.stats.spd > 0 ? '+' : ''}{item.stats.spd} SPD
                </span>
              )}
            </div>
          )}

          {/* Description */}
          {item.description && item.description !== '' && (
            <p className="text-xs text-gray-400 leading-tight mb-2">
              {item.description}
            </p>
          )}

          {/* Type and Rarity */}
          <div className="flex items-center justify-between">
            {item.type && (
              <span className="text-xs px-2 py-1 bg-gray-700 rounded text-gray-300">
                {item.type}
              </span>
            )}
            {item.rarity && (
              <span className={`text-xs font-semibold ${
                item.rarity === 'common' ? 'text-gray-400' :
                item.rarity === 'uncommon' ? 'text-green-400' :
                item.rarity === 'rare' ? 'text-blue-400' :
                item.rarity === 'heroic' ? 'text-orange-400' :
                'text-purple-400'
              }`}>
                {item.rarity.toUpperCase()}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
