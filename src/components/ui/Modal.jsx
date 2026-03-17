/**
 * Reusable Modal component — dark overlay, centered panel,
 * escape-to-close, click-outside-to-close. Matches scope section 11.1.
 */
export function Modal({ open, onClose, title, children, maxWidth = 480 }) {
    if (!open) return null
    return (
        <>
            <div onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 40 }} />
            <div style={{
                position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 50,
                width: '100%', maxWidth, backgroundColor: '#111113', border: '1px solid #27272A',
                borderRadius: 16, boxShadow: '0 20px 40px rgba(0,0,0,0.5)', overflow: 'hidden',
            }}>
                {title && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #27272A' }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#F5F5F4' }}>{title}</h3>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717A', padding: 4, fontSize: 18, lineHeight: 1 }}>✕</button>
                    </div>
                )}
                <div style={{ padding: 20 }}>{children}</div>
            </div>
        </>
    )
}
