import { useEffect, useRef, useState } from 'react';
import CalHeatmap from 'cal-heatmap';
import 'cal-heatmap/cal-heatmap.css';
import { getTaskHistory, getTaskHistoryArray } from '../services/taskHistoryService';
import { 
  TrophyIcon, 
  ClockIcon, 
  ChartBarIcon, 
  HeartIcon 
} from '@heroicons/react/24/outline';

// Hide duplicate calendar container
const calendarStyles = `.ch-container:nth-of-type(2) { display: none; }`;

export default function Dashboard() {
  const cal = useRef(null);
  const [dailyStats, setDailyStats] = useState({
    tasksCompleted: 0,
    streakDays: 0,
    totalCoins: 0,
    petHealth: 0
  });

  const calculateDailyStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const taskHistory = getTaskHistory();
    
    // Calculate streak
    let streak = 0;
    let currentDate = new Date();
    while (true) {
      const dateKey = currentDate.toISOString().split('T')[0];
      if (taskHistory[dateKey]) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    setDailyStats({
      tasksCompleted: taskHistory[today] || 0,
      streakDays: streak,
      totalCoins: parseInt(localStorage.getItem('coins') || '0', 10),
      petHealth: parseInt(localStorage.getItem('petHealth') || '0', 10)
    });
  };

  // Update stats when data changes
  useEffect(() => {
    calculateDailyStats();

    const handleDataUpdate = () => calculateDailyStats();
    window.addEventListener('taskHistoryUpdate', handleDataUpdate);
    window.addEventListener('storage', (e) => {
      if (['taskHistory', 'coins', 'petHealth'].includes(e.key)) {
        handleDataUpdate();
      }
    });

    const interval = setInterval(handleDataUpdate, 5000);
    return () => {
      window.removeEventListener('taskHistoryUpdate', handleDataUpdate);
      window.removeEventListener('storage', handleDataUpdate);
      clearInterval(interval);
    };
  }, []);

  // Initialize heatmap
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = calendarStyles;
    document.head.appendChild(styleSheet);

    cal.current?.destroy();
    cal.current = new CalHeatmap();
    cal.current.paint({
      itemSelector: '#calendar',
      range: 12,
      domain: {
        type: 'month',
        gutter: 10
      },
      subDomain: {
        type: 'day',
        width: 10,
        height: 10,
        radius: 2
      },
      data: {
        source: getTaskHistoryArray(),
        x: 'date',
        y: 'value'
      },
      scale: {
        color: {
          type: 'threshold',
          range: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
          domain: [0, 1, 3, 5, 7]
        }
      }
    });

    return () => {
      cal.current?.destroy();
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all task history? This cannot be undone.')) {
      localStorage.removeItem('taskHistory');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-neutral-800">Dashboard</h1>
          <button
            onClick={handleClearHistory}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Clear History
          </button>
        </div>

        {/* Daily Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            color="amber"
            icon={TrophyIcon}
            label="Today's Tasks"
            value={dailyStats.tasksCompleted}
          />
          <StatCard
            color="emerald"
            icon={ClockIcon}
            label="Current Streak"
            value={`${dailyStats.streakDays} days`}
          />
          <StatCard
            color="blue"
            icon={ChartBarIcon}
            label="Total Coins"
            value={dailyStats.totalCoins}
          />
          <StatCard
            color="rose"
            icon={HeartIcon}
            label="Pet Health"
            value={`${dailyStats.petHealth}%`}
          />
        </div>

        {/* Heatmap - Hidden on mobile */}
        <div className="hidden sm:block bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-700 mb-4">
            Task Completion Heatmap
          </h2>
          <div id="calendar" style={{ minHeight: '200px' }} />
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-neutral-600">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-[#ebedf0] border border-neutral-200" title="0 tasks" />
              <div className="w-3 h-3 bg-[#9be9a8]" title="1-2 tasks" />
              <div className="w-3 h-3 bg-[#40c463]" title="3-4 tasks" />
              <div className="w-3 h-3 bg-[#30a14e]" title="5-6 tasks" />
              <div className="w-3 h-3 bg-[#216e39]" title="7+ tasks" />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable stat card component
function StatCard({ color, icon: Icon, label, value }) {
  return (
    <div className={`bg-${color}-50 rounded-xl p-4`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 bg-${color}-100 rounded-lg`}>
          <Icon className={`w-5 h-5 text-${color}-600`} />
        </div>
        <div>
          <p className={`text-sm text-${color}-600 font-medium`}>{label}</p>
          <p className={`text-2xl font-bold text-${color}-700`}>{value}</p>
        </div>
      </div>
    </div>
  );
} 