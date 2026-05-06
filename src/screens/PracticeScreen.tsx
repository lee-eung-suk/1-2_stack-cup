import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CupPyramid } from '../components/CupPyramid';
import { soundManager } from '../lib/sounds';
import { ArrowLeft, Plus, Minus, CircleDashed } from 'lucide-react';

interface Props {
  onHome: () => void;
}

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
function getRandomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export function PracticeScreen({ onHome }: Props) {
  const [cups, setCups] = useState<number>(0);
  const [fallen, setFallen] = useState<number>(0);
  const [prevCups, setPrevCups] = useState<number>(0);
  const [color] = useState(getRandomColor()); // Keep consistent color for session
  const [isRolling, setIsRolling] = useState(false);
  const [isCrashed, setIsCrashed] = useState(false);
  const [showMath, setShowMath] = useState(false);

  const handleAddCup = () => {
    if (cups >= 21 || isRolling) return; 
    setCups(c => c + 1);
    setShowMath(false);
    soundManager.playPop();
  };

  const handleRemoveCup = () => {
    if (cups <= 0 || isRolling) return;
    setCups(c => c - 1);
    setShowMath(false);
    soundManager.playRemove();
  };

  const handleRollBall = () => {
    if (cups === 0 || isRolling) return;
    setIsRolling(true);
    setShowMath(false);
    
    // Determine how many fall (at least 1, up to all)
    const countToFall = Math.floor(Math.random() * cups) + 1;
    setFallen(countToFall);
    setPrevCups(cups);
    
    soundManager.playRoll();
    
    setTimeout(() => {
      setIsCrashed(true);
      soundManager.playCrash();
      if (countToFall > 5) {
        setTimeout(soundManager.playCrash, 100);
        setTimeout(soundManager.playCrash, 250);
      }
    }, 1000);

    setTimeout(() => {
      setCups(c => Math.max(0, c - countToFall));
      setIsRolling(false);
      setIsCrashed(false);
      setShowMath(true);
    }, 3000);
  };

  const cupColors = Array(cups).fill(color);

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-amber-100/50 flex flex-col p-4 lg:p-8 overflow-hidden">
      <div className="w-full max-w-6xl mx-auto flex flex-col h-full flex-1 gap-4 lg:gap-6">
        
        <div className="flex justify-between items-center shrink-0 bg-white/70 p-3 lg:p-4 rounded-3xl backdrop-blur-xl border border-white shadow-sm">
          <button onClick={onHome} className="p-3 lg:px-5 bg-white rounded-full shadow-sm hover:shadow-md text-slate-600 font-bold flex items-center gap-2 text-lg lg:text-xl transition-all active:scale-95">
            <ArrowLeft size={24} /> <span className="hidden sm:inline">돌아가기</span>
          </button>
          
          <div className="text-3xl lg:text-5xl font-extrabold text-amber-600 tracking-wider bg-white px-8 py-3 lg:px-12 lg:py-4 rounded-3xl shadow-sm border-2 border-amber-50/50 flex items-center gap-4">
             현재 컵: <span className="text-amber-500">{cups}</span>개
          </div>
          
          <div className="w-[60px] lg:w-[130px]"></div> {/* Spacer for centering */}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center relative w-full bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white shadow-lg shadow-orange-900/5 p-4 lg:p-8">
          
          <div className="relative flex items-center justify-center w-full flex-1 max-w-4xl min-h-[50%] mt-8 lg:mt-0">
             {/* Ball */}
             <motion.div 
               initial={{ x: -200, y: 0, opacity: 0, scale: 0.5 }}
               animate={isRolling ? { x: -60, rotate: 360, opacity: 1, scale: 1 } : { x: -200, opacity: 0, scale: 0.5 }}
               transition={{ duration: 1, ease: "easeIn" }}
               className="absolute bottom-12 left-0 z-10 text-slate-800"
             >
               <div className="w-20 h-20 lg:w-24 lg:h-24 bg-slate-800 rounded-full shadow-2xl border-4 border-slate-700 flex items-center justify-center relative overflow-hidden">
                  <div className="w-3 h-3 lg:w-4 lg:h-4 bg-slate-900 rounded-full absolute top-4 right-4 lg:top-6 lg:right-6"></div>
                  <div className="w-2 h-2 lg:w-3 lg:h-3 bg-slate-900 rounded-full absolute top-12 right-2 lg:top-14 lg:right-4"></div>
                  <div className="w-3 h-3 lg:w-4 lg:h-4 bg-slate-900 rounded-full absolute top-10 right-10 lg:top-12 lg:right-14"></div>
                  <div className="absolute inset-0 bg-white/10 rounded-full"></div>
               </div>
             </motion.div>

             <CupPyramid 
               cupColors={cupColors} 
               fallenCount={fallen} 
               isCrashed={isCrashed} 
               practiceFallAll={false}
             />

             {/* Math Equations Overlay */}
             {showMath && (
               <motion.div 
                 initial={{ scale: 0, opacity: 0, y: 20 }}
                 animate={{ scale: 1, opacity: 1, y: 0 }}
                 className="absolute top-4 lg:top-8 z-30 flex flex-col gap-3 items-center"
               >
                 <div className="bg-white/95 backdrop-blur-xl px-8 py-4 rounded-[2rem] shadow-2xl border border-rose-100 text-center">
                    <p className="text-xl font-bold text-slate-500 mb-1">뺄셈 문제</p>
                    <p className="text-4xl lg:text-5xl font-black text-rose-500">
                      {prevCups} - {fallen} = {prevCups - fallen}
                    </p>
                 </div>
                 <div className="bg-white/95 backdrop-blur-xl px-8 py-4 rounded-[2rem] shadow-2xl border border-blue-100 text-center">
                    <p className="text-xl font-bold text-slate-500 mb-1">덧셈 문제</p>
                    <p className="text-4xl lg:text-5xl font-black text-blue-500">
                      {prevCups - fallen} + {fallen} = {prevCups}
                    </p>
                 </div>
               </motion.div>
             )}
          </div>

          <div className="flex justify-center gap-4 lg:gap-6 z-20 mt-8 shrink-0 w-full mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddCup}
              disabled={cups >= 21 || isRolling}
              className="px-6 py-5 lg:px-8 lg:py-6 bg-blue-500 text-white rounded-3xl text-xl lg:text-2xl font-bold shadow-xl shadow-blue-500/20 flex flex-col items-center justify-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={32} />
              <span className="hidden sm:inline">컵 추가</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRemoveCup}
              disabled={cups <= 0 || isRolling}
              className="px-6 py-5 lg:px-8 lg:py-6 bg-slate-400 text-white rounded-3xl text-xl lg:text-2xl font-bold shadow-xl flex flex-col items-center justify-center gap-2 hover:bg-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus size={32} />
              <span className="hidden sm:inline">컵 빼기</span>
            </motion.button>

            <motion.div className="w-2 md:w-6 lg:w-12"></motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRollBall}
              disabled={cups === 0 || isRolling}
              className="px-10 py-5 lg:px-16 lg:py-6 bg-rose-500 text-white rounded-3xl text-xl lg:text-2xl font-bold shadow-xl shadow-rose-500/20 flex flex-col items-center justify-center gap-2 hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CircleDashed size={32} />
              무너뜨리기!
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
