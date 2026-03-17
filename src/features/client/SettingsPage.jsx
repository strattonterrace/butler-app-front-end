import { useState, useRef } from 'react'
import { useAuthStore } from '@/store/authStore'
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
    const { currentUser, logout } = useAuthStore()
    const [activeTab, setActiveTab] = useState('profile')
    usePageTitle('Settings')
    const [saved, setSaved] = useState(false)
    const [form, setForm] = useState({
        fullName: currentUser?.fullName || '',
        email: currentUser?.email || '',
        phone: '+1 (949) 555-0101',
        address: '456 Main St, Apt 12, Irvine, CA 92618',
    })
    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })
    const initialForm = useRef(form)
    const isDirty = JSON.stringify(form) !== JSON.stringify(initialForm.current)
    useUnsavedChanges(isDirty)

    const handleSave = () => { setSaved(true); toast.success('Changes saved'); setTimeout(() => setSaved(false), 2000) }

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
                            backgroundColor: 'transparent', borderBottom: activeTab === tab.key ? '2px solid #C9A84C' : '2px solid transparent',
                            color: activeTab === tab.key ? '#C9A84C' : '#71717A', transition: 'all 150ms',
                            marginBottom: -1,
                        }}
                    >
                        <tab.icon size={16} /> {tab.label}
                    </button>
                ))}
            </div>

            {/* Profile */}
            {activeTab === 'profile' && (
                <div>
                    <Card style={{ marginBottom: 16 }}>
                        <h3 className="heading-2" style={{ marginBottom: 16 }}>Personal Information</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <Input label="Full Name" value={form.fullName} onChange={update('fullName')} />
                            <Input label="Email" type="email" value={form.email} onChange={update('email')} />
                            <Input label="Phone" value={form.phone} onChange={update('phone')} />
                            <Input label="Default Address" value={form.address} onChange={update('address')} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
                            <Button onClick={handleSave}>{saved ? '✓ Saved' : 'Save Changes'}</Button>
                            {saved && <span style={{ fontSize: 13, color: '#22C55E' }}>Changes saved successfully</span>}
                        </div>
                    </Card>

                    <Card style={{ marginBottom: 16 }}>
                        <h3 className="heading-2" style={{ marginBottom: 8 }}>Subscription</h3>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #1F1F23' }}>
                            <div>
                                <p style={{ fontSize: 14, fontWeight: 500, color: '#F5F5F4' }}>Butler Premium</p>
                                <p style={{ fontSize: 13, color: '#71717A' }}>$199/month · Next billing Mar 15, 2026</p>
                            </div>
                            <span style={{ padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, backgroundColor: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.25)' }}>Active</span>
                        </div>
                        <div style={{ marginTop: 12 }}>
                            <Button variant="ghost" size="sm" onClick={() => toast.warning('Subscription cancelled', { description: 'You can reactivate anytime.' })} style={{ color: '#EF4444' }}>Cancel Subscription</Button>
                        </div>
                    </Card>

                    {/* Saved Addresses */}
                    <Card style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                            <h3 className="heading-2">Saved Addresses</h3>
                            <Button variant="secondary" size="sm">+ Add Address</Button>
                        </div>
                        {[
                            { label: 'Home', address: '456 Main St, Apt 12, Irvine, CA 92618', isDefault: true },
                            { label: 'Work', address: '100 Spectrum Center Dr, Irvine, CA 92618', isDefault: false },
                            { label: 'Parents', address: '789 Oak Ave, Newport Beach, CA 92660', isDefault: false },
                        ].map((addr, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 2 ? '1px solid #1F1F23' : 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#1A1A1F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                                        {addr.label === 'Home' ? '🏠' : addr.label === 'Work' ? '🏢' : '📍'}
                                    </div>
                                    <div>
                                        <p style={{ fontSize: 14, fontWeight: 500, color: '#F5F5F4' }}>
                                            {addr.label}
                                            {addr.isDefault && <span style={{ fontSize: 10, color: '#C9A84C', marginLeft: 6, padding: '1px 6px', borderRadius: 4, backgroundColor: 'rgba(201,168,76,0.1)' }}>DEFAULT</span>}
                                        </p>
                                        <p style={{ fontSize: 13, color: '#71717A' }}>{addr.address}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    <button style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, border: '1px solid #27272A', backgroundColor: 'transparent', color: '#A1A1AA', cursor: 'pointer' }}>Edit</button>
                                    <button style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, border: '1px solid #27272A', backgroundColor: 'transparent', color: '#71717A', cursor: 'pointer' }}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </Card>

                    <Card>
                        <h3 className="heading-2" style={{ marginBottom: 8, color: '#EF4444' }}>Danger Zone</h3>
                        <p style={{ fontSize: 14, color: '#71717A', marginBottom: 12 }}>Once you delete your account, there&apos;s no going back.</p>
                        <Button variant="destructive" size="sm" onClick={() => toast.error('Account deleted', { description: 'Your data has been removed.' })}>Delete Account</Button>
                    </Card>
                </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
                <Card>
                    <h3 className="heading-2" style={{ marginBottom: 16 }}>Change Password</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
                        <Input type="password" label="Current Password" placeholder="Enter current password" />
                        <Input type="password" label="New Password" placeholder="Min 8 characters" />
                        <Input type="password" label="Confirm New Password" placeholder="Repeat new password" />
                        <Button onClick={() => toast.success('Password updated')} style={{ alignSelf: 'flex-start' }}>Update Password</Button>
                    </div>
                </Card>
            )}

            {/* Notifications */}
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
                                <div style={{
                                    width: 44, height: 24, borderRadius: 12, transition: 'background-color 200ms',
                                    backgroundColor: pref.default ? '#C9A84C' : '#27272A', padding: 2,
                                }}>
                                    <span style={{
                                        display: 'block', width: 20, height: 20, borderRadius: '50%',
                                        backgroundColor: '#fff', transition: 'transform 200ms',
                                        transform: pref.default ? 'translateX(20px)' : 'translateX(0)',
                                    }} />
                                </div>
                            </label>
                        </div>
                    ))}
                    <div style={{ marginTop: 16 }}><Button onClick={() => toast.success('Preferences saved')}>Save Preferences</Button></div>
                </Card>
            )}

            {/* Logout */}
            <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid #27272A' }}>
                <button onClick={logout}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                    <SignOut size={18} /> Sign out
                </button>
            </div>
        </div>
    )
}
