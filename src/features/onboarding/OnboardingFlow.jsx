import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/auth'
import { territoriesApi } from '@/api/territories'
import { extractErrorMessage } from '@/api/client'
import { registerSchema } from '@/lib/validations'
import { SERVICE_TYPES } from '@/lib/utils'
import { Button, Input } from '@/components/ui'
import { Eye, EyeSlash, MapPin, CheckCircle, Basket, Pill, TShirt, Package, ArrowUUpLeft, CookingPot, ShieldCheck } from '@phosphor-icons/react'

const SERVICE_ICONS = { grocery: Basket, pharmacy: Pill, dry_cleaning: TShirt, package: Package, retail_return: ArrowUUpLeft, food_pickup: CookingPot }

const SHELL = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A0A0B', padding: 16 }
const CARD = { backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 16, padding: 32 }
const ERR = { fontSize: 12, color: '#EF4444', marginTop: 4 }

function StepDots({ active }) {
    // 3 real steps: location, account, personalize (payment is the Stripe page)
    return (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 24 }}>
            {[0, 1, 2].map(i => (
                <div key={i} style={{
                    height: 4, width: i === active ? 28 : 16, borderRadius: 2,
                    backgroundColor: i <= active ? '#C9A84C' : '#27272A', transition: 'all 200ms',
                }} />
            ))}
        </div>
    )
}

