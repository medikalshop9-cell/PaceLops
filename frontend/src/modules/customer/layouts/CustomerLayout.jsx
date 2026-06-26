import { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { cn } from '@/lib/utils'
import logoMark from '@/assets/images/parcelops_logo_mark.png'
import { ModeToggle } from '@/components/mode-toggle'
import { NotificationsDrawer } from '@/components/notifications-drawer'
import { useAuthStore } from '@/store/useAuthStore'
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
  const { user } = useAuthStore()

  const currentPath = location.pathname === '/customer' ? '/customer/dashboard' : location.pathname

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card text-muted-foreground">
      {/* Brand */}
      <div className="flex items-center h-20 px-8">
        <span className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <img src={logoMark} alt="ParcelOps Logo" className="w-8 h-8 object-contain" />
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
                ? "bg-muted text-primary shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <LayoutDashboard className={cn("w-5 h-5", currentPath.startsWith('/customer/dashboard') ? "text-[#FF7A00]" : "text-slate-500")} />
            Dashboard
          </Link>
        </div>

        {/* Sections */}
        {sidebarSections.map((section) => (
          <div key={section.title} className="px-2">
            <h3 className="px-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
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
                        ? "bg-muted text-primary shadow-sm ring-1 ring-border"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
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
        <div className="bg-muted/50 border border-border rounded-2xl p-4 flex flex-col gap-3">
          <p className="text-xs text-muted-foreground font-medium px-2">Need Admin Help?</p>
          <Link
            to="/support"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground bg-muted hover:bg-accent transition-colors ring-1 ring-border group"
          >
            <HelpCircle className="w-4 h-4 text-primary" />
            Contact Support
          </Link>
          <div className="h-px bg-border my-1" />
          <Link
            to="/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <LogOut className="w-4 h-4 text-muted-foreground" />
            Logout
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background flex font-sans selection:bg-primary/30 text-foreground overflow-x-hidden">
      {/* Mobile Menu Backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <nav
        className={cn(
          "fixed inset-y-0 left-0 w-[280px] bg-card shadow-2xl flex flex-col z-50 transform transition-transform duration-300 ease-in-out lg:hidden border-r border-border",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </nav>

      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex flex-col w-[280px] bg-card border-r border-border z-40 shrink-0 h-screen sticky top-0">
        <SidebarContent />
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-20 px-6 sm:px-10 flex items-center justify-between shrink-0 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-muted border border-border rounded-xl w-64 focus-within:ring-1 focus-within:ring-primary/50 focus-within:border-primary/50 transition-all shadow-inner">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search shipments..."
                className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
              />
              <div className="flex items-center justify-center px-1.5 py-0.5 rounded bg-background text-[10px] font-medium text-muted-foreground border border-border">
                ⌘K
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <ModeToggle />
            <NotificationsDrawer>
              <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-background" />
              </button>
            </NotificationsDrawer>
            <div className="flex items-center gap-3 pl-4 sm:pl-6 border-l border-border">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-foreground">{user?.fullName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <button className="w-10 h-10 rounded-full bg-muted p-0.5 ring-2 ring-border hover:ring-primary/20 transition-all">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-foreground">{user?.initials}</span>
                  )}
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
