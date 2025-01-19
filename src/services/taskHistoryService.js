// Task history management service

const STORAGE_KEY = 'taskHistory';

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

function dispatchHistoryUpdate(date, history) {
  window.dispatchEvent(new CustomEvent('taskHistoryUpdate', {
    detail: { date, history }
  }));
}

// Get task completion history from localStorage
export function getTaskHistory() {
  try {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (!savedHistory) return {};
    
    const parsedHistory = JSON.parse(savedHistory);
    
    // Convert legacy array format to object format
    if (Array.isArray(parsedHistory)) {
      return parsedHistory.reduce((acc, { date, value }) => {
        acc[date] = Number(value) || 0;
        return acc;
      }, {});
    }
    
    // Ensure all values are numbers
    return Object.entries(parsedHistory).reduce((acc, [date, value]) => {
      acc[date] = Number(value) || 0;
      return acc;
    }, {});
  } catch (error) {
    console.error('Failed to parse task history:', error);
    return {};
  }
}

// Convert object format to array format for calendar
export function getTaskHistoryArray() {
  const history = getTaskHistory();
  return Object.entries(history).map(([date, value]) => ({
    date,
    value: Number(value)
  }));
}

// Add completed task to history
export function addTaskToHistory() {
  try {
    const history = getTaskHistory();
    const today = getTodayString();
    
    history[today] = (history[today] || 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    
    dispatchHistoryUpdate(today, history);
    return history;
  } catch (error) {
    console.error('Failed to update task history:', error);
    return {};
  }
} 