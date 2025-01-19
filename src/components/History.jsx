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

const calendarStyles = `
  .ch-container:nth-of-type(2) {
    display: none;
  }
`;

export default function Dashboard() {
  const calendarRef = useRef(null);
  const cal = useRef(null);
  const [dailyStats, setDailyStats] = useState({
    tasksCompleted: 0,
    streakDays: 0,
    totalCoins: 0,
    petHealth: 0
  });

  // Calculate daily stats function
  const calculateDailyStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const taskHistory = getTaskHistory();
    const todaysTasks = taskHistory[today] || 0;

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

    // Get total coins and pet health
    const coins = parseInt(localStorage.getItem('coins') || '0', 10);
    const petHealth = parseInt(localStorage.getItem('petHealth') || '0', 10);

    setDailyStats({
      tasksCompleted: todaysTasks,
      streakDays: streak,
      totalCoins: coins,
      petHealth: petHealth
    });
  };

  // Initial calculation
  useEffect(() => {
    calculateDailyStats();
  }, []);

  // Listen for localStorage changes
  useEffect(() => {
    // Function to handle storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'taskHistory' || e.key === 'coins' || e.key === 'petHealth') {
        calculateDailyStats();
      }
    };

    // Function to handle task history updates
    const handleTaskHistoryUpdate = () => {
      calculateDailyStats();
    };

    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('taskHistoryUpdate', handleTaskHistoryUpdate);

    // Set up interval to check for updates (as backup)
    const interval = setInterval(calculateDailyStats, 5000);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('taskHistoryUpdate', handleTaskHistoryUpdate);
      clearInterval(interval);
    };
  }, []);

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all task history? This cannot be undone.')) {
      localStorage.removeItem('taskHistory');
      window.location.reload();
    }
  };

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = calendarStyles;
    document.head.appendChild(styleSheet);

    if (cal.current) {
      cal.current.destroy();
    }

    const taskHistory = getTaskHistoryArray();
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
        source: taskHistory,
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
      if (cal.current) {
        cal.current.destroy();
      }
      document.head.removeChild(styleSheet);
    };
  }, []);

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
          <div className="bg-amber-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <TrophyIcon className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-amber-600 font-medium">Today's Tasks</p>
                <p className="text-2xl font-bold text-amber-700">{dailyStats.tasksCompleted}</p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <ClockIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-emerald-600 font-medium">Current Streak</p>
                <p className="text-2xl font-bold text-emerald-700">{dailyStats.streakDays} days</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ChartBarIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Coins</p>
                <p className="text-2xl font-bold text-blue-700">{dailyStats.totalCoins}</p>
              </div>
            </div>
          </div>

          <div className="bg-rose-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-100 rounded-lg">
                <HeartIcon className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <p className="text-sm text-rose-600 font-medium">Pet Health</p>
                <p className="text-2xl font-bold text-rose-700">{dailyStats.petHealth}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-700 mb-4">
              Task Completion Heatmap
            </h2>
            <div id="calendar" ref={calendarRef} style={{ minHeight: '200px' }} />
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-neutral-600">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-[#ebedf0] border border-neutral-200" title="0 tasks"></div>
                <div className="w-3 h-3 bg-[#9be9a8]" title="1-2 tasks"></div>
                <div className="w-3 h-3 bg-[#40c463]" title="3-4 tasks"></div>
                <div className="w-3 h-3 bg-[#30a14e]" title="5-6 tasks"></div>
                <div className="w-3 h-3 bg-[#216e39]" title="7+ tasks"></div>
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 