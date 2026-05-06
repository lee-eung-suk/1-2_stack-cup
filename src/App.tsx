import React, { useState } from 'react';
import { HomeScreen } from './screens/HomeScreen';
import { AdditionScreen } from './screens/AdditionScreen';
import { SubtractionScreen } from './screens/SubtractionScreen';
import { PracticeScreen } from './screens/PracticeScreen';
import { soundManager } from './lib/sounds';

export type Mode = 'home' | 'addition' | 'subtraction' | 'practice';
export type Difficulty = 'easy' | 'challenge';

export default function App() {
  const [mode, setMode] = useState<Mode>('home');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleStart = (selectedMode: Mode, selectedDifficulty?: Difficulty) => {
    setMode(selectedMode);
    if (selectedDifficulty) {
      setDifficulty(selectedDifficulty);
    }
  };

  const handleHome = () => {
    soundManager.playTing();
    setMode('home');
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    soundManager.enabled = !soundEnabled;
    if (!soundEnabled) {
      soundManager.init();
      soundManager.playTing();
    }
  };

  return (
    <div className="font-sans antialiased text-slate-800 selection:bg-blue-200">
      {mode === 'home' && (
        <HomeScreen 
          onStart={handleStart} 
          soundEnabled={soundEnabled} 
          onToggleSound={toggleSound} 
        />
      )}
      {mode === 'addition' && (
        <AdditionScreen 
          difficulty={difficulty} 
          onHome={handleHome} 
        />
      )}
      {mode === 'subtraction' && (
        <SubtractionScreen 
          difficulty={difficulty} 
          onHome={handleHome} 
        />
      )}
      {mode === 'practice' && (
        <PracticeScreen 
          onHome={handleHome} 
        />
      )}
    </div>
  );
}
