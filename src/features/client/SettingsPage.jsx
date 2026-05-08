import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/auth'
import { extractErrorMessage } from '@/api/client'
import { toast } from 'sonner'
import { Button, Input, Card } from '@/components/ui'
import { useUnsavedChanges, usePageTitle } from '@/hooks/useEdgeCases'
import { User, Lock, Bell, SignOut } from '@phosphor-icons/react'

const TABS = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'security', label: 'Security', icon: Lock },
    { key: 'notifications', label: 'Notifications', icon: Bell },
]

export default function SettingsPage() {
    const { currentUser, logout, setUser } = useAuthStore()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('profile')
    usePageTitle('Settings')

    // ── Profile tab ───────────────────────────────────────────────────────────
    const [form, setForm] = useState({
        fullName: currentUser?.fullName || '',
        phone: currentUser?.phone || '',
    })
    const [saving, setSaving] = useState(false)
    const initialForm = useRef(form)
    const isDirty = JSON.stringify(form) !== JSON.stringify(initialForm.current)
    useUnsavedChanges(isDirty)
    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

    const handleSave = async () => {
        setSaving(true)
        try {
            const updated = await authApi.updateMe({ fullName: form.fullName, phone: form.phone })
            setUser(updated)
            initialForm.current = { fullName: updated.fullName, phone: updated.phone || '' }
            toast.success('Changes saved')
        } catch (error) {
            toast.error('Save failed', { description: extractErrorMessage(error) })
        } finally {
            setSaving(false)
        }
    }

    // ── Security tab ──────────────────────────────────────────────────────────
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
    const [pwLoading, setPwLoading] = useState(false)
    const updatePw = (field) => (e) => setPwForm({ ...pwForm, [field]: e.target.value })

    const handlePasswordChange = async () => {
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }
        if (pwForm.newPassword.length < 8) {
            toast.error('New password must be at least 8 characters')
            return
        }
        setPwLoading(true)
        try {
            await authApi.changePassword(pwForm)
            setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
            toast.success('Password updated', { description: 'You\'ll need to use your new password next time you sign in.' })
        } catch (error) {
            toast.error('Password change failed', { description: extractErrorMessage(error) })
        } finally {
            setPwLoading(false)
        }
    }

    // ── Delete account ────────────────────────────────────────────────────────
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deletePassword, setDeletePassword] = useState('')
    const [deleteLoading, setDeleteLoading] = useState(false)

    const handleDeleteAccount = async () => {
        if (!deletePassword) {
            toast.error('Please enter your password to confirm')
            return
        }
        setDeleteLoading(true)
        try {
            await authApi.deleteMe({ password: deletePassword })
            await logout()
            toast.success('Account deleted', { description: 'Your account has been deactivated.' })
            navigate('/login')
        } catch (error) {
            toast.error('Delete failed', { description: extractErrorMessage(error) })
        } finally {
            setDeleteLoading(false)
        }
    }

    // ── Logout ────────────────────────────────────────────────────────────────
    const handleLogout = async () => {
        await logout()
        toast('Signed out', { description: 'See you next time.' })
        navigate('/login')
    }

    // ── Subscription display ──────────────────────────────────────────────────
    const sub = currentUser?.subscription
    const subIsActive = sub?.status === 'active'

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div className="page-section">
                <h1 className="heading-1">Settings</h1>
                <p className="muted-text" style={{ marginTop: 4 }}>Manage your account and preferences.</p>
            </div>

            {/* Tabs */}
            <div className="page-section" style={{ display: 'flex', gap: 4, borderBottom: '1px solid #27272A', paddingBottom: 0 }}>
                {TABS.map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px',
                            fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer',
                            backgroundColor: 'transparent',
                            borderBottom: activeTab === tab.key ? '2px solid #C9A84C' : '2px solid transparent',
                            color: activeTab === tab.key ? '#C9A84C' : '#71717A',
                            transition: 'all 150ms', marginBottom: -1,
                        }}
                    >
                        <tab.icon size={16} /> {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Profile Tab ── */}
            {activeTab === 'profile' && (
                <div>
                    <Card style={{ marginBottom: 16 }}>
                        <h3 className="heading-2" style={{ marginBottom: 16 }}>Personal Information</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <Input label="Full Name" value={form.fullName} onChange={update('fullName')} />
                            <Input label="Email" type="email" value={currentUser?.email || ''} disabled
                                style={{ opacity: 0.6, cursor: 'not-allowed' }}
                            />
                            <Input label="Phone" value={form.phone} onChange={update('phone')} placeholder="+1 (555) 000-0000" />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
                            <Button onClick={handleSave} loading={saving} disabled={!isDirty || saving}>
                                Save Changes
                            </Button>
                            {isDirty && !saving && (
                                <span style={{ fontSize: 13, color: '#71717A' }}>You have unsaved changes</span>
                            )}
                        </div>
                    </Card>

                    {/* Subscription */}
                    <Card style={{ marginBottom: 16 }}>
                        <h3 className="heading-2" style={{ marginBottom: 8 }}>Subscription</h3>
                        {subIsActive ? (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #1F1F23' }}>
                                    <div>
                                        <p style={{ fontSize: 14, fontWeight: 500, color: '#F5F5F4' }}>Butler Premium</p>
                                        <p style={{ fontSize: 13, color: '#71717A' }}>
                                            {sub.plan}
                                            {sub.nextBilling ? ` · Next billing ${new Date(sub.nextBilling).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : ''}
                                        </p>
                                    </div>
                                    <span style={{ padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, backgroundColor: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.25)' }}>
                                        Active
                                    </span>
                                </div>
                                <div style={{ marginTop: 12 }}>
                                    <Button variant="ghost" size="sm" style={{ color: '#EF4444' }}
                                        onClick={() => toast.info('Subscription cancellation coming in M2', { description: 'Stripe integration is in the next milestone.' })}>
                                        Cancel Subscription
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div style={{ padding: '12px 0' }}>
                                <p style={{ fontSize: 14, color: '#71717A', marginBottom: 12 }}>
                                    No active subscription. Subscribe to unlock all features.
                                </p>
                                <Button size="sm" onClick={() => navigate('/subscribe')}>Choose a Plan</Button>
                            </div>
                        )}
                    </Card>

                    {/* Saved Addresses — CRUD endpoints land in M3 */}
                    <Card style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                            <h3 className="heading-2">Saved Addresses</h3>
                            <Button variant="secondary" size="sm"
                                onClick={() => toast.info('Saved addresses coming in M3')}>
                                + Add Address
                            </Button>
                        </div>
                        <p style={{ fontSize: 13, color: '#71717A', padding: '8px 0' }}>
                            Address management will be available in the next update.
                        </p>
                    </Card>

                    {/* Danger Zone */}
                    <Card>
                        <h3 className="heading-2" style={{ marginBottom: 8, color: '#EF4444' }}>Danger Zone</h3>
                        <p style={{ fontSize: 14, color: '#71717A', marginBottom: 12 }}>
                            Deleting your account suspends access immediately. This cannot be undone.
                        </p>
                        {!showDeleteConfirm ? (
                            <Button variant="destructive" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                                Delete Account
                            </Button>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 360 }}>
                                <p style={{ fontSize: 13, color: '#EF4444' }}>Enter your password to confirm:</p>
                                <Input
                                    type="password"
                                    placeholder="Your current password"
                                    value={deletePassword}
                                    onChange={(e) => setDeletePassword(e.target.value)}
                                />
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <Button variant="destructive" size="sm" loading={deleteLoading} onClick={handleDeleteAccount}>
                                        Confirm Delete
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => { setShowDeleteConfirm(false); setDeletePassword('') }}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            )}

            {/* ── Security Tab ── */}
            {activeTab === 'security' && (
                <Card>
                    <h3 className="heading-2" style={{ marginBottom: 16 }}>Change Password</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
                        <Input type="password" label="Current Password" placeholder="Enter current password"
                            value={pwForm.currentPassword} onChange={updatePw('currentPassword')} />
                        <Input type="password" label="New Password" placeholder="Min 8 characters"
                            value={pwForm.newPassword} onChange={updatePw('newPassword')} />
                        <Input type="password" label="Confirm New Password" placeholder="Repeat new password"
                            value={pwForm.confirmPassword} onChange={updatePw('confirmPassword')} />
                        <Button loading={pwLoading} onClick={handlePasswordChange} style={{ alignSelf: 'flex-start' }}>
                            Update Password
                        </Button>
                    </div>
                </Card>
            )}

            {/* ── Notifications Tab ── */}
            {activeTab === 'notifications' && (
                <Card>
                    <h3 className="heading-2" style={{ marginBottom: 16 }}>Notification Preferences</h3>
                    {[
                        { label: 'Request status updates', desc: 'Get notified when your request status changes', default: true },
                        { label: 'Driver assigned', desc: 'Get notified when a driver is assigned to your request', default: true },
                        { label: 'Request completed', desc: 'Get notified when your request is completed', default: true },
                        { label: 'Marketing emails', desc: 'Receive promotional emails and offers', default: false },
                    ].map((pref, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < 3 ? '1px solid #1F1F23' : 'none' }}>
                            <div>
                                <p style={{ fontSize: 14, fontWeight: 500, color: '#F5F5F4' }}>{pref.label}</p>
                                <p style={{ fontSize: 13, color: '#71717A' }}>{pref.desc}</p>
                            </div>
                            <label style={{ position: 'relative', width: 44, height: 24, cursor: 'pointer' }}>
                                <input type="checkbox" defaultChecked={pref.default} style={{ display: 'none' }}
                                    onChange={(e) => {
                                        const dot = e.target.nextSibling.querySelector('span')
                                        const track = e.target.nextSibling
                                        if (e.target.checked) { track.style.backgroundColor = '#C9A84C'; dot.style.transform = 'translateX(20px)' }
                                        else { track.style.backgroundColor = '#27272A'; dot.style.transform = 'translateX(0)' }
                                    }}
                                />
                                <div style={{ width: 44, height: 24, borderRadius: 12, transition: 'background-color 200ms', backgroundColor: pref.default ? '#C9A84C' : '#27272A', padding: 2 }}>
                                    <span style={{ display: 'block', width: 20, height: 20, borderRadius: '50%', backgroundColor: '#fff', transition: 'transform 200ms', transform: pref.default ? 'translateX(20px)' : 'translateX(0)' }} />
                                </div>
                            </label>
                        </div>
                    ))}
                    <div style={{ marginTop: 16 }}>
                        <Button onClick={() => toast.success('Preferences saved')}>Save Preferences</Button>
                    </div>
                </Card>
            )}

            {/* Sign out */}
            <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid #27272A' }}>
                <button onClick={handleLogout}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                    <SignOut size={18} /> Sign out
                </button>
            </div>
        </div>
    )
}
