import { create } from 'zustand'
import { addDays, format, isSameDay, parseISO } from 'date-fns'

// Generate mock upcoming pickups
const initialPickups = [
  {
    id: 'pkp-1234',
    date: addDays(new Date(), 1).toISOString(),
    timeSlot: '10:00 AM - 11:00 AM',
    status: 'scheduled',
    address: '123 Main St, Springfield',
  },
  {
    id: 'pkp-5678',
    date: addDays(new Date(), 3).toISOString(),
    timeSlot: '02:00 PM - 03:00 PM',
    status: 'scheduled',
    address: '123 Main St, Springfield',
  }
]

// Helper to generate mock slots for a given date
const generateMockSlotsForDate = (date) => {
  const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
  const baseSlots = [
    { id: 's1', time: '09:00 AM - 10:00 AM', totalCapacity: 5 },
    { id: 's2', time: '10:00 AM - 11:00 AM', totalCapacity: 5 },
    { id: 's3', time: '11:00 AM - 12:00 PM', totalCapacity: 5 },
    { id: 's4', time: '01:00 PM - 02:00 PM', totalCapacity: 5 },
    { id: 's5', time: '02:00 PM - 03:00 PM', totalCapacity: 5 },
    { id: 's6', time: '03:00 PM - 04:00 PM', totalCapacity: 5 },
    { id: 's7', time: '04:00 PM - 05:00 PM', totalCapacity: 3 }, // Shorter capacity at end of day
  ];

  // Randomize availability based on the date string to make it deterministic for the user session
  const seed = typeof date === 'string' ? date.length : date.toISOString().length;
  
  return baseSlots.map((slot, index) => {
    // Randomize booked spots
    let bookedSpots = (index * seed) % (slot.totalCapacity + 2); 
    if (bookedSpots > slot.totalCapacity) bookedSpots = slot.totalCapacity;
    
    // Weekend overrides
    if (isWeekend && index < 2) bookedSpots = slot.totalCapacity; // Mornings full on weekends
    
    const available = slot.totalCapacity - bookedSpots;
    
    // Prediction logic
    let prediction = 'normal';
    if (available === 0) {
      prediction = 'full';
    } else if (available <= 2) {
      prediction = 'busy';
    } else if (available >= 4) {
      prediction = 'optimal';
    }

    return {
      ...slot,
      bookedSpots,
      availableSpots: available,
      isFull: available === 0,
      prediction
    }
  });
}

export const usePickupStore = create((set, get) => ({
  upcomingPickups: initialPickups,
  
  // Actions
  bookPickup: (date, timeSlot, address) => {
    const newPickup = {
      id: `pkp-${Math.random().toString(36).substring(2, 9)}`,
      date: typeof date === 'string' ? date : date.toISOString(),
      timeSlot,
      status: 'scheduled',
      address: address || '123 Main St, Springfield',
    }
    set((state) => ({ upcomingPickups: [...state.upcomingPickups, newPickup] }))
  },

  cancelPickup: (id) => {
    set((state) => ({
      upcomingPickups: state.upcomingPickups.filter(p => p.id !== id)
    }))
  },

  reschedulePickup: (id, newDate, newTimeSlot) => {
    set((state) => ({
      upcomingPickups: state.upcomingPickups.map(p => 
        p.id === id 
          ? { ...p, date: typeof newDate === 'string' ? newDate : newDate.toISOString(), timeSlot: newTimeSlot }
          : p
      )
    }))
  },

  getAvailableSlots: (date) => {
    // Return mock slots 
    const dateStr = typeof date === 'string' ? date : date.toISOString();
    return generateMockSlotsForDate(dateStr);
  }
}))
