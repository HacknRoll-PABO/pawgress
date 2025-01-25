import { memo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, SidebarBody } from './ui/sidebar';
import { Bars3Icon as MenuIcon, XMarkIcon } from '@heroicons/react/24/outline';

function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-neutral-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md hover:bg-neutral-50"
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMobileMenuOpen ? (
          <XMarkIcon className="w-6 h-6 text-neutral-600" />
        ) : (
          <MenuIcon className="w-6 h-6 text-neutral-600" />
        )}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar>
          <SidebarBody onNavigate={() => setIsMobileMenuOpen(false)} />
        </Sidebar>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <main 
        className="flex-1 overflow-auto p-4 pt-16 lg:pt-4"
        role="main"
        aria-label="Main content"
      >
        <Outlet />
      </main>
    </div>
  );
}

export default memo(Layout); 