import { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  HelpCircle, 
  Flame, 
  Skull, 
  CheckCircle2, 
  MoreVertical, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import type { AbandonedItem } from '../types';
import { calculateDaysLingering } from '../utils/storage';
import { CategoryIcon, getCategoryColor } from './CategoryIcon';
import { sounds } from '../utils/audio';

interface ItemCardProps {
  item: AbandonedItem;
  onRevive: (item: AbandonedItem) => void;
  onDeclareDead: (item: AbandonedItem) => void;
  onComplete: (item: AbandonedItem) => void;
  onEdit: (item: AbandonedItem) => void;
  onDelete: (id: string) => void;
}

export const ItemCard = ({
  item,
  onRevive,
  onDeclareDead,
  onComplete,
  onEdit,
  onDelete,
}: ItemCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const daysLingering = calculateDaysLingering(item.dateAdded);
  const colorToken = getCategoryColor(item.category);

  return (
    <div className="relative group rounded-2xl bg-[#161514] border border-stone-800/90 hover:border-stone-700/80 p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between">
      
      {/* Top Meta Bar */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          {/* Category Pill */}
          <span 
            className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colorToken.bg} ${colorToken.text} ${colorToken.border}`}
          >
            <CategoryIcon category={item.category} className="w-3.5 h-3.5" />
            <span>{item.category}</span>
          </span>

          <div className="flex items-center space-x-1.5">
            {/* Revival Status Badge */}
            {item.status === 'Reviving' && (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/50">
                <Flame className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                <span>Reviving</span>
              </span>
            )}

            {/* Lingering Tag */}
            <span 
              title={`Added ${new Date(item.dateAdded).toLocaleDateString()}`}
              className="inline-flex items-center space-x-1 text-xs font-mono text-stone-400 bg-stone-900/80 px-2 py-0.5 rounded-md border border-stone-800"
            >
              <Clock className="w-3 h-3 text-amber-500/70" />
              <span>{daysLingering}d in limbo</span>
            </span>

            {/* Context Menu Toggle */}
            <div className="relative">
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowMenu(!showMenu);
                }}
                className="p-1 rounded-md text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
                title="More options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-20" 
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 mt-1 w-44 rounded-xl bg-stone-900 border border-stone-800 shadow-xl z-30 py-1.5 text-xs text-stone-300">
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onEdit(item);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-stone-800/80 transition-colors flex items-center space-x-2"
                    >
                      <span>Edit Item</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onComplete(item);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-emerald-950/50 text-emerald-400 transition-colors flex items-center space-x-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Finished Accidentally</span>
                    </button>
                    <div className="h-px bg-stone-800 my-1" />
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onDelete(item.id);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-red-950/40 text-red-400 transition-colors flex items-center space-x-2"
                    >
                      <span>Delete from existence</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-serif text-lg font-semibold text-stone-100 line-clamp-2 mb-3 leading-snug group-hover:text-amber-200 transition-colors">
          {item.title}
        </h3>

        {/* Details: Stopped At & Abandon Reason */}
        <div className="space-y-2 mb-4 text-xs">
          <div className="flex items-start space-x-2 text-stone-300">
            <MapPin className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
            <span className="font-mono bg-stone-900/60 px-1.5 py-0.5 rounded text-stone-300 border border-stone-800/60">
              {item.droppedAt}
            </span>
          </div>

          <div className="flex items-start space-x-2 text-stone-400 italic">
            <HelpCircle className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0 not-italic" />
            <span className="line-clamp-2">“{item.abandonReason}”</span>
          </div>
        </div>
      </div>

      {/* Footer & Primary Actions */}
      <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between">
        
        {/* Streak / Revival Counter */}
        <div className="flex items-center text-xs text-stone-400">
          {item.streakOrRevivalCount > 0 ? (
            <span className="inline-flex items-center space-x-1 font-mono text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/40">
              <Sparkles className="w-3 h-3" />
              <span>{item.streakOrRevivalCount} revival{item.streakOrRevivalCount > 1 ? 's' : ''}</span>
            </span>
          ) : (
            <span className="text-[11px] text-stone-400 font-mono">0 revivals</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Quick Revive / 20-min session */}
          <button
            onClick={() => {
              sounds.playClick();
              onRevive(item);
            }}
            title="Start a 20-minute revival session"
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:border-amber-400/50 transition-all active:scale-95"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Revive</span>
          </button>

          {/* Declare Dead */}
          <button
            onClick={() => {
              onDeclareDead(item);
            }}
            title="Officially declare dead with a eulogy"
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 hover:border-stone-700 transition-all active:scale-95"
          >
            <Skull className="w-3 h-3" />
            <span className="hidden sm:inline">Dead</span>
          </button>
        </div>

      </div>

    </div>
  );
};
