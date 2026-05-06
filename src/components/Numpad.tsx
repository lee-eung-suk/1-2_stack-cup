import React from 'react';
import { motion } from 'motion/react';
import { soundManager } from '../lib/sounds';

interface NumpadProps {
  maxNumber: number;
  onSelect: (num: number) => void;
  disabled?: boolean;
}

export function Numpad({ maxNumber, onSelect, disabled }: NumpadProps) {
  const numbers = Array.from({ length: maxNumber + 1 }, (_, i) => i);

  return (
    <div className="grid grid-cols-5 gap-3 p-4 bg-white/40 backdrop-blur-md rounded-3xl shadow-inner max-w-2xl mx-auto">
      {numbers.map((num) => (
        <motion.button
          key={num}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={disabled}
          onClick={() => {
            soundManager.playTing();
            onSelect(num);
          }}
          className="h-16 rounded-2xl bg-white shadow-sm border border-slate-100 text-3xl font-bold text-slate-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 hover:text-blue-500 transition-colors"
          aria-label={`숫자 ${num}`}
        >
          {num}
        </motion.button>
      ))}
    </div>
  );
}
