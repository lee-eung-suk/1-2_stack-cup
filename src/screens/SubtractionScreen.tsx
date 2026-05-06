import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Numpad } from '../components/Numpad';
import { CupPyramid } from '../components/CupPyramid';
import { PlaySequencePanel } from '../components/AiboCodingViewer';
import { soundManager } from '../lib/sounds';
import confetti from 'canvas-confetti';
import { ArrowLeft, RefreshCw, CircleDashed } from 'lucide-react';

interface Props {
  difficulty: 'easy' | 'challenge';
  onHome: () => void;
}

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
function getRandomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export function SubtractionScreen({ difficulty, onHome }: Props) {
  const [num1, setNum1] = useState(0); 
  const [num2, setNum2] = useState(0); 
  const [color1, setColor1] = useState(COLORS[0]);

  const [isRolling, setIsRolling] = useState(false);
  const [isCrashed, setIsCrashed] = useState(false);
  const [showNumpad, setShowNumpad] = useState(false);
  const [status, setStatus] = useState<'idle' | 'wrong' | 'success'>('idle');
  const [codingStep, setCodingStep] = useState(0);

  const codingSteps = [
    "1. 시작하기",
    "2. 공 굴리기",
    "3. 남은 컵 세기",
    "4. 답 말하기"
  ];

  const generateProblem = () => {
    const maxStart = difficulty === 'easy' ? 9 : 18;
    const n1 = Math.floor(Math.random() * (maxStart - 2)) + 3; // at least 3 cups
    const n2 = Math.floor(Math.random() * (n1 - 1)) + 1; // subtract at least 1, max n1-1
    setNum1(n1);
    setNum2(n2);
    setColor1(getRandomColor());

    setIsRolling(false);
    setIsCrashed(false);
    setShowNumpad(false);
    setStatus('idle');
    setCodingStep(0);
  };

  useEffect(() => {
    generateProblem();
  }, [difficulty]);

  const handleRollBall = () => {
    setCodingStep(1);
    setIsRolling(true);
    soundManager.playRoll();
    
    setTimeout(() => {
      setIsCrashed(true);
      setCodingStep(2);
      // Play multiple crash sounds for "warrr" effect
      soundManager.playCrash();
      setTimeout(soundManager.playCrash, 150);
      setTimeout(soundManager.playCrash, 300);
    }, 1000); 

    setTimeout(() => {
       setShowNumpad(true);
    }, 2500);
  };

  const handleSelectNumber = (guess: number) => {
    setCodingStep(3);
    if (guess === num1 - num2) {
      setStatus('success');
      soundManager.playSuccess();
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 }
      });
    } else {
      setStatus('wrong');
      soundManager.playFail();
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  const cupColors = Array(num1).fill(color1);

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-indigo-100/50 flex flex-col p-4 lg:p-8 overflow-hidden">
      <div className="w-full max-w-6xl mx-auto flex flex-col h-full flex-1 gap-4 lg:gap-6">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center shrink-0 bg-white/70 p-3 lg:p-4 rounded-3xl backdrop-blur-xl border border-white shadow-sm">
          <button onClick={onHome} className="p-3 lg:px-5 bg-white rounded-full shadow-sm hover:shadow-md text-slate-600 font-bold flex items-center gap-2 text-lg lg:text-xl transition-all active:scale-95">
            <ArrowLeft size={24} /> <span className="hidden sm:inline">돌아가기</span>
          </button>
          
          <div className="text-3xl lg:text-5xl font-extrabold text-indigo-600 tracking-wider bg-white px-6 py-3 lg:px-10 lg:py-4 rounded-3xl shadow-sm border-2 border-indigo-50/50">
             {num1} - {num2} = <span className={!showNumpad && status === 'idle' ? "text-slate-300" : "text-indigo-600"}>{status === 'success' ? num1 - num2 : '?'}</span>
          </div>
          
          <button onClick={generateProblem} className="p-3 lg:px-5 bg-white rounded-full shadow-sm hover:shadow-md text-slate-600 font-bold flex items-center gap-2 text-lg lg:text-xl transition-all active:scale-95">
             <span className="hidden sm:inline">새 모양</span> <RefreshCw size={24} />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 gap-4 lg:gap-6 min-h-0">
          
          {/* Left Panel */}
          <PlaySequencePanel steps={codingSteps} activeIndex={codingStep} />
          
          {/* Center Play Area */}
          <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-white/60 rounded-[2rem] border border-white backdrop-blur-xl p-4 lg:p-8 shadow-sm">
            
            <AnimatePresence>
              {status === 'success' && (
                 <motion.div 
                   initial={{scale:0, opacity:0, y:-20}} 
                   animate={{scale:1, opacity:1, y:0}} 
                   exit={{scale:0.8, opacity:0}} 
                   className="absolute top-4 lg:top-8 text-3xl lg:text-5xl font-black text-green-600 bg-white/95 backdrop-blur-xl px-10 py-6 lg:py-8 rounded-[2.5rem] z-50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-green-100 text-center"
                 >
                   정답이에요!<br/>
                   <span className="text-xl lg:text-3xl font-bold text-slate-500 mt-2 block">남은 컵은 {num1 - num2}개!</span>
                 </motion.div>
              )}
              {status === 'wrong' && (
                 <motion.div 
                   initial={{scale:0, y:-20}} 
                   animate={{scale:1, y:0, x:[-10,10,-10,10,0]}} 
                   transition={{duration:0.4}} 
                   className="absolute top-4 lg:top-8 text-2xl lg:text-4xl font-black text-rose-500 bg-white/95 backdrop-blur-xl px-10 py-6 lg:py-8 rounded-[2.5rem] z-50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-rose-100"
                 >
                   남은 컵을 천천히 세어볼까요?
                 </motion.div>
              )}
            </AnimatePresence>

            <div className="relative flex items-center justify-center w-full max-w-3xl flex-1 min-h-[50%] mt-8 lg:mt-0">
               {/* Ball Element */}
               <motion.div 
                 initial={{ x: -200, y: 0, opacity: 0, scale: 0.5 }}
                 animate={isRolling ? { x: -60, rotate: 360, opacity: 1, scale: 1 } : { x: -200, opacity: 0, scale: 0.5 }}
                 transition={{ duration: 1, ease: "easeIn" }}
                 className="absolute bottom-12 left-0 z-10 text-slate-800"
               >
                 <div className="w-16 h-16 lg:w-28 lg:h-28 bg-slate-800 rounded-full shadow-2xl border-4 border-slate-700 flex items-center justify-center relative overflow-hidden">
                    <div className="w-2 h-2 lg:w-4 lg:h-4 bg-slate-900 rounded-full absolute top-3 right-3 lg:top-6 lg:right-6"></div>
                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-slate-900 rounded-full absolute top-10 right-1 lg:top-18 lg:right-4"></div>
                    <div className="w-3 h-3 lg:w-4 lg:h-4 bg-slate-900 rounded-full absolute top-6 right-8 lg:top-12 lg:right-14"></div>
                    <div className="absolute inset-0 bg-white/10 rounded-full shadow-inner"></div>
                 </div>
               </motion.div>

               <CupPyramid cupColors={cupColors} fallenCount={num2} isCrashed={isCrashed} />
            </div>

            <div className="h-24 lg:h-32 mt-4 flex items-center justify-center shrink-0 w-full z-20">
              {!isRolling && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRollBall}
                  className="px-8 py-5 lg:px-12 lg:py-6 bg-rose-500 text-white rounded-3xl text-2xl lg:text-3xl font-bold shadow-xl shadow-rose-500/20 flex items-center gap-4 hover:bg-rose-600 transition-colors w-full sm:w-auto justify-center"
                >
                  <CircleDashed size={36} className="animate-spin-slow" />
                  공 굴리기!
                </motion.button>
              )}
              {isCrashed && !showNumpad && (
                 <div className="text-xl lg:text-3xl font-bold text-rose-500 animate-pulse bg-white/80 px-8 py-4 rounded-3xl">
                   안 넘어진 컵은 몇 개일까요?
                 </div>
              )}
            </div>
          </div>
        </div>

        {/* Numpad */}
        <div className="shrink-0 h-[220px] z-30">
          <AnimatePresence>
             {showNumpad && status !== 'success' && (
                <motion.div initial={{y:100, opacity:0}} animate={{y:0, opacity:1}} exit={{y:100, opacity:0}}>
                  <Numpad maxNumber={difficulty === 'easy' ? 9 : 18} onSelect={handleSelectNumber} disabled={status === 'success'} />
                </motion.div>
             )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
