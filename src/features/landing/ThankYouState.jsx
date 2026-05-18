import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle, ArrowRight } from '@phosphor-icons/react'

export default function ThankYouState() {
    return (
        <motion.div
            className="l-thankyou"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5 } }}
        >
            <div>
                <motion.div
                    className="l-thankyou-icon"
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, transition: { delay: 0.2, duration: 0.65, ease: [0.34, 1.26, 0.64, 1] } }}
                >
                    <CheckCircle size={72} weight="regular" />
                </motion.div>

                <motion.h1
                    className="t-hero"
                    style={{ fontSize: 'clamp(36px, 5.5vw, 64px)', marginBottom: 20 }}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.72, ease: [0.25, 0, 0.2, 1] } }}
                >
                    Welcome to Butler.
                </motion.h1>

                <motion.p
                    className="t-body"
                    style={{ maxWidth: 440, margin: '0 auto 12px' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.72, duration: 0.6 } }}
                >
                    You're one of our founding members.
                </motion.p>

                <motion.p
                    className="t-body"
                    style={{ maxWidth: 440, margin: '0 auto 40px' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.88, duration: 0.6 } }}
                >
                    We'll be in touch before launch with everything you need to get started. Keep an eye on your inbox.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 1.1, duration: 0.5 } }}
                >
                    <Link
                        to="/register"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            fontSize: 14, color: 'var(--gold)', textDecoration: 'none',
                            fontWeight: 500, fontFamily: 'var(--font-sans)',
                        }}
                    >
                        Create your account <ArrowRight size={14} weight="bold" />
                    </Link>
                </motion.div>
            </div>
        </motion.div>
    )
}
