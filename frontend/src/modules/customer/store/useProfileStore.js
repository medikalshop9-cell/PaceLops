import { create } from 'zustand'

export const useProfileStore = create((set) => ({
  personalInfo: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+234 800 123 4567',
  },
  
  savedAddresses: [
    {
      id: 'ADDR-1',
      label: 'Home',
      address: '123 Main St, Springfield, IL 62701',
      isDefault: true,
    },
    {
      id: 'ADDR-2',
      label: 'Office',
      address: '456 Business Pkwy, Suite 200, Springfield, IL 62704',
      isDefault: false,
    },
  ],
  
  security: {
    mfaEnabled: false,
    activeSessions: 2,
  },
  
  notifications: {
    sms: true,
    push: true,
    email: false,
  },

  updatePersonalInfo: (info) => set((state) => ({
    personalInfo: { ...state.personalInfo, ...info }
  })),

  addAddress: (address) => set((state) => ({
    savedAddresses: [...state.savedAddresses, { id: `ADDR-${Date.now()}`, ...address }]
  })),

  editAddress: (id, address) => set((state) => ({
    savedAddresses: state.savedAddresses.map(a => a.id === id ? { ...a, ...address } : a)
  })),

  removeAddress: (id) => set((state) => ({
    savedAddresses: state.savedAddresses.filter(a => a.id !== id)
  })),

  setDefaultAddress: (id) => set((state) => ({
    savedAddresses: state.savedAddresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }))
  })),

  toggleMFA: () => set((state) => ({
    security: { ...state.security, mfaEnabled: !state.security.mfaEnabled }
  })),

  toggleNotification: (key) => set((state) => ({
    notifications: { ...state.notifications, [key]: !state.notifications[key] }
  }))
}))
