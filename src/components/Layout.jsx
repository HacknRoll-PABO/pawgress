import { memo } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, SidebarBody } from './ui/sidebar';

function Layout() {
  return (
    <div className="flex h-screen w-full bg-neutral-50">
      <Sidebar>
        <SidebarBody />
      </Sidebar>
      <main 
        className="flex-1 overflow-auto p-4"
        role="main"
        aria-label="Main content"
      >
        <Outlet />
      </main>
    </div>
  );
}

export default memo(Layout); 