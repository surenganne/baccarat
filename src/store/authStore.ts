import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, LoginCredentials, RegisterCredentials } from '../types/auth';
import { supabase } from '../lib/supabase';
import { useTableStore } from './tableStore';
import { useSyncStore } from './syncStore';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isOfflineLogin: boolean;
  lastLoginMode: 'online' | 'offline' | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setOfflineLogin: (status: boolean) => void;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isOfflineLogin: false,
  lastLoginMode: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  clearError: () => {},
  setOfflineLogin: () => {}
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          if (navigator.onLine) {
            const { data: users, error: queryError } = await supabase
              .from('users')
              .select()
              .or(`username.eq.${credentials.identifier},mobile_number.eq.${credentials.identifier}`);

            if (queryError) throw queryError;
            
            const user = users?.[0];
            if (!user) throw new Error('User not found');

            if (credentials.pin !== user.pin) {
              throw new Error('Invalid PIN');
            }

            const { error: updateError } = await supabase
              .from('users')
              .update({ last_login: new Date().toISOString() })
              .eq('id', user.id);

            if (updateError) throw updateError;

            set({
              user: {
                id: user.id,
                username: user.username,
                mobileNumber: user.mobile_number,
                lastLogin: user.last_login,
                isAdmin: user.is_admin
              },
              isLoading: false,
              error: null,
              isOfflineLogin: false,
              lastLoginMode: 'online'
            });
          } else {
            const state = get();
            if (state.user && 
                (state.user.username === credentials.identifier || 
                 state.user.mobileNumber === credentials.identifier) && 
                credentials.pin === credentials.pin) {
              set({
                isLoading: false,
                error: null,
                isOfflineLogin: true,
                lastLoginMode: 'offline'
              });
            } else {
              throw new Error('Cannot verify credentials while offline');
            }
          }
        } catch (error) {
          console.error('Login error:', error);
          set({ 
            error: (error as Error).message || 'Failed to login', 
            isLoading: false 
          });
        }
      },

      register: async (credentials) => {
        if (!navigator.onLine) {
          set({ 
            error: 'Cannot register while offline', 
            isLoading: false 
          });
          return;
        }

        set({ isLoading: true, error: null });
        try {
          if (!credentials.username && !credentials.mobileNumber) {
            throw new Error('Username or mobile number is required');
          }

          const { data: existing } = await supabase
            .from('users')
            .select()
            .or(`username.eq.${credentials.username},mobile_number.eq.${credentials.mobileNumber}`);

          if (existing && existing.length > 0) {
            throw new Error('Username or mobile number already exists');
          }

          const { data: user, error: insertError } = await supabase
            .from('users')
            .insert({
              username: credentials.username,
              mobile_number: credentials.mobileNumber,
              pin: credentials.pin,
              is_admin: false
            })
            .select()
            .single();

          if (insertError) throw insertError;

          window.dispatchEvent(new Event('registrationSuccess'));

          set({
            isLoading: false,
            error: null,
            lastLoginMode: 'online'
          });
        } catch (error) {
          console.error('Registration error:', error);
          set({ 
            error: (error as Error).message || 'Failed to register', 
            isLoading: false 
          });
        }
      },

      logout: async () => {
        // Clear all stores
        useTableStore.getState().reset();
        useSyncStore.getState().reset();
        
        // Clear localStorage
        localStorage.removeItem('table-storage');
        localStorage.removeItem('sync-storage');
        
        // Reset auth store to initial state
        set(initialState);
      },

      clearError: () => set({ error: null }),

      setOfflineLogin: (status) => set({ isOfflineLogin: status })
    }),
    {
      name: 'auth-storage',
      version: 4,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: any, version: number) => {
        if (version < 4) {
          // Migrate to v4 schema
          return {
            ...initialState,
            ...persistedState,
            isOfflineLogin: false,
            lastLoginMode: null,
            error: null,
            isLoading: false
          };
        }
        return persistedState as AuthState;
      },
      onRehydrateStorage: () => (state) => {
        // Validate and clean state on rehydration
        if (state) {
          state.error = null;
          state.isLoading = false;
        }
      }
    }
  )
);