import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Terminal } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Track } from '../types';

const TRACKS: Track[] = [
  {
    id: '1',
    title: 'AUDIO_STREAM_01.DAT',
    artist: 'SYS.OP',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    title: 'AUDIO_STREAM_02.DAT',
    artist: 'SYS.OP',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'AUDIO_STREAM_03.DAT',
    artist: 'SYS.OP',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch((e) => console.error("Audio play failed:", e));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    handleNext();
  };

  return (
    <div className="w-full bg-black border-4 border-[#FF00FF] p-4 md:p-6 relative">
      {/* Decorative Corners */}
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-[#00FFFF]"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#00FFFF]"></div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleEnded}
        preload="auto"
      />
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 w-full md:w-auto screen-tear">
          <div className="w-16 h-16 bg-black flex items-center justify-center border-2 border-[#00FFFF]">
            <Terminal className="w-8 h-8 text-[#00FFFF]" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-[#00FFFF] font-pixel text-sm md:text-base truncate w-48 md:w-64">{currentTrack.title}</h3>
            <p className="text-[#FF00FF] text-xl mt-2">{currentTrack.artist}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePrev}
              className="p-3 bg-black border-2 border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black transition-colors"
            >
              <SkipBack className="w-6 h-6" />
            </button>
            
            <button 
              onClick={handlePlayPause}
              className="p-4 bg-black border-2 border-[#FF00FF] text-[#FF00FF] hover:bg-[#FF00FF] hover:text-black transition-colors"
            >
              {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
            </button>
            
            <button 
              onClick={handleNext}
              className="p-3 bg-black border-2 border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black transition-colors"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3 border-l-4 border-[#FF00FF] pl-6">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 text-[#00FFFF] hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              className="w-24 h-2 bg-black border-2 border-[#00FFFF] appearance-none cursor-pointer accent-[#FF00FF]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
