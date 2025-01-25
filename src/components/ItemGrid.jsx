const ITEM_TYPES = {
  FOOD: 'food',
  TOY: 'toy',
  MEDICINE: 'medicine',
};

export default function ItemGrid({ items, onUseItem }) {
  const getItemIcon = (type) => {
    switch (type) {
      case ITEM_TYPES.FOOD:
        return '🦴';
      case ITEM_TYPES.TOY:
        return '🎾';
      case ITEM_TYPES.MEDICINE:
        return '💊';
      default:
        return '📦';
    }
  };

  const getItemEffect = (type) => {
    switch (type) {
      case ITEM_TYPES.FOOD:
        return '+20 HP';
      case ITEM_TYPES.TOY:
        return '+10 HP, Happy!';
      case ITEM_TYPES.MEDICINE:
        return '+50 HP';
      default:
        return '';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-2xl mb-2">{getItemIcon(item.type)}</div>
              <h3 className="font-medium text-neutral-800">{item.name}</h3>
              <p className="text-sm text-neutral-600 mt-1">
                {getItemEffect(item.type)}
              </p>
              <p className="text-sm text-neutral-500 mt-1">
                Quantity: {item.quantity}
              </p>
            </div>
            <button
              onClick={() => onUseItem(item)}
              disabled={item.quantity === 0}
              className={`btn btn-primary text-sm ${
                item.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Use
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 