export default function OnboardingFlow() {
    const navigate = useNavigate()
    const { register: registerUser, setUser } = useAuthStore()

    const [step, setStep] = useState('location') // location | account | personalize | waitlisted
    const [territory, setTerritory] = useState(null)
    const [zip, setZip] = useState('')
    const [servedAreas, setServedAreas] = useState([])
    const [busy, setBusy] = useState(false)

    useEffect(() => {
        territoriesApi.served().then(setServedAreas).catch(() => setServedAreas([]))
    }, [])

    // ── Step 1: location gate ──────────────────────────────────────────
    const checkLocation = async (e) => {
        e.preventDefault()
        const z = zip.trim()
        if (!/^\d{5}$/.test(z)) {
            toast.error('Enter a 5-digit ZIP code')
            return
        }
        setBusy(true)
        try {
            const { served, territory: t } = await territoriesApi.check(z)
            if (served) {
                setTerritory(t)
                setStep('account')
            } else {
                setStep('waitlisted-form')
            }
        } catch (error) {
            toast.error('Could not check your area', { description: extractErrorMessage(error) })
        } finally {
            setBusy(false)
        }
    }

    if (step === 'location' || step === 'waitlisted-form' || step === 'waitlisted') {
        return (
            <div style={SHELL}>
                <div style={{ width: '100%', maxWidth: 440 }}>
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                        <img src="/images/butlerlogo.png" alt="Butler" style={{ height: 100, objectFit: 'contain', margin: '0 auto' }} />
                    </div>
                    <div style={CARD}>
                        {step === 'location' && (
                            <>
                                <StepDots active={0} />
                                <h2 style={{ fontSize: 22, fontWeight: 600, color: '#F5F5F4', marginBottom: 6, fontFamily: "'Satoshi', sans-serif", textAlign: 'center' }}>Is Butler in your area?</h2>
                                <p style={{ fontSize: 14, color: '#71717A', marginBottom: 24, textAlign: 'center' }}>We&apos;re a local, hands-on membership. Let&apos;s make sure we can serve you first.</p>
                                <form onSubmit={checkLocation} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div style={{ position: 'relative' }}>
                                        <MapPin size={18} style={{ position: 'absolute', left: 14, top: 38, color: '#71717A' }} />
                                        <Input label="Your ZIP code" placeholder="92618" inputMode="numeric" maxLength={5}
                                            value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))}
                                            style={{ paddingLeft: 40 }} />
                                    </div>
                                    <Button type="submit" size="lg" loading={busy} style={{ width: '100%' }}>Check availability</Button>
                                </form>
                                {servedAreas.length > 0 && (
                                    <p style={{ fontSize: 12, color: '#52525B', marginTop: 16, textAlign: 'center' }}>
                                        Currently serving: {servedAreas.map(a => a.name).join(' · ')}
                                    </p>
                                )}
                            </>
                        )}

                        {step === 'waitlisted-form' && (
                            <WaitlistForm zip={zip} onJoined={() => setStep('waitlisted')} onBack={() => setStep('location')} />
                        )}

                        {step === 'waitlisted' && (
                            <div style={{ textAlign: 'center', padding: '16px 0' }}>
                                <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '1px solid rgba(201,168,76,0.2)' }}>
                                    <CheckCircle size={32} weight="fill" style={{ color: '#C9A84C' }} />
                                </div>
                                <h2 style={{ fontSize: 20, fontWeight: 600, color: '#F5F5F4', marginBottom: 8 }}>You&apos;re on the list</h2>
                                <p style={{ fontSize: 14, color: '#71717A', lineHeight: 1.6 }}>Butler isn&apos;t in your area yet — but you&apos;ll be the first to know when we launch near <strong style={{ color: '#A1A1AA' }}>{zip}</strong>.</p>
                                <Link to="/" style={{ display: 'inline-block', marginTop: 20, fontSize: 14, color: '#C9A84C', textDecoration: 'none', fontWeight: 500 }}>Back to home</Link>
                            </div>
                        )}
                    </div>
                    <p style={{ textAlign: 'center', fontSize: 14, color: '#71717A', marginTop: 24 }}>
                        Already a member? <Link to="/login" style={{ color: '#C9A84C', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
                    </p>
                </div>
            </div>
        )
    }

    // ── Step 2: account ────────────────────────────────────────────────
    if (step === 'account') {
        return (
            <div style={SHELL}>
                <div style={{ width: '100%', maxWidth: 440 }}>
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <img src="/images/butlerlogo.png" alt="Butler" style={{ height: 90, objectFit: 'contain', margin: '0 auto' }} />
                    </div>
                    <div style={CARD}>
                        <StepDots active={1} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginBottom: 6 }}>
                            <CheckCircle size={16} weight="fill" style={{ color: '#22C55E' }} />
                            <span style={{ fontSize: 13, color: '#22C55E', fontWeight: 500 }}>Butler serves {territory?.name}</span>
                        </div>
                        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#F5F5F4', marginBottom: 4, fontFamily: "'Satoshi', sans-serif", textAlign: 'center' }}>Create your account</h2>
                        <p style={{ fontSize: 14, color: '#71717A', marginBottom: 24, textAlign: 'center' }}>Two more quick steps to your first errand.</p>
                        <AccountForm busy={busy} setBusy={setBusy} onCreated={() => setStep('personalize')} registerUser={registerUser} />
                    </div>
                </div>
            </div>
        )
    }

    // ── Step 3: personalize ────────────────────────────────────────────
    return (
        <div style={SHELL}>
            <div style={{ width: '100%', maxWidth: 460 }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <img src="/images/butlerlogo.png" alt="Butler" style={{ height: 90, objectFit: 'contain', margin: '0 auto' }} />
                </div>
                <div style={CARD}>
                    <StepDots active={2} />
                    <PersonalizeStep
                        territory={territory}
                        onDone={async ({ address, preferredServices }) => {
                            setBusy(true)
                            try {
                                const user = await authApi.completeOnboarding({
                                    territoryId: territory.id, address, preferredServices,
                                })
                                setUser(user)
                                navigate('/subscribe')
                            } catch (error) {
                                toast.error('Could not save your details', { description: extractErrorMessage(error) })
                            } finally {
                                setBusy(false)
                            }
                        }}
                        busy={busy}
                    />
                </div>
            </div>
        </div>
    )
}

// ── Waitlist capture (out-of-area) ─────────────────────────────────────
function WaitlistForm({ zip, onJoined, onBack }) {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [busy, setBusy] = useState(false)

    const submit = async (e) => {
        e.preventDefault()
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            toast.error('Enter a valid email')
            return
        }
        setBusy(true)
        try {
            await territoriesApi.joinWaitlist({ email: email.trim(), zipCode: zip, fullName: name.trim() })
            onJoined()
        } catch (error) {
            toast.error('Could not join the waitlist', { description: extractErrorMessage(error) })
        } finally {
            setBusy(false)
        }
    }

    return (
        <>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: '#F5F5F4', marginBottom: 6, textAlign: 'center' }}>Not in your area — yet</h2>
            <p style={{ fontSize: 14, color: '#71717A', marginBottom: 20, textAlign: 'center', lineHeight: 1.6 }}>
                Butler doesn&apos;t serve <strong style={{ color: '#A1A1AA' }}>{zip}</strong> right now. Leave your email and we&apos;ll reach out the moment we launch nearby.
            </p>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Input label="Full name (optional)" placeholder="Jane Smith" value={name} onChange={(e) => setName(e.target.value)} />
                <Input type="email" label="Email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Button type="submit" size="lg" loading={busy} style={{ width: '100%' }}>Notify me at launch</Button>
                <button type="button" onClick={onBack} style={{ background: 'none', border: 'none', color: '#71717A', fontSize: 13, cursor: 'pointer' }}>← Try a different ZIP</button>
            </form>
        </>
    )
}

