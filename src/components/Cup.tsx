import React from 'react';
import { motion } from 'motion/react';

interface CupProps {
  colorCode?: string;
  delay?: number;
  isFallen?: boolean;
  size?: number;
  fallDirection?: number;
  key?: React.Key;
}

export function Cup({ 
  colorCode = '#3b82f6', 
  delay = 0, 
  isFallen = false, 
  size = 60,
  fallDirection = 1 
}: CupProps) {
  return (
    <motion.div
      initial={!isFallen ? { y: -200, opacity: 0, scale: 0.5 } : false}
      animate={
        isFallen
          ? { 
              rotate: fallDirection * (70 + Math.random() * 40), 
              x: fallDirection * (100 + Math.random() * 100), 
              y: 200 + Math.random() * 100, 
              opacity: 0,
              scale: 0.8
            }
          : { y: 0, opacity: 1, rotate: 0, x: 0, scale: 1 }
      }
      transition={{ 
        type: 'spring', 
        stiffness: isFallen ? 100 : 250, 
        damping: isFallen ? 12 : 22, 
        delay: delay,
      }}
      className="relative drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)] origin-bottom"
      style={{ 
        width: size, 
        height: size * 1.3, 
        marginLeft: -size * 0.08, 
        marginRight: -size * 0.08 
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 130" style={{ overflow: 'visible' }}>
        {/* Realistic Tapered Cup Body (Inverted) */}
        {/* Slightly steeper taper for cleaner stacking silhouette */}
        <path 
          d="M 22 10 L 78 10 L 96 120 C 96 125 4 125 4 120 Z" 
          fill={colorCode} 
          fillOpacity="0.85" 
          className="backdrop-blur-[2px]"
        />

        {/* Top Base (The actual bottom of the cup, now facing up) */}
        <ellipse 
          cx="50" cy="10" rx="28" ry="6" 
          fill={colorCode} 
          fillOpacity="1"
        />
        <ellipse 
          cx="50" cy="9" rx="24" ry="4" 
          fill="rgba(255,255,255,0.3)" 
        />

        {/* Bottom Rim Detail */}
        <path 
          d="M 6 118 Q 50 128 94 118 L 94 122 Q 50 132 6 122 Z" 
          fill="rgba(0,0,0,0.12)" 
        />

        {/* Highlights for 3D Effect */}
        <path 
          d="M 28 15 L 12 115 C 18 115 25 115 25 115 L 38 15 Z" 
          fill="white" 
          fillOpacity="0.25" 
        />
        
        <rect x="49" y="10" width="2" height="110" fill="white" fillOpacity="0.08" rx="1" />

        {/* Right Shadow */}
        <path 
          d="M 72 15 L 88 115 C 82 115 75 115 75 115 L 62 15 Z" 
          fill="black" 
          fillOpacity="0.12" 
        />
        
        {/* Inner shadow at bottom opening */}
        <ellipse cx="50" cy="120" rx="42" ry="5" fill="rgba(0,0,0,0.08)" />
      </svg>
    </motion.div>
  );
}

