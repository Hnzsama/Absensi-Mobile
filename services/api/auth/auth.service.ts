import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import { useStore, getStore } from '@/stores/rootStore';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const STORAGE_AUTH_TOKEN_KEY = '@auth_token';
const STORAGE_USER_DATA_KEY = '@user_data';
const REQUEST_TIMEOUT_MS = 10000;

interface ApiError {
    message: string;
    status?: number;
}

const axiosApiInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    timeout: REQUEST_TIMEOUT_MS,
});

axiosApiInstance.interceptors.request.use(async (config) => {
    const authToken = await AsyncStorage.getItem(STORAGE_AUTH_TOKEN_KEY);
    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
});

axiosApiInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const isUnauthorized = error.response?.status === 401;
        if (isUnauthorized) {
            await AsyncStorage.multiRemove([STORAGE_AUTH_TOKEN_KEY, STORAGE_USER_DATA_KEY]);
            getStore().setIsAuthenticated(false);
            getStore().setUser(null);
        }
        return Promise.reject(error);
    }
);

export const authService = {
    async getDeviceName(): Promise<string> {
        try {
            // Cek device ID yang tersimpan
            const storageKey = '@device_unique_id';
            let deviceId = await AsyncStorage.getItem(storageKey);
            
            if (!deviceId) {
                // Generate device ID baru jika belum ada
                deviceId = Math.random().toString(36).substring(2, 15);
                await AsyncStorage.setItem(storageKey, deviceId);
            }

            // Ambil informasi device
            const brand = Device.brand || 'Unknown';
            const modelName = Device.modelName || 'Device';
            const installationTime = await Application.getInstallationTimeAsync();
            
            // Buat identifier yang unik
            return `${brand}_${modelName}_${deviceId.substring(0, 6)}`;
        } catch (error) {
            return `Unknown_Device_${Math.random().toString(36).substring(2, 8)}`;
        }
    },

    async authenticateUser(email: string, password: string): Promise<any> {
        try {
            const deviceName = await this.getDeviceName();

            const authResponse = await axiosApiInstance.post('/api/login', {
                email,
                password,
                device_name: deviceName,
            });

            const { token } = authResponse.data;
            
            if (!token) {
                throw new Error('No token received from server');
            }

            // Store token
            await AsyncStorage.setItem(STORAGE_AUTH_TOKEN_KEY, token);
            
            // After storing token, fetch and store user data
            await this.fetchAuthenticatedUser();

            return authResponse.data;
        } catch (error) {
            const formattedError: ApiError = {
                message: 'Authentication failed'
            };

            if (axios.isAxiosError(error)) {
                formattedError.status = error.response?.status;
                formattedError.message = error.response?.data?.message || 'Network connection error';
            }

            throw formattedError;
        }
    },

    async fetchAuthenticatedUser(): Promise<any> {
        try {
            const userDataResponse = await axiosApiInstance.get('/api/user');
            const userData = userDataResponse.data;
            
            if (userData) {
                await AsyncStorage.setItem(STORAGE_USER_DATA_KEY, JSON.stringify(userData));
            }
            
            return userData;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                await this.terminateUserSession();
            }
            throw error;
        }
    },

    async verifyAuthenticationStatus(): Promise<boolean> {
        try {
            const storedAuthToken = await AsyncStorage.getItem(STORAGE_AUTH_TOKEN_KEY);
            if (!storedAuthToken) {
                return false;
            }
    
            // Try to get user data as verification
            const userData = await this.fetchAuthenticatedUser();
            if (!userData) {
                await AsyncStorage.multiRemove([STORAGE_AUTH_TOKEN_KEY, STORAGE_USER_DATA_KEY]);
                return false;
            }
            return true;
        } catch (error) {
            console.error('Auth verification failed:', error);
            await AsyncStorage.multiRemove([STORAGE_AUTH_TOKEN_KEY, STORAGE_USER_DATA_KEY]);
            return false;
        }
    },

    async terminateUserSession(): Promise<void> {
        try {
            await axiosApiInstance.post('/api/logout');
            const storageKeysToRemove = [STORAGE_AUTH_TOKEN_KEY, STORAGE_USER_DATA_KEY];
            await AsyncStorage.multiRemove(storageKeysToRemove);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Gagal melakukan logout. Silakan coba lagi.');
            }
            throw new Error('Terjadi kesalahan saat logout');
        }
    },

    async retrieveAuthToken(): Promise<string | null> {
        return await AsyncStorage.getItem(STORAGE_AUTH_TOKEN_KEY);
    }
};