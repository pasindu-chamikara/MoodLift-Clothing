import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { adminService } from '@/services/db';

interface AdminAuthState {
  isAdminLoggedIn: boolean;
  role: 'super_admin' | 'admin' | 'staff' | null;
  username: string | null;
  login: (password: string, username?: string) => Promise<boolean>;
  logout: () => void;
}

export const useAdminAuth = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAdminLoggedIn: false,
      role: null,
      username: null,
      login: async (password, username) => {
        const adminUsername = username || 'admin';
        const adminUser = await adminService.verifyAdmin(adminUsername, password);
        
        if (adminUser) {
          set({ isAdminLoggedIn: true, role: adminUser.role || 'staff', username: adminUser.username });
          return true;
        }
        
        return false;
      },
      logout: () => set({ isAdminLoggedIn: false, role: null, username: null }),
    }),
    {
      name: 'moodlift-admin-auth-v2', // Change name to clear old sessions
    }
  )
);
