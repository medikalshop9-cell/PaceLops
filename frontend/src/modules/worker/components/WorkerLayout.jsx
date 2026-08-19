import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useWorkerStore } from '../store/useWorkerStore'
import { useThemeStore } from '../store/useThemeStore'
import {
  LayoutGrid, Package, ScanLine, ClipboardList, Plus,
  ChevronDown, LogOut, Bell, Building2, Sun, Moon
} from 'lucide-react'
import logoMark from '@/assets/images/parcelops_logo_mark.png'

export function WorkerLayout() {
  const navigate = useNavigate()
  const { activeBranch, setActiveBranch } = useWorkerStore()
  const { isDark, toggleTheme } = useThemeStore()
  const [branchOpen, setBranchOpen] = useState(false)

  const branches = ['Accra Main Hub', 'Kumasi Central Hub', 'Tema Regional Office']

  const navItems = [
    { name: 'Overview', path: '/worker/dashboard', icon: LayoutGrid },
    { name: 'Parcel Registry', path: '/worker/parcels', icon: Package },
    { name: 'Scan & Dispatch', path: '/worker/search', icon: ScanLine },
    { name: 'Scan Logs', path: '/worker/scan-logs', icon: ClipboardList },
  ]

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDark
          ? 'bg-[#0a0f1a] text-slate-100'
          : 'bg-[#f8f9fb] text-slate-900'
      }`}
      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >

      {/* ─── Top Navigation Bar ─── */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${
          isDark
            ? 'bg-[#0d1324]/90 border-slate-800/60'
            : 'bg-white/80 border-slate-200/60'
        }`}
        style={{ boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <div className="max-w-[1440px] mx-auto px-5">
          <div className="flex items-center justify-between h-[56px]">

            {/* Left: Logo + Nav */}
            <div className="flex items-center gap-8">
              <Link to="/worker/dashboard" className="flex items-center gap-2.5 group">
                <img src={logoMark} alt="PaceLops" className="w-8 h-8 object-contain" />
                <span className={`text-[15px] font-semibold tracking-[-0.01em] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  PaceLops
                </span>
                <span className={`text-[10px] font-medium px-1.5 py-px rounded tracking-wide uppercase ${
                  isDark ? 'text-emerald-400 bg-emerald-500/10' : 'text-indigo-600 bg-indigo-50'
                }`}>
                  ops
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-0.5">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 px-3 py-[7px] text-[13px] font-medium rounded-lg transition-all duration-150 ${
                        isActive
                          ? isDark
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : 'text-indigo-700 bg-indigo-50/80'
                          : isDark
                            ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                      }`
                    }
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">

              {/* Dark/Light Mode Toggle */}
              <button
                onClick={toggleTheme}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                  isDark
                    ? 'text-amber-400 hover:bg-slate-800'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Branch Selector */}
              <div className="relative">
                <button
                  onClick={() => setBranchOpen(!branchOpen)}
                  className={`flex items-center gap-2 h-8 px-3 text-[12px] font-medium border rounded-lg transition-colors ${
                    isDark
                      ? 'text-slate-300 bg-slate-800/50 hover:bg-slate-800 border-slate-700/80'
                      : 'text-slate-600 bg-slate-50 hover:bg-slate-100 border-slate-200/80'
                  }`}
                >
                  <Building2 className={`w-3.5 h-3.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <span className="hidden sm:inline max-w-[140px] truncate">{activeBranch}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isDark ? 'text-slate-500' : 'text-slate-400'} ${branchOpen ? 'rotate-180' : ''}`} />
                </button>
                {branchOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setBranchOpen(false)} />
                    <div className={`absolute right-0 top-full mt-1.5 w-52 border rounded-xl shadow-lg z-50 py-1 ${
                      isDark
                        ? 'bg-slate-900 border-slate-700 shadow-black/40'
                        : 'bg-white border-slate-200 shadow-slate-200/50'
                    }`}>
                      {branches.map((b) => (
                        <button
                          key={b}
                          onClick={() => { setActiveBranch(b); setBranchOpen(false) }}
                          className={`w-full text-left px-3.5 py-2 text-[12px] font-medium transition-colors ${
                            activeBranch === b
                              ? isDark ? 'text-emerald-400 bg-emerald-500/10' : 'text-indigo-700 bg-indigo-50'
                              : isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Notification Bell */}
              <button className={`relative w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                isDark
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}>
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
              </button>

              {/* New Shipment */}
              <button
                onClick={() => navigate('/worker/create-shipment')}
                className="h-8 px-3 flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-semibold rounded-lg transition-colors shadow-sm shadow-emerald-900/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Shipment</span>
              </button>

              {/* Logout */}
              <button
                onClick={() => navigate('/')}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                  isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Page Content ─── */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <Outlet />
      </main>
    </div>
  )
}
