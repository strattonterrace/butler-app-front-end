import { motion } from 'framer-motion'

/**
 * PageTransition — wraps page content with a fade + slide up animation.
 * Use as: <PageTransition>...page content...</PageTransition>
 */
export function PageTransition({ children, className, style }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className={className}
            style={style}
        >
            {children}
        </motion.div>
    )
}

/**
 * FadeIn — stagger children with fade-in animation.
 * Useful for lists, grids, and card groups.
 */
export function FadeIn({ children, delay = 0, duration = 0.35, className, style }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, delay, ease: 'easeOut' }}
            className={className}
            style={style}
        >
            {children}
        </motion.div>
    )
}

/**
 * StaggerContainer + StaggerItem — animate list items sequentially.
 */
export function StaggerContainer({ children, staggerDelay = 0.05, className, style }) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: { transition: { staggerChildren: staggerDelay } },
            }}
            className={className}
            style={style}
        >
            {children}
        </motion.div>
    )
}

export function StaggerItem({ children, className, style }) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
            }}
            className={className}
            style={style}
        >
            {children}
        </motion.div>
    )
}

/**
 * ScaleIn — scale + fade for modals, cards, tooltips.
 */
export function ScaleIn({ children, className, style }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className={className}
            style={style}
        >
            {children}
        </motion.div>
    )
}
