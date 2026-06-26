import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: {
    id: 'usr_mock_123',
    firstName: 'Medikal',
    lastName: 'Shop',
    fullName: 'Medikal Shop',
    email: 'admin@medikalshop.com',
    initials: 'MS',
    role: 'customer',
    avatar: null
  },
  setUser: (userData) => set({ user: userData }),
  logout: () => set({ user: null })
}))
