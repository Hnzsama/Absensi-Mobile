import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const REQUEST_TIMEOUT_MS = 10000;
const STORAGE_AUTH_TOKEN_KEY = '@auth_token';

export const axiosApiInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    timeout: REQUEST_TIMEOUT_MS,
});

axiosApiInstance.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem(STORAGE_AUTH_TOKEN_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosApiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const isUnauthorized = error.response?.status === 401;
        if (isUnauthorized) {
            await AsyncStorage.removeItem(STORAGE_AUTH_TOKEN_KEY);
        }
        return Promise.reject(error);
    }
);
