import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '@/services/api/auth/auth.service';
import { User } from '@/types/user';

interface RootState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    setIsAuthenticated: (value: boolean) => void;
    setUser: (user: User | null) => void;
}

export const useStore = create<RootState>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            login: async (email: string, password: string) => {
                if (get().isLoading) return;
                
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.authenticateUser(email, password);
                    const userData = await authService.fetchAuthenticatedUser();
                    set({ 
                        token: response.token,
                        user: userData,
                        isAuthenticated: true,
                        error: null
                    });
                } catch (error: any) {
                    set({ 
                        error: error.message || 'Authentication failed',
                        isAuthenticated: false 
                    });
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },
            logout: async () => {
                set({ isLoading: true });
                try {
                    await authService.terminateUserSession();
                } finally {
                    set({ 
                        token: null,
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null
                    });
                }
            },
            checkAuth: async () => {
                if (get().isLoading) return;
                
                set({ isLoading: true });
                try {
                    const isAuthenticated = await authService.verifyAuthenticationStatus();
                    if (isAuthenticated) {
                        const userData = await authService.fetchAuthenticatedUser();
                        const token = await authService.retrieveAuthToken();
                        set({ user: userData, token, isAuthenticated: true });
                    }
                } catch (error) {
                    set({ isAuthenticated: false });
                } finally {
                    set({ isLoading: false });
                }
            },
            setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
            setUser: (user: User | null) => set({ user }),
        }),
        {
            name: 'root-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

// Tambahkan ini untuk akses store dari luar React components
export const getStore = () => useStore.getState();