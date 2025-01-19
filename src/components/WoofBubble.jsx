import { useState, useEffect } from 'react';

export default function WoofBubble() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the bubble every 15-30 seconds randomly
    const scheduleNextWoof = () => {
      const randomDelay = Math.floor(Math.random() * (30000 - 15000) + 15000);
      return setTimeout(() => {
        setIsVisible(true);
        // Hide the bubble after 2 seconds
        setTimeout(() => {
          setIsVisible(false);
          // Schedule the next woof
          scheduleNextWoof();
        }, 2000);
      }, randomDelay);
    };

    const timerId = scheduleNextWoof();
    return () => clearTimeout(timerId);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="absolute -top-16 -right-8 animate-bounce-small">
      <img
        src="/sprites/woof.png"
        alt="Woof!"
        className="w-16 h-16 object-contain animate-pop-in"
      />
    </div>
  );
} 