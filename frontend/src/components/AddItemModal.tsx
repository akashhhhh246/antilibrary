import { useState } from 'react';
import type { FormEvent } from 'react';
import { X, PlusCircle, Sparkles } from 'lucide-react';
import type { Category } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { sounds } from '../utils/audio';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (itemData: {
    title: string;
    category: Category;
    droppedAt: string;
    abandonReason: string;
    daysAgo?: number;
  }) => void;
}

const CATEGORIES: Category[] = [
  'Book',
  'Movie/Show',
  'Game',
  'Side Project / Idea',
  'Course / Tutorial',
  'Other'
];

const PRESET_REASONS = [
  'Lost interest / boredom',
  'Pacing dragged',
  'Life got busy',
  'Too difficult / got stuck',
  'Shiny object syndrome',
  'Existential fatigue',
  'Too much exposition',
  'Lost save / config hell'
];

const PLACEHOLDER_LOCATIONS: Record<Category, string> = {
  'Book': 'e.g., Page 142, Chapter 6, 40% in',
  'Movie/Show': 'e.g., Season 2 Episode 4, 35 min in',
  'Game': 'e.g., Boss fight #4, 15 hours in',
  'Side Project / Idea': 'e.g., Database schema setup, Auth flow',
  'Course / Tutorial': 'e.g., Module 3: Recursion',
  'Other': 'e.g., Step 3, halfway through'
};

export const AddItemModal = ({
  isOpen,
  onClose,
  onAdd
}: AddItemModalProps) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Book');
  const [droppedAt, setDroppedAt] = useState('');
  const [abandonReason, setAbandonReason] = useState('');
  const [daysAgo, setDaysAgo] = useState<number>(0);
  const [errors, setErrors] = useState<{ title?: string; droppedAt?: string }>({});

  if (!isOpen) return null;

  const resetForm = () => {
    setTitle('');
    setCategory('Book');
    setDroppedAt('');
    setAbandonReason('');
    setDaysAgo(0);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; droppedAt?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!droppedAt.trim()) {
      newErrors.droppedAt = 'Location dropped is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    sounds.playClick();
    onAdd({
      title: title.trim(),
      category,
      droppedAt: droppedAt.trim(),
      abandonReason: abandonReason.trim() || 'No specific reason given',
      daysAgo: daysAgo > 0 ? daysAgo : 0
    });

    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-[#161514] border border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-800/80 flex items-center justify-between bg-stone-900/40">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-100">
                Add Abandoned Item
              </h2>
              <p className="text-xs text-stone-400">
                Acknowledge what you paused or stalled without the guilt
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-300 mb-1.5">
              Title / Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="e.g. War and Peace, Cyberpunk 2077, Golang CLI..."
              className={`w-full px-3.5 py-2.5 rounded-xl bg-stone-900/90 border text-sm text-stone-200 placeholder-stone-500 focus:outline-none transition-colors ${
                errors.title 
                  ? 'border-red-500/60 focus:border-red-500' 
                  : 'border-stone-800 focus:border-amber-500/60'
              }`}
              autoFocus
            />
            {errors.title && (
              <p className="text-xs text-red-400 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-300 mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setCategory(cat);
                    }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                        : 'bg-stone-900/50 text-stone-400 border-stone-800 hover:bg-stone-800/80 hover:text-stone-300'
                    }`}
                  >
                    <CategoryIcon category={cat} className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dropped At / Location */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-300 mb-1.5">
              Where Did You Stop? <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={droppedAt}
              onChange={(e) => {
                setDroppedAt(e.target.value);
                if (errors.droppedAt) setErrors((prev) => ({ ...prev, droppedAt: undefined }));
              }}
              placeholder={PLACEHOLDER_LOCATIONS[category]}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-stone-900/90 border text-sm text-stone-200 placeholder-stone-500 focus:outline-none transition-colors ${
                errors.droppedAt 
                  ? 'border-red-500/60 focus:border-red-500' 
                  : 'border-stone-800 focus:border-amber-500/60'
              }`}
            />
            {errors.droppedAt && (
              <p className="text-xs text-red-400 mt-1">{errors.droppedAt}</p>
            )}
          </div>

          {/* Reason */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-300">
                Why Did You Abandon / Pause It?
              </label>
              <span className="text-[11px] text-stone-500">Optional</span>
            </div>

            {/* Quick Reason Pills */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {PRESET_REASONS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setAbandonReason(preset);
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    abandonReason === preset
                      ? 'bg-stone-800 text-amber-300 border-amber-500/40'
                      : 'bg-stone-900/40 text-stone-400 border-stone-800/80 hover:bg-stone-800 hover:text-stone-300'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            <textarea
              rows={2}
              value={abandonReason}
              onChange={(e) => setAbandonReason(e.target.value)}
              placeholder="e.g. Chapter 4 turned into a boring textbook, or found a better tool..."
              className="w-full px-3.5 py-2 rounded-xl bg-stone-900/90 border border-stone-800 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/60 transition-colors resize-none"
            />
          </div>

          {/* How long ago was it abandoned? */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-300">
                Roughly how many days has it lingered?
              </label>
              <span className="text-xs font-mono text-amber-400">
                {daysAgo === 0 ? 'Just recently (0 days)' : `${daysAgo} days ago`}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {[0, 7, 30, 90, 180].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setDaysAgo(d);
                  }}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                    daysAgo === d
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-semibold'
                      : 'bg-stone-900/60 text-stone-400 border-stone-800 hover:bg-stone-800'
                  }`}
                >
                  {d === 0 ? 'Today' : `${d}d`}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-stone-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-medium text-stone-400 hover:text-stone-200 hover:bg-stone-800/80 rounded-xl transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 transition-all shadow-glow active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Add to Shelf of Limbo</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
