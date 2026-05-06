import React from 'react';
import { motion } from 'motion/react';
import { Settings, Play, Plus, Minus, Gamepad2 } from 'lucide-react';
import { soundManager } from '../lib/sounds';

interface HomeScreenProps {
  onStart: (mode: 'addition' | 'subtraction' | 'practice', difficulty?: 'easy' | 'challenge') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function HomeScreen({ onStart, soundEnabled, onToggleSound }: HomeScreenProps) {
  const [selectedMode, setSelectedMode] = React.useState<'addition' | 'subtraction' | 'practice' | null>(null);

  const startMode = (mode: 'addition' | 'subtraction' | 'practice') => {
    soundManager.init();
    soundManager.playTing();
    setSelectedMode(mode);
    if (mode === 'practice') {
      onStart('practice');
    }
  };

  const selectDifficulty = (diff: 'easy' | 'challenge') => {
    soundManager.playSuccess();
    if (selectedMode) {
      onStart(selectedMode, diff);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] p-6 bg-gradient-to-br from-blue-50 via-white to-teal-50 selection:bg-blue-100">
      <button 
        onClick={onToggleSound}
        className="absolute top-6 right-6 p-4 bg-white/60 backdrop-blur-xl rounded-full shadow-lg shadow-blue-900/5 text-slate-500 hover:text-blue-600 border border-white/50 transition-all active:scale-95"
      >
        <span className="text-sm font-bold mr-3">{soundEnabled ? '소리 켬' : '소리 끔'}</span>
        <Settings size={20} className="inline" />
      </button>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-16 px-4"
      >
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-6 tracking-tight">
          컵쌓기 <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-teal-500">덧셈 뺄셈</span>
        </h1>
        <p className="text-2xl md:text-3xl text-slate-500 font-medium tracking-tight">
          스포츠 스태킹으로 즐기는 재미있는 덧셈 뺄셈
        </p>
      </motion.div>

      {!selectedMode ? (
        <div className="flex flex-col md:flex-row gap-6 max-w-4xl w-full justify-center">
          <ModeCard
            title="덧셈 놀이"
            desc="컵을 차곡차곡 쌓으며 더하기를 배워요"
            icon={<Plus size={48} className="text-blue-500" />}
            onClick={() => startMode('addition')}
            color="bg-blue-100"
          />
          <ModeCard
             title="뺄셈 놀이"
             desc="공을 굴려 컵을 쓰러뜨리며 빼기를 배워요"
             icon={<Minus size={48} className="text-rose-500" />}
             onClick={() => startMode('subtraction')}
             color="bg-rose-100"
          />
          <ModeCard
             title="연습 모드"
             desc="자유롭게 컵을 쌓고 쓰러뜨리며 놀아요"
             icon={<Gamepad2 size={48} className="text-amber-500" />}
             onClick={() => startMode('practice')}
             color="bg-amber-100"
          />
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center w-full max-w-2xl bg-white/40 backdrop-blur-2xl p-10 lg:p-16 rounded-[3rem] border border-white shadow-2xl shadow-blue-900/5"
        >
          <h2 className="text-3xl font-black text-slate-800 mb-10 tracking-tight text-center">도전할 단계를 골라보세요</h2>
          <div className="flex flex-col sm:flex-row gap-6 w-full">
             <button
                onClick={() => selectDifficulty('easy')}
                className="flex-1 px-8 py-10 bg-white rounded-[2rem] shadow-lg shadow-green-900/5 border border-slate-100 hover:border-green-400 hover:scale-[1.03] transition-all group"
             >
                <div className="text-3xl font-black text-slate-800 group-hover:text-green-600 mb-2">쉬움</div>
                <div className="text-lg font-bold text-slate-400">9까지 더하기</div>
             </button>
             <button
                onClick={() => selectDifficulty('challenge')}
                className="flex-1 px-8 py-10 bg-white rounded-[2rem] shadow-lg shadow-purple-900/5 border border-slate-100 hover:border-purple-400 hover:scale-[1.03] transition-all group"
             >
                <div className="text-3xl font-black text-slate-800 group-hover:text-purple-600 mb-2">도전</div>
                <div className="text-lg font-bold text-slate-400">18까지 더하기</div>
             </button>
          </div>
          <button 
            onClick={() => setSelectedMode(null)}
            className="mt-12 text-slate-400 hover:text-slate-600 font-bold text-lg underline underline-offset-8 decoration-slate-200 hover:decoration-slate-400 transition-all"
          >
            뒤로 돌아가기
          </button>
        </motion.div>
      )}
    </div>
  );
}

function ModeCard({ title, desc, icon, onClick, color }: any) {
  return (
    <motion.button
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex-1 min-w-[250px] p-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white flex flex-col items-center text-center gap-4 transition-all hover:shadow-2xl"
    >
      <div className={`p-6 rounded-full ${color} mb-2`}>
        {icon}
      </div>
      <h2 className="text-3xl font-bold text-slate-800">{title}</h2>
      <p className="text-slate-600 text-lg leading-relaxed">{desc}</p>
    </motion.button>
  );
}
