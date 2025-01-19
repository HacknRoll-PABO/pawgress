import { useState } from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/solid';
import ShopItem from './ShopItem';
import { addToInventory } from '../services/inventoryService';

// Shop inventory data
const shopItems = [
  {
    id: 1,
    name: 'Premium Bone Treat',
    type: 'food',
    price: 50,
    description: 'A high-quality bone treat that your pet will love!',
    quantity: 1
  },
  {
    id: 2,
    name: 'Squeaky Ball',
    type: 'toy',
    price: 75,
    description: 'A bouncy ball that makes fun sounds when played with.',
    quantity: 1
  },
  {
    id: 3,
    name: 'Health Potion',
    type: 'medicine',
    price: 100,
    description: 'Instantly restores a large amount of health.',
    quantity: 1
  },
  {
    id: 4,
    name: 'Fancy Collar',
    type: 'accessory',
    price: 200,
    description: 'A stylish collar that makes your pet look distinguished.',
    quantity: 1
  },
  {
    id: 5,
    name: 'Gourmet Treats Pack',
    type: 'food',
    price: 150,
    description: 'A variety pack of premium treats.',
    quantity: 3
  },
  {
    id: 6,
    name: 'Interactive Puzzle Toy',
    type: 'toy',
    price: 125,
    description: 'Keeps your pet entertained and mentally stimulated.',
    quantity: 1
  }
];

export default function Shop({ coins, onPurchase }) {
  const [notification, setNotification] = useState(null);

  const handleBuy = (item) => {
    if (coins >= item.price) {
      // Add item to inventory
      addToInventory(item);
      // Update coins
      onPurchase(item);
      showNotification(`Successfully purchased ${item.name}!`, 'success');
    } else {
      showNotification(`Not enough coins to buy ${item.name}`, 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-neutral-800">Pet Shop</h2>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
          <CurrencyDollarIcon className="w-5 h-5 text-amber-500" />
          <span className="font-medium">{coins} coins</span>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`
          p-4 rounded-lg
          ${notification.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}
        `}>
          {notification.message}
        </div>
      )}

      {/* Shop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shopItems.map(item => (
          <ShopItem
            key={item.id}
            item={item}
            onBuy={handleBuy}
            playerCoins={coins}
          />
        ))}
      </div>
    </div>
  );
} 