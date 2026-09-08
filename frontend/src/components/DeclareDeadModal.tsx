import { useState, useEffect } from 'react';
import { Skull, Bell, X, HeartCrack } from 'lucide-react';
import type { AbandonedItem } from '../types';
import { sounds } from '../utils/audio';

interface DeclareDeadModalProps {
  isOpen: boolean;
  item: AbandonedItem | null;
  onClose: () => void;
  onConfirm: (item: AbandonedItem, epitaph: string) => void;
}

const WITTY_EPITAPHS: Record<string, string[]> = {
  'Book': [
    'Life is simply too short for 800-page fantasy political treaties.',
    'It was not me; it was the prose.',
    'Rest in peace on page 142. You will never see chapter 15.',
    'I accepted that I am never reading footnote 74.',
  ],
  'Movie/Show': [
    'Season 1 was lightning in a bottle. Season 3 was an electric bill.',
    'I choose to believe the story ended happily right where I paused.',
    'Too many plot twists, too little dopamine.',
    'May the streaming algorithm bury you deep in the recommendations.'
  ],
  'Game': [
    'The boss won. I value my sanity more than the achievement trophy.',
    'My reflexes peaked in 2018 and I have made peace with this.',
    'Left sitting in the inventory forever with 99 health potions.',
    'Another side-quest victim that lost the main storyline.'
  ],
  'Side Project / Idea': [
    'Replaced by an even shinier project before reaching production.',
    'The Docker container has been spun down into eternity.',
    'Good architecture in Figma. Too exhausting in code.',
    'May your Git branch rest undisturbed in origin/stale.'
  ],
  'Course / Tutorial': [
    'The certificate of completion was purely imaginary anyway.',
    'I learned enough to know I don’t want to do this.',
    'Paused at video 14 of 98. A heroic effort nonetheless.'
  ],
  'Other': [
    'Here lies good intentions, buried under realistic life priorities.',
    'Closed with love and zero residual guilt.',
    'Gone from my to-do list, freed from my soul.'
  ]
};

export const DeclareDeadModal = ({
  isOpen,
  item,
  onClose,
  onConfirm,
}: DeclareDeadModalProps) => {
  const [epitaph, setEpitaph] = useState('');
  const [isTolling, setIsTolling] = useState(false);

  useEffect(() => {
    if (item) {
      // Pick a random starter witty suggestion
      const suggestions = WITTY_EPITAPHS[item.category] || WITTY_EPITAPHS['Other'];
      const randomSugg = suggestions[Math.floor(Math.random() * suggestions.length)];
      setEpitaph(randomSugg);
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handleConfirm = () => {
    setIsTolling(true);
    sounds.playFuneralBell();

    setTimeout(() => {
      onConfirm(item, epitaph.trim() || 'Rest in peace. Let go with peace of mind.');
      setIsTolling(false);
      onClose();
    }, 1100);
  };

  const suggestions = WITTY_EPITAPHS[item.category] || WITTY_EPITAPHS['Other'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-[#161514] border border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Memorial Header */}
        <div className="relative px-6 py-5 border-b border-stone-800/80 flex items-center justify-between bg-stone-900/60">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl bg-stone-800 border border-stone-700/60 flex items-center justify-center text-stone-300 ${isTolling ? 'animate-bell text-amber-400' : ''}`}>
              <Skull className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif text-lg font-bold text-stone-100">
                  Declare Officially Dead
                </h2>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-stone-800 text-stone-400 border border-stone-700">
                  Closure
                </span>
              </div>
              <p className="text-xs text-stone-400">
                A memorial service for your unfinished ambitions
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-stone-900/80 border border-stone-800">
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
              Deceased Item
            </span>
            <div className="font-serif text-base font-semibold text-stone-200">
              {item.title}
            </div>
            <div className="text-xs text-stone-400 mt-0.5">
              Paused at: <span className="text-stone-300 font-mono">{item.droppedAt}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400">
                Write a 1-Sentence Eulogy / Epitaph
              </label>
              <span className="text-[11px] text-stone-400 italic">Honest or funny</span>
            </div>
            
            <textarea
              rows={3}
              value={epitaph}
              onChange={(e) => setEpitaph(e.target.value)}
              placeholder="e.g. Life is too short for 800-page fantasy politics..."
              className="w-full bg-stone-900/90 border border-stone-800 focus:border-stone-600 rounded-xl p-3 text-sm text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-600 transition-colors resize-none font-serif italic"
            />
          </div>

          {/* Quick Suggestions */}
          <div>
            <span className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5 font-medium">
              Epitaph Inspiration:
            </span>
            <div className="space-y-1.5">
              {suggestions.slice(0, 3).map((sugg, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    sounds.playClick();
                    setEpitaph(sugg);
                  }}
                  className="w-full text-left text-xs p-2 rounded-lg bg-stone-900/40 hover:bg-stone-800/80 border border-stone-800/60 hover:border-stone-700 text-stone-400 hover:text-stone-200 transition-all font-serif italic"
                >
                  “{sugg}”
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 border-t border-stone-800/80 bg-stone-900/30 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs text-stone-400">
            <HeartCrack className="w-3.5 h-3.5 text-red-400/80" />
            <span>Removes guilt permanently</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
            >
              Nevermind
            </button>
            <button
              type="button"
              disabled={isTolling}
              onClick={handleConfirm}
              className="flex items-center space-x-2 px-5 py-2 rounded-xl text-sm font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 shadow-md transition-all active:scale-95"
            >
              <Bell className={`w-4 h-4 ${isTolling ? 'animate-bell text-amber-400' : 'text-stone-400'}`} />
              <span>{isTolling ? 'Tolling the Bell...' : 'Send to Graveyard'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
