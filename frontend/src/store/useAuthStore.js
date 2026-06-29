import { create } from 'zustand'

const getUserFromStorage = () => {
  try {
    const item = localStorage.getItem('user');
    return item ? JSON.parse(item) : null;
  } catch (error) {
    return null;
  }
}

export const useAuthStore = create((set) => ({
  user: getUserFromStorage(),
  setUser: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    set({ user: userData });
  },
  logout: () => {
    localStorage.removeItem('user');
    set({ user: null });
  }
}))
