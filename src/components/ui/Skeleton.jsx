/**
 * Skeleton — animated loading placeholder that pulses.
 * Use to show loading state before data arrives.
 */
export function Skeleton({ width, height = 16, borderRadius = 6, style = {} }) {
    return (
        <div style={{
            width: width || '100%', height, borderRadius,
            backgroundColor: 'var(--c-surface-2)',
            animation: 'skeleton-pulse 1.5s ease-in-out infinite',
            ...style,
        }} />
    )
}

/**
 * SkeletonCard — full card-shaped skeleton for page loading
 */
export function SkeletonCard({ lines = 3, style = {} }) {
    return (
        <div style={{
            backgroundColor: 'var(--c-surface)', border: '1px solid var(--c-border)',
            borderRadius: 14, padding: 20, ...style,
        }}>
            <Skeleton width="40%" height={18} style={{ marginBottom: 12 }} />
            {Array.from({ length: lines }, (_, i) => (
                <Skeleton key={i} width={`${80 - i * 15}%`} style={{ marginBottom: 8 }} />
            ))}
        </div>
    )
}

/**
 * SkeletonTable — table-shaped skeleton for data loading
 */
export function SkeletonTable({ rows = 5, cols = 4, style = {} }) {
    return (
        <div style={{
            backgroundColor: 'var(--c-surface)', border: '1px solid var(--c-border)',
            borderRadius: 14, overflow: 'hidden', ...style,
        }}>
            {/* Header row */}
            <div style={{ display: 'flex', gap: 16, padding: '14px 16px', borderBottom: '1px solid var(--c-border)' }}>
                {Array.from({ length: cols }, (_, i) => (
                    <Skeleton key={i} width={`${100 / cols - 4}%`} height={12} borderRadius={4} />
                ))}
            </div>
            {/* Data rows */}
            {Array.from({ length: rows }, (_, r) => (
                <div key={r} style={{ display: 'flex', gap: 16, padding: '14px 16px', borderBottom: '1px solid var(--c-divider)' }}>
                    {Array.from({ length: cols }, (_, c) => (
                        <Skeleton key={c} width={`${100 / cols - 4}%`} height={14} borderRadius={4} />
                    ))}
                </div>
            ))}
        </div>
    )
}
