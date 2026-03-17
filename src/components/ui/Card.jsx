import { useIsMobile } from '@/hooks/useEdgeCases'

function Card({ children, interactive, style, className, ...props }) {
    const mobile = useIsMobile()
    return (
        <div
            className={className}
            style={{
                borderRadius: mobile ? 12 : 14, border: '1px solid #27272A', backgroundColor: '#111113',
                padding: mobile ? 14 : 20, transition: 'all 150ms ease',
                cursor: interactive ? 'pointer' : 'default',
                ...style,
            }}
            onMouseEnter={interactive ? (e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)' } : undefined}
            onMouseLeave={interactive ? (e) => { e.currentTarget.style.borderColor = '#27272A'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' } : undefined}
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
    return <h3 style={{ fontSize: 18, fontWeight: 600, color: '#F5F5F4', ...style }} {...props}>{children}</h3>
}

function CardDescription({ children, style, ...props }) {
    return <p style={{ fontSize: 14, color: '#71717A', ...style }} {...props}>{children}</p>
}

function CardContent({ children, style, ...props }) {
    return <div style={style} {...props}>{children}</div>
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent }

