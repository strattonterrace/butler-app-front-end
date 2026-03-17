import { useOnlineStatus } from '@/hooks/useEdgeCases'

export function NetworkStatus() {
    const online = useOnlineStatus()

    if (online) return null

    return (
        <div style={{
            position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
            zIndex: 100, padding: '10px 20px', borderRadius: 12,
            backgroundColor: '#111113', border: '1px solid rgba(239,68,68,0.3)',
            color: '#EF4444', fontSize: 14, fontWeight: 500,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'Satoshi, sans-serif',
            animation: 'slideUp 300ms ease',
        }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#EF4444', animation: 'pulse 1.5s infinite' }} />
            You're offline — changes won't be saved
        </div>
    )
}
