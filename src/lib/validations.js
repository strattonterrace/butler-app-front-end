import { z } from 'zod'

// ── Auth Schemas ──

export const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
})

export const forgotPasswordSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Enter a valid email'),
})

// ── Request Schema ──

export const newRequestSchema = z.object({
    serviceType: z.string().min(1, 'Select a service type'),
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Please add more details (at least 10 characters)'),
    pickupLocation: z.string().min(3, 'Pickup location is required'),
    dropoffLocation: z.string().min(3, 'Drop-off location is required'),
    urgency: z.string().min(1, 'Select urgency level'),
    scheduledDate: z.string().optional(),
    specialInstructions: z.string().optional(),
})

// ── Settings Schemas ──

export const profileSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email'),
    phone: z.string().optional(),
    address: z.string().optional(),
})

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
})

// ── Operator Schema ──

export const createOperatorSchema = z.object({
    fullName: z.string().min(2, 'Name is required'),
    email: z.string().email('Enter a valid email'),
})
