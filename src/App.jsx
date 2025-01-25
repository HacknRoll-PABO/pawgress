import { useState, useEffect, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Tasks from './components/Tasks';
import Pet from './components/Pet';
import Shop from './components/Shop';
import Dashboard from './components/Dashboard';

const INITIAL_COINS = 100;
const LEVEL_UP_REWARD = 100;

export const GameContext = createContext();

function loadFromStorage(key, defaultValue) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? Number(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
}

const App = () => {
  const [coins, setCoins] = useState(() => loadFromStorage('coins', INITIAL_COINS));

  // Save coins to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('coins', coins.toString());
  }, [coins]);

  const handleLevelUp = () => {
    setCoins(prevCoins => prevCoins + LEVEL_UP_REWARD);
  };

  const handlePurchase = (item) => {
    if (!item?.price) return;
    setCoins((prev) => Math.max(0, prev - item.price));
  };

  const contextValue = {
    coins,
    setCoins,
    onPurchase: handlePurchase,
    onLevelUp: handleLevelUp
  };

  return (
    <GameContext.Provider value={contextValue}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="pet" element={<Pet />} />
            <Route path="shop" element={<Shop />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GameContext.Provider>
  );
};

export default App;
