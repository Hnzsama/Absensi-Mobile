import { z } from "zod";

const permissionSchema = z.object({
    id: z.number(),
    name: z.string(),
    guard_name: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    pivot: z.object({
        role_id: z.number(),
        permission_id: z.number(),
    }).optional(),
});

const roleSchema = z.object({
    id: z.number(),
    name: z.string(),
    guard_name: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    pivot: z.object({
        model_type: z.string(),
        model_id: z.string(),
        role_id: z.number(),
    }).optional(),
    permissions: z.array(permissionSchema).optional(),
});

export const baseUserSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    email_verified_at: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    password: z.string().nullable().optional(),
    avatar_url: z.string().optional().nullable(),
    status: z.any(),
    created_at: z.string(),
    updated_at: z.string(),
    selectedIds: z.array(z.string()).nullable().optional(),
});

export const baseTeacherSchema = z.object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    name: z.string(),
    nip: z.string(),
    gender: z.enum(['Male', 'Female']),
    place_of_birth: z.string(),
    date_of_birth: z.string(),
    highest_education: z.string().nullable(),
    major: z.string().nullable(),
    university: z.string().nullable(),
    certification: z.string().nullable(),
    address: z.string(),
    phone: z.string().nullable(),
    email: z.string().email(),
    position: z.string().nullable(),
    subject: z.string().nullable(),
    year_started: z.string().or(z.number()),
    year_ended: z.string().or(z.number()).nullable(),
    work_experience: z.string().nullable(),
    status: z.any(),
    deleted_at: z.string().nullable(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    selectedIds: z.array(z.string()).nullable().optional(),
});

export const baseStudentSchema = z.object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    semester_id: z.string().uuid(),
    guardian_id: z.string().uuid(),
    classroom_id: z.string().uuid(),
    name: z.string(),
    nik: z.string(),
    nis: z.string(),
    gender: z.enum(['Male', 'Female']),
    place_of_birth: z.string(),
    date_of_birth: z.string(),
    address: z.string(),
    phone: z.string().nullable(),
    email: z.string().email(),
    status: z.enum(['Active', 'Graduated', 'Dropped Out']),
    enrollment_date: z.string(),
    graduation_date: z.string().nullable(),
    violation_points: z.number().default(100),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    deleted_at: z.string().datetime().nullable(),
    selectedIds: z.array(z.string()).nullable().optional(),
});

export const userSchema = baseUserSchema.extend({
    roles: z.array(roleSchema).optional(),
    teacher: baseTeacherSchema.optional().nullable(),
    student: baseStudentSchema.optional().nullable(),
});

export type User = z.infer<typeof userSchema>;
export type Teacher = z.infer<typeof baseTeacherSchema>;
export type Student = z.infer<typeof baseStudentSchema>;