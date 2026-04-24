'use client';

import React, { useState, useEffect } from 'react';

interface TextScrambleProps {
  children: string;
  className?: string;
  hover?: boolean;
}

const CHARS = '!<>-_/\\[]{}—=+*^?#________';

export default function TextScramble({ children, className = '', hover = true }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(children);
  const [isScrambling, setIsScrambling] = useState(!hover);

  useEffect(() => {
    if (!isScrambling) {
      setDisplayText(children);
      return;
    }

    let iteration = 0;
    const maxIterations = children.length;

    const interval = setInterval(() => {
      setDisplayText((old) =>
        old.split('').map((char, index) => {
          if (index < iteration) {
            return children[index];
          }
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join('')
      );

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setIsScrambling(false);
      }
      
      iteration += 1 / 3; // speed
    }, 30);

    return () => clearInterval(interval);
  }, [isScrambling, children]);

  return (
    <span 
      className={className} 
      onMouseEnter={() => hover && setIsScrambling(true)}
    >
      {displayText}
    </span>
  );
}
