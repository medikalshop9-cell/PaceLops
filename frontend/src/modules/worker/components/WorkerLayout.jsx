import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useWorkerStore } from '../store/useWorkerStore'
import {
  LayoutGrid, Package, ScanLine, ClipboardList, Plus,
  ChevronDown, LogOut, Bell, Building2
} from 'lucide-react'
import logoMark from '@/assets/images/parcelops_logo_mark.png'

export function WorkerLayout() {
  const navigate = useNavigate()
  const { activeBranch, setActiveBranch } = useWorkerStore()
  const [branchOpen, setBranchOpen] = useState(false)

  const branches = ['Accra Main Hub', 'Kumasi Central Hub', 'Tema Regional Office']

  const navItems = [
    { name: 'Overview', path: '/worker/dashboard', icon: LayoutGrid },
    { name: 'Parcel Registry', path: '/worker/parcels', icon: Package },
    { name: 'Scan & Dispatch', path: '/worker/search', icon: ScanLine },
    { name: 'Scan Logs', path: '/worker/scan-logs', icon: ClipboardList },
  ]

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-slate-900 flex flex-col" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>

      {/* ─── Top Navigation Bar ─── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div className="max-w-[1440px] mx-auto px-5">
          <div className="flex items-center justify-between h-[56px]">

            {/* Left: Logo + Nav */}
            <div className="flex items-center gap-8">
              <Link to="/worker/dashboard" className="flex items-center gap-2.5 group">
                <img src={logoMark} alt="PaceLops" className="w-8 h-8 object-contain" />
                <span className="text-[15px] font-semibold text-slate-900 tracking-[-0.01em]">
                  PaceLops
                </span>
                <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-1.5 py-px rounded tracking-wide uppercase">
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
                          ? 'text-indigo-700 bg-indigo-50/80'
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

              {/* Branch Selector */}
              <div className="relative">
                <button
                  onClick={() => setBranchOpen(!branchOpen)}
                  className="flex items-center gap-2 h-8 px-3 text-[12px] font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-lg transition-colors"
                >
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline max-w-[140px] truncate">{activeBranch}</span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${branchOpen ? 'rotate-180' : ''}`} />
                </button>
                {branchOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setBranchOpen(false)} />
                    <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/50 z-50 py-1 animate-scale-up">
                      {branches.map((b) => (
                        <button
                          key={b}
                          onClick={() => { setActiveBranch(b); setBranchOpen(false) }}
                          className={`w-full text-left px-3.5 py-2 text-[12px] font-medium transition-colors ${
                            activeBranch === b
                              ? 'text-indigo-700 bg-indigo-50'
                              : 'text-slate-600 hover:bg-slate-50'
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
              <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
              </button>

              {/* New Shipment */}
              <button
                onClick={() => navigate('/worker/create-shipment')}
                className="h-8 px-3 flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-semibold rounded-lg transition-colors shadow-sm shadow-indigo-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Shipment</span>
              </button>

              {/* Logout */}
              <button
                onClick={() => navigate('/')}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          <div className="flex md:hidden border-t border-slate-100 py-1.5 gap-1 overflow-x-auto no-scrollbar">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap ${
                    isActive ? 'text-indigo-700 bg-indigo-50' : 'text-slate-500'
                  }`
                }
              >
                <item.icon className="w-3 h-3" />
                {item.name}
              </NavLink>
            ))}
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
