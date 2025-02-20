import { create } from 'zustand';
import { timeService } from '@/services/api/resource/time';

interface TimeState {
    serverTime: string | null;
    fetchServerTime: () => Promise<void>;
}

export const useTimeStore = create<TimeState>((set) => ({
    serverTime: null,
    fetchServerTime: async () => {
        try {
            const time = await timeService.getCurrentWibTime();
            set({ serverTime: time });
        } catch (error) {
            console.error('Error fetching server time:', error);
        }
    }
}));
