import { VantaBackground } from '@/shared/components/VantaBackground'
import { motion, AnimatePresence } from 'motion/react'
import { useLocation } from 'react-router-dom'

export function AuthLayout({ children }) {
  const location = useLocation()

  return (
    <VantaBackground>
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 min-h-svh w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} // smooth ease-out
            className="w-full max-w-[420px] relative z-10"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </VantaBackground>
  )
}
