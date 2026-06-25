import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Package, Truck, MapPin, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react'

// Mock logistics events
const NOTIFICATIONS = [
  {
    id: 1,
    type: 'parcel_created',
    title: 'Parcel Created',
    description: 'Shipment PCL-4821 created successfully',
    time: '2 mins ago',
    unread: true,
  },
  {
    id: 2,
    type: 'driver_assigned',
    title: 'Driver Assigned',
    description: 'A driver has been assigned',
    time: '10 mins ago',
    unread: true,
  },
  {
    id: 3,
    type: 'driver_near',
    title: 'Driver Near Pickup',
    description: 'Driver arriving within 5 minutes',
    time: '1 hr ago',
    unread: true,
  },
  {
    id: 4,
    type: 'in_transit',
    title: 'Parcel In Transit',
    description: 'Your shipment is on route to Abuja',
    time: '3 hrs ago',
    unread: false,
  },
  {
    id: 5,
    type: 'delivered',
    title: 'Delivered',
    description: 'Shipment delivered successfully',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 6,
    type: 'failed',
    title: 'Delivery Attempt Failed',
    description: 'Recipient unavailable',
    time: 'May 23',
    unread: false,
  },
]

const getEventConfig = (type) => {
  switch (type) {
    case 'parcel_created':
      return { icon: Package, colorClass: 'text-primary bg-primary/10' }
    case 'driver_assigned':
      return { icon: Truck, colorClass: 'text-muted-foreground bg-muted' }
    case 'driver_near':
      return { icon: MapPin, colorClass: 'text-blue-500 bg-blue-500/10' }
    case 'in_transit':
      return { icon: Truck, colorClass: 'text-primary bg-primary/10' }
    case 'delivered':
      return { icon: CheckCircle2, colorClass: 'text-emerald-500 bg-emerald-500/10' }
    case 'failed':
      return { icon: AlertTriangle, colorClass: 'text-red-500 bg-red-500/10' }
    default:
      return { icon: Package, colorClass: 'text-muted-foreground bg-muted' }
  }
}

export function NotificationsDrawer({ children }) {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      {/* 
        Width adjustments:
        - Mobile: w-full (100% width)
        - Desktop: sm:max-w-[400px]
      */}
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
            {NOTIFICATIONS.map((notification) => {
              const { icon: Icon, colorClass } = getEventConfig(notification.type)
              return (
                <div 
                  key={notification.id} 
                  className="relative flex items-start gap-4 p-4 sm:p-6 hover:bg-muted/50 transition-colors border-b border-border/50 group cursor-pointer"
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Content */}
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
                      {notification.time}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer Action */}
          <div className="p-4 sm:p-6 border-t border-border mt-auto">
            <button className="w-full py-2.5 bg-muted hover:bg-accent text-sm font-semibold text-foreground rounded-xl transition-colors ring-1 ring-border">
              View All Notifications &rarr;
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
