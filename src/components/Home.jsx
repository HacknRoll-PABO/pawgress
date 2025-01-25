import { memo, useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { Highlight } from './ui/hero-highlight';
import { Input } from './ui/input';
import { AuroraBackground } from './ui/aurora-background';

const SPRITE_FRAMES = [
  '/sprites/sit1.png',
  '/sprites/sit2.png',
  '/sprites/sit3.png',
  '/sprites/sit4.png',
  '/sprites/sit5.png',
  '/sprites/sit6.png',
];

const ANIMATION_FPS = 8;
const ANIMATION_INTERVAL = 1000 / ANIMATION_FPS;

const DemoTask = memo(function DemoTask() {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsChecked(true);
      const timeout = setTimeout(() => setIsChecked(false), 2000);
      return () => clearTimeout(timeout);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      layout
      className="flex items-center gap-2 p-2 rounded-md bg-neutral-50/50"
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="flex-shrink-0"
      >
        <CheckCircleIcon
          className={`w-5 h-5 transition-colors duration-300 ${
            isChecked ? 'text-green-500 fill-current' : 'text-neutral-400'
          }`}
        />
      </motion.div>
      <span className={`text-sm transition-all duration-300 ${
        isChecked ? 'line-through text-neutral-400' : 'text-neutral-600'
      }`}>
        Complete daily tasks
      </span>
    </motion.div>
  );
});

const PetSprite = memo(function PetSprite() {
  const [currentFrame, setCurrentFrame] = useState(0);
  const animationRef = useRef();

  useEffect(() => {
    let lastTime = 0;

    const animate = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const elapsed = timestamp - lastTime;

      if (elapsed > ANIMATION_INTERVAL) {
        setCurrentFrame((prev) => (prev + 1) % SPRITE_FRAMES.length);
        lastTime = timestamp;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <img
        src={SPRITE_FRAMES[currentFrame]}
        alt="Pet animation"
        className="w-auto h-auto max-w-full max-h-full object-contain scale-[3]"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
});

const PetNameForm = memo(function PetNameForm({ onSubmit, defaultName = '' }) {
  const [petName, setPetName] = useState(defaultName);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = petName.trim();
    if (trimmedName) onSubmit(trimmedName);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-center gap-4">
      <span className="text-neutral-600">Name your pet</span>
      <motion.div className="relative">
        <Input
          type="text"
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="text-center w-48 rounded-md border-neutral-200 focus:border-amber-500 focus:ring-0 focus:outline-none relative z-10"
          maxLength={20}
        />
        <motion.div
          animate={{
            opacity: isFocused ? 1 : 0,
            scale: isFocused ? 1 : 0.95,
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 -m-0.5 rounded-lg bg-amber-500/20 blur-sm"
        />
      </motion.div>
    </form>
  );
});

function FeatureCard({ icon: Icon, iconType = 'heroicon', title, children, delay = 0 }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="card hover:shadow-lg bg-white p-6 rounded-xl"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-amber-100 rounded-lg shrink-0">
          {iconType === 'fontawesome' ? (
            <FontAwesomeIcon icon={Icon} className="h-6 w-6 text-amber-600" />
          ) : (
            <Icon className="h-6 w-6 text-amber-600" />
          )}
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-neutral-800">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

function Home() {
  const [petName, setPetName] = useState('');
  const [isNamed, setIsNamed] = useState(false);

  useEffect(() => {
    const savedPetName = localStorage.getItem('petName');
    if (savedPetName) {
      setPetName(savedPetName);
      setIsNamed(true);
    }
  }, []);

  const handleNameSubmit = (name) => {
    localStorage.setItem('petName', name);
    setPetName(name);
    setIsNamed(true);
  };

  const handleClearName = () => {
    localStorage.removeItem('petName');
    setPetName('');
    setIsNamed(false);
  };

  return (
    <AuroraBackground>
      <div className="relative w-full min-h-screen">
        <div className="flex items-center justify-center py-8 px-4">
          <div className="text-center w-full max-w-6xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center text-4xl sm:text-6xl font-bold text-neutral-800 mb-6 font-['Pecita']"
            >
              <span>P</span>
              <FontAwesomeIcon 
                icon={faPaw} 
                className="mx-2 text-amber-500 transform -rotate-12 h-8 sm:h-12"
              />
              <span>WGRESS</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto mb-12 px-4"
            >
              <Highlight>Your personal task manager with a virtual pet companion.</Highlight>
              {' '}Complete tasks, earn rewards, and watch your pet grow!
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto px-4">
              <FeatureCard 
                icon={CheckCircleIcon}
                title="Task Management"
                delay={0.5}
              >
                <p className="text-sm sm:text-base text-neutral-600 mb-4">
                  Organize your tasks by subject and track your progress. Each completed task earns you XP and coins!
                </p>
                <DemoTask />
              </FeatureCard>

              <FeatureCard 
                icon={faPaw}
                iconType="fontawesome"
                title="Virtual Pet"
                delay={0.7}
              >
                <p className="text-sm sm:text-base text-neutral-600 mb-4">
                  Take care of your virtual pet companion! Use earned coins to buy food, toys, and accessories.
                </p>
                <div className="flex flex-col items-center justify-center">
                  <PetSprite />
                </div>
              </FeatureCard>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="mt-8 sm:mt-16 max-w-md mx-auto px-4"
            >
              {isNamed ? (
                <div className="text-center">
                  <span className="text-neutral-600">
                    Your pet's name: <span className="font-medium text-amber-600">{petName}</span>
                  </span>
                  <button
                    onClick={handleClearName}
                    className="ml-3 text-sm text-neutral-400 hover:text-neutral-600"
                  >
                    (reset)
                  </button>
                </div>
              ) : (
                <PetNameForm onSubmit={handleNameSubmit} />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
}

export default memo(Home); 