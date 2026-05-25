
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';


export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row h-screen min-h-screen w-full overflow-hidden" style={{ background: 'oklch(0.985 0.004 286)' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 w-full">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center gap-2 px-2 py-2 bg-white shrink-0 w-full"
          style={{ borderBottom: '1px solid #e2e8f0' }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-slate-600 hover:bg-emerald-50 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            {/* Logo removed due to missing asset */}
            <span className="font-black text-slate-900 text-lg tracking-tight">NUNO</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto min-w-0 w-full px-1 sm:px-2 md:px-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

