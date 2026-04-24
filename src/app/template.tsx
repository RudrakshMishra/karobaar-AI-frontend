'use client';

import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, scale: 0.98, filter: "blur(10px)" },
  enter: { opacity: 1, scale: 1, filter: "blur(0px)" },
};

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      variants={variants}
      initial="hidden"
      animate="enter"
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="flex-1 flex flex-col w-full h-full"
    >
      {children}
    </motion.main>
  );
}
