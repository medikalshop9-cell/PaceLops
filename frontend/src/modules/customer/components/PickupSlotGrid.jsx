import React from 'react'
import { Check, Clock, TrendingUp, Users, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PickupSlotGrid({ slots, selectedSlotId, onSelectSlot }) {
  if (!slots || slots.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        <div className="animate-float">
          <Clock className="w-14 h-14 mx-auto mb-4 opacity-15" />
        </div>
        <p className="font-medium">No available slots for this date.</p>
        <p className="text-xs mt-1 text-muted-foreground/60">Try selecting a different date.</p>
      </div>
    )
  }

  const predictionConfig = {
    optimal: {
      label: 'Optimal',
      icon: TrendingUp,
      dot: 'bg-emerald-500',
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    busy: {
      label: 'High Traffic',
      icon: Zap,
      dot: 'bg-amber-500',
      badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    full: {
      label: 'Full',
      icon: null,
      dot: 'bg-red-500',
      badge: 'bg-red-500/10 text-red-500 dark:text-red-400',
    },
    normal: {
      label: 'Available',
      icon: null,
      dot: 'bg-blue-500',
      badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 stagger-children">
      {slots.map((slot) => {
        const isSelected = selectedSlotId === slot.id
        const isFull = slot.isFull
        const config = predictionConfig[slot.prediction]
        const PredIcon = config.icon

        // Capacity bar percentage
        const capacityPercent = ((slot.totalCapacity - slot.availableSpots) / slot.totalCapacity) * 100

        return (
          <button
            key={slot.id}
            disabled={isFull}
            onClick={() => onSelectSlot(slot)}
            className={cn(
              "group relative flex flex-col items-start p-4 rounded-2xl text-left transition-all duration-300",
              isSelected 
                ? "bg-primary/8 ring-2 ring-primary shadow-lg shadow-primary/10 scale-[1.02]" 
                : "bg-card premium-shadow hover:scale-[1.01]",
              isFull && "opacity-40 cursor-not-allowed hover:scale-100 grayscale",
            )}
          >
            {/* Top: Time & Checkmark */}
            <div className="flex items-center justify-between w-full mb-3">
              <span className={cn(
                "font-bold text-[15px] tracking-tight transition-colors",
                isSelected ? "text-primary" : "text-foreground"
              )}>
                {slot.time}
              </span>
              <div className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300",
                isSelected 
                  ? "bg-primary text-primary-foreground scale-110" 
                  : "border-2 border-muted-foreground/20 text-transparent group-hover:border-muted-foreground/40"
              )}>
                <Check className="w-3 h-3" strokeWidth={3} />
              </div>
            </div>

            {/* Middle: Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold",
                config.badge
              )}>
                <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
                {PredIcon && <PredIcon className="w-3 h-3" />}
                {config.label}
              </span>
            </div>

            {/* Bottom: Capacity bar */}
            <div className="w-full mt-auto space-y-2 pt-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-medium text-muted-foreground">
                  <Users className="w-3.5 h-3.5" />
                  {isFull ? (
                    <span className="text-red-500 font-semibold">No spots left</span>
                  ) : (
                    <span>
                      <span className={cn("font-bold", slot.availableSpots <= 2 ? "text-amber-500" : "text-foreground")}>
                        {slot.availableSpots}
                      </span>
                      <span className="text-muted-foreground"> of {slot.totalCapacity} available</span>
                    </span>
                  )}
                </div>
              </div>
              {/* Visual capacity bar */}
              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    isFull ? "bg-red-400" : capacityPercent > 60 ? "bg-amber-400" : "bg-emerald-400"
                  )}
                  style={{ width: `${capacityPercent}%` }}
                />
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
