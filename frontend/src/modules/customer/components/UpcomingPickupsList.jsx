import React, { useState } from 'react'
import { Calendar, Clock, MapPin, X, CalendarClock, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'
import { usePickupStore } from '../store/usePickupStore'
import { RescheduleModal } from './RescheduleModal'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function UpcomingPickupsList() {
  const { upcomingPickups, cancelPickup } = usePickupStore()
  const [rescheduleModalData, setRescheduleModalData] = useState(null)

  const handleCancel = (id) => {
    cancelPickup(id)
    toast.success('Pickup booking cancelled successfully.')
  }

  if (!upcomingPickups || upcomingPickups.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-10 text-center">
        <div className="animate-float">
          <Calendar className="w-14 h-14 mx-auto mb-4 text-muted-foreground/20" />
        </div>
        <h3 className="text-foreground font-semibold mb-1">No upcoming pickups</h3>
        <p className="text-sm text-muted-foreground">You have no pickups scheduled. Book one below.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {upcomingPickups.map((pickup) => (
          <div 
            key={pickup.id} 
            className="group bg-card rounded-3xl overflow-hidden flex flex-col h-full premium-shadow transition-all duration-300"
          >
            {/* Card Body */}
            <div className="p-5 flex-1 space-y-4">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Confirmed</span>
                </div>
              </div>

              {/* Info Rows */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground">{format(new Date(pickup.date), 'EEEE, MMM d')}</p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">{pickup.timeSlot}</p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground line-clamp-1">{pickup.address}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons — iOS grouped style */}
            <div className="border-t border-border">
              <div className="grid grid-cols-2 divide-x divide-border">
                <button 
                  onClick={() => setRescheduleModalData(pickup)}
                  className={cn(
                    "py-3.5 px-4 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2",
                    "text-primary hover:bg-primary/8 active:bg-primary/15"
                  )}
                >
                  <CalendarClock className="w-4 h-4" />
                  Reschedule
                </button>
                <button 
                  onClick={() => handleCancel(pickup.id)}
                  className={cn(
                    "py-3.5 px-4 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2",
                    "text-red-500 hover:bg-red-500/8 active:bg-red-500/15"
                  )}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reschedule Modal */}
      <RescheduleModal 
        pickup={rescheduleModalData} 
        isOpen={!!rescheduleModalData} 
        onClose={() => setRescheduleModalData(null)} 
      />
    </>
  )
}
