import { useState } from 'react';

export default function DraggableItem({ item, onDragStart }) {
  const [isDragging, setIsDragging] = useState(false);

  const getItemIcon = (type) => {
    switch (type) {
      case 'food':
        return '🦴';
      case 'toy':
        return '🎾';
      case 'medicine':
        return '💊';
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
      default:
        return '';
    }
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    // Set the drag data
    e.dataTransfer.setData('application/json', JSON.stringify(item));

    // Create a drag image that looks like the card
    const dragCard = e.target.cloneNode(true);
    dragCard.style.transform = 'rotate(4deg)';
    dragCard.style.width = `${e.target.offsetWidth}px`;
    dragCard.style.height = `${e.target.offsetHeight}px`;
    dragCard.style.backgroundColor = 'white';
    dragCard.style.borderRadius = '0.5rem';
    dragCard.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
    dragCard.style.position = 'absolute';
    dragCard.style.top = '-1000px'; // Hide it from view
    document.body.appendChild(dragCard);

    // Set the custom drag image
    e.dataTransfer.setDragImage(dragCard, e.target.offsetWidth / 2, e.target.offsetHeight / 2);

    // Clean up the temporary element
    requestAnimationFrame(() => {
      document.body.removeChild(dragCard);
    });
    
    if (onDragStart) onDragStart(item);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable={item.quantity > 0}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`
        bg-white rounded-lg p-4 shadow-sm
        transition-all duration-200
        cursor-grab active:cursor-grabbing
        hover:shadow-md hover:-translate-y-0.5
        ${isDragging ? 'opacity-0 scale-95 rotate-3' : 'opacity-100 scale-100 rotate-0'}
        ${item.quantity === 0 ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">{getItemIcon(item.type)}</div>
        <div className="flex-grow">
          <h3 className="font-medium text-neutral-800">{item.name}</h3>
          <p className="text-sm text-neutral-600 mt-1">
            {getItemEffect(item.type)}
          </p>
          <p className="text-sm text-neutral-500 mt-1">
            Quantity: {item.quantity}
          </p>
        </div>
      </div>
    </div>
  );
} 