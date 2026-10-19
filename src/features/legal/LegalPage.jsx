import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const SERIF = "'Instrument Serif', Georgia, serif"
const SANS = "'Inter', -apple-system, sans-serif"

const C = {
    bg: '#0A0A0B',
    card: '#111113',
    border: '#27272A',
    text: '#F5F5F4',
    body: '#C4C4C8',
    muted: '#A1A1AA',
    dim: '#71717A',
    gold: '#C9A84C',
}

/**
 * Renders a legal document (Terms or Privacy) with Butler branding.
 * `doc` is a { title, lastUpdated, intro, sections } object; `other` is the
 * { to, label } link to the companion legal page.
 */
export default function LegalPage({ doc, other }) {
    useEffect(() => {
        document.title = `${doc.title} · Butler`
        window.scrollTo(0, 0)
    }, [doc.title])

    return (
        <div style={{ minHeight: '100vh', backgroundColor: C.bg, color: C.body, fontFamily: SANS }}>
            {/* Top bar */}
            <div style={{ borderBottom: `1px solid ${C.border}`, backgroundColor: 'rgba(10,10,11,0.9)' }}>
                <div style={{ maxWidth: 760, margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <Link to="/" style={{ fontFamily: SERIF, fontSize: 24, color: C.gold, textDecoration: 'none', letterSpacing: '0.02em' }}>Butler</Link>
                    <Link to="/" style={{ fontSize: 13, color: C.dim, textDecoration: 'none', fontFamily: SANS }}>← Back to home</Link>
                </div>
            </div>

            {/* Content */}
            <div style={{ maxWidth: 760, margin: '0 auto', padding: '56px 24px 80px' }}>
                <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(32px, 6vw, 44px)', color: C.text, lineHeight: 1.15, marginBottom: 10 }}>
                    {doc.title}
                </h1>
                <p style={{ fontSize: 13, color: C.dim, marginBottom: 28 }}>Last updated: {doc.lastUpdated}</p>

                <p style={{ fontSize: 15.5, lineHeight: 1.75, color: C.body, marginBottom: 36 }}>{doc.intro}</p>

                {doc.sections.map((section) => (
                    <section key={section.heading} style={{ marginBottom: 32 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 12, fontFamily: SANS }}>
                            {section.heading}
                        </h2>
                        {section.body?.map((para, i) => (
                            <p key={i} style={{ fontSize: 15, lineHeight: 1.75, color: C.body, marginBottom: 12 }}>{para}</p>
                        ))}
                        {section.list && (
                            <ul style={{ margin: '4px 0 12px', paddingLeft: 22 }}>
                                {section.list.map((item, i) => (
                                    <li key={i} style={{ fontSize: 15, lineHeight: 1.7, color: C.body, marginBottom: 8 }}>{item}</li>
                                ))}
                            </ul>
                        )}
                        {section.after?.map((para, i) => (
                            <p key={i} style={{ fontSize: 15, lineHeight: 1.75, color: C.body, marginBottom: 12 }}>{para}</p>
                        ))}
                    </section>
                ))}

                {/* Footer nav */}
                <div style={{ marginTop: 48, paddingTop: 24, borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <Link to={other.to} style={{ fontSize: 14, color: C.gold, textDecoration: 'none', fontFamily: SANS }}>
                        {other.label} →
                    </Link>
                    <span style={{ fontSize: 12, color: C.dim }}>© 2026 Butler. All rights reserved.</span>
                </div>
            </div>
        </div>
    )
}
