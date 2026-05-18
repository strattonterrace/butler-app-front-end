import { useState } from 'react'
import { motion } from 'framer-motion'

export default function CaptureSection({ onSubmit }) {
    const [form, setForm] = useState({ name: '', email: '', phone: '', location: '' })
    const update = (f) => (e) => setForm({ ...form, [f]: e.target.value })

    const handleSubmit = (e) => {
        e.preventDefault()
        localStorage.setItem('butler_lead', JSON.stringify({ ...form, ts: Date.now() }))
        onSubmit(form)
    }

    return (
        <motion.div
            className="l-capture"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.58, ease: [0.25, 0, 0.2, 1] } }}
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
        >
            <div className="l-capture-inner">
                <motion.p
                    className="t-label"
                    style={{ marginBottom: 20 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.15, duration: 0.5 } }}
                >
                    Let's get acquainted
                </motion.p>

                <motion.h2
                    className="t-h2"
                    style={{ marginBottom: 8 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.22, duration: 0.65, ease: [0.25, 0, 0.2, 1] } }}
                >
                    Tell us how to reach you.
                </motion.h2>

                <motion.p
                    className="t-body"
                    style={{ marginBottom: 48 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.32, duration: 0.5 } }}
                >
                    We'll take it from here.
                </motion.p>

                <motion.form
                    onSubmit={handleSubmit}
                    noValidate
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.38, duration: 0.6, ease: [0.25, 0, 0.2, 1] } }}
                >
                    <div className="l-form-grid">
                        <div className="l-field">
                            <label className="l-field-label">Full Name</label>
                            <input
                                className="l-field-input"
                                type="text"
                                placeholder="Your full name"
                                value={form.name}
                                onChange={update('name')}
                                required
                                autoComplete="name"
                            />
                        </div>
                        <div className="l-field">
                            <label className="l-field-label">Email Address</label>
                            <input
                                className="l-field-input"
                                type="email"
                                placeholder="your@email.com"
                                value={form.email}
                                onChange={update('email')}
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>
                    <div className="l-form-grid">
                        <div className="l-field">
                            <label className="l-field-label">Phone Number</label>
                            <input
                                className="l-field-input"
                                type="tel"
                                placeholder="+1 (949) 555-0000"
                                value={form.phone}
                                onChange={update('phone')}
                                required
                                autoComplete="tel"
                            />
                        </div>
                        <div className="l-field">
                            <label className="l-field-label">City &amp; State</label>
                            <input
                                className="l-field-input"
                                type="text"
                                placeholder="Los Angeles, CA"
                                value={form.location}
                                onChange={update('location')}
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="l-continue-btn"
                        style={{ maxWidth: '100%', width: '100%', marginTop: 8 }}
                    >
                        Continue →
                    </button>
                    <p className="t-caption" style={{ textAlign: 'center', marginTop: 16 }}>
                        We'll never share your information. Butler is built on trust.
                    </p>
                </motion.form>
            </div>
        </motion.div>
    )
}
