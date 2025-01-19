"use client";
import React, { useState, createContext, useContext, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from 'react-router-dom';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PetsRoundedIcon from '@mui/icons-material/PetsRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';

// Navigation items configuration
const NAV_ITEMS = [
  { icon: HomeRoundedIcon, label: 'Home', href: '/' },
  { icon: FormatListBulletedRoundedIcon, label: 'Tasks', href: '/tasks' },
  { icon: PetsRoundedIcon, label: 'Pet', href: '/pet' },
  { icon: StorefrontRoundedIcon, label: 'Shop', href: '/shop' },
  { icon: HistoryRoundedIcon, label: 'Dashboard', href: '/dashboard' },
];

// Health status color mappings
const HEALTH_STATUS_COLORS = {
  HEALTHY: { threshold: 80, classes: 'bg-green-50 text-green-600' },
  GOOD: { threshold: 50, classes: 'bg-blue-50 text-blue-600' },
  WARNING: { threshold: 20, classes: 'bg-amber-50 text-amber-600' },
  CRITICAL: { threshold: 0, classes: 'bg-rose-50 text-rose-600' },
};

// Context for sidebar state management
const SidebarContext = createContext();

const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

// Helper function to get health-based colors
const getHealthStatusColors = (health) => {
  const status = Object.values(HEALTH_STATUS_COLORS).find(
    ({ threshold }) => health > threshold
  );
  return status?.classes || HEALTH_STATUS_COLORS.CRITICAL.classes;
};

// Hook to manage pet health state
const usePetHealth = () => {
  const [health, setHealth] = useState(80);

  useEffect(() => {
    const updateHealth = () => {
      const currentHealth = parseInt(localStorage.getItem('petHealth') || '80', 10);
      setHealth(currentHealth);
    };

    updateHealth();
    const storageHandler = (e) => e.key === 'petHealth' && updateHealth();
    const interval = setInterval(updateHealth, 5000);

    window.addEventListener('storage', storageHandler);
    return () => {
      window.removeEventListener('storage', storageHandler);
      clearInterval(interval);
    };
  }, []);

  return health;
};

// Sidebar provider component
export const Sidebar = ({ children, open: openProp, setOpen: setOpenProp, animate = true }) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;
  const setOpen = setOpenProp || setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Navigation item component
const NavItem = ({ icon: Icon, label, href, isActive, isPet, healthColors }) => {
  const { animate, open } = useSidebar();
  const activeStyles = isPet && isActive ? healthColors : 'bg-amber-50 text-amber-600';
  
  return (
    <Link
      to={href}
      className={`
        flex items-center gap-4 px-4 py-3 rounded-xl
        transition-all duration-200
        ${isActive 
          ? `${activeStyles} shadow-sm` 
          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800'
        }
      `}
    >
      <Icon className={`w-6 h-6 flex-shrink-0 ${isActive ? (isPet ? activeStyles.split(' ')[1] : 'text-amber-500') : ''}`} />
      <motion.span
        animate={{
          opacity: animate ? (open ? 1 : 0) : 1,
          display: animate ? (open ? "block" : "none") : "block",
        }}
        className="font-medium text-sm"
      >
        {label}
      </motion.span>
    </Link>
  );
};

// Main sidebar body component
export const SidebarBody = ({ className, children, ...props }) => {
  const { open, setOpen, animate } = useSidebar();
  const location = useLocation();
  const petHealth = usePetHealth();
  const healthColors = getHealthStatusColors(petHealth);

  return (
    <motion.aside
      className="h-screen py-8 flex flex-col bg-neutral-50 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 w-[280px] flex-shrink-0 shadow-sm rounded-r-2xl"
      animate={{
        width: animate ? (open ? "280px" : "72px") : "280px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {/* Logo Section */}
      <div className="px-6 flex items-center gap-4 mb-10">
        <div className="min-w-[40px] w-10 h-10 flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl shadow-sm flex-shrink-0">
          <PetsRoundedIcon className="text-white h-6 w-6" />
        </div>
        <motion.span
          animate={{
            opacity: animate ? (open ? 1 : 0) : 1,
            display: animate ? (open ? "block" : "none") : "block",
          }}
          className="font-bold text-xl text-neutral-800 dark:text-neutral-200 tracking-wide"
        >
          PAWGRESS
        </motion.span>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-3">
        <div className="space-y-2">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              isActive={location.pathname === item.href}
              isPet={item.href === '/pet'}
              healthColors={healthColors}
            />
          ))}
        </div>
      </nav>
    </motion.aside>
  );
}; 