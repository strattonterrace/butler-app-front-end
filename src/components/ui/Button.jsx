import { forwardRef } from 'react'
import { SpinnerGap } from '@phosphor-icons/react'
import { useIsMobile } from '@/hooks/useEdgeCases'

const VARIANTS = {
    primary: { bg: '#C9A84C', color: '#0A0A0B', border: 'none', hoverBg: '#DAC06A', fontWeight: 600 },
    secondary: { bg: '#1A1A1F', color: '#F5F5F4', border: '1px solid #27272A', hoverBg: '#252530', fontWeight: 500 },
    ghost: { bg: 'transparent', color: '#A1A1AA', border: 'none', hoverBg: '#252530', fontWeight: 500 },
    destructive: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', hoverBg: 'rgba(239,68,68,0.2)', fontWeight: 500 },
}

const SIZES = {
    sm: { height: 34, padding: '0 14px', fontSize: 13, borderRadius: 8 },
    md: { height: 40, padding: '0 18px', fontSize: 14, borderRadius: 10 },
    lg: { height: 48, padding: '0 24px', fontSize: 15, borderRadius: 12 },
    icon: { height: 40, width: 40, padding: 0, fontSize: 14, borderRadius: 10 },
}

const MOBILE_SIZES = {
    sm: { height: 30, padding: '0 10px', fontSize: 12, borderRadius: 8 },
    md: { height: 36, padding: '0 14px', fontSize: 13, borderRadius: 10 },
    lg: { height: 42, padding: '0 18px', fontSize: 14, borderRadius: 12 },
    icon: { height: 36, width: 36, padding: 0, fontSize: 13, borderRadius: 10 },
}

const Button = forwardRef(({ variant = 'primary', size = 'md', loading, children, disabled, className, style, ...props }, ref) => {
    const v = VARIANTS[variant] || VARIANTS.primary
    const mobile = useIsMobile()
    const s = (mobile ? MOBILE_SIZES : SIZES)[size] || SIZES.md

    return (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={className}
            style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: mobile ? 6 : 8,
                height: s.height, padding: s.padding, fontSize: s.fontSize, borderRadius: s.borderRadius,
                backgroundColor: v.bg, color: v.color, border: v.border, fontWeight: v.fontWeight,
                width: s.width, cursor: disabled || loading ? 'not-allowed' : 'pointer',
                opacity: disabled || loading ? 0.5 : 1, transition: 'all 150ms ease',
                fontFamily: 'inherit', letterSpacing: '-0.01em', ...style,
            }}
            {...props}
        >
            {loading && <SpinnerGap className="animate-spin" size={mobile ? 14 : 16} weight="bold" />}
            {children}
        </button>
    )
})
Button.displayName = 'Button'

export { Button }

