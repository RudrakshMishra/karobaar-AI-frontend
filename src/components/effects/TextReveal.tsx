'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
}

export default function TextReveal({ children, className = '', delay = 0 }: TextRevealProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: '-10% 0px',
  });

  const words = children.split(' ');

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden whitespace-nowrap">
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, y: "100%" }}
            animate={inView ? { opacity: 1, y: "0%" } : {}}
            transition={{
              duration: 0.5,
              ease: [0.33, 1, 0.68, 1], // Custom cubic-bezier
              delay: delay + index * 0.05,
            }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}
