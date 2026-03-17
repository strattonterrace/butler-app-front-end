import { useState } from 'react'
import { Button, Input, Card } from '@/components/ui'
import { toast } from 'sonner'
import { Gear, Bell, ShieldCheck, SignOut } from '@phosphor-icons/react'

const TABS = [
    { key: 'general', label: 'General', icon: Gear },
    { key: 'security', label: 'Security', icon: ShieldCheck },
    { key: 'notifications', label: 'Notifications', icon: Bell },
]

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState('general')
    const [saved, setSaved] = useState(false)
    const handleSave = () => { setSaved(true); toast.success('Settings saved'); setTimeout(() => setSaved(false), 2000) }

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div className="page-section">
                <h1 className="heading-1">Admin Settings</h1>
                <p className="muted-text" style={{ marginTop: 4 }}>System configuration and preferences.</p>
            </div>

            <div className="page-section" style={{ display: 'flex', gap: 4, borderBottom: '1px solid #27272A', paddingBottom: 0 }}>
                {TABS.map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px',
                            fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer',
                            backgroundColor: 'transparent', borderBottom: activeTab === tab.key ? '2px solid #C9A84C' : '2px solid transparent',
                            color: activeTab === tab.key ? '#C9A84C' : '#71717A', transition: 'all 150ms', marginBottom: -1,
                        }}
                    >
                        <tab.icon size={16} /> {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'general' && (
                <div>
                    <Card style={{ marginBottom: 16 }}>
                        <h3 className="heading-2" style={{ marginBottom: 16 }}>Business Information</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <Input label="Business Name" value="Butler Concierge" />
                            <Input label="Contact Email" value="hello@butlerapp.com" />
                            <Input label="Support Phone" value="+1 (949) 555-2020" />
                            <Input label="Service Area" value="Orange County, CA" />
                        </div>
                    </Card>

                    <Card style={{ marginBottom: 16 }}>
                        <h3 className="heading-2" style={{ marginBottom: 16 }}>Subscription Settings</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <Input label="Monthly Price" value="$199" />
                            <Input label="Trial Period" value="None" />
                            <Input label="Payment Gateway" value="Stripe" style={{ color: '#71717A' }} />
                            <Input label="Currency" value="USD" style={{ color: '#71717A' }} />
                        </div>
                    </Card>

                    <Card style={{ marginBottom: 16 }}>
                        <h3 className="heading-2" style={{ marginBottom: 16 }}>Service Types</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {[
                                { name: 'Grocery Pickup', enabled: true },
                                { name: 'Pharmacy Pickup', enabled: true },
                                { name: 'Dry Cleaning', enabled: true },
                                { name: 'Package Drop-off', enabled: true },
                                { name: 'Retail Return', enabled: true },
                                { name: 'Food Pickup', enabled: true },
                            ].map((svc, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 5 ? '1px solid #1F1F23' : 'none' }}>
                                    <span style={{ fontSize: 14, color: '#F5F5F4' }}>{svc.name}</span>
                                    <label style={{ position: 'relative', width: 44, height: 24, cursor: 'pointer' }}>
                                        <input type="checkbox" defaultChecked={svc.enabled} style={{ display: 'none' }}
                                            onChange={(e) => {
                                                const track = e.target.nextSibling; const dot = track.querySelector('span')
                                                if (e.target.checked) { track.style.backgroundColor = '#C9A84C'; dot.style.transform = 'translateX(20px)' }
                                                else { track.style.backgroundColor = '#27272A'; dot.style.transform = 'translateX(0)' }
                                            }}
                                        />
                                        <div style={{ width: 44, height: 24, borderRadius: 12, backgroundColor: svc.enabled ? '#C9A84C' : '#27272A', padding: 2, transition: 'background-color 200ms' }}>
                                            <span style={{ display: 'block', width: 20, height: 20, borderRadius: '50%', backgroundColor: '#fff', transition: 'transform 200ms', transform: svc.enabled ? 'translateX(20px)' : 'translateX(0)' }} />
                                        </div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Button onClick={handleSave}>{saved ? '✓ Saved' : 'Save Settings'}</Button>
                        {saved && <span style={{ fontSize: 13, color: '#22C55E' }}>Settings saved successfully</span>}
                    </div>
                </div>
            )}

            {activeTab === 'security' && (
                <Card>
                    <h3 className="heading-2" style={{ marginBottom: 16 }}>Change Admin Password</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
                        <Input type="password" label="Current Password" placeholder="Enter current password" />
                        <Input type="password" label="New Password" placeholder="Min 8 characters" />
                        <Input type="password" label="Confirm New Password" placeholder="Repeat new password" />
                        <Button onClick={() => toast.success('Password updated')} style={{ alignSelf: 'flex-start' }}>Update Password</Button>
                    </div>
                </Card>
            )}

            {activeTab === 'notifications' && (
                <Card>
                    <h3 className="heading-2" style={{ marginBottom: 16 }}>Admin Notification Preferences</h3>
                    {[
                        { label: 'New request submitted', desc: 'Get notified when a client submits a request', default: true },
                        { label: 'Driver application received', desc: 'Get notified when someone applies to be a driver', default: true },
                        { label: 'Subscription changes', desc: 'Cancelled, past due, or new subscriptions', default: true },
                        { label: 'Request cancellations', desc: 'When clients cancel their requests', default: false },
                        { label: 'Daily summary', desc: 'Receive a daily email summary of all activity', default: true },
                    ].map((pref, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < 4 ? '1px solid #1F1F23' : 'none' }}>
                            <div>
                                <p style={{ fontSize: 14, fontWeight: 500, color: '#F5F5F4' }}>{pref.label}</p>
                                <p style={{ fontSize: 13, color: '#71717A' }}>{pref.desc}</p>
                            </div>
                            <label style={{ position: 'relative', width: 44, height: 24, cursor: 'pointer' }}>
                                <input type="checkbox" defaultChecked={pref.default} style={{ display: 'none' }}
                                    onChange={(e) => {
                                        const track = e.target.nextSibling; const dot = track.querySelector('span')
                                        if (e.target.checked) { track.style.backgroundColor = '#C9A84C'; dot.style.transform = 'translateX(20px)' }
                                        else { track.style.backgroundColor = '#27272A'; dot.style.transform = 'translateX(0)' }
                                    }}
                                />
                                <div style={{ width: 44, height: 24, borderRadius: 12, backgroundColor: pref.default ? '#C9A84C' : '#27272A', padding: 2, transition: 'background-color 200ms' }}>
                                    <span style={{ display: 'block', width: 20, height: 20, borderRadius: '50%', backgroundColor: '#fff', transition: 'transform 200ms', transform: pref.default ? 'translateX(20px)' : 'translateX(0)' }} />
                                </div>
                            </label>
                        </div>
                    ))}
                    <div style={{ marginTop: 16 }}><Button onClick={() => toast.success('Preferences saved')}>Save Preferences</Button></div>
                </Card>
            )}

            <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid #27272A' }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <SignOut size={18} /> Sign out
                </button>
            </div>
        </div>
    )
}
