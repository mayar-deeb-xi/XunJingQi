'use client';

import { AnimatePresence, motion } from 'motion/react';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        // exit={{ opacity: 1, y: -20 }}
        transition={{ duration: 0.3, ease: 'linear' }}
        className=" flex-1"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
