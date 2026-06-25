import { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  Menu,
  LayoutDashboard,
  MapPin,
  PackagePlus,
  CalendarDays,
  CreditCard,
  History,
  BookUser,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  X,
  Search,
} from 'lucide-react'

// Defined sidebar sections based on user requirements
const sidebarSections = [
  {
    title: 'OPERATIONS',
    links: [
      { name: 'Track Parcel', path: '/customer/track', icon: MapPin },
      { name: 'New Shipment', path: '/customer/new-shipment', icon: PackagePlus },
      { name: 'Pickup Slots', path: '/customer/pickup-slots', icon: CalendarDays },
    ]
  },
  {
    title: 'FINANCE',
    links: [
      { name: 'Payment', path: '/customer/payment', icon: CreditCard },
      { name: 'History', path: '/customer/history', icon: History },
    ]
  },
  {
    title: 'CUSTOMERS',
    links: [
      { name: 'Address Book', path: '/customer/address-book', icon: BookUser },
      { name: 'Notifications', path: '/customer/notifications', icon: Bell },
    ]
  },
  {
    title: 'SYSTEM',
    links: [
      { name: 'Settings', path: '/customer/settings', icon: Settings },
    ]
  }
]

export function CustomerLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const currentPath = location.pathname === '/customer' ? '/customer/dashboard' : location.pathname

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0B1020] text-slate-300">
      {/* Brand */}
      <div className="flex items-center h-20 px-8">
        <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF7A00] to-[#E05E00] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#FF7A00]/20">
            P
          </div>
          PARCELOPS
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8 no-scrollbar">
        {/* Main Dashboard Link */}
        <div className="px-2">
          <Link
            to="/customer/dashboard"
            onClick={() => setIsMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium",
              currentPath.startsWith('/customer/dashboard')
                ? "bg-white/5 text-white shadow-sm ring-1 ring-white/10"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            <LayoutDashboard className={cn("w-5 h-5", currentPath.startsWith('/customer/dashboard') ? "text-[#FF7A00]" : "text-slate-500")} />
            Dashboard
          </Link>
        </div>

        {/* Sections */}
        {sidebarSections.map((section) => (
          <div key={section.title} className="px-2">
            <h3 className="px-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.links.map((link) => {
                const Icon = link.icon
                const isActive = currentPath.startsWith(link.path)
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 font-medium text-[14px]",
                      isActive
                        ? "bg-white/5 text-white shadow-sm ring-1 ring-white/10"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive ? "text-[#FF7A00]" : "text-slate-500")} />
                    {link.name}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="p-4 mt-auto">
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
          <p className="text-xs text-slate-400 font-medium px-2">Need Admin Help?</p>
          <Link
            to="/support"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white bg-white/5 hover:bg-white/10 transition-colors ring-1 ring-white/10 group"
          >
            <HelpCircle className="w-4 h-4 text-[#FF7A00]" />
            Contact Support
          </Link>
          <div className="h-px bg-white/5 my-1" />
          <Link
            to="/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4 text-slate-500" />
            Logout
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#060913] flex font-sans selection:bg-[#FF7A00]/30 text-slate-200">
      {/* Mobile Menu Backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-[#0B1020]/80 backdrop-blur-sm z-50 transition-opacity lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <nav
        className={cn(
          "fixed inset-y-0 left-0 w-[280px] bg-[#0B1020] shadow-2xl flex flex-col z-50 transform transition-transform duration-300 ease-in-out lg:hidden border-r border-white/5",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </nav>

      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex flex-col w-[280px] bg-[#0B1020] border-r border-white/5 z-40 shrink-0 h-screen sticky top-0">
        <SidebarContent />
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-20 px-6 sm:px-10 flex items-center justify-between shrink-0 border-b border-white/5 bg-[#0B1020]/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-[#0B1020] border border-white/10 rounded-xl w-64 focus-within:ring-1 focus-within:ring-[#FF7A00]/50 focus-within:border-[#FF7A00]/50 transition-all shadow-inner">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search shipments..."
                className="bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-500 w-full"
              />
              <div className="flex items-center justify-center px-1.5 py-0.5 rounded bg-white/5 text-[10px] font-medium text-slate-400 border border-white/10">
                ⌘K
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF7A00] rounded-full border-2 border-[#0B1020]" />
            </button>
            <div className="flex items-center gap-3 pl-4 sm:pl-6 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white">Sarah Jenkins</p>
                <p className="text-xs text-slate-400">sarah@example.com</p>
              </div>
              <button className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 p-0.5 ring-2 ring-white/5 hover:ring-white/20 transition-all">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                  <span className="text-sm font-bold text-slate-300">SJ</span>
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <Outlet context={{ setIsMenuOpen }} />
        </main>
      </div>
    </div>
  )
}
