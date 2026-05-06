import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Numpad } from '../components/Numpad';
import { CupPyramid } from '../components/CupPyramid';
import { PlaySequencePanel } from '../components/AiboCodingViewer';
import { soundManager } from '../lib/sounds';
import confetti from 'canvas-confetti';
import { ArrowLeft, RefreshCw, Layers } from 'lucide-react';

interface Props {
  difficulty: 'easy' | 'challenge';
  onHome: () => void;
}

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
function getRandomTwoColors() {
    const shuffled = [...COLORS].sort(() => 0.5 - Math.random());
    return [shuffled[0], shuffled[1]];
}

export function AdditionScreen({ difficulty, onHome }: Props) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [color1, setColor1] = useState(COLORS[0]);
  const [color2, setColor2] = useState(COLORS[1]);

  const [cupsAdded, setCupsAdded] = useState(false);
  const [showNumpad, setShowNumpad] = useState(false);
  const [status, setStatus] = useState<'idle' | 'wrong' | 'success'>('idle');
  const [codingStep, setCodingStep] = useState(0);
  
  const codingSteps = [
    "1. 시작하기",
    "2. 컵 합치기",
    "3. 모두 세기",
    "4. 답 말하기"
  ];

  const generateProblem = () => {
    const maxSum = difficulty === 'easy' ? 9 : 18;
    const targetSum = Math.floor(Math.random() * (maxSum - 1)) + 2;
    const n1 = Math.floor(Math.random() * (targetSum - 1)) + 1;
    const n2 = targetSum - n1;
    setNum1(n1);
    setNum2(n2);
    
    const [c1, c2] = getRandomTwoColors();
    setColor1(c1);
    setColor2(c2);

    setCupsAdded(false);
    setShowNumpad(false);
    setStatus('idle');
    setCodingStep(0);
  };

  useEffect(() => {
    generateProblem();
  }, [difficulty]);

  const handleAddCups = () => {
    setCodingStep(1);
    setCupsAdded(true);
    for (let i = 0; i < num2; i++) {
        setTimeout(() => soundManager.playPop(), i * 150 + 100);
    }
    setTimeout(() => {
      setCodingStep(2);
      setShowNumpad(true);
    }, num2 * 150 + 400);
  };

  const handleSelectNumber = (guess: number) => {
    setCodingStep(3);
    if (guess === num1 + num2) {
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

  const cupColors = [];
  for (let i = 0; i < num1; i++) cupColors.push(color1);
  if (cupsAdded) {
     for (let i = 0; i < num2; i++) cupColors.push(color2);
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-blue-50/50 via-teal-50/30 to-blue-100/50 flex flex-col p-4 lg:p-8">
      <div className="w-full max-w-6xl mx-auto flex flex-col h-full flex-1 gap-4 lg:gap-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center shrink-0 bg-white/70 p-3 lg:p-4 rounded-3xl backdrop-blur-xl border border-white shadow-sm">
          <button onClick={onHome} className="p-3 lg:px-5 bg-white rounded-full shadow-sm hover:shadow-md text-slate-600 font-bold flex items-center gap-2 text-lg lg:text-xl transition-all active:scale-95">
            <ArrowLeft size={24} /> <span className="hidden sm:inline">돌아가기</span>
          </button>
          
          <div className="text-3xl lg:text-5xl font-extrabold text-blue-600 tracking-wider bg-white px-6 py-3 lg:px-10 lg:py-4 rounded-3xl shadow-sm border-2 border-blue-50/50">
             {num1} + {num2} = <span className={!showNumpad && status === 'idle' ? "text-slate-300" : "text-blue-600"}>{status === 'success' ? num1 + num2 : '?'}</span>
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
            
            {/* Status Overlay */}
            <AnimatePresence>
              {status === 'success' && (
                 <motion.div 
                   initial={{scale:0, opacity:0, y:-20}} 
                   animate={{scale:1, opacity:1, y:0}} 
                   exit={{scale:0.8, opacity:0}} 
                   className="absolute top-4 lg:top-8 text-3xl lg:text-5xl font-black text-green-600 bg-white/95 backdrop-blur-xl px-10 py-6 lg:py-8 rounded-[2.5rem] z-50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-green-100 text-center"
                 >
                   정답이에요!<br/>
                   <span className="text-xl lg:text-3xl font-bold text-slate-500 mt-2 block">{num1 + num2}개가 맞습니다!</span>
                 </motion.div>
              )}
              {status === 'wrong' && (
                 <motion.div 
                   initial={{scale:0, y:-20}} 
                   animate={{scale:1, y:0, x:[-10,10,-10,10,0]}} 
                   transition={{duration:0.4}} 
                   className="absolute top-4 lg:top-8 text-2xl lg:text-4xl font-black text-rose-500 bg-white/95 backdrop-blur-xl px-10 py-6 lg:py-8 rounded-[2.5rem] z-50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-rose-100"
                 >
                   다시 한 번 세어볼까요?
                 </motion.div>
              )}
            </AnimatePresence>

            {/* Pyramid Display */}
            <div className="flex-1 flex w-full items-center justify-center min-h-[50%] mt-8 lg:mt-0">
               <CupPyramid cupColors={cupColors} />
            </div>

            {/* Action Buttons */}
            <div className="h-24 lg:h-32 mt-4 flex items-center justify-center shrink-0 w-full z-10">
              {!cupsAdded && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddCups}
                  className="px-8 py-5 lg:px-12 lg:py-6 bg-blue-500 text-white rounded-3xl text-2xl lg:text-3xl font-bold shadow-xl shadow-blue-500/20 flex items-center gap-4 hover:bg-blue-600 transition-colors"
                >
                  <Layers size={36} />
                  컵 {num2}개 더 합치기!
                </motion.button>
              )}
              {cupsAdded && !showNumpad && (
                 <div className="text-xl lg:text-3xl font-bold text-blue-500 animate-pulse bg-white/80 px-8 py-4 rounded-3xl">
                   떨어지는 컵을 구경하세요!
                 </div>
              )}
            </div>
          </div>
        </div>

        {/* Numpad Section */}
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
