import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button, Card } from '@/components/ui'
import { useAuthStore } from '@/store/authStore'
import { subscriptionsApi } from '@/api/subscriptions'
import { extractErrorMessage } from '@/api/client'
import { Check, Crown, ShieldCheck, Truck, EnvelopeSimple, Star, Lightning } from '@phosphor-icons/react'

const FEATURES = [
    { icon: Crown, text: 'Unlimited errand requests' },
    { icon: ShieldCheck, text: 'Vetted, approved drivers' },
    { icon: Star, text: 'Manual operator coordination' },
    { icon: EnvelopeSimple, text: 'Email status notifications' },
    { icon: Lightning, text: 'Priority fulfillment' },
    { icon: Truck, text: '6 service categories' },
]

export default function SubscribePage() {
    const navigate = useNavigate()
    const { currentUser, isAuthenticated } = useAuthStore()
    const [searchParams, setSearchParams] = useSearchParams()
    const [checkoutLoading, setCheckoutLoading] = useState(false)

    const subIsActive = currentUser?.subscription?.status === 'active'

    // Stripe sends the user back here with ?cancelled=true if they abandon checkout
    useEffect(() => {
        if (searchParams.get('cancelled') === 'true') {
            toast.info('Checkout cancelled', { description: 'You can subscribe whenever you\'re ready.' })
            setSearchParams({}, { replace: true })
        }
    }, [searchParams, setSearchParams])

    const handleSubscribe = async () => {
        if (!isAuthenticated) {
            navigate('/register')
            return
        }
        if (subIsActive) {
            navigate('/dashboard')
            return
        }
        setCheckoutLoading(true)
        try {
            const { checkoutUrl } = await subscriptionsApi.createCheckout()
            window.location.assign(checkoutUrl) // hand off to Stripe-hosted checkout
        } catch (error) {
            const alreadyActive = error?.response?.status === 409
            if (alreadyActive) {
                navigate('/dashboard')
                return
            }
            toast.error('Could not start checkout', { description: extractErrorMessage(error) })
            setCheckoutLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A0A0B', padding: 16 }}>
            <div style={{ width: '100%', maxWidth: 480, textAlign: 'center' }}>
                <img src="/images/butlerlogo.png" alt="Butler" style={{ height: 100, objectFit: 'contain', margin: '0 auto 8px' }} />
                <h1 style={{ fontSize: 24, fontWeight: 600, color: '#F5F5F4', marginBottom: 4 }}>
                    {currentUser ? `Welcome, ${currentUser.fullName.split(' ')[0]}` : 'Welcome to Butler'}
                </h1>
                <p style={{ fontSize: 15, color: '#71717A', marginBottom: 32 }}>Your premium personal concierge, on demand.</p>

                <div style={{
                    backgroundColor: '#111113', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 20,
                    padding: 32, position: 'relative', overflow: 'hidden',
                }}>
                    {/* Gold glow */}
                    <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.08), transparent)', pointerEvents: 'none' }} />

                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, backgroundColor: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', color: '#C9A84C', fontSize: 12, fontWeight: 600, marginBottom: 20 }}>
                        <Crown size={14} weight="fill" /> BUTLER PREMIUM
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4 }}>
                            <span style={{ fontSize: 48, fontWeight: 700, color: '#F5F5F4' }}>$199</span>
                            <span style={{ fontSize: 16, color: '#71717A' }}>/month</span>
                        </div>
                    </div>

                    <div style={{ textAlign: 'left', marginBottom: 28 }}>
                        {FEATURES.map((f, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < FEATURES.length - 1 ? '1px solid #1F1F23' : 'none' }}>
                                <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(201,168,76,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <f.icon size={16} style={{ color: '#C9A84C' }} />
                                </div>
                                <span style={{ fontSize: 14, color: '#A1A1AA' }}>{f.text}</span>
                            </div>
                        ))}
                    </div>

                    <Button
                        size="lg"
                        loading={checkoutLoading}
                        onClick={handleSubscribe}
                        style={{ width: '100%', height: 52, fontSize: 16 }}
                    >
                        {subIsActive ? 'Continue to Dashboard' : 'Subscribe — $199/month'}
                    </Button>

                    <p style={{ fontSize: 12, color: '#52525B', marginTop: 12 }}>
                        {subIsActive
                            ? 'Your membership is active.'
                            : 'Secure checkout powered by Stripe. Cancel anytime from Settings.'}
                    </p>

                    {!subIsActive && isAuthenticated && (
                        <button
                            onClick={() => navigate('/dashboard')}
                            style={{ marginTop: 16, fontSize: 13, color: '#71717A', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            Skip for now — explore the dashboard first
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
