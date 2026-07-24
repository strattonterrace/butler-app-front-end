import { useIsMobile } from '@/hooks/useEdgeCases'
import { useUIStore } from '@/store/uiStore'

function Card({ children, interactive, style, className, ...props }) {
    const mobile = useIsMobile()
    const { theme } = useUIStore()
    const isLight = theme === 'light'

    return (
        <div
            className={className}
            style={{
                borderRadius: mobile ? 12 : 14,
                border: `1px solid ${isLight ? '#E4E4E7' : '#27272A'}`,
                backgroundColor: isLight ? '#FFFFFF' : '#111113',
                padding: mobile ? 14 : 20, transition: 'all 150ms ease',
                cursor: interactive ? 'pointer' : 'default',
                ...style,
            }}
            onMouseEnter={interactive ? (e) => {
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = isLight ? '0 8px 25px rgba(0,0,0,0.08)' : '0 8px 25px rgba(0,0,0,0.3)'
            } : undefined}
            onMouseLeave={interactive ? (e) => {
                e.currentTarget.style.borderColor = isLight ? '#E4E4E7' : '#27272A'
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = 'none'
            } : undefined}
            {...props}
        >
            {children}
        </div>
    )
}

function CardHeader({ children, style, ...props }) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, ...style }} {...props}>{children}</div>
}

function CardTitle({ children, style, ...props }) {
    const { theme } = useUIStore()
    return <h3 style={{ fontSize: 18, fontWeight: 600, color: theme === 'light' ? '#1C1917' : '#F5F5F4', ...style }} {...props}>{children}</h3>
}

function CardDescription({ children, style, ...props }) {
    return <p style={{ fontSize: 14, color: '#71717A', ...style }} {...props}>{children}</p>
}

function CardContent({ children, style, ...props }) {
    return <div style={style} {...props}>{children}</div>
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent }

