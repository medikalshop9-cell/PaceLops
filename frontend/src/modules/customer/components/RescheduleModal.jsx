import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Clock, ChevronLeft, Check } from 'lucide-react'
import { format, addDays, isToday, isTomorrow } from 'date-fns'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { usePickupStore } from '../store/usePickupStore'
import { toast } from 'sonner'

export function RescheduleModal({ pickup, isOpen, onClose }) {
  const { reschedulePickup, getAvailableSlots } = usePickupStore()
  
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [slots, setSlots] = useState([])
  const [selectedSlotId, setSelectedSlotId] = useState(null)
  
  const dates = Array.from({ length: 14 }).map((_, i) => addDays(new Date(), i))

  // Lock background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      const mainContent = document.querySelector('[data-main-scroll]')
      if (mainContent) mainContent.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      const mainContent = document.querySelector('[data-main-scroll]')
      if (mainContent) mainContent.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      setSlots(getAvailableSlots(selectedDate))
      setSelectedSlotId(null)
    }
  }, [selectedDate, isOpen, getAvailableSlots])

  if (!isOpen || !pickup) return null

  const handleConfirm = () => {
    if (!selectedSlotId) return
    const selectedSlot = slots.find(s => s.id === selectedSlotId)
    reschedulePickup(pickup.id, selectedDate, selectedSlot.time)
    toast.success('Pickup rescheduled successfully!')
    onClose()
  }

  const getDateLabel = (date) => {
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    return format(date, 'EEE')
  }

  const selectedSlot = slots.find(s => s.id === selectedSlotId)

  const modalContent = (
    <div className="fixed inset-0 z-50 bg-background overflow-hidden overscroll-y-contain">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 h-14 border-b border-border shrink-0">
        <button 
          onClick={onClose} 
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-sm font-bold text-foreground">Reschedule Pickup</h1>
        <div className="w-16" /> {/* Spacer for centering */}
      </div>

      {/* Current booking info */}
      <div className="px-4 sm:px-6 py-3 bg-muted/50 border-b border-border shrink-0">
        <p className="text-xs text-muted-foreground">
          Current: <span className="font-semibold text-foreground">{format(new Date(pickup.date), 'EEE, MMM d')}</span> at <span className="font-semibold text-foreground">{pickup.timeSlot}</span>
        </p>
      </div>

      {/* Scrollable Content — sits between top bar and fixed bottom bar */}
      <div className="absolute inset-0 top-[6.25rem] bottom-[4.5rem] overflow-y-auto overscroll-y-contain">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">

          {/* Step 1: Date Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-primary text-primary-foreground text-[10px] font-bold">1</span>
              <h3 className="text-sm font-bold text-foreground">Select New Date</h3>
            </div>
            <div className="flex overflow-x-auto gap-2 no-scrollbar overscroll-x-contain pb-1">
              {dates.map((date, i) => {
                const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                const todayDate = isToday(date)
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(date)}
                    className={cn(
                      "flex flex-col items-center justify-center min-w-[60px] h-[70px] rounded-xl transition-all duration-200 shrink-0",
                      isSelected 
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/25" 
                        : "bg-card text-muted-foreground hover:bg-accent hover:text-foreground premium-shadow",
                      todayDate && !isSelected && "ring-1 ring-primary/30"
                    )}
                  >
                    <span className={cn("text-[9px] font-bold uppercase", isSelected ? "text-primary-foreground/70" : "")}>{format(date, 'MMM')}</span>
                    <span className="text-lg font-extrabold leading-none">{format(date, 'd')}</span>
                    <span className={cn("text-[9px] font-semibold", isSelected ? "text-primary-foreground/80" : "")}>{getDateLabel(date)}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step 2: Time Slot — Simple list, not a grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-primary text-primary-foreground text-[10px] font-bold">2</span>
                <h3 className="text-sm font-bold text-foreground">Select New Time</h3>
              </div>
              <span className="text-[11px] text-muted-foreground">{format(selectedDate, 'EEE, MMM d')}</span>
            </div>

            <div className="space-y-2">
              {slots.map((slot) => {
                const isSelected = selectedSlotId === slot.id
                const isFull = slot.isFull
                return (
                  <button
                    key={slot.id}
                    disabled={isFull}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200",
                      isSelected 
                        ? "bg-primary/10 ring-2 ring-primary" 
                        : "bg-card premium-shadow hover:bg-accent",
                      isFull && "opacity-40 cursor-not-allowed grayscale"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className={cn("w-4 h-4", isSelected ? "text-primary" : "text-muted-foreground")} />
                      <span className={cn("font-semibold text-sm", isSelected ? "text-primary" : "text-foreground")}>
                        {slot.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {isFull ? (
                        <span className="text-[11px] font-semibold text-red-500">Full</span>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">
                          <span className={cn("font-bold", slot.availableSpots <= 2 ? "text-amber-500" : "text-foreground")}>{slot.availableSpots}</span> left
                        </span>
                      )}
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center transition-all",
                        isSelected 
                          ? "bg-primary text-primary-foreground" 
                          : "border-2 border-muted-foreground/20"
                      )}>
                        {isSelected && <Check className="w-3 h-3" strokeWidth={3} />}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar — pinned to bottom, ALWAYS visible */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1 h-12 rounded-2xl font-semibold text-sm"
          >
            Cancel
          </Button>
          <Button 
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 disabled:opacity-40 disabled:shadow-none transition-all"
            disabled={!selectedSlotId}
            onClick={handleConfirm}
          >
            {selectedSlot ? `Confirm · ${selectedSlot.time.split(' - ')[0]}` : 'Select a time'}
          </Button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
