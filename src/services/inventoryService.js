// Inventory management service

const STORAGE_KEY = 'inventory';

function dispatchInventoryUpdate(inventory) {
  window.dispatchEvent(new CustomEvent('inventoryUpdate', {
    detail: { inventory }
  }));
}

// Get all purchased items from localStorage
export function getInventory() {
  try {
    const savedItems = localStorage.getItem(STORAGE_KEY);
    return savedItems ? JSON.parse(savedItems) : [];
  } catch (error) {
    console.error('Failed to parse inventory:', error);
    return [];
  }
}

// Add a new item to inventory
export function addToInventory(item) {
  try {
    if (!item?.id) throw new Error('Invalid item');
    
    const inventory = getInventory();
    const existingItem = inventory.find(i => i.id === item.id);
    
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 0) + (item.quantity || 1);
    } else {
      inventory.push({ ...item, quantity: item.quantity || 1 });
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
    dispatchInventoryUpdate(inventory);
    return inventory;
  } catch (error) {
    console.error('Failed to add item to inventory:', error);
    return getInventory();
  }
}

// Remove or reduce quantity of an item
export function removeFromInventory(itemId, quantity = 1) {
  try {
    if (!itemId) throw new Error('Invalid item ID');
    
    const inventory = getInventory();
    const updatedInventory = inventory
      .map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: Math.max(0, (item.quantity || 0) - quantity)
          };
        }
        return item;
      })
      .filter(item => item.quantity > 0);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedInventory));
    dispatchInventoryUpdate(updatedInventory);
    return updatedInventory;
  } catch (error) {
    console.error('Failed to remove item from inventory:', error);
    return getInventory();
  }
} 