import React from 'react';
import { motion } from 'motion/react';

interface BlockProps {
  text: string;
  active?: boolean;
}

export function StepBlock({ text, active }: BlockProps) {
  return (
    <motion.div
      animate={{
        scale: active ? 1.05 : 1,
        opacity: active ? 1 : 0.4,
      }}
      className={`px-5 py-3 rounded-2xl text-base font-bold whitespace-nowrap transition-all duration-300 shadow-sm ${
        active
          ? 'bg-white text-blue-600 border border-blue-100 ring-4 ring-blue-500/10 shadow-md'
          : 'bg-white/50 text-slate-500 border border-white/50'
      }`}
    >
      {text}
    </motion.div>
  );
}

export function PlaySequencePanel({ steps, activeIndex }: { steps: string[], activeIndex: number }) {
  return (
    <div className="hidden lg:flex flex-col gap-3 p-6 bg-white/40 backdrop-blur-xl rounded-3xl border border-white max-w-[220px] shrink-0 h-fit shadow-lg shadow-blue-900/5">
      <div className="text-center font-extrabold text-slate-700 mb-2 tracking-wide text-lg">놀이 순서</div>
      {steps.map((step, idx) => (
        <React.Fragment key={idx}>
          <StepBlock text={step} active={idx === activeIndex} />
          {idx < steps.length - 1 && (
            <div className="h-6 w-1 border-l-2 border-dashed border-slate-300 mx-auto" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

