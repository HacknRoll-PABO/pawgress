import { useState, useEffect, useContext, memo } from 'react';
import { PlusIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import SubjectCard from './SubjectCard';
import ProgressBar from './ProgressBar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { SUBJECT_COLORS } from '../constants/colors';
import { GameContext } from '../App';

const DIFFICULTY_LEVELS = {
  LOW: { label: 'Low', xp: 10, color: 'bg-green-100 text-green-700' },
  MEDIUM: { label: 'Medium', xp: 20, color: 'bg-yellow-100 text-yellow-700' },
  HIGH: { label: 'High', xp: 30, color: 'bg-red-100 text-red-700' },
};

const LEVEL_UP_DURATION = 3000;
const XP_PER_LEVEL = 100;

function loadFromStorage(key, defaultValue) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function calculateLevel(xp) {
  const level = Math.floor(xp / XP_PER_LEVEL);
  return {
    level,
    nextLevelXP: (level + 1) * XP_PER_LEVEL,
  };
}

const SubjectForm = memo(function SubjectForm({ onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('amber');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    onSubmit({
      id: Date.now(),
      title: trimmedTitle,
      color,
      tasks: [],
    });
    setTitle('');
    setColor('amber');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mb-8">
      <div className="flex gap-2">
        <motion.div className="relative flex-1">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter subject name..."
            className="w-full rounded-md border-neutral-200 focus:border-amber-500 focus:ring-0 focus:outline-none relative z-10"
            autoFocus
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileFocus={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 -m-0.5 rounded-lg bg-amber-500/20 blur-sm"
          />
        </motion.div>
        <Button type="submit">Add</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      <div className="flex gap-2 items-center">
        <span className="text-sm text-neutral-500">Choose color:</span>
        <div className="flex gap-2">
          {SUBJECT_COLORS.map((colorOption) => (
            <button
              key={colorOption.name}
              type="button"
              onClick={() => setColor(colorOption.name)}
              className={`w-6 h-6 rounded-full transition-transform ${colorOption.class} ${
                color === colorOption.name ? 'scale-125 ring-2 ring-offset-2 ring-neutral-300' : ''
              } hover:scale-110`}
            />
          ))}
        </div>
      </div>
    </form>
  );
});

const LevelUpNotification = memo(function LevelUpNotification() {
  return (
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg shadow-md animate-bounce">
      Level Up! +100 Coins
    </div>
  );
});

function Tasks() {
  const { coins, setCoins, onLevelUp } = useContext(GameContext);
  const [subjects, setSubjects] = useState(() => loadFromStorage('subjects', []));
  const [isAdding, setIsAdding] = useState(false);
  const [xp, setXP] = useState(() => loadFromStorage('xpData', { xp: 0, level: 0 }).xp);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [lastCheckedLevel, setLastCheckedLevel] = useState(() => calculateLevel(loadFromStorage('xpData', { xp: 0, level: 0 }).xp).level);

  const { level, nextLevelXP } = calculateLevel(xp);

  // Persist subjects
  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);

  // Persist XP data
  useEffect(() => {
    localStorage.setItem('xpData', JSON.stringify({ xp, level }));
  }, [xp, level]);

  // Handle level up - only triggers once per level
  useEffect(() => {
    if (level > lastCheckedLevel) {
      onLevelUp();
      setShowLevelUp(true);
      const timeout = setTimeout(() => setShowLevelUp(false), LEVEL_UP_DURATION);
      setLastCheckedLevel(level);
      return () => clearTimeout(timeout);
    }
  }, [level, lastCheckedLevel, onLevelUp]);

  const handleAddSubject = (newSubject) => {
    setSubjects((prev) => [...prev, newSubject]);
    setIsAdding(false);
  };

  const handleUpdateSubject = (updatedSubject, taskCompleted = false, taskDifficulty = 'MEDIUM') => {
    if (taskCompleted) {
      const xpGained = DIFFICULTY_LEVELS[taskDifficulty].xp;
      setXP((currentXP) => currentXP + xpGained);
      // Award coins based on difficulty
      const coinsGained = Math.floor(xpGained / 2); // Or any other formula you prefer
      setCoins(prevCoins => prevCoins + coinsGained);
    }

    setSubjects((prev) =>
      prev.map((subject) =>
        subject.id === updatedSubject.id ? updatedSubject : subject
      )
    );
  };

  const handleDeleteSubject = (id) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-neutral-800">Your Tasks</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-md">
            <CurrencyDollarIcon className="w-5 h-5 text-amber-600" />
            <span className="font-medium text-amber-700">{coins}</span>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-amber-200 bg-amber-50 text-amber-600 text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md"
          >
            <PlusIcon className="w-5 h-5" />
            Add Subject
          </button>
        </div>
      </div>

      <ProgressBar xp={xp} level={level} nextLevelXP={nextLevelXP} />

      {showLevelUp && <LevelUpNotification />}

      {isAdding && (
        <SubjectForm 
          onSubmit={handleAddSubject}
          onCancel={() => setIsAdding(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-neutral-500">Add a subject to get started...</p>
          </div>
        ) : (
          subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onUpdate={handleUpdateSubject}
              onDelete={handleDeleteSubject}
              difficultyLevels={DIFFICULTY_LEVELS}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default memo(Tasks);
