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
  Bell,
  LogOut,
  X
} from 'lucide-react'

const navLinks = [
  { name: 'Dashboard', path: '/customer/dashboard', icon: LayoutDashboard },
  { name: 'Track Parcel', path: '/customer/track', icon: MapPin },
  { name: 'New Shipment', path: '/customer/new-shipment', icon: PackagePlus },
  { name: 'Pickup Slots', path: '/customer/pickup-slots', icon: CalendarDays },
  { name: 'Payment', path: '/customer/payment', icon: CreditCard },
  { name: 'History', path: '/customer/history', icon: History },
  { name: 'Notifications', path: '/customer/notifications', icon: Bell },
]

export function CustomerLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  // For dummy purposes, we'll assume /customer/dashboard is active if just /customer
  const currentPath = location.pathname === '/customer' ? '/customer/dashboard' : location.pathname

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Slide-in Menu Backdrop */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        >
          {/* Slide-in Menu Panel */}
          <nav 
            className="fixed inset-y-0 left-0 w-[260px] bg-slate-900 shadow-2xl flex flex-col z-50 transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6">
              <span className="text-xl font-semibold tracking-tight text-white">ParcelOps</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = currentPath.startsWith(link.path)
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-sm font-medium",
                      isActive 
                        ? "bg-[#fe6b00]/10 text-white" 
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", isActive ? "text-[#fe6b00]" : "text-slate-500")} />
                    {link.name}
                  </Link>
                )
              })}
            </div>

            <div className="p-4 border-t border-slate-800">
              <Link 
                to="/login"
                className="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              >
                <LogOut className="w-5 h-5 text-slate-500" />
                Log out
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-lg mx-auto md:max-w-3xl lg:max-w-5xl px-4 sm:px-6">
        <Outlet context={{ setIsMenuOpen }} />
      </main>

    </div>
  )
}
