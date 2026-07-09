import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Package, Truck, MapPin, CheckCircle2, AlertTriangle, ArrowLeft, Bell, PackagePlus, CreditCard, Activity } from 'lucide-react'
import { dashboardService } from '@/modules/customer/services/dashboard.service'

const getEventConfig = (type) => {
  switch (type) {
    case 'parcel_update':
      return { icon: Truck, colorClass: 'text-blue-500 bg-blue-500/10' }
    case 'payment':
      return { icon: CreditCard, colorClass: 'text-emerald-500 bg-emerald-500/10' }
    case 'delivery_request':
      return { icon: PackagePlus, colorClass: 'text-primary bg-primary/10' }
    default:
      return { icon: Activity, colorClass: 'text-muted-foreground bg-muted' }
  }
}

export function NotificationsDrawer({ children }) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const user = JSON.parse(localStorage.getItem('user'))
  const navigate = useNavigate()

  useEffect(() => {
    if (open && user?.id) {
      const fetchNotifications = async () => {
        setIsLoading(true)
        setError(null)
        try {
          // Reusing the recent activities as notifications for the authenticated user
          const activities = await dashboardService.getRecentActivities(user.id)
          setNotifications(activities)
        } catch (err) {
          setError(err.message || 'Failed to load notifications')
        } finally {
          setIsLoading(false)
        }
      }
      
      fetchNotifications()
    }
  }, [open, user?.id])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[400px] p-0 flex flex-col bg-card border-l border-border z-[100]">
        
        {/* Mobile Header (Shows only on small screens) */}
        <div className="flex sm:hidden items-center p-4 border-b border-border bg-card">
          <button 
            onClick={() => setOpen(false)}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold text-foreground ml-2 tracking-tight">Notifications</span>
        </div>

        {/* Desktop Header */}
        <SheetHeader className="hidden sm:flex p-6 border-b border-border text-left">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold tracking-tight text-foreground">Notifications</SheetTitle>
            <button className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
              Mark All Read
            </button>
          </div>
        </SheetHeader>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col">
            {isLoading ? (
              // Skeleton state
              [1, 2, 3].map(i => (
                <div key={i} className="flex items-start gap-4 p-4 sm:p-6 border-b border-border/50 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-2 bg-muted rounded w-1/4 mt-2" />
                  </div>
                </div>
              ))
            ) : error ? (
              // Error state
              <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <AlertTriangle className="w-8 h-8 text-red-500/80 mb-3" />
                <p className="text-sm">{error}</p>
              </div>
            ) : notifications.length === 0 ? (
              // Empty state
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">All caught up!</h3>
                <p className="text-sm text-muted-foreground">You have no new notifications.</p>
              </div>
            ) : (
              // Populated list
              notifications.map((notification) => {
                const { icon: Icon, colorClass } = getEventConfig(notification.type)
                return (
                  <div 
                    key={notification.id} 
                    className="relative flex items-start gap-4 p-4 sm:p-6 hover:bg-muted/50 transition-colors border-b border-border/50 group cursor-pointer"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm text-foreground truncate mr-2">
                          {notification.title}
                        </p>
                        {notification.unread && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 pr-4 leading-relaxed">
                        {notification.description}
                      </p>
                      <p className="text-[11px] font-medium text-muted-foreground/80 mt-2">
                        {notification.timeAgo || 'Just now'}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
