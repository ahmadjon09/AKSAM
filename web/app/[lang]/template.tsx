// Subtle page transition: each route swap fades/slides in, so navigation
// reads as a smooth transition instead of a flash. Templates remount per
// navigation while layouts persist.

"use client";

import { motion } from "framer-motion";

export default function LangTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
