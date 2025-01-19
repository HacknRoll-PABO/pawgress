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

export const GameContext = createContext(null);

function useCoins() {
  const [coins, setCoins] = useState(() => {
    try {
      const saved = localStorage.getItem('coins');
      return saved ? Number(saved) : INITIAL_COINS;
    } catch {
      return INITIAL_COINS;
    }
  });

  useEffect(() => {
    localStorage.setItem('coins', coins.toString());
  }, [coins]);

  return [coins, setCoins];
}

export default function App() {
  const [coins, setCoins] = useCoins();

  const handlePurchase = (item) => {
    if (!item?.price) return;
    setCoins((prev) => Math.max(0, prev - item.price));
  };

  const handleLevelUp = () => {
    setCoins((prev) => prev + LEVEL_UP_REWARD);
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
}
