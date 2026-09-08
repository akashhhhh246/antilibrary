import { 
  Skull, 
  Volume2, 
  VolumeX, 
  Library, 
  Flame,
  Trash2,
  Plus
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface NavbarProps {
  currentView: 'limbo' | 'eulogy' | 'stats';
  setCurrentView: (view: 'limbo' | 'eulogy' | 'stats') => void;
  onOpenAddItem: () => void;
  onOpenReckoning: () => void;
  onOpenClearAll: () => void;
  limboCount: number;
  deadCount: number;
  totalCount: number;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export const Navbar = ({
  currentView,
  setCurrentView,
  onOpenAddItem,
  onOpenReckoning,
  onOpenClearAll,
  limboCount,
  deadCount,
  totalCount,
  soundEnabled,
  setSoundEnabled,
}: NavbarProps) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setSoundEnabled(next);
    if (next) sounds.playClick();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-800/80 bg-[#0e0d0c]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Philosophy Subtext */}
          <div 
            onClick={() => { setCurrentView('limbo'); sounds.playClick(); }}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600/30 to-amber-950/50 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:border-amber-400 transition-colors shadow-glow">
              <Library className="w-5 h-5 transition-transform group-hover:scale-110" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif text-2xl font-bold tracking-tight text-stone-100 group-hover:text-amber-300 transition-colors">
                  Anti-Library
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-stone-800 text-stone-400 border border-stone-700/60">
                  Unfinished
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block">
                Celebrating what you abandon, stall, or guiltlessly drop
              </p>
            </div>
          </div>

          {/* Navigation Views */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-stone-900/90 p-1.5 rounded-xl border border-stone-800">
            <button
              onClick={() => { setCurrentView('limbo'); sounds.playClick(); }}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentView === 'limbo'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
              }`}
            >
              <Library className="w-4 h-4" />
              <span>Shelf of Limbo</span>
              {limboCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-xs font-mono rounded-full bg-stone-800 text-amber-400/90 border border-stone-700">
                  {limboCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { setCurrentView('eulogy'); sounds.playClick(); }}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentView === 'eulogy'
                  ? 'bg-stone-800 text-stone-200 border border-stone-700 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
              }`}
            >
              <Skull className="w-4 h-4 text-stone-400" />
              <span>Eulogy Room</span>
              {deadCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-xs font-mono rounded-full bg-stone-800 text-stone-400 border border-stone-700">
                  {deadCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
              className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800/80 rounded-lg transition-colors border border-transparent hover:border-stone-700"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
            </button>

            {/* Add Item Button */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenAddItem();
              }}
              title="Add a new abandoned book, show, game, or project"
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-medium bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700/80 hover:border-amber-500/50 hover:text-amber-300 transition-all active:scale-95 shadow-sm"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span className="font-sans">Add Item</span>
            </button>

            {/* Sunday Reckoning Hero Button */}
            <button
              onClick={() => {
                sounds.playShuffle();
                onOpenReckoning();
              }}
              title="Draw a random stalled item and face it today"
              className="relative group flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-600/90 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 shadow-glow transition-all transform active:scale-95"
            >
              <Flame className="w-4 h-4 animate-bounce" />
              <span className="hidden md:inline font-sans">Face the Past</span>
              <span className="md:hidden">Face</span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            </button>

            {/* Clear Entire Library */}
            {totalCount > 0 && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenClearAll();
                }}
                title="Delete all items / clear entire library"
                className="p-2 text-stone-400 hover:text-red-400 hover:bg-red-950/40 rounded-xl transition-all border border-transparent hover:border-red-900/50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
