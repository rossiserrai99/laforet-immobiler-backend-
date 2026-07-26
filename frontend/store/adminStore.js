import { create } from 'zustand';

export const useAdminStore = create((set) => ({
  admin: null,
  isAuthenticated: false,
  isLoading: true,
  
  setAdmin: (admin) => set({ admin, isAuthenticated: !!admin, isLoading: false }),
  clearAdmin: () => set({ admin: null, isAuthenticated: false, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}));
