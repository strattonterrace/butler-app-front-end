import { Button } from '@/components/ui'

export function ConfirmDialog({ open, title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'destructive', onConfirm, onCancel }) {
    if (!open) return null
    return (
        <>
            <div onClick={onCancel} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 50 }} />
            <div style={{
                position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 60,
                width: '100%', maxWidth: 400, backgroundColor: '#111113', border: '1px solid #27272A',
                borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#F5F5F4', marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 14, color: '#71717A', lineHeight: 1.6, marginBottom: 20 }}>{message}</p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <Button variant="secondary" size="sm" onClick={onCancel}>{cancelText}</Button>
                    <Button variant={variant} size="sm" onClick={onConfirm}>{confirmText}</Button>
                </div>
            </div>
        </>
    )
}
