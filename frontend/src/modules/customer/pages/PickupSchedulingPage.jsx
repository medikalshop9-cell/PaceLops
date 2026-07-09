import React, { useState, useEffect } from 'react'
import { CalendarIcon, MapPin, Package, Sparkles, Clock } from 'lucide-react'
import { format, addDays, isToday, isTomorrow } from 'date-fns'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { usePickupStore } from '../store/usePickupStore'
import { PickupSlotGrid } from '../components/PickupSlotGrid'
import { UpcomingPickupsList } from '../components/UpcomingPickupsList'
import { toast } from 'sonner'

export default function PickupSchedulingPage() {
  const { bookPickup, getAvailableSlots } = usePickupStore()
  
  // Date Scroller state
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [slots, setSlots] = useState([])
  const [selectedSlotId, setSelectedSlotId] = useState(null)
  
  // Generate next 14 days for the scroller
  const dates = Array.from({ length: 14 }).map((_, i) => addDays(new Date(), i))

  useEffect(() => {
    // Load slots for the selected date
    setSlots(getAvailableSlots(selectedDate))
    setSelectedSlotId(null) // reset selection when date changes
  }, [selectedDate, getAvailableSlots])

  const handleBook = () => {
    if (!selectedSlotId) return
    const selectedSlot = slots.find(s => s.id === selectedSlotId)
    
    // In a real app we'd gather address from a form or profile
    bookPickup(selectedDate, selectedSlot.time)
    toast.success('Pickup booked successfully!')
    setSelectedSlotId(null)
  }

  // Human-readable date label
  const getDateLabel = (date) => {
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return format(date, 'EEE')
    return format(date, 'EEE')
  }

  return (
    <div className="py-8 pb-20 space-y-10 animate-scale-up">
      
      {/* Header Section — Premium typography */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-primary mb-1">
          <CalendarIcon className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em]">Scheduling</span>
        </div>
        <h1 className="text-[2.25rem] font-extrabold tracking-[-0.025em] text-foreground leading-[1.1]">
          Pickup Scheduling
        </h1>
        <p className="text-muted-foreground text-[15px] font-normal leading-relaxed max-w-md">
          Manage your upcoming pickups or schedule a new one.
        </p>
      </div>

      {/* Upcoming Pickups Section */}
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Package className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">Your Upcoming Pickups</h2>
        </div>
        <UpcomingPickupsList />
      </section>

      {/* Book New Pickup Section */}
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">Book a New Pickup</h2>
            <p className="text-sm text-muted-foreground">Select a date and time for our riders to come to you.</p>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-8">
          
          {/* Step 1 — Horizontal Date Scroller */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-primary text-primary-foreground text-xs font-bold">1</span>
              <h3 className="text-sm font-semibold text-foreground">Select Date</h3>
            </div>
            <div className="relative">
              {/* Edge fade gradients */}
              <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-[var(--glass-bg)] to-transparent z-10 pointer-events-none rounded-l-2xl" />
              <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[var(--glass-bg)] to-transparent z-10 pointer-events-none rounded-r-2xl" />
              
              <div className="flex overflow-x-auto gap-2.5 pb-2 no-scrollbar snap-x overscroll-x-contain px-1 pr-4">
                {dates.map((date, i) => {
                  const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                  const todayDate = isToday(date)
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(date)}
                      className={cn(
                        "group flex flex-col items-center justify-center min-w-[72px] h-[88px] rounded-2xl transition-all duration-300 snap-start shrink-0 relative",
                        isSelected 
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105" 
                          : "bg-card text-muted-foreground hover:bg-accent hover:text-foreground premium-shadow",
                        todayDate && !isSelected && "ring-2 ring-primary/30"
                      )}
                    >
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest mb-0.5",
                        isSelected ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>{format(date, 'MMM')}</span>
                      <span className="text-2xl font-black leading-none mb-0.5">{format(date, 'd')}</span>
                      <span className={cn(
                        "text-[10px] font-semibold",
                        isSelected ? "text-primary-foreground/80" : ""
                      )}>{getDateLabel(date)}</span>
                      {todayDate && (
                        <span className={cn(
                          "absolute -bottom-0.5 w-1 h-1 rounded-full",
                          isSelected ? "bg-primary-foreground" : "bg-primary"
                        )} />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Step 2 — Slots Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-primary text-primary-foreground text-xs font-bold">2</span>
                <h3 className="text-sm font-semibold text-foreground">Select Time Slot</h3>
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {format(selectedDate, 'EEEE, MMM d')}
              </span>
            </div>
            <PickupSlotGrid 
              slots={slots} 
              selectedSlotId={selectedSlotId} 
              onSelectSlot={(slot) => setSelectedSlotId(slot.id)} 
            />
          </div>

          {/* Step 3 — Confirm Booking CTA */}
          {selectedSlotId && (
            <div className="animate-scale-up">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-primary/5 border border-primary/15">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-primary/15 flex items-center justify-center text-primary shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Pickup Location</p>
                    <p className="text-xs text-muted-foreground">Default address will be used. You can change this later.</p>
                  </div>
                </div>
                
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 rounded-2xl h-12 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
                  onClick={handleBook}
                >
                  Confirm Booking
                </Button>
              </div>
            </div>
          )}

        </div>
      </section>

    </div>
  )
}
