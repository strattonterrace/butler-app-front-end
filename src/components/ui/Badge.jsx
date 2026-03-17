const VARIANT_STYLES = {
    default: { bg: '#1A1A1F', color: '#A1A1AA', border: '1px solid #27272A' },
    gold: { bg: 'rgba(201,168,76,0.1)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.25)' },
    success: { bg: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.25)' },
    warning: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.25)' },
    error: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.25)' },
    info: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.25)' },
    purple: { bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.25)' },
}

const SIZE_STYLES = {
    sm: { padding: '2px 8px', fontSize: 10 },
    md: { padding: '3px 10px', fontSize: 12 },
    lg: { padding: '4px 12px', fontSize: 13 },
}

function Badge({ variant = 'default', size = 'md', children, className, style, ...props }) {
    const v = VARIANT_STYLES[variant] || VARIANT_STYLES.default
    const s = SIZE_STYLES[size] || SIZE_STYLES.md

    return (
        <span
            className={className}
            style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                borderRadius: 999, fontWeight: 600,
                backgroundColor: v.bg, color: v.color, border: v.border,
                padding: s.padding, fontSize: s.fontSize,
                whiteSpace: 'nowrap', ...style,
            }}
            {...props}
        >
            {children}
        </span>
    )
}

export { Badge }
