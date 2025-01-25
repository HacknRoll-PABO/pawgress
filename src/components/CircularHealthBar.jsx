import React from 'react';

export default function CircularHealthBar({ health, maxHealth }) {
  const percentage = (health / maxHealth) * 100;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine color based on health percentage
  const getColor = () => {
    if (percentage > 80) return '#22c55e'; // green-500
    if (percentage > 50) return '#0ea5e9'; // sky-500
    if (percentage > 20) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-24 h-24">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          {/* Health indicator */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke={getColor()}
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
              transition: 'stroke-dashoffset 0.5s ease'
            }}
          />
        </svg>
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold" style={{ color: getColor() }}>
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
    </div>
  );
} 