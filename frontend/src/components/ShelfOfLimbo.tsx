import { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  BookOpen, 
  Ghost,
  Flame,
  Trash2,
  Plus
} from 'lucide-react';
import type { AbandonedItem, FilterCategory, SortOption } from '../types';
import { ItemCard } from './ItemCard';
import { calculateDaysLingering } from '../utils/storage';
import { sounds } from '../utils/audio';

interface ShelfOfLimboProps {
  items: AbandonedItem[];
  onOpenAddItem: () => void;
  onOpenReckoning: () => void;
  onRevive: (item: AbandonedItem) => void;
  onDeclareDead: (item: AbandonedItem) => void;
  onComplete: (item: AbandonedItem) => void;
  onEdit: (item: AbandonedItem) => void;
  onDelete: (id: string) => void;
  onOpenClearAll?: () => void;
}

const CATEGORY_TABS: { id: FilterCategory; label: string }[] = [
  { id: 'All', label: 'All Unfinished' },
  { id: 'Book', label: 'Books' },
  { id: 'Movie/Show', label: 'Shows & Movies' },
  { id: 'Game', label: 'Games' },
  { id: 'Side Project / Idea', label: 'Side Projects' },
  { id: 'Course / Tutorial', label: 'Courses' },
  { id: 'Reviving', label: '🔥 Active Revivals' },
];

