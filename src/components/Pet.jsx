import { useState, useEffect, useRef } from 'react';
import { PlayIcon, PauseIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';
import HealthBar from './HealthBar';
import CircularHealthBar from './CircularHealthBar';
import DraggableItem from './DraggableItem';
import WoofBubble from './WoofBubble';
import { getInventory, removeFromInventory } from '../services/inventoryService';

// Import all sprite frames
const sitFrames = [
  '/sprites/sit1.png',
  '/sprites/sit2.png',
  '/sprites/sit3.png',
  '/sprites/sit4.png',
  '/sprites/sit5.png',
  '/sprites/sit6.png',
];

const jumpFrames = [
  '/sprites/jump1.png',
  '/sprites/jump2.png',
  '/sprites/jump3.png',
  '/sprites/jump4.png',
  '/sprites/jump5.png',
  '/sprites/jump6.png',
  '/sprites/jump7.png',
  '/sprites/jump8.png',
  '/sprites/jump9.png',
  '/sprites/jump10.png',
  '/sprites/jump11.png',
];

const sniffFrames = [
  '/sprites/sniff1.png',
  '/sprites/sniff2.png',
  '/sprites/sniff3.png',
  '/sprites/sniff5.png',
  '/sprites/sniff6.png',
  '/sprites/sniff7.png',
  '/sprites/sniff8.png',
];

const sadFrames = [
  '/sprites/sad1.png'
];

// Animation constants
const HEALTH_THRESHOLD = 30;
const SNIFF_INTERVAL = 8000;
const HEALTH_DECREASE_INTERVAL = 10000;

// Background options
const backgrounds = {
  GRASS: '/background/grass1.jpg',
  PARK: '/background/park1.jpg',
  HOME: '/background/home1.jpg',
};

export default function Pet({ coins, setCoins }) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isJumping, setIsJumping] = useState(false);
  const [isSniffing, setIsSniffing] = useState(false);
  const [health, setHealth] = useState(() => {
    const savedHealth = localStorage.getItem('petHealth');
    return savedHealth ? parseInt(savedHealth, 10) : 80;
  });
  const [items, setItems] = useState(() => getInventory());
  const [currentBackground, setCurrentBackground] = useState(backgrounds.GRASS);
  const [isDragOver, setIsDragOver] = useState(false);
  const animationRef = useRef();
  const [petName, setPetName] = useState('');

  const MAX_HEALTH = 100;

  // Save health to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('petHealth', health.toString());
  }, [health]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    let lastTime = 0;
    const fps = isJumping ? 12 : 8;
    const frameInterval = 1000 / fps;
    
    // Determine which animation to use
    let currentAnimation;
    if (health < HEALTH_THRESHOLD) {
      currentAnimation = sadFrames;
    } else if (isJumping) {
      currentAnimation = jumpFrames;
    } else if (isSniffing) {
      currentAnimation = sniffFrames;
    } else {
      currentAnimation = sitFrames;
    }

    const animate = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const elapsed = timestamp - lastTime;

      if (elapsed > frameInterval) {
        setCurrentFrame((prev) => {
          // Don't cycle frames for sad animation
          if (health < HEALTH_THRESHOLD) return 0;
          
          const nextFrame = (prev + 1) % currentAnimation.length;
          // If we complete a jump or sniff animation cycle
          if ((isJumping || isSniffing) && nextFrame === 0) {
            if (isJumping) {
              setIsJumping(false);
            } else if (isSniffing) {
              setIsSniffing(false);
            }
          }
          return nextFrame;
        });
        lastTime = timestamp;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, isJumping, isSniffing, health]);

  // Alternate between sit and sniff animations
  useEffect(() => {
    if (!isPlaying || isJumping || health < HEALTH_THRESHOLD) return;

    const startSniffing = () => {
      if (!isJumping) {
        setIsSniffing(true);
        setCurrentFrame(0);
      }
    };

    const interval = setInterval(startSniffing, SNIFF_INTERVAL);
    return () => clearInterval(interval);
  }, [isPlaying, isJumping, health]);

  const toggleAnimation = () => {
    setIsPlaying(!isPlaying);
  };

  const handleUseItem = (item) => {
    // Remove item from inventory
    const updatedInventory = removeFromInventory(item.id);
    setItems(updatedInventory);

    // Start jump animation when feeding
    if (item.type === 'food') {
      setIsJumping(true);
      setCurrentFrame(0); // Reset frame to start of jump animation
    }

    // Apply item effects
    switch (item.type) {
      case 'food':
        setHealth(prev => Math.min(prev + 20, MAX_HEALTH));
        break;
      case 'toy':
        setHealth(prev => Math.min(prev + 10, MAX_HEALTH));
        break;
      case 'medicine':
        setHealth(prev => Math.min(prev + 50, MAX_HEALTH));
        break;
      default:
        break;
    }
  };

  const changeBackground = (background) => {
    setCurrentBackground(background);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const item = JSON.parse(e.dataTransfer.getData('application/json'));
      if (item && item.quantity > 0) {
        handleUseItem(item);
      }
    } catch (error) {
      console.error('Error processing dropped item:', error);
    }
  };

  // Simulate health decrease over time
  useEffect(() => {
    const interval = setInterval(() => {
      setHealth(prev => Math.max(prev - 1, 0));
    }, 10000); // Decrease health by 1 every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Refresh items from inventory when component mounts or items change
  useEffect(() => {
    setItems(getInventory());
  }, []);

  useEffect(() => {
    const savedPetName = localStorage.getItem('petName');
    if (savedPetName) {
      setPetName(savedPetName);
    }
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-4 max-w-7xl mx-auto p-4 h-[calc(100vh-2rem)] min-h-[600px]">
      {/* Main Content */}
      <div className="flex-grow space-y-4 min-h-0 flex flex-col">
        {/* Pet Display Card */}
        <div className="bg-white rounded-lg shadow-lg p-4 flex-grow flex flex-col min-h-0">
          {/* Header - Hidden on mobile */}
          <div className="hidden sm:flex flex-col sm:flex-row justify-between items-center gap-3 mb-3">
            <h2 className="text-xl font-bold text-neutral-800">
              {petName ? `Meet ${petName}!` : 'Your Virtual Pet'}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {/* Coins display */}
              <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-md">
                <CurrencyDollarIcon className="w-5 h-5 text-amber-500" />
                <span className="font-medium text-amber-700">{coins}</span>
              </div>
              
              {/* Background selector */}
              <div className="flex gap-1">
                <button
                  onClick={() => changeBackground(backgrounds.GRASS)}
                  className={`w-6 h-6 rounded-full bg-green-100 border-2 transition-all ${
                    currentBackground === backgrounds.GRASS ? 'border-green-500 scale-110' : 'border-transparent'
                  }`}
                  title="Grass Background"
                />
                <button
                  onClick={() => changeBackground(backgrounds.PARK)}
                  className={`w-6 h-6 rounded-full bg-blue-100 border-2 transition-all ${
                    currentBackground === backgrounds.PARK ? 'border-blue-500 scale-110' : 'border-transparent'
                  }`}
                  title="Park Background"
                />
                <button
                  onClick={() => changeBackground(backgrounds.HOME)}
                  className={`w-6 h-6 rounded-full bg-yellow-100 border-2 transition-all ${
                    currentBackground === backgrounds.HOME ? 'border-yellow-500 scale-110' : 'border-transparent'
                  }`}
                  title="Home Background"
                />
              </div>
              <button
                onClick={toggleAnimation}
                className="btn btn-primary"
              >
                {isPlaying ? (
                  <PauseIcon className="w-4 h-4" />
                ) : (
                  <PlayIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="sm:hidden flex justify-end mb-2">
            <button
              onClick={toggleAnimation}
              className="btn btn-primary"
            >
              {isPlaying ? (
                <PauseIcon className="w-4 h-4" />
              ) : (
                <PlayIcon className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Pet Display Area */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              flex-grow min-h-0 rounded-lg flex items-center justify-center overflow-hidden relative bg-neutral-50
              transition-all duration-300 ease-in-out
              ${isDragOver ? 'ring-4 ring-emerald-400 ring-opacity-50 scale-[1.02]' : ''}
            `}
            style={{
              backgroundImage: `${window.innerWidth > 640 ? `url(${currentBackground})` : 'none'}`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Drop zone hint */}
            <div className={`
              absolute inset-0 bg-emerald-500 bg-opacity-0 flex items-center justify-center
              transition-all duration-300 ease-in-out
              ${isDragOver ? 'bg-opacity-10' : ''}
            `}>
              <div className={`
                bg-white bg-opacity-90 px-4 py-2 rounded-full text-sm font-medium text-emerald-600
                transition-all duration-300 ease-in-out transform
                ${isDragOver ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
              `}>
                Drop item here to use
              </div>
            </div>

            {/* Platform shadow */}
            <div className="absolute hidden sm:block bottom-6 w-32 h-8 bg-black/10 rounded-full blur-sm" />
            
            {/* Pet sprite */}
            <div className={`
              relative transform transition-all duration-200 ease-in-out
              ${isJumping ? '-translate-y-4 sm:translate-y-20' : 'translate-y-0 sm:translate-y-28'}
            `}>
              <WoofBubble />
              <img
                src={
                  health < HEALTH_THRESHOLD
                    ? sadFrames[0]
                    : isJumping 
                      ? jumpFrames[currentFrame] 
                      : isSniffing 
                        ? sniffFrames[currentFrame] 
                        : sitFrames[currentFrame]
                }
                alt="Pet animation frame"
                className="w-auto h-auto max-w-full max-h-full object-contain image-rendering-pixelated scale-[3] sm:scale-[4] transition-transform duration-200"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
          </div>
        </div>

        {/* Pet Stats Card */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Health Section */}
            <div>
              <h3 className="text-base font-semibold text-neutral-700 mb-2">Pet Health</h3>
              <div className="sm:block hidden">
                <HealthBar health={health} maxHealth={MAX_HEALTH} />
              </div>
              <div className="sm:hidden block">
                <CircularHealthBar health={health} maxHealth={MAX_HEALTH} />
              </div>
            </div>

            {/* Status Section */}
            <div>
              <h3 className="text-base font-semibold text-neutral-700 mb-2">Status</h3>
              <div className="space-y-1">
                <div className="text-sm text-neutral-600">
                  Mood: {health > 80 ? 'Happy! 😊' : health > 50 ? 'Content 😌' : health > 20 ? 'Hungry 😕' : 'Sad 😢'}
                </div>
                <div className="text-sm text-neutral-600">
                  Animation: {isPlaying ? 'Playing' : 'Paused'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side Panel - Items */}
      <div className="lg:w-72 flex-shrink-0 bg-white rounded-lg shadow-lg p-4 overflow-hidden flex flex-col min-h-0">
        <h2 className="text-lg font-bold text-neutral-800 mb-2">Your Items</h2>
        <p className="text-xs text-neutral-600 mb-4 hidden sm:block">
          Drag items onto your pet to use them
        </p>
        <div className="overflow-y-auto flex-grow">
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id}>
                {/* Desktop: Draggable Item */}
                <div className="hidden sm:block">
                  <DraggableItem item={item} />
                </div>
                {/* Mobile: Button Item */}
                <div className="sm:hidden bg-white rounded-lg p-3 border border-neutral-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {item.type === 'food' ? '🦴' : item.type === 'toy' ? '🎾' : '💊'}
                      </div>
                      <div>
                        <h3 className="font-medium text-neutral-800">{item.name}</h3>
                        <p className="text-sm text-neutral-600">
                          {item.type === 'food' ? '+20 HP' : item.type === 'toy' ? '+10 HP' : '+50 HP'}
                        </p>
                        <p className="text-xs text-neutral-500">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUseItem(item)}
                      disabled={item.quantity === 0}
                      className={`px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-600 font-medium text-sm
                        ${item.quantity === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-100 active:bg-emerald-200'}`}
                    >
                      Use
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 