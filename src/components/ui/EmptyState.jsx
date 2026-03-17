/**
 * EmptyState — displays icon + message + optional CTA
 * for empty data states (lists, tables, search results).
 */
export function EmptyState({ icon: Icon, title, description, action, onAction }) {
    return (
        <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            {Icon && (
                <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#1A1A1F', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <Icon size={24} style={{ color: '#71717A' }} />
                </div>
            )}
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#F5F5F4', marginBottom: 4 }}>{title}</h3>
            {description && <p style={{ fontSize: 14, color: '#71717A', maxWidth: 340, margin: '0 auto 16px' }}>{description}</p>}
            {action && onAction && (
                <button onClick={onAction}
                    style={{
                        padding: '8px 20px', borderRadius: 10, fontSize: 14, fontWeight: 500,
                        border: '1px solid #C9A84C', backgroundColor: 'rgba(201,168,76,0.08)',
                        color: '#C9A84C', cursor: 'pointer', transition: 'all 150ms',
                    }}
                >{action}</button>
            )}
        </div>
    )
}
