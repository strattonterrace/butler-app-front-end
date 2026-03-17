import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function formatDate(date, options = {}) {
    const d = date instanceof Date ? date : new Date(date)
    const {
        format = 'short', // 'short' | 'long' | 'time' | 'relative'
    } = options

    if (format === 'relative') {
        const now = new Date()
        const diff = now - d
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (minutes < 1) return 'Just now'
        if (minutes < 60) return `${minutes}m ago`
        if (hours < 24) return `${hours}h ago`
        if (days < 7) return `${days}d ago`
    }

    if (format === 'time') {
        return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    }

    if (format === 'long') {
        return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    }

    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return 'morning'
    if (hour < 17) return 'afternoon'
    return 'evening'
}

export function getInitials(name) {
    if (!name) return '?'
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount)
}

export function capitalize(str) {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export const SERVICE_TYPES = {
    grocery: { label: 'Grocery Pickup', icon: 'Basket' },
    pharmacy: { label: 'Pharmacy Pickup', icon: 'Pill' },
    dry_cleaning: { label: 'Dry Cleaning', icon: 'TShirt' },
    package: { label: 'Package Drop-off', icon: 'Package' },
    retail_return: { label: 'Retail Return', icon: 'ArrowUUpLeft' },
    food_pickup: { label: 'Food Pickup', icon: 'CookingPot' },
}

export const STATUS_CONFIG = {
    submitted: { label: 'Submitted', color: 'text-status-submitted', bg: 'bg-status-submitted/10', border: 'border-status-submitted/30' },
    reviewed: { label: 'Reviewed', color: 'text-status-reviewed', bg: 'bg-status-reviewed/10', border: 'border-status-reviewed/30' },
    assigned: { label: 'Assigned', color: 'text-status-assigned', bg: 'bg-status-assigned/10', border: 'border-status-assigned/30' },
    in_progress: { label: 'In Progress', color: 'text-status-progress', bg: 'bg-status-progress/10', border: 'border-status-progress/30' },
    completed: { label: 'Completed', color: 'text-status-completed', bg: 'bg-status-completed/10', border: 'border-status-completed/30' },
    closed: { label: 'Closed', color: 'text-status-closed', bg: 'bg-status-closed/10', border: 'border-status-closed/30' },
    cancelled: { label: 'Cancelled', color: 'text-status-cancelled', bg: 'bg-status-cancelled/10', border: 'border-status-cancelled/30' },
}

export const ROLE_CONFIG = {
    client: { label: 'Client', color: 'text-info', bg: 'bg-info/10' },
    operator: { label: 'Operator', color: 'text-warning', bg: 'bg-warning/10' },
    driver: { label: 'Driver', color: 'text-success', bg: 'bg-success/10' },
    admin: { label: 'Admin', color: 'text-status-assigned', bg: 'bg-status-assigned/10' },
}
