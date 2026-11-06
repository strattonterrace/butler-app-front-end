import { useState, useEffect, useRef } from 'react'

/* ─────────────────────────────────────────────────────────────────────────
 * SavingsCalculator — interactive "what you keep" comparison for the landing.
 *
 * Shows, in real time, the cost of a product through a typical delivery app
 * (product + tax + delivery/service/marketplace fees + tip) vs. through Butler
 * (product + tax, no marketplace markups). Every number is editable and
 * illustrative — no competitor is named, and no savings figure is hardcoded;
 * it only ever reflects the numbers currently on screen.
 *
 * Everything you'd want to tweak lives in CONFIG below.
 * ───────────────────────────────────────────────────────────────────────── */
const CONFIG = {
    eyebrow: 'The value',
    heading: 'Same product. Less out of pocket.',
    sub: 'Change any number and watch what you keep. These are editable examples — nothing here is fixed.',
    // Everyday items with an illustrative retail price.
    products: [
        { id: 'water', label: 'Bottled water', price: 2.19 },
        { id: 'soda', label: 'Soft drinks', price: 6.49 },
        { id: 'snacks', label: 'Snacks', price: 4.99 },
        { id: 'personal', label: 'Personal care', price: 12.99 },
        { id: 'convenience', label: 'Convenience item', price: 3.49 },
        { id: 'grocery', label: 'Grocery run', price: 48.0 },
    ],
    defaultTaxRate: 7.75, // illustrative CA sales tax
    // Typical delivery-app add-ons (illustrative).
    traditionalDefaults: { deliveryFee: 3.99, serviceFee: 2.99, marketplaceFee: 1.83, tip: 0 },
    butlerDeliveryDefault: 0, // included in membership
    priceSliderMax: 100,
    traditionalColor: '#F0776B',
    butlerColor: '#C9A84C',
    disclaimer:
        'Illustrative example — every field is editable. Real prices and fees vary by merchant and order; Butler only reflects the savings your own numbers show.',
}

const clampNum = (v) => {
    const n = typeof v === 'number' ? v : parseFloat(v)
    return Number.isFinite(n) && n > 0 ? n : 0
}
const money = (n) => `$${clampNum(n).toFixed(2)}`

// Smoothly tween a displayed number toward its target (no extra deps).
function useCountUp(target, duration = 450) {
    const [val, setVal] = useState(target)
    const from = useRef(target)
    const raf = useRef(0)
    useEffect(() => {
        cancelAnimationFrame(raf.current)
        const start = performance.now()
        const base = from.current
        const delta = target - base
        const tick = (now) => {
            const t = Math.min(1, (now - start) / duration)
            const eased = 1 - Math.pow(1 - t, 3)
            setVal(base + delta * eased)
            if (t < 1) raf.current = requestAnimationFrame(tick)
            else from.current = target
        }
        raf.current = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf.current)
    }, [target, duration])
    return val
}

// One editable money field.
function MoneyField({ label, value, onChange, accent = 'var(--text-primary)' }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '9px 0' }}>
            <label style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>{label}</label>
            <div style={{
                display: 'flex', alignItems: 'center', gap: 2,
                border: '1px solid var(--border-default)', borderRadius: 8,
                background: 'var(--bg-base)', padding: '4px 10px', minWidth: 96,
            }}>
                <span style={{ color: 'var(--text-dim)', fontSize: 14 }}>$</span>
                <input
                    type="number" inputMode="decimal" min="0" step="0.01"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    aria-label={label}
                    style={{
                        width: '100%', border: 'none', outline: 'none', background: 'transparent',
                        color: accent, fontSize: 14, fontWeight: 600, textAlign: 'right',
                        fontFamily: 'var(--font-sans)',
                    }}
                />
            </div>
        </div>
    )
}