export const ShelfOfLimbo = ({
  items,
  onOpenAddItem,
  onOpenReckoning,
  onRevive,
  onDeclareDead,
  onComplete,
  onEdit,
  onDelete,
  onOpenClearAll,
}: ShelfOfLimboProps) => {
  const [activeTab, setActiveTab] = useState<FilterCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('linger-desc');

  // Filter items in Limbo or Reviving (not dead or completed)
  const activeItems = useMemo(() => {
    return items.filter((item) => item.status === 'In Limbo' || item.status === 'Reviving');
  }, [items]);

  const filteredAndSortedItems = useMemo(() => {
    return activeItems
      .filter((item) => {
        // Tab filter
        if (activeTab === 'Reviving') {
          if (item.status !== 'Reviving') return false;
        } else if (activeTab !== 'All') {
          if (item.category !== activeTab) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchLocation = item.droppedAt.toLowerCase().includes(q);
          const matchReason = item.abandonReason.toLowerCase().includes(q);
          if (!matchTitle && !matchLocation && !matchReason) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'linger-desc':
            return b.dateAdded - a.dateAdded ? a.dateAdded - b.dateAdded : 0; // older dateAdded = higher lingering days
          case 'linger-asc':
            return b.dateAdded - a.dateAdded; // newer = fewer days
          case 'date-desc':
            return b.dateAdded - a.dateAdded;
          case 'title-asc':
            return a.title.localeCompare(b.title);
          case 'revivals-desc':
            return b.streakOrRevivalCount - a.streakOrRevivalCount;
          default:
            return 0;
        }
      });
  }, [activeItems, activeTab, searchQuery, sortBy]);

  // Quick summary counts
  const revivingCount = activeItems.filter(i => i.status === 'Reviving').length;
  const limboCount = activeItems.filter(i => i.status === 'In Limbo').length;
  const longestDays = activeItems.reduce((max, i) => {
    const d = calculateDaysLingering(i.dateAdded);
    return d > max ? d : max;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7 animate-fadeIn">
      
      {/* Editorial Hero Header & Stats Strip */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-2 border-b border-stone-800/80">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 tracking-wider uppercase mb-1.5">
            <Ghost className="w-3.5 h-3.5" />
            <span>Honoring The Stalled Queue</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-100 tracking-tight">
            The Shelf of Limbo
          </h1>
          <p className="text-sm text-stone-400 mt-1 max-w-2xl">
            A sanctuary for what you paused, stalled, or abandoned midway. No shame. Pick it back up for 20 minutes, or let it go forever.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Add Item Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenAddItem();
            }}
            title="Add an unfinished book, game, show, or project"
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 hover:text-amber-300 transition-all active:scale-95 shadow-sm"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add Item</span>
          </button>

          {/* Sunday Reckoning Hero trigger */}
          <button
            onClick={() => {
              sounds.playShuffle();
              onOpenReckoning();
            }}
            title="Face a random stalled item"
            className="flex items-center space-x-2 px-3.5 py-2.5 rounded-2xl text-xs font-semibold bg-gradient-to-r from-amber-600/30 to-amber-900/40 hover:from-amber-600/40 hover:to-amber-900/50 border border-amber-500/40 text-amber-300 transition-all active:scale-95 shadow-glow"
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Face the Past</span>
          </button>

          {/* Hero Quick Insights Pill Box */}
          <div className="flex items-center space-x-3 text-xs bg-stone-900/80 border border-stone-800 p-2.5 rounded-2xl shrink-0">
            <div className="px-3 py-1 border-r border-stone-800 text-center">
              <span className="block font-mono text-lg font-bold text-stone-200">{limboCount}</span>
              <span className="text-[11px] text-stone-400">In Limbo</span>
            </div>
            <div className="px-3 py-1 border-r border-stone-800 text-center">
              <span className="block font-mono text-lg font-bold text-emerald-400">{revivingCount}</span>
              <span className="text-[11px] text-stone-400">Reviving</span>
            </div>
            <div className="px-3 py-1 text-center">
              <span className="block font-mono text-lg font-bold text-amber-400">{longestDays}d</span>
              <span className="text-[11px] text-stone-400">Max Lingering</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs, Search Bar, and Sort Controls */}
      <div className="space-y-4">
        
        {/* Category Filter Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveTab(tab.id);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50 shadow-sm font-semibold'
                    : 'bg-stone-900/60 text-stone-400 border border-stone-800/80 hover:bg-stone-800 hover:text-stone-200'
                }`}
              >
                <span>{tab.label}</span>
                {tab.id === 'All' && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-stone-800 font-mono text-stone-300">
                    {activeItems.length}
                  </span>
                )}
                {tab.id === 'Reviving' && revivingCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-950 text-emerald-400 font-mono">
                    {revivingCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Input & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, location dropped, or reason..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900/90 border border-stone-800 text-sm text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>

          <div className="flex items-center space-x-3 self-end sm:self-auto">
            <div className="flex items-center space-x-2 text-xs text-stone-400">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => {
                sounds.playClick();
                setSortBy(e.target.value as SortOption);
              }}
              className="bg-stone-900/90 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-stone-600 transition-colors cursor-pointer"
            >
              <option value="linger-desc">Longest in limbo first</option>
              <option value="linger-asc">Recently stalled first</option>
              <option value="date-desc">Newest added</option>
              <option value="title-asc">Title (A - Z)</option>
              <option value="revivals-desc">Most revival sessions</option>
            </select>

            {/* Clear All action button */}
            {items.length > 0 && onOpenClearAll && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenClearAll();
                }}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs text-stone-400 hover:text-red-400 bg-stone-900/60 hover:bg-red-950/30 border border-stone-800/80 hover:border-red-900/50 transition-all"
                title="Delete all items / wipe library"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Delete All</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Grid of Cards */}
      {filteredAndSortedItems.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center bg-stone-900/20 border border-dashed border-stone-800 rounded-3xl p-8">
          <div className="w-16 h-16 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-400/80 mb-4">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-200 mb-1">
            No Abandoned Items Found
          </h3>
          <p className="text-sm text-stone-400 max-w-sm mb-6">
            {searchQuery
              ? `No items matching "${searchQuery}". Try adjusting your filters.`
              : activeTab !== 'All'
              ? `No stalled items in "${activeTab}". Clean slate here!`
              : 'Your shelf of limbo is clean and clear. No stalled ghosts haunting your mind.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                onOpenAddItem();
              }}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 transition-all shadow-glow active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Item</span>
            </button>

            {activeItems.length > 0 && (
              <button
                onClick={() => {
                  setActiveTab('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-stone-300 bg-stone-800 hover:bg-stone-700 border border-stone-700 transition-all"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onRevive={onRevive}
              onDeclareDead={onDeclareDead}
              onComplete={onComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

    </div>
  );
};
