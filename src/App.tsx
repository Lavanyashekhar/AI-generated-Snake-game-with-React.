import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-[#00FFFF] font-sys selection:bg-[#FF00FF] selection:text-black uppercase relative flex flex-col overflow-x-hidden">
      <div className="bg-noise"></div>
      
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col p-4 md:p-8 gap-8 z-10">
        {/* Header */}
        <header className="relative w-full border-4 border-[#FF00FF] bg-black p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Decorative Corners */}
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-[#00FFFF]"></div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#00FFFF]"></div>
          
          <div className="flex items-center gap-4 screen-tear">
            <div className="p-2 bg-black border-2 border-[#00FFFF]">
              <Terminal className="w-8 h-8 text-[#00FFFF]" />
            </div>
            <h1 
              className="text-3xl md:text-5xl glitch-text"
              data-text="NEURO_WORM.EXE"
            >
              NEURO_WORM.EXE
            </h1>
          </div>
          
          <div className="flex items-center gap-4 bg-black px-6 py-3 border-2 border-[#00FFFF]">
            <span className="text-[#FF00FF] text-2xl tracking-widest">DATA_YIELD</span>
            <span className="text-4xl font-pixel text-[#00FFFF]">
              {score.toString().padStart(4, '0')}
            </span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center w-full relative">
          <SnakeGame onScoreChange={setScore} />
        </main>

        {/* Footer / Music Player */}
        <footer className="w-full relative">
          <MusicPlayer />
        </footer>
      </div>
    </div>
  );
}
