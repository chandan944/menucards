// ─── Dashboard Layout (Claymorphism 3D Theme) ──────────────────────────────
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { FullscreenButton } from '@/contexts/FullscreenContext';
import {
  LayoutDashboard, ShoppingBag, Grid3X3, Tag, Palette, QrCode, CreditCard,
  BarChart3, Settings, LogOut, Menu, X, ChevronDown, Store, Bell, Plus, Star,
} from 'lucide-react';
import { clsx } from 'clsx';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/dashboard/products', icon: ShoppingBag, label: 'Products' },
  { to: '/dashboard/categories', icon: Grid3X3, label: 'Categories' },
  { to: '/dashboard/offers', icon: Tag, label: 'Offers' },
  { to: '/dashboard/appearance', icon: Palette, label: 'Appearance' },
  { to: '/dashboard/qr-studio', icon: QrCode, label: 'QR Studio' },
  { to: '/dashboard/card-studio', icon: CreditCard, label: '3D Card Studio' },
  { to: '/dashboard/reviews', icon: Star, label: 'Store Reviews' },
  { to: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-[#eef3f8] overflow-hidden font-sans">
      {/* ─── Desktop Clay Sidebar ─────────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-[270px] flex-col bg-white m-3 mr-0 rounded-[32px] shadow-[10px_16px_28px_-6px_rgba(15,23,42,0.07),-8px_-8px_20px_rgba(255,255,255,0.95)] border border-white/80 z-20">
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-[0_8px_16px_-2px_rgba(37,99,235,0.4),inset_0_2px_4px_rgba(255,255,255,0.4)] flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 tracking-tight block leading-none" style={{ fontFamily: 'Outfit, sans-serif' }}>
                StoreFront
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-blue-600 opacity-90">3D DIGITAL STUDIO</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-5 px-4 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => clsx(
                'flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 select-none',
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_8px_18px_-4px_rgba(37,99,235,0.4),inset_0_2px_4px_rgba(255,255,255,0.4)]'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 hover:shadow-[inset_2px_2px_4px_rgba(148,163,184,0.1)]'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-slate-100/80">
          <div className="flex items-center gap-3 p-2 rounded-2xl bg-slate-50 shadow-[inset_2px_2px_5px_rgba(148,163,184,0.15)] border border-slate-200/60">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold shadow-sm">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.displayName || 'User'}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Mobile Sidebar Overlay ──────────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-3 top-3 bottom-3 w-[270px] bg-white z-50 flex flex-col lg:hidden shadow-2xl rounded-[32px] border border-white/80"
            >
              <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md">
                    <Store className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-black text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>StoreFront</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl hover:bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 py-4 px-4 space-y-1.5">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) => clsx(
                      'flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all',
                      isActive ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── Main Content ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 p-3">
        {/* Top Header Bar */}
        <header className="h-16 bg-white rounded-[24px] shadow-[8px_12px_24px_-6px_rgba(15,23,42,0.06),-6px_-6px_16px_rgba(255,255,255,0.95)] border border-white/80 flex items-center justify-between px-5 shrink-0 mb-4 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-700" />
            </button>
            <h2 className="text-sm font-semibold text-slate-600 hidden sm:block">Welcome back 👋</h2>
          </div>

          <div className="flex items-center gap-3">
            <FullscreenButton className="bg-slate-50 shadow-[3px_3px_8px_rgba(148,163,184,0.15),-3px_-3px_8px_rgba(255,255,255,0.9)] hover:bg-white text-slate-700" />
            
            <button className="p-2.5 rounded-xl bg-slate-50 shadow-[3px_3px_8px_rgba(148,163,184,0.15),-3px_-3px_8px_rgba(255,255,255,0.9)] hover:bg-white text-slate-600 hover:text-slate-900 transition-colors relative">
              <Bell className="w-5 h-5" />
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3.5 rounded-2xl bg-slate-50 shadow-[3px_3px_8px_rgba(148,163,184,0.15),-3px_-3px_8px_rgba(255,255,255,0.9)] hover:bg-white transition-all border border-slate-200/50"
              >
                <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  {user?.displayName?.charAt(0) || '?'}
                </div>
                <span className="text-xs font-bold text-slate-800 hidden sm:block">{user?.displayName || 'User'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 top-14 w-60 bg-white rounded-2xl shadow-[0_20px_40px_-10px_rgba(15,23,42,0.18)] border border-slate-100 py-2 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900 truncate">{user?.displayName}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => { navigate('/dashboard/settings'); setProfileOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <Settings className="w-4 h-4 text-slate-500" /> Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-2 px-1">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
