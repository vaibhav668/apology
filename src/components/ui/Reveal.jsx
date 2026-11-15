import { motion, useReducedMotion } from 'framer-motion'

// Fades + lifts children into view once. Keeps every section's entrance consistent.
export default function Reveal({ children, delay = 0, y = 28, className = '', as = 'div', amount = 0.35 }) {
  const reduce = useReducedMotion()
  const Tag = motion[as] || motion.div
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y, filter: reduce ? 'none' : 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  )
}
