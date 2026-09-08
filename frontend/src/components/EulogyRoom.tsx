import { useState } from 'react';
import { 
  Skull, 
  RotateCcw, 
  Trash2, 
  Calendar, 
  Search, 
  Quote
} from 'lucide-react';
import type { AbandonedItem } from '../types';
import { CategoryIcon, getCategoryColor } from './CategoryIcon';
import { sounds } from '../utils/audio';

interface EulogyRoomProps {
  deadItems: AbandonedItem[];
  totalHoursReclaimed: number;
  onResurrect: (item: AbandonedItem) => void;
  onDelete: (id: string) => void;
  onSwitchToLimbo: () => void;
}

export const EulogyRoom = ({
  deadItems,
  totalHoursReclaimed,
  onResurrect,
  onDelete,
  onSwitchToLimbo,
}: EulogyRoomProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredItems = deadItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.deathEpitaph && item.deathEpitaph.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Hero Celebratory Metric Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-[#181615] to-stone-900 border border-stone-800 p-8 shadow-tombstone">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-5 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-stone-800/90 border border-stone-700/80 flex items-center justify-center text-stone-300 shrink-0 shadow-lg">
              <Skull className="w-8 h-8 text-amber-500/80" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono bg-stone-800 text-stone-400 border border-stone-700 mb-2">
                <span>The Graveyard of Closure</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-100 tracking-tight">
                The Eulogy Room
              </h1>
              <p className="text-sm text-stone-400 max-w-xl mt-1">
                Where abandoned goals receive an honorable discharge. No guilt, no unfinished shame — only liberated mental bandwidth.
              </p>
            </div>
          </div>

          {/* Guilt Reclaimed Counter */}
          <div className="flex flex-col items-center md:items-end justify-center bg-stone-950/60 border border-stone-800/80 rounded-2xl px-6 py-4 min-w-[240px]">
            <div className="flex items-baseline space-x-2">
              <span className="font-mono text-4xl sm:text-5xl font-bold text-amber-400">
                ~{totalHoursReclaimed}
              </span>
              <span className="text-sm font-semibold text-stone-300">hours</span>
            </div>
            <p className="text-xs text-stone-400 text-center md:text-right mt-1">
              of mental guilt reclaimed across <span className="font-mono text-stone-200 font-semibold">{deadItems.length}</span> laid-to-rest items.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search epitaphs or titles in the graveyard..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900/90 border border-stone-800 text-sm text-stone-200 placeholder-stone-400 focus:outline-none focus:border-stone-600 transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Book', 'Movie/Show', 'Game', 'Side Project / Idea', 'Course / Tutorial'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sounds.playClick();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-stone-800 text-stone-100 border border-stone-600 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Memorial Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 mb-3">
            <Skull className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-xl font-semibold text-stone-300">
            The Graveyard is Silent
          </h3>
          <p className="text-sm text-stone-400 max-w-sm mt-1">
            {deadItems.length === 0 
              ? 'You haven’t officially buried any items yet. When you decide to let go of an unfinished item, give it closure here.'
              : 'No gravestones matched your search query.'}
          </p>
          {deadItems.length === 0 && (
            <button
              onClick={onSwitchToLimbo}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-all"
            >
              Browse Shelf of Limbo
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const colorToken = getCategoryColor(item.category);
            return (
              <div 
                key={item.id}
                className="group relative rounded-2xl bg-gradient-to-b from-[#1c1a19] to-[#141312] border border-stone-800/90 hover:border-stone-700 p-6 flex flex-col justify-between shadow-tombstone transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  {/* Tombstone header with category & RIP date */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colorToken.bg} ${colorToken.text} ${colorToken.border}`}>
                      <CategoryIcon category={item.category} className="w-3.5 h-3.5" />
                      <span>{item.category}</span>
                    </span>

                    <span className="flex items-center space-x-1 text-[11px] font-mono text-stone-400">
                      <Calendar className="w-3 h-3" />
                      <span>RIP {new Date(item.lastInteractedAt || item.dateAdded).toLocaleDateString()}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-xl font-bold text-stone-200 group-hover:text-stone-100 transition-colors mb-3 line-clamp-2">
                    {item.title}
                  </h3>

                  {/* Dropped at */}
                  <div className="text-xs text-stone-400 font-mono mb-4 bg-stone-950/40 px-2 py-1 rounded border border-stone-900">
                    Ceased at: <span className="text-stone-300">{item.droppedAt}</span>
                  </div>

                  {/* Epitaph Box */}
                  <div className="relative bg-stone-900/70 border border-stone-800/80 rounded-xl p-4 mb-4">
                    <Quote className="w-4 h-4 text-amber-500/40 absolute top-2 right-2" />
                    <p className="font-serif italic text-sm text-stone-300 leading-relaxed">
                      “{item.deathEpitaph || 'Rest in peace. Let go with peace of mind.'}”
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-stone-800/60 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onResurrect(item);
                    }}
                    title="Resurrect back to Shelf of Limbo"
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-stone-400 hover:text-amber-300 hover:bg-stone-800/80 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Resurrect</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      onDelete(item.id);
                    }}
                    title="Delete permanently"
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-400 hover:bg-stone-800/80 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
