import axios from 'axios';
import { axiosApiInstance } from '../axios';
import { Agency, Attendance, AttendanceForm, AttendanceSetting, Schedule } from '@/types/attendance';
import { Platform } from 'react-native';

interface AttendanceResponse {
    currentTime: string;
    attendances: Attendance[];
    schedules: Schedule[];
    agencies: Agency[];
    attendance_setting: AttendanceSetting;
}

interface AttendanceError {
    message: string;
    status?: number;
    data?: any;
    originalError?: any;
}

export const attendanceService = {
    async getAttendanceData(attendableType: string, attendableId: string): Promise<AttendanceResponse> {
        try {
            const response = await axiosApiInstance.get('/api/attendances', {
                params: {
                    attendable_type: attendableType,
                    attendable_id: attendableId
                }
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Unauthorized access. Please login again.');
                }
                throw new Error(error.response?.data?.message || 'Failed to fetch attendances');
            }
            throw error;
        }
    },

    async getSchedules(): Promise<Schedule[]> {
        try {
            const response = await axiosApiInstance.get('/api/schedules');
            return response.data.schedules;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch schedules');
            }
            throw error;
        }
    },

    async getAgencies(): Promise<Agency[]> {
        try {
            const response = await axiosApiInstance.get('/api/agencies');
            return response.data.agencies;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch agencies');
            }
            throw error;
        }
    },

    async getAttendanceSettings(): Promise<AttendanceSetting> {
        try {
            const response = await axiosApiInstance.get('/api/attendance-settings');
            return response.data.attendance_setting;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch attendance settings');
            }
            throw error;
        }
    },

    async storeAttendance(form: AttendanceForm): Promise<Attendance> {
        try {
            const formData = new FormData();
    
            Object.entries(form).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    if (key === 'photo_path' && typeof value === 'string') {
                        // Rename the field to match server expectations
                        formData.append('photo_path', {
                            uri: Platform.OS === 'ios' ? value.replace('file://', '') : value,
                            type: 'image/jpeg',
                            name: value.split('/').pop() || 'photo.jpg',
                        } as any);
                    } else {
                        formData.append(key, String(value));
                    }
                }
            });
    
            console.log('Sending form data:', {
                url: `${axiosApiInstance.defaults.baseURL}/api/attendances`,
                formData: Object.fromEntries(formData as any)
            });
    
            const response = await axiosApiInstance.post('/api/attendances', formData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 30000,
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
            });
    
            console.log(response.data)
            return response.data.attendance;
        } catch (error) {
            console.error('Full error details:', {
                error,
                isAxiosError: axios.isAxiosError(error),
                response: axios.isAxiosError(error) ? error.response : undefined,
                request: axios.isAxiosError(error) ? error.request : undefined,
                config: axios.isAxiosError(error) ? error.config : undefined
            });
    
            const attendanceError: AttendanceError = {
                message: 'Failed to store attendance',
                originalError: error
            };
    
            if (axios.isAxiosError(error)) {
                attendanceError.status = error.response?.status;
                attendanceError.data = error.response?.data;
    
                if (error.response?.status === 422) {
                    const validationErrors = error.response.data?.errors || {};
                    const errorMessages = Object.entries(validationErrors)
                        .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
                        .join('\n');
                    
                    attendanceError.message = errorMessages || 'Validation failed';
                } else {
                    attendanceError.message = error.response?.data?.message 
                        || error.message 
                        || 'Network request failed';
                }
            }
    
            throw attendanceError;
        }
    },

    getCurrentDaySchedule(schedules: Schedule[]): Schedule | null {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        return schedules.find(schedule => schedule.day === today) || null;
    },

    hasCheckedInToday(attendances: Attendance[]): boolean {
        // Get current date in WIB
        const now = new Date();
        const wibDate = new Date(now.getTime() + (7 * 60 * 60 * 1000));
        const today = wibDate.toISOString().split('T')[0];
        
        console.log('Checking attendance for WIB date:', today);
        return attendances.some(attendance => 
            attendance.date === today && attendance.check_in !== null
        );
    },

    hasCheckedOutToday(attendances: Attendance[]): boolean {
        // Get current date in WIB
        const now = new Date();
        const wibDate = new Date(now.getTime() + (7 * 60 * 60 * 1000));
        const today = wibDate.toISOString().split('T')[0];

        return attendances.some(attendance => 
            attendance.date === today && attendance.check_out !== null
        );
    },

    isWithinGracePeriod(schedule: Schedule): boolean {
        const now = new Date();
        const [hours, minutes] = schedule.entry_grace_period.split(':');
        const gracePeriod = new Date();
        gracePeriod.setHours(parseInt(hours), parseInt(minutes), 0);
        
        return now <= gracePeriod;
    }
};