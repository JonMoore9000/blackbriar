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
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-lg">
              {typeIcons[item.type || 'weapon']}
            </span>
            <span className="font-semibold text-sm">{item.name}</span>
          </div>
          
          {item.description && (
            <p className="text-xs text-gray-400 leading-tight">
              {item.description}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-2">
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
