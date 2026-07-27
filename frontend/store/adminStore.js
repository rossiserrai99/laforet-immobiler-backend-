import { create } from 'zustand';

export const useAdminStore = create((set) => ({
  admin: null,
  isAuthenticated: false,
  isLoading: true,
  
  setAdmin: (admin) => set({ admin, isAuthenticated: !!admin, isLoading: false }),
  clearAdmin: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('laforet_token');
      document.cookie = 'laforet_token=; path=/; max-age=0; SameSite=Lax';
    }
    set({ admin: null, isAuthenticated: false, isLoading: false });
  },
  setLoading: (isLoading) => set({ isLoading }),
}));
