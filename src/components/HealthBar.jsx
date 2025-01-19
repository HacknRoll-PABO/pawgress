import { HeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';

export default function HealthBar({ health, maxHealth }) {
  const percentage = (health / maxHealth) * 100;
  const hearts = Array.from({ length: maxHealth }, (_, i) => i < health);

  return (
    <div className="space-y-2">
      {/* Hearts display */}
      <div className="flex gap-1 justify-center">
        {hearts.map((filled, index) => (
          filled ? (
            <HeartIcon key={index} className="w-6 h-6 text-red-500" />
          ) : (
            <HeartOutline key={index} className="w-6 h-6 text-red-300" />
          )
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-red-500 transition-all duration-300 ease-out"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: percentage > 50 ? '#ef4444' : percentage > 20 ? '#f97316' : '#dc2626'
          }}
        />
      </div>

      {/* Health text */}
      <div className="text-sm text-neutral-600 text-center">
        {health} / {maxHealth} HP
      </div>
    </div>
  );
} 