// One read-only line (product / tax / totals).
function StaticRow({ label, value, strong = false, accent = 'var(--text-primary)' }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0' }}>
            <span style={{ fontSize: strong ? 15 : 14, color: strong ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: strong ? 600 : 400 }}>{label}</span>
            <span style={{ fontSize: strong ? 15 : 14, color: accent, fontWeight: strong ? 700 : 500, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
        </div>
    )
}

export default function SavingsCalculator() {
    const [productId, setProductId] = useState(CONFIG.products[0].id)
    const [price, setPrice] = useState(CONFIG.products[0].price)
    const [taxRate, setTaxRate] = useState(CONFIG.defaultTaxRate)
    const [fees, setFees] = useState(CONFIG.traditionalDefaults)
    const [butlerDelivery, setButlerDelivery] = useState(CONFIG.butlerDeliveryDefault)

    const setFee = (key) => (v) => setFees((f) => ({ ...f, [key]: v }))
    const pickProduct = (p) => { setProductId(p.id); setPrice(p.price) }

    // ── Calculation (pure, no hardcoded results) ──
    const taxAmount = clampNum(price) * (clampNum(taxRate) / 100)
    const productWithTax = clampNum(price) + taxAmount
    const tradFees = clampNum(fees.deliveryFee) + clampNum(fees.serviceFee) + clampNum(fees.marketplaceFee) + clampNum(fees.tip)
    const tradTotal = productWithTax + tradFees
    const butlerTotal = productWithTax + clampNum(butlerDelivery)
    const savings = Math.max(0, tradTotal - butlerTotal)
    const savingsPct = tradTotal > 0 ? (savings / tradTotal) * 100 : 0

    const animSavings = useCountUp(savings)
    const animPct = useCountUp(savingsPct)
    const butlerBarPct = tradTotal > 0 ? Math.max(4, (butlerTotal / tradTotal) * 100) : 100

    return (
        <section style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '120px 24px' }}>
            <div style={{ maxWidth: 1040, margin: '0 auto' }}>
                <p className="t-label" style={{ textAlign: 'center', marginBottom: 18 }}>{CONFIG.eyebrow}</p>
                <h2 className="t-h2" style={{ textAlign: 'center', fontSize: 'clamp(28px, 3.8vw, 48px)' }}>{CONFIG.heading}</h2>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 15, maxWidth: 560, margin: '16px auto 0', fontFamily: 'var(--font-sans)' }}>{CONFIG.sub}</p>

                {/* Product chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, margin: '40px 0 24px' }}>
                    {CONFIG.products.map((p) => {
                        const active = productId === p.id
                        return (
                            <button key={p.id} type="button" onClick={() => pickProduct(p)}
                                style={{
                                    padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                                    fontFamily: 'var(--font-sans)', transition: 'all 160ms',
                                    border: `1px solid ${active ? 'var(--gold-border)' : 'var(--border-default)'}`,
                                    background: active ? 'var(--gold-dim)' : 'transparent',
                                    color: active ? 'var(--gold-bright)' : 'var(--text-muted)',
                                }}>
                                {p.label}
                            </button>
                        )
                    })}
                </div>

                {/* Product price slider (shared) */}
                <div style={{ maxWidth: 520, margin: '0 auto 40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                        <label htmlFor="price-slider" style={{ fontSize: 13, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Product price</label>
                        <span style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--gold)' }}>{money(price)}</span>
                    </div>
                    <input id="price-slider" type="range" min="0" max={CONFIG.priceSliderMax} step="0.5"
                        value={Math.min(clampNum(price), CONFIG.priceSliderMax)}
                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                        aria-label="Product price"
                        style={{ width: '100%', accentColor: CONFIG.butlerColor, cursor: 'pointer' }}
                    />
                </div>

                {/* Two comparison cards */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
                    {/* Traditional */}
                    <div style={{ flex: '1 1 320px', minWidth: 280, maxWidth: 480, background: 'var(--bg-base)', border: '1px solid var(--border-default)', borderRadius: 18, padding: '26px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <span style={{ width: 8, height: 8, borderRadius: 2, background: CONFIG.traditionalColor }} />
                            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Typical delivery app</p>
                        </div>
                        <StaticRow label="Product" value={money(price)} />
                        <StaticRow label={`Sales tax (${clampNum(taxRate).toFixed(2)}%)`} value={money(taxAmount)} />
                        <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '4px 0' }} />
                        <MoneyField label="Delivery fee" value={fees.deliveryFee} onChange={setFee('deliveryFee')} />
                        <MoneyField label="Service fee" value={fees.serviceFee} onChange={setFee('serviceFee')} />
                        <MoneyField label="Marketplace fee" value={fees.marketplaceFee} onChange={setFee('marketplaceFee')} />
                        <MoneyField label="Tip (optional)" value={fees.tip} onChange={setFee('tip')} />
                        <div style={{ borderTop: '1px solid var(--border-default)', margin: '8px 0 4px' }} />
                        <StaticRow label="Total" value={money(tradTotal)} strong accent={CONFIG.traditionalColor} />
                    </div>

                    {/* Butler */}
                    <div style={{ flex: '1 1 320px', minWidth: 280, maxWidth: 480, background: 'linear-gradient(180deg, rgba(201,168,76,0.05), var(--bg-base) 60%)', border: '1px solid var(--gold-border)', borderRadius: 18, padding: '26px 24px', boxShadow: 'var(--shadow-gold)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <span style={{ width: 8, height: 8, borderRadius: 2, background: CONFIG.butlerColor }} />
                            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--gold-bright)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>With Butler</p>
                        </div>
                        <StaticRow label="Product" value={money(price)} />
                        <StaticRow label={`Sales tax (${clampNum(taxRate).toFixed(2)}%)`} value={money(taxAmount)} />
                        <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '4px 0' }} />
                        <MoneyField label="Delivery" value={butlerDelivery} onChange={setButlerDelivery} accent="var(--gold-bright)" />
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0' }}>
                            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Marketplace markups</span>
                            <span style={{ fontSize: 13, color: 'var(--success)', fontWeight: 600 }}>None</span>
                        </div>
                        <div style={{ borderTop: '1px solid var(--gold-border)', margin: '8px 0 4px' }} />
                        <StaticRow label="Total" value={money(butlerTotal)} strong accent="var(--gold-bright)" />
                    </div>
                </div>

                {/* Tax rate (shared) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 24 }}>
                    <label htmlFor="tax" style={{ fontSize: 13, color: 'var(--text-dim)' }}>Sales tax rate</label>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-default)', borderRadius: 8, background: 'var(--bg-base)', padding: '4px 10px' }}>
                        <input id="tax" type="number" inputMode="decimal" min="0" step="0.25" value={taxRate}
                            onChange={(e) => setTaxRate(e.target.value)} aria-label="Sales tax rate percent"
                            style={{ width: 54, border: 'none', outline: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, textAlign: 'right' }} />
                        <span style={{ color: 'var(--text-dim)', fontSize: 14, marginLeft: 2 }}>%</span>
                    </div>
                </div>

                {/* Savings centerpiece */}
                <div style={{ marginTop: 48, textAlign: 'center' }}>
                    <p style={{ fontSize: 13, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>You keep</p>
                    <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(56px, 11vw, 104px)', lineHeight: 1, color: 'var(--gold)', textShadow: '0 0 50px rgba(201,168,76,0.3)' }}>
                        {money(animSavings)}
                    </p>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(15px, 2vw, 18px)', color: 'var(--gold-bright)', fontWeight: 600, marginTop: 10 }}>
                        {animPct.toFixed(1)}% less out of pocket
                    </p>

                    {/* Comparison bars */}
                    <div style={{ maxWidth: 560, margin: '36px auto 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-dim)', marginBottom: 6 }}>
                                <span>Typical delivery app</span><span>{money(tradTotal)}</span>
                            </div>
                            <div style={{ height: 12, borderRadius: 999, background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: '100%', background: CONFIG.traditionalColor, opacity: 0.55 }} />
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--gold-bright)', marginBottom: 6 }}>
                                <span>With Butler</span><span>{money(butlerTotal)}</span>
                            </div>
                            <div style={{ height: 12, borderRadius: 999, background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${butlerBarPct}%`, background: 'linear-gradient(90deg, var(--gold), var(--gold-bright))', borderRadius: 999, transition: 'width 450ms cubic-bezier(0.25,0,0.2,1)' }} />
                            </div>
                        </div>
                    </div>
                </div>

                <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-dim)', maxWidth: 620, margin: '40px auto 0', lineHeight: 1.6 }}>
                    {CONFIG.disclaimer}
                </p>
            </div>
        </section>
    )
}
