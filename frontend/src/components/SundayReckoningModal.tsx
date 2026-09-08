import { useState, useEffect } from 'react';
import { 
  Flame, 
  Skull, 
  Shuffle, 
  Clock, 
  X,
  CheckCircle2
} from 'lucide-react';
import type { AbandonedItem } from '../types';
import { calculateDaysLingering } from '../utils/storage';
import { CategoryIcon, getCategoryColor } from './CategoryIcon';
import { sounds } from '../utils/audio';

interface SundayReckoningModalProps {
  isOpen: boolean;
  limboItems: AbandonedItem[];
  onClose: () => void;
  onStartRevival: (item: AbandonedItem) => void;
  onDeclareDead: (item: AbandonedItem) => void;
}

export const SundayReckoningModal = ({
  isOpen,
  limboItems,
  onClose,
  onStartRevival,
  onDeclareDead,
}: SundayReckoningModalProps) => {
  const [selectedItem, setSelectedItem] = useState<AbandonedItem | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);

  // Pick random item on opening
  useEffect(() => {
    if (isOpen && limboItems.length > 0) {
      drawRandomItem();
    } else if (isOpen && limboItems.length === 0) {
      setSelectedItem(null);
    }
  }, [isOpen, limboItems.length]);

  const drawRandomItem = () => {
    if (limboItems.length === 0) return;
    setIsShuffling(true);
    sounds.playShuffle();

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * limboItems.length);
      setSelectedItem(limboItems[randomIndex]);
      setIsShuffling(false);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-[#141312] border border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background ambient lighting */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-amber-600/15 via-transparent to-transparent pointer-events-none" />

        {/* Top Header */}
        <div className="relative px-6 py-5 border-b border-stone-800/70 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/30 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-glow">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif text-xl font-bold text-stone-100">
                  The Sunday Reckoning
                </h2>
                <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Face the Past
                </span>
              </div>
              <p className="text-xs text-stone-400">
                One stalled item pulled from the depths of your unfinished queue.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Center Card Deck */}
        <div className="p-8 flex flex-col items-center text-center">
          {limboItems.length === 0 || !selectedItem ? (
            <div className="py-12 flex flex-col items-center">
              <div className="w-16 h-16 rounded-3xl bg-stone-900 border border-stone-800 flex items-center justify-center text-emerald-400 mb-4 shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-100 mb-2">
                Your Shelf of Limbo is Clean!
              </h3>
              <p className="text-sm text-stone-400 max-w-md">
                No lingering ghosts or stalled projects are haunting your mind right now. Enjoy your mental freedom or dump new clutter whenever you stall next.
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2.5 rounded-xl text-sm font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700"
              >
                Close Reckoning
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              
              {/* Question Banner */}
              <div className="mb-6">
                <span className="text-xs font-mono tracking-widest text-amber-400/90 uppercase block mb-1">
                  The Inevitable Question
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100 max-w-lg leading-tight">
                  Will you give this 20 minutes today, or officially declare it dead?
                </h3>
              </div>

              {/* The Stalled Item Featured Card */}
              <div 
                className={`w-full max-w-lg rounded-2xl bg-[#1a1817] border border-stone-700/80 p-6 text-left shadow-2xl transition-all duration-300 relative ${
                  isShuffling ? 'scale-95 opacity-50 blur-[1px]' : 'scale-100 opacity-100'
                }`}
              >
                {/* Category & Lingering Badge */}
                <div className="flex items-center justify-between mb-3">
                  {(() => {
                    const colorToken = getCategoryColor(selectedItem.category);
                    return (
                      <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border ${colorToken.bg} ${colorToken.text} ${colorToken.border}`}>
                        <CategoryIcon category={selectedItem.category} className="w-3.5 h-3.5" />
                        <span>{selectedItem.category}</span>
                      </span>
                    );
                  })()}

                  <span className="flex items-center space-x-1.5 text-xs font-mono text-amber-400/90 bg-amber-950/40 border border-amber-800/40 px-2.5 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Lingering for {calculateDaysLingering(selectedItem.dateAdded)} days</span>
                  </span>
                </div>

                {/* Title */}
                <h4 className="font-serif text-2xl font-bold text-stone-100 mb-3 leading-snug">
                  {selectedItem.title}
                </h4>

                {/* Meta location & reason */}
                <div className="space-y-2 text-xs bg-stone-900/80 rounded-xl p-3 border border-stone-800">
                  <div className="flex items-start space-x-2 text-stone-300">
                    <span className="text-stone-400 font-semibold uppercase tracking-wider shrink-0">Stopped At:</span>
                    <span className="font-mono text-amber-200">{selectedItem.droppedAt}</span>
                  </div>
                  <div className="flex items-start space-x-2 text-stone-400 italic">
                    <span className="text-stone-400 font-semibold uppercase tracking-wider not-italic shrink-0">Reason:</span>
                    <span>“{selectedItem.abandonReason}”</span>
                  </div>
                </div>
              </div>

              {/* The Three Actionable Paths */}
              <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                
                {/* Path 1: 20-Min Revival */}
                <button
                  onClick={() => {
                    onClose();
                    onStartRevival(selectedItem);
                  }}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-amber-500/20 to-amber-900/30 border border-amber-500/50 hover:border-amber-400 text-stone-100 hover:text-white transition-all shadow-glow hover:scale-[1.02] active:scale-95 text-center group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="font-serif font-bold text-base text-amber-300">
                    Start 20-Min Revival
                  </span>
                  <span className="text-[11px] text-stone-400 mt-1">
                    Visual focus countdown timer
                  </span>
                </button>

                {/* Path 2: Declare Officially Dead */}
                <button
                  onClick={() => {
                    onClose();
                    onDeclareDead(selectedItem);
                  }}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-stone-100 transition-all hover:scale-[1.02] active:scale-95 text-center group"
                >
                  <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-stone-400 mb-2 group-hover:scale-110 group-hover:text-stone-200 transition-transform">
                    <Skull className="w-5 h-5" />
                  </div>
                  <span className="font-serif font-bold text-base text-stone-200">
                    Declare Officially Dead
                  </span>
                  <span className="text-[11px] text-stone-400 mt-1">
                    Write epitaph & gain closure
                  </span>
                </button>

              </div>

              {/* Path 3: Snooze / Pass */}
              <div className="mt-5 flex items-center space-x-3">
                <button
                  onClick={drawRandomItem}
                  disabled={isShuffling || limboItems.length <= 1}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium text-stone-400 hover:text-stone-200 bg-stone-900/60 hover:bg-stone-800 border border-stone-800/80 transition-all active:scale-95 disabled:opacity-50"
                >
                  <Shuffle className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin' : ''}`} />
                  <span>Draw Another Stalled Ghost</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    onClose();
                  }}
                  className="text-xs text-stone-400 hover:text-stone-300 underline underline-offset-4"
                >
                  Snooze / Put back on shelf
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
