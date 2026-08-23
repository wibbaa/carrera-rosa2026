import { motion } from 'framer-motion'

const VARIANTS = {
  up: { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -40 }, show: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -50 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 50 }, show: { opacity: 1, x: 0 } },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
  scale: { hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } },
}

/**
 * Wraps children with a scroll-triggered reveal animation.
 * direction: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale'
 * delay: seconds before the animation starts (for staggering siblings)
 */
export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  className = '',
  as: Tag = 'div',
  once = true,
  amount = 0.25,
}) {
  const MotionTag = motion[Tag] ?? motion.div
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={VARIANTS[direction]}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}

/** Stagger container — wrap a list of children, each auto-delayed. */
export function RevealGroup({ children, className = '', stagger = 0.1, once = true, amount = 0.2 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      transition={{ staggerChildren: stagger }}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({ children, direction = 'up', duration = 0.5, className = '', as: Tag = 'div' }) {
  const MotionTag = motion[Tag] ?? motion.div
  return (
    <MotionTag className={className} variants={VARIANTS[direction]} transition={{ duration, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </MotionTag>
  )
}
