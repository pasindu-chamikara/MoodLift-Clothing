import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { adminService } from '@/services/db';

interface AdminAuthState {
  isAdminLoggedIn: boolean;
  login: (password: string, username?: string) => Promise<boolean>;
  logout: () => void;
}

export const useAdminAuth = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAdminLoggedIn: false,
      login: async (password, username) => {
        const adminUsername = username || 'admin';
        const isValid = await adminService.verifyAdmin(adminUsername, password);
        
        if (isValid) {
          set({ isAdminLoggedIn: true });
          return true;
        }
        
        return false;
      },
      logout: () => set({ isAdminLoggedIn: false }),
    }),
    {
      name: 'moodlift-admin-auth',
    }
  )
);
