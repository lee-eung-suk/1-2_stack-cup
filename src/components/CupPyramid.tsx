import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cup } from './Cup';
import { getPyramidRows } from '../lib/utils';

interface CupPyramidProps {
  cupColors: string[];
  fallenCount?: number;
  isCrashed?: boolean;
  practiceFallAll?: boolean;
}

export function CupPyramid({ cupColors, fallenCount = 0, isCrashed = false, practiceFallAll = false }: CupPyramidProps) {
  const totalCups = cupColors.length;
  const rows = getPyramidRows(totalCups);
  const cupSize = totalCups > 16 ? 45 : totalCups > 9 ? 60 : 75;
  
  let globalIndexCounter = 0; 

  const rowElements = rows.map((rowCount) => {
    const cupsInRow = [];
    for (let i = 0; i < rowCount; i++) {
        const globalIdx = globalIndexCounter++;
        const colorCode = cupColors[globalIdx] || '#3b82f6';
        
        let isFallen = false;
        if (isCrashed) {
           if (practiceFallAll) isFallen = true;
           else if (globalIdx >= totalCups - fallenCount) isFallen = true;
        }

        const fallDirection = globalIdx % 2 === 0 ? 1 : -1;
        
        cupsInRow.push(
           <Cup 
             key={`cup-${globalIdx}`} 
             colorCode={colorCode} 
             delay={practiceFallAll ? Math.random() * 0.15 : globalIdx * 0.08}
             isFallen={isFallen}
             fallDirection={fallDirection}
             size={cupSize} 
           />
        );
    }
    return cupsInRow;
  });

  // Adjust overlap: higher rows should nestle deeper on top of lower rows
  const renderedRows = [];
  // Render from Top to Bottom for naturally stacking z-order
  for (let rowIndex = rowElements.length - 1; rowIndex >= 0; rowIndex--) {
    renderedRows.push(
      <motion.div 
        layout
        key={`row-level-${rowIndex}`} 
        className="flex justify-center w-full relative" 
        style={{ 
          // High z-index for upper rows makes them sit "on top" of lower ones
          zIndex: 10 + rowIndex, 
          // Move each row up slightly to create the stacking effect
          // 0.22 matches the user's request for 20-25% overlap
          marginTop: rowIndex < rowElements.length - 1 ? -cupSize * 0.22 : 0 
        }} 
      >
        <AnimatePresence>
          {rowElements[rowIndex]}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-end w-full flex-1 pb-4">
      {renderedRows}
    </div>
  );
}