// ── Account creation form ──────────────────────────────────────────────
function AccountForm({ busy, setBusy, onCreated, registerUser }) {
    const [showPassword, setShowPassword] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: { fullName: '', email: '', phone: '', password: '', confirmPassword: '' },
    })

    const onSubmit = async (data) => {
        setBusy(true)
        try {
            await registerUser(data)
            onCreated()
        } catch (error) {
            toast.error('Registration failed', { description: extractErrorMessage(error) })
        } finally {
            setBusy(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
                <Input label="Full Name" placeholder="Jane Smith" {...register('fullName')} />
                {errors.fullName && <p style={ERR}>{errors.fullName.message}</p>}
            </div>
            <div>
                <Input type="email" label="Email" placeholder="you@example.com" {...register('email')} />
                {errors.email && <p style={ERR}>{errors.email.message}</p>}
            </div>
            <div>
                <Input type="tel" label="Phone Number" placeholder="+1 (949) 555-0000" {...register('phone')} />
                {errors.phone && <p style={ERR}>{errors.phone.message}</p>}
            </div>
            <div>
                <div style={{ position: 'relative' }}>
                    <Input type={showPassword ? 'text' : 'password'} label="Password" placeholder="Min 8 characters" {...register('password')} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: 12, top: 36, background: 'none', border: 'none', cursor: 'pointer', color: '#71717A', padding: 4 }}>
                        {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {errors.password && <p style={ERR}>{errors.password.message}</p>}
            </div>
            <div>
                <Input type="password" label="Confirm Password" placeholder="Repeat password" {...register('confirmPassword')} />
                {errors.confirmPassword && <p style={ERR}>{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" size="lg" loading={busy} style={{ width: '100%' }}>Continue</Button>
        </form>
    )
}

// ── Personalize (address + preferred services) ─────────────────────────
function PersonalizeStep({ onDone, busy }) {
    const [address, setAddress] = useState('')
    const [selected, setSelected] = useState([])

    const toggle = (key) => setSelected(s => s.includes(key) ? s.filter(k => k !== key) : [...s, key])

    return (
        <>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: '#F5F5F4', marginBottom: 4, fontFamily: "'Satoshi', sans-serif", textAlign: 'center' }}>Let&apos;s personalize Butler</h2>
            <p style={{ fontSize: 14, color: '#71717A', marginBottom: 24, textAlign: 'center' }}>So your first request is two taps, not a form.</p>

            <div style={{ marginBottom: 20 }}>
                <Input label="Home / default address" placeholder="456 Main St, Irvine, CA 92618"
                    value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>

            <p style={{ fontSize: 13, fontWeight: 500, color: '#A1A1AA', marginBottom: 10 }}>What will you use Butler for most?</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
                {Object.entries(SERVICE_TYPES).map(([key, svc]) => {
                    const Icon = SERVICE_ICONS[key]
                    const active = selected.includes(key)
                    return (
                        <button key={key} type="button" onClick={() => toggle(key)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                                border: active ? '1px solid #C9A84C' : '1px solid #27272A',
                                backgroundColor: active ? 'rgba(201,168,76,0.08)' : '#1A1A1F',
                                color: active ? '#C9A84C' : '#A1A1AA', transition: 'all 150ms',
                            }}>
                            <Icon size={16} weight={active ? 'fill' : 'regular'} />
                            <span style={{ fontSize: 13, fontWeight: 500 }}>{svc.label}</span>
                        </button>
                    )
                })}
            </div>

            <Button size="lg" loading={busy} onClick={() => onDone({ address: address.trim(), preferredServices: selected })} style={{ width: '100%' }}>
                Continue to membership
            </Button>
            <button type="button" onClick={() => onDone({ address: '', preferredServices: [] })} disabled={busy}
                style={{ width: '100%', background: 'none', border: 'none', color: '#71717A', fontSize: 13, cursor: 'pointer', marginTop: 12 }}>
                Skip for now
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginTop: 20, paddingTop: 16, borderTop: '1px solid #1F1F23' }}>
                <ShieldCheck size={15} style={{ color: '#22C55E' }} />
                <span style={{ fontSize: 12, color: '#71717A' }}>Next: membership — <strong style={{ color: '#A1A1AA' }}>first month money-back guaranteed</strong></span>
            </div>
        </>
    )
}
