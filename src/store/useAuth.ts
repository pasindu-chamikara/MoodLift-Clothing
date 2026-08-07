import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userService } from '@/services/db';

export interface Address {
  id: number;
  name: string;
  street: string;
  city: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

interface AuthState {
  isLoggedIn: boolean;
  user: { name: string; email: string } | null;
  addresses: Address[];
  login: (name: string, email: string) => Promise<void>;
  logout: () => void;
  setAddresses: (addresses: Address[]) => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      addresses: [],
      login: async (name, email) => {
        let dbUser = await userService.getUser(email);
        
        if (!dbUser) {
          dbUser = { name, email, addresses: [] };
          await userService.saveUser(email, dbUser);
        } else if (name && dbUser.name !== name) {
           // Allow updating name on login if provided differently
           dbUser.name = name;
           await userService.saveUser(email, dbUser);
        }

        set({ 
          isLoggedIn: true, 
          user: { name: dbUser.name, email }, 
          addresses: dbUser.addresses || [] 
        });
      },
      logout: () => set({ isLoggedIn: false, user: null, addresses: [] }),
      setAddresses: async (addresses) => {
        const { user } = get();
        if (user) {
          const dbUser = await userService.getUser(user.email);
          if (dbUser) {
            await userService.saveUser(user.email, { ...dbUser, addresses });
          }
        }
        set({ addresses });
      },
    }),
    {
      name: 'moodlift-auth',
    }
  )
);
