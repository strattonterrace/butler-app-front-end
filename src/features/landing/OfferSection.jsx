import { motion } from 'framer-motion'
import { CheckCircle, Warning, ArrowRight } from '@phosphor-icons/react'

const STRIPE_LINK = 'STRIPE_PAYMENT_LINK_HERE'

const PERKS = [
    'Priority access at launch',
    '20% off your first 2 months',
    '2 free errands when we go live',
    'Founding member — you shaped this from day one',
]

export default function OfferSection() {
    return (
        <motion.div
            className="l-offer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.45 } }}
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
        >
            <div className="l-offer-inner">
                <motion.p
                    className="t-label"
                    style={{ marginBottom: 24 }}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.12, duration: 0.5 } }}
                >
                    Exclusive Access
                </motion.p>

                <motion.h2
                    className="t-h2"
                    style={{ marginBottom: 16 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.22, duration: 0.65, ease: [0.25, 0, 0.2, 1] } }}
                >
                    Become a Founding<br />Member of Butler.
                </motion.h2>

                <motion.p
                    className="t-body"
                    style={{ marginBottom: 52, maxWidth: 440, margin: '0 auto 52px' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.32, duration: 0.5 } }}
                >
                    Secure your spot before launch and be one of the first people we serve.
                </motion.p>

                <motion.div
                    className="l-offer-card"
                    initial={{ opacity: 0, scale: 0.93, y: 44 }}
                    animate={{ opacity: 1, scale: 1, y: 0, transition: { delay: 0.18, duration: 0.72, ease: [0.25, 0, 0.2, 1] } }}
                >
                    <div className="l-offer-glow" aria-hidden />

                    {/* Price */}
                    <div style={{ marginBottom: 4 }}>
                        <p className="l-offer-price"><sup>$</sup>25</p>
                        <p className="t-caption" style={{ marginTop: 6 }}>
                            One-time founding member fee
                        </p>
                    </div>

                    <div className="l-offer-divider" />

                    {/* Perks */}
                    <ul className="l-perks">
                        {PERKS.map((perk) => (
                            <li className="l-perk" key={perk}>
                                <CheckCircle size={17} weight="regular" className="l-perk-icon" />
                                {perk}
                            </li>
                        ))}
                    </ul>

                    {/* CTA */}
                    <a href={STRIPE_LINK} className="l-cta-primary">
                        Secure My Spot
                        <ArrowRight size={16} weight="bold" />
                    </a>

                    <p className="l-scarcity">
                        <Warning size={13} weight="regular" style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
                        Only a limited number of founding spots available
                    </p>
                </motion.div>
            </div>
        </motion.div>
    )
}
