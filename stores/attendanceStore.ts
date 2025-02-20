import { create } from 'zustand';
import { AttendanceResponse, Schedule, Agency, AttendanceSetting, Attendance } from '@/types/attendance';
import { attendanceService } from '@/services/api/resource/attendance';

interface AttendanceState {
    currentTime: string;
    attendances: Attendance[];
    currentSchedule: Schedule | null;
    agencies: Agency[] | null;
    settings: AttendanceSetting | null;
    isLoading: boolean;
    error: string | null;
    hasCheckedInToday: boolean;
    hasCheckedOutToday: boolean;
    currentServerTime: string | null;
    fetchAttendanceData: (attendableType: string, attendableId: string) => Promise<void>;
}

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
    currentTime: '',
    attendances: [],
    currentSchedule: null,
    agencies: [],
    settings: null,
    isLoading: false,
    error: null,
    hasCheckedInToday: false,
    hasCheckedOutToday: false,
    currentServerTime: null,

    fetchAttendanceData: async (attendableType: string, attendableId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await attendanceService.getAttendanceData(attendableType, attendableId);
            const currentSchedule = attendanceService.getCurrentDaySchedule(response.schedules);
            const hasCheckedIn = attendanceService.hasCheckedInToday(response.attendances);
            const hasCheckedOut = attendanceService.hasCheckedOutToday(response.attendances);
            
            set({
                currentTime: response.currentTime,
                attendances: response.attendances || [],
                currentSchedule,
                agencies: response.agencies,
                settings: response.attendance_setting,
                hasCheckedInToday: hasCheckedIn,
                hasCheckedOutToday: hasCheckedOut,
                currentServerTime: response.currentTime,
                error: null
            });
        } catch (error) {
            set({ 
                error: (error as Error).message,
                attendances: [],
                hasCheckedInToday: false
            });
        } finally {
            set({ isLoading: false });
        }
    }
}));