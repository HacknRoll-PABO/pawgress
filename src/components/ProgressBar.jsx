export default function ProgressBar({ xp, level, nextLevelXP }) {
  const progress = ((xp - (level * 100)) / 100) * 100;

  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-neutral-600">Level {level}</span>
        <span className="text-sm text-neutral-500">{xp} / {nextLevelXP} XP</span>
      </div>
      <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
} 