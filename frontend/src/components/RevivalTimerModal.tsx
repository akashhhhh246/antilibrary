import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, X, Flame, Sparkles, FastForward } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { AbandonedItem } from '../types';
import { sounds } from '../utils/audio';

interface RevivalTimerModalProps {
  isOpen: boolean;
  item: AbandonedItem | null;
  onClose: () => void;
  onCompleteRevival: (item: AbandonedItem) => void;
}

const TOTAL_SECONDS = 20 * 60; // 20 minutes = 1200 seconds

export const RevivalTimerModal = ({
  isOpen,
  item,
  onClose,
  onCompleteRevival,
}: RevivalTimerModalProps) => {
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [isRunning, setIsRunning] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(TOTAL_SECONDS);
      setIsRunning(true);
      setIsFinished(false);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    setIsFinished(true);
    sounds.playRevivalSuccess();

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899']
      });
    } catch {
      // ignore
    }
  };

  const handleFinishEarly = () => {
    handleTimerComplete();
  };

  const handleClaimSuccess = () => {
    if (item) {
      onCompleteRevival(item);
    }
    onClose();
  };

  if (!isOpen || !item) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = ((TOTAL_SECONDS - timeLeft) / TOTAL_SECONDS) * 100;

  // SVG circular calculation
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#161514] border border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center text-center p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tag */}
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-xs font-mono font-medium mb-4">
          <Flame className="w-3.5 h-3.5 fill-emerald-400" />
          <span>20-Minute Revival Sprint</span>
        </div>

        {/* Item Title & Context */}
        <h2 className="font-serif text-xl font-bold text-stone-100 max-w-xs line-clamp-2 mb-1">
          {item.title}
        </h2>
        <p className="text-xs text-stone-400 mb-6 font-mono">
          Pick up from: <span className="text-amber-300 font-medium">{item.droppedAt}</span>
        </p>

        {/* Circular Progress & Clock */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-6">
          <svg className="w-full h-full transform -rotate-90">
            {/* Track */}
            <circle
              cx="128"
              cy="128"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              className="text-stone-900"
              fill="transparent"
            />
            {/* Progress Bar */}
            <circle
              cx="128"
              cy="128"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-amber-500 transition-all duration-1000 ease-linear"
              fill="transparent"
            />
          </svg>

          {/* Center Digital Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isFinished ? (
              <div className="flex flex-col items-center text-emerald-400 animate-bounce">
                <Sparkles className="w-10 h-10 mb-1" />
                <span className="font-serif text-lg font-bold">Revival Complete!</span>
              </div>
            ) : (
              <>
                <span className="font-mono text-5xl font-bold tracking-tight text-stone-100">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
                <span className="text-xs text-stone-400 font-mono mt-1">
                  {isRunning ? 'Focus sprint in progress' : 'Sprint paused'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Timer Controls */}
        {!isFinished ? (
          <div className="w-full flex flex-col space-y-3">
            <div className="flex items-center justify-center space-x-3">
              {/* Reset */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setTimeLeft(TOTAL_SECONDS);
                  setIsRunning(false);
                }}
                title="Reset to 20:00"
                className="p-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 transition-all"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              {/* Play / Pause */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsRunning(!isRunning);
                }}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-glow transition-all active:scale-95 text-base"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Resume</span>
                  </>
                )}
              </button>

              {/* Fast-forward for instant testing */}
              <button
                onClick={() => {
                  sounds.playClick();
                  handleFinishEarly();
                }}
                title="Fast forward / finish sprint now"
                className="p-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 transition-all"
              >
                <FastForward className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[11px] text-stone-400">
              Tip: Give this 20 minutes of honest attention without tabs or distractions.
            </p>
          </div>
        ) : (
          <div className="w-full flex flex-col space-y-3 animate-fadeIn">
            <p className="text-sm text-stone-300">
              Outstanding work! You broke the inertia. Ready to record this revival session?
            </p>
            <button
              onClick={handleClaimSuccess}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-lg transition-all active:scale-95"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Record Revival & Move to Active</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
