import { axiosApiInstance } from '../axios';

export const timeService = {
    async getCurrentWibTime(): Promise<string> {
        try {
            const response = await axiosApiInstance.get('/api/currentWib');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch server time:', error);
            throw error;
        }
    }
};
