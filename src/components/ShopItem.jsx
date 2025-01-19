import { CurrencyDollarIcon } from '@heroicons/react/24/solid';

export default function ShopItem({ item, onBuy, playerCoins }) {
  const canAfford = playerCoins >= item.price;

  const getItemIcon = (type) => {
    switch (type) {
      case 'food':
        return '🦴';
      case 'toy':
        return '🎾';
      case 'medicine':
        return '💊';
      case 'accessory':
        return '🎀';
      default:
        return '📦';
    }
  };

  const getItemEffect = (type) => {
    switch (type) {
      case 'food':
        return '+20 HP';
      case 'toy':
        return '+10 HP, Happy!';
      case 'medicine':
        return '+50 HP';
      case 'accessory':
        return 'Style +100';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-lg font-semibold text-neutral-800">{item.name}</h3>
          <div className="flex items-center gap-1 text-sm text-neutral-600">
            <span>{getItemIcon(item.type)}</span>
            <span className="capitalize">{item.type}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded">
          <CurrencyDollarIcon className="w-4 h-4 text-amber-500" />
          <span className="font-medium text-amber-700">{item.price}</span>
        </div>
      </div>
      
      <p className="text-sm text-neutral-600 mb-3">{item.description}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-emerald-600 font-medium">
          {getItemEffect(item.type)}
        </span>
        <button
          onClick={() => onBuy(item)}
          disabled={!canAfford}
          className={`
            px-3 py-1.5 rounded text-sm font-medium transition-colors
            ${canAfford
              ? 'bg-neutral-800 text-white hover:bg-neutral-700'
              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }
          `}
        >
          Buy
        </button>
      </div>
    </div>
  );
} 