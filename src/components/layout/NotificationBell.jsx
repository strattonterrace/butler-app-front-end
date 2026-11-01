/**
 * NotificationBell — the top-bar bell, now actually functional.
 *
 * Notifications are derived from the user's own recent requests (the list
 * endpoint is role-scoped by the backend, so this works for every role).
 * "Unread" = items updated since the last time this user opened the bell,
 * tracked per-user in localStorage. Opening the panel marks everything seen,
 * which clears the badge — the exact behaviour that was missing before.
 *
 * No backend changes needed: it reuses GET /requests/.
 */
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell } from '@phosphor-icons/react'
import { useAuthStore } from '@/store/authStore'
import { useEscapeKey } from '@/hooks/useEdgeCases'
import { requestsApi } from '@/api/requests'

// status → the headline a person actually understands
const STATUS_TEXT = {
    submitted: 'Request received',
    reviewed: 'Being reviewed',
    assigned: 'Driver assigned',
    in_progress: 'In progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
}

// where tapping a notification should land, per role
const DETAIL_ROUTE = {
    client: (id) => `/requests/${id}`,
    driver: (id) => `/driver/tasks/${id}`,
    operator: () => '/operator/queue',
    admin: () => '/admin/requests',
}

function statusText(status) {
    return STATUS_TEXT[status] || String(status || '').replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
}

function relativeTime(iso) {
    if (!iso) return ''
    const d = new Date(iso)
    const mins = Math.floor((Date.now() - d.getTime()) / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days < 7) return `${days}d ago`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function NotificationBell({ mobile = false }) {
    const { currentUser } = useAuthStore()
    const navigate = useNavigate()
    const role = currentUser?.role || 'client'
    const seenKey = `butler_notif_seen_${currentUser?.id || 'anon'}`

    const [open, setOpen] = useState(false)
    const [items, setItems] = useState([])
    const [seenAt, setSeenAt] = useState(() => {
        try { return localStorage.getItem(seenKey) || '' } catch { return '' }
    })
    // snapshot of "seen" taken when the panel opens, so items stay visually
    // marked "new" while the panel is open even though we've just cleared the badge
    const [highlightSince, setHighlightSince] = useState('')

    useEscapeKey(useCallback(() => setOpen(false), []))

    const load = useCallback(() => {
        requestsApi.list({ ordering: '-updated_at' })
            .then((data) => setItems((data?.results || []).slice(0, 12)))
            .catch(() => setItems([]))
    }, [])

    useEffect(() => { load() }, [load])

    const tsOf = (r) => r.updatedAt || r.createdAt || ''

    const unreadCount = useMemo(
        () => items.filter((r) => tsOf(r) && (!seenAt || new Date(tsOf(r)) > new Date(seenAt))).length,
        [items, seenAt],
    )

    const handleToggle = () => {
        const next = !open
        setOpen(next)
        if (next) {
            load()
            setHighlightSince(seenAt)
            const now = new Date().toISOString()
            try { localStorage.setItem(seenKey, now) } catch { /* private mode — badge just won't persist */ }
            setSeenAt(now)
        }
    }

    const handleItemClick = (r) => {
        setOpen(false)
        const route = DETAIL_ROUTE[role]
        if (route) navigate(route(r.id))
    }

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={handleToggle}
                aria-label="Notifications"
                style={{
                    position: 'relative', padding: mobile ? 6 : 8, borderRadius: 8, border: 'none',
                    cursor: 'pointer', backgroundColor: 'transparent', color: 'var(--c-text-2)',
                }}
            >
                <Bell size={mobile ? 18 : 20} weight="regular" />
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute', top: mobile ? 2 : 4, right: mobile ? 2 : 4,
                        minWidth: 15, height: 15, padding: '0 4px', borderRadius: 999,
                        backgroundColor: '#C9A84C', color: '#0A0A0B', fontSize: 9, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
                    }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <>
                    <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 30 }} />
                    <div style={{
                        position: 'absolute', top: '100%', right: 0, marginTop: 8,
                        width: mobile ? 280 : 320, maxWidth: '90vw',
                        backgroundColor: 'var(--c-surface)', border: '1px solid var(--c-border)',
                        borderRadius: 12, zIndex: 40, boxShadow: '0 10px 25px rgba(0,0,0,0.4)', overflow: 'hidden',
                    }}>
                        <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--c-divider)' }}>
                            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-text)' }}>Notifications</p>
                        </div>

                        <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                            {items.length === 0 ? (
                                <p style={{ fontSize: 13, color: '#71717A', padding: '20px 14px', textAlign: 'center' }}>
                                    You're all caught up.
                                </p>
                            ) : (
                                items.map((r) => {
                                    const isNew = tsOf(r) && (!highlightSince || new Date(tsOf(r)) > new Date(highlightSince))
                                    return (
                                        <button
                                            key={r.id}
                                            onClick={() => handleItemClick(r)}
                                            style={{
                                                display: 'flex', gap: 10, width: '100%', textAlign: 'left',
                                                padding: '11px 14px', border: 'none', cursor: 'pointer',
                                                backgroundColor: 'transparent', borderBottom: '1px solid var(--c-divider)',
                                                transition: 'background-color 150ms',
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--c-surface-2)'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <span style={{
                                                marginTop: 6, width: 7, height: 7, flexShrink: 0, borderRadius: '50%',
                                                backgroundColor: isNew ? '#C9A84C' : 'transparent',
                                            }} />
                                            <span style={{ minWidth: 0, flex: 1 }}>
                                                <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--c-text)' }}>
                                                    {statusText(r.status)}
                                                </span>
                                                <span style={{ display: 'block', fontSize: 12, color: '#71717A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {r.title || 'Your request'}
                                                </span>
                                                <span style={{ display: 'block', fontSize: 11, color: '#71717A', marginTop: 2 }}>
                                                    {relativeTime(tsOf(r))}
                                                </span>
                                            </span>
                                        </button>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
