export interface Attendance {
    id: string;
    attendable_type: string;
    attendable_id: string;
    date: string;
    check_in: string | null;
    check_out: string | null;
    status: string;
    location_latitude: string | null;
    location_longitude: string | null;
    device_info: string;
    photo_path: string;
    notes: string | null;
}

export type AttendanceForm = Pick<Attendance,
    | 'attendable_type'
    | 'attendable_id'
    | 'date'
    | 'location_latitude'
    | 'location_longitude'
    | 'device_info'
    | 'photo_path'
    | 'notes'
>;

export interface Schedule {
    id: string;
    day: string;
    start_time: string;
    end_time: string;
    entry_grace_period: string;
    exit_grace_period: string;
    status: number;
}

export interface Agency {
    id: string;
    name: string;
    address: string;
    longitude: string;
    latitude: string;
    agencyable_type: string;
    agencyable_id: string;
    status: number;
}

export interface AttendanceSetting {
    id: string;
    require_biometric: number;
    allow_location_based: number;
    allowed_radius: string;
}

export interface AttendanceResponse {
    attendances: Attendance[];
    schedules: Schedule[];
    agencies: Agency[];
    attendance_setting: AttendanceSetting;
}
