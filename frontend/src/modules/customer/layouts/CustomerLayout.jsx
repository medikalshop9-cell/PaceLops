import { useState } from 'react'
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import logoMark from '@/assets/images/parcelops_logo_mark.png'
import { ModeToggle } from '@/components/mode-toggle'
import { NotificationsDrawer } from '@/components/notifications-drawer'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from '@/store/useAuthStore'
import {
  Menu,
  LayoutDashboard,
  MapPin,
  PackagePlus,
  Package,
  CalendarDays,
  CreditCard,
  History,
  BookUser,
  User,
  Truck,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

// Defined sidebar sections based on user requirements
const sidebarSections = [
  {
    title: 'OPERATIONS',
    links: [
      { name: 'Ship a Parcel', path: '/customer/new-shipment', icon: PackagePlus },
      { name: 'My Parcels', path: '/customer/my-parcels', icon: Package },
      { name: 'Track Parcel', path: '/customer/track', icon: MapPin },
      { name: 'Pickup Scheduling', path: '/customer/pickup-slots', icon: CalendarDays },
      { name: 'Delivery Requests', path: '/customer/delivery-requests', icon: Truck },
    ]
  },
  {
    title: 'FINANCE',
    links: [
      { name: 'Payments', path: '/customer/payment', icon: CreditCard },
    ]
  },
  {
    title: 'ACCOUNT',
    links: [
      { name: 'Notifications', path: '/customer/notifications', icon: Bell },
      { name: 'My Profile', path: '/customer/profile', icon: User },
    ]
  }
]

const SidebarContent = ({ currentPath, setIsMenuOpen, isCollapsed, setIsCollapsed }) => {
  return (
    <div className="flex flex-col h-full bg-card text-muted-foreground overflow-hidden">
      {/* Brand */}
      <div className={cn("flex items-center h-20 shrink-0 border-b border-border/10", isCollapsed ? "justify-center px-0" : "px-8 justify-between")}>
        <span className={cn("font-bold tracking-tight text-foreground flex items-center gap-2", isCollapsed ? "" : "text-xl")}>
          <img src={logoMark} alt="ParcelOps Logo" className="w-8 h-8 object-contain shrink-0" />
          {!isCollapsed && <span>PARCELOPS</span>}
        </span>
        <button 
           onClick={() => setIsCollapsed(!isCollapsed)}
           className={cn("hidden lg:flex p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors", isCollapsed && "absolute top-24 -right-3 z-50 bg-card border border-border rounded-full shadow-sm hover:scale-110")}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-6 no-scrollbar overflow-x-hidden">
        {/* Main Dashboard Link */}
        <div className="px-2">
          <Link
            to="/customer/dashboard"
            onClick={() => setIsMenuOpen(false)}
            className={cn(
              "flex items-center rounded-xl transition-all duration-300 font-medium",
              isCollapsed ? "justify-center p-3 mx-2" : "gap-3 px-4 py-3 mx-2",
              currentPath.startsWith('/customer/dashboard')
                ? "bg-muted text-primary shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
            title={isCollapsed ? "Dashboard" : undefined}
          >
            <LayoutDashboard className={cn(isCollapsed ? "w-6 h-6" : "w-5 h-5 shrink-0", currentPath.startsWith('/customer/dashboard') ? "text-[#FF7A00]" : "text-slate-500")} />
            {!isCollapsed && <span className="truncate">Dashboard</span>}
          </Link>
        </div>

        {/* Sections */}
        {sidebarSections.map((section) => (
          <div key={section.title} className="px-2">
            {!isCollapsed ? (
              <h3 className="px-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3 truncate">
                {section.title}
              </h3>
            ) : (
              <div className="h-px bg-border my-4 mx-4" />
            )}
            
            <div className="space-y-1 px-2">
              {section.links.map((link) => {
                const Icon = link.icon
                const isActive = currentPath.startsWith(link.path)

                const linkClasses = cn(
                  "flex items-center rounded-xl transition-all duration-300 font-medium text-[14px]",
                  isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-2.5",
                  isActive
                    ? "bg-muted text-primary shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )

                const iconClasses = cn(isCollapsed ? "w-5 h-5 shrink-0" : "w-4 h-4 shrink-0", isActive ? "text-[#FF7A00]" : "text-slate-500")

                if (link.name === 'Notifications') {
                  return (
                    <NotificationsDrawer key={link.name}>
                      <button className={cn(linkClasses, "w-full")} title={isCollapsed ? link.name : undefined}>
                        <Icon className={iconClasses} />
                        {!isCollapsed && <span className="truncate">{link.name}</span>}
                      </button>
                    </NotificationsDrawer>
                  )
                }

                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={linkClasses}
                    title={isCollapsed ? link.name : undefined}
                  >
                    <Icon className={iconClasses} />
                    {!isCollapsed && <span className="truncate">{link.name}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="p-4 mt-auto border-t border-border/10">
        <div className={cn("bg-muted/50 border border-border rounded-2xl flex flex-col gap-2", isCollapsed ? "p-2 items-center" : "p-3")}>
          <Link
            to="/customer/support"
            className={cn(
              "flex items-center rounded-xl text-sm font-medium text-foreground bg-muted hover:bg-accent transition-colors ring-1 ring-border group",
              isCollapsed ? "p-2.5 justify-center w-full" : "gap-3 px-3 py-2.5"
            )}
            title={isCollapsed ? "Help & Support" : undefined}
          >
            <HelpCircle className={cn("text-primary shrink-0", isCollapsed ? "w-5 h-5" : "w-4 h-4")} />
            {!isCollapsed && <span className="truncate">Help & Support</span>}
          </Link>
          <div className={cn("h-px bg-border", isCollapsed ? "w-6 my-1" : "w-full my-1")} />
          <Link
            to="/login"
            className={cn(
              "flex items-center rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
              isCollapsed ? "p-2.5 justify-center w-full" : "gap-3 px-3 py-2.5"
            )}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut className={cn("text-muted-foreground shrink-0", isCollapsed ? "w-5 h-5" : "w-4 h-4")} />
            {!isCollapsed && <span className="truncate">Logout</span>}
          </Link>
        </div>
      </div>
    </div>
  )
}

export function CustomerLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [topSearch, setTopSearch] = useState('')
  const location = useLocation()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  function handleTopSearch(e) {
    if (e.key === 'Enter' && topSearch.trim()) {
      navigate(`/customer/track?q=${encodeURIComponent(topSearch.trim())}`)
      setTopSearch('')
    }
  }

  const currentPath = location.pathname === '/customer' ? '/customer/dashboard' : location.pathname

  return (
    <div className="h-screen bg-background flex font-sans selection:bg-primary/30 text-foreground overflow-hidden">
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
        <SidebarContent currentPath={currentPath} setIsMenuOpen={setIsMenuOpen} isCollapsed={false} setIsCollapsed={() => {}} />
      </nav>

      {/* Desktop Sidebar */}
      <nav className={cn(
        "hidden lg:flex flex-col bg-card border-r border-border z-40 shrink-0 h-full transition-[width] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] relative",
        isCollapsed ? "w-[96px]" : "w-[280px]"
      )}>
        <SidebarContent currentPath={currentPath} setIsMenuOpen={setIsMenuOpen} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </nav>

      {/* Main Content Area */}
      <div data-main-scroll className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
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
                value={topSearch}
                onChange={e => setTopSearch(e.target.value)}
                onKeyDown={handleTopSearch}
                placeholder="Search shipments..."
                className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
              />
              <div className="flex items-center justify-center px-1.5 py-0.5 rounded bg-background text-[10px] font-medium text-muted-foreground border border-border">
                ⏎
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
                <p className="text-sm font-semibold text-foreground">{user?.full_name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Link to="/customer/profile">
                <Avatar className="w-10 h-10 ring-2 ring-border hover:ring-primary/20 transition-all cursor-pointer">
                  <AvatarImage src={`https://api.dicebear.com/9.x/notionists/svg?seed=${user?.full_name || user?.email || 'default'}`} alt={user?.full_name} />
                  <AvatarFallback className="bg-muted text-foreground font-bold">
                    {user?.full_name?.split(' ').map(n => n[0]).join('')?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>
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
