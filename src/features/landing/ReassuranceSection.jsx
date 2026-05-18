import { motion } from 'framer-motion'

const MESSAGES = {
    family: 'That time with family is worth protecting.',
    work:   'The work that actually matters deserves your full attention.',
    health: "Taking care of yourself isn't a luxury — it's the priority.",
    rest:   "You shouldn't have to earn rest.",
    build:  "That thing you've been putting off? It's still waiting.",
}

export default function ReassuranceSection({ q3Answer, onContinue }) {
    const message = MESSAGES[q3Answer] || 'That time is yours.'

    return (
        <motion.div
            className="l-reassurance"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.75, ease: 'easeOut' } }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
        >
            <div className="l-reassurance-inner">
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1, transition: { duration: 0.6, ease: [0.25, 0, 0.2, 1], delay: 0.2 } }}
                    style={{ transformOrigin: 'left center' }}
                >
                    <div className="l-reassurance-line" />
                </motion.div>

                <motion.p
                    className="t-label"
                    style={{ marginBottom: 28 }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: 0.3 } }}
                >
                    We hear you
                </motion.p>

                <motion.h2
                    className="t-h2"
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.25, 0, 0.2, 1], delay: 0.44 } }}
                >
                    {message}
                </motion.h2>

                <motion.p
                    className="t-body"
                    style={{ marginTop: 24, maxWidth: 480, margin: '24px auto 0' }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut', delay: 0.72 } }}
                >
                    That's exactly why Butler exists. Let us show you what it's like to have your time back.
                </motion.p>

                <motion.button
                    className="l-continue-btn"
                    style={{ marginTop: 52 }}
                    onClick={onContinue}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: 1.1 } }}
                >
                    Show me how →
                </motion.button>
            </div>
        </motion.div>
    )
}
