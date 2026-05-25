
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Receipt, Users, Settings,
  LogOut, X, Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';


const NAV = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/invoices',  icon: FileText,        label: 'Invoices'   },
  { to: '/receipts',  icon: Receipt,         label: 'Receipts'   },
  { to: '/clients',   icon: Users,           label: 'Clients'    },
  { to: '/settings',  icon: Settings,        label: 'Settings'   },
];

export default function Sidebar({ open, onClose }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-4/5 max-w-xs min-w-[200px] flex flex-col z-30 bg-white transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex lg:w-64 lg:min-w-0`}
        style={{ maxWidth: 320 }}
      >
        {/* Animated N Logo and Name */}
        <div className="flex items-center gap-2 px-3 py-4 border-b border-slate-200">
          <span className="text-4xl font-black text-emerald-600 animate-nuno-logo select-none" style={{fontFamily: 'monospace', letterSpacing: '-0.1em'}}>
            N
          </span>
          <div className="flex flex-col leading-none">
            <span className="text-slate-900 font-black text-2xl tracking-tight">NUNO</span>
            <span className="text-slate-400 text-[10px] font-medium tracking-widest uppercase mt-0.5">Invoice</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-1.5 py-3 space-y-0.5 overflow-y-auto scrollbar-hide">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => window.innerWidth < 1024 && onClose()}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={16} className="shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="px-3 py-4" style={{ borderTop: '1px solid #e2e8f0' }}>
          <div className="flex items-center gap-3 px-2 py-2.5 mb-1 rounded-xl">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}
            >
              {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-slate-900 text-sm font-semibold truncate leading-tight">{currentUser?.name}</p>
              <p className="text-slate-400 text-xs truncate mt-0.5">{currentUser?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 text-sm
                       hover:bg-slate-100 hover:text-slate-700 transition-all duration-150"